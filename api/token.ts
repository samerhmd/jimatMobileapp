export default function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();
  const email = (req.body as any)?.email || 'demo@gymie.app';
  return res.json({ token: 'dev-mock-token', user: { id: 1, name: 'Demo User', email } });
}
