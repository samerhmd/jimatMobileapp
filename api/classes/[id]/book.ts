import type { VercelRequest, VercelResponse } from '@vercel/node';
let count: Record<number, number> = {101:4,102:10,103:2};
const cap: Record<number, number> = {101:12,102:10,103:8};
export default function handler(req: VercelRequest, res: VercelResponse) {
  const id = Number(req.query.id);
  if (req.method === 'POST') {
    if (!(id in cap)) return res.status(404).json({ message: 'Class not found' });
    const used = count[id] ?? 0;
    if (used >= cap[id]) return res.status(409).json({ message: 'Class full or already booked' });
    count[id] = used + 1;
    const class_date = (req.body as any)?.class_date || new Date().toISOString().slice(0,10);
    return res.json({ class_id: id, class_date, status: 'booked' });
  }
  if (req.method === 'DELETE') {
    const class_date = String(req.query.date || new Date().toISOString().slice(0,10));
    return res.json({ class_id: id, class_date, status: 'cancelled' });
  }
  return res.status(405).end();
}
