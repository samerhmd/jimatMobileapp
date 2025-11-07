export default function handler(_req: any, res: any) {
  res.json([{ class_id: 101, class_date: new Date(Date.now()+864e5).toISOString().slice(0,10), status: 'booked' }]);
}
