import * as joi from 'joi';

const schema = joi.object({
  NODE_ENV: joi.string().valid('development', 'production', 'test').default('development').required(),
  TABLE_MAX_X_COORDINATE: joi.number().integer().min(1).default(5).required(),
  TABLE_MAX_Y_COORDINATE: joi.number().integer().min(1).default(5).required(),
});

export default schema;
