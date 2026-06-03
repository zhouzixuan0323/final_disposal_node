const {
  findRubbishDetailList,
  findRubbishTypeDataCount,
  findRubbishTypeIntroduce,
  findSearchRubbishList,
  findSearchRubbishCount,
  findRubbishType,
} = require("../models/rubbishDetail");
module.exports.rubbishDetailList = async (ctx, next) => {
  let { rubbishType, page, pageSize } = ctx.request.query;
  // 获取垃圾类型中垃圾总数
  let rubbishTypeDataCount = await findRubbishTypeDataCount(rubbishType);
  // 获取垃圾类型中垃圾数据
  let rubbishDetailData = await findRubbishDetailList(
    rubbishType,
    page,
    pageSize
  );
  let rubbishTypeIntroduce = await findRubbishTypeIntroduce(rubbishType);
  // 判断是否找到数据
  if (rubbishDetailData[0] && rubbishTypeDataCount[0]) {
    // 找到就返回
    return (ctx.body = {
      code: 200,
      data: {
        items: rubbishDetailData,
        pages: Math.ceil(rubbishTypeDataCount[0].total / pageSize) - 1,
        introduce: rubbishTypeIntroduce[0].introduce,
        ask: JSON.parse(rubbishTypeIntroduce[0].ask),
        color: rubbishTypeIntroduce[0].color,
        prioritizedApproach: JSON.parse(
          rubbishTypeIntroduce[0].prioritizedApproach
        ),
      },
    });
  }
  // 没有找到数据
  ctx.body = {
    code: 500,
    message: "请求失败",
  };
};

module.exports.findRubbishSearchList = async (ctx, next) => {
  let { rubbishType, page, pageSize, rubbishName } = ctx.request.query;
  let searchRubbishList = await findSearchRubbishList({
    rubbishType,
    page,
    pageSize,
    rubbishName,
  });

  let searchRubbishCount = await findSearchRubbishCount(rubbishName);

  ctx.body = {
    code: 200,
    data: {
      items: searchRubbishList,
      pages: Math.ceil(searchRubbishCount[0].total / pageSize) - 1,
    },
  };
};

module.exports.findRubbishType = async (ctx, next) => {
  let { id } = ctx.request.query;
  let rubbishType = await findRubbishType(id);

  rubbishType[0].prioritizedApproach = JSON.parse(
    rubbishType[0].prioritizedApproach
  );
  if (rubbishType[0]) {
    return (ctx.body = {
      code: 200,
      message: "请求成功",
      data: {
        rubbishType: rubbishType[0],
      },
    });
  }
  ctx.body = {
    code: 500,
    message: "请求失败",
  };
};
