export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: '只允许 POST 请求' });

    const API_BASE_URL = process.env.API_BASE_URL; // https://nexusapi.cn/v1
    const API_KEY = process.env.API_KEY;
    const { model, prompt, size } = req.body;

    try {
        let fetchUrl, fetchBody;

        // 🟢 智能路由 1：如果是 Google Gemini 模型
        if (model.toLowerCase().includes('gemini')) {
            // 按照文档，去掉 /v1，加上专属路径
            const baseUrl = API_BASE_URL.replace('/v1', '');
            fetchUrl = `${baseUrl}/v1beta/models/${model}:generateContent`;
            fetchBody = {
                contents: [{ parts: [{ text: prompt }] }] // Gemini 专属的数据结构
            };
        } 
        // 🔵 智能路由 2：标准的 OpenAI 模型 (DALL-E, Flux 等)
        else {
            fetchUrl = `${API_BASE_URL}/images/generations`;
            fetchBody = { model, prompt, n: 1 };
            // 如果填了尺寸就带上，没填就给个默认标准值防报错
            if (size) fetchBody.size = size; 
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
