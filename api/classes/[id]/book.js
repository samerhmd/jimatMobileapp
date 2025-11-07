const { memory, getToken, todayISO, isSameDate, parseBody } = require('../../_store');

module.exports = function handler(req, res){
  try {
    const id = Number(req.query.id);
    const cls = memory.classes.find(c=>c.id===id);
    if (!cls) return res.status(404).json({ message:'Class not found' });

    const token = getToken(req);
    const mine = (memory.byToken[token] = memory.byToken[token] || []);

    if (req.method === 'POST') {
      const { class_date = todayISO() } = parseBody(req);
      if (mine.find(b => b.class_id===id && isSameDate(b.class_date, class_date)))
        return res.status(409).json({ message:'Already booked' });

      const used = cls.bookings || 0;
      if (used >= cls.capacity) return res.status(409).json({ message:'Class full' });

      cls.bookings = used + 1;
      mine.push({ class_id:id, class_date, status:'booked' });
      return res.json({ class_id:id, class_date, status:'booked' });
    }

    if (req.method === 'DELETE') {
      const class_date = String(req.query?.date || todayISO());
      const [hh, mm] = (cls.start_time || '00:00:00').split(':').map(Number);
      const start = new Date(`${class_date}T${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}:00Z`);
      const cutoff = new Date(start.getTime() - 2*60*60*1000);
      if (Date.now() > cutoff.getTime())
        return res.status(409).json({ message:'Cannot cancel within 2 hours of start' });

      const idx = mine.findIndex(b=>b.class_id===id && isSameDate(b.class_date, class_date));
      if (idx === -1) return res.status(404).json({ message:'No booking found for this class/date' });

      mine.splice(idx,1);
      cls.bookings = Math.max(0, (cls.bookings || 1) - 1);
      return res.json({ class_id:id, class_date, status:'cancelled' });
    }

    return res.status(405).end();
  } catch(e){ console.error('book',e); res.status(500).json({message:'server error'}); }
}
