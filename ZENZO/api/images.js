export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: '只允许 POST 请求' });

    const API_BASE_URL = process.env.API_BASE_URL; 
    const API_KEY = process.env.API_KEY;
    const { model, prompt, size } = req.body;

    try {
        let fetchUrl, fetchBody;

        if (model.toLowerCase().includes('gemini')) {
            const baseUrl = API_BASE_URL.replace('/v1', '');
            fetchUrl = `${baseUrl}/v1beta/models/${model}:generateContent`;

            // 🟢 智能翻译：把尺寸翻译成 Gemini 听得懂的 aspectRatio 比例
            let geminiRatio = "1:1";
            if (size) {
                if (size === "16:9" || size === "1920x1080" || size === "1792x1024") geminiRatio = "16:9";
                else if (size === "9:16" || size === "1080x1920" || size === "1024x1792") geminiRatio = "9:16";
                else if (size === "4:3") geminiRatio = "4:3";
                else if (size === "3:4") geminiRatio = "3:4";
            }

            fetchBody = {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    aspectRatio: geminiRatio // 注入专属于 Gemini 的尺寸控制指令
                }
            };
        } 
        else {
            fetchUrl = `${API_BASE_URL}/images/generations`;
            fetchBody = { model, prompt, n: 1 };
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
