type Booking = { class_id:number; class_date:string; status?:string };
type Class = { id:number; name:string; start_time:string; duration:number; capacity:number; bookings?:number };

const g: any = globalThis as any;
if (!g.__GYMIE_MEM__) {
  g.__GYMIE_MEM__ = {
    classes: [
      { id:101, name:'CrossFit WOD', start_time:'18:00:00', duration:60, capacity:12, bookings:4 },
      { id:102, name:'HIIT',         start_time:'19:15:00', duration:45, capacity:10, bookings:10 },
      { id:103, name:'Mobility',     start_time:'20:15:00', duration:30, capacity:8,  bookings:2 },
    ] as Class[],
    byToken: {} as Record<string, Booking[]>,
  };
}
export const memory = g.__GYMIE_MEM__ as { classes: Class[]; byToken: Record<string, Booking[]> };

export function getToken(req:any): string {
  try {
    const h = req?.headers || {};
    const auth = (h.authorization || h.Authorization || '').toString();
    const m = auth.match(/^Bearer\s+(.+)$/i);
    if (m && m[1]) return m[1];

    const cookie = (h.cookie || h.Cookie || '') as string;
    const ck = /gymie_auth_v1=([^;]+)/.exec(cookie);
    if (ck) {
      try {
        const val = JSON.parse(decodeURIComponent(ck[1]));
        if (typeof val === 'string') return val;
        if (val?.token) return val.token;
      } catch {}
    }
    return 'public-demo-token';
  } catch {
    return 'public-demo-token';
  }
}

export function todayISO(){ return new Date().toISOString().slice(0,10) }
export function isSameDate(a:string,b:string){ return a.slice(0,10) === b.slice(0,10) }
