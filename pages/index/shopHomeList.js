var common = require('../../utils/common.js');
var publicFun = require('../../utils/public.js');
var app = getApp();
var THINK = app.think();
Page({
    data: {

    },
    onLoad: function() {
        var that = this;

     
    },
    onReady: function(e) {
        var that = this;
        let url = '/pages/index/index';
        common.post('app.php?c=lbs&a=substores', '', "shopHomeData", that);
        publicFun.setUrl(url);
        publicFun.height(that);
        publicFun.barTitle('选择门店');
    },
    onShow: function() {
        if (this.data.userData == '') {
            this.onReady(e);
        } else {
            publicFun.setUrl('')
        }
    },

    shopHomeData: function(result) {
        var that = this
        if (result.err_code == 0) {
            this.setData({
                shopHomeData: result.err_msg,
            })
            //console.log(publicFun.expressDistance('37.820587', '118.820587'));
            // publicFun.expressDistance(alats, alongs, lats, longs);

        }
    },

    wxSearchFn: function(e) {
        var that = this;
        var page = 'shopHome';
        publicFun.wxSearchFn(that, e, page);
    },
    wxSearchInput: function(e) {
        var that = this;
        publicFun.wxSearchInput(that, e)
    },
    cancelSearch: function(e) {
        var that = this;
        cancelSearch(that);
    },
    goShopList: function(e) {
        var that = this;
        var id = e.target.dataset.id;
        var data = {
            physical_id: id
        }
        common.post('app.php?c=lbs&a=switch_substore', data, shopHomeData, '');

        function shopHomeData(result) {
            if (result.err_code == 0) {
                wx.switchTab({
                    url: '/pages/index/index'
                })
            }
        }

    }

})
