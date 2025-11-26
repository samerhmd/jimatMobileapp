module.exports = function handler(_req, res){
  try {
    const today = new Date();
    const day = (d)=> new Date(today.getTime() - d*864e5).toISOString().slice(0,10);
    res.json([
      { id:2, date: day(1), title:'5x5 Back Squat', description:'Build to heavy 5' },
      { id:3, date: day(2), title:'For Time', description:'800m run + 50 KB swings' },
    ]);
  } catch(e){
    console.error('wod',e);
    res.status(500).json({ error:'internal' });
  }
}
