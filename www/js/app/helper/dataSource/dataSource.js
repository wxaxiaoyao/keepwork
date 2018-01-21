/**
 * Created by wuxiangan on 2017/2/21.
 */

define([
	'app',
	'jshashes',
    'helper/dataSource/gitlab',
], function (app, Hashes, gitlab) {
	var sha1 = new Hashes.SHA1().setUTF8(true);
	
	function getStringByteLength(str) {
		var totalLength = 0;     
		var charCode;  
		for (var i = 0; i < str.length; i++) {  
			charCode = str.charCodeAt(i);  
			if (charCode < 0x007f)  {     
				totalLength++;     
			} else if ((0x0080 <= charCode) && (charCode <= 0x07ff))  {     
				totalLength += 2;     
			} else if ((0x0800 <= charCode) && (charCode <= 0xffff))  {     
				totalLength += 3;   
			} else{  
				totalLength += 4;   
			}          
		}  
		return totalLength;   
	}

	function dataSource(config) {
		var git = {};
		if (config.type == "gitlab") {
			git = gitlab(config);
		}

		git.sha = function(content) {
			var header = "blob " + getStringByteLength(content) + "\0";
			var text = header + content;
			return sha1.hex(text);
		}

		return git;
	}

	return dataSource;
});
