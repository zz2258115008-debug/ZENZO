export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: '只允许 POST 请求' });

    const API_BASE_URL = process.env.API_BASE_URL; // 你的变量是 https://nexusapi.cn/v1
    const API_KEY = process.env.API_KEY;

    try {
        // 🌟 核心修复：这里根据文档，改成了 /video/create 
        const response = await fetch(`${API_BASE_URL}/video/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
