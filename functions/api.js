var ADDRESS = "https://alist.canghai.org";
var TOKEN = "alist-0cb72587-9fb0-484d-9908-8110e04bef96xIHPCwqFuYCbDjWMknOqUiZk9NHzyASp4j1f1OxGw6Vq39TH13jqvC0Ag128pIeT";
var WORKER_ADDRESS = "https://aproxy.pages.dev";

var verify = async (data, _sign) => {
  const signSlice = _sign.split(":");
  if (!signSlice[signSlice.length - 1]) {
    return "expire missing";
  }
  const expire = parseInt(signSlice[signSlice.length - 1]);
  if (isNaN(expire)) {
    return "expire invalid";
  }
  if (expire < Date.now() / 1e3 && expire > 0) {
    return "expire expired";
  }
  const right = await hmacSha256Sign(data, expire);
  if (_sign !== right) {
    return "sign mismatch";
  }
  return "";
};

var hmacSha256Sign = async (data, expire) => {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(TOKEN),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  const buf = await crypto.subtle.sign(
    {
      name: "HMAC",
      hash: "SHA-256"
    },
    key,
    new TextEncoder().encode(`${data}:${expire}`)
  );
  return btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_") + ":" + expire;
};

async function handleDownload(request) {
  const origin = request.headers.get("origin") ?? "*";
  const url = new URL(request.url);
  const path = decodeURIComponent(url.pathname);
  const sign = url.searchParams.get("sign") ?? "";
  
  const verifyResult = await verify(path, sign);
  if (verifyResult !== "") {
    return new Response(
      JSON.stringify({
        code: 401,
        message: `sign invalid`,
        data: null
      }),
      {
        status: 401,
        headers: {
          "content-type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": origin
        }
      }
    );
  }

  let resp = await fetch(`${ADDRESS}/api/fs/link`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: TOKEN
    },
    body: JSON.stringify({
      path
    })
  });
  
  let res = await resp.json();
  if (res.code !== 200) {
    return new Response(JSON.stringify(res), {
      status: res.code || 500,
      headers: {
        "content-type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": origin
      }
    });
  }

  // 直接返回重定向，让客户端直接从原始服务器下载
  return new Response(null, {
    status: 302,
    headers: {
      "Location": res.data.url,
      "Access-Control-Allow-Origin": origin,
      "Vary": "Origin"
    }
  });
}

function handleOptions(request) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
    "Access-Control-Max-Age": "86400"
  };
  
  let headers = request.headers;
  if (headers.get("Origin") !== null && headers.get("Access-Control-Request-Method") !== null) {
    let respHeaders = {
      ...corsHeaders,
      "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers") || ""
    };
    return new Response(null, {
      headers: respHeaders
    });
  } else {
    return new Response(null, {
      headers: {
        Allow: "GET, HEAD, POST, OPTIONS"
      }
    });
  }
}

async function handleRequest(request) {
  if (request.method === "OPTIONS") {
    return handleOptions(request);
  }
  return await handleDownload(request);
}

export async function onRequest({ request }) {
  return await handleRequest(request);
}