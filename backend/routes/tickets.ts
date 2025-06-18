import { Router } from 'express';

const router = Router();

// Placeholder: Accepts a Jira ticket and returns a mock list of files
router.post('/', (req, res) => {
  const { ticketId } = req.body;
  // TODO: Integrate with Jira & GitHub APIs
  res.json({
    ticketId,
    files: [
      'src/components/ExampleComponent.tsx',
      'src/utils/jiraHelpers.ts',
      'src/pages/TicketDetails.tsx'
    ]
  });
});

export default router;
