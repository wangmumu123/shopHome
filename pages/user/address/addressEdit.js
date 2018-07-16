var common = require('../../../utils/common.js');
var publicFun = require('../../../utils/public.js');
var area = require('../../../utils/area.js');
Page({
    data: {
        user_address: {},
        address_id: 0,
        index: 0,
        currentTab: 0,
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
        country_code: 0
    },
    onLoad: function(e) { // 页面渲染完成
        var that = this;
        let addId = e.addid;
        publicFun.addressEditGO(that, addId);
    },
    onReady: function() {
        var that = this;
        var address_id = this.data.user_address.address_id;
        if (address_id == 0) {
            publicFun.barTitle('添加新地址'); //修改头部标题
        } else {
            publicFun.barTitle('编辑地址'); //修改头部标题
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
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            index: e.detail.value
        })
    },
    // 保存
    addressSave: function(e) {
        var that = this;
        publicFun.addressSave(that, e, '')
    },

})
