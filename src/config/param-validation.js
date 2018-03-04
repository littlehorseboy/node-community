import Joi from 'joi';

export default {
  // POST /api/article
  createArticle: {
    body: {
      user_id: Joi.number().required(),
      article_title: Joi.string().required(),
      article_tag: Joi.string().required(),
      article_content: Joi.string().min(20).required()
    }
  },
  createUser: {
    body: {
      user_name: Joi.string().required(),
      user_mail: Joi.string().email().trim().required(),
      user_password: Joi.string().regex(/[a-zA-Z0-9]{6,30}$/).required()
    }
  }
};
