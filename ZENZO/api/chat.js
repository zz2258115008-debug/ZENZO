export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: '只允许 POST 请求' });

    const API_BASE_URL = process.env.API_BASE_URL;
    const API_KEY = process.env.API_KEY;

    try {
        const { model, messages } = req.body;
        let fetchUrl = `${API_BASE_URL}/chat/completions`;
        let fetchBody = req.body;

        // 🟣 智能路由 3：如果发现是 o3-pro 等特殊模型，自动切换到 responses 专线
        if (model && (model.includes('o3-pro') || model.includes('codex'))) {
            fetchUrl = `${API_BASE_URL}/responses`;
            fetchBody = { model: model, input: messages }; // 按照图3文档的格式修改
        }

        const response = await fetch(fetchUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify(fetchBody)
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
