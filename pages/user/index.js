var publicFun = require('../../utils/public.js');
var common = require('../../utils/common.js');
Page({
    data: {
        userData: ''
    },
    onLoad: function() { // 页面渲染完成
        publicFun.barTitle('个人中心'); //修改头部标题

    },
    onReady: function(e) {
        var that = this;
        common.post('app.php?c=my&a=index', '', "userData", that);
      
        publicFun.height(that);
    },
    onShow: function(e) {


    },
    userData: function(result) {
        if (result.err_code == 0) {
            this.setData({
                userData: result.err_msg
            })
        };
    },
    orderListGo: function(e) { //我的订单列表
        let id = e.target.dataset.status;
        wx.navigateTo({ url: '/pages/user/order/orderList?status=' + id })
    },
    mycollageGo: function(e) { //我的拼团
        wx.navigateTo({ url: '/pages/myCollage/myCollageList' })
    },
    myCollection: function(e) { //我的收藏
        wx.navigateTo({ url: '/pages/myCollection/index' })
    },
    addressGo: function(e) { //我的地址
        wx.navigateTo({ url: '/pages/address/index' })
    },
    myServerGo: function(e) { //我的售后
        console.log(e);
        wx.navigateTo({ url: '/pages/myServer/index' })
    }

})
