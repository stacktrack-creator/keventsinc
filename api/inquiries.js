export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const response = await fetch('https://sheetdb.io/api/v1/homssfk38kfuy?limit=100');
    if (!response.ok) return res.status(500).json({ error: await response.text() });
    const inquiries = await response.json();
    return res.status(200).json({ inquiries });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
