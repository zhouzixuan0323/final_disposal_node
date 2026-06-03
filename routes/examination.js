let {
  checkUsername,
  addUserNicknameAndGender,
  getQuestionData,
  addRankingData,
  getRankingUsers,
} = require("../controllers/examination");
const router = require("koa-router")();

// 路由前缀
router.prefix("/examination");

// 检查用户是否存在
router.get("/checkUsername", checkUsername);

// 添加用户
router.post("/adduser", addUserNicknameAndGender);

// 题目
router.get("/question", getQuestionData);

// 排行榜
router.post("/ranking", addRankingData);

// 获取排行榜上的用户
router.get("/rankingUser", getRankingUsers);

module.exports = router;
