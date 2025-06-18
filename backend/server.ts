import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';

// Debug: print loaded Jira config
console.log('Loaded Jira config:', {
  JIRA_BASE_URL: process.env.JIRA_BASE_URL,
  JIRA_EMAIL: process.env.JIRA_EMAIL,
  JIRA_API_TOKEN: !!process.env.JIRA_API_TOKEN // true if set, false if missing
});

import ticketRoutes from './routes/tickets';
import githubRoutes from './routes/github';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/tickets', ticketRoutes);
app.use('/api/github', githubRoutes);

app.get('/', (req, res) => {
  res.send('EzOnboarding backend running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
