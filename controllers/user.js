let {
  findCountUser,
  findUserInfo,
  finedUserAgeDistributeData,
} = require("../models/user");
module.exports.findCountUser = async (ctx, next) => {
  let userCount = await findCountUser();
  // 判断是否找到数据
  if (userCount[0]) {
    // 找到就返回
    return (ctx.body = {
      code: 200,
      data: userCount[0],
    });
  }
  // 没有找到数据
  ctx.body = {
    code: 500,
    message: "请求失败",
  };
};

module.exports.findUserInfo = async (ctx, next) => {
  let username = "admin2";
  let userInfo = await findUserInfo(username);
  // 判断是否找到数据
  if (userInfo[0]) {
    // 返回数据
    return (ctx.body = {
      code: 200,
      data: userInfo[0],
    });
  }

  ctx.body = {
    code: 500,
    message: "请求失败",
  };
};

// 在数据库中查找所有用户的年龄分布
module.exports.finedUserAgeDistributeData = async (ctx, next) => {
  let userAgeDistributeData = await finedUserAgeDistributeData();
  if (userAgeDistributeData[0]) {
    return (ctx.body = {
      code: 200,
      data: userAgeDistributeData,
      message: "用户年龄分布数据请求成功",
    });
  }
  ctx.body = {
    code: 500,
    message: "用户年龄分布数据请求失败",
  };
};
