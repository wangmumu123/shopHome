var common = require('../../utils/common.js');
var publicFun = require('../../utils/public.js');
var app = getApp();
let page = 1;
Page({
    data: {
        currentTab: 0,
        type: 'all'
    },
    onLoad: function() {
        var that = this;
        common.post('app.php?c=coupon&a=all', '', "coupontsData", that);
        //publicFun.setUrl(url);
        publicFun.barTitle('优惠券'); //修改头部标题
        publicFun.height(that);

    },
    coupontsData: function(result) {
        if (result.err_code == 0) {
            for (var i in result.err_msg.coupon_list) {
                result.err_msg.coupon_list[i].end_time_str = publicFun.setDateDay(result.err_msg.coupon_list[i].end_time);
                result.err_msg.coupon_list[i].start_time = publicFun.setDateDay(result.err_msg.coupon_list[i].start_time)
            }
            this.setData({
                coupontsData: result.err_msg,
            })

        }
    },
    bindDownLoad: function() {
        var that = this;
        if (that.data.coupontsData.next_page == false) {
            console.log('没有更多数据了');
            return
        }
        page++;
        let url = 'app.php?c=coupon&a=all&page=' + page + '&type=' + that.data.type
        common.post(url, '', setPushData, '');

        function setPushData(result) {
            let list = that.data.coupontsData.coupon_list;
            for (var i = 0; i < result.err_msg.coupon_list.length; i++) {
                list.push(result.err_msg.coupon_list[i]);
            }
            that.setData({
                'coupontsData.coupon_list': list,
                'coupontsData.next_page': result.err_msg.next_page
            });
        }
    },
    scroll: function(event) {
        this.setData({
            scrollTop: event.detail.scrollTop
        });
    },
    swichNav: function(e) {
        var that = this;
        that.setData({
            type: e.target.dataset.type
        })
        page = 1;
        let url = 'app.php?c=coupon&a=all&page=' + page + '&type=' + that.data.type
        common.post(url, '', 'coupontsData', that);
        publicFun.swichNav(e, that);
    },

})
