import Vue from 'vue';

let commonFunction = {
    //截取url参数
    'getUrlString': function () {
        var urlString = window.location.href.split(".html")[0].split("/");
        var url = urlString[urlString.length - 1] + '.html';
        return url;
    },
    //截取路由参数
    'getRoutString': function () {
        var urlString = window.location.href.split("#/")[1];
        console.log(urlString);
        if (typeof urlString != "undefined" && urlString != "") {
            if (urlString.indexOf("?") >= 0) {
                urlString = urlString.split("?")[0];
            }
            var _arr = urlString.split("/");
            return _arr;
        } else {
            return [];
        }
    },
    //判断手机系统
    'judgingMobileSystem':function () {
        var UA = navigator.userAgent;
        if (UA.match(/iPad/) || UA.match(/iPhone/) || UA.match(/iPod/)) {
            return '3';
        }else if(UA.match(/Android/) || UA.match(/Adr/)){
            return '2';
        }
    },
    //获取参数
    'getQueryString': function (name) {
        var src = window.location.href.substring(window.location.href.indexOf("?") + 1);
        var reg = new RegExp("(^|&|/?)" + name + "=([^&]*)(&|$)");
        var r = src.match(reg);
        if (r != null) return decodeURIComponent(r[2]); return '';
    },
    // 判断是否在微信内
    'isWeixin': function () {
        let ua = navigator.userAgent.toLowerCase();
        let isWeixin = ua.indexOf('micromessenger') != -1;
        if (isWeixin) {
            return true;
        } else {
            return false;
        }
    },
    'getCookie': function (key) {
        var v = window.document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
        return v ? v[2] : "";
    },
    'setCookie': function (name, value, days) {
        var d = new Date;
        d.setTime(d.getTime() + 24*60*60*1000*days);
        window.document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
    },
    'deleteCookie': function (name) {
        this.set(name, '', -1);
    },
    'IdCardValidate':function (idCard) {
        if (!idCard) return false;
        idCard = idCard.replace(/ /g, "");               //去掉字符串头尾空格
        if (idCard.length == 15) {
            return this.isValidityBrithBy15IdCard(idCard);       //进行15位身份证的验证
        } else if (idCard.length == 18) {
            var a_idCard = idCard.split("");                // 得到身份证数组
            if(this.isValidityBrithBy18IdCard(idCard)&&this.isTrueValidateCodeBy18IdCard(a_idCard)){   //进行18位身份证的基本验证和第18位的验证
                return true;
            }else {
                return false;
            }
        } else {
            return false;
        }
    },
    /*
    * 判断身份证号码为18位时最后的验证位是否正确
    * @param a_idCard 身份证号码数组
    * @return
    */
    'isTrueValidateCodeBy18IdCard':function (a_idCard) {
        let Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 ],    // 加权因子
            ValideCode = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ],            // 身份证验证位值.10代表X
            sum = 0;                             // 声明加权求和变量
        if (a_idCard[17].toLowerCase() == 'x') {
            a_idCard[17] = 10;                    // 将最后位为x的验证码替换为10方便后续操作
        }
        for ( var i = 0; i < 17; i++) {
            sum += Wi[i] * a_idCard[i];            // 加权求和
        }
        let valCodePosition = sum % 11;                // 得到验证码所位置
        if (a_idCard[17] == ValideCode[valCodePosition]) {
            return true;
        } else {
            return false;
        }
    },
    /**
     * 验证18位数身份证号码中的生日是否是有效生日
     * @param idCard 18位书身份证字符串
     * @return
     */
    'isValidityBrithBy18IdCard':function (idCard18){
        var year =  idCard18.substring(6,10);
        var month = idCard18.substring(10,12);
        var day = idCard18.substring(12,14);
        var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));
        // 这里用getFullYear()获取年份，避免千年虫问题
        if(temp_date.getFullYear()!=parseFloat(year)
            ||temp_date.getMonth()!=parseFloat(month)-1
            ||temp_date.getDate()!=parseFloat(day)){
            return false;
        }else{
            return true;
        }
    },
    'randomStr': function(length) {
        let str = Math.random().toString(36).substr(2);
        if(str.length>length) return str.substr(0,length);
        str += this.randomStr(length-str.length);
        return str;
    },
    /**
     * 数值按照指定位数补零
     * @params num:原数值
     * @params index:补零后位数，如不传，则默认为2位
     */
    'getZero':function (num, index) {
        if((parseInt(num) != 0) && (typeof num == "undefined" || num == null || num == "" || isNaN(num))) return num;
        let _num = parseInt(num);
        if(!index)  index = 2;
        if(_num == 0) {
            for (let i = 1; i < parseInt(index); i++) {
                _num += "0";
            }
        } else {
            for (let i = 1; i < parseInt(index); i++) {
                if(parseInt(_num) < Math.pow(10,i)) {
                    _num = "0" + _num;
                }
            }
        }
        return _num;
    },
    /**
     * 时间戳准换成日期
     * @params date:时间戳
     * @params fmt:格式，如不传，则默认为yyyy-mm-dd格式
     */
    'getDateTime':function (date, fmt) {
        if(typeof date == "undefined" || date == null || date == "" || isNaN(date)) return "";
        let time = new Date(date);
        let _y = time.getFullYear();
        let _mon = this.getZero(time.getMonth() + 1);
        let _d = this.getZero(time.getDate());
        let _h = this.getZero(time.getHours());
        let _min = this.getZero(time.getMinutes());
        let _s = this.getZero(time.getSeconds());
        let date_t = "";
        if(fmt == "yyyy-mm-dd hh:mm:ss") {
            date_t = `${_y}-${_mon}-${_d} ${_h}:${_min}:${_s}`;
        }else if(fmt == "yyyy-mm-dd hh:mm") {
            date_t = `${_y}-${_mon}-${_d} ${_h}:${_min}`
        }else if(fmt == "yyyy-mm-dd") {
            date_t = `${_y}-${_mon}-${_d}`;
        }else if(fmt == "yyyy-mm") {
            date_t = `${_y}-${_mon}`;
        }else if(fmt == "yyyy:mm:dd hh:mm:ss") {
            date_t = `${_y}:${_mon}:${_d} ${_h}:${_min}:${_s}`;
        }else if(fmt == "yyyy:mm:dd hh:mm") {
            date_t = `${_y}:${_mon}:${_d} ${_h}:${_min}`;
        }else if(fmt == "yyyy:mm:dd") {
            date_t = `${_y}:${_mon}:${_d}`;
        }else if(fmt == "yyyy:mm") {
            date_t = `${_y}:${_mon}`;
        }else if(fmt == "yyyy.mm") {
            date_t = `${_y}.${_mon}`;
        }else if(fmt == "yyyy.mm.dd") {
            date_t = `${_y}.${_mon}.${_d}`;
        }else if(fmt == "yyyy.mm.dd hh:mm") {
            date_t = `${_y}.${_mon}.${_d} ${_h}:${_min}`;
        }else if(fmt == "yyyymmdd") {
            date_t = `${_y}${_mon}${_d}`;
        }else if(fmt == "hh:mm:ss") {
            date_t = `${_h}:${_min}:${_s}`;
        }else if(fmt == "yymmddhhmmss") {
            date_t = `${_y}${_mon}${_d}${_h}${_min}${_s}`;
        }else {
            date_t = `${_y}-${_mon}-${_d}`;
        }
        return date_t;
    },
}

export default {
    install() {
        Object.defineProperties(Vue.prototype, {
            $commonFunction: {
                value: commonFunction,
            },
        });
    },
};
