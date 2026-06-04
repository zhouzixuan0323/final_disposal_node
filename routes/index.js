const router = require("koa-router")();
const mysql = require("../database/mysql");

router.get("/", async (ctx, next) => {
  ctx.body = "koa2 index";
});

router.get("/string", async (ctx, next) => {
  ctx.body = "koa2 string";
});

router.get("/json", async (ctx, next) => {
  ctx.body = {
    title: "koa2 json",
  };
});

router.get("/health", async (ctx, next) => {
  ctx.body = {
    code: 200,
    status: "ok",
  };
});

router.get("/health/db", async (ctx, next) => {
  await mysql.query("select 1 as ok");
  ctx.body = {
    code: 200,
    status: "ok",
  };
});

module.exports = router;
