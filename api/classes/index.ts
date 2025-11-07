import { memory } from '../_store'
export default function handler(_req:any, res:any){
  try {
    res.json(memory.classes);
  } catch (e:any) {
    console.error('classes error', e);
    res.status(500).json({ message:'server error' });
  }
}
