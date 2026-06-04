const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
const env = require("dotenv");
const cors = require("koa2-cors");

env.config();

const index = require("./routes/index");
// const users = require('./routes/users')
// 用户数据
const users = require("./routes/users");
// 垃圾详情页面
const rubbishDetail = require("./routes/rubbishDetail");

// 考试页面
const examination = require("./routes/examination");

// middlewares
app.use(logger());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    const status = err.isJoi ? 400 : err.status || 500;
    ctx.status = status;
    ctx.body = {
      code: status,
      message: status === 500 ? "服务器内部错误" : err.message,
    };
    if (status >= 500) {
      ctx.app.emit("error", err, ctx);
    }
  }
});

app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
);
app.use(json());
app.use(require("koa-static")(__dirname + "/public"));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
  })
);

app.use(
  views(__dirname + "/views", {
    extension: "pug",
  })
);

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(index.routes(), index.allowedMethods());
// app.use(users.routes(), users.allowedMethods())
app.use(users.routes(), users.allowedMethods());
//
app.use(rubbishDetail.routes(), rubbishDetail.allowedMethods());
// 挂在考试页面
app.use(examination.routes(), examination.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;
