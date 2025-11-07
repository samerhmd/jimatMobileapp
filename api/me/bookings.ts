import { memory, getToken } from '../_store'
export default function handler(req:any, res:any){
  try {
    const token = getToken(req);
    if (!token) return res.status(401).json({ message:'Missing bearer token' });
    res.json(memory.byToken[token] || []);
  } catch (e:any) {
    console.error('me/bookings error', e);
    res.status(500).json({ message: 'server error' });
  }
}
