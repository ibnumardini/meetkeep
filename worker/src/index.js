import { collectEvent, getActiveUsersToday } from "./handlers.js";
import { route } from "./utils/router.js";

const routes = {
  "GET /active-users-today": getActiveUsersToday,
  "POST /": collectEvent,
};

export default {
  fetch: (request, env) => route(routes, request, env),
};
