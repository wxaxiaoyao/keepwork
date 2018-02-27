
define([
], function(){
	var toolfunc = {};

	// 是否为空对象
	toolfunc.isEmptyObject = function(obj) {
		for (var key in obj) {
			return false;
		}

		return true;
	}

	// 是否是对象
	toolfunc.isObject = function(obj) {
		if (typeof(obj) == "object" && obj.__proto__.constructor.name == "Object") {
			return true;
		}

		return false;
	}

	// 是否为数组
	toolfunc.isArray = function(obj) {
		if (typeof(obj) == "object" && obj.__proto__.constructor.name == "Array") {
			return true;
		}

		return false;
	}

	// angular extend
	toolfunc.extend = function(dst, src) {
		return Object.assign(dst, src);
	}

	// 继承
	toolfunc.mixin = function(proto, mixins)	{
		proto = proto || {};

		if (toolfunc.isArray(mixins)) {
			for (var i = 0; i < mixins.length; i++) {
				toolfunc.extend(proto, mixins[i]);
			}	
		} else {
			toolfunc.extend(proto, mixins);
		}

		return proto;
	}


	return toolfunc;
});
