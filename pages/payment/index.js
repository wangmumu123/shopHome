var common = require('../../utils/common.js');
var publicFun = require('../../utils/public.js');
var area = require('../../utils/area.js');
var app = getApp();
var THINK = app.think();
Page({
    data: {
        order_no: '',
        customMessage: '', //客户留言
        point: 0, //使用积分
        integralpointPage: 0, //使用积分
        rewardPrice: 0, //满减金额
        integralPricePage: 0, //抵换积分金额
        discountPrice: 0, //折扣价格
        productPrice: 0, //自营商品价格
        couponMoneysSelf: 0, //自营优惠券
        currentTab: 0,
        couponTab: 220,
        paymentData: '',
        user_address: {},
        address_id: 0,
        postageData: '',
        postage: true,
        index: 0,
        paymentPostage: 0,
        addressEditData: '',
        province_name_arr: [],
        province_code_arr: [],
        province_index: 0,
        province_code: 0,
        city_name_arr: ['请选择'],
        city_code_arr: [],
        city_index: 0,
        city_code: 0,
        country_name_arr: ['请选择'],
        country_code_arr: [],
        country_index: 0,
        country_code: 0,
        postage: true,
        integral: '',
        oppenShopList: false,
        oppenCoupon: false,
        oppenCouponTxt: [],
        oppenCouponMoney: [],
        oppenCouponId: [],
        couponMoney: 0,
        paymentMoney: 0,
        date: '2016-09-01',
        time: '12:01',
 
        flag: true,
        flags: true
    },
    onLoad: function(e) { // 页面渲染完成
        var that = this;
        this.setData({
            order_no: e.order_no,
            //order_no: 'PIG20170310144011781341'
        });
    },
    onReady: function(e) {
        var that = this;
        common.post('app.php?c=order&a=pay&order_no=' + that.data.order_no, '', "paymentData", that);
    },
    onShow: function(e) {
        if (this.data.paymentData != '') {
            //wx.switchTab({ url: '/pages/user/index' })
        }
    },
    defaultAddress: function(e) { //修改默认地址
        var that = this;
        publicFun.defaultAddress(e, that, '', 'go');
    },
    addressEditGO: function(e) { //编辑新添地址
        var that = this;
        let addId = e.target.dataset.addid;
        publicFun.addressEditGO(that, addId);
    },
    closeAddress: function(e) { //关闭地址弹框 
        var that = this;
        publicFun.closeAddress(that);
    },
    paymentData: function(result) {
        var that = this;
        if (result.err_code == 0) {
            this.setData({
                paymentData: result.err_msg
            })
            let address_id = this.data.paymentData.wxapp_address.address_id;
            if ((this.data.paymentData.order.status * 1 == 0) && (address_id != '') && (address_id != undefined) && (this.data.paymentData.order.type * 1 != 10)) {
                publicFun.freight(that, address_id);
            }
            if ((this.data.paymentData.wxapp_address.list_count == 0) && (this.data.paymentData.order.type * 1 != 10)) {
                that.setData({
                    addressEdit: true
                })
                publicFun.addressEditGO(that, 0);
            }
            if (this.data.paymentData.order.type * 1 == 10) {
                that.setData({
                    paymentPostage: 1
                })
            }
            for (var i in that.data.paymentData.selffetch_list) {
                let juli = publicFun.expressDistance(that.data.paymentData.selffetch_list[i].lat, that.data.paymentData.selffetch_list[i].lon);
                that.data.paymentData.selffetch_list[i].juli = juli;
            }
            for (var i in that.data.paymentData.reward_list) {
                that.data.paymentData.reward_list[i].reward_content = (that.data.paymentData.reward_list[i].reward_content).replace(/<[^>]+>/g, "")
            }
            if (that.data.paymentData.order.status == '1') {
                for (var i in that.data.paymentData.user_coupon_list) {
                    that.data.couponMoney += that.data.paymentData.user_coupon_list[i].face_money * 1;
                }
                if (typeof that.data.paymentData.order_point !== 'undefined') {
                    that.data.integralPricePage = that.data.paymentData.order_point.money
                }
                that.setData({
                    integralPricePage: that.data.integralPricePage,
                    couponMoney: that.data.couponMoney
                })
            }
            if (that.data.paymentData.order.shipping_method == 'selffetch') {
                that.data.paymentData.shopData = that.data.paymentData.user_address;

                that.setData({
                    paymentPostage: 1
                })
            }
            that.data.paymentData.order.add_time_txt = publicFun.setDate(that.data.paymentData.order.add_time)
            publicFun.paymentMoney(that)
            publicFun.product_list(that); //计算直营商品价格以及折扣
            this.setData({
                paymentData: that.data.paymentData
            })
            publicFun.getNowFormatDate(that) //获取当前时间日期
            publicFun.integral(that); //积分计算

        };
    },
    paymentButton: function(e) { // 微信支付
        console.log(e);
        var that = this;
        publicFun.paymentButton(that)
    },
    addressGo: function(e) { //点击头部我的地址-出现选择地址列表
        var that = this;
        let count = this.data.paymentData.wxapp_address.list_count;
        if (count == 0) { //判断是否有地址列表
            publicFun.addressEditGO(that, e, 'payment') //添加新地址
        } else {
            publicFun.addressEdit(that); //选择默认地址
        }

    },
    pickerProvince: function(e, p_index) { //省份选择
        var that = this;
        publicFun.pickerProvince(that, e, p_index)
    },

    pickerCity: function(e, c_index) { //市级选择
        var that = this;
        publicFun.pickerCity(that, e, c_index)
    },

    pickerCountry: function(e) { //县区
        var that = this;
        publicFun.pickerCountry(that, e)
    },
    bindPickerChange: function(e) {
        this.setData({
            index: e.detail.value
        })
    },
    addressSave: function(e) {
        var that = this;
        publicFun.addressSave(that, e, 'go')
    },
    integral: function(e) { //选择积分
        var that = this;
        if (that.data.integral == '') {
            that.data.integral = 'active';
            that.data.integralPricePage = that.data.integralPrice;
            that.data.integralpointPage = that.data.point;
        } else {
            that.data.integral = '';
            that.data.integralPricePage = 0;
            that.data.integralpointPage = 0;
        }
        publicFun.paymentMoney(that)
        that.setData({
            integral: that.data.integral,
            integralPricePage: that.data.integralPricePage,
            integralpointPage: that.data.integralpointPage
        })
    },
    productListSwichNav: function(e) { //门店选择
        var that = this;
        let index = e.target.dataset.index;
        that.data.paymentData.shopData = that.data.paymentData.selffetch_list[index];
        that.setData({
            paymentData: that.data.paymentData
        })
        setTimeout(function() {
            that.oppenShopList();
        }, 300)
        publicFun.productListSwichNav(e, that);
    },
    CouponSwichNav: function(e) { //选取优惠券
        var that = this;
        publicFun.getLocation()
        publicFun.CouponSwichNavTab(that, e);
    },
    paymentPostage: function(e) { //到店自提和物流快递
        var that = this;
        //        console.log(e.target.dataset.paymentpostage);
        if (that.data.paymentData.order.status * 1 == 1) {
            return
        }
        //   console.log(e.target.dataset.paymentpostage);
        if (e.target.dataset.paymentpostage == 1) {
            that.oppenShopList()
        }
        if (that.data.paymentPostage === e.target.dataset.paymentpostage) {
            return false;
        } else {
            that.setData({
                paymentPostage: e.target.dataset.paymentpostage
            })
        }
    },
    oppenShopList: function(e) { //店铺门店选择
        var that = this;
        if (that.data.oppenShopList == true) {
            that.data.oppenShopList = false
        } else {
            that.data.oppenShopList = true;
        }
        that.setData({
            'oppenShopList': that.data.oppenShopList
        })
    },
    oppenCoupon: function(e) { //选择优惠券
        var that = this;
        if (typeof e !== 'undefined') {
            let index = e.target.dataset.index;
            that.data.paymentData.user_coupon = that.data.paymentData.user_coupon_list[index];
            that.setData({
                paymentData: that.data.paymentData,
                cuponIndex: index
            })
        }
        if (that.data.oppenCoupon == true) {
            that.data.oppenCoupon = false
        } else {
            that.data.oppenCoupon = true;
        }
        that.setData({
            'oppenCoupon': that.data.oppenCoupon
        })
    },
    calling: function(e) { //拨打电话
        let num = e.target.dataset.num;
        publicFun.calling(num)
    },
    bindDateChange: function(e) { //选择日期
        this.setData({
            date: e.detail.value
        })
    },
    bindTimeChange: function(e) { //选择时间
        this.setData({
            time: e.detail.value
        })
    },
    swichNav: function(e) {
        var that = this;
        publicFun.swichNav(e, that)
    },
    customMessage: function(e) {
        this.setData({
            customMessage: e.detail.value
        })
     }



})
