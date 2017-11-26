/**
 * Created by Administrator on 2017/11/26.
 */

define([
], function () {
    window.config = window.config || {};

    // 全局变量
    config._G = config._G || {};
    // 获取对象
    config.get = function(key, obj) {
        if (!key) {
            return config._G;
        }

        var ks = key.split(".");
        var g = config._G;
        var length = ks.length;
        for (var i = 0; i < length - 1; i++) {
            g[ks[i]] = g[ks[i]] || {};
            g = g[ks[i]];
        }
        g = g[ks[length-1]] = obj || {};
        return g;
    }

    return config;
});