import { memory } from '../_store'
export default function handler(_req: any, res: any) {
  // Return current classes snapshot (bookings field may change as people book/cancel)
  res.json(memory.classes);
}
