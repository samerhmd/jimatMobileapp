export default function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();
  // Always return a fresh token with short expiry (demo)
  const token = 'dev-mock-token-' + Date.now();
  return res.json({ token, expires_in: 900 }); // 15 minutes
}
