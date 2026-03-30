export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const response = await fetch('https://api.notion.com/v1/databases/333e3565dd3580649748c3aa51e47551/query', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({ sorts: [{ timestamp: 'created_time', direction: 'descending' }] })
    });
    const data = await response.json();
    const inquiries = data.results.map(page => ({
      id: page.id,
      created: page.created_time,
      name: page.properties.Name?.title?.[0]?.text?.content || '',
      partner: page.properties.Partner?.rich_text?.[0]?.text?.content || '',
      email: page.properties.Email?.email || '',
      wedding_date: page.properties['Wedding Date']?.rich_text?.[0]?.text?.content || '',
      service: page.properties.Service?.select?.name || '',
      message: page.properties.Message?.rich_text?.[0]?.text?.content || ''
    }));
    return res.status(200).json({ inquiries });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
