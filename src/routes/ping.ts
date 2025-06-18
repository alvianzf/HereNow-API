import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/ping', async (req: Request, res: Response) => {
  res.json({ message: 'Pong from Supabase-connected backend!' });
});

export default router;
