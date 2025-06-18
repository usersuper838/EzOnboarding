import express from 'express';
import cors from 'cors';
import ticketRoutes from './routes/tickets';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/tickets', ticketRoutes);

app.get('/', (req, res) => {
  res.send('EzOnboarding backend running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
