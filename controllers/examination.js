const {
  findUsername,
  addUser,
  getQuestionData,
  addRankingData,
  findRankingUser,
  updateRankingScore,
  findRankingUsers,
} = require("../models/examination");
const Joi = require("joi");

// 检查用户名是否存在
module.exports.checkUsername = async (ctx, next) => {
  const schema = Joi.object({
    id: Joi.string().required(),
    username: Joi.string().min(2).max(12).required(),
  });
  let { id, username } = await schema.validateAsync(ctx.request.query);

  let userExist = await findUsername({ id, username });

  if (userExist[0]) {
    return (ctx.body = {
      code: 200,
      message: "用户存在",
    });
  }

  ctx.status = 404;
  ctx.body = {
    code: 404,
    message: "用户不存在",
  };
};

// 添加一个用户
module.exports.addUserNicknameAndGender = async (ctx, next) => {
  let { id, username, gender } = ctx.request.body;

  const schema = Joi.object({
    id: Joi.string().required(),
    username: Joi.string().min(2).max(12).required(),
    gender: Joi.number().valid(0, 1).required(),
  });

  await schema.validateAsync({ id, username, gender });

  let userExist = await findUsername({ id, username });

  if (userExist[0]) {
    ctx.status = 409;
    return (ctx.body = {
      code: 409,
      message: "用户名已存在",
    });
  }

  await addUser({ id, username, gender });

  ctx.body = {
    code: 200,
    message: "注册成功",
  };
};

// 获取题目信息
module.exports.getQuestionData = async (ctx, next) => {
  let questionData = await getQuestionData();

  ctx.body = {
    code: 200,
    data: questionData,
  };
};

// 添加排行榜
module.exports.addRankingData = async (ctx, next) => {
  let { raid, score, username, uid } = ctx.request.body;
  const schema = Joi.object({
    raid: Joi.string().required(),
    score: Joi.number().integer().min(0).required(),
    username: Joi.string().min(2).max(12).required(),
    uid: Joi.string().required(),
  });
  ({ raid, score, username, uid } = await schema.validateAsync({
    raid,
    score,
    username,
    uid,
  }));

  if (score < 10) {
    ctx.body = {
      code: 200,
      message: "分数未达到上榜要求",
    };
    return;
  }

  // 先去数据库中找有没有当前用户的排名，如果有并且分数更高就更新
  let rankingUser = await findRankingUser({ uid });

  // 如果在排行榜中找到了用户
  if (rankingUser[0]) {
    // 先判断用户当前分数是否高于排行榜中的分数，如果高于，就更新排行榜，如果不高于就不更新
    if (Number(rankingUser[0].score) < score) {
      await updateRankingScore({ score, uid });
      ctx.body = {
        code: 200,
        message: "排行榜更新成功",
      };
    } else {
      ctx.body = {
        code: 200,
        message: "这次答题没有您的最高分数高哦",
      };
    }
  } else {
    let rankingData = await addRankingData({ raid, username, score, uid });
    if (rankingData) {
      return (ctx.body = {
        code: 200,
        message: "排行榜更新成功",
      });
    }

    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: "排行榜更新失败",
    };
  }
};

// 获取所有排行榜上的用户信息
module.exports.getRankingUsers = async (ctx, next) => {
  let rankingUsers = await findRankingUsers();

  rankingUsers.forEach((item, index) => {
    rankingUsers[index].date = new Date(`${item.date}`).toLocaleString();
  });

  if (rankingUsers[0]) {
    return (ctx.body = {
      code: 200,
      data: {
        rankingUsers,
      },
    });
  }

  ctx.body = {
    code: 200,
    message: "暂无用户上榜",
  };
};
