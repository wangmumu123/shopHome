var common = require('../../../utils/common.js');
var publicFun = require('../../../utils/public.js');
Page({
    data: {
        addressData: '',
        currentTab: 0,
    },
    onReady: function() {
        var that = this;
        publicFun.height(that);
        common.post('app.php?c=address&a=all', '', "addressData", that);
    },
    onShow: function() {
        var that = this;
        common.post('app.php?c=address&a=all', '', "addressData", that);
    },
    addressEditGO: function(e) { //添加编辑地址
        let addid = e.target.dataset.addid;
        wx.navigateTo({ url: '/pages/user/address/addressEdit?addid=' + addid })
    },
    defaultAddress: function(e) { //修改默认地址
        var that = this;
        publicFun.defaultAddress(e, that);
    },
    delAddress: function(e) { //删除地址
        var that = this;
        publicFun.delAddress(e, that);
    },
    addressData: function(result) {
        var that = this;
        if (result.err_code == 0) {
            this.setData({
                addressData: result.err_msg
            })
        }
    }
})
