const { memory } = require('./_store');
module.exports = function handler(_req, res){
  try { res.json(memory.invoices); }
  catch(e){ console.error('invoices',e); res.status(500).json({ error:'internal' }); }
}
