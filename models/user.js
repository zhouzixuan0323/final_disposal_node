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
  const sql =
    "select username, username nickname, null age, gender, null address from users where username = ?";
  return await mysql.query(sql, [username]);
};

module.exports.finedUserAgeDistributeData = async () => {
  let sql = "select count(*) value, gender name from users group by gender;";
  return await mysql.query(sql);
};
