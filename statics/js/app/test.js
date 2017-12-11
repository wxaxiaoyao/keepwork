

define([

], function () {
    app.registerComponent("helloWorld", {
        template: '<div>My name is {{$ctrl.name}}</div>',
        controller: function() {
            this.name = 'shahar';
        }
    });
});