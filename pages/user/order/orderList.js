var common = require('../../../utils/common.js');
var publicFun = require('../../../utils/public.js');
let page = 1;
let i = 0;
Page({
    data: {
        currentTab: 'all',
        orderlistData: '',
        scrollTop: 0,
        scrollHeight: 0,
        type: 'all',
        swichNav: [],
    },
    onLoad: function(e) { // 页面渲染完成
        var that = this;
        this.setData({
            currentTab: e.status
        });
        publicFun.height(that);
    },
    onReady: function(e) {
        var that = this;
        common.post('app.php?c=order&a=user_all&type=' + that.data.currentTab, '', "orderlistData", that);
    },
    onShow: function(e) {
        var that = this;
    },
    orderlistData: function(result) {
        var that = this;

        if (result.err_code == 0) {
            this.setData({
                orderlistData: result.err_msg
            })
            let list = that.data.orderlistData.order_list;
            for (var i in list) {
                list[i].typeTxt = publicFun.orderType(list[i].type);
                if (list[i].status == '7') {
                    for (var j in list[i].order_product_list) {
                        if (list[i].order_product_list[j].has_return) {
                            list[i].has_return = true;
                            this.setData({
                                orderlistData: that.data.orderlistData,
                            });
                            continue
                        } else {
                            list[i].has_return = false;
                            this.setData({
                                orderlistData: that.data.orderlistData,
                            });

                        }
                    }
                }
            }
            this.setData({
                    orderlistData: that.data.orderlistData
                })
                //console.log(that.data.orderlistData);
            publicFun.barTitle(that.data.orderlistData.title)
        };
    },
    swichNav: function(e) {
        var that = this;
        publicFun.swichNav(e, that);
        let currentTab = e.target.dataset.current;
        common.post('app.php?c=order&a=user_all&type=' + currentTab, '', "orderlistData", that);
    },
    bindDownLoad: function() { //滚动触发到底部
        var that = this;
        let url = 'app.php?c=order&a=user_all&type=' + that.data.currentTab + '&page=' + page;
        publicFun.orderPushData(page++, that, url)
    },
    scroll: function(event) { //滚动函数
        this.setData({
            scrollTop: event.detail.scrollTop
        });
    },
    cancelOrder: function(e) { //取消订单
        var that = this;
        let order_no = e.target.dataset.order;
        let index = e.target.dataset.index;
        publicFun.cancelOrder(that, order_no, index);
    },
    paymentGo: function(e) { //去支付
        let order_no = e.target.dataset.order;
        // console.log(order_no);
        wx.navigateTo({ url: '/pages/payment/index?order_no=' + order_no });
    },
    completeOrder: function(e) { //交易完成
        var that = this;
        let order_no = e.target.dataset.order;
        let index = e.target.dataset.index;
//        console.log(order_no);
        publicFun.completeOrder(order_no, that, index);
    },
    completeReceipt: function(e) { //确认收货
        var that = this;
        let order_no = e.target.dataset.order;
        let index = e.target.dataset.index;
        console.log(order_no, index);
        publicFun.completeReceipt(order_no, that, index);
    },
    orderGo: function(e) { //跳转详情页面
        publicFun.orderGo(e)
    },
    applyRefundGo: function(e) { //跳转申请退货页面
        publicFun.applyRefundGo(e)
    },
    returnGo: function(e) { //跳转查看退货页面
        publicFun.returnGo(e)
    }
})
