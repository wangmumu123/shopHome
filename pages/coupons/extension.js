var common = require('../../utils/common.js');
var publicFun = require('../../utils/public.js');
var app = getApp()
Page({
    data: {

    },
    onLoad: function() {
        var that = this;
        publicFun.barTitle('推广本店'); //修改头部标题
        common.post('app.php?c=ucenter&a=publicize&url=/pages/index/index', '', "coupontsData", that);
    },
    coupontsData: function(result) {
        if (result.err_code == 0) {
            this.setData({
                coupontsData: result.err_msg,
                ewm: common.Url + '/app.php?c=widget&a=wxapp_qr&store_id=' + common.store_id,
            })
        }
    },
    shear: function() {
        var that = this;
        publicFun.shear(that);
    },
    onShareAppMessage: function() {
        return {
            title: this.data.coupontsData.store.name,
            desc: '我想你推荐' + this.data.coupontsData.store.name + '店铺，人品保证',
            path: '/pages/index/index'
        }
    }


})
