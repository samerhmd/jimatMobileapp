export function todayISO(){ return new Date().toISOString().slice(0,10) }
export function pad(n:number){ return String(n).padStart(2,'0') }
export function cutoff2h(dateISO:string, start_time:string){
  const [hh, mm] = (start_time || '00:00:00').split(':').map(Number);
  const dt = new Date(`${dateISO}T${pad(hh)}:${pad(mm)}:00`);
  dt.setHours(dt.getHours()-2);
  return dt;
}
export function isPast(date:Date){ return date.getTime() < Date.now() }
