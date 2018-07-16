/*
 * 作者 : wangmu
 * QQ  : 584019624
 */
var HTML2JSON = require('../think-modules/html2json');
 
var _CONFIG = {};
var Fun = function() {};
var THINK = Fun;

//html转json(已过滤标签外的空格)
Fun.html2json = function(html) {
    if (arguments.length > 1) {
        throw new Error('错误的参数');
    }
    let r = /\s+(?=<)/g;
    html = html.replace(r, '');
    let newHtml = HTML2JSON.html2json(html);
    return newHtml;
}

module.exports = Fun;
