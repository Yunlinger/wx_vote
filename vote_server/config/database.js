// config/database.js

// 引入mysql插件
const mysql = require('mysql');

// 配置连接数据库的信息
const db = mysql.createConnection({
  host: 'localhost', // 主机
  port: '3306', // 端口，mysql默认端口就是3306
  user: 'root', // 用户名
  password: 'lv7781661', // 密码
  database: 'vote_app' // 数据库
});

// 连接数据库状态信息打印
db.connect((err) => {
  if (err) {
    console.error('数据库连接失败: ' + err);
    return;
  }
  console.log('数据库连接成功');
});

module.exports = db;
