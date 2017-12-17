
define([
	"app",
], function(app){
	var $http = app.ng_objects.$http;
	var config = app.objects.config;
	var gitlabMap = {};
	function getGitlab(name) {
		gitlabMap[name] = gitlabMap[name] || {
			inited: false,                                          // is already init
			username: '',   // gitlab 用户名                        // gitlab username
			lastCommitId: "master",                                // 最新commitId  替代master  用于cdn加速
			projectId: undefined,                                  // project id
			projectName: 'keepworkdatasource',                   // repository name
			projectMap:{},                                      // 项目列表
			apiBaseUrl: 'http://git.keepwork.com/api/v4',     // api base url
			rawBaseUrl: 'http://git.keepwork.com',              // raw base url
			rootPath: '',                                           // 根路径
			httpHeader: {},
		}

		return gitlabMap[name];
	}
	// http请求
	function httpRequest(self, method, url, data, success, error) {
		self.dataSource.dataSourceToken && (self.httpHeader["PRIVATE-TOKEN"] = self.dataSource.dataSourceToken);
		//console.log(url);
		var config = {
			method: method,
			url: self.apiBaseUrl + url,
			headers: self.httpHeader,
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
		var failed = function (response) {
			//console.log(response);
			typeof error == 'function' && error(response);
		};

		$http(config).then(success).catch(failed);
	}

	function createWebhook(self) {
		var hookUrl = config.apiUrlPrefix + "data_source/gitlab_webhook";
		//var hookUrl = "http://dev.keepwork.com/api/wiki/models/data_source/gitlabWebhook";
		var isExist = false;
		httpRequest(self, "GET", "/projects/" + self.projectId + "/hooks", {}, function (data) {
			for (var i = 0; i < data.length; i++) {
				if (data[i].url == hookUrl && data[i].push_events) {
					isExist = true;
				}
			}
			// 不存在创建
			if (!isExist) {
				httpRequest(self, "POST", "/projects/" + self.projectId + "/hooks", {
					url: hookUrl,
					push_events: true,
					enable_ssl_verification: false,
				}, function () {
					console.log("webhook create success");
				}, function () {
					console.log("webhook create failed");
				});
			}
		}, function () {

		});
	}

	function listCommits(self, data, success, error) {
		var url = '/projects/' + self.projectId + '/repository/commits';
		httpRequest(self, 'GET', url, data, cb, errcb);
	}

	function getLastCommitId(self, success, error, isShowLoading) {
		listCommits(self, {isShowLoading:isShowLoading}, function (data) {
			if (data && data.length > 0) {
				self.lastCommitId = data[0].id;
			} else {
				self.lastCommitId = "master";
			}
			success && success(self.lastCommitId);
		}, error);
	}

	function createProject(self, success, error) {
		var projectName = self.projectName;
		var visibility = self.visibility;
		var _success = function(params) {
			self.projectId = params.projectId;
			createWebhook(self);
			// 更新项目ID
			//util.post(config.apiUrlPrefix + 'site_data_source/updateById', {_id:self.dataSource.data_source_id, project_id:params.projectId, project_name:projectName});

			getLastCommitId(self, function(lastCommitId){
				self.lastCommitId = lastCommitId;
			});

			success && success();	
			return;
		}

		httpRequest(self, "GET", "/projects", {search: projectName, owned: true}, function (projectList) {
			var project = undefined;
			var method = "POST";
			var url = "/projects";
			var data = {name:projectName, visibility: visibility, request_access_enabled:true};


			// 查找项目是否存在
			for (var i = 0; i < projectList.length; i++) {
				if (projectList[i].name.toLowerCase() == projectName.toLowerCase()) {
					project = projectList[i];
					break;
				}
			}

			// 不存在或需要修改
			if (!project) {
				httpRequest(self, method, url, data, function (project) {
					if (project) {
						successCallback({projectId:project.id, projectName:params.projectName,lastCommitId:params.lastCommitId});
					} else {
						error && error();
					}
					//self.getLastCommitId(cb, errcb);
				}, errcb);
			} else if (project.visibility != visibility) {
				method = "PUT";
				url += "/" + project.id;
				data.id = project.id;
				
				// 不存在则创建项目 存在更新
				httpRequest(self, method, url, data, function (project) {
					_success({projectId:project.id, projectName:params.projectName,lastCommitId:params.lastCommitId});
				}, errcb);
			} else {
				_success({projectId:project.id, projectName:params.projectName,lastCommitId:params.lastCommitId});
			}
		}, error);
	}

	function init(self, dataSource, success, error) {
		if (self.inited) {
			success && success();
			return;
		}
		//console.log(dataSource);
		self.type = dataSource.type;
		self.username = dataSource.external_username;
		self.httpHeader["PRIVATE-TOKEN"] = dataSource.token;
		self.dataSourceToken = dataSource.token;
		self.apiBaseUrl = dataSource.api_base_url;
		self.rawBaseUrl = dataSource.raw_base_url;
		self.lastCommitId = dataSource.last_commit_id || "master";
		self.projectName = dataSource.project_name || self.projectName;
		self.projectId = dataSource.project_id || undefined;
		self.visibility = dataSource.visibility || "private";
		self.dataSource = dataSource;

		self.keepwrokUsername = dataSource.username;
		self.keepworkSitename = dataSource.sitename;

		if (!self.username || !self.dataSourceToken || !self.apiBaseUrl || !self.rawBaseUrl) {
			console.log("gitlab data source init failed!!!");
			error && error();
			return;
		}
		
		if (self.isInited || self.projectId) {
			//self.getLastCommitId(function(lastCommitId){
				//lastCommitId && (self.lastCommitId = lastCommitId);
				//cb && cb();
			//}, errcb);
			self.inited = true;
			success && success();
			return;
		}

		createProject(self, {projectName:self.projectName, visibility:self.visibility, lastCommitId:self.lastCommitId}, function() {
			self.inited = true;
			success && success();
		}, error);

		return;
	};


	function getFileUrlPrefix(self) {
		return '/projects/' + self.projectId + '/repository/files/';
	}

    function _encodeURIComponent(url) {
		return encodeURIComponent(url).replace(/\./g,'%2E')
    }
	function getCommitMessagePrefix() {
		return "keepwork commit: ";
	}

	return {
		registerDataSource: function(name, dataSource, success, error) {
			var inst = getGitlab(name);
			inst.getLastCommitId = function(success, error) {
				getLastCommitId(inst, success, error);
			}
			inst.setLastCommitId = function(lastCommitId) {
				inst.lastCommitId = lastCommitId;
			}
			inst.getTree = function(params, success, error) {
				var self = this;
				var url = '/projects/' + self.projectId + '/repository/tree';
				var path = params.path || "";
				params.path = path.substring(1);
				params.recursive = params.recursive == undefined ? true : params.recursive;
				params.isFetchAll = params.recursive;
				httpRequest(self, "GET", url, params, function (data) {
					var pagelist = [];
					for (var i = 0; i < data.length; i++) {
						var path = '/' + data[i].path;
						var page = {pagename: data[i].name};
						var suffixIndex = path.lastIndexOf(".md");
						// 不是md文件不编辑
						if (suffixIndex < 0)
							continue;

						page.url = path.substring(0, path.lastIndexOf('.'));
						var paths = page.url.split('/');
						if (paths.length < 3)
							continue;

						page.username = paths[1];
						page.sitename = paths[2];
						page.pagename = paths[paths.length - 1];
						page.blobId = data[i].id; // 文档sha

						pagelist.push(page);
					}
					success && success(pagelist);
				}, error);
			}
			inst.writeFile = function(params, success, error) {
				var self = this;
				params.path = params.path.substring(1);
				var url = getFileUrlPrefix(self) + _encodeURIComponent(params.path);
				params.commit_message = getCommitMessagePrefix() + params.path;
				params.branch = params.branch || "master";
				httpRequest(self, "GET", url, {path: params.path, ref: params.branch, isShowLoading:params.isShowLoading}, function (data) {
					// 已存在
					if (data && data.blob_id) {
						httpRequest(self, "PUT", url, params, success, error)
					} else {
						httpRequest(self, "POST", url, params, success, error);
					}
				}, function () {
					httpRequest(self, "POST", url, params, success, error);
				});
		
			}
			init(inst, dataSource, success, error);
		},
		getDataSource: function(name) {
			return getGitlab(name);
		},
	}
})
