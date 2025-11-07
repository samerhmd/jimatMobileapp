export default function handler(_req: any, res: any) {
  res.json([
    { id:5001, number:'INV-5001', amount:150, currency:'USD', status:'paid', issued_at:'2025-10-01', due_at:'2025-10-01' },
    { id:5002, number:'INV-5002', amount:150, currency:'USD', status:'unpaid', issued_at:'2025-11-01', due_at:'2025-11-08' }
  ]);
}
