export default function handler(_req, res){
  try {
    const d = new Date().toISOString().slice(0,10);
    res.json({
      id: 1,
      date: d,
      title: 'EMOM 12',
      description: 'Alt mins: burpees / air squats',
      movements: [{ name:'Burpees', reps:'12' }, { name:'Air Squats', reps:'20' }],
      coach_notes: 'Steady pace, nose breathing.',
    });
  } catch(e){
    console.error('wod/today',e);
    res.status(500).json({ error:'internal' });
  }
}
