export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { name, partner, email, wedding_date, service, message } = req.body;
    const response = await fetch('https://sheetdb.io/api/v1/homssfk38kfuy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [{ Name: name||'', Partner: partner||'', Email: email||'', 'Wedding Date': wedding_date||'', Service: service||'', Message: message||'', 'Submitted At': new Date().toLocaleString('en-CA',{timeZone:'America/Toronto'}) }] })
    });
    if (!response.ok) return res.status(500).json({ error: await response.text() });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
