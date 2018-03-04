import mysql from 'mysql';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import config from '../../config/config';
import APPError from '../helper/AppError';

const connectionPool = mysql.createPool({
  connectionLimit: 10, // 限制池子連線人數
  host: config.mysqlHost, // 主機名稱
  user: config.mysqlUserName, // 用戶名稱
  password: config.mysqlPass, // 資料庫密碼
  database: config.mysqlDatabase // 資料庫名稱
});

/** User GET 取得 */
const selectUser = () => {
  return new Promise((resolve, reject) => {
    connectionPool.getConnection((connectionError, connection) => {
      if (connectionError) {
        reject(connectionError);
      } else {
        connection.query('SELECT * FROM user', (error, result) => {
          if (error) {
            console.log('SQL error: ', error);
            reject(error);
          } else {
            resolve(result);
          }
          connection.release();
        });
      }
    });
  });
};

/** User POST 新增 */
const createUser = (insertValues) => {
  return new Promise((resolve, reject) => {
    connectionPool.getConnection((connectionError, connection) => {
      if (connectionError) {
        reject(connectionError);
      } else {
        connection.query('INSERT INTO user SET ?', insertValues, (error, result) => {
          if (error) {
            console.log('SQL error: ', error);
            reject(error);
          } else if (result.affectedRows === 1) {
            resolve(`新增成功! user_id: ${result.insertId}`);
          }
          connection.release();
        });
      }
    });
  });
};

/** User PUT 修改 */
const modifyUser = (insertValues, userId) => {
  return new Promise((resolve, reject) => {
    connectionPool.getConnection((connectionError, connection) => {
      if (connectionError) {
        reject(connectionError);
      } else {
        connection.query('UPDATE user SET ? WHERE user_id= ? ', [insertValues, userId], (error, result) => {
          if (error) {
            console.log('SQL error: ', error);
            reject(error);
          } else if (result.affectedRows === 0) {
            resolve('請確認修改Id!');
          } else if (result.message.match('Changed: 1')) {
            resolve('資料修改成功!');
          } else {
            resolve('資料無異動');
          }
          connection.release();
        });
      }
    });
  });
};

/** User DELETE 新增 */
const deleteUser = (userId) => {
  return new Promise((resolve, reject) => {
    connectionPool.getConnection((connectionError, connection) => {
      if (connectionError) {
        reject(connectionError);
      } else {
        connection.query('DELETE FROM user WHERE user_id = ?', userId, (error, result) => {
          if (error) {
            console.log('SQL error: ', error);
            reject(error);
          } else if (result.affectedRows === 1) {
            resolve('刪除成功');
          } else {
            resolve('刪除失敗');
          }
          connection.release();
        });
      }
    });
  });
};

/** User GET (Login)登入取得資訊 */
const selectUserLogin = (insertValues) => {
  return new Promise((resolve, reject) => {
    connectionPool.getConnection((connectionError, connection) => {
      if (connectionError) {
        reject(connectionError);
      } else {
        connection.query('SELECT * FROM user WHERE user_mail = ?', insertValues.user_mail, (error, result) => {
          if (error) {
            console.log('SQL error: ', error);
            reject(error);
          } else if (Object.keys(result).length === 0) {
            reject(new APPError.LoginError1()); // 信箱尚未註冊
          } else {
            const dbHashPassword = result[0].user_password; // 資料庫加密後的密碼
            const userPassword = insertValues.user_password; // 使用者登入時輸入的密碼
            bcrypt.compare(userPassword, dbHashPassword).then((res) => { // 解密驗證
              if (res) {
                // 產生JWT
                const payload = {
                  user_id: result[0].user_id,
                  user_name: result[0].user_name,
                  user_mail: result[0].user_mail
                };
                // 取得 API Token
                const token = jwt.sign({
                  payload,
                  exp: Math.floor(Date.now() / 1000) + (60 * 15)
                }, 'my_secret_key');
                resolve(Object.assign({ code: 200 }, { message: '登入成功', token }));
              } else {
                reject(new APPError.LoginError2()); // 登入失敗, 輸入的密碼有誤
              }
            });
          }
          connection.release();
        });
      }
    });
  });
};

export default {
  selectUser,
  createUser,
  modifyUser,
  deleteUser,
  selectUserLogin
};
