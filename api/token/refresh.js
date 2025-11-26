const { parseBody } = require('../_store');

module.exports = function handler(req, res){
  try {
    if (req.method !== 'POST') return res.status(405).end();
    parseBody(req);
    const token = 'dev-mock-token-' + Date.now();
    res.json({ token, expires_in: 900 });
  } catch(e){
    console.error('token/refresh',e);
    res.status(500).json({ error:'internal' });
  }
}
