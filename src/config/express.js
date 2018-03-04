import express from 'express';

import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import httpStatus from 'http-status';
import expressValidation from 'express-validation';

import config from './config';
import index from '../server/routes/index.route';
import APPError from '../server/helper/AppError';

const app = express();

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// HTTP request logger middleware for node.js
app.use(morgan('dev'));

/** GET / */
app.get('/', (req, res) => {
  // res.header('Access-Control-Allow-Origin', '*'); // 此為CORS針對路由的設定方式
  // res.header('Access-Control-Allow-Headers', '*');
  res.send(`server started on port http://127.0.0.1:${config.port} (${config.env})`);
});

/** GET /api */
app.use('/api', index);

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  let errorMessage;
  let errorCode;
  let errorStatus;
  // express validation error 所有傳入參數驗證錯誤
  if (err instanceof expressValidation.ValidationError) {
    if (err.errors[0].location === 'query' || err.errors[0].location === 'body') {
      errorMessage = err.errors[0].messages;
      errorCode = 400;
      errorStatus = httpStatus.BAD_REQUEST;
    }
    const error = new APPError.APIError(errorMessage, errorStatus, true, errorCode);
    return next(error);
  }
  return next(err);
});

// error handler, send stacktrace only during development 錯誤後最後跑這邊
app.use((err, req, res, next) => {
  res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    code: err.code ? err.code : httpStatus[err.status],
    stack: config.env === 'development' ? err.stack : {}
  });
  next();
});

export default app;
