
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Buffer } from 'buffer';
import clientPromise from '../mongodb.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  try {
    const { email, password } = req.body;
    const client = await clientPromise;
    const db = client.db('getwealthos');

    const user = await db.collection('users').findOne({ email, password });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = Buffer.from(`${user._id}:${Date.now()}`).toString('base64');

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        country: user.country,
        balance: user.balance || 0
      }
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
