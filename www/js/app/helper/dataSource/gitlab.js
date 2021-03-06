
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
			var proxyUrlPrefix = app.objects.config.gitApiProxyUrlPrefix;
			self.authUsername = (app.objects.user || {}).username;
			self.username = config.username;
			self.apiBaseUrl = config.api_base_url;
			self.rawBaseUrl = config.raw_base_url;
			self.token = config.token;
			self.externalUsername = config.external_username;
			self.projectName = config.project_name;
			self.projectId = config.project_id;
			self.lastCommitId = config.last_commit_id || "master";
			self.proxyToken = app.ng_objects.$auth.getToken();
			self.proxyUrlPrefix = self.apiBaseUrl.match(/(http[s]?:\/\/[^\/]+)/)[1];
			self.proxyApiBaseUrl = config.api_base_url.replace(/http[s]?:\/\/[^\/]+/, proxyUrlPrefix);
			self.proxyRawBaseUrl = proxyUrlPrefix;
			self.is_proxy = config.is_proxy;
		}


		gitlab.getRawContentUrl = function(params) {
			//return this.proxyRawBaseUrl + '/' + this.externalUsername + '/' + this.projectName.toLowerCase() + '/raw/' +(params.ref || "master") + '/' + params.path + "?proxyurlprefix=" + this.proxyUrlPrefix;
			return this.proxyRawBaseUrl + '/' + this.externalUsername + '/' + this.projectName.toLowerCase() + '/raw/' +(params.ref || "master") + '/' + params.path;
		}

		gitlab.getGitFilePath = function(params) {
			params.ref = params.ref || "master";
			return this.rawBaseUrl + "/" + (params.externalUsername || this.externalUsername) + "/" + (params.projectName || this.projectName) + '/blob/' + params.ref + '/' + params.path;
		}

		gitlab.httpRequest = function(method, url, data, success, error) {
			var self = this;
			var apiBaseUrl = self.apiBaseUrl;

			if (self.is_proxy || !self.token || self.authUsername != self.username) {
				if (self.username != "keepwork") {
					apiBaseUrl = self.proxyApiBaseUrl;
				}
				//apiBaseUrl = self.proxyApiBaseUrl;
			}

			var config = {
				method: method,
				url: apiBaseUrl + url,
				headers: {
					"PRIVATE-TOKEN":self.token,
					"PROXYTOKEN": self.proxyToken,
					"PROXYURLPREFIX": self.proxyUrlPrefix,
					"PROXYGITTYPE": "gitlab",
				},

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

			self.httpRequest("GET", url, {},  function(data){
				data.content = Base64.decode(data.content);
				success && success(data);
			}, error);
		}

		gitlab.getContent = function(params, success, error) {
			var self = this;
			var path = encodeUrl(params.path);
			var url = "/projects/" + self.projectId + "/repository/files/" + path + "?ref=" + self.lastCommitId;
			self.httpRequest("GET", url, {},  function(data){
				data.content = Base64.decode(data.content);
				success && success(data.content);
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
					node.pagename = node.text;
					return true;
				}
				if (path.indexOf(".md") == path.length - 3) {
					node.text = node.name.substring(0, node.name.length-3);
					node.url = node.path.substring(0, node.path.length-3);
					node.pagename = node.text;
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

		gitlab.upload = function(params, success, error) {
			var self = this;
			var path = params.path;
			var content = params.content;
			content = content.split(',');
			content = content.length > 1 ? content[1] : content[0];

			self.writeFile({path:path, content:content, encoding:"base64"}, function(data) {
				var url = self.getRawContentUrl({path:path});
				success && success(url);
				//var util = app.objects.util;
				//path = window.location.protocol + "//" + util.getOfficialHost() + "/" + path;
				//success && success(path);
			}, error);
		}

		gitlab.uploadImage = function(params, success, error) {
			var self = this;
			params.path = self.username + '_images/' + params.path;
			self.upload(params, success, error);
		}


		gitlab.uploadFile = function(params, success, error) {
			var self = this;
			params.path = self.username + '_files/' + params.path;
			self.upload(params, success, error);
		}

		gitlab.init(config);
		return gitlab;
	}

	return gitlabFactory;
})
