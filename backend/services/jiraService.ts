// This is a scaffold for connecting to Jira and fetching ticket information.
// Replace placeholders with real credentials and API integration logic.

import axios from 'axios';

const JIRA_BASE_URL = process.env.JIRA_BASE_URL || 'https://your-domain.atlassian.net';
const JIRA_EMAIL = process.env.JIRA_EMAIL || 'your-email@example.com';
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN || 'your-api-token';

export async function fetchJiraTicket(ticketId: string) {
  // Basic Auth for Jira Cloud
  const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');
  try {
    const response = await axios.get(`${JIRA_BASE_URL}/rest/api/3/issue/${ticketId}`, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    // For now, just return error details
    return { error: true, details: error instanceof Error ? error.message : error };
  }
}

// Fetch all tickets in the 'To Do' column from Jira
export async function fetchTodoTickets() {
  const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');
  // JQL: fetch only issues with status = 'Por hacer'
  const jql = encodeURIComponent('status = "Por hacer" ORDER BY created DESC');
  try {
    const response = await axios.get(`${JIRA_BASE_URL}/rest/api/3/search?jql=${jql}&fields=summary,description,customfield_10034`, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    });
    // customfield_10034 is a placeholder for acceptance criteria; replace with your Jira's custom field ID
    if (!response.data.issues) {
      console.log('Jira API raw response:', response.data);
      return {
        error: true,
        details: 'No issues found or unexpected Jira API response.',
        jiraRaw: response.data
      };
    }
    // Print only tickets with status 'Por hacer'
    const porHacerTickets = (response.data.issues || []).filter((issue: any) => issue.fields.status?.name === 'Por hacer');
    console.log('Tickets with status Por hacer:', porHacerTickets.map((issue: any) => ({ key: issue.key, summary: issue.fields.summary, status: issue.fields.status?.name })));
    // Print all statuses for debugging
    console.log('Jira issues statuses:', response.data.issues.map((issue: any) => ({ key: issue.key, status: issue.fields.status?.name })));
    // For each issue, fetch its details and extract acceptance criteria
    const issues = response.data.issues;
    const tickets = await Promise.all(issues.map(async (issue: any) => {
      try {
        const detailRes = await axios.get(`${JIRA_BASE_URL}/rest/api/3/issue/${issue.key}`, {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Accept': 'application/json'
          }
        });
        const fields = detailRes.data.fields;
        // Print the full JSON for debugging
        console.log(`Jira issue fields for ${issue.key}:`, JSON.stringify(fields, null, 2));
        let descriptionText = '';
        let acceptanceCriteria = '';
        if (fields.description && Array.isArray(fields.description.content)) {
          // Traverse the content array
          const contentArr = fields.description.content;
          // Only keep the paragraph node whose text starts with 'Description'
          const descParagraph = contentArr.find(
            (c: any) => c.type === 'paragraph' && c.content &&
              c.content.map((d: any) => (d.text || '').trim().toLowerCase()).join(' ').startsWith('description')
          );
          if (descParagraph && Array.isArray(descParagraph.content)) {
            descriptionText = descParagraph.content.map((d: any) => d.text).join(' ');
          } else {
            descriptionText = '';
          }
          // Restore acceptanceCriteria logic: find 'Acceptance criteria:' paragraph and extract bulletList after
          for (let i = 0; i < contentArr.length - 1; i++) {
            const node = contentArr[i];
            if (node.type === 'paragraph' && node.content && node.content.map((d: any) => (d.text || '').trim().toLowerCase()).join(' ').startsWith('acceptance criteria:')) {
              const nextNode = contentArr[i + 1];
              if (nextNode && nextNode.type === 'bulletList') {
                acceptanceCriteria = nextNode.content.map(
                  (li: any) => li.content?.map((p: any) => p.content?.map((txt: any) => txt.text).join('')).join('')
                ).join('\n');
                break;
              }
            }
          }

        } else if (typeof fields.description === 'string') {
          descriptionText = fields.description;
        }
        // If not found, fallback to empty or previous method

        return {
          key: issue.key,
          title: fields.summary,
          description: descriptionText,
          acceptanceCriteria,
          status: fields.status?.name || ''
        };
      } catch (err) {
        return {
          key: issue.key,
          title: issue.fields.summary,
          description: '',
          acceptanceCriteria: '[Error fetching details]',
          status: issue.fields.status?.name || ''
        };
      }
    }));
    return {
      tickets,
      jiraRaw: response.data
    };


  } catch (error) {
    return { error: true, details: error instanceof Error ? error.message : error };
  }
}
