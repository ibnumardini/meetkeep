import {
  collectEvent,
  collectStoreUsers,
  getActiveUsersToday,
  getStoreUsers,
} from "./handlers.js";
import { route } from "./utils/router.js";

const routes = {
  "GET /active-users-today": getActiveUsersToday,
  "GET /store-users": getStoreUsers,
  "POST /": collectEvent,
};

export default {
  fetch: (request, env) => route(routes, request, env),

  scheduled: (_controller, env, ctx) => {
    ctx.waitUntil(
      collectStoreUsers(env).catch((error) => {
        console.error("Failed to collect Chrome Web Store users:", error);
      }),
    );
  },
};
