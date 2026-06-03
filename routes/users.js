const {
  findCountUser,
  findUserInfo,
  finedUserAgeDistributeData,
} = require("../controllers/user");

const router = require("koa-router")();

// 路由前缀
router.prefix("/users");

// 获取用户总数
router.get("/countUser", findCountUser);

// 获取单个用户的基本信息
router.get("/userInfo", findUserInfo);

// 获取用户年龄分布数据
router.get("/userAgeDistribute", finedUserAgeDistributeData);

module.exports = router;
