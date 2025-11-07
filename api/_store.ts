// WARNING: in-memory store for demo only (resets on new serverless instance)
export const memory = {
  // token -> array of { class_id, class_date }
  byToken: {} as Record<string, Array<{ class_id:number; class_date:string }>>,
  // class catalogue we already use
  classes: [
    { id: 101, name: 'CrossFit WOD', start_time: '18:00:00', duration: 60, capacity: 12, bookings: 4 },
    { id: 102, name: 'HIIT',          start_time: '19:15:00', duration: 45, capacity: 10, bookings: 10 },
    { id: 103, name: 'Mobility',      start_time: '20:15:00', duration: 30, capacity: 8,  bookings: 2 },
  ],
};

// tiny helpers
export function getToken(req: any): string | null {
  const h = (req.headers?.authorization || req.headers?.Authorization || '') as string;
  const m = /^Bearer\s+(.+)$/.exec(h);
  return m ? m[1] : null;
}
export function todayISO() { return new Date().toISOString().slice(0,10) }
export function isSameDate(a:string,b:string){ return a===b }
