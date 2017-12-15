
define([
	'app',	
], function(app) {
	var util = app.get("app.helper.util");

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
			sitename:paths[1], 
			pagename:paths.length > 2 ? paths.slice(2).join("/") : undefined, 
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
		$scope = app.ng_objects.$rootScope;
		setTimeout(function(){
			$scope.$apply();
		});
	}

	util.setPageContentUrl = function(url) {
		app.ng_objects.$rootScope.contentUrl = state.url;
		util.$apply();
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
		console.log(window.history.state);
		var state = window.history.state;
		app.ng_objects.$rootScope.contentUrl = state.url;
		util.$apply();
	}

	window.util = util;
	return util;
});
