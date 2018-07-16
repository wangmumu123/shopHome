var common = require('../../../utils/common.js');
var publicFun = require('../../../utils/public.js');
let page = 1;
Page({
    data: {
        orderlistData: '',
        scrollTop: 0,
        scrollHeight: 0,
        currentTab: 0,

    },
    onReady: function() {
        var that = this;
        common.post('app.php?c=order&a=reservation&status=0', '', "orderlistData", that);
        publicFun.height(that);
        publicFun.barTitle('我的预约');
    },
    orderlistData: function(result) {
        if (result.err_code == 0) {
            this.setData({
                orderlistData: result.err_msg
            })
        };
    },
    bindDownLoad: function() { //滚动触发到底部
        var that = this;
        page++;
        common.post('app.php?c=order&a=reservation&status=' + that.data.currentTab, '', "setPushData", that);

    },
    setPushData: function(result) { //添加数据
        var that = this;
        let list = that.data.orderlistData.return_list;
        for (var i = 0; i < result.err_msg.return_list.length; i++) {
            list.push(result.err_msg.return_list[i]);
        }
        that.setData({
            'orderlistData.return_list': list
        });
    },
    scroll: function(event) { //滚动函数
        this.setData({
            scrollTop: event.detail.scrollTop
        });
    },
    swichNav: function(e) {
        var that = this;
        let currentTab = e.target.dataset.current;
        common.post('app.php?c=order&a=reservation&status=' + currentTab, '', "orderlistData", that);
        publicFun.swichNav(e, that);
    },
    appointment: function(e) { //核销
        var that = this;
        let appoin = e.target.dataset.appoin;
        that.setData({
            'verify_image_code': appoin
        })
        if (that.data.appointment) {
            that.setData({
                appointment: false
            })
            return
        }
        that.setData({
            appointment: true
        })
    },
    appoCencel: function(e) {
        var that = this;
        let order = e.target.dataset.orderid;
        let index = e.target.dataset.index;
        common.post('app.php?c=order&a=reservation_canceln&order_id=' + order, '', appoCencel, '');

        function appoCencel(result) {
            if (data.err_code == 0) {
                delete that.data.orderlistData.orders[index];
                that.setData({
                    'orderlistData': that.data.orderlistData
                })
                return
            }
        }

    },




})
