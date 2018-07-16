var common = require('../../utils/common.js');
var publicFun = require('../../utils/public.js');
var app = getApp();
var THINK = app.think();
let page = 1;
let i = 0;
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
            date: '2016-09-01',
            time: '12:00',
        },
        currentTab: 0,
        productList: 0,
        tab: 'HAO',
        type: 0,
        businessTimeInt: '',
        productListSwichNav: [],

    },

    onLoad: function(e) {
        var that = this;
        this.setData({
            product_id: e.product_id,
            //product_id: 1098,

        });
    },
    onReady: function(e) {
        var that = this;
        let url = '/pages/product/details?product_id=' + that.data.product_id;
        publicFun.setUrl(url);
        common.post('app.php?c=goods&a=index&app=app&id=' + that.data.product_id, '', "productData", that);
        publicFun.height(that);

    },
    onShow: function() {
        if (this.data.productData == '') {
            this.onReady(e);
        } else {
            publicFun.setUrl('')
        }
    },
    onHide: function() {
        clearTimeout(this.data.businessTimeInt)
    },
    shoppingCatNum: function(result) {
        if (result.err_msg == 1) {
            this.setData({
                shoppingCatNum: true,
            })
        }
    },
    productData: function(result) {
        var that = this;
        if (result.err_code == 0) {
            common.post('app.php?c=cart&a=number', '', "shoppingCatNum", that); //判断购物车数量
            this.setData({
                productData: result.err_msg,
            })
            let info = publicFun.formatStr(this.data.productData.product.info);
            publicFun.barTitle(this.data.productData.product.name); //修改头部标题
            for (var i = 0; i < that.data.productData.discount_arr.length; i++) {
                that.data.productData.discount_arr[i].msg = that.data.productData.discount_arr[i].msg.replace(/<[^>]+>/g, "")
            }

            if (info != '' && info != undefined) {
                info = THINK.html2json(info);
            }
            //            console.log(info);
            this.data.productData.product.info = info;
            this.setData({ //模板富文本转化
                'productData': that.data.productData,
            });
            //            console.log(that.data.productData);
            publicFun.postage(that); //邮费计算
            publicFun.credit_arr(that); //特权计算
            // publicFun.business(that, that.data.productData.store.order_notice_time); //订单提醒
        }
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
    payment: function(e) { //下一步,去支付
        var that = this;
        publicFun.payment(that, e)
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
    addImg: function(e) { //图片上传
        var that = this;
        let index = e.target.dataset.index;
        let ticket = '';
        try {
            let wx_ticket = wx.getStorageSync('ticket')
            if (wx_ticket) {
                ticket = wx_ticket;
            }
        } catch (e) {
            // Do something when catch error
        }
        wx.chooseImage({ //图片上传控件
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片

                var tempFilePaths = res.tempFilePaths;

                wx.uploadFile({
                    url: common.Url + 'app.php?c=attachment&a=upload&ticket=' + ticket,
                    filePath: tempFilePaths[0],
                    name: 'file',
                    formData: {
                        'user': 'test'
                    },
                    success: function(res) {
                        res = JSON.parse(res.data);
                        if (res.err_code == 20000) {
                            wx.redirectTo({ url: '/pages/index/login' })
                        }
                        if (res.err_code != 0 && res.err_code != 20000) {
                            wx.showModal({
                                title: '提示信息',
                                content: res.err_msg,
                                confirmText: '知道了',
                                showCancel: false,
                                confirmColor: '#fe6b31',
                                success: function(res) {}
                            })
                        } else {
                            let data = res;
                            that.data.shoppingData.shoppingCatData.reservation_custom_fields[index].imgList.unshift(data.err_msg);
                            that.setData({
                                shoppingData: that.data.shoppingData,
                            });
                        }
                    },

                })

            }
        })
    },
    goTopFun: function(e) { //回到顶部滚动条
        var that = this;
        publicFun.goTopFun(e, that)
    },
    closeShopping: function(e) { //关闭提示框遮罩层
        var that = this;
        publicFun.closeShopping(that);
    },
    swichNav: function(e) {
        var that = this;
        let page = 1;
        let current = e.target.dataset.current;
        if (current == 1) {
            common.post('app.php?c=goods&a=buy_list&product_id=' + that.data.productData.product.product_id, '', recordData, ''); //购买记录
            function recordData(result) {
                if (result.err_code == 0) {
                    that.setData({
                        'recordData': result.err_msg
                    })
                }
            }
        }
        if (current == 2) {
            common.post('app.php?c=comment&app=app&a=comment_list&type=PRODUCT&data_id=' + that.data.productData.product.product_id + '&tab=' + that.data.tab, '', commentData, ''); //购买记录
            function commentData(result) {
                if (result.err_code == 0) {
                    that.setData({
                        'commentData': result.err_msg
                    })
                }
            }
        }
        publicFun.swichNav(e, that); //图文详情切换
    },
    bindDownLoad: function() {
        var that = this;
        if (that.data.currentTab == 1) {
            if (that.data.recordData.next_page == false) {
                console.log('没有更多数据了');
                return
            }
            page++;
            let url = 'aapp.php?c=goods&a=buy_list&product_id=' + that.data.productData.product.product_id + '&page=' + page
            common.post(url, '', setPushData, '');

            function setPushData(result) {
                let list = that.data.recordData.order_list;
                for (var i = 0; i < result.err_msg.order_list.length; i++) {
                    list.push(result.err_msg.order_list[i]);
                }
                that.setData({
                    'recordData.order_list': list,
                    'recordData.next_page': result.err_msg.next_page
                });
            }

        }
        if (that.data.currentTab == 2) {
            if (that.data.commentData.next_page == false) {
                console.log('没有更多数据了');
                return
            }
            page++;
            let url = 'app.php?c=comment&app=app&a=comment_list&type=PRODUCT&data_id=' + that.data.productData.product.product_id + '&tab=' + that.data.tab + '&page=' + page
            common.post(url, '', setPushData, '');

            function setPushData(result) {
                let list = that.data.commentData.order_list;
                for (var i = 0; i < result.err_msg.comment_list.length; i++) {
                    list.push(result.err_msg.order_list[i]);
                }
                that.setData({
                    'commentData.comment_list': list,
                    'commentData.next_page': result.err_msg.next_page
                });
            }

        }
    },
    productListSwichNav: function(e) {
        page = 1;
        var that = this;
        var tab = e.target.dataset.tab;
        if (that.data.productListSwichNav.indexOf(tab) != -1) {
            return
        } else {
            that.data.productListSwichNav[i] = tab;
        }
        i++;
        that.setData({
            'tab': tab
        })
        common.post('app.php?c=comment&app=app&a=comment_list&type=PRODUCT&data_id=' + that.data.productData.product.product_id + '&tab=' + that.data.tab, '', commentData, ''); //购买记录
        function commentData(result) {
            if (result.err_code == 0) {
                that.setData({
                    'commentData': result.err_msg
                })
            }
        }
        publicFun.productListSwichNav(e, that);
    },
    scroll: function(event) {
        this.setData({
            scrollTop: event.detail.scrollTop
        });
    },
    collect: function(e) {
        var that = this;
        publicFun.collect(that, e)
    },
    shear: function(e) { //分享
        var that = this;
        publicFun.shear(that)
    },
    calling: function() { //拨打电话
        let num = this.data.productData.store.tel;
        publicFun.calling(num)
    },
    onShareAppMessage: function() {
        return {
            title: this.data.productData.product.name,
            desc: this.data.productData.product.name + '，物美价廉，购物必选',
            path: '/pages/product/details/?product_id' + this.data.product_id
        }
    }


})
