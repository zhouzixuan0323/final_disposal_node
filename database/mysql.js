// 引入mysql库
const mysql = require("mysql");
const pool = mysql.createPool({
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10), // 最大连接数
  host: process.env.DB_HOST || "localhost", // 主机
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root", // 用户名
  password: process.env.DB_PASSWORD || "123456aa", // 密码
  database: process.env.DB_NAME || "guisu", // 数据库名称
});

// 创建这个类是因为在文件外部想使用Mysql.query使用query方法，而不是直接mysql();
class Mysql {
  /***
   *
   * @param sql   sql语句
   * @param values
   * @returns {Promise<unknown>}  返回一个Promise对象，返回的数据是数据库中获取的数据
   */
  query(sql, values) {
    // 使用Promise对象返回从数据库获取到的数据
    return new Promise((resolve, reject) => {
      // 获取数据库链接，在getConnection方法中获取到connection参数
      pool.getConnection(function (err, connection) {
        if (err) {
          reject(err);
          return;
        }
        // 使用connection参数中的query方法传入sql语句，去到数据库中查询
        connection.query(sql, values, (err, result) => {
          if (err) {
            reject(err);
          } else {
            // 如果没有错误，使用Promise的resolve返回正确结果
            resolve(result);
          }
          connection.release();
        });
      });
    });
  }
}

module.exports = new Mysql();
