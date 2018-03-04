import Joi from 'joi';

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

const envVarSchema = Joi.object().keys({
  NODE_ENV: Joi.string().default('development').allow(['development', 'production']),
  PORT: Joi.number().default(8080),
  VERSION: Joi.string(),
  MYSQL_HOST: Joi.string().default('127.0.0.1'),
  MYSQL_PORT: Joi.number().default(3306),
  MYSQL_USER: Joi.string(),
  MYSQL_PASS: Joi.string(),
  MYSQL_DATABASE: Joi.string()
}).unknown().required();

const { error, value: envVars } = Joi.validate(process.env, envVarSchema);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  version: envVars.VERSION, // 版本
  env: envVars.NODE_ENV, // 開發模式
  port: envVars.PORT, // API 阜號
  mysqlHost: envVars.MYSQL_HOST, // 主機名稱(MYSQL_HOST)
  mysqlPort: envVars.MYSQL_PORT, // 連接阜號(MYSQL_PORT)
  mysqlUserName: envVars.MYSQL_USER, // 用戶名稱(MYSQL_USER)
  mysqlPass: envVars.MYSQL_PASS, // 資料庫密碼(MYSQL_PASS)
  mysqlDatabase: envVars.MYSQL_DATABASE // 資料庫名稱(MYSQL_DATABASE)
};

export default config;
