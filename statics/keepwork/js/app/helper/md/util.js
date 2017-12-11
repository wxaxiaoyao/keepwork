
define([
	'app',	
], function(app) {
	var util = app.get("app.helper.util");

	util.parseHostname = function(hostname) {
		var officialHostnameList = [
			"localhost",
			"keepwork.com",
		];

		var result = {isOfficialHostname:true};
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
				result.officialHostname =officialHostname; 
			}
		}
		result.isOfficialHostname = false;
		return result;
	}

	util.parseUrl = function(hostname, pathname) {
        var hostname = window.location.hostname;
        var pathname = window.location.pathname;
        pathname = decodeURI(pathname);

        var paths = undefined;
		var temp = util.parseHostname(hostname);
		if (temp.isOfficialHostname) {
			paths = pathname.split("/").slice(1);
		} else {
			pathname = hostname.substring(0, hostname.indexOf(temp.officialHostname) - 1).replace(".", "/") + pathname;
			paths = pathname.split("/");
		}

        return {
			hostname:hostname,
			pathname:pathname,
			username:paths[0], 
			sitename:paths[1], 
			pagename:paths.slice(2).join("/"), 
		};
	}

	return util;
});
