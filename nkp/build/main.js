require('source-map-support/register')
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 50);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(48);


/***/ },
/* 1 */
/***/ function(module, exports) {

module.exports = require("lodash");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_config_js__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__prod_config_js__ = __webpack_require__(34);



var defaultConfig = Object.assign({}, __WEBPACK_IMPORTED_MODULE_0__common_config_js__["a" /* default */], {

	gitlabToken: "18ayouuEsKRo_yM1P5eF",

	secret: "keepwork",

	database: {
		//port:3306,
		host: '39.106.11.114',
		type: "mysql",
		database: "keepwork", // 数据库名
		username: "wuxiangan",
		password: "xxxxxx"
	}
});

var productionConfig = Object.assign({}, defaultConfig, __WEBPACK_IMPORTED_MODULE_1__prod_config_js__["a" /* default */]);

var developmentConfig = Object.assign({}, defaultConfig, __WEBPACK_IMPORTED_MODULE_1__prod_config_js__["a" /* default */]);

var configs = {
	"production": productionConfig,
	"development": developmentConfig
};

/* harmony default export */ exports["a"] = configs["development"];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* unused harmony export Err */
/* harmony export (binding) */ __webpack_require__.d(exports, "d", function() { return ERR; });
/* harmony export (binding) */ __webpack_require__.d(exports, "e", function() { return ERR_OK; });
/* harmony export (binding) */ __webpack_require__.d(exports, "b", function() { return ERR_PARAMS; });
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return ERR_UNATUH; });
/* unused harmony export ERR_NOT_FOUND */

var Err = function Err(code, message, data) {
	this.code = code || 0;
	this.message = message || "OK";
	this.data = data || null; // 请求数据
};

Err.prototype.setMessage = function () {
	var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "OK";

	this.message = message;
	return this;
};

Err.prototype.setCode = function () {
	var code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

	this.code = code;
	return this;
};

Err.prototype.setData = function (data) {
	this.data = data;
	return this;
};

var ERR = new Err(-1, "unknown error");
var ERR_OK = new Err();
var ERR_PARAMS = new Err(1, "参数错误");
var ERR_UNATUH = new Err(2, "未认证");
var ERR_NOT_FOUND = new Err(3, "未找到记录");

/* harmony default export */ exports["c"] = {
	ERR: ERR,
	ERR_OK: ERR_OK,
	ERR_PARAMS: ERR_PARAMS,
	ERR_UNATUH: ERR_UNATUH,
	ERR_NOT_FOUND: ERR_NOT_FOUND
};

/***/ },
/* 4 */
/***/ function(module, exports) {

module.exports = require("joi");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__BaseService__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__RequestHelper__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Bundler__ = __webpack_require__(21);
/* harmony export (binding) */ __webpack_require__.d(exports, "c", function() { return BaseService; });
/* harmony export (binding) */ __webpack_require__.d(exports, "b", function() { return RequestHelper; });
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return Bundler; });




var BaseService = __WEBPACK_IMPORTED_MODULE_0__BaseService__["a" /* default */];
var RequestHelper = __WEBPACK_IMPORTED_MODULE_1__RequestHelper__["a" /* default */];
var Bundler = __WEBPACK_IMPORTED_MODULE_2__Bundler__["a" /* default */];

/***/ },
/* 6 */
/***/ function(module, exports) {

module.exports = require("sequelize");

/***/ },
/* 7 */
/***/ function(module, exports) {

module.exports = require("koa");

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Repositories__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__RepositoryFiles__ = __webpack_require__(24);
/* harmony export (binding) */ __webpack_require__.d(exports, "Repositories", function() { return Repositories; });
/* harmony export (binding) */ __webpack_require__.d(exports, "RepositoryFiles", function() { return RepositoryFiles; });
//// Groups
//export Groups from './Groups';
//export GroupAccessRequests from './GroupAccessRequests';
//export GroupBadges from './GroupBadges';
//export GroupCustomAttributes from './GroupCustomAttributes';
//export GroupIssueBoards from './GroupIssueBoards';
//export GroupMembers from './GroupMembers';
//export GroupMilestones from './GroupMilestones';
//export GroupProjects from './GroupProjects';
//export GroupVariables from './GroupVariables';
//export Epics from './Epics';
//export EpicIssues from './EpicIssues';
//export EpicNotes from './EpicNotes';
//export EpicDiscussions from './EpicDiscussions';

//// Users
//export Users from './Users';
//export UserEmails from './UserEmails';
//export UserImpersonationTokens from './UserImpersonationTokens';
//export UserKeys from './UserKeys';
//export UserGPGKeys from './UserGPGKeys';

//// Projects
//export Branches from './Branches';
//export Commits from './Commits';
//export Deployments from './Deployments';
//export DeployKeys from './DeployKeys';
//export Environments from './Environments';
//export Issues from './Issues';
//export IssueNotes from './IssueNotes';
//export IssueDiscussions from './IssueDiscussions';
//export IssueAwardEmojis from './IssueAwardEmojis';
//export Jobs from './Jobs';
//export Labels from './Labels';
//export MergeRequests from './MergeRequests';
//export MergeRequestAwardEmojis from './MergeRequestAwardEmojis';
//export MergeRequestNotes from './MergeRequestNotes';
//export Pipelines from './Pipelines';
//export PipelineSchedules from './PipelineSchedules';
//export PipelineScheduleVariables from './PipelineScheduleVariables';
//export Projects from './Projects';
//export ProjectAccessRequests from './ProjectAccessRequests';
//export ProjectCustomAttributes from './ProjectCustomAttributes';
//export ProjectImportExport from './ProjectImportExport';
//export ProjectIssueBoards from './ProjectIssueBoards';
//export ProjectHooks from './ProjectHooks';
//export ProjectMembers from './ProjectMembers';
//export ProjectMilestones from './ProjectMilestones';
//export ProjectSnippets from './ProjectSnippets';
//export ProjectSnippetNotes from './ProjectSnippetNotes';
//export ProjectSnippetDiscussions from './ProjectSnippetDiscussions';
//export ProjectSnippetAwardEmojis from './ProjectSnippetAwardEmojis';
//export ProtectedBranches from './ProtectedBranches';
//export ProjectVariables from './ProjectVariables';

var Repositories = __WEBPACK_IMPORTED_MODULE_0__Repositories__["a" /* default */];

var RepositoryFiles = __WEBPACK_IMPORTED_MODULE_1__RepositoryFiles__["a" /* default */];
//export Runners from './Runners';
//export Services from './Services';
//export Tags from './Tags';
//export Todos from './Todos';
//export Triggers from './Triggers';

//// General
//export ApplicationSettings from './ApplicationSettings';
//export BroadcastMessages from './BroadcastMessages';
//export Events from './Events';
//export FeatureFlags from './FeatureFlags';
//export GeoNodes from './GeoNodes';
//export GitignoreTemplates from './GitignoreTemplates';
//export GitLabCIYMLTemplates from './GitLabCIYMLTemplates';
//export Keys from './Keys';
//export Licence from './Licence';
//export LicenceTemplates from './LicenceTemplates';
//export Lint from './Lint';
//export Namespaces from './Namespaces';
//export NotificationSettings from './NotificationSettings';
//export PagesDomains from './PagesDomains';
//export Search from './Search';
//export SidekiqMetrics from './SidekiqMetrics';
//export SystemHooks from './SystemHooks';
//export Wikis from './Wikis';

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__client_lib_gitlab_api__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_base64__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_base64___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_js_base64__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash__);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return gitlabFactory; });

//import gitlabApi from "node-gitlab-api";



var defaultUsername = "keepwork";

var defaultConfig = {
	apiBaseUrl: "https://gitlab.com",
	rawBaseUrl: "https://gitlab.com",
	token: "Ed9S7hSfiruewMR-jitR",
	ref: "master",
	branch: "master",
	projectId: 4980659
	//rootPath:"xiaoyao",
};

var xiaoyaoConfig = {
	username: "xiaoyao",
	projectId: 4980659,
	externalUsername: "wxaxiaoyao",
	projectName: "keepworkdatasource",
	token: "Ed9S7hSfiruewMR-jitR",
	ref: "master",
	branch: "master"
};

var keepworkConfig = {
	username: "keepwork",
	externalUsername: "keepwork",
	projectName: "keepworkdatasource",
	host: "https://gitlab.com",
	token: "9x94xLa-CZPH9Da5h5kd",
	ref: "master",
	branch: "master",
	projectId: 5112836
};

var gitlab = {
	gits: {}
};

var encodeUrl = function encodeUrl(url) {
	return encodeURIComponent(url).replace(/\./g, '%2E');
};

var getUsernameByPath = function getUsernameByPath(path) {
	var paths = (path || "").split("/");
	var username = "keepwork";
	for (var i = 0; i < paths.length; i++) {
		if (paths[i]) {
			username = paths[i];
			break;
		}
	}

	username = username.replace(/_(data|files)$/, "");

	return username;
};

function Gitlab(config) {
	config = __WEBPACK_IMPORTED_MODULE_2_lodash___default.a.mapKeys(config || {}, function (value, key) {
		return __WEBPACK_IMPORTED_MODULE_2_lodash___default.a.camelCase(key);
	});
	this.cfg = Object.assign({}, defaultConfig, (gitlab.gits[config.username] || {}).cfg || {}, config || {});
	//console.log(cfg);

	var gitcfg = { url: this.cfg.rawBaseUrl, token: this.cfg.token };
	//this.api = {
	////RepositoryFiles: new RepositoryFiles(gitcfg),
	////Repositories: new Repositories(gitcfg),
	//}
	this.api = new __WEBPACK_IMPORTED_MODULE_0__client_lib_gitlab_api__["a" /* default */]({ url: this.cfg.rawBaseUrl, token: this.cfg.token });
	//return this;
}

Gitlab.prototype.getFile = function (path) {
	return this.api.RepositoryFiles.show(this.cfg.projectId, path, this.cfg.ref).then(function (file) {
		file.content = __WEBPACK_IMPORTED_MODULE_1_js_base64__["Base64"].decode(file.content);
		return file;
	});
};

Gitlab.prototype.getContent = function (path) {
	return this.api.RepositoryFiles.show(this.cfg.projectId, path, this.cfg.ref).then(function (file) {
		return __WEBPACK_IMPORTED_MODULE_1_js_base64__["Base64"].decode(file.content);
	});
};

Gitlab.prototype.upsertFile = function (path, options) {
	var file = this.getFile(path);
	return file ? this.editFile(path, options) : this.createFile(path, options);
};

Gitlab.prototype.editFile = function (path, options) {
	return this.api.RepositoryFiles.edit(this.cfg.projectId, path, this.cfg.branch, options);
};

Gitlab.prototype.createFile = function (path, options) {
	return this.api.RepositoryFiles.create(this.cfg.projectId, path, this.cfg.branch, options);
};

Gitlab.prototype.removeFile = function (path, options) {
	return this.api.RepositoryFiles.remove(this.cfg.projectId, path, this.cfg.branch, options);
};

Gitlab.prototype.getTree = function (path, options) {
	options = options || {};
	options.path = path;

	return this.api.Repositories.tree(this.cfg.projectId, options);
};

Gitlab.prototype.getFileGitUrl = function (path) {
	var url = this.cfg.rawBaseUrl + "/" + this.cfg.externalUsername + "/" + this.cfg.projectName + '/blob/' + "master" + '/' + path;

	return url;
};

gitlab.initConfig = function (config) {
	if (!config || !config.username) {
		return;
	}

	this.gits[config.username] = new Gitlab(config);
};

gitlab.getGitByPath = function (path) {
	var username = getUsernameByPath(path);
	return this.gits[username] || this.gits[defaultUsername];
};

gitlab.getContent = function (path) {
	return this.getGitByPath(path).getContent(path);
};

gitlab.getFile = function (path) {
	return this.getGitByPath(path).getFile(path);
};

gitlab.editFile = function (path, options) {
	var git = this.getGitByPath(path);
	return git.editFile(path, options);
};

gitlab.createFile = function (path, options) {
	var git = this.getGitByPath(path);
	//path = encodeUrl(path);
	return git.createFile(path, options);
};

gitlab.removeFile = function (path, options) {
	var git = this.getGitByPath(path);
	return git.removeFile(path, options);
};

gitlab.getTree = function (path, options) {
	var git = this.getGitByPath(path);
	return git.getTree(path, options);
};

gitlab.getFileGitUrl = function (path) {
	return this.getGitByPath(path).getFileGitUrl(path);
};

gitlab.initConfig(keepworkConfig);
gitlab.initConfig(xiaoyaoConfig);

var gitlabFactory = function gitlabFactory(config) {
	return new Gitlab(config);
};
/* unused harmony default export */ var _unused_webpack_default_export = gitlab;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_sequelize__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__database_js__ = __webpack_require__(11);



var DataSource = __WEBPACK_IMPORTED_MODULE_1__database_js__["a" /* default */].define("dataSource", {
	id: {
		type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.BIGINT,
		autoIncrement: true,
		primaryKey: true
	},

	username: {
		type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(48),
		allowNull: false
	},

	name: {
		type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(48),
		unique: true
	},

	type: {
		type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(12)
	},

	token: {
		type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(128)
		//allowNull, false,
	},

	apiBaseUrl: {
		type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(64)
	},

	rawBaseUrl: {
		type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(64)
	},

	externalUserId: {
		type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.BIGINT
	},

	externalUsername: {
		type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(48)
	},

	externalPassword: {
		type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(128)
	},

	isDefault: {
		type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.BOOLEAN
	}
});

//DataSource.sync({force:true}).then(() => {
//console.log("create dataSource table successfully");
//});

/* harmony default export */ exports["a"] = DataSource;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_sequelize__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config_js__ = __webpack_require__(2);



var dbconfig = __WEBPACK_IMPORTED_MODULE_1__config_js__["a" /* default */].database;

var sequelize = new __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a(dbconfig.database, dbconfig.username, dbconfig.password, {
  host: dbconfig.host,
  dialect: dbconfig.type,
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }

  // SQLite only
  //storage: 'path/to/database.sqlite'
});

//sequelize
//.authenticate()
//.then(() => {
//console.log('Connection has been established successfully.');
//})
//.catch(err => {
//console.error('Unable to connect to the database:', err);
//});

/* harmony default export */ exports["a"] = sequelize;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_sequelize__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__database_js__ = __webpack_require__(11);



var User = __WEBPACK_IMPORTED_MODULE_1__database_js__["a" /* default */].define('user', {
	id: {
		type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.BIGINT,
		autoIncrement: true,
		primaryKey: true
	},

	username: {
		type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(48),
		unique: true
	},

	password: {
		type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(48),

		set: function set(val) {
			this.setDataValue("password", val.toUpperCase());
		}
	},

	email: {
		type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(24),
		unique: true
	},

	cellphone: {
		type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(24),
		unique: true
	},

	nickname: {
		type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING
	},

	portrait: {
		type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING
	},

	sex: {
		type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(4)
	}
});

//User.sync({force:true}).then(() => {
//console.log("create user table successfully");
//});


/* harmony default export */ exports["a"] = User;

/***/ },
/* 13 */
/***/ function(module, exports) {

module.exports = require("jwt-simple");

/***/ },
/* 14 */
/***/ function(module, exports) {

module.exports = require("url-join");

/***/ },
/* 15 */
/***/ function(module, exports) {

module.exports = require("wurl");

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

var path = __webpack_require__(47);
var webpack = __webpack_require__(49);

var rootdir = path.resolve(".");

module.exports = {
	srcDir: "client/",

	env: {
		rootdir: rootdir
	},

	plugins: [{ src: "~/plugins/app", ssr: false }, { src: "~/plugins/persistedstate", ssr: false }, { src: "~/plugins/codemirror", ssr: false }, { src: "~/plugins/element-ui" }],

	/*
  	** Headers of the page
  	*/
	head: {
		title: 'starter',
		meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }, { hid: 'description', name: 'description', content: 'Nuxt.js project' }],
		link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
	},
	/*
 ** Global CSS
 */
	css: ['font-awesome/css/font-awesome.min.css', '~assets/css/main.css'],
	/*
 ** Customize the progress-bar color
 */
	loading: { color: '#3B8070' },
	/*
  ** Build configuration
  */
	build: {
		analyze: true,
		vendor: ["lodash", "axios", "vuex-persistedstate"],
		babel: {
			//presets:[
			//],
			plugins: ["syntax-dynamic-import", ["component", {
				libraryName: "element-ui",
				styleLibraryName: "theme-chalk"
			}, 'transform-async-to-generator', 'transform-runtime']]
		},
		extend: function extend(config, ctx) {
			if (config.name == "server") {
				return;
			}

			config.entry["codemirror"] = ["~/plugins/codemirror"];
			config.entry["elementUI"] = ["~/plugins/element-ui"];
			config.plugins[0] = new webpack.optimize.CommonsChunkPlugin({
				//name:"vendor",
				names: ["elementUI", "codemirror", "vendor"],
				//chunks: ["lodash", "axios"],
				minChunks: Infinity
			});

			config.resolve.alias["vue$"] = "vue/dist/vue.esm.js";
			//config.resolve.alias["gitlabapi$"] = "~/lib/gitlab-api/index.js";
			//console.log(config.resolve.alias);
			config.node = Object.assign({}, config.node || {}, {
				fs: "empty",
				tls: "empty",
				net: "empty"
			});
		}
	}
};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_koa__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_koa___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_koa__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__koa_cors__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__koa_cors___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__koa_cors__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_koa_jwt__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_koa_jwt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_koa_jwt__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_koa_router__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_koa_router___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_koa_router__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_koa_body__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_koa_body___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_koa_body__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_koa_static__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_koa_static___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_koa_static__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_wurl__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_wurl___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_wurl__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_lodash__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__controllers_index_js__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__config_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__models_index_js__ = __webpack_require__(33);











//import log from "./log.js";



var apiRouter = new __WEBPACK_IMPORTED_MODULE_3_koa_router___default.a({
	prefix: __WEBPACK_IMPORTED_MODULE_9__config_js__["a" /* default */].apiUrlPrefix
});
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8__controllers_index_js__["a" /* default */])(apiRouter);

/* harmony default export */ exports["a"] = function (app, views) {
	var viewRouter = new __WEBPACK_IMPORTED_MODULE_3_koa_router___default.a({});
	//viewRouter.get("/www/*", views);

	app.use(__WEBPACK_IMPORTED_MODULE_5_koa_static___default()("../.nuxt/")).use(__WEBPACK_IMPORTED_MODULE_1__koa_cors___default()()).use(__WEBPACK_IMPORTED_MODULE_4_koa_body___default()()).use(__WEBPACK_IMPORTED_MODULE_2_koa_jwt___default()({ secret: __WEBPACK_IMPORTED_MODULE_9__config_js__["a" /* default */].secret, passthrough: true, cookie: "token" })).use(apiRouter.routes()).use(apiRouter.allowedMethods()).use(viewRouter.routes());
};

/***/ },
/* 18 */
/***/ function(module, exports) {

module.exports = require("nuxt");

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_pick__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_pick___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_pick__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__infrastructure__ = __webpack_require__(5);
/* unused harmony namespace reexport */
/* unused harmony export GroupsBundler */
/* unused harmony export UsersBundler */
/* unused harmony export ProjectsBundler */




// All seperatly


// Groups
var GroupsBundler = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__infrastructure__["a" /* Bundler */])(__WEBPACK_IMPORTED_MODULE_0_lodash_pick___default()(__WEBPACK_IMPORTED_MODULE_1__services__, ['Groups', 'GroupAccessRequests', 'GroupBadges', 'GroupCustomAttributes', 'GroupIssueBoards', 'GroupMembers', 'GroupMilestones', 'GroupProjects', 'GroupVariables', 'Epics', 'EpicIssues', 'EpicNotes', 'EpicDiscussions']));

// Users
var UsersBundler = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__infrastructure__["a" /* Bundler */])(__WEBPACK_IMPORTED_MODULE_0_lodash_pick___default()(__WEBPACK_IMPORTED_MODULE_1__services__, ['Users', 'UserEmails', 'UserImpersonationTokens', 'UserKeys', 'UserGPGKeys']));

// Projects
var ProjectsBundler = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__infrastructure__["a" /* Bundler */])(__WEBPACK_IMPORTED_MODULE_0_lodash_pick___default()(__WEBPACK_IMPORTED_MODULE_1__services__, ['Branches', 'Commits', 'DeployKeys', 'Deployments', 'Environments', 'Issues', 'IssueAwardEmojis', 'IssueNotes', 'IssueDiscussions', 'Jobs', 'Labels', 'MergeRequests', 'MergeRequestAwardEmojis', 'MergeRequestNotes', 'Pipelines', 'PipelineSchedules', 'PipelineScheduleVariables', 'Projects', 'ProjectAccessRequests', 'ProjectBadges', 'ProjectCustomAttributes', 'ProjectImportExport', 'ProjectIssueBoards', 'ProjectHooks', 'ProjectMembers', 'ProjectMilestones', 'ProjectSnippet', 'ProjectSnippetNotes', 'ProjectSnippetDiscussions', 'ProjectSnippetAwardEmojis', 'ProtectedBranches', 'ProjectVariables', 'Repositories', 'RepositoryFiles', 'Runners', 'Services', 'Tags', 'Triggers']));

// All initialized
/* harmony default export */ exports["a"] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__infrastructure__["a" /* Bundler */])(__WEBPACK_IMPORTED_MODULE_1__services__);

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_url_join__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_url_join___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_url_join__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var BaseModel = function BaseModel(_ref) {
  var _ref$url = _ref.url,
      url = _ref$url === undefined ? 'https://gitlab.com' : _ref$url,
      token = _ref.token,
      oauthToken = _ref.oauthToken;

  _classCallCheck(this, BaseModel);

  this.url = __WEBPACK_IMPORTED_MODULE_0_url_join___default()(url, 'api', 'v4');
  this.headers = {};

  if (oauthToken) {
    this.headers.Authorization = 'Bearer ' + oauthToken;
  } else if (token) {
    this.headers['private-token'] = token;
  } else {
    throw new Error('`token` (private-token) or `oauth_token` is mandatory');
  }
};

/* harmony default export */ exports["a"] = BaseModel;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Bundler() {
  for (var _len = arguments.length, services = Array(_len), _key = 0; _key < _len; _key++) {
    services[_key] = arguments[_key];
  }

  var combined = Object.assign.apply(Object, [{}].concat(services));

  return function Bundle(options) {
    var _this = this;

    _classCallCheck(this, Bundle);

    Object.entries(combined).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          name = _ref2[0],
          Service = _ref2[1];

      _this[name] = new Service(options);
    });
  };
}

/* harmony default export */ exports["a"] = Bundler;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_axios__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_axios__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_humps__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_humps___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_humps__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_parse_link_header__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_parse_link_header___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_parse_link_header__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_url_join__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_url_join___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_url_join__);


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//import Request from 'request-promise';





function defaultRequest(url, endpoint, _ref) {
  var method = _ref.method,
      headers = _ref.headers,
      body = _ref.body,
      qs = _ref.qs,
      formData = _ref.formData;

  var params = {
    url: __WEBPACK_IMPORTED_MODULE_4_url_join___default()(url, endpoint),
    method: method,
    headers: headers
  };

  if (body) params.data = __WEBPACK_IMPORTED_MODULE_2_humps___default.a.decamelizeKeys(body);
  if (qs) params.params = __WEBPACK_IMPORTED_MODULE_2_humps___default.a.decamelizeKeys(qs);
  if (formData) params.data = formData;

  return params;
}

var RequestHelper = function () {
  function RequestHelper() {
    _classCallCheck(this, RequestHelper);
  }

  _createClass(RequestHelper, null, [{
    key: 'get',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator___default.a.mark(function _callee(service, endpoint) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var response, links, page, limit, more;
        return __WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return __WEBPACK_IMPORTED_MODULE_1_axios___default()(defaultRequest(service.url, endpoint, {
                  method: "get",
                  headers: service.headers,
                  qs: options,
                  resolveWithFullResponse: true
                }));

              case 2:
                response = _context.sent;
                links = __WEBPACK_IMPORTED_MODULE_3_parse_link_header___default()(response.headers.link);
                page = response.headers['x-page'];
                limit = options.maxPages ? page < options.maxPages : true;
                more = [];

                if (!(page && limit && links.next)) {
                  _context.next = 12;
                  break;
                }

                _context.next = 10;
                return RequestHelper.get(service, links.next.url.replace(service.url, ''), options);

              case 10:
                more = _context.sent;
                return _context.abrupt('return', [].concat(_toConsumableArray(response.data), _toConsumableArray(more)));

              case 12:
                return _context.abrupt('return', response.data);

              case 13:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function get(_x2, _x3) {
        return _ref2.apply(this, arguments);
      }

      return get;
    }()
  }, {
    key: 'post',
    value: function post(service, endpoint) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var form = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      var body = form ? 'fromData' : 'body';

      return __WEBPACK_IMPORTED_MODULE_1_axios___default()(defaultRequest(service.url, endpoint, _defineProperty({
        method: "post",
        headers: service.headers
      }, body, options)));
    }
  }, {
    key: 'put',
    value: function put(service, endpoint) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      return __WEBPACK_IMPORTED_MODULE_1_axios___default()(defaultRequest(service.url, endpoint, {
        method: "put",
        headers: service.headers,
        body: options
      }));
    }
  }, {
    key: 'delete',
    value: function _delete(service, endpoint) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      return __WEBPACK_IMPORTED_MODULE_1_axios___default()(defaultRequest(service.url, endpoint, {
        method: "delete",
        headers: service.headers,
        qs: options
      }));
    }
  }]);

  return RequestHelper;
}();

/* harmony default export */ exports["a"] = RequestHelper;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__infrastructure__ = __webpack_require__(5);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



var Repositories = function (_BaseService) {
  _inherits(Repositories, _BaseService);

  function Repositories() {
    _classCallCheck(this, Repositories);

    return _possibleConstructorReturn(this, (Repositories.__proto__ || Object.getPrototypeOf(Repositories)).apply(this, arguments));
  }

  _createClass(Repositories, [{
    key: 'compare',
    value: function compare(projectId, from, to) {
      var pId = encodeURIComponent(projectId);

      return __WEBPACK_IMPORTED_MODULE_0__infrastructure__["b" /* RequestHelper */].get(this, 'projects/' + pId + '/repository/compare', {
        from: from,
        to: to
      });
    }
  }, {
    key: 'contributors',
    value: function contributors(projectId) {
      var pId = encodeURIComponent(projectId);

      return __WEBPACK_IMPORTED_MODULE_0__infrastructure__["b" /* RequestHelper */].get(this, 'projects/' + pId + '/repository/contributors');
    }
  }, {
    key: 'showArchive',
    value: function showArchive(projectId, _ref) {
      var sha = _ref.sha;

      var pId = encodeURIComponent(projectId);

      return __WEBPACK_IMPORTED_MODULE_0__infrastructure__["b" /* RequestHelper */].get(this, 'projects/' + pId + '/repository/archive', {
        sha: sha
      });
    }
  }, {
    key: 'showBlob',
    value: function showBlob(projectId, sha) {
      var pId = encodeURIComponent(projectId);

      return __WEBPACK_IMPORTED_MODULE_0__infrastructure__["b" /* RequestHelper */].get(this, 'projects/' + pId + '/repository/blobs/' + sha);
    }
  }, {
    key: 'showBlobRaw',
    value: function showBlobRaw(projectId, sha) {
      var pId = encodeURIComponent(projectId);

      return __WEBPACK_IMPORTED_MODULE_0__infrastructure__["b" /* RequestHelper */].get(this, 'projects/' + pId + '/repository/blobs/' + sha + '/raw');
    }
  }, {
    key: 'tree',
    value: function tree(projectId, options) {
      var pId = encodeURIComponent(projectId);

      return __WEBPACK_IMPORTED_MODULE_0__infrastructure__["b" /* RequestHelper */].get(this, 'projects/' + pId + '/repository/tree', options);
    }
  }]);

  return Repositories;
}(__WEBPACK_IMPORTED_MODULE_0__infrastructure__["c" /* BaseService */]);

/* harmony default export */ exports["a"] = Repositories;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__infrastructure__ = __webpack_require__(5);
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



var RepositoryFiles = function (_BaseService) {
  _inherits(RepositoryFiles, _BaseService);

  function RepositoryFiles() {
    _classCallCheck(this, RepositoryFiles);

    return _possibleConstructorReturn(this, (RepositoryFiles.__proto__ || Object.getPrototypeOf(RepositoryFiles)).apply(this, arguments));
  }

  _createClass(RepositoryFiles, [{
    key: 'create',
    value: function create(projectId, filePath, branch, options) {
      var _map = [projectId, filePath].map(encodeURIComponent),
          _map2 = _slicedToArray(_map, 2),
          pId = _map2[0],
          path = _map2[1];

      return __WEBPACK_IMPORTED_MODULE_0__infrastructure__["b" /* RequestHelper */].post(this, 'projects/' + pId + '/repository/files/' + path, Object.assign({
        branch: branch
      }, options));
    }
  }, {
    key: 'edit',
    value: function edit(projectId, filePath, branch, options) {
      var _map3 = [projectId, filePath].map(encodeURIComponent),
          _map4 = _slicedToArray(_map3, 2),
          pId = _map4[0],
          path = _map4[1];

      return __WEBPACK_IMPORTED_MODULE_0__infrastructure__["b" /* RequestHelper */].put(this, 'projects/' + pId + '/repository/files/' + path, Object.assign({
        branch: branch
      }, options));
    }
  }, {
    key: 'remove',
    value: function remove(projectId, filePath, branch, options) {
      var _map5 = [projectId, filePath].map(encodeURIComponent),
          _map6 = _slicedToArray(_map5, 2),
          pId = _map6[0],
          path = _map6[1];

      return __WEBPACK_IMPORTED_MODULE_0__infrastructure__["b" /* RequestHelper */].delete(this, 'projects/' + pId + '/repository/files/' + path, Object.assign({
        branch: branch
      }, options));
    }
  }, {
    key: 'show',
    value: function show(projectId, filePath, ref) {
      var _map7 = [projectId, filePath].map(encodeURIComponent),
          _map8 = _slicedToArray(_map7, 2),
          pId = _map8[0],
          path = _map8[1];

      return __WEBPACK_IMPORTED_MODULE_0__infrastructure__["b" /* RequestHelper */].get(this, 'projects/' + pId + '/repository/files/' + path, {
        ref: ref
      });
    }
  }, {
    key: 'showRaw',
    value: function showRaw(projectId, filePath, ref) {
      var _map9 = [projectId, filePath].map(encodeURIComponent),
          _map10 = _slicedToArray(_map9, 2),
          pId = _map10[0],
          path = _map10[1];

      return __WEBPACK_IMPORTED_MODULE_0__infrastructure__["b" /* RequestHelper */].get(this, 'projects/' + pId + '/repository/files/' + path + '/raw', { ref: ref });
    }
  }]);

  return RepositoryFiles;
}(__WEBPACK_IMPORTED_MODULE_0__infrastructure__["c" /* BaseService */]);

/* harmony default export */ exports["a"] = RepositoryFiles;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_elasticsearch__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_elasticsearch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_elasticsearch__);
/* unused harmony export elasticsearchFactory */



var defaultConfig = {
	host: "http://10.28.18.7:9200"
};

var client = new __WEBPACK_IMPORTED_MODULE_0_elasticsearch___default.a.Client(Object.assign({}, defaultConfig));

var elasticsearchFactory = function elasticsearchFactory(config) {
	return new __WEBPACK_IMPORTED_MODULE_0_elasticsearch___default.a.Client(Object.assign({}, defaultConfig, config || {}));
};

/* harmony default export */ exports["a"] = client;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

var config = {
	urlPrefix: "wiki",
	apiUrlPrefix: "/api/v0",
	pageSuffix: ".md",
	tagModsPath: "keepwork_data/tag_mods.json",

	host: "127.0.0.1",
	port: 3000
};

config.baseURL = "http://" + config.host + ":" + config.port + config.apiUrlPrefix;

/* harmony default export */ exports["a"] = config;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_joi__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_joi___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_joi__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_jwt_simple__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_jwt_simple___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_jwt_simple__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__config_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__common_error_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__models_dataSource_js__ = __webpack_require__(10);
/* unused harmony export DataSource */


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }









var defaultDataSource = {
	username: "keepwork",
	externalUsername: "keepwork",
	projectName: "keepworkdatasource",
	host: "https://gitlab.com",
	token: "9x94xLa-CZPH9Da5h5kd",
	ref: "master",
	branch: "master",
	projectId: 5112836
};

var DataSource = function DataSource() {
	this.model = __WEBPACK_IMPORTED_MODULE_6__models_dataSource_js__["a" /* default */];
};

DataSource.prototype.create = function () {};

DataSource.prototype.update = function () {};

DataSource.prototype.delete = function () {};

DataSource.prototype.find = function () {};

DataSource.prototype.getSystemDataSource = function () {
	return __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.cloneDeep(defaultDataSource);
};

// 获取用户默认数据源
DataSource.prototype.getDefaultDataSource = function () {
	var _ref = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator___default.a.mark(function _callee(ctx) {
		var params, authUsername, username, dataSource;
		return __WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						params = ctx.request.query;
						authUsername = ctx.state.user.username;
						username = params.username || authUsername;

						if (username) {
							_context.next = 5;
							break;
						}

						return _context.abrupt("return", __WEBPACK_IMPORTED_MODULE_5__common_error_js__["c" /* default */].ERR_PARAMS);

					case 5:
						_context.next = 7;
						return this.model.findOne({
							where: {
								username: username,
								isDefault: true
							}
						});

					case 7:
						dataSource = _context.sent;

						if (dataSource) {
							_context.next = 10;
							break;
						}

						return _context.abrupt("return", __WEBPACK_IMPORTED_MODULE_5__common_error_js__["c" /* default */].ERR_NOT_FOUND);

					case 10:

						dataSource = dataSource.get({ plain: true });

						if (username != authUsername) {
							dataSource.token = undefined;
							dataSource.externalPassword = undefined;
						}

						return _context.abrupt("return", dataSource);

					case 13:
					case "end":
						return _context.stop();
				}
			}
		}, _callee, this);
	}));

	return function (_x) {
		return _ref.apply(this, arguments);
	};
}();

DataSource.prototype.getRoutes = function () {
	var prefix = "/dataSource";
	var routes = [{
		path: prefix + "/getDefaultDataSource",
		method: "get",
		action: "getDefaultDataSource"
	}];

	return routes;
};

/* harmony default export */ exports["a"] = new DataSource();

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_joi__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_joi___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_joi__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_wurl__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_wurl___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_wurl__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_js_yaml__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_js_yaml___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_js_yaml__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__common_error_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__config_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__common_api_elasticSearch_js__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__common_api_gitlab_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__common_api_gitlab_js__ = __webpack_require__(9);
/* unused harmony export Gitlab */


var _this = this;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }











//import {gitlabFactory} from "../../vue/src//api/gitlab.js";

// 获取GIT的ES数据
var getGitData = function () {
	var _ref = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator___default.a.mark(function _callee(git, path) {
		var content, data;
		return __WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						_context.prev = 0;
						_context.next = 3;
						return git.getContent(path);

					case 3:
						content = _context.sent;
						data = JSON.parse(content);
						return _context.abrupt("return", data);

					case 8:
						_context.prev = 8;
						_context.t0 = _context["catch"](0);

						console.log(_context.t0);

					case 11:
						return _context.abrupt("return");

					case 12:
					case "end":
						return _context.stop();
				}
			}
		}, _callee, this, [[0, 8]]);
	}));

	return function getGitData(_x, _x2) {
		return _ref.apply(this, arguments);
	};
}();

var formatSiteinfoESData = function formatSiteinfoESData(data) {};

var formatUserinfoESData = function formatUserinfoESData(data) {};

var formatPageinfoESData = function formatPageinfoESData(data) {};

var formatESDataMap = {
	"userinfo": formatUserinfoESData,
	"siteinfo": formatSiteinfoESData,
	"pageinfo": formatPageinfoESData
};

var Gitlab = function Gitlab() {};

// 获取git文件中的数据信息
Gitlab.prototype.getGitFileData = function (content) {
	try {
		//return Json.parse(content);
		return __WEBPACK_IMPORTED_MODULE_4_js_yaml___default.a.safeLoad(content, { json: true });
	} catch (e) {
		console.log(e);
	}

	return;
};

Gitlab.prototype.formatESData = function (data, tablename) {
	data = __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.cloneDeep(data || {});
	var format = formatESDataMap[tablename];

	format && format(data);

	return data;
};

Gitlab.prototype.submitESData = function () {
	var _ref2 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator___default.a.mark(function _callee2(item) {
		var data, tablename, path, action, indexs, esData, res;
		return __WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						data = item.data || {};
						tablename = item.tablename;
						path = item.path;
						action = item.action;
						indexs = [data.index_prefix || "kw", tablename, data.version || "v0"];
						esData = {
							index: indexs.join("_"),
							type: tablename,
							id: path.replace(/\//g, "_"),
							body: data.data || {}
						};

						esData.body.path = path;

						res = null;
						_context2.prev = 8;
						_context2.next = 11;
						return __WEBPACK_IMPORTED_MODULE_7__common_api_elasticSearch_js__["a" /* default */][action](esData);

					case 11:
						res = _context2.sent;
						_context2.next = 17;
						break;

					case 14:
						_context2.prev = 14;
						_context2.t0 = _context2["catch"](8);

						console.log(_context2.t0);

					case 17:
					case "end":
						return _context2.stop();
				}
			}
		}, _callee2, this, [[8, 14]]);
	}));

	return function (_x3) {
		return _ref2.apply(this, arguments);
	};
}();

Gitlab.prototype.webhook = function () {
	var _ref3 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator___default.a.mark(function _callee3(ctx) {
		var self, params, commit, project_url, origin, gitcfg, git, filelist, dataFileReg, filelistAddItem, promises;
		return __WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						self = this;
						params = ctx.request.body;
						commit = params.commits[0];
						project_url = params.project.http_url;
						origin = __WEBPACK_IMPORTED_MODULE_3_wurl___default()("protocol", project_url) + "://" + __WEBPACK_IMPORTED_MODULE_3_wurl___default()("hostname", project_url);
						gitcfg = {
							rawBaseUrl: origin,
							project_id: params.project_id,
							external_username: params.user_username,
							username: "xiaoyao",
							token: __WEBPACK_IMPORTED_MODULE_6__config_js__["a" /* default */].gitlabToken
						};
						git = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8__common_api_gitlab_js__["a" /* gitlabFactory */])(gitcfg);

						// 取出文件列表

						filelist = [];
						dataFileReg = /^[\w\d]+_data\/([_\w]+)\/.+\.yaml$/;

						filelistAddItem = function filelistAddItem(path, oper, action) {
							if (!dataFileReg.test(path)) return;

							var tablename = path.match(dataFileReg)[1];

							filelist.push({
								path: path,
								tablename: tablename,
								oper: oper,
								action: action
							});
						};

						__WEBPACK_IMPORTED_MODULE_1_lodash___default.a.each(params.commits, function (commit) {
							__WEBPACK_IMPORTED_MODULE_1_lodash___default.a.each(commit.added, function (path) {
								return filelistAddItem(path, "added", "index");
							});
							__WEBPACK_IMPORTED_MODULE_1_lodash___default.a.each(commit.modified, function (path) {
								return filelistAddItem(path, "modified", "index");
							});
							__WEBPACK_IMPORTED_MODULE_1_lodash___default.a.each(commit.removed, function (path) {
								return filelistAddItem(path, "removed", "delete");
							});
						});

						promises = [];

						__WEBPACK_IMPORTED_MODULE_1_lodash___default.a.each(filelist, function (item) {
							promises.push(git.getContent(item.path).then(function (content) {
								item.content = content;
								item.data = self.getGitFileData(content) || {};
								//console.log(item);
								//item.esData = self.formatESData(item.data),
							}));
						});

						_context3.next = 15;
						return Promise.all(promises);

					case 15:

						//console.log(filelist);
						__WEBPACK_IMPORTED_MODULE_1_lodash___default.a.each(filelist, function (file) {
							return self.submitESData(file);
						});

						return _context3.abrupt("return");

					case 17:
					case "end":
						return _context3.stop();
				}
			}
		}, _callee3, this);
	}));

	return function (_x4) {
		return _ref3.apply(this, arguments);
	};
}();

// 提供接口 写git es
Gitlab.prototype.gitlab = function () {
	var _ref4 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator___default.a.mark(function _callee4(ctx) {
		var params, gitcfg, git;
		return __WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee4$(_context4) {
			while (1) {
				switch (_context4.prev = _context4.next) {
					case 0:
						params = ctx.request.body;

						if (!(!params.git || !params.git.projectId || !params.path || !params.data)) {
							_context4.next = 3;
							break;
						}

						return _context4.abrupt("return", __WEBPACK_IMPORTED_MODULE_5__common_error_js__["c" /* default */].ERR_PARAMS);

					case 3:
						gitcfg = params.git;

						gitcfg.token = gitcfg.token || __WEBPACK_IMPORTED_MODULE_6__config_js__["a" /* default */].gitlabToken;
						git = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8__common_api_gitlab_js__["a" /* gitlabFactory */])(gitcfg);


						git.upsertFile();

					case 7:
					case "end":
						return _context4.stop();
				}
			}
		}, _callee4, _this);
	}));

	return function (_x5) {
		return _ref4.apply(this, arguments);
	};
}();

Gitlab.prototype.getRoutes = function () {
	var prefix = "/gitlab";
	var routes = [{
		path: prefix + "/webhook",
		method: "post",
		action: "webhook"
	}];

	return routes;
};

/* harmony default export */ exports["a"] = new Gitlab();

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__middlewares_index_js__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_error_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__code_js__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__user_js__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__dataSource_js__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__gitlab_js__ = __webpack_require__(28);
/* unused harmony export controllers */
/* unused harmony export registerControllerRouter */


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }











var controllers = {
	code: __WEBPACK_IMPORTED_MODULE_4__code_js__["a" /* default */],
	user: __WEBPACK_IMPORTED_MODULE_5__user_js__["a" /* default */],
	dataSource: __WEBPACK_IMPORTED_MODULE_6__dataSource_js__["a" /* default */],
	gitlab: __WEBPACK_IMPORTED_MODULE_7__gitlab_js__["a" /* default */]
};

var registerControllerRouter = function registerControllerRouter(router) {
	var _this = this;

	__WEBPACK_IMPORTED_MODULE_1_lodash___default.a.each(controllers, function (ctrl) {
		__WEBPACK_IMPORTED_MODULE_1_lodash___default.a.each(ctrl.getRoutes(), function (route) {
			var methods = __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.isArray(route.method) ? route.method : [route.method || "get"];
			__WEBPACK_IMPORTED_MODULE_1_lodash___default.a.each(methods, function (method) {
				method = __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.lowerCase(method);
				//console.log(method, route.path);
				router[method](route.path, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__middlewares_index_js__["a" /* validate */])(route.validate), function () {
					var _ref = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator___default.a.mark(function _callee(ctx, next) {
						var body;
						return __WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
							while (1) {
								switch (_context.prev = _context.next) {
									case 0:
										if (!(route.requireAuth && !ctx.state.user)) {
											_context.next = 3;
											break;
										}

										ctx.body = __WEBPACK_IMPORTED_MODULE_3__common_error_js__["a" /* ERR_UNATUH */];
										return _context.abrupt("return");

									case 3:

										ctx.state.user = ctx.state.user || {};

										_context.prev = 4;
										_context.next = 7;
										return ctrl[route.action](ctx);

									case 7:
										body = _context.sent;

										ctx.body = body || ctx.body;
										_context.next = 16;
										break;

									case 11:
										_context.prev = 11;
										_context.t0 = _context["catch"](4);

										console.log(_context.t0);
										ctx.status = 500;
										ctx.body = "请求无法处理";

									case 16:
									case "end":
										return _context.stop();
								}
							}
						}, _callee, _this, [[4, 11]]);
					}));

					return function (_x, _x2) {
						return _ref.apply(this, arguments);
					};
				}()
				//console.log(ctx.body);
				);
			});
		});
	});

	router.all("/*", function (ctx, next) {
		ctx.status = 404;
	});
};

/* harmony default export */ exports["a"] = registerControllerRouter;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_joi__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_joi___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_joi__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_jwt_simple__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_jwt_simple___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_jwt_simple__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__config_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__common_error_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__models_user_js__ = __webpack_require__(12);
/* unused harmony export User */


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }









var User = function User() {
	this.model = __WEBPACK_IMPORTED_MODULE_6__models_user_js__["a" /* default */];
};

User.prototype.create = function () {};

User.prototype.update = function () {};

User.prototype.delete = function () {};

User.prototype.find = function () {};

User.prototype.register = function () {
	var _ref = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator___default.a.mark(function _callee(ctx) {
		var params, user;
		return __WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						params = ctx.request.body;
						_context.next = 3;
						return this.model.findOne({
							where: {
								username: params.username
							}
						});

					case 3:
						user = _context.sent;

						if (!user) {
							_context.next = 6;
							break;
						}

						return _context.abrupt("return", __WEBPACK_IMPORTED_MODULE_5__common_error_js__["d" /* ERR */].setMessage("用户已存在"));

					case 6:
						_context.next = 8;
						return this.model.create({
							username: params.username,
							password: params.password
						});

					case 8:
						user = _context.sent;

						if (user) {
							_context.next = 11;
							break;
						}

						return _context.abrupt("return", __WEBPACK_IMPORTED_MODULE_5__common_error_js__["d" /* ERR */]);

					case 11:
						return _context.abrupt("return", __WEBPACK_IMPORTED_MODULE_5__common_error_js__["e" /* ERR_OK */].setData({
							token: __WEBPACK_IMPORTED_MODULE_3_jwt_simple___default.a.encode({
								userId: user._id,
								username: user.username
							}, __WEBPACK_IMPORTED_MODULE_4__config_js__["a" /* default */].secret),
							userinfo: user
						}));

					case 12:
					case "end":
						return _context.stop();
				}
			}
		}, _callee, this);
	}));

	return function (_x) {
		return _ref.apply(this, arguments);
	};
}();

User.prototype.login = function () {
	var _ref2 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator___default.a.mark(function _callee2(ctx) {
		var params, user;
		return __WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						params = ctx.request.body;
						_context2.next = 3;
						return this.model.findOne({
							where: {
								username: params.username,
								password: params.password
							}
						});

					case 3:
						user = _context2.sent;

						if (user) {
							_context2.next = 6;
							break;
						}

						return _context2.abrupt("return", __WEBPACK_IMPORTED_MODULE_5__common_error_js__["d" /* ERR */].setMessage("用户名或密码错误"));

					case 6:

						user = user.get({ plain: true });

						return _context2.abrupt("return", __WEBPACK_IMPORTED_MODULE_5__common_error_js__["e" /* ERR_OK */].setData({
							token: __WEBPACK_IMPORTED_MODULE_3_jwt_simple___default.a.encode({
								userId: user._id,
								username: user.username
							}, __WEBPACK_IMPORTED_MODULE_4__config_js__["a" /* default */].secret),
							userinfo: user
						}));

					case 8:
					case "end":
						return _context2.stop();
				}
			}
		}, _callee2, this);
	}));

	return function (_x2) {
		return _ref2.apply(this, arguments);
	};
}();

User.prototype.isLogin = function () {
	var _ref3 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator___default.a.mark(function _callee3(ctx) {
		return __WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						this.model.findById(1);
						return _context3.abrupt("return", "hello world");

					case 2:
					case "end":
						return _context3.stop();
				}
			}
		}, _callee3, this);
	}));

	return function (_x3) {
		return _ref3.apply(this, arguments);
	};
}();

User.prototype.getRoutes = function () {
	var self = this;
	var prefix = "/user";
	var routes = [{
		path: prefix + "/register",
		method: "post",
		action: "register",
		validate: {
			body: {
				username: __WEBPACK_IMPORTED_MODULE_2_joi___default.a.string().min(4).max(48).required(),
				password: __WEBPACK_IMPORTED_MODULE_2_joi___default.a.string().min(4).max(48).required()
			}
		}
	}, {
		path: prefix + "/login",
		method: "post",
		action: "login",
		validate: {
			body: {
				username: __WEBPACK_IMPORTED_MODULE_2_joi___default.a.string().min(4).max(48).required(),
				password: __WEBPACK_IMPORTED_MODULE_2_joi___default.a.string().min(4).max(48).required()
			}
		}
	}, {
		path: prefix + "/isLogin",
		method: "get",
		action: "isLogin"
	}];

	return routes;
};

/* harmony default export */ exports["a"] = new User();

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__validate_js__ = __webpack_require__(32);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return validate; });


var validate = __WEBPACK_IMPORTED_MODULE_0__validate_js__["a" /* default */];

/* unused harmony default export */ var _unused_webpack_default_export = {
	validate: validate
};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_joi__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_joi___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_joi__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_error_js__ = __webpack_require__(3);
/* unused harmony export validate */


var _this = this;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }






var validate = function validate() {
  var schema = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _schema$opt = schema.opt,
      opt = _schema$opt === undefined ? {} : _schema$opt;

  var options = __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.defaultsDeep(opt, {
    allowUnknown: true
  });
  return function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator___default.a.mark(function _callee(ctx, next) {
      var defaultValidateKeys, needValidateKeys, errors, msg;
      return __WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              defaultValidateKeys = ['body', 'query', 'params'];
              needValidateKeys = __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.intersection(defaultValidateKeys, Object.keys(schema));
              errors = [];

              needValidateKeys.find(function (item) {
                var toValidateObj = item === 'body' ? ctx.request.body : ctx[item];
                var result = __WEBPACK_IMPORTED_MODULE_2_joi___default.a.validate(toValidateObj, schema[item], options);
                if (result.error) {
                  errors.push(result.error.details[0]);
                  return true;
                }
                __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.assignIn(toValidateObj, result.value);
                return false;
              });

              if (!(errors.length !== 0)) {
                _context.next = 8;
                break;
              }

              msg = errors[0].message.replace(/"/g, '');

              ctx.body = __WEBPACK_IMPORTED_MODULE_3__common_error_js__["b" /* ERR_PARAMS */].setMessage(msg);
              return _context.abrupt('return');

            case 8:
              _context.next = 10;
              return next();

            case 10:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function (_x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();
};

/* harmony default export */ exports["a"] = validate;

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__user_js__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dataSource_js__ = __webpack_require__(10);
/* unused harmony export User */
/* unused harmony export DataSource */




var User = __WEBPACK_IMPORTED_MODULE_0__user_js__["a" /* default */];
var DataSource = __WEBPACK_IMPORTED_MODULE_1__dataSource_js__["a" /* default */];

/* unused harmony default export */ var _unused_webpack_default_export = {
	User: User,
	DataSource: DataSource
};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

/* harmony default export */ exports["a"] = {
	apiUrlPrefix: "/api/v0",
	gitlabToken: "18ayouuEsKRo_yM1P5eF",

	secret: "keepwork",

	database: {
		//port:3306,
		host: '39.106.11.114',
		type: "mysql",
		database: "keepwork", // 数据库名
		username: "wuxiangan",
		password: "wuxiangan"
	}
};

/***/ },
/* 35 */
/***/ function(module, exports) {

module.exports = require("@koa/cors");

/***/ },
/* 36 */
/***/ function(module, exports) {

module.exports = require("axios");

/***/ },
/* 37 */
/***/ function(module, exports) {

module.exports = require("elasticsearch");

/***/ },
/* 38 */
/***/ function(module, exports) {

module.exports = require("humps");

/***/ },
/* 39 */
/***/ function(module, exports) {

module.exports = require("js-base64");

/***/ },
/* 40 */
/***/ function(module, exports) {

module.exports = require("js-yaml");

/***/ },
/* 41 */
/***/ function(module, exports) {

module.exports = require("koa-body");

/***/ },
/* 42 */
/***/ function(module, exports) {

module.exports = require("koa-jwt");

/***/ },
/* 43 */
/***/ function(module, exports) {

module.exports = require("koa-router");

/***/ },
/* 44 */
/***/ function(module, exports) {

module.exports = require("koa-static");

/***/ },
/* 45 */
/***/ function(module, exports) {

module.exports = require("lodash.pick");

/***/ },
/* 46 */
/***/ function(module, exports) {

module.exports = require("parse-link-header");

/***/ },
/* 47 */
/***/ function(module, exports) {

module.exports = require("path");

/***/ },
/* 48 */
/***/ function(module, exports) {

module.exports = require("regenerator-runtime");

/***/ },
/* 49 */
/***/ function(module, exports) {

module.exports = require("webpack");

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_koa__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_koa___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_koa__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_nuxt__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_nuxt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_nuxt__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__server_js__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__config_js__ = __webpack_require__(2);


var start = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator___default.a.mark(function _callee2() {
    var _this = this;

    var app, config, nuxt, builder, host, port;
    return __WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            app = new __WEBPACK_IMPORTED_MODULE_1_koa___default.a();

            // Import and Set Nuxt.js options

            config = __webpack_require__(16);

            config.dev = !(app.env === 'production');

            // Instantiate nuxt.js
            nuxt = new __WEBPACK_IMPORTED_MODULE_2_nuxt__["Nuxt"](config);

            // Build in development

            if (!config.dev) {
              _context2.next = 8;
              break;
            }

            builder = new __WEBPACK_IMPORTED_MODULE_2_nuxt__["Builder"](nuxt);
            _context2.next = 8;
            return builder.build();

          case 8:

            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__server_js__["a" /* default */])(app);

            app.use(function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator___default.a.mark(function _callee(ctx, next) {
                return __WEBPACK_IMPORTED_MODULE_0__mnt_d_workspace_lua_keepwork_nkp_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return next();

                      case 2:
                        ctx.status = 200; // koa defaults to 404 when it sees that status is unset
                        return _context.abrupt('return', new Promise(function (resolve, reject) {
                          ctx.res.on('close', resolve);
                          ctx.res.on('finish', resolve);
                          ctx.req.ctx = ctx;
                          nuxt.render(ctx.req, ctx.res, function (promise) {
                            // nuxt.render passes a rejected promise into callback on error.
                            promise.then(resolve).catch(reject);
                          });
                        }));

                      case 4:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, _this);
              }));

              return function (_x, _x2) {
                return _ref2.apply(this, arguments);
              };
            }());

            host = __WEBPACK_IMPORTED_MODULE_4__config_js__["a" /* default */].host || '127.0.0.1';
            port = __WEBPACK_IMPORTED_MODULE_4__config_js__["a" /* default */].port || 3000;

            app.listen(port, host);
            console.log('Server listening on ' + host + ':' + port); // eslint-disable-line no-console

          case 14:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function start() {
    return _ref.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }







start();

/***/ },
/* 51 */,
/* 52 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_shelljs__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_shelljs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_shelljs__);
/* unused harmony export Code */

var path = __webpack_require__(47);

var rootdir = path.resolve();
var Code = function Code() {
	this.rootdir = rootdir;
};

Code.prototype.pushCode = function () {
	var cmd_str = "cd " + this.rootdir + "; git reset --hard HEAD; git pull origin master;";
	__WEBPACK_IMPORTED_MODULE_0_shelljs___default.a.exec(cmd_str);
	console.log(cmd_str);
};

Code.prototype.getRoutes = function () {
	var self = this;
	var prefix = "/code";
	var routes = [{
		path: prefix + "/push_code",
		method: "all",
		action: "pushCode"
	}];

	return routes;
};

/* harmony default export */ exports["a"] = new Code();

/***/ },
/* 53 */
/***/ function(module, exports) {

module.exports = require("shelljs");

/***/ }
/******/ ]);
//# sourceMappingURL=main.map