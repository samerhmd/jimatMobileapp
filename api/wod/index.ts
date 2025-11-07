import type { VercelRequest, VercelResponse } from '@vercel/node';
export default function handler(_req: VercelRequest, res: VercelResponse) {
  const t=new Date();const d=(n:number)=>new Date(t.getTime()-n*864e5).toISOString().slice(0,10);
  res.json([{id:2,date:d(1),title:'5x5 Back Squat'},{id:3,date:d(2),title:'For Time: 800m run + 50 KB swings'}]);
}
