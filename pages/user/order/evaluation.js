/***@author wangmu***/
var publicFun = require('../../../utils/public.js');
var common = require('../../../utils/common.js');
Page({
    data: {
        index: 0,
        numIndex: 0,
        numList: '',
        postage: true,
        imgList: []
    },
    onLoad: function(e) { // 页面渲染完成
        var that = this;
        this.setData({
            id: e.id,
            order_id: e.order_id,
      

        });
    },
    onReady: function(e) {
        var that = this;
        common.post('app.php?c=comment&a=order_info&order_id=' + this.data.order_id, '', "evaluationData", that);
    },
    evaluationData: function(result) {
        if (result.err_code == 0) {
            let list = result.err_msg.order_product_list;
            for (var i in list) {
                list[i].comment.dateline = publicFun.setDate(list[i].comment.dateline);
            }
            this.setData({
                evaluationData: result.err_msg,
            });
        };

    },




})
