import type { VercelRequest, VercelResponse } from '@vercel/node';
export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.json({
    id:1, date:new Date().toISOString().slice(0,10),
    title:'EMOM 12',
    description:'Alt mins: burpees / air squats',
    movements:[{name:'Burpees',reps:'12'},{name:'Air Squats',reps:'20'}],
    coach_notes:'Steady pace.'
  });
}
