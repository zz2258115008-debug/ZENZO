// app/page.tsx (主页面)
"use client";

import { Tldraw, createShapeId } from 'tldraw';
import 'tldraw/tldraw.css';
import { useState } from 'react';

export default function CanvasApp() {
  const [editor, setEditor] = useState<any>(null);

  // 模拟接入自定义 API 的函数
  const handleCustomApiCall = async () => {
    if (!editor) return;

    // 1. 获取当前选中的内容或画布信息
    const selectedShapes = editor.getSelectedShapes();
    
    // 2. 发送请求给你的 API (这里用 API Route 代理)
    const response = await fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt: "根据选中内容生成新元素" }),
    });
    
    const data = await response.json();

    // 3. 将结果转化为画布形状
    editor.createShapes([
      {
        id: createShapeId(),
        type: 'text',
        x: editor.getViewportPageBounds().centerX,
        y: editor.getViewportPageBounds().centerY,
        props: { text: data.result || 'API 返回的内容' },
      },
    ]);
  };

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw onMount={(editor) => setEditor(editor)}>
        {/* 自定义 UI 层：模仿 TapNow 的控制面板 */}
        <div style={{ 
          position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
          zIndex: 1000, background: 'white', padding: '10px', borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', gap: '10px'
        }}>
          <button 
            onClick={handleCustomApiCall}
            style={{ padding: '8px 16px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            🚀 调用自定义 API
          </button>
        </div>
      </Tldraw>
    </div>
  );
}
