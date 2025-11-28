import { memory } from './_store.js'

export default function handler(_req, res){
  try { res.json(memory.invoices) }
  catch(e){ console.error('invoices',e); res.status(500).json({ error:'internal' }) }
}
