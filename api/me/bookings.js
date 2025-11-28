import { memory, getToken } from '../_store.js'

export default function handler(req, res){
  try {
    const token = getToken(req);
    const mine = (memory.byToken[token] = memory.byToken[token] || []);
    res.json(mine);
  } catch(e){
    console.error('me/bookings',e);
    res.status(500).json({ error:'internal' });
  }
}
