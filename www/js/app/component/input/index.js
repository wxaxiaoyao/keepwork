
define([
	"app",
	"text!component/input/index.html",
], function(app, indexHtml) {
	var config = app.objects.config;
	var componentPrefixName = config.componentPrefixName;	
	var componentName = componentPrefixName + "Input";
	var input = {};
	var component = {};

	var controller = ["$scope", "$element", function($scope, $element){
		var ctrl = this;

		ctrl.style = {
		}

		ctrl.attr = {
			"type":"password",
		}

		var inputElem = $element.find("input");
		inputElem.attr(ctrl.attr);
		console.log($scope);

	   	ctrl.$onInit = function(){
			console.log("-----------");
		}
	}];

	// angular component
	var component = {
		template: indexHtml,
		controller: controller,
	}

	// 注册组件
	app.registerComponent(componentName, component);

	// 构造组件
	input.componentName = componentName;
	input.component = component;

	return input;
})

