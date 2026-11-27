export default {
  async fetch(request, env) {
    const targetUrl = new URL(request.url);
    
    // Alihkan request langsung ke AIO Server Singapura (IP Statis Resmi)
    targetUrl.protocol = "http:";
    targetUrl.hostname = "34.1.202.11";
    targetUrl.port = "80";

    const proxyRequest = new Request(targetUrl.toString(), {
      method: request.method,
      headers: request.headers,
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
