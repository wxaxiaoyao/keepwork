
define([
	'app',	
], function(app) {
	var util = app.objects.util = {};

	// 是否是空对象
	util.isEmptyObject = function(obj) {
		for (var key in obj) {
			return false;
		}

		return true;
	}
	util.parseHostname = function(hostname) {
		var officialHostnameList = [
			"localhost",
			"keepwork.com",
		];

		var result = {isOfficialHostname:true, pathname_prefix:""};
        if (hostname.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
			result.isOfficialHostname = true;
			return result;
		}	

		for (var i = 0; i < officialHostnameList.length; i++) {
			var officialHostname = officialHostnameList[i];
			if (officialHostname == hostname) {
				result.isOfficialHostname = true;
				return result;
			}

			if (hostname.indexOf(officialHostname) > 0) {
				result.officialHostname = officialHostname; 
				result.pathname_prefix = "/" +  hostname.substring(0, hostname.indexOf(officialHostname) - 1).replace(".", "/");
			}
		}
		result.isOfficialHostname = false;
		return result;
	}

	util.parseUrl = function(url) {
        var hostname = window.location.hostname;
        var pathname = decodeURI(window.location.pathname);
		var url = url || util.getAbsoluteUrl(pathname);
        var paths = url.split("/").slice(1);

        return {
			url:url,
			hostname:hostname,
			pathname:pathname,
			username:paths[0], 
			//sitename:paths[1], 
			pagename:paths.length > 1 ? paths.slice(1).join("/") : undefined, 
		};
	}

	util.getAbsoluteUrl = function(url) {
		return util.parseHostname(window.location.hostname).pathname_prefix + (url || window.location.pathname);	
	}

	util.getRelativeUrl = function(url) {
        var hostname = window.location.hostname;
		var temp = util.parseHostname(hostname);

		return url.substring(temp.pathname_prefix.length);
	}

	util.$apply = function($scope) {
		$scope = $scope || app.ng_objects.$rootScope;
		setTimeout(function(){
			$scope.$apply();
		});
	}

	util.setPageContentUrl = function(url) {
		app.ng_objects.$rootScope.contentUrl = state.url;
		util.$apply();
	}

	util.go = function(url) {
		util.pushState({url:url});
	}

	util.pushState = function(state) {
		if (!state || !state.url) {
			return ;
		}
		var relativeUrl = util.getRelativeUrl(state.url);
		window.history.pushState(state,"keepwork", relativeUrl);
		app.ng_objects.$rootScope.contentUrl = state.url;
		util.$apply();
	}

	util.replaceState = function(state) {
		if (!state || !state.url) {
			return ;
		}
		var relativeUrl = util.getRelativeUrl(state.url);
		window.history.replaceState(state, "keepwork", relativeUrl);
		app.ng_objects.$rootScope.contentUrl = state.url;
		util.$apply();
	}
	
	window.onpopstate = function() {
		//console.log(window.history.state);
		var state = window.history.state;
		if (!state || !state.url) {
			return;
		}
		app.ng_objects.$rootScope.contentUrl = state.url;
		util.$apply();
	}

	util.http = function(method, url, params, success, error) {
		util.$http({
			url:url,
			method:method,
			params:params,
			success:success,
			error:error,
		});
	}
	util.$http = function(obj) {
        var $http = app.ng_objects.$http;
		var config = obj.config || {};
		var success = obj.success;
		var error = obj.error;

		config.method = obj.method;
		config.url = obj.url;
		config.cache = obj.cache;
		config.isShowLoading = obj.isShowLoading;
		config.withCredentials = obj.withCredentials;

        // 在此带上认证参数
        if (obj.method == 'POST') {
			config.data = obj.params;
        } else {
			config.params = obj.params;
        }

        $http(config).then(function (response) {
            var data = response.data;
			if (!data || !data.error || data.error.id != 0) {
                console.log(obj.url, data);
				error && error(data.error);
			} else {
				success && success(data.data);
			}
        }).catch(function (response) {
            console.log(obj.url, response);
			error && error();
        });

	}
	window.util = util;
	return util;
});
