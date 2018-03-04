import articleModule from '../modules/article.module';

/** Article GET 取得 */
const articleGet = (req, res) => {
  articleModule.selectArticle().then((result) => {
    res.send(result);
  }).catch((err) => {
    return res.send(err);
  });
};

/** Article POST 新增 */
const articlePost = (req, res) => {
  // 取得新增參數
  const insertValues = req.body;
  articleModule.createArticle(insertValues).then((result) => {
    res.send(result);
  }).catch((err) => {
    return res.send(err);
  });
};

/** Article PUT 修改 */
const articlePut = (req, res) => {
  // 取得修改id
  const userId = req.params.article_id;
  // 取得新增參數
  const insertValues = req.body;
  articleModule.modifyArticle(insertValues, userId).then((result) => {
    res.send(result);
  }).catch((err) => {
    return res.send(err);
  });
};

/** Article DELETE 新增 */
const articleDelete = (req, res) => {
  // 取得刪除id
  const userId = req.params.article_id;
  articleModule.deleteArticle(userId).then((result) => {
    res.send(result);
  }).catch((err) => {
    return res.send(err);
  });
};

/** Article GET JWT取得個人文章 */
const articlePersonalGet = (req, res) => {
  articleModule.selectPersonalArticle(req.token).then((result) => {
    res.send(result);
  }).catch((err) => {
    return res.status(401).send(err);
  });
};

export default {
  articleGet,
  articlePost,
  articlePut,
  articleDelete,
  articlePersonalGet
};
