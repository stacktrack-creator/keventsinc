const NOTION_SECRET = process.env.NOTION_SECRET || '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';
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID || '333e3565dd3580649748c3aa51e47551';

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_SECRET}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({
        sorts: [{ timestamp: 'created_time', direction: 'descending' }]
      })
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('Notion API error:', err);
      return res.status(500).json({ error: 'Failed to fetch inquiries' });
    }

    const data = await response.json();

    const inquiries = data.results.map(page => {
      const p = page.properties;
      return {
        id: page.id,
        name: p['Name']?.title?.[0]?.plain_text || '',
        partner: p['Partner']?.rich_text?.[0]?.plain_text || '',
        email: p['Email']?.email || '',
        wedding_date: p['Wedding Date']?.rich_text?.[0]?.plain_text || '',
        service: p['Service']?.select?.name || '',
        message: p['Message']?.rich_text?.[0]?.plain_text || '',
        submitted_at: p['Submitted At']?.date?.start || page.created_time
      };
    });

    return res.status(200).json({ inquiries });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
