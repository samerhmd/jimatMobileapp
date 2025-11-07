const sample = [
  { id:101,name:'CrossFit WOD',start_time:'18:00:00',duration:60,capacity:12,bookings:4 },
  { id:102,name:'HIIT',start_time:'19:15:00',duration:45,capacity:10,bookings:10 },
  { id:103,name:'Mobility',start_time:'20:15:00',duration:30,capacity:8,bookings:2 },
];
export default function handler(_req: any, res: any) { res.json(sample); }
