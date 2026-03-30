export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { name, partner, email, wedding_date, service, message } = req.body;
    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_SECRET}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({
        parent: { database_id: '333e3565dd3580649748c3aa51e47551' },
        properties: {
          Name: { title: [{ text: { content: name || '' } }] },
          Partner: { rich_text: [{ text: { content: partner || '' } }] },
          Email: { email: email || null },
          'Wedding Date': { rich_text: [{ text: { content: wedding_date || '' } }] },
          Service: { select: service ? { name: service } : null },
          Message: { rich_text: [{ text: { content: message || '' } }] },
          'Submitted At': { date: { start: new Date().toISOString() } }
        }
      })
    });
    if (!response.ok) {
      const err = await response.json();
      return res.status(500).json({ error: err });
    }
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
