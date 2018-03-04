import express from 'express';
import validate from 'express-validation';

import articleCtrl from '../controllers/article.controller';
import paramValidation from '../../config/param-validation';

const router = express.Router();

router.route('/')
  .get(articleCtrl.articleGet) /** 取得 Article 所有值組 */
  .post(validate(paramValidation.createArticle), articleCtrl.articlePost); /** 新增 Article 值組 */

router.route('/:article_id')
  .put(articleCtrl.articlePut) /** 修改 Article 值組 */
  .delete(articleCtrl.articleDelete); /** 刪除 Article 值組 */

/** 利用 Middleware 取得 Header 中的 Bearer Token */
const ensureToken = (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' '); // 字串切割
    const bearerToken = bearer[1]; // 取得JWT
    req.token = bearerToken; // 在 response 中建立一個 token 參數
    next(); // 結束 Middleware 進入 articleCtrl.articlePersonalGet
  } else {
    res.status(403).send(Object.assign(
      { code: 403 },
      { message: '您尚未登入!' }
    )); // Header 查無 Bearer Token
  }
};

/** 取得某用戶的 Article 所有值組 */
router.get('/personal', ensureToken, articleCtrl.articlePersonalGet);

export default router;
