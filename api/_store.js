// Global in-memory store that survives warm function invocations
function init() {
  return {
    classes: [
      { id:101, name:'CrossFit WOD', start_time:'18:00:00', duration:60, capacity:12, bookings:4 },
      { id:102, name:'HIIT',         start_time:'19:15:00', duration:45, capacity:10, bookings:10 },
      { id:103, name:'Mobility',     start_time:'20:15:00', duration:30, capacity:8,  bookings:2 },
    ],
    byToken: {}, // token -> [{ class_id, class_date, status }]
    invoices: [
      { id:5001, number:'INV-5001', amount:150, currency:'USD', status:'paid',   issued_at:'2025-10-01', due_at:'2025-10-01' },
      { id:5002, number:'INV-5002', amount:150, currency:'USD', status:'unpaid', issued_at:'2025-11-01', due_at:'2025-11-08' },
    ],
  };
}
const g = globalThis;
if (!g.__GYMIE_MEM__) g.__GYMIE_MEM__ = init();
const memory = g.__GYMIE_MEM__;

function getToken(req) {
  try {
    const h = req?.headers || {};
    const auth = String(h.authorization || h.Authorization || '');
    const m = auth.match(/^Bearer\s+(.+)$/i);
    if (m && m[1]) return m[1];

    const cookie = String(h.cookie || h.Cookie || '');
    const ck = /gymie_auth_v1=([^;]+)/.exec(cookie);
    if (ck) {
      try {
        const val = JSON.parse(decodeURIComponent(ck[1]));
        if (typeof val === 'string') return val;
        if (val && val.token) return val.token;
      } catch {}
    }
    return 'public-demo-token';
  } catch { return 'public-demo-token'; }
}
function todayISO(){ return new Date().toISOString().slice(0,10) }
function isSameDate(a,b){ return a.slice(0,10) === b.slice(0,10) }
function parseBody(req){
  const b = req?.body;
  if (!b) return {};
  if (typeof b === 'string') { try { return JSON.parse(b) } catch { return {} } }
  return b;
}

module.exports = { memory, getToken, todayISO, isSameDate, parseBody };
