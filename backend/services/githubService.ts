import axios from 'axios';

/**
 * Fetch commit titles from a GitHub repository.
 * @param owner The repo owner (e.g., 'usersuper838')
 * @param repo The repo name (e.g., 'EzOnboarding')
 * @param perPage Number of commits to fetch (default 20)
 */
export async function fetchCommitTitles(owner: string, repo: string, perPage: number = 20): Promise<string[]> {
  const url = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=${perPage}`;
  try {
    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/vnd.github+json'
      }
    });
    return response.data.map((commit: any) => commit.commit.message.split('\n')[0]);
  } catch (error) {
    console.error('Error fetching commits:', error);
    throw new Error('Failed to fetch GitHub commits');
  }
}
