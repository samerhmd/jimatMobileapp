const { memory, getToken } = require('../_store');
module.exports = function handler(req, res){
  try {
    const token = getToken(req);
    const mine = (memory.byToken[token] = memory.byToken[token] || []);
    res.json(mine);
  } catch(e){ console.error('me/bookings',e); res.status(500).json({message:'server error'}); }
}
