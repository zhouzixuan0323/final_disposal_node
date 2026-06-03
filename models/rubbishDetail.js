const mysql = require("../database/mysql");

module.exports.findRubbishDetailList = async (rubbishType, page, pageSize) => {
  let sql = `select r.rid, r.rname, c.cid from rubbish r, category c where r.cid = c.cid and r.cid = (select cid from category where cname = '${rubbishType}') limit ${
    page * pageSize
  }, ${pageSize};`;
  return mysql.query(sql);
};

module.exports.findRubbishTypeDataCount = async (rubbishType) => {
  let sql = `select count(r.rid) total from rubbish r, category c where r.cid = c.cid and r.cid = (select cid from category where cname = '${rubbishType}') group by c.cid;`;
  return mysql.query(sql);
};

module.exports.findRubbishTypeIntroduce = async (rubbishType) => {
  let sql = `select g.gid, g.introduce, g.ask, g.color, g.prioritizedApproach from garbage_disposal g, category c where g.cid = c.cid and g.cid = (select cid from category where cname = '${rubbishType}');`;
  return mysql.query(sql);
};

module.exports.findSearchRubbishList = async ({
  page,
  pageSize,
  rubbishName,
}) => {
  let sql = `select rname,rid from rubbish where rname LIKE '%${rubbishName}%' or rname LIKE '%${rubbishName}' or rname LIKE '${rubbishName}%' LIMIT ${page}, ${pageSize} `;
  return mysql.query(sql);
};

module.exports.findSearchRubbishCount = async (rubbishName) => {
  let sql = `select count(rname) total from rubbish where rname LIKE '%${rubbishName}%' or rname LIKE '%${rubbishName}' or rname LIKE '${rubbishName}%';`;
  return mysql.query(sql);
};

module.exports.findRubbishType = async (id) => {
  let sql = `select cname, rname, introduce, prioritizedApproach, color from category c, rubbish r, garbage_disposal g where r.cid = c.cid and g.cid = r.cid and r.rid = '${id}';`;
  return mysql.query(sql);
};
