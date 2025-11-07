export default function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();
  const email = (req.body as any)?.email || 'demo@gymie.app';
  // For demo: one access token + fake refresh token
  return res.json({
    token: 'dev-mock-token-' + Date.now(),
    refresh_token: 'dev-mock-refresh',
    expires_in: 900, // 15 minutes
    user: { id: 1, name: 'Demo User', email }
  });
}
