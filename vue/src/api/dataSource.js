import util from "../lib/util.js";
import gitlab from "../lib/gitlab.js";

var dataSource = {
	dataSourceMap: {},
};

var apiBaseUrl = "http://keepwork.com/api/wiki/models/";


function gitApiProxy(funcname, params, success, error) {
	var path = params.path;
	if (params.username && params.sitename) {
		path = params.username + "/" + params.sitename;
	}
	
	dataSource.getDataSourceByPath(path, function(ds){
		if (ds.type == "gitlab") {
			gitlab.init(ds, function() {
				(gitlab[funcname])(params, success, error);
				console.log(ds);
			}, error);
		}
	}, error);
}

dataSource.getDataSourceByPath = function(path, success, error){
	var paths = path.split("/");	
	var username = paths[1];
	var sitename = paths[2];
	var self = this;

	self.getDataSource({username, sitename}, success, error);
}

dataSource.getDataSource = function(params, success, error) {
	var self = this;
	var defaultSitename = "__keepwork__";

	params.sitename = params.sitename || defaultSitename;
	self.getDataSourceList(params, function(dataSourceList){
		console.log(params);
		for (var i = 0; i < (dataSourceList || []).length; i++) {
			var ds = dataSourceList[i];
			if (ds.sitename == params.sitename) {
				success && success(ds);
				return;
			}
		}	

		error && error();
	}, error);
}
// 获取用户数据源列表
dataSource.getDataSourceList = function(params, success, error) {
	var self = this;
	var url = apiBaseUrl + "site_data_source/getByUsername";

	util.get(url, {
		username:"xiaoyao",
	}, function(data) {
		console.log(data);
		success && success(data);
	}, function() {
		error && error();
	});
}

// 读文件
dataSource.getContent = function(params, success, error) {
	var self = this;
	
	gitApiProxy("getContent", params, success, error);
}

// 获取原生内容
dataSource.getRawContent = function(params, success, error) {
	gitApiProxy("getRawContent", params, success, error);
}

// 写文件
dataSource.writeFile = function(params, success, error) {
	gitApiProxy("writeFile", params, success, error);
}

// 上传图片
dataSource.uploadImage = function(params, success, error) {
	gitApiProxy("uploadImage", params, success, error);
}

// 上传文件
dataSource.uploadFile = function(params, success, error) {
	gitApiProxy("uploadFile", params, success, error);
}


export default dataSource;
