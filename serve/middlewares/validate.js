import _ from 'lodash';
import joi from 'joi';

import {ERR_PARAMS} from "../common/error.js";

export const validate = (schema = {}) => {
	const { opt = {} } = schema;
	const options = _.defaultsDeep(opt, {
    	allowUnknown: true,
  	});
  	return async (ctx, next) => {
    	const defaultValidateKeys = ['body', 'query', 'params'];
    	const needValidateKeys = _.intersection(defaultValidateKeys, Object.keys(schema));

    	const errors = [];
    	needValidateKeys.find((item) => {
      		const toValidateObj = item === 'body' ? ctx.request.body : ctx[item];
      		const result = joi.validate(toValidateObj, schema[item], options);
      		if (result.error) {
        		errors.push(result.error.details[0]);
        		return true;
      		}
      		_.assignIn(toValidateObj, result.value);
      		return false;
    	});

    	if (errors.length !== 0) {
      		const msg = errors[0].message.replace(/"/g, '');
			ctx.body = ERR_PARAMS.setMessage(msg);
			return;
    	}

    	await next();
  	};
};

export default validate;
