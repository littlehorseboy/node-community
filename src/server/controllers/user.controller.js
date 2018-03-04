import bcrypt from 'bcrypt';

import userModule from '../modules/user.module';

/** User GET 取得 */
const userGet = (req, res) => {
  userModule.selectUser().then((result) => {
    res.send(result);
  }).catch((err) => {
    return res.send(err);
  });
};

/** User POST 新增 */
const userPost = (req, res) => {
  // 取得新增參數
  const insertValues = {
    user_name: req.body.user_name,
    user_mail: req.body.user_mail,
    user_password: bcrypt.hashSync(req.body.user_password, 10) // 密碼加密
  };
  userModule.createUser(insertValues).then((result) => {
    res.send(result);
  }).catch((err) => {
    return res.send(err);
  });
};

/** User PUT 修改 */
const userPut = (req, res) => {
  // 取得修改id
  const userId = req.params.user_id;
  // 取得新增參數
  const insertValues = req.body;
  userModule.modifyUser(insertValues, userId).then((result) => {
    res.send(result);
  }).catch((err) => {
    return res.send(err);
  });
};

/** User DELETE 新增 */
const userDelete = (req, res) => {
  // 取得刪除id
  const userId = req.params.user_id;
  userModule.deleteUser(userId).then((result) => {
    res.send(result);
  }).catch((err) => {
    return res.send(err);
  });
};

/** User POST 登入(Login) */
const userLogin = (req, res, next) => {
  // 取得帳密
  const insertValues = req.body;
  userModule.selectUserLogin(insertValues).then((result) => {
    res.send(result);
  }).catch((err) => {
    // 在 module中 reject() 的錯誤訊息
    // 會被 .catch 接受經由第三個參數 next 傳送來
    next(err);
  });
};

export default {
  userGet,
  userPost,
  userPut,
  userDelete,
  userLogin
};
