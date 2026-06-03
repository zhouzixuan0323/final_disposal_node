let {
  rubbishDetailList,
  findRubbishSearchList,
  findRubbishType,
} = require("../controllers/rubbishDetail");
const router = require("koa-router")();

// 路由前缀
router.prefix("/rubbish");

router.get("/list", rubbishDetailList);

router.get("/search", findRubbishSearchList);

router.get("/rubbishType", findRubbishType);

module.exports = router;
