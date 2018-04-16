
export const Err = function(code, message, data) {
	this.code = code || 0;
	this.message = message || "OK";
	this.data = data || null; // 请求数据
}

Err.prototype.setMessage = function(message = "OK"){
	this.message = message;
	return this;
}

Err.prototype.setCode = function(code = 0){
	this.code = code; 
	return this;
}

Err.prototype.setData = function(data){
	this.data = data;
	return this;
}

export const ERR = new Err(-1, "unknown error");
export const ERR_OK = new Err();
export const ERR_PARAMS = new Err(1, "参数错误");
export const ERR_UNATUH = new Err(2, "未认证");
export const ERR_NOT_FOUND = new Err(3, "未找到记录");

export default {
	ERR,
	ERR_OK,
	ERR_PARAMS,
	ERR_UNATUH,
	ERR_NOT_FOUND,
};




