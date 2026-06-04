const mysql = require("../database/mysql");

module.exports.findRubbishDetailList = async (rubbishType, page, pageSize) => {
  const sql =
    "select r.rid, r.rname, c.cid from rubbish r, category c where r.cid = c.cid and c.cname = ? limit ?, ?;";
  return mysql.query(sql, [rubbishType, page * pageSize, pageSize]);
};

module.exports.findRubbishTypeDataCount = async (rubbishType) => {
  const sql =
    "select count(r.rid) total from rubbish r, category c where r.cid = c.cid and c.cname = ? group by c.cid;";
  return mysql.query(sql, [rubbishType]);
};

module.exports.findRubbishTypeIntroduce = async (rubbishType) => {
  const sql =
    "select g.gid, g.introduce, g.ask, g.color, g.prioritizedApproach from garbage_disposal g, category c where g.cid = c.cid and c.cname = ?;";
  return mysql.query(sql, [rubbishType]);
};

module.exports.findSearchRubbishList = async ({
  rubbishType,
  page,
  pageSize,
  rubbishName,
}) => {
  const values = [`%${rubbishName}%`];
  let sql =
    "select r.rname, r.rid from rubbish r inner join category c on r.cid = c.cid where r.rname like ?";

  if (rubbishType) {
    sql += " and c.cname = ?";
    values.push(rubbishType);
  }

  sql += " limit ?, ?";
  values.push(page * pageSize, pageSize);
  return mysql.query(sql, values);
};

module.exports.findSearchRubbishCount = async ({ rubbishType, rubbishName }) => {
  const values = [`%${rubbishName}%`];
  let sql =
    "select count(r.rid) total from rubbish r inner join category c on r.cid = c.cid where r.rname like ?";

  if (rubbishType) {
    sql += " and c.cname = ?";
    values.push(rubbishType);
  }

  return mysql.query(sql, values);
};

module.exports.findRubbishType = async (id) => {
  const sql =
    "select c.cname, r.rname, g.introduce, g.prioritizedApproach, g.color from rubbish r inner join category c on r.cid = c.cid inner join garbage_disposal g on g.cid = c.cid where r.rid = ?;";
  return mysql.query(sql, [id]);
};
