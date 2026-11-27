export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Cloudflare Pages melarang fetch langsung ke IP bare (Error 1003).
    // Maka kita jembatani lewat Cloudflare Quick Tunnel HTTPS yang sudah aktif di server:
    const backendHost = "lang-folders-structures-directly.trycloudflare.com";
    
    const targetUrl = new URL(request.url);
    targetUrl.protocol = "https:";
    targetUrl.hostname = backendHost;
    targetUrl.port = "";

    // Salin headers dan sesuaikan Host header
    const newHeaders = new Headers(request.headers);
    newHeaders.set("Host", backendHost);
    newHeaders.set("X-Forwarded-Host", url.hostname);
    newHeaders.set("X-Forwarded-Proto", "https");

    const proxyRequest = new Request(targetUrl.toString(), {
      method: request.method,
      headers: newHeaders,
      body: request.body,
      redirect: "manual"
    });

    try {
      const response = await fetch(proxyRequest);
      return response;
    } catch (err) {
      return new Response(
        `<html><body style="font-family:sans-serif;padding:40px;background:#090d16;color:#fff;text-align:center;">
          <h2>⚡ Server VM Sedang Offline / Dimatikan</h2>
          <p style="color:#94a3b8;">Nyalakan VM Singapura (vm-singapore-master) untuk membuka dashboard.</p>
        </body></html>`,
        {
          status: 502,
          headers: { "Content-Type": "text/html; charset=utf-8" }
        }
      );
    }
  }
};
