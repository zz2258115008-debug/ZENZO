export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: '只允许 POST 请求' });

    // 从 Vercel 后台拿你的保密钥匙
    const API_BASE_URL = process.env.API_BASE_URL;
    const API_KEY = process.env.API_KEY;

    try {
        // 替前端去向真正的 AI 发送请求
        const response = await fetch(`${API_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}` // 密钥藏在这里
            },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.status(response.status).json(data); // 把结果还给前端
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}