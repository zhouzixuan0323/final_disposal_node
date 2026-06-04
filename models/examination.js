const mysql = require("../database/mysql");

// 查找用户名是否存在
module.exports.findUsername = async ({ id, username }) => {
  const sql = "select * from users where uid = ? or username = ?;";
  return mysql.query(sql, [id, username]);
};

// 添加一个用户
module.exports.addUser = async ({ id, username, gender }) => {
  const sql = "insert into users(uid, username, gender) values(?, ?, ?);";
  return mysql.query(sql, [id, username, gender]);
};

// 获取题目信息
module.exports.getQuestionData = async () => {
  let sql = `SELECT * FROM question ORDER BY RAND() LIMIT 10;`;
  return mysql.query(sql);
};

// 添加排行榜
module.exports.addRankingData = async ({ raid, username, score, uid }) => {
  const sql =
    "insert into ranking(raid, username, score, uid) values(?, ?, ?, ?);";
  return mysql.query(sql, [raid, username, score, uid]);
};

// 查找当前用户在排行榜中是否存在
module.exports.findRankingUser = async ({ uid }) => {
  const sql = "select score from ranking where uid = ?";
  return mysql.query(sql, [uid]);
};

// 修改排行榜
module.exports.updateRankingScore = async ({ uid, score }) => {
  const sql = "update ranking set score = ? where uid = ?";
  return mysql.query(sql, [score, uid]);
};

// 获取排行榜所有用户信息
module.exports.findRankingUsers = async () => {
  let sql = `select ra.raid, ra.score, ra.username, u.gender, ra.date from ranking ra, users u where ra.uid = u.uid order by score DESC LIMIT 0,10;`;
  return mysql.query(sql);
};
