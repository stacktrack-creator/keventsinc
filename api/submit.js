const NOTION_SECRET = process.env.NOTION_SECRET || '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';
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID || '333e3565dd3580649748c3aa51e47551';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, partner, email, wedding_date, service, message } = req.body;

    const response = await fetch(`https://api.notion.com/v1/pages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_SECRET}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_DATABASE_ID },
        properties: {
          'Name': {
            title: [{ text: { content: name || '' } }]
          },
          'Partner': {
            rich_text: [{ text: { content: partner || '' } }]
          },
          'Email': {
            email: email || null
          },
          'Wedding Date': {
            rich_text: [{ text: { content: wedding_date || '' } }]
          },
          'Service': {
            select: service ? { name: service } : null
          },
          'Message': {
            rich_text: [{ text: { content: message || '' } }]
          },
          'Submitted At': {
            date: { start: new Date().toISOString() }
          }
        }
      })
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('Notion API error:', err);
      return res.status(500).json({ error: 'Failed to save inquiry' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
