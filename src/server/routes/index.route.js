import express from 'express';
import mysql from 'mysql';

import config from '../../config/config';
import article from './article.route';
import user from './user.route';

const router = express.Router();

/** GET /api */
router.get('/', (req, res) => {
  res.send(`路徑為: localhost: ${config.port}/api`);
});

/** mysql 連線測試 */
router.get('/sqlTest', (req, res) => {
  const connectionPool = mysql.createPool({
    connectionLimit: 10, // 限制池子連線人數
    host: config.mysqlHost, // 主機名稱
    user: config.mysqlUserName, // 用戶名稱
    password: config.mysqlPass, // 資料庫密碼
    database: config.mysqlDatabase // 資料庫名稱
  });

  connectionPool.getConnection((connectionError, connection) => {
    if (connectionError) {
      res.send(connectionError);
      console.log('連線失敗!');
    } else {
      res.send('連線成功!');
      console.log(connection);
    }
  });
});

/** Article Router */
router.use('/article', article);

/** User Router */
router.use('/user', user);

export default router;
