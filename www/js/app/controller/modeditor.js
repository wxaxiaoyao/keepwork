
define([
	"app",
	"modeditor/tags",
	"text!html/controller/modeditor.html",
], function(app, tags, htmlContent){

	app.registerController("modeditorController", ["$scope", function($scope){
		var $rootScope = app.ng_objects.$rootScope;
		var $compile = app.ng_objects.$compile;
		var blockTag = tags.getTag("colDiv");
		var tagStack = [];

		$rootScope.isShowFooter = false;
		$scope.tagTree = tags.tagTree();

		function apply() {
			setTimeout(function(){
				$scope.$apply();
			});
		}

		function init(){
			setCurrentTag(blockTag);

			var rowTag = tags.getTag("rowDiv");
			var pTag = tags.getTag("text");
			//pTag.attrs.style["margin"] = "20%";
			//rowTag.addTag(pTag);
			//rowTag.addTag(tags.getTag("img"));
			//blockTag.addTag(rowTag);

			//rowTag = tags.getTag("div");
			//rowTag.attrs.style["display"] = "flex";
			//rowTag.attrs.style["height"] = "100px";
			//blockTag.addTag(rowTag);
		


			$(".attrInputContainer").find("input").change(tagValueChange);
			$(".attrInputContainer").find("textarea").change(tagValueChange);

			renderBlock();
		}

		var dragObj = {};
		function ondragenter(e) {
			e.stopPropagation();
			console.log(e);
			console.log("ondragenter");
		}

		function ondragover(e) {
			e.stopPropagation();
			e.preventDefault();
		}

		function ondragleave(e) {
			e.stopPropagation();
			console.log(e);
			console.log("ondragleave");
		}

		function ondrop(e) {
			e.stopPropagation();
			console.log(e);
			console.log("ondrop");

			dragObj.container = $(e.target);
			dragObj.containerTag = blockTag.findById(e.target.id);
			dragObj.dstClientX = e.clientX;
			dragObj.dstClientY = e.clientY;

			dragObj.offsetX = dragObj.dstClientX - dragObj.srcClientX;
			dragObj.offsetY = dragObj.dstClientY - dragObj.srcClientY;

			console.log(dragObj);

			var elem = dragObj.elem;
			var parentElem = dragObj.parentElem;
			var marginLeft = elem.css("margin-left");
			var marginTop = elem.css("margin-top");
			var paddingLeft = elem.css("padding-left");
			var paddingTop = elem.css("padding-top");
			marginLeft = parseInt(marginLeft.substring(0, marginLeft.length-2));
			marginTop = parseInt(marginTop.substring(0, marginTop.length-2));
			paddingLeft = parseInt(paddingLeft.substring(0, paddingLeft.length-2));
			paddingTop = parseInt(paddingTop.substring(0, paddingTop.length-2));
			//var parentWidth = parentElem.width();
			//var parentHeight = parentElem.height();
			console.log(marginLeft, marginTop, paddingLeft, paddingTop);
			marginLeft += dragObj.offsetX;
			marginTop += dragObj.offsetY;
			paddingLeft += dragObj.offsetX;
			paddingTop += dragObj.offsetY;
			console.log(marginLeft, marginTop, paddingLeft, paddingTop);

			console.log(elem.css("margin"));
			if (marginLeft >= 0 && marginTop >= 0) {
				elem.css("margin-left", marginLeft + "px");
				elem.css("margin-top", marginTop + "px");

				dragObj.tag.attrs.style["margin"] = elem.css("margin");
				
			}
			//if (paddingLeft >= 0 && paddingTop >= 0) {
				//elem.css("padding-left", paddingLeft + "px");
				//elem.css("padding-top", paddingTop + "px");
			//}
			return true;
		}

		function ondragstart(e) {
			e.stopPropagation();
			console.log(e);
			console.log("ondragstart");

			dragObj.elem = $(e.target);
			dragObj.tag = blockTag.findById(e.target.id);
			dragObj.parentTag = dragObj.tag.parentTag;
			dragObj.parentElem = $("#" + dragObj.parentTag.tagId);
			dragObj.srcClientX = e.clientX;
			dragObj.srcClientY = e.clientY;

			//console.log(dragObj);
			return true;
		}

		function ondrag() {

		}

		function ondragend(e) {
			e.stopPropagation();
			console.log(e);
			console.log("ondragend");
		}

		function onclick(e) {
			console.log(e);
			console.log("onclick");

			var tag = blockTag.findById(e.target.id);
			setCurrentTag(tag);	
		}

		function onmouseenter(e) {
			//$("#modeditorarea").find(".hoverTag").removeClass("hoverTag");
			//$(e.target).addClass("hoverTag");
		}

		function onmouseleave(e) {
			$(e.target).removeClass("hoverTag");
		}

		function onmouseover(e) {
			e.stopPropagation();
			$("#modeditorarea").find(".hoverTag").removeClass("hoverTag");
			$(e.target).addClass("hoverTag");
		}
		function tagValueChange(e) {
			console.log(e);
			renderBlock();
		}

		function activeCurrentTag() {
			$("#modeditorarea").find(".activeTag").removeClass("activeTag");
			$("#" + $scope.tag.tagId).addClass("activeTag");
		}

		function initModEditorAreaView() {
			var tagView = function(tag) {
				var $elem = $("#" + tag.tagId);
				var elem = $elem[0];

				$elem.attr("draggable", true);

				elem.onclick = onclick;
				elem.onmouseover = onmouseover;
				//elem.onmouseenter = onmouseenter;
				elem.onmouseleave = onmouseleave;

				//elem.ondragenter = ondragenter;
				elem.ondragover = ondragover;
				//elem.ondragleave = ondragleave;
				elem.ondrop = ondrop;
				// 只要绑定在
				elem.ondragstart = ondragstart;
				//elem.ondrag = ondrag;
				elem.ondragend = ondragend;
			}

			//allElem.
			var eachTag = function(tag, callback) {
				if (!tag) {
					return;
				}

				callback && callback(tag);

				for (var i = 0; i < tag.children.length; i++) {
					eachTag(tag.children[i], callback);
				}

				return;
			}

			eachTag(blockTag, tagView);
		}

		function renderBlock() {
			console.log(blockTag);
			var htmlStr = blockTag.html();
			console.log(htmlStr);
			var modeditorarea = $("#modeditorarea");
			console.log(modeditorarea);
			//modeditorarea.html($compile(htmlStr)($scope));
			modeditorarea.html(htmlStr);

			var vm = new app.vue({
				el:modeditorarea[0],
				data:{
					params: {

					},
				}
			});


			initModEditorAreaView();

			
			activeCurrentTag();
		}

		// 设置当前编辑的tag
		function setCurrentTag(tag) {
			if (!tag) {
				return;
			}

			var navTagList = [];
			var tmpTag = tag;
			while(tmpTag) {
				navTagList.push(tmpTag);
				tmpTag = tmpTag.parentTag;
			}
			navTagList.reverse();

			$scope.navTagList = navTagList;
			$scope.tag = tag;
			$scope.attrs = tag.attrs;
			$scope.style = tag.attrs.style;
			
			activeCurrentTag();
			apply();
		}

		$scope.clickAddTag = function(x) {
			$scope.tag.addTag(tags.getTag(x.type));	
			renderBlock();
		}

		$scope.clickBackTag = function() {
			if (!$scope.tag.parentTag) {
				return ;
			}

			setCurrentTag($scope.tag.parentTag);
		}

		$scope.clickSelectTag = function(tag) {
			setCurrentTag(tag);
		}

		$scope.styleChange = function(){
			console.log($scope.style);
			
			renderBlock();
		}

		$scope.clickDeleteTag = function($event, index) {
			$event && $event.stopPropagation();
			var tag = $scope.tag;
			tag.children.splice(index, 1);		

			renderBlock();
		}
		
		$scope.clickSwapTag = function($event, index1, index2) {
			$event && $event.stopPropagation();

			var tag = $scope.tag;
			if (index1 < 0 || index2 >= tag.children.length) {
				return;
			}
			var tmp = tag.children[index1];
			tag.children[index1] = tag.children[index2];
			tag.children[index2] = tmp;

			renderBlock();
		}

		$scope.styleKeyBlur = function() {
			if ($scope.styleKey) {
				$scope.styleValue = $scope.style[$scope.styleKey];
			}
		}

		$scope.styleValueBlur = function() {
			//console.log($scope.styleValue);
			if ($scope.styleKey) {
				if ($scope.styleValue) {
					$scope.style[$scope.styleKey] = $scope.styleValue;
				} else {
					delete $scope.style[$scope.styleKey];
				}
			}

			$scope.styleKey = "";
			$scope.styleValue = "";

			renderBlock();
		}

		$scope.attrKeyBlur = function() {
			if($scope.attrKey) {
				$scope.attrValue = $scope.attrs[$scope.attrKey];
			}
		}

		$scope.attrValueBlur = function() {
			if ($scope.attrKey) {
				if ($scope.attrValue){
					$scope.attrs[$scope.attrKey] = $scope.attrValue;
				} else {
					delete $scope.attrs[$scope.attrKey];
				}
			}	

			$scope.attrKey = "";
			$scope.attrValue = "";

			renderBlock();
		}

		$scope.attrChange = function(x) {
			console.log(x, $scope.attrs);
		}
		$scope.clickExpandTag = function(node) {
			node.isExpand = !node.isExpand;
		}
		$(document).keyup(function(event){
			if (app.objects.current_url != "/www/modeditor") {
				return;
			}
			if (event.keyCode == "13") {
				renderBlock();
			}
		});

		$scope.$watch("$viewContentLoaded", init);
	}]);

	return htmlContent;
});
