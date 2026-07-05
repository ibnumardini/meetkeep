export async function route(routes, request, env) {
  const url = new URL(request.url);
  const handler = routes[`${request.method} ${url.pathname}`];

  if (!handler) {
    return new Response("Not Found", { status: 404 });
  }

  try {
    return await handler(request, env);
  } catch (err) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
}
