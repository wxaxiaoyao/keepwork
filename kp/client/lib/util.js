import Vue from 'vue';
import VueResource from 'vue-resource';
import axios from 'axios';

Vue.use(VueResource);

var $http = axios;

var util = {};

function successWrap(success, error) {
	return function(resp) {
		var data = resp.data;
		console.log(data);
		if (data.error.id == 0) {
			success && success(data.data);
		} else {
			error && error();
		}
	}
}

function errorWrap(success, error) {
	return function(resp) {
		error && error();
	}
}

util.get = function(url, params, success, error) {
	$http.get(url, {
		params: params,
	}).then(successWrap(success, error), errorWrap(success, error));
}

util.post = function(url, data, success, error) {
	$http.post(url, data, {
	}).then(successWrap(success, error), errorWrap(success, error));
}

export default util;
