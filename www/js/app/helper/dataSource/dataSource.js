/**
 * Created by wuxiangan on 2017/2/21.
 */

define([
	'app',
    'helper/dataSource/gitlab',
], function (app, gitlab) {
	
	function dataSource(config) {
		if (config.type == "gitlab") {
			return gitlab(config);
		}
	}

	return dataSource;
});
