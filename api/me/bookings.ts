import { memory, getToken } from '../_store'
export default function handler(req:any, res:any){
  const token = getToken(req);
  if (!token) return res.status(401).json({ message:'Missing bearer token' });
  res.json(memory.byToken[token] || []);
}
