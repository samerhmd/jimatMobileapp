import { parseBody } from './_store.js'

export default function handler(req, res){
  try {
    if (req.method !== 'POST') return res.status(405).end();
    const body = parseBody(req);
    const email = body.email || 'demo@gymie.app';
    const token = 'dev-mock-token-' + Date.now();
    return res.json({
      token,
      // refresh_token can be omitted in V0 simple strategy
      expires_in: 900,
      user: { id:1, name:'Demo User', email }
    });
  } catch(e){
    console.error('token',e);
    res.status(500).json({ error: 'internal' });
  }
}
