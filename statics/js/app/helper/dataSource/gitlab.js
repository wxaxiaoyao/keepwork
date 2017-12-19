
define([
	"app",
    'js-base64',
], function(app){
	
    function encodeUrl(url) {
		return encodeURIComponent(url).replace(/\./g,'%2E')
    }

	function gitlabFactory(config) {
		var gitlab = {};
		

		gitlab.init = function(config) {
			if (!config) {
				return ;
			}
			var self = this;
			self.apiBaseUrl = config.api_base_url;
			self.rawBaseUrl = config.raw_base_url;
			self.token = config.token;
			self.projectName = config.project_name;
			self.projectId = config.project_id;
			self.lastCommitId = config.last_commit_id || "master";
			self.httpHeader = {"PRIVATE-TOKEN": config.token}
		}

		gitlab.httpRequest = function(method, url, data, success, error) {
			var self = this;
			var config = {
				method: method,
				url: self.apiBaseUrl + url,
				headers: {"PRIVATE-TOKEN":self.token},
				skipAuthorization: true,  // 跳过插件satellizer认证
				isShowLoading:data.isShowLoading == undefined ? true : data.isShowLoading,
			};

			data = data || {};
			data.per_page = 100;

			if (method == "POST" || method == "PUT") {
				config.data = data;
			} else {
				config.params = data;
			}

			var result = undefined;
			var _success = function (response) {
				//console.log(response);
				if (response.status < 200 || response.status >=300) {
					error && error(response);
					return;
				}

				var headers = (typeof(response.headers) == "function") && response.headers();
				if (headers && headers["x-next-page"] && data.isFetchAll) {
					data.page = parseInt(headers["x-next-page"]);
					result = (result || []).concat(response.data);
					//console.log(result);
					$http(config).then(_success).catch(failed);
				} else {
					//console.log(response);
					result = result ? (result.concat(response.data)) : response.data;
					typeof success == 'function' && success(result);
				}
			};
			var _error = function (response) {
				//console.log(response);
				typeof error == 'function' && error(response);
			};

			app.ng_objects.$http(config).then(_success).catch(_error);
		}

		gitlab.getFile = function(params, success, error) {
			var self = this;
			var path = encodeUrl(params.path);
			var url = "/projects/" + self.projectId + "/repository/files/" + path + "?ref=" + self.lastCommitId;

			self.httpRequest("GET", url, {},  success, error);
		}

		gitlab.getContent = function(params, success, error) {
			var self = this;
			self.getFile(params, function(data){
				success && success(Base64.decode(data.content));
			}, error);
		}

		gitlab.deleteFile = function(params, success, error) {
			var self = this;
			var path = encodeUrl(params.path);
			var url = "/projects/" + self.projectId + "/repository/files/" + path;

			params.branch = params.branch || "master";
			params.commit_message = "keepwork commit:" + params.path;
			self.httpRequest("DELETE", url, params, success, error);
		}

		gitlab.writeFile = function(params, success, error) {
			var self = this;
			var path = encodeUrl(params.path);
			var url = "/projects/" + self.projectId + "/repository/files/" + path;

			params.branch = params.branch || "master";
			params.commit_message = "keepwork commit:" + params.path;

			self.getFile(params, function(){
				self.httpRequest("PUT", url, params, success, error);
			}, function(){
				self.httpRequest("POST", url, params, success, error);
			});
		}

		gitlab.getTree = function(params, success, error, filter) {
			var self = this;
			var url = "/projects/" + self.projectId + "/repository/tree";
			params.ref = self.lastCommitId;

			filter = filter || function(node) {
				var path = node.path;
				if (node.type == "tree") {
					node.text = node.name;
					node.url = node.path;
					return true;
				}
				if (path.indexOf(".md") == path.length - 3) {
					node.text = node.name.substring(0, node.name.length-3);
					node.url = node.path.substring(0, node.path.length-3);
					return true;
				}
				return false;
			}
			//params.isFetchAll = params.recursive;
			self.httpRequest("GET", url, params, function(datas){
				var roottree = [], i, j, k, name;
				for (i = 0; i < datas.length; i++) {
					var node = datas[i];
					var paths = node.path.split("/");
					var tree = roottree;
					var path = "";

					if (filter && !filter(node)) {
						continue;
					}

					for (j = 0; j < paths.length - 1; j++) {
						name = paths[j];
						for (k = 0; k < tree.length; k++) {
							if (tree[k].name == name && tree[k].type == "tree") {
								break;
							}
						}
						if (k == tree.length) {
							tree.push({
								path: paths.slice(0,j+1).join("/"), 
								text:name, 
								name:name, 
								type:"tree", 
								nodes:[]
							});
							tree[k].url = tree[k].path;
						}
						tree = tree[k].nodes;
						
					}
					for (k = 0; k < tree.length; k++) {
						if (tree[k].name == node.name && tree[k].type == node.type){
							break;
						}
					}

					if (k == tree.length) {
						node.nodes = [];
						tree.push(node);
					} 
					tree = tree[k];

					tree.type = node.type;
					tree.id = node.id;
					tree.path = node.path;
					tree.name = node.name;
					tree.username = paths[0];
					tree.sitename = paths[1];
					//tree.username = tree.username.substring(0, tree.username.length-5);					
				}
				success && success(roottree);
			}, error);
		}

		//gitlab.uploadImage = function(params, success, error)

		gitlab.init(config);
		return gitlab;
	}

	return gitlabFactory;
})
