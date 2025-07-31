// 状态检查接口
export async function onRequest({ request }) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method === "GET") {
    const status = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      service: "AList Proxy",
      version: "1.0.0",
      uptime: Math.floor(Math.random() * 86400), // 模拟运行时间（秒）
      memory_usage: Math.floor(Math.random() * 50) + 20, // 模拟内存使用百分比
    };

    return new Response(JSON.stringify(status, null, 2), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }

  return new Response("Method not allowed", { 
    status: 405,
    headers: corsHeaders
  });
}