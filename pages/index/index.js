var common = require('../../utils/common.js');
var publicFun = require('../../utils/public.js');
var app = getApp();
var THINK = app.think();
Page({
    data: {
        scrollTop: {
            scroll_top: 0,
            goTop_show: false
        },
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
        item: {
            nav_list: [
                {
                    image: '../../images/banner one@1x.png',
                    ulr: ''
                },
                {
                    image: '../../images/banner two@1x.png',
                    ulr: ''
                }
            ],
            content: [
                {
                    image: '../../images/70AA4FED-892E-4E08-BCF0-F26B40FBFD5F@3x.png',
                    ulr: '',
                    title: '贵金属'
                },
                {
                    image: '../../images/1BFA09A6-7A45-4AE5-B67C-11F0DC9BB43B@3x.png',
                    ulr: '',
                    title: '图书杂志'
                },
                {
                    image: '../../images/73C9901E-E0A6-4464-ABF4-F854EE803225@1x.png',
                    ulr: '',
                    title: '电子产品'
                },
                {
                    image: '../../images/C1DF3ADB-53F2-486A-90A7-C31CF72736C8@3x.png',
                    ulr: '',
                    title: '家纺家居'
                },
                {
                    image: '../../images/AFC7BB7B-52BC-453A-9D89-33C56DA6A983@3x.png',
                    ulr: '',
                    title: '母婴产品'
                },
                {
                    image: '../../images/6161268F-9173-4DB9-BA59-CFC62463BE63@3x.png',
                    ulr: '',
                    title: '美妆护理'
                },
                {
                    image: '../../images/B64765B5-8F95-4AC3-A9DD-D34F508E6177@3x.png',
                    ulr: '',
                    title: '日常护理'
                },
                {
                    image: '../../images/EDED0786-EC96-46C8-A964-0E1E3B93634D@3x.png',
                    ulr: '',
                    title: '营养健康'
                }

            ],
            productList: [
                {
                    image: '../../images/0B624C6C-8118-44EB-9A3D-5871120D2873@3x.png',
                    ulr: '',
                    name: '九阳电饭锅电饭煲电饭锅',
                    title: '1231',
                    sales: '234234',
                    price: 230,
                },
                {
                    image: '../../images/B2EF5ADF-844D-4DCC-8EF2-60E216718796@3x.png',
                    ulr: '',
                    name: '九阳电饭锅电饭煲电饭锅',
                    title: '1231',
                    sales: '234234',
                    price: 230,
                },
                {
                    image: '../../images/F1AAD52F-507A-48C9-8314-F9AAD550B523@3x.png',
                    ulr: '',
                    name: '九阳电饭锅电饭煲电饭锅',
                    title: '1231',
                    sales: '234234',
                    price: 230,
                },
                {
                    image: '../../images/F1AAD52F-507A-48C9-8314-F9AAD550B523@3x.png',
                    ulr: '',
                    name: '九阳电饭锅电饭煲电饭锅',
                    title: '1231',
                    sales: '234234',
                    price: 230,
                },
                {
                    image: '../../images/B2EF5ADF-844D-4DCC-8EF2-60E216718796@3x.png',
                    ulr: '',
                    name: '九阳电饭锅电饭煲电饭锅',
                    title: '1231',
                    sales: '234234',
                    price: 230,
                },
                {
                    image: '../../images/F1AAD52F-507A-48C9-8314-F9AAD550B523@3x.png',
                    ulr: '',
                    name: '九阳电饭锅电饭煲电饭锅',
                    title: '1231',
                    sales: '234234',
                    price: 230,
                },
                {
                    image: '../../images/B2EF5ADF-844D-4DCC-8EF2-60E216718796@3x.png',
                    ulr: '',
                    name: '九阳电饭锅电饭煲电饭锅',
                    title: '1231',
                    sales: '234234',
                    price: 230,
                }

            ]
        },
        currentTab: 0,
        productList: 0,
    },

    onLoad: function () {
        var that = this;
    },
    onReady: function () {
        var that = this;
        publicFun.height(that);
    },
    onShow: function () {

    },
    onHide: function () {
        clearTimeout(this.data.businessTimeInt)
    },
    shoppingCatNum: function (result) {
        if (result.err_msg == 1) {
            this.setData({
                shoppingCatNum: true,
            })
        }
    },
    shopHomeData: function (result) {
        var that = this
        if (result.err_code == 0) {
            common.post('app.php?c=cart&a=number', '', "shoppingCatNum", that); //判断购物车数量

            this.setData({
                shopHomeData: result.err_msg,
            })
            //publicFun.business(that, that.data.shopHomeData.store.order_notice_time); //订单提醒
            publicFun.textScroll(that); //公告文字
            let custom_field_list = that.data.shopHomeData.custom_field_list;
            for (var i in custom_field_list) {
                if (custom_field_list[i].field_type == 'rich_text') { //模板富文本转化
                    let rich_text = publicFun.formatStr(custom_field_list[i].content);
                    if (rich_text != '' && rich_text != undefined) {
                        rich_text = THINK.html2json(rich_text);
                    }
                    custom_field_list[i].content = rich_text
                }
                if (custom_field_list[i].field_type == 'image_ad') { //图片广告
                    for (var j in custom_field_list[i].content.nav_list) {
                        custom_field_list[i].content.nav_list[j].type = publicFun.getType(custom_field_list[i].content.nav_list[j].url).type;
                        custom_field_list[i].content.nav_list[j].url = publicFun.getType(custom_field_list[i].content.nav_list[j].url).url;
                        ///console.log(custom_field_list[i].content.nav_list[j].type);

                    }
                }
                if (custom_field_list[i].field_type == 'image_nav') { //图片导航
                    for (var j in custom_field_list[i].content) {
                        custom_field_list[i].content[j].type = publicFun.getType(custom_field_list[i].content[j].url).type
                        custom_field_list[i].content[j].url = publicFun.getType(custom_field_list[i].content[j].url).url;

                    }
                }
                if (custom_field_list[i].field_type == 'article') {
                    that.data.article_id = i;
                    that.setData({
                        article_id: i
                    })
                }
            }
            this.setData({
                'shopHomeData': that.data.shopHomeData,
            });
            //            console.log(that.data.shopHomeData)
            publicFun.barTitle(that.data.shopHomeData.store.name, that);

        }
    },
    oppenShopping: function (e) { //加入购物车
        var that = this
        publicFun.oppenShopping(e, that);
    },
    plus: function () { //加
        var that = this;
        publicFun.plus(that);
    },
    reduce: function () { //减
        var that = this;
        publicFun.reduce(that);
    },
    shoppingBlur: function (e) { //输入框
        var that = this;
        publicFun.shoppingBlur(e, that)
    },
    shoppingVid: function (e) { //选择商品规格
        var that = this;
        publicFun.shoppingVid(e, that);
    },
    messageInput: function (e) { //留言内容
        var that = this;
        let index = e.target.dataset.index;
        that.data.shoppingData.shoppingCatData.reservation_custom_fields[index].value = e.detail.value;
        this.setData({
            'shoppingData': that.data.shoppingData
        })
    },

    bindDateChange: function (e) { //选择日期
        var that = this;
        let index = e.target.dataset.index;
        let date = e.detail.value;
        that.data.shoppingData.shoppingCatData.reservation_custom_fields[index].date = date;
        that.setData({
            'shoppingData': that.data.shoppingData
        })
    },
    bindTimeChange: function (e) { //选择时间
        var that = this;
        let index = e.target.dataset.index;
        let time = e.detail.value;
        that.data.shoppingData.shoppingCatData.reservation_custom_fields[index].time = time;
        that.setData({
            'shoppingData': that.data.shoppingData
        })
    },
    payment: function (e) { //下一步,去支付
        var that = this;
        publicFun.payment(that, e)
    },
    goTopFun: function (e) { //回到顶部滚动条
        var that = this;
        publicFun.goTopFun(e, that)
    },
    closeShopping: function (e) { //关闭提示框遮罩层
        var that = this;
        publicFun.closeShopping(that);
    },
    swichNav: function (e) {
        var that = this;
        publicFun.swichNav(e, that);
    },
    productListSwichNav: function (e) {
        var that = this;
        publicFun.productListSwichNav(e, that);
    },
    wxSearchFn: function (e) {
        var that = this;
        var page = 'page';
        publicFun.wxSearchFn(that, e, page);
    },
    wxSearchInput: function (e) {
        var that = this;
        publicFun.wxSearchInput(that, e)
    },

    collect: function (e) { //收藏动态
        var that = this;
        publicFun.shopcollect(that, e);

    },
    collectShop: function (e) { //收藏店铺
        var that = this;
        publicFun.collectShop(that, e);

    },
    mapData: function (e) {
        var that = this;
        publicFun.mapData(that, e);

    },

    onShareAppMessage: function () {
        return {
            title: this.data.shopHomeData.store.name,
            desc: '没有就写这里发现一个好店铺，速度围观',
            path: '/pages/index/index'
        }
    }



})
