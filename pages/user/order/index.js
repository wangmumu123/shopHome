/**@author wangmu 2016-12-8**/
var publicFun = require('../../../utils/public.js');
var common = require('../../../utils/common.js');
Page({
    data: {
        order_no: '',
        orderData: '',
        has_return: true,
        orderAddress: true,
        postage: true
    },
    onLoad: function(e) { // 页面渲染完成
        var that = this;
        this.setData({
            order_no: e.order,
            //order_no: 'PIG20170310144011781341'
        });
    },
    onShow: function(e) {
        var that = this;
        common.post('app.php?c=order&a=detail&order_no=' + this.data.order_no, '', "orderData", that);
    },
    orderData: function(result) {
        if (result.err_code == 0) {
            if (result.err_msg.order.shipping_method == 'selffetch') {
                result.err_msg.shopData = result.err_msg.address;
            }
            if (result.err_msg.order.status == '7') {
                for (var i in result.err_msg.product_list) {
                    if (result.err_msg.product_list[i].has_return) {
                        this.setData({
                            has_return: false,
                        });
                        break
                    } else {
                        this.setData({
                            has_return: true,
                        });

                    }
                }
            }

            result.err_msg.order.add_time_txt = publicFun.setDate(result.err_msg.order.add_time)
            result.err_msg.order.pay_time_txt = publicFun.setDate(result.err_msg.order.paid_time)

            this.setData({
                orderData: result.err_msg
            })
            publicFun.statusTitle(status) //设置标题
            publicFun.barTitle(this.data.orderData.store.name) //设置标题
        };

    },
    cancelOrder: function() { //取消订单
        var that = this;
        publicFun.cancelOrder(that, this.data.order_no);
    },
    paymentGo: function() { //去支付
        publicFun.paymentGo(this.data.order_no);
    },
    joinGo: function(e) { //跳转参团页面
        var that = this;
        publicFun.joinGo(e, that)
    },
    completeReceipt: function(e) { //确认收货
        var that = this;
        let order_no = this.data.order_no;
        console.log(order_no);
        publicFun.completeReceipt(order_no, that);
    },
    completeOrder: function(e) { //交易完成
        var that = this;
        let order_no = this.data.order_no;
        console.log(order_no);
        publicFun.completeOrder(order_no, that);
    },
    addressGo: function(e) { //我的地址
        wx.navigateTo({ url: '/pages/address/index' })
    },
    applyRefundGo: function(e) { //跳转申请退货页面
        publicFun.applyRefundGo(e)
    },
    returnGo: function(e) { //跳转退货详情页面
        publicFun.returnGo(e)
    },
    applyRightsGo: function(e) { //跳转申请退货页面
        publicFun.applyRightsGo(e)
    },
    rightsGo: function(e) { //跳转退货详情页面
        publicFun.rightsGo(e)
    },
    calling: function(e) { //拨打电话
        let num = e.target.dataset.num;
        publicFun.calling(num)
    },
    logistics: function(e) { //查看物流信息
        var that = this;
        publicFun.logistics(e, that)
    },
    appointment: function() { //分享
        var that = this;
        if (that.data.appointment) {
            that.setData({
                appointment: false
            })
            return
        }
        that.setData({
            appointment: true
        })
    }


})
