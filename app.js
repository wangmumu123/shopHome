//app.js
//wangmu 2017-02-08
var common = require('utils/common.js');
var publicFun = require('utils/public.js');
var callbackObj = null;
App({
    think: function() {
        return require('pages/think/utils/function');
    },


    globalData: {
        userInfo: null
    }
});
