var common = require('../../utils/common.js');
var publicFun = require('../../utils/public.js');
var app = getApp();
let page = 1;
Page({
    data: {
        shoppingData: {
            shoppingShow: false,
            shoppingCatData: '',
            specList: [{
                'vid': 1
            }, {
                'vid': 1
            }, {
                'vid': 1
            }],
            value: '',
            sku_id: '',
            shoppingNum: 1,
        },
        currentTab: 0,
        productList: 0,
    },
    onReady: function(e) {
        var that = this;
        let url = '/pages/product/recommend';
        common.post('app.php?c=goods&a=recommend', '', "productListData", that);
        publicFun.setUrl(url);
        publicFun.height(that);
        publicFun.barTitle('推荐'); //修改头部标题
    },
    onShow: function() {
        if (this.data.productListData == '') {
            this.onReady(e);
        } else {
            publicFun.setUrl('')
        }
    },
    shoppingCatNum: function(result) {
        if (result.err_msg == 1) {
            this.setData({
                shoppingCatNum: true,
            })
        }
    },
    productListData: function(result) {
        var that = this;
        if (result.err_code == 0) {
            common.post('app.php?c=cart&a=number', '', "shoppingCatNum", that); //判断购物车数量
            this.setData({
                productListData: result.err_msg,
            })
        }
    },
    bindDownLoad: function() {
        var that = this;
        if (that.data.productListData.next_page == false) {
            console.log('没有更多数据了');
            return
        }
        page++;
        let url = 'app.php?c=goods&a=recommend&page=' + page
        common.post(url, '', setPushData, '');

        function setPushData(result) {
            let list = that.data.productListData.product_list;
            for (var i = 0; i < result.err_msg.product_list.length; i++) {
                list.push(result.err_msg.product_list[i]);
            }
            that.setData({
                'productListData.product_list': list,
                'productListData.next_page': result.err_msg.next_page
            });
        }
    },
    scroll: function(event) {
        this.setData({
            scrollTop: event.detail.scrollTop
        });
    },
    oppenShopping: function(e) { //加入购物车
        var that = this
        publicFun.oppenShopping(e, that);
    },
    plus: function() { //加
        var that = this;
        publicFun.plus(that);
    },
    reduce: function() { //减
        var that = this;
        publicFun.reduce(that);
    },
    shoppingBlur: function(e) { //输入框
        var that = this;
        publicFun.shoppingBlur(e, that)
    },
    shoppingVid: function(e) { //选择商品规格
        var that = this;
        publicFun.shoppingVid(e, that);
    },
    messageInput: function(e) { //留言内容
        var that = this;
        let index = e.target.dataset.index;
        that.data.shoppingData.shoppingCatData.reservation_custom_fields[index].value = e.detail.value;
        this.setData({
            'shoppingData': that.data.shoppingData
        })
    },

    bindDateChange: function(e) { //选择日期
        var that = this;
        let index = e.target.dataset.index;
        let date = e.detail.value;
        that.data.shoppingData.shoppingCatData.reservation_custom_fields[index].date = date;
        that.setData({
            'shoppingData': that.data.shoppingData
        })
    },
    bindTimeChange: function(e) { //选择时间
        var that = this;
        let index = e.target.dataset.index;
        let time = e.detail.value;
        that.data.shoppingData.shoppingCatData.reservation_custom_fields[index].time = time;
        that.setData({
            'shoppingData': that.data.shoppingData
        })
    },
    payment: function(e) { //下一步,去支付
//        console.log(e);
        var that = this;
        publicFun.payment(that, e)
    },
    goTopFun: function(e) { //回到顶部滚动条
        var that = this;
        publicFun.goTopFun(e, that)
    },
    closeShopping: function(e) { //关闭提示框遮罩层
        var that = this;
        publicFun.closeShopping(that);
    },
    onShareAppMessage: function() {
        return {
            title: this.data.productListData.store.name,
            desc: '优质商品，汇聚一起，任你挑选',
            path: '/pages/product/recommend/'
        }
    }

})
