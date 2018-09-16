var curGrant = null;
getGrant = function () {
    var powerid = parent.$("#hidpowerid").val();
    $.ajax({
        url: "/getCurPageGrant",
        data: {
            powerid: powerid
        },
        async: false,
        success: function (data) {
            curGrant = JSON.parse(data);
            if (curGrant.indexOf("m" + powerid + "r1") == -1) {
                $("#btnAdd").remove();
            }
            if (curGrant.indexOf("m" + powerid + "r2") == -1) {
                $("#btnEdit").remove();
            }
            if (curGrant.indexOf("m" + powerid + "r3") == -1) {
                $("#btnDel").remove();
            }
            if (curGrant.indexOf("m" + powerid + "r4") == -1) {
                $("#btnExport").remove();
            }
        }
    });
}();