const { memory } = require('../_store');
module.exports = function handler(_req, res){
  try { res.json(memory.classes); }
  catch(e){ console.error('classes',e); res.status(500).json({message:'server error'}); }
}
