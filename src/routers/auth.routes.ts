import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Here you would normally validate the username and password
  // For example, check them against a database

  if (username === 'admin' && password === 'password') {
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

export default router;