/**@author wangmu 2017-02-08**/
var common = require('common.js');
var area = require('area.js');
var publicFun = {};

publicFun.height = function(that) { //设置页面高度
    wx.getSystemInfo({
        success: function(res) {
            that.setData({
                scrollHeight: res.windowHeight
            });
        }
    });
};

publicFun.setPushData = function(result, that, listData) {
    let list = that.data.indexData.tuan_list;
    for (var i = 0; i < result.err_msg.tuan_list.length; i++) {
        list.push(result.err_msg.tuan_list[i]);
    }
    that.setData({
        'indexData.tuan_list': list
    });
};

publicFun.swichNav = function(e, that) { //点击tab切换 
    if (that.data.currentTab === e.target.dataset.current) {
        return false;
    } else {
        that.setData({
            currentTab: e.target.dataset.current
        })
    }
};
publicFun.productListSwichNav = function(e, that) { //点击tab切换 
    if (that.data.productlist === e.target.dataset.productlist) {
        return false;
    } else {
        that.setData({
            productList: e.target.dataset.productlist
        })
    }
};
publicFun.CouponSwichNav = function(e, that) { //点击tab切换 
    if (that.data.couponTab === e.target.dataset.coupontab) {
        return false;
    } else {
        that.setData({
            couponTab: e.target.dataset.coupontab
        })
    }
};
publicFun.postage = function(that) {
    let product = that.data.productData.product;
    if (product.postage == 0 || product.postage == null) {
        product.postage = '包邮';
    }
    if (product.postage_type == 0) {
        product.postage = product.postage;
    } else {
        if (product.postage_tpl == undefined) {
            product.postage = product.postage;
        } else {
            product.postage = product.postage_tpl.min + '~' + product.postage_tpl.max;
        };
    };

    that.setData({
        'productData.product.postage': product.postage
    })

};
publicFun.credit_arr = function(that) { //特权显示
    function credit_arr(type) {
        switch (type) {
            case 'RZ':
                return '证';
                break;
            case '7D':
                return '退';
                break;
            case 'DB':
                return '保';
                break;
            case 'MD':
                return '店';
                break;
        };
    }
    for (var i = 0; i < that.data.productData.credit_arr.length; i++) {
        that.data.productData.credit_arr[i].type = credit_arr(that.data.productData.credit_arr[i].type)
    }
    that.setData({ //店铺特权
        'productData.credit_arr': that.data.productData.credit_arr
    });
};
publicFun.business = function(that, order_notice_time) { //订单提醒
    function businessData() {
        var url;
        var store_order_id = wx.getStorageSync('store_order_id');
        if (store_order_id == undefined || store_order_id == 'undefined') {
            url = 'app.php?c=order&a=notice';
        } else {
            url = 'app.php?c=order&a=notice&store_order_id=' + store_order_id; //交易提醒提示框
        }
        common.post(url, '', business, '');

        function business(data) {
            if (data.err_code == 0) {
                that.setData({
                    business: data.err_msg
                })
                if (that.data.business.has_data) {
                    that.data.businessShow = true;
                    wx.setStorageSync('store_order_id', that.data.business.store_order_id)
                } else {
                    that.data.businessShow = false;
                }
                that.setData({
                    'businessShow': that.data.businessShow
                })
            };
        }

    };

    function orderClose() {
        setTimeout(function() {
            that.setData({
                'businessShow': false
            })
        }, order_notice_time * 1000)
    }

    function businessTime() { //交易提醒计时                  
        that.data.businessTimeInt = setInterval(function() {
            console.log(111);
            businessData();
            orderClose();
        }, 10000);

    };
    businessData();
    businessTime();
    that.setData({
        'businessShow': true
    })
    orderClose();

};
publicFun.productSwichNav = function(that, e) { //产品详情页面筛选按钮
    let sort = e.target.dataset.sort;
    if (e.target.dataset.current == 3) {
        if (that.data.priceTab == 'sort_active') {
            that.setData({
                priceTab: ''
            })
            sort = 'price_asc';
        } else {
            that.setData({
                priceTab: 'sort_active'
            })
            sort = 'price_desc';
        }
    };
    that.setData({
        sort: sort
    });
    let url = 'app.php?c=goods&a=search_in_store&keyword=' + that.data.keyword + '&sort=' + that.data.sort
    common.post(url, '', "productListData", that);
    publicFun.swichNav(e, that);
};
publicFun.closePromptMess = function(that) { //关闭提示框遮罩层
    that.setData({
        'prompt.promptMess': false
    })
};
publicFun.oppenPromptMess = function(that) { //显示提示框
    that.setData({
        'prompt.promptMess': true
    })
};
publicFun.goBack = function(e) { //返回上一页
    wx.navigateBack(1)
};
publicFun.formatStr = function(str) { //替换空格换行
    str = str.replace(/&nbsp;/g, " ");
    str = str.replace(/<br>/g, " ");
    return str
};
publicFun.barTitle = function(title) { //修改页面标题
    wx.setNavigationBarTitle({
        title: title
    });
};

publicFun.closeShopping = function(that) { //关闭购物车遮罩层
    that.setData({
        'shoppingData.shoppingShow': false
    })
};
publicFun.scrollTopFun = function(e, that) {
    if (e.detail.scrollTop > 300) { //触发gotop的显示条件  
        that.setData({
            'scrollTop.goTop_show': true
        });
    } else {
        that.setData({
            'scrollTop.goTop_show': false
        });
    }
};
publicFun.goTopFun = function(e, that) {
    var _top = that.data.scrollTop.scroll_top; //发现设置scroll-top值不能和上一次的值一样，否则无效，所以这里加了个判断  
    if (_top == 1) {
        _top = 0;
    } else {
        _top = 1;
    }
    that.setData({
        'scrollTop.scroll_top': _top
    });
};
publicFun.calling = function(num) {
    wx.makePhoneCall({
        phoneNumber: num,
        success: function() {
            console.log("拨打电话成功！")
        },
        fail: function() {
            console.log("拨打电话失败！")
        }
    })
}
publicFun.warning = function(txt, that) { //弹出警告提示框
    that.setData({
        'warning.warningShow': true,
        'warning.warningTxt': txt
    });
    setTimeout(function() {
        that.setData({
            'warning.warningShow': false
        })
    }, 1000);
};
publicFun.oppenShopping = function(e, that) { //开启购物车遮罩层
    let product_id = e.target.dataset.product;
    //    console.log(product_id);
    let type = e.target.dataset.type;
    let buttonTxt = '下一步';
    if (type == 'add_cart') {
        buttonTxt = '加入购物车';
    }

    that.setData({
        'shoppingData.buttonTxt': buttonTxt,
        'shoppingData.type': type,
        'shoppingData.shoppingNum': 1
    });
    // console.log(that.data.shoppingData.type);
    common.post('app.php?c=goods&a=info&product_id=' + product_id, '', shoppingData, '');

    function shoppingData(result) { //购物车数据
        if (result.err_code == 0) {
            for (var i in result.err_msg.reservation_custom_fields) {
                result.err_msg.reservation_custom_fields[i].value = '';
                if (result.err_msg.reservation_custom_fields[i].field_type == 'date') {
                    result.err_msg.reservation_custom_fields[i].date = publicFun.setDateDay('');
                    result.err_msg.reservation_custom_fields[i].dateDay = publicFun.setDateDay('');
                    result.err_msg.reservation_custom_fields[i].time = publicFun.setDateTime();
                }
            }
            that.setData({
                'shoppingData.shoppingCatData': result.err_msg
            });
            //  console.log(that.data.shoppingData.shoppingCatData);
            if ((type == 'add_cart') && (that.data.shoppingData.shoppingCatData.sku_list == '' || that.data.shoppingData.shoppingCatData.sku_list == undefined)) {
                publicFun.payment(that, e);
                return
            }
 
            that.setData({
                'shoppingData.shoppingShow': true
            });

        }
    }
};
publicFun.shoppingVid = function(e, that) { //购物车商品规格选择
    let id = e.target.dataset.id;
    let vid = e.target.dataset.vid;
    let pid = e.target.dataset.pid;
    if (that.data.shoppingData.specList[id].vid === vid) {
        return false;
    } else {
        switch (id * 1) {
            case 0:
                that.setData({
                    'shoppingData.specList[0].vid': vid,
                    'shoppingData.value[0]': pid + ':' + vid
                });
                break;
            case 1:
                that.setData({
                    'shoppingData.specList[1].vid': vid,
                    'shoppingData.value[1]': pid + ':' + vid
                });
                break;
            case 2:
                that.setData({
                    'shoppingData.specList[2].vid': vid,
                    'shoppingData.value[2]': pid + ':' + vid
                });
                break;
        }
    }
    publicFun.skuPrice(that);
};


publicFun.skuPrice = function(that) { //判断商品规格信息
    let valueDate = '';
    let skuPriceData = that.data.shoppingData.shoppingCatData.sku_list; //商品规格列表
    let quantity = that.data.shoppingData.shoppingCatData.product.quantity * 1; //商品库存数量
    let shoppingNum = that.data.shoppingData.shoppingNum * 1; //输入框数量
    let buyer_quota = that.data.shoppingData.shoppingCatData.product.buyer_quota * 1; //商品限购数量
    let buy_quantity = 0;
    if (typeof that.data.shoppingData.shoppingCatData.product.buy_quantity === 'undefined') {
        let buy_quantity = that.data.shoppingData.shoppingCatData.product.buy_quantity * 1; //商品已购买数量
    }
    //    console.log(buy_quantity);
    if (quantity <= 0) {
        return publicFun.warning('商品已经卖完了', that);
    }
    if ((skuPriceData == '' || skuPriceData == undefined) && shoppingNum > quantity) { //商品无规格时判断商品库存
        that.setData({
            'shoppingData.shoppingNum': quantity
        });
        return publicFun.warning('库存只有' + quantity + '个', that);
    }
    if ((shoppingNum > (buyer_quota - buy_quantity)) && buyer_quota > 0) {
        that.setData({
            'shoppingData.shoppingNum': (buyer_quota - buy_quantity)
        });
        if (buy_quantity != 0) {
            return publicFun.warning('此商品限购' + buyer_quota + '个,你已购买' + buy_quantity + '个', that);
        }
        return publicFun.warning('此商品限购' + buyer_quota + '个', that);
    }
    for (let i in that.data.shoppingData.value) { //添加规格列表
        valueDate += that.data.shoppingData.value[i] + ';'
    }
    valueDate = valueDate.substring(0, valueDate.length - 1);
    for (let i in skuPriceData) { //判断规格产品的库存以及价格
        if (valueDate == skuPriceData[i].properties) {
            if (skuPriceData[i].quantity == 0) {
                return publicFun.warning('没有库存了,选择其他商品吧', that);
            }

            that.setData({
                'shoppingData.shoppingCatData.product.price': skuPriceData[i].price,
                'shoppingData.shoppingCatData.product.quantity': skuPriceData[i].quantity,
                'shoppingData.sku_id': skuPriceData[i].sku_id
            });
            if (skuPriceData[i].quantity < shoppingNum) {
                that.setData({
                    'shoppingData.shoppingNum': skuPriceData[i].quantity
                });
                return publicFun.warning('库存只有' + skuPriceData[i].quantity + '个', that);
            }
        }
    }
};
publicFun.plus = function(that) { //加
    that.data.shoppingData.shoppingNum++;
    that.setData({
        'shoppingData.shoppingNum': that.data.shoppingData.shoppingNum
    });
    publicFun.skuPrice(that);
};
publicFun.reduce = function(that) { //减
    if (that.data.shoppingData.shoppingNum <= 1) {
        return
    }
    that.data.shoppingData.shoppingNum--;
    that.setData({
        'shoppingData.shoppingNum': that.data.shoppingData.shoppingNum
    });
};
publicFun.shoppingBlur = function(e, that) { //输入数量
    if (that.data.shoppingData.shoppingNum == 0) {
        that.setData({
            'shoppingData.shoppingNum': 1
        })
    }
    that.setData({
        'shoppingData.shoppingNum': e.detail.value
    });
    publicFun.skuPrice(that);

};

publicFun.payment = function(that, e) { //去支付
    publicFun.skuPrice(that);
    let type = e.target.dataset.type;
    let is_add_cart = 0;
    let addType = 0;
    var emailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/, // 邮箱正则
        idcardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    let reservation_custom = {}
        //    console.log(type);
    if (that.data.shoppingData.sku_id == '' && (that.data.shoppingData.shoppingCatData.sku_list != '' && that.data.shoppingData.shoppingCatData.sku_list != undefined)) {
        return publicFun.warning('请选择商品规格', that);
    }
    if (type == 'add_cart') {
        is_add_cart = 1;
    }
    if (type == 'make') { //预约
        addType = 10;
        let reservation_custom_fields = that.data.shoppingData.shoppingCatData.reservation_custom_fields;
        for (var i in reservation_custom_fields) {
            reservation_custom[i] = {};
            if (reservation_custom_fields[i].field_type == 'date') {
                reservation_custom[i]['name'] = reservation_custom_fields[i].field_name;
                reservation_custom[i].type = reservation_custom_fields[i].field_type;
                reservation_custom[i].value = reservation_custom_fields[i].date + '-' + reservation_custom_fields[i].time;
                continue
            }
            if (reservation_custom_fields[i].required * 1 && reservation_custom_fields[i].value == '') {
                console.log(reservation_custom_fields[i].required);
                return publicFun.warning('请输入' + reservation_custom_fields[i].field_name, that)
            }
            if (reservation_custom_fields[i].field_type == 'id_no') {
                if (!idcardReg.test(reservation_custom_fields[i].value) && reservation_custom_fields[i].value) {
                    return publicFun.warning('请正确输入身份证格式留言内容', that)
                }
            }
            if (reservation_custom_fields[i].field_type == 'email') {
                if (!emailReg.test(reservation_custom_fields[i].value) && reservation_custom_fields[i].value) {
                    // console.log(reservation_custom_fields[i].value);
                    return publicFun.warning('请正确输入邮箱格式留言内容', that)
                }
            }
            if (reservation_custom_fields[i].field_type == 'number') {
                if (!/^\d+(\.\d+)?$/.test(reservation_custom_fields[i].value) && reservation_custom_fields[i].value) {
                    return publicFun.warning('请正确输入数字格式留言内容', that)
                }
            }
            reservation_custom[i]['name'] = reservation_custom_fields[i].field_name;
            reservation_custom[i]['type'] = reservation_custom_fields[i].field_type;
            reservation_custom[i]['value'] = reservation_custom_fields[i].value;
        }
    }
    let data = {};
    data = {
        quantity: that.data.shoppingData.shoppingNum,
        sku_id: that.data.shoppingData.sku_id,
        send_other: 0,
        is_add_cart: is_add_cart,
        type: addType,
        custom: reservation_custom,
        product_id: that.data.shoppingData.shoppingCatData.product.product_id,
    };

    publicFun.warning('订单处理中，请稍后...', that);
    common.post('/app.php?c=order&a=add', data, payment, '');

    function payment(result) { //去支付
        if (type == 'add_cart') { //加入购物车
            that.setData({
                'shoppingData.shoppingShow': false,
                'shoppingCatNum': true
            });

            publicFun.warning('成功加入购物车...', that);
            return
        }
        if (result.err_code == 1010) {
            publicFun.promptMsg(result.err_msg.msg_txt, '知道了', '', right);

            function right() {
                wx.redirectTo({ url: '/pages/user/order/index?order=' + result.err_msg })
            }
        }
        if (result.err_code == 0) {
            var order_no = result.err_msg;
            //            console.log(order_no)
            publicFun.paymentGo(order_no)
        }
    };


};
publicFun.paymentGo = function(order_no) { //去支付 
    wx.navigateTo({ url: '/pages/payment/index?order_no=' + order_no });
};
publicFun.textScroll = function(that) { //公告滚动
    let text = '';
    let flag = true;
    let marqueeDistance = 0;
    for (var i in that.data.shopHomeData.custom_field_list) {
        if (that.data.shopHomeData.custom_field_list[i].field_type == 'notice') {
            text = that.data.shopHomeData.custom_field_list[i].content;
            that.data.shopHomeData.custom_field_list[i].marqueeDistance = that.data.marqueeDistance;
            flag = false;
            marqueeDistance = i;
        }
    }
    if (flag) {
        return
    }
    that.setData({
        shopHomeData: that.data.shopHomeData
    })
    var length = text.length * 12; //文字长度
    var windowWidth = wx.getSystemInfoSync().windowWidth - 100; // 屏幕宽度
    that.setData({
        windowWidth: windowWidth,
    });
    var interval = setInterval(function() {
        if (-that.data.marqueeDistance < length) {
            that.data.shopHomeData.custom_field_list[marqueeDistance].marqueeDistance = that.data.marqueeDistance - 1;
            that.setData({
                marqueeDistance: that.data.marqueeDistance - 1,
                shopHomeData: that.data.shopHomeData
            });
        } else {
            clearInterval(interval);
            that.data.shopHomeData.custom_field_list[marqueeDistance].marqueeDistance = that.data.windowWidth;
            that.setData({
                marqueeDistance: that.data.windowWidth,
                shopHomeData: that.data.shopHomeData
            });
            publicFun.textScroll(that);
        }
    }, 20);
};
publicFun.collect = function(that, e) { //收藏商品
    let dataid = e.target.dataset.dataid;
    let index = e.target.dataset.index;
    let type = e.target.dataset.type;
    let url = ''
    if (that.data.productData.product.is_collect == 1) {
        url = 'app.php?c=collect&a=cancel';
        that.data.productData.product.collect--;
        that.data.productData.product.is_collect--
    } else {
        url = 'app.php?c=collect&a=add';
        that.data.productData.product.collect++;
        that.data.productData.product.is_collect++
    }
    common.post(url + '&dataid=' + dataid + '&type=' + type, '', collect, '');

    function collect(res) {
        console.log(res);
        if (res.err_code == 0) {
            that.setData({
                'productData.product.is_collect': that.data.productData.product.is_collect,
                'productData.product.collect': that.data.productData.product.collect++
            })
        }
    }
};
publicFun.shopcollect = function(that, e) { //店铺动态收藏
    let dataid = e.target.dataset.dataid;
    let index = e.target.dataset.index;
    if (that.data.shopHomeData.custom_field_list[that.data.article_id].content.activity_arr[index].mycollected * 1 == 1) {
        that.data.shopHomeData.custom_field_list[that.data.article_id].content.activity_arr[index].collect--;
        that.data.shopHomeData.custom_field_list[that.data.article_id].content.activity_arr[index].mycollected--
    } else {
        that.data.shopHomeData.custom_field_list[that.data.article_id].content.activity_arr[index].collect++;
        that.data.shopHomeData.custom_field_list[that.data.article_id].content.activity_arr[index].mycollected++
    }
    common.post('app.php?c=article&a=collect&aid=' + dataid, '', collect, '');

    function collect(res) {
        console.log(res);
        if (res.err_code == 0) {
            that.setData({
                shopHomeData: that.data.shopHomeData
            })
        }
    }
};
publicFun.collectShop = function(that, e) { //店铺收藏

    common.post('app.php?c=collect&a=add&type=2&dataid=' + common.store_id, '', collect, '');

    function collect(res) {
        console.log(res);
        if (res.err_code == 0) {
            for (var i in that.data.shopHomeData.custom_field_list) {
                if (that.data.shopHomeData.custom_field_list[i].field_type == 'attention_collect') {
                    that.data.shopHomeData.custom_field_list[i].collect++
                }
            };
            that.setData({
                shopHomeData: that.data.shopHomeData
            })
        }
    }
};
publicFun.operation = function(that, e, plus) { //购物车页面操作
    // console.log(that.data.flag);
    // if (that.data.flag) {
    //     return
    // }
    // that.setData({
    //     'flag': true
    // })
    let index = e.target.dataset.index;
    let number = e.target.dataset.num;
    let cartId = e.target.dataset.cartid;
    let skuId = e.target.dataset.skuid;
    let productId = e.target.dataset.productid;
    if (plus == 'plus') {
        number++;
    }
    if (plus == 'input') {
        if (e.detail.value < 1 || e.detail.value == number) {
            setTimeout(function() {
                that.setData({
                    'shoppingCatData': that.data.shoppingCatData,
                })
            }, 1000)
            return
        }
        number = e.detail.value * 1
    }
    if (plus == 'reduce') {
        if (number <= 1) {
            common.post('app.php?c=cart&a=delete&cart_id=' + cartId, '', shoppingNum, '');

            function shoppingNum(result) {
                that.data.shoppingCatData.cart_list[index] = '';
                publicFun.shoppingMoney(that);
                that.setData({
                    'shoppingCatData': that.data.shoppingCatData,
                })
                console.log(that.data.shoppingCatData)
            }
            return
        }
        number--;
    }
    common.post('app.php?c=cart&a=quantity&number=' + number + '&cart_id=' + cartId + '&sku_id=' + skuId + '&product_id=' + productId, '', shoppingNum, '');

    function shoppingNum(result) {
        that.data.shoppingCatData.cart_list[index].pro_num = number;
        publicFun.shoppingMoney(that);
        that.setData({
            'shoppingCatData': that.data.shoppingCatData,
            'flag': false
        })
    }

};
publicFun.shoppingMoney = function(that, e) { // 合计
    var cart_list = that.data.shoppingCatData.cart_list;
    for (var i in cart_list) {
        if (cart_list[i] != '') {
            cart_list[i].shoppingMoney = cart_list[i].pro_num * cart_list[i].pro_price;

        }
    }
    publicFun.isActive(that);
    that.setData({
        'shoppingCatData': that.data.shoppingCatData
    })
};
publicFun.isActive = function(that, e) { //活动选中状态
    var cart_list = that.data.shoppingCatData.cart_list;
    that.data.shoppingCatMoney = 0;
    that.data.shoppingCatNum = 0;
    that.data.shoppingCatTotalNum = 0;
    for (var i = 0; i < cart_list.length; i++) {
        if (cart_list[i].isActive == 1) {
            that.data.shoppingCatMoney += cart_list[i].shoppingMoney;
            that.data.shoppingCatNum += cart_list[i].pro_num * 1
        }
        that.data.shoppingCatTotalNum += cart_list[i].pro_num * 1

    }
    that.setData({
        shoppingCatData: that.data.shoppingCatData,
        'shoppingCatMoney': that.data.shoppingCatMoney,
        'shoppingCatNum': that.data.shoppingCatNum,
        'shoppingCatTotalNum': that.data.shoppingCatTotalNum
    })
};
publicFun.choiceShopping = function(that, e) { //购物车选择按钮
    let index = e.target.dataset.index;
    let check = e.target.dataset.check;
    var cart_list = that.data.shoppingCatData.cart_list;
    if (check == 'check') { //全选按钮的操作
        if (that.data.isActive == 'active') {
            that.data.isActive = '';
            that.data.shoppingCatMoney = 0;
            that.data.shoppingCatNum = 0;
            for (var i in cart_list) {
                cart_list[i].isActive = 0;
            }
        } else {
            for (var i in that.data.shoppingCatData.cart_list) {
                cart_list[i].isActive = 1;
            }
            publicFun.isActive(that);
            that.data.isActive = 'active';
        }
        that.setData({
            'shoppingCatData': that.data.shoppingCatData,
            'isActive': that.data.isActive,
            'shoppingCatMoney': that.data.shoppingCatMoney
        })
        return
    };
    if (cart_list[index].isActive == 1) {
        cart_list[index].isActive = 0;
    } else {
        cart_list[index].isActive = 1;
    }
    publicFun.isActive(that);
};
publicFun.orderGo = function(e) { //跳转订单详情
    let order = e.target.dataset.order;
    wx.navigateTo({ url: '/pages/user/order/index?order=' + order });
};
publicFun.completeCollage = function(e, that) { //确认订单
    publicFun.promptMsg('确定完成拼团么', '确定', '取消', completeCollage);

    function completeCollage() { //确认按钮之后的操作
        let tuan_id = e.target.dataset.tuan;
        let team_id = e.target.dataset.team;
        let index = e.target.dataset.index;
        common.post('webapp.php?c=tuan&a=over&tuan_id=' + tuan_id + '&team_id=' + team_id, '', completeCollage, '');

        function completeCollage(result) { //请求数据成功的操作
            that.data.orderlistData.order_list[index].tuan_over = false;
            that.data.orderlistData.order_list[index].status_txt = '成功';
            that.setData({
                orderlistData: that.data.orderlistData
            })

        }
    }
};

publicFun.promptMsg = function(msg, confirm, cancel, callFun) { //提示警告框
    let showCancel = true;
    if (cancel == '') {
        showCancel = false;
    }
    wx.showModal({
        title: '提示信息',
        content: msg,
        confirmText: confirm,
        cancelText: cancel,
        confirmColor: '#fe6b31',
        showCancel: showCancel,
        success: function(res) {
            if (res.confirm) {
                callFun(res);
            }
        }
    })
};
publicFun.shear = function(that) { //分享
    if (that.data.shear) {
        that.setData({
            shear: false
        })
        return
    }
    that.setData({
        shear: true
    })
}
publicFun.defaultAddress = function(e, that, address_id, go) { //默认地址选择
    if (e == 0) {
        var address_id = address_id;
    } else {
        var address_id = e.target.dataset.addid;
    }
    common.post('app.php?c=address&a=set_default&address_id=' + address_id, '', defaultAddress, '');

    function defaultAddress(result) {
        if (go == 'geo') {
            publicFun.freight(that, address_id);
            return
        }
        publicFun.swichNav(e, that);
        if (go == 'go') {
            publicFun.freight(that, address_id);
        }

    }
};
publicFun.delAddress = function(e, that) { //删除地址
    publicFun.promptMsg('确定删除此地址么?', '确定', '取消', delAddress);

    function delAddress() { //确认按钮之后的操作
        let address_id = e.target.dataset.addid;
        let index = e.target.dataset.index;
        delete that.data.addressData[index];
        that.setData({
            addressData: that.data.addressData
        })
        common.post('app.php?c=address&a=delete&address_id=' + address_id, '', delAddress, '');

        function delAddress() { //请求数据成功的操作
            delete that.data.addressData[index];
            that.setData({
                addressData: that.data.addressData
            })
        }
    }
};
publicFun.cancelOrder = function(that, order_no, index) { //取消订单
    publicFun.promptMsg('确定取消此订单么?', '确定', '取消', cancelOrder);

    function cancelOrder() {
        common.post('app.php?c=order&a=cancel&order_no=' + order_no, '', cancelOrder, '');

        function cancelOrder(result) {
            if (result.err_code == 0) {
                if (index != undefined) { //删除列表数据

                    delete that.data.orderlistData.order_list[index];
                    that.setData({
                        'orderlistData.order_list': that.data.orderlistData.order_list
                    })
                    return
                }
                wx.navigateTo({ url: '/pages/user/order/orderList?status==0' });
            };
        }
    }
};
publicFun.cancelReturn = function(that, order_no, index) { //取消退货
    publicFun.promptMsg('确定取消退货么?', '确定', '取消', cancelReturn);

    function cancelReturn() {
        common.post('app.php?c=return&a=cancel&return_id=' + order_no, '', cancelReturn, '');

        function cancelReturn(result) {
            if (result.err_code == 0) {
                console.log(index);
                if (typeof index !== 'undefined') { //删除列表数据
                    delete that.data.orderlistData.return_list[index];
                    that.setData({
                        'orderlistData.return_list': that.data.orderlistData.return_list
                    })
                    return
                }
                console.log(123)
                wx.redirectTo({ url: '/pages/user/myServer/index?rights=0' });
            };
        }
    }
};
publicFun.cancelRights = function(that, order_no, index) { //取消维权
    publicFun.promptMsg('确定取消维权么?', '确定', '取消', cancelRights);

    function cancelRights() {
        common.post('app.php?c=rights&a=cancel&id=' + order_no, '', cancelRights, '');

        function cancelRights(result) {
            if (result.err_code == 0) {
                if (typeof index !== 'undefined') { //删除列表数据
                    delete that.data.orderlistData.return_list[index];
                    that.setData({
                        'orderlistData.return_list': that.data.orderlistData.return_list
                    })
                    return
                }
                wx.redirectTo({ url: '/pages/user/myServer/index?rights=1' });
            };
        }
    }
};

publicFun.statusTitle = function(status) { //订单详情页面标题
    switch (status) {
        case 0:
            publicFun.barTitle('临时订单');
            break;
        case 1:
            publicFun.barTitle('未支付');
            break;
        case 2:
            publicFun.barTitle('未发货');
            break;
        case 3:
            publicFun.barTitle('已发货');
            break;
        case 4:
            publicFun.barTitle('已完成');
            break;
        case 5:
            publicFun.barTitle('已取消');
            break;
        case 6:
            publicFun.barTitle('退款中');
            break;
        case 7:
            publicFun.barTitle('已收货');
            break;
    }
};
publicFun.orderPushData = function(page, that, url) { //订单相关页面下拉加载
    if (that.data.orderlistData.next_page == false) {
        return
    }
    common.post(url, '', setPushData, '');

    function setPushData(result) { //添加数据
        let list = that.data.orderlistData.order_list;
        for (var i = 0; i < result.err_msg.order_list.length; i++) {
            list.push(result.err_msg.order_list[i]);
        }
        that.setData({
            'orderlistData.order_list': list,
            'orderlistData.next_page': result.err_msg.next_page
        });
    }
};
publicFun.completeOrder = function(order_no, that, index) { //完成订单-订单页面
    publicFun.promptMsg('确定完成订单么', '确定', '取消', completeOrder);

    function completeOrder() { //确认按钮之后的操作
        common.post('app.php?c=order&a=complete&order_no=' + order_no, '', completeOrder, '');

        function completeOrder() { //请求数据成功的操作
            try {
                if (index != undefined) { //删除列表数据

                    that.data.orderlistData.order_list[index].status = 4;
                    that.setData({
                        'orderlistData.order_list': that.data.orderlistData.order_list
                    })
                    return
                } else {
                    that.data.orderData.order.status = 4;
                    that.setData({
                        'orderData': that.data.orderData
                    })
                }
            } catch (e) {
                // Do something when catch error
            }

        }
    }
};
publicFun.completeReceipt = function(order_no, that, index) { //确认收货-订单页面
    publicFun.promptMsg('确定收到货了么', '确定', '取消', completeReceipt);

    function completeReceipt() {
        common.post('app.php?c=order&a=receive&order_no=' + order_no, '', completeReceipt, '');


        function completeReceipt() {
            try {

                if (typeof index != 'undefined') { //删除列表数据

                    that.data.orderlistData.order_list[index].status = 7;
                    that.setData({
                        'orderlistData.order_list': that.data.orderlistData.order_list
                    })
                    return
                } else {
                    that.data.orderData.order.status = 7;
                    that.setData({
                        'orderData.order.status': that.data.orderData.order.status
                    })
                }
            } catch (e) {
                // Do something when catch error
            }
        }
    }
};
publicFun.returnGo = function(e) { //查看退货
    let id = e.target.dataset.id;
    let order_no = e.target.dataset.order;
    let returnid = e.target.dataset.returnid;
    if (returnid == undefined || (returnid == '')) {
        returnid = 0;
    }

    wx.navigateTo({ url: '/pages/user/order/returnCompletion?id=' + id + '&order=' + order_no + '&returnid=' + returnid });
};
publicFun.rightsGo = function(e) { //查看维权
    let id = e.target.dataset.id;
    let order_no = e.target.dataset.order;
    let returnid = e.target.dataset.returnid;
    if (returnid == undefined || (returnid == '')) {
        returnid = 0;
    }
    wx.navigateTo({ url: '/pages/user/order/rightCompletion?id=' + id + '&order=' + order_no + '&rightid=' + returnid });
};
publicFun.applyRefundGo = function(e) { //申请退货
    let id = e.target.dataset.id;
    let order_no = e.target.dataset.order;
    wx.navigateTo({ url: '/pages/user/order/returnGoods?id=' + id + '&order=' + order_no });
};
publicFun.applyRightsGo = function(e) { //申请退货
    let id = e.target.dataset.id;
    let order_no = e.target.dataset.order;
    wx.navigateTo({ url: '/pages/user/order/rightGoods?id=' + id + '&order=' + order_no });
};
publicFun.addImg = function(that, evaluation, index) { //图片上传控件
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
                        wx.switchTab({ url: '/pages/index/index' })
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
                         if (typeof evaluation !== 'undefined') {
                             that.data.evaluationData.order_product_list[index].imgList.unshift(data.err_msg);
                            that.setData({
                                evaluationData: that.data.evaluationData
                            })
//                            console.log(that.data.evaluationData);
                            return
                        }
                       
                        that.data.imgList.unshift(data.err_msg);
                        that.setData({
                            imgList: that.data.imgList,
                        });
                    }
                },

            })

        },
        fail: function(res) {
            console.log(res);
        }
    })
};
publicFun.verifyNumber = function(that, num) { //手机号验证
    let res = '!/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/';
    if (num == '' || num == undefined) {
        publicFun.warning('请填写手机号', that);
        return false;
    }
    if (!(num).match(/^(((13[0-9]{1})|(14[0-9]{1})|(17[0]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/)) {
        publicFun.warning('请填写合法手机号', that);
        return false;
    }
    that.setData({
        phoneNumber: num,
    });
    return true;
};
publicFun.returnExplain = function(that, explain) { //退货说明验证
    if (explain == '' || explain == undefined) {
        publicFun.warning('请填写退货说明', that);
        return false;
    }

    that.setData({
        returnExplain: explain,
    });
    return true
};
publicFun.logistics = function(e, that) { //查询物流
    if (that.data.logisticsShow) {
        that.setData({
            logisticsShow: false
        })
        return
    }
    that.setData({
        logisticsShow: true
    })
    let code = e.target.dataset.code;
    let express = e.target.dataset.express;
    common.post('app.php?c=express&type=' + code + '&express_no=' + express, '', logistics, '');

    function logistics(result) {
        if (result.err_code == 0) {
            that.setData({
                logistics: result.err_msg.data
            })
        };
    }
};
publicFun.logisticsCode = function(that, logisticsCode) { //退货说明验证

    if (logisticsCode == '' || logisticsCode == undefined) {
        publicFun.warning('请填写快递单号', that);
        return false;
    }

    that.setData({
        logisticsCode: logisticsCode,
    });
    return true
};
publicFun.checkPhone = function(phone) {
    var regMobile = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/; //手机

    if (regMobile.test(phone)) {
        return true;
    } else {
        return false;
    }
};
publicFun.search = function(key, that, page) { //搜索页面
    common.post('app.php?c=goods&a=search_in_store&keyword=' + key + '&page=' + page, '', "productListData", that);
};
publicFun.wxSearchFn = function(that, e, page) { //搜索按钮-跳转效果
    let key = that.data.keyword;
    if ((key == undefined) || (key == '')) {
        return publicFun.warning('请输入搜索关键字', that);
    }
    if (page == 'page') { //店铺主页搜索跳到产品搜索页面
        wx.navigateTo({ url: '/pages/product/productList?keyword=' + key })
        return
    }
    if (page == 'shopHome') { //门店列表搜索,
        common.post('app.php?c=lbs&a=substores&keyword=' + key, '', "shopHomeData", that);
        return
    }
    publicFun.search(key, that, page);
};
publicFun.wxSearchInput = function(that, e) { //搜索输入框-文字效果
    let key = e.detail.value;
    that.setData({
        keyword: key
    })
};
publicFun.cancelSearch = function(that, e) { //搜索输入框-取消效果
    that.setData({
        keyword: ''
    })
};

publicFun.addressEditGO = function(that, addid, payment) { //跳转编辑地址
    that.setData({
        addressList: false,
        addressEdit: true
    });
    let addId = addid;
    if (typeof addId != 'undefined' && addId != 0 && payment != 'payment') {
        that.setData({
            address_id: addId
        });
        common.post('app.php?c=address&a=edit&address_id=' + addId, '', init, '');
    } else {
        area.picker.province(that, that.data.user_address.province);

        var province_index = that.data.province_index;
        that.pickerProvince('', province_index);

        var city_index = that.data.city_index;
        that.pickerCity('', city_index);
        that.setData({
            user_address: ''
        });
    }

    function init(result) {
        var data = result.err_msg.user_address;
        that.setData({
            user_address: data
        });

        area.picker.province(that, that.data.user_address.province);

        var province_index = that.data.province_index;
        that.pickerProvince('', province_index);

        var city_index = that.data.city_index;
        that.pickerCity('', city_index);
    }
};
publicFun.pickerProvince = function(that, e, p_index) { //地址选择-省份
    that.setData({
        city_name_arr: ['请选择'],
        city_code_arr: [],
        city_index: 0,
        country_name_arr: ['请选择'],
        country_code_arr: [],
        country_index: 0
    });
    var province_index_tmp = '';
    if (typeof p_index != "undefined") {
        province_index_tmp = p_index;
    } else {
        province_index_tmp = e.detail.value;
        that.setData({
            province_index: e.detail.value
        });
    }
    area.picker.city(that, that.data.province_code_arr[province_index_tmp], that.data.user_address.city);
    var city_index = that.data.city_index;
    that.pickerCity('', city_index);

};
publicFun.pickerCity = function(that, e, c_index) { //地址选择-市
    that.setData({
        country_name_arr: ['请选择'],
        country_code_arr: [],
        country_index: 0
    });

    var city_index = '';
    if (typeof c_index != "undefined") {
        city_index = c_index;
    } else {
        city_index = e.detail.value;
        that.setData({
            city_index: e.detail.value
        });
    }

    area.picker.country(that, that.data.city_code_arr[city_index], that.data.user_address.area);
};
publicFun.pickerCountry = function(that, e) { //县区
    that.setData({
        country_index: e.detail.value
    });
};
publicFun.addressSave = function(that, e, go) { //提交地址
    var name = e.detail.value.name;
    var tel = e.detail.value.tel;
    var province = e.detail.value.province;
    var city = e.detail.value.city;
    var area = e.detail.value.area;
    var address = e.detail.value.address;
    var zipcode = e.detail.value.zipcode;
    console.log(tel);
    if (name.length == 0) {
        publicFun.warning('请填写收货人姓名', that);
        return;
    }

    if (tel.length == 0) {
        publicFun.warning('请填写手机号', that);
        return;
    }

    if (!publicFun.checkPhone(tel)) {
        publicFun.warning('请正确填写手机号', that);
        return;
    }

    province = that.data.province_code_arr[that.data.province_index];
    city = that.data.city_code_arr[that.data.city_index];
    area = that.data.country_code_arr[that.data.country_index];

    if (address.length == 0) {
        publicFun.warning('请正确填写详细地址', that);
        return;
    }
    publicFun.warning('地址信息已提交，请稍后', that);
    var data = {};
    data.address_id = that.data.address_id;
    data.name = name;
    data.tel = tel;
    data.province = province;
    data.city = city;
    data.area = area;
    data.address = address;
    data.zipcode = zipcode;

    common.post('app.php?c=address&a=save', data, saveBack, '');

    function saveBack(result) {
        if (go == 'go') { //是否是支付页面修改的地址

            let address_id = result.err_msg.address_id;
            let e = 0;
            publicFun.defaultAddress(e, that, address_id, 'geo');
            return
        }
        wx.redirectTo({ url: '/pages/user/address/index' });
    }
};
publicFun.freight = function(that, address_id) { //查询物流运费信息
    common.post('app.php?c=order&a=postage&address_id=' + address_id + '&order_no=' + that.data.order_no, '', freight, ''); //获取运费信息

    function freight(result) {
        if (result.err_msg == undefined) {
            result.err_msg = 0;
        }
        if (result.err_code == 1009) {
            that.setData({
                postage: false
            })

            result.err_msg = 0;
            publicFun.promptMsg('此地区不支持配送,请选择其他地址', '知道了', '', freight);
        } else if (result.err_code == 1010) {
            publicFun.promptMsg('刷新订单', '知道了', '', freight);
            that.onReady()
            result.err_msg = that.data.paymentData.order.postage
        } else {
            that.setData({
                postageData: result.err_dom,
                postage: true
            })
        }

        function freight(res) {
            console.log(res);
        }

        that.setData({
            'paymentData.order.postage': result.err_msg //修改运费
        })
        publicFun.paymentMoney(that)
        publicFun.queryAddress(that, address_id);
        publicFun.closeAddress(that);
    }
};
publicFun.queryAddress = function(that, address_id) {
    common.post('app.php?c=address&a=get&address_id=' + address_id, '', queryAddress, ''); //查询单条地址

    function queryAddress(result) { //查询单条地址
        if (result.err_msg == undefined) {
            return
        }
        that.setData({
            'paymentData.wxapp_address': result.err_msg //修改地址
        })
    }
};
publicFun.addressEdit = function(that) { //选择地址列表,默认-编辑
    that.setData({
        addressList: true
    })
    common.post('app.php?c=address&a=all', '', addressData, '');

    function addressData(result) {
        if (result.err_code == 0) {
            that.setData({
                addressData: result.err_msg
            })
        }
    }
};
publicFun.closeAddress = function(that) { //关闭地址编辑弹框
    that.setData({
        addressList: false,
        addressEdit: false
    })
};
publicFun.setUrl = function(url) {
    try {
        wx.setStorageSync('url', url)
    } catch (e) {}
};
publicFun.getLocation = function() {
    wx.getLocation({
        type: 'wgs84',
        success: function(res) {
            //            console.log(res)
            var latitude = res.latitude
            var longitude = res.longitude
            wx.setStorage({
                key: "latitude",
                data: latitude
            });
            wx.setStorage({
                key: "longitude",
                data: longitude
            })

        }
    })
}
publicFun.expressDistance = function(lats, longs) {
    function expressDistance(alats, alongs, lats, longs) {
        var express = '请设置您的位置';
        var distance = '0';
        if (lats == '' || longs == '') {
            express = '商家未设置位置';
        } else if (alats == '' || alongs == '') {
            express = '您未设置位置';
        } else {
            distance = (getFlatternDistance(alats, alongs, lats, longs) / 1000).toFixed(2);

        }
        if (distance > 1000) {
            return '>1000km';
        }
        return distance + 'km';

    }

    function getRad(d) { //转换
        let PI = Math.PI;
        return d * PI / 180.0;
    }

    function getFlatternDistance(lat1, lng1, lat2, lng2) { //计算距离
        let EARTH_RADIUS = 6378137.0; //单位M

        lat1 = parseFloat(lat1);
        lng1 = parseFloat(lng1);
        lat2 = parseFloat(lat2);
        lng2 = parseFloat(lng2);

        var f = getRad((lat1 + lat2) / 2);
        var g = getRad((lat1 - lat2) / 2);
        var l = getRad((lng1 - lng2) / 2);

        var sg = Math.sin(g);
        var sl = Math.sin(l);
        var sf = Math.sin(f);

        var s, c, w, r, d, h1, h2;
        var a = EARTH_RADIUS;
        var fl = 1 / 298.257;

        sg = sg * sg;
        sl = sl * sl;
        sf = sf * sf;

        s = sg * (1 - sl) + (1 - sf) * sl;
        c = (1 - sg) * (1 - sl) + sf * sl;

        w = Math.atan(Math.sqrt(s / c));
        r = Math.sqrt(s * c) / w;
        d = 2 * w * a;
        h1 = (3 * r - 1) / 2 / c;
        h2 = (3 * r + 1) / 2 / s;
        return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
    }
    let latitude = '';
    let longitude = '';
    try {
        latitude = wx.getStorageSync('latitude')
        longitude = wx.getStorageSync('longitude')
    } catch (e) {

    }
    return (expressDistance(latitude, longitude, lats, longs));
};
publicFun.setDate = function(date) {
    var date = new Date(date * 1000);
    var seperator1 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var strDate1 = date.getMinutes();
    var seperator2 = ":";
    if (strDate1 >= 0 && strDate1 <= 9) {
        strDate1 = "0" + strDate1;
    }
    var getSeconds = date.getSeconds();

    if (getSeconds >= 0 && getSeconds <= 9) {
        getSeconds = "0" + getSeconds;
    }
    var getHours = date.getHours();

    if (getHours >= 0 && getHours <= 9) {
        getHours = "0" + getHours;
    }
    return date.getFullYear() + seperator1 + month + seperator1 + strDate + ' ' + getHours + seperator2 + strDate1 + seperator2 + getSeconds;
};
publicFun.setDateDay = function(date) {
    if ((date != '') && date) {
        date = new Date(date * 1000)
    } else {
        date = new Date()
    }

    var seperator1 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var strDate1 = date.getMinutes();
    var seperator2 = ":";
    if (strDate1 >= 0 && strDate1 <= 9) {
        strDate1 = "0" + strDate1;
    }
    return date.getFullYear() + seperator1 + month + seperator1 + strDate

};
publicFun.setDateTime = function(date) {
    var date = new Date();
    var seperator1 = "-";
    var hours = date.getHours();
    var seconds = date.getSeconds();
    var strDate1 = date.getMinutes();
    if (hours >= 1 && hours <= 9) {
        hours = "0" + hours;
    }
    if (seconds >= 0 && seconds <= 9) {
        seconds = "0" + seconds;
    }

    var seperator2 = ":";
    if (strDate1 >= 0 && strDate1 <= 9) {
        strDate1 = "0" + strDate1;
    }
    var getSeconds = date.getSeconds();

    if (getSeconds >= 0 && getSeconds <= 9) {
        getSeconds = "0" + getSeconds;
    }
    return hours + seperator2 + strDate1 + seperator2 + getSeconds;

};
publicFun.getNowFormatDate = function(that) { //获取日期时间
    var getNowFormatDate = {}
    getNowFormatDate.currentdate = function() {
        var date = new Date();
        var seperator1 = "-";

        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        return date.getFullYear() + seperator1 + month + seperator1 + strDate;
    }
    getNowFormatDate.currentTime = function() {
        var date = new Date();
        var strDate = date.getMinutes();
        var seperator2 = ":";
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        return date.getHours() + seperator2 + strDate + seperator2 + date.getSeconds()
    }
    that.setData({
        date: getNowFormatDate.currentdate(),
        time: getNowFormatDate.currentTime()
    })
};
publicFun.toFixed = function(d) {
    var s = this + "";
    if (!d) d = 0;
    if (s.indexOf(".") == -1) s += ".";
    s += new Array(d + 1).join("0");
    if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (d + 1) + "})?)\\d*$").test(s)) {
        var s = "0" + RegExp.$2,
            pm = RegExp.$1,
            a = RegExp.$3.length,
            b = true;
        if (a == d + 2) {
            a = s.match(/\d/g);
            if (parseInt(a[a.length - 1]) > 4) {
                for (var i = a.length - 2; i >= 0; i--) {
                    a[i] = parseInt(a[i]) + 1;
                    if (a[i] == 10) {
                        a[i] = 0;
                        b = i != 1;
                    } else break;
                }
            }
            s = a.join("").replace(new RegExp("(\\d+)(\\d{" + d + "})\\d$"), "$1.$2");

        }
        if (b) s = s.substr(1);
        return (pm + s).replace(/\.$/, "");
    }
    return this + "";
};
publicFun.integral = function(that) {
    if (typeof that.data.paymentData.points_data === 'undefined') {
        return
    }
    let points_data = that.data.paymentData.points_data;
    let integral = 0; //抵现积分
    let integralPrice = 0; //抵现金额
    let integralTxt = 0; //抵现文字
    let supllier_postage = 0;
    if (typeof that.data.postageData.supllier_postage !== 'undefined') {
        supllier_postage = that.data.postageData.supllier_postage * 1
    }
    let percent = ((that.data.productPrice - that.data.couponMoneysSelf) * points_data.percent * 0.01).toFixed(2) + supllier_postage; //每单最多抵现在百分比
    //    console.log(percent);
    let offset_limit = points_data.offset_limit; //每单最多可抵现金额
    let point = points_data.point; //用户积分数
    let price = points_data.price; //积分价格，每多少积分抵1元
    if (percent <= 0) { //满减商品为0时
        integralTxt = false
        that.setData({
            integralPricePage: 0,
            point: 0,
            integralTxt: integralTxt,
        })
        return
    }
    if (points_data.is_percent * 1) { //每单是否有抵现百分比限制，1：是，0：否
        if (points_data.is_limit * 1) { //每单最多可抵现限制，1：是，0：否
            if (offset_limit > percent) {
                integralPrice = percent; //抵现金额为最多抵现百分比
                point = (percent * price).toFixed(2);
            } else {
                integralPrice = offset_limit; //每单最多可抵现金额
                point = (offset_limit * price).toFixed(2)
            }
        } else { //没有最多限制
            if (percent / price > point) {
                integralPrice = point / price; //全部积分用完
                point = (point).toFixed(2)
            } else {
                integralPrice = percent; //每单最多可抵现金额
                point = (percent * price).toFixed(2)
            }
        }

    } else {
        integralPrice = point / price; //全部积分用完
        integralTxt = '您可以使用' + point + '积分，抵' + integralPrice + '元'
    }
    if (that.data.integral) {
        that.setData({
            integralpointPage: point,
            integralPricePage: integralPrice,
        })
    }
    publicFun.paymentMoney(that)
    that.setData({
        integralPrice: integralPrice,
        point: point,
        integralTxt: integralTxt = '您可以使用' + point + '积分，抵' + integralPrice + '元',
    })
};
publicFun.product_list = function(that) { //计算直营商品的价格折扣
    let product_list = that.data.paymentData.product_list;
    let reward_list = that.data.paymentData.reward_list;
    for (var i in product_list) {
        if (product_list[i].is_self) {
            if (product_list[i].discount != 0 && product_list[i].discount != 10) {
                that.data.productPrice += product_list[i].pro_price * product_list[i].pro_num * product_list[i].discount * 0.1;
                that.data.discountPrice += product_list[i].pro_price * product_list[i].pro_num * ((10 - product_list[i].discount * 1).toFixed(2)) * 0.1;
                //           console.log((10 - 9.8).toFixed(2));
            } else {
                that.data.productPrice += product_list[i].pro_price * product_list[i].pro_num
            }
        }
    }
    for (var i in reward_list) {
        that.data.rewardPrice += reward_list[i].money * 1;
        if (reward_list[i].is_self) {
            that.data.productPrice = (that.data.productPrice -= reward_list[i].money * 1).toFixed(2);
        }
    }
    publicFun.paymentMoney(that)
    that.setData({
        discountPrice: that.data.discountPrice.toFixed(2) * 1,
        rewardPrice: that.data.rewardPrice.toFixed(2) * 1
    })
};
publicFun.CouponSwichNavTab = function(that, e) { //优惠券选择
    that.data.couponMoney = 0;
    let couponTxt = e.target.dataset.coupontxt;
    let couponId = e.target.dataset.couponid;
    let couponmoney = e.target.dataset.couponprice;
    let self = e.target.dataset.self;
    that.data.oppenCouponTxt[that.data.cuponIndex] = couponTxt;
    that.data.oppenCouponMoney[that.data.cuponIndex] = couponmoney;
    that.data.oppenCouponId[that.data.cuponIndex] = couponId;
    if (self) {
        that.data.couponMoneysSelf = couponmoney
    }
    for (var i in that.data.oppenCouponMoney) {
        that.data.couponMoney += that.data.oppenCouponMoney[i] * 1;
    }
    publicFun.paymentMoney(that);
    that.setData({
        oppenCouponTxt: that.data.oppenCouponTxt,
        oppenCouponMoney: that.data.oppenCouponMoney,
        oppenCouponId: that.data.oppenCouponId,
        couponMoney: that.data.couponMoney,
        couponMoneysSelf: that.data.couponMoneysSelf
    })
    publicFun.integral(that); //积分计算
    setTimeout(function() {
        that.oppenCoupon();
    }, 300)
    publicFun.CouponSwichNav(e, that)
};
publicFun.paymentButton = function(that) { //支付按钮
    var address_id = that.data.paymentData.wxapp_address.address_id;
    if (!that.data.flags) {
        return
    }
    that.data.flags = false;
    let shipping_method = 'selffetch';

    let data = {
            orderNo: that.data.order_no,
            shipping_method: 'express',
            address_id: address_id,
            msg: that.data.customMessage,
            user_coupon_id: that.data.oppenCouponId,
            payType: 'weixin',
            postage_list: that.data.postageData.postaage_list,
            point: that.data.integralpointPage,
            point_money: that.data.integralPricePage,
            is_app: 'store_wxapp',
        }
        //    console.log(that.data.paymentData.shopData)
    if (typeof that.data.paymentData.shopData === 'undefined' && that.data.paymentPostage == 1) {
        that.setData({
            flags: true
        })
        return publicFun.warning('请选择上门自提门店', that);
    }
    console.log(that.data.paymentData.shopData);
    if (typeof that.data.paymentData.shopData !== 'undefined' && that.data.paymentPostage == 1) {
        data = {
            selffetch_id: that.data.paymentData.shopData.pigcms_id,
            selffetch_name: that.data.paymentData.name,
            selffetch_phone: that.data.paymentData.tel,
            selffetch_date: that.data.date,
            selffetch_time: that.data.time,
            orderNo: that.data.order_no,
            shipping_method: 'selffetch',
            msg: that.data.customMessage,
            user_coupon_id: that.data.oppenCouponId,
            payType: 'weixin',
            point: that.data.integralpointPage,
            point_money: that.data.integralPricePage,
            is_app: 'store_wxapp',
        }
    }
    //    console.log(data);
    common.post('app.php?c=order&a=save&payType=weixin&is_app=wxapp', data, paymentPay, '');

    function paymentPay(result) {

        if (result.err_code == 0) {
            if (result.err_dom == 'not_pay') {
                wx.redirectTo({ url: '/pages/user/order/orderList?status=unsend' });
                that.setData({
                    flags: true
                })
                return
            }

            var wx_data = result.err_msg;
            wx.requestPayment({
                'timeStamp': wx_data.timeStamp,
                'nonceStr': wx_data.nonceStr,
                'package': wx_data.package,
                'signType': 'MD5',
                'paySign': wx_data.paySign,
                'success': function(res) { //支付成功跳转到待发货页面
                    wx.redirectTo({ url: '/pages/user/order/orderList?status=unsend' });
                    that.setData({
                        flags: true
                    })
                },
                'fail': function(res) {
                    wx.showModal({
                        title: '提示信息',
                        content: '您取消了支付',
                        confirmText: '知道了',
                        showCancel: false,
                        success: function(res) {

                            that.setData({
                                flags: true
                            })
                            setTimeout(function() { //支付失败跳转到待付款页面
                                wx.redirectTo({ url: '/pages/user/order/orderList?status=all' });
                            }, 1)
                        }
                    })

                }
            })
        }
    }
};
publicFun.paymentMoney = function(that) {
    that.data.paymentMoney = that.data.paymentData.order.sub_total * 1 - that.data.rewardPrice * 1 - that.data.couponMoney * 1 - that.data.integralPricePage * 1 - that.data.discountPrice + that.data.paymentData.order.postage * 1;
    that.setData({
        paymentMoney: (that.data.paymentMoney).toFixed(2)
    })
}

publicFun.dataCode = function(data) { //日期时间戳
    var date = new Date(data);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate();
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return data = Y + '-' + M + '-' + D + '-' + h + m + s
};
publicFun.orderType = function(type) {
    switch (type * 1) {
        case 0:
            return '普通';
            break;
        case 1:
            return '代付';
            break;
        case 2:
            return '送礼';
            break;
        case 3:
            return '分销';
            break;
        case 4:
            return '活动';
            break;
        case 5:
            return '批发';
            break;
        case 7:
            return '预售';
            break;
        case 10:
            return '预约';
            break;
        case 50:
            return '超级砍价';
            break;
        case 51:
            return '一元夺宝';
            break;
        case 53:
            return '秒杀';
            break;
        case 55:
            return '降价拍';
            break;
        case 56:
            return '抽奖合集';
            break;
        case 57:
            return '摇一摇';
            break;
        case 58:
            return '微聚力';
            break;
        case 61:
            return '集字游戏';
            break;
        case 62:
            return '摇钱树游戏';
            break;

    }

};

publicFun.getType = function(url) {
    var r = {};
    if (url.indexOf('wap/page.php') > 0) {
        r.type = 'page';
        var reTag = /.*wap\/page\.php\?id=(\d*).*/g;
        var id = url.replace(reTag, '$1');
        r.id = id;
        r.url = '/pages/index/page?page_id=' + r.id;
    } else if (url.indexOf('wap/good.php') > 0) {
        r.type = 'good';
        var reTag = /.*wap\/good\.php\?id=(\d*).*/g;
        var id = url.replace(reTag, '$1');
        r.id = id;
        r.url = '/pages/product/details?product_id=' + r.id;
    } else if (url.indexOf('wap/home.php') > 0) {
        r.type = 'switchTab';
        var reTag = /.*wap\/home\.php\?id=(\d*).*/g;
        var id = url.replace(reTag, '$1');
        r.id = id;
        r.url = '/pages/index/index';
    } else if (url.indexOf('wap/ucenter.php') > 0) {
        r.type = 'switchTab';
        r.id = 0;
        r.url = '/pages/user/index';
    } else {
        /*        r.type = 'switchTab';
                r.url = '/pages/index/index';*/
    }

    return r;
}
publicFun.mapData = function(that, e) {
    let physical_id = e.target.dataset.physical;
    common.post('app.php?c=store&a=physical_detail&physical_id=' + physical_id, '', mapData, '');

    function mapData(res) {
        if (res.err_code == 0) {
            that.setData({
                mapData: res.err_msg
            })
            wx.openLocation({
                latitude: that.data.mapData.store_physical.tencent_lat,
                longitude: that.data.mapData.store_physical.tencent_lng,
                name: that.data.mapData.store_physical.name,
                address: that.data.mapData.store_physical.address,
                scale: 28
            })

        }


    }
}

module.exports = publicFun
