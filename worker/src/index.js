export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response("Invalid JSON", { status: 400 });
    }

    const { client_id, events } = body || {};
    if (!client_id || !Array.isArray(events)) {
      return new Response("Missing client_id or events", { status: 400 });
    }

    const gaUrl = `https://www.google-analytics.com/mp/collect?measurement_id=${env.GA_MEASUREMENT_ID}&api_secret=${env.GA_API_SECRET}`;

    const gaResponse = await fetch(gaUrl, {
      method: "POST",
      body: JSON.stringify({ client_id, events }),
    });

    return new Response(null, { status: gaResponse.status });
  },
};
