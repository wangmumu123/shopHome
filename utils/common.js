/**
 * @author wangmu 2017-02-08
 * **/
var common = {};
var requestDomain = "https://dd2.pigcms.com/";
var store_id = 208;
var requestDomain = "https://d.pigcms.com/";
var store_id = 11941;
common.store_id = store_id;
common.Url = requestDomain;
let ticket = '';

common.post = function(url, param, callFun, that) {

    try {
        let wx_ticket = wx.getStorageSync('ticket');
        if (wx_ticket) {
            ticket = wx_ticket;
        }
    } catch (e) {}
    if (that != '') {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        });
    }
    if (typeof(url) == 'undefined') {
        return false;
    }

    var postUrl = common.Url + url + '&request_from=app&store_id=' + store_id + '&wxapp_ticket=' + ticket;
    if (!param) {
        param = {};
    }
    wx.request({
        url: postUrl,
        data: param,
        header: {
            'Content-Type': 'application/json'
        },
        method: "POST",
        success: function(res) {
            if (res.data.err_code == 20000 || res.data.err_code == 10000) {
                if (ticket) {
                    wx.setStorageSync('ticket', '');
                    ticket = '';
                    setTimeout(function() {
                        var app = getApp();
                        app.getUserInfo(function(userInfo) {
                            setTimeout(function() {
                                common.post('app.php?c=store&a=index', '', "shopHomeData", that);
                            }, 300)
                        })
                    }, 500)
                }

                wx.switchTab({
                    url: '/pages/index/index',
                })
            }
            if ((res.data.err_code != 0 && res.data.err_code != 20000 && res.data.err_code != 10000) && res.data.err_code != 1009 && res.data.err_code != 1010) {
                wx.showModal({
                    title: '提示信息',
                    content: res.data.err_msg,
                    confirmText: '知道了',
                    showCancel: false,
                    confirmColor: '#fe6b31',
                    success: function(res) {}
                })
                try {
                    wx.setStorageSync('url', '')
                } catch (e) {}
            } else {

                if (that == '') {
                    return callFun(res.data)
                } else {
                    that.setData({
                        containerLayer: true
                    })
                }

                that[callFun](res.data);
                setTimeout(function() {
                    wx.hideToast()
                }, 500)
            }

        },
        fail: function(res) {
            console.log(res);
            console.log(postUrl);
            console.log(res);
            wx.showModal({
                title: '网络超时',
                content: '请关闭刷新',
                confirmText: '知道了',
                showCancel: false,
                confirmColor: '#fe6b31',
                success: function(res) {}
            })
        }
    });

};
module.exports = common
