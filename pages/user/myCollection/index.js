var common = require('../../../utils/common.js');
var publicFun = require('../../../utils/public.js');
let page = 1;
Page({
    data: {
        orderlistData: '',
        scrollTop: 0,
        scrollHeight: 0,
    },
    onReady: function() {
        var that = this;
        common.post('app.php?c=my&a=collect&type=1', '', "orderlistData", that);
        publicFun.height(that);
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
        let url = 'app.php?c=my&a=collect&type=1&page=' + page;
        if (that.data.orderlistData.next_page == false) {
            console.log('没有更多数据了');
            return
        }
        common.post(url, '', setPushData, '');

        function setPushData(result) { //添加数据
            let list = that.data.orderlistData.product_list;
            for (var i = 0; i < result.err_msg.product_list.length; i++) {
                list.push(result.err_msg.product_list[i]);
            }
            that.setData({
                'orderlistData.product_list': list,
                'orderlistData.next_page': result.err_msg.next_page
            });
        }
    },

    scroll: function(event) { //滚动函数
        this.setData({
            scrollTop: event.detail.scrollTop
        });
    },
    detailsGo: function(e) { //跳转详情页面
        publicFun.detailsGo(e)
    },
    completeOrder: function(e) { //完成订单
        var that = this;
        publicFun.completeOrder(e, that);
    },
    onShareAppMessage: function() {
        console.log(1311);
        return {
            title: '自定义分享标题',
            desc: '自定义分享描述',
            path: '/page/user?id=123'
        }
    }

})
