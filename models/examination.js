const mysql = require("../database/mysql");

// 查找用户名是否存在
module.exports.findUsername = async ({ id, username }) => {
  let sql = `select * from users where uid = '${id}' or username = '${username}';`;
  return mysql.query(sql);
};

// 添加一个用户
module.exports.addUser = async ({ id, username, gender }) => {
  let sql = `insert into users VALUES('${id}','${username}', ${gender});`;
  return mysql.query(sql);
};

// 获取题目信息
module.exports.getQuestionData = async () => {
  let sql = `SELECT * FROM question ORDER BY RAND() LIMIT 10;`;
  return mysql.query(sql);
};

// 添加排行榜
module.exports.addRankingData = async ({ raid, username, score, uid }) => {
  let sql = `insert into ranking(raid, username, score, uid) VALUES('${raid}', '${username}', '${score}', '${uid}');`;
  return mysql.query(sql);
};

// 查找当前用户在排行榜中是否存在
module.exports.findRankingUser = async ({ uid }) => {
  let sql = `select score from ranking where uid = '${uid}'`;
  return mysql.query(sql);
};

// 修改排行榜
module.exports.updateRankingScore = async ({ uid, score }) => {
  let sql = `update ranking set score = '${score}' where uid = '${uid}'`;
  return mysql.query(sql);
};

// 获取排行榜所有用户信息
module.exports.findRankingUsers = async () => {
  let sql = `select ra.raid, ra.score, ra.username, u.gender, ra.date from ranking ra, users u where ra.uid = u.uid order by score DESC LIMIT 0,10;`;
  return mysql.query(sql);
};
