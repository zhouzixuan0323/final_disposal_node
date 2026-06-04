const {
  findRubbishDetailList,
  findRubbishTypeDataCount,
  findRubbishTypeIntroduce,
  findSearchRubbishList,
  findSearchRubbishCount,
  findRubbishType,
} = require("../models/rubbishDetail");
const Joi = require("joi");

function parseJsonArray(value) {
  if (!value) return [];
  const parsed = JSON.parse(value);
  return Array.isArray(parsed) ? parsed : [];
}

function pageCount(total, pageSize) {
  return Math.max(Math.ceil(total / pageSize) - 1, 0);
}

module.exports.rubbishDetailList = async (ctx, next) => {
  const schema = Joi.object({
    rubbishType: Joi.string().required(),
    page: Joi.number().integer().min(0).default(0),
    pageSize: Joi.number().integer().min(1).max(100).default(10),
  });
  let { rubbishType, page, pageSize } = await schema.validateAsync(
    ctx.request.query
  );

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
  if (rubbishTypeDataCount[0] && rubbishTypeIntroduce[0]) {
    // 找到就返回
    return (ctx.body = {
      code: 200,
      data: {
        items: rubbishDetailData,
        pages: pageCount(rubbishTypeDataCount[0].total, pageSize),
        introduce: rubbishTypeIntroduce[0].introduce,
        ask: parseJsonArray(rubbishTypeIntroduce[0].ask),
        color: rubbishTypeIntroduce[0].color,
        prioritizedApproach: parseJsonArray(
          rubbishTypeIntroduce[0].prioritizedApproach
        ),
      },
    });
  }
  // 没有找到数据
  ctx.status = 404;
  ctx.body = {
    code: 404,
    message: "未找到垃圾分类数据",
  };
};

module.exports.findRubbishSearchList = async (ctx, next) => {
  const schema = Joi.object({
    rubbishType: Joi.string().allow("", null).default(""),
    page: Joi.number().integer().min(0).default(0),
    pageSize: Joi.number().integer().min(1).max(100).default(10),
    rubbishName: Joi.string().required(),
  });
  let { rubbishType, page, pageSize, rubbishName } = await schema.validateAsync(
    ctx.request.query
  );
  rubbishType = rubbishType || "";

  let searchRubbishList = await findSearchRubbishList({
    rubbishType,
    page,
    pageSize,
    rubbishName,
  });

  let searchRubbishCount = await findSearchRubbishCount({
    rubbishType,
    rubbishName,
  });

  ctx.body = {
    code: 200,
    data: {
      items: searchRubbishList,
      pages: pageCount(searchRubbishCount[0].total, pageSize),
    },
  };
};

module.exports.findRubbishType = async (ctx, next) => {
  const schema = Joi.object({
    id: Joi.number().integer().min(1).required(),
  });
  let { id } = await schema.validateAsync(ctx.request.query);
  let rubbishType = await findRubbishType(id);

  if (rubbishType[0]) {
    rubbishType[0].prioritizedApproach = parseJsonArray(
      rubbishType[0].prioritizedApproach
    );
    return (ctx.body = {
      code: 200,
      message: "请求成功",
      data: {
        rubbishType: rubbishType[0],
      },
    });
  }

  ctx.status = 404;
  ctx.body = {
    code: 404,
    message: "未找到垃圾详情",
  };
};
