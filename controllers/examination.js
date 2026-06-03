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
  let { id, username } = ctx.request.query;

  let userExist = await findUsername({ id, username });

  if (userExist[0]) {
    return (ctx.body = {
      code: 200,
      message: "用户存在",
    });
  }

  ctx.body = {
    code: 500,
    message: "用户不存在",
  };
};

// 添加一个用户
module.exports.addUserNicknameAndGender = async (ctx, next) => {
  let { id, username, gender } = ctx.request.body;

  const schema = Joi.object({
    username: Joi.string().min(2).max(12).required(),
    gender: Joi.number().required(),
  });

  try {
    await schema.validateAsync({ username, gender });
  } catch (err) {
    return (ctx.body = {
      code: 500,
      message: "昵称字数不能小于2并且不能大于12",
    });
  }

  let userExist = await findUsername({ id, username });

  if (userExist[0]) {
    return (ctx.body = {
      code: 500,
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

  // 先去数据库中找有没有当前用户的排名，如果有并且分数更高就更新
  let rankingUser = await findRankingUser({ uid });

  // 如果在排行榜中找到了用户
  if (rankingUser[0]) {
    // 先判断用户当前分数是否高于排行榜中的分数，如果高于，就更新排行榜，如果不高于就不更新
    if (rankingUser[0].score < score) {
      console.log("111");
      await updateRankingScore({ score, uid });
      ctx.body = {
        code: 200,
      };
    } else {
      ctx.body = {
        code: 200,
        message: "这次答题没有您的最高分数高哦",
      };
    }
  } else {
    if (score < 10) return;
    console.log(111);
    let rankingData = await addRankingData({ raid, username, score, uid });
    if (rankingData) {
      return (ctx.body = {
        code: 200,
        message: "排行榜更新成功",
      });
    }

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
