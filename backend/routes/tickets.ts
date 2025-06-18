import { Router } from 'express';

const router = Router();

import { fetchJiraTicket, fetchTodoTickets } from '../services/jiraService';

// Test endpoint: connects to Jira and returns a simple result
router.get('/test', async (req, res) => {
  const config = {
    JIRA_BASE_URL: process.env.JIRA_BASE_URL,
    JIRA_EMAIL: process.env.JIRA_EMAIL,
    TEST_TICKET_ID: 'MFLP-7'
  };
  try {
    const info = await fetchJiraTicket('MFLP-7');
    res.json({ success: true, jiraResult: info, config });
  } catch (err: any) {
    // Provide more detailed error info
    let errorDetails = {
      message: err?.message || String(err),
      stack: err?.stack || null,
      response: err?.response?.data || null,
      code: err?.code || null,
      name: err?.name || null
    };
    res.json({ success: false, error: errorDetails, config });
  }
});

// List all tickets in the 'To Do' column
router.get('/todo', async (req, res) => {
  const result = await fetchTodoTickets();
  res.json(result);
});

// Accepts a Jira ticket and returns ticket info + mock list of files
router.post('/', async (req, res) => {
  const { ticketId } = req.body;
  const ticketInfo = await fetchJiraTicket(ticketId);
  res.json({
    ticketId,
    ticketInfo,
    files: [
      'src/components/ExampleComponent.tsx',
      'src/utils/jiraHelpers.ts',
      'src/pages/TicketDetails.tsx'
    ]
  });
});

export default router;
