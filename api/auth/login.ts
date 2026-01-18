
export default function handler(req: any, res: any) {
  res.status(200).json({ message: "Legacy API disabled. Using Supabase client." });
}
