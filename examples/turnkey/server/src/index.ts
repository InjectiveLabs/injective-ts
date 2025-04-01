import { serve } from "@hono/node-server";
import "dotenv/config";
import { Hono } from "hono";
import { turnkeyRoute } from "./turnkey-route.js";
import { cors } from "hono/cors";
const app = new Hono();

app.use("*", cors({
  origin: "http://localhost:5173",
  allowHeaders: ["Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const routes = app.route("/turnkey", turnkeyRoute);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

export type AppType = typeof routes;
