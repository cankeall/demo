var com = {};

com.OrderTypeFormat = function (v) {
    if (v == 0)
        return "游戏后台上分";
    else if (v == 1)
        return "游戏后台下分";
    else if (v == 2)
        return "进入游戏下分";
    else if (v == 3)
        return "退出游戏上分";
    else if (v == 6)
        return "从现金网上分";
    else if (v == 7)
        return "从现金网下分";
}
com.ProxyOrderTypeFormat = function (v) {
    if (v == 0)
        return "后台上分";
    else if (v == 1)
        return "后台下分";
    else if (v == 2)
        return "玩家上分";
    else if (v == 3)
        return "玩家下分";
    else if (v == 4)
        return "玩家取款";
    else if (v == 5)
        return "玩家充值";
}

com.formatMoney = function (value) {
    var sign = value < 0 ? '-' : '';
    return sign + utils.formatNumber(Math.abs(value), '#,##0.00');
};
com.formatNumber = function (value) {
    var sign = value < 0 ? '-' : '';
    return sign + utils.formatNumber(Math.abs(value), '#,##0');
}
com.formatMoney2 = function (value) {
    var sign = value < 0 ? '-' : '';
    return sign + utils.formatNumber(Math.abs(value), '##0.00');
};
com.DateFormat = function (v) {
    return utils.dateFormat(v, "yyyy-MM-dd");
}
com.DateTimeFormat = function (v, format) {
    return utils.dateFormat(v, format);
}
com.TimeSpan = function (v1, v2) {
    var date1 = new Date(v1);
    var date2 = new Date(v2);
    var timespan = date1.getTime() - date2.getTime();
    return timespan / (24 * 3600 * 1000);
}
//时间戳转时间
com.getLocalTime = function (nS) {
    var dt = new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
    return dt
}
function add0(m) { return m < 10 ? '0' + m : m }
//时间戳毫秒转时间
com.getLocalHMTime = function (nS) {
    var msecStr = nS.toString().replace(/\/Date\(([-]?\d+)\)\//gi, "$1"); // => '1419492640000' ：通过正则替换，获取毫秒字符串
    var msesInt = Number.parseInt(msecStr); // 毫秒字符串转换成数值
    //var dt = new Date(msesInt).toLocaleString().replace(/:\d{1,2}$/, ' ');
    var dt = new Date(msesInt).toString(); // 初始化Date对象
    var Hmdate = utils.dateFormat(dt, "yyyy-MM-dd hh:mm:ss");
    return Hmdate;
}

com.initDateControl = function (control) {
    var currYear = (new Date()).getFullYear();
    var opt = {};
    opt.date = { preset: 'date' };
    //opt.datetime = { preset: 'datetime' };
    //opt.time = { preset: 'time' };
    opt.default = {
        // theme: 'android-ics light', //皮肤样式
        // display: 'modal', //显示方式 
        // mode: 'scroller', //日期选择模式
        // dateFormat: 'yy-mm-dd',
        // lang: 'zh',
        // showNow: true,
        // nowText: "今天",
        // startYear: currYear - 10, //开始年份
        // endYear: currYear + 10 //结束年份
        preset: 'date', //日期
        theme: 'android-ics light', //皮肤样式
        display: 'modal', //显示方式 
        mode: 'scroller', //日期选择模式
        dateFormat: 'yy-mm-dd', // 日期格式
        setText: '确定', //确认按钮名称
        cancelText: '取消',//取消按钮名籍我
        dateOrder: 'yymmdd', //面板中日期排列格式
        dayText: '日', monthText: '月', yearText: '年', //面板中年月日文字
        endYear: 2020 //结束年份
    };
    if (control) {
        $("#" + control).mobiscroll($.extend(opt['date'], opt['default']));
    } else {
        $("#END_DATE").mobiscroll($.extend(opt['date'], opt['default']));

        $("#BEGIN_DATE").mobiscroll($.extend(opt['date'], opt['default']));
    }
}

com.initDateControlByYYMM = function (control, defaults) {
    var currYear = (new Date()).getFullYear();
    var opt = {};
    opt.date = { preset: 'date' };
    opt.default = $.extend({
        theme: 'android-ics light', //皮肤样式
        dateFormat: 'yy/mm',
        dateOrder: 'yymm',
        lang: 'zh',
        headerText: function (valueText) { //自定义弹出框头部格式  
            array = valueText.split('/');
            return array[0] + "年" + array[1] + "月";
        }
    }, defaults);


    $("#" + control).mobiscroll($.extend(opt['date'], opt['default']));
}
com.getDaysInMonth = function (v) {
    var d = v ? new Date(v) : new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    return new Date(year, month + 1, 0).getDate();
}

com.getFirstDayInMonth = function (v) {
    var d = v ? new Date(v) : new Date();

    var year = d.getFullYear();
    var month = d.getMonth();
    month = month + 1 >= 10 ? month + 1 : "0" + (month + 1);

    return year + "-" + month + "-01";
}
com.getFirstDayByThirty = function () {
    var d = new Date();
    d = d.getTime() - 29 * 24 * 60 * 60 * 1000;
    var tmp = new Date(d);
    var year = tmp.getFullYear();
    var month = tmp.getMonth();
    var date = tmp.getDate();
    month = month + 1 >= 10 ? month + 1 : "0" + (month + 1);
    date = date >= 10 ? date : "0" + date;
    return year + "-" + month + "-" + date;
}



com.addDate = function (dd, dadd) {
    var a = new Date(dd)
    a = a.valueOf()
    a = a + dadd * 24 * 60 * 60 * 1000
    a = new Date(a)

    var m = a.getMonth() + 1;
    var d = a.getDate();
    if (m < 10) m = "0" + m;
    if (d < 10) d = "0" + d;
    return m + "/" + d;
}
com.IsPC = function () {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        return false;
    } else {
        return true;
    }
}

com.IsShowRevenue = function (channelId) {
    if (channelId == "60162"
        || channelId == "60088"
        || channelId == "70043"
        || channelId == "30096")
        return true;
    else
        return false;
}

com.gettimechangeover = function timeFormat(timestamp) {
    var time = moment(moment.unix(parseInt(timestamp)).toDate()).utcOffset(8).format("YYYY-MM-DD HH:mm:ss");
    return time;
}
com.gettimechangeoverdata = function timeFormat(timestamp) {
    var time = moment(moment.unix(parseInt(timestamp)).toDate()).utc().zone(-8).format("YYYY-MM-DD");
    return time;
}
com.ISDateMDadd = function (datatime) {
    var time = new Date(datatime.replace("-", "/").replace("-", "/"));
    var StateTimeofHours = time.getHours();//获取小时属性
    var StateTimeDateOfFromat = time.setHours(StateTimeofHours + 12); //设置小时属性
    return com.gettimechangeover((StateTimeDateOfFromat / 1000));
}
//转换美东时间
com.ISDateMD = function (datatime) {
    // var time = new Date(datatime.replace("-", "/").replace("-", "/"));
    // var StateTimeofHours = time.getHours();//获取小时属性
    // var StateTimeDateOfFromat = time.setHours(StateTimeofHours - 12); //设置小时属性
    // return com.gettimechangeover((StateTimeDateOfFromat / 1000));.add(-10, "m")
    var time = moment(datatime).add(-12, "h").format("YYYY-MM-DD HH:mm:ss");
    return time;
}

com.gettimechangemd = function timeFormat(timestamp) {
    var time = moment(moment.unix(parseInt(timestamp)).toDate()).utc().zone(-8).format('YYYY-MM-DD HH:mm:ss');
    return com.ISDateMD(time);
}

var utils = {};

/**  
* 格式化数字显示方式   
* 用法  
* formatNumber(12345.999,'#,##0.00');  
* formatNumber(12345.999,'#,##0.##');  
* formatNumber(123,'000000');
*/
utils.formatNumber = function (v, pattern) {
    if (v == null)
        return v;
    var strarr = v ? v.toString().split('.') : ['0'];
    var fmtarr = pattern ? pattern.split('.') : [''];
    var retstr = '';
    // 整数部分   
    var str = strarr[0];
    var fmt = fmtarr[0];
    var i = str.length - 1;
    var comma = false;
    for (var f = fmt.length - 1; f >= 0; f--) {
        switch (fmt.substr(f, 1)) {
            case '#':
                if (i >= 0) retstr = str.substr(i--, 1) + retstr;
                break;
            case '0':
                if (i >= 0) retstr = str.substr(i--, 1) + retstr;
                else retstr = '0' + retstr;
                break;
            case ',':
                comma = true;
                retstr = ',' + retstr;
                break;
        }
    }
    if (i >= 0) {
        if (comma) {
            var l = str.length;
            for (; i >= 0; i--) {
                retstr = str.substr(i, 1) + retstr;
                if (i > 0 && ((l - i) % 3) == 0) retstr = ',' + retstr;
            }
        }
        else retstr = str.substr(0, i + 1) + retstr;
    }
    retstr = retstr + '.';
    // 处理小数部分   
    str = strarr.length > 1 ? strarr[1] : '';
    fmt = fmtarr.length > 1 ? fmtarr[1] : '';
    i = 0;
    for (var f = 0; f < fmt.length; f++) {
        switch (fmt.substr(f, 1)) {
            case '#':
                if (i < str.length) retstr += str.substr(i++, 1);
                break;
            case '0':
                if (i < str.length) retstr += str.substr(i++, 1);
                else retstr += '0';
                break;
        }
    }
    return retstr.replace(/^,+/, '').replace(/\.$/, '');
};
utils.dateFormat = function (v, format) {
    if (!v) return "";
    var d = v;
    if (format == undefined)
        format = "yyyy-MM-dd hh:mm:ss";
    if (typeof v === 'string') {
        if (v.indexOf("/Date(") > -1)
            d = new Date(parseInt(v.replace("/Date(", "").replace(")/", ""), 10));
        else
            d = new Date(Date.parse(v.replace(/-/g, "/").replace("T", " ").split(".")[0]));//.split(".")[0] 用来处理出现毫秒的情况，截取掉.xxx，否则会出错
    }
    var o = {
        "M+": d.getMonth() + 1,  //month
        "d+": d.getDate(),       //day
        "h+": d.getHours(),      //hour
        "m+": d.getMinutes(),    //minute
        "s+": d.getSeconds(),    //second
        "q+": Math.floor((d.getMonth() + 3) / 3),  //quarter
        "S": d.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}

function padLeft(str, n) {
    var len = str.length;
    while (len < n) {
        str = "0" + str;
        len++;
    }
    return str;
}

utils.numVerify = function (num) {
    var re = /^[0-9]+$/;
    return re.test(num);
}

//随机产生随机数
utils.getRandomnum = function (n) {
    var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var res = "";
    for (var i = 0; i < n; i++) {
        var id = Math.ceil(Math.random() * 35);
        res += chars[id];
    }
    return res;
}
function pad2(n) { return n < 10 ? '0' + n : n }

utils.generateTimeReqestNumber = function () {
    var date = new Date();
    return date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds()) + pad2(date.getMilliseconds());
}

utils.generateorderNumber = function () {
    var date = new Date();
    return date.getYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds());
}

