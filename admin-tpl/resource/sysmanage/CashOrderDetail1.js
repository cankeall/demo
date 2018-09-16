var sys = {};

sys.cashorderdetail = function () {
    var _self = this;

    this.initData = function () {
        $('#tblData').bootstrapTable({
            url: '/CashOrderDetail/InitData',         //请求后台的URL（*）
            method: 'get',                      //请求方式（*）
            striped: true,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,                   //是否显示分页（*）
            sortable: false,                     //是否启用排序
            sortOrder: "asc",                   //排序方式
            cardView: com.IsPC() ? false : true,
            queryParams: function (params) {
                return {
                    beginDate: $("#BEGIN_DATE").val(),
                    endDate: $("#END_DATE").val(),
                    orderType: $("#selOrderType").val(),
                    accounts: $("#txtAccounts").val(),
                    createUser: $("#txtCreateUser").val(),
                    limit: params.limit,
                    offset: params.offset,
                    total: $("#hidtotal").val()
                }
            },
            sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1,                       //初始化加载第一页，默认第一页
            pageSize: 20,                       //每页的记录行数（*）
            pageList: [],        //可供选择的每页的行数（*）
            uniqueId: "OrderID",                     //每一行的唯一标识，一般为主键列
            //showFooter: true,
            columns: [
                { field: "OrderID", title: "订单号" },
                {
                    field: "OrderTime", title: "时间", formatter: function (value, row, index) {
                        if (row.Timezone != 0) {
                            return com.ISDateMD(value);
                        }
                        else {
                            return com.DateTimeFormat(value);
                        }
                    }
                },
                { field: "ChannelName", title: "代理" },
                { field: "CreateUser", title: "玩家账号" },
                {
                    field: "OrderType", title: "类型", formatter: function (value, row, index) {
                        return com.OrderTypeFormat(value);
                    }
                },
                {
                    field: "CurScore", title: "账变前金额", formatter: function (value, row, index) {
                        return com.formatMoney(value / 100);
                    }
                },
                {
                    field: "AddScore", title: "账变金额", formatter: function (value, row, index) {
                        if (row.OrderType == 7)
                            return com.formatMoney(-value / 100);
                        else
                            return com.formatMoney(value / 100);
                    }
                },
                {
                    field: "NewScore", title: "账变后金额", formatter: function (value, row, index) {
                        return com.formatMoney(value / 100);
                    }
                },
                { field: "OrderIP", title: "IP" },
                { field: "CreateUser", title: "操作人" }
            ],
            onLoadSuccess: function (data) {
                $("#hidtotal").val(data.total);
                if (data.totalData && data.totalData.length > 0) {
                    var data = data.totalData;
                    $("#divTotal").empty().html("总上分：" + com.formatMoney(data[0].AddScore / 100) + ", 总下分：" + com.formatMoney(data[0].LowScore / 100) + "&nbsp;&nbsp;");
                }
            }
        });
    }

    this.exportExcel = function () {
        var iframe = document.createElement("iframe");
        iframe.style.display = "none";
        document.body.appendChild(iframe);
        var beginDate = $("#BEGIN_DATE").val();
        var endDate = $("#END_DATE").val();
        var orderType = $("#selOrderType").val();
        var accounts = $("#txtAccounts").val();
        var createUser = $("#txtCreateUser").val();
        iframe.src = "/CashOrderDetail/ExportData?beginDate=" + beginDate + "&endDate=" + endDate + "&orderType=" + orderType + "&accounts=" + accounts + "&createUser=" + createUser + "&rnd=" + Math.random().toString();
    }
}


$(function () {
    var powerid = parent.$("#hidpowerid").val();
    if ($("#hidIsAgent").val() == 1 || ($("#hidIsAgent").val() == 0 && curGrant.indexOf("m" + powerid + "r4") == -1)) {   // 代理商后台没有导出，开发商后台没权限不显示
        $("#btnExportExcel").parent("div").remove();
    }
    if (com.IsPC()) {
        $("#BEGIN_DATE,#END_DATE").datetimepicker({ format: "Y-m-d H:i", lang: "ch", step: 1 });
    } else {
        com.initDateControl();
    }

    var obj = new sys.cashorderdetail();
    obj.initData();

    $("#btnSearch").click(function () {
        var beginDate = $("#BEGIN_DATE").val();
        var endDate = $("#END_DATE").val();
        if (!beginDate)
            beginDate = com.DateFormat(new Date());
        if (!endDate)
            endDate = com.DateFormat(new Date());
        var timespan = com.TimeSpan(endDate, beginDate);
        if (timespan > 7) {
            alert("搜索时间范围不能超过七天!");
            return false;
        }
        $("#hidtotal").val("0");
        $("#tblData").bootstrapTable("refreshOptions", { pageNumber: 1, pageSize: 20 });
    });
    $("#btnExportExcel").click(function () {
        obj.exportExcel();
    });
});