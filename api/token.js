module.exports = function handler(req, res){
  try {
    if (req.method !== 'POST') return res.status(405).end();
    const body = typeof req.body === 'string' ? JSON.parse(req.body||'{}') : (req.body||{});
    const email = body.email || 'demo@gymie.app';
    return res.json({ token:'dev-mock-token', user:{ id:1, name:'Demo User', email }});
  } catch(e){ console.error('token',e); res.status(500).json({message:'server error'}); }
}
