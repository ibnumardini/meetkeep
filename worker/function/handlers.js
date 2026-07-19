import { getAccessToken } from "./utils/auth.js";

const GA_COLLECT_URL = "https://www.google-analytics.com/mp/collect";
const GA_DATA_API_URL = "https://analyticsdata.googleapis.com/v1beta";

export async function collectEvent(request, env) {
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

  const gaUrl = `${GA_COLLECT_URL}?measurement_id=${env.GA_MEASUREMENT_ID}&api_secret=${env.GA_API_SECRET}`;

  const gaResponse = await fetch(gaUrl, {
    method: "POST",
    body: JSON.stringify({ client_id, events }),
  });

  return new Response(null, { status: gaResponse.status });
}

export async function getActiveUsersToday(request, env) {
  const accessToken = await getAccessToken(env);

  const reportResponse = await fetch(
    `${GA_DATA_API_URL}/properties/${env.GA_PROPERTY_ID}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dateRanges: [{ startDate: "today", endDate: "today" }],
        dimensions: [{ name: "eventName" }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: {
          filter: {
            fieldName: "eventName",
            stringFilter: { value: "extension_used" },
          },
        },
      }),
    },
  );

  if (!reportResponse.ok) {
    return new Response(await reportResponse.text(), {
      status: reportResponse.status,
    });
  }

  const report = await reportResponse.json();
  const activeUsers = Number(report.rows?.[0]?.metricValues?.[0]?.value ?? 0);

  return new Response(JSON.stringify({ activeUsers }), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
