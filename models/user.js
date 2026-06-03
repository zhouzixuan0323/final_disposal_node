// 引入mysql
const mysql = require("../database/mysql");

// 获取用户总数量
module.exports.findCountUser = async () => {
  // sql语句
  let sql = "select count(*) count from users;";
  return await mysql.query(sql);
};

// 获取当前用户基本信息
module.exports.findUserInfo = async (username) => {
  let sql = `select username,nickname,age,gender,address from users u, userinfo ui where u.uid = ui.uid and (select uid from users where username = '${username}') = ui.uid`;
  return await mysql.query(sql);
};

module.exports.finedUserAgeDistributeData = async () => {
  let sql = `select count(age) value, age name from userinfo GROUP BY age;`;
  return await mysql.query(sql);
};
