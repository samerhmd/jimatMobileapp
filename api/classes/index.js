import { memory } from '../_store.js'

export default function handler(req, res){
  try {
    const q = String((req.query?.q ?? '')).toLowerCase()
    const list = q ? memory.classes.filter(c=>c.name.toLowerCase().includes(q)) : memory.classes
    res.json(list)
  } catch(e){
    console.error('classes',e);
    res.status(500).json({ error:'internal' });
  }
}
