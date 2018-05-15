/**
 * Created by hxsd on 2020/6/29.
 */
var clientSocket = io();
var flag = 0;
var privateUser = {};
var userInfo = {};
var allUser = {};
var mainAllUserInfo = [];
var count = 1;
$(function () {
    /*背景变换*/
    $("input[name='bj']").click(function () {
        $("body").css("background", 'url(' + $(this).val() + ')');
        $("#bj .reg").css("background-color","black");
        $(this).next().css("background-color","red")
    })
    onloadBq()
    count = 1;
    /*选择表情*/
    $(".chat-bq a").click(function () {
        $(".chat-bq").hide();
        var content = "";
        content = $("#message").val() + "[emoji:" + $(this).index() + "]";
        $("#message").val(content);

    });
    $(".bq-library").click(function(){
        $(".chat-bq").toggle();
    });
    /*   点击其他区域，表情库隐藏*/
    document.body.addEventListener('click', function (e) {
        var bq = document.getElementsByClassName('bq-library');
        var menu = document.getElementsByClassName('user-menu');
        if (e.target != menu) {
            $(".user-nav").hide();
        }
        if (e.target != bq[0]) {
            $(".chat-bq").hide();
        }
    });
    /*发送图片*/
    $("input[type=file]")[0].onchange = function () {
        $.ajax({
            url: "douploadajax",
            method: "POST",
            cache: false,
            // 将jquery对象转换为js对象
            data: new FormData($("#uploadForm")[0]),
            processData: false,
            contentType: false
        }).success(function (responseTxt) {
            var messageData = {
                type: "picMessage",
                content: responseTxt
            };
            if (flag == 1) {
                messageData.type = "priPicMessage";
                messageData.people = privateUser
            }
            clientSocket.send(messageData);

        }).fail(function (err) {
            $("#result").html("文件上传失败");
        });
    };
    /*加载头像*/
    for (var i = 1; i <= 10; i++) {
        var content = '<li><img src="images/head/' + i + '.jpg"></li>';
        $(".pic-library").append(content);
    }
    clientSocket.on("welcome", function (allUserInfo) {
        allUser = allUserInfo;
        printUserInfo(allUserInfo);
    });
    /*更换图片与登陆*/
    $(".change-head").bind("click", function () {
        $(".pic-library").removeClass("hide");
    });
    $(".pic-library li img").bind("click", function () {
        $(".self-img img").attr("src", $(this).attr("src"));
        $(".pic-library").addClass("hide");
    });
    /*登陆按钮*/
    $(".login-btn").bind("click", function () {
        login();
    })
    clientSocket.on("user_entered", function (data) {
        userEntered(data);
    });
    clientSocket.on("my_entered", function (data) {
        myEntered(data);
    });

    clientSocket.on("user_leave", function (data, allUserInfo) {
        userLeave(data, allUserInfo);
    })
    $("#send-btn").bind("click", function () {
        sendMessage()

    });
    /*群聊按钮*/
    $(".crowd").click(function () {
        flag = 0;
        $(".window-title").html("群聊");
    })
    clientSocket.on("message", function (messageData) {
        showMessage(messageData);
    });
    /*  按键发送*/
    $("#message").keydown(function (e) {
        if (e.keyCode == 13) {
            $("#send-btn").click();
            e.preventDefault();//屏蔽enter对系统作用。按后增加\r\n等换行
            $("#message").val("");
        }
    });
    /*动态绑定事件*/
    $('body').delegate(".user-menu", 'click', function () {
        $(".user-nav").hide();
        $(this).next().toggle();
    });
    $('body').delegate(".user-nav a", 'click', function () {
        $(".user-nav").hide();
        privateUser.oneself = userInfo.username;
        privateUser.privateFriend = $(this).parent().prev().prev().prev().html();
        $(".window-title").html(privateUser.privateFriend + "「私聊」");
        flag = 1;
        if ($(this).index() == 0) {
        }
    })
});

/* 改变头像*/
function login() {
    userInfo.username = $("#username").val();
    if (userInfo.username == "") {
        $(".explain").html("昵称不能为空");
        $(".explain").removeClass("hide");
        return;
    }
    if (userInfo.username.length > 8) {
        $(".explain").html("用户名不能超过8位");
        $(".explain").removeClass("hide");
        return;
    }
    for (var i = 0; i < allUser.length; i++) {
        if (allUser[i].username == userInfo.username) {
            $(".explain").html("用户名已存在");
            $(".explain").removeClass("hide");
            return;
        }
    }

    if ($("#man").is(':checked') == true) {
        userInfo.usersex = "fa fa-mars";
        userInfo.usersexcolor = "man-color"
    }
    else {
        userInfo.usersex = "fa fa-venus";
        userInfo.usersexcolor = "girl-color"
    }
    userInfo.userpic = $(".self-img img").attr("src");
    userInfo.userstatus = "在线";
    clientSocket.emit("user_enter", userInfo);
    $("#chat-window").removeClass("hide");
    $("#login-window").hide();
}
function printUserInfo(allUserInfo) {
    for (var i = 0; i < allUserInfo.length; i++) {
        var newUser = ' <li class="' + allUserInfo[i].usersexcolor + '"><img src=' + allUserInfo[i].userpic + '> <span>' + allUserInfo[i].username + '</span>&nbsp[</span><span class="' + allUserInfo[i].usersex + '"></span>] <a class="fa fa-bars pull-right user-menu"></a><div class="user-nav"> <a>私聊</a> <a>加为好友</a> <a>删除</a> </div></li>'
        $(".contact-info").append(newUser);
    }
}
function userEntered(data) {
    var newUser = '<li class="' + data.usersexcolor + '"><img src=' + data.userpic + '> <span>' + data.username + '</span>&nbsp[</span><span class="' + data.usersex + '"></span>] <a class="fa fa-bars pull-right user-menu"></a><div class="user-nav"><a>私聊</a><a>加为好友</a><a>删除</a></div></li>'
    var content = '<div class="systemMessage">[系统消息]欢迎<span>' + data.username + '</span>进入聊天室</div>';
    $("#messages").append(content);
    $(".contact-info").append(newUser);
}
function myEntered(data) {
    var content = '<div class="systemMessage">[系统消息]您已进入了聊天室。请遵纪守法，否则负法律责任。</div>';
    var myInfoContent = '<div class="self-info"> <img src=' + data.userpic + '> <span>' + data.username + '</span><a class="fa fa-gear pull-right head-menu"></a></div>'
    $("#my-info").append(myInfoContent);
    $("#messages").append(content);

}
function userLeave(data, allUserInfo) {
    $(".contact-info").empty();
    for (var i = 0; i < allUserInfo.length; i++) {
        if (allUserInfo[i].username == userInfo.username) {
            continue;
        }
        var newUser = ' <li class="' + allUserInfo[i].usersexcolor + '"><img src=' + allUserInfo[i].userpic + '> <span>' + allUserInfo[i].username + '</span>&nbsp[</span><span class="' + allUserInfo[i].usersex + '"></span>]<a class="fa fa-bars pull-right user-menu" ></a><div class="user-nav"><a>私聊</a><a>加为好友</a><a>删除</a> </div></li>'
        $(".contact-info").append(newUser);
    }
    var content = '<div class="systemMessage">[系统消息]<span>' + data.username + '</span>离开聊天室</div>';
    $("#messages").append(content);
}
function sendMessage() {
    if ($("#message").val().length == 0) {
        alert("内容不能为空");
        return;
    }
    var message = $("#message").val();
    message = transformImg(message);
    if (flag == 0) {
        var messageData = {
            type: "userMessage",
            content: message
        };
    } else {
        var messageData = {
            type: "priMessage",
            content: message,
            people: privateUser
        };
    }
    clientSocket.send(messageData);
    $("#message").val("");//清空发送的内容
}
function transformImg(message) {
    var match, result = message, reg = /\[emoji:\d+\]/g, emojiIndex;
    while (match = reg.exec(message)) {
        emojiIndex = match[0].slice(7, -1);
        var i = parseInt(emojiIndex / 15);
        var j = emojiIndex - 15 * i;
        var x = (i * -29) + "px";
        var y = (j * -29) + "px";
        result = result.replace(match[0], '<span class="emoji-bq" style="background-position: ' + y + ' ' + x + '"></span>');

    }

    return result;
}
function showMessage(messageData) {
    var time = new Date();
    time = time.toLocaleTimeString();
    if (messageData.type == "priMessage") {
        if (messageData.people.privateFriend == userInfo.username) {
            flag = 1;
            $(".window-title").html(messageData.people.oneself + "「私聊」");
            privateUser.oneself = messageData.people.privateFriend;
            privateUser.privateFriend = messageData.people.oneself;
            messageData.type = "userMessage";
            var content = '<div class="' + messageData.type + ' ' + "blue" + '">' + '<img src=' + messageData.userpic + '><span class="said">' + messageData.username + '说:' + messageData.content + '</span><p class="time">' + time + '</p></div> <div class="clearfix"></div>';

            $("#messages").append(content);
            $(".emoji-bq").addClass("bqbox");
        }

    } else {
        var content = '<div class="' + messageData.type + '">' + '<img src=' + messageData.userpic + '><span class="said">' + messageData.username + '说:' + messageData.content + '</span><p class="time">' + time + '</p></div> <div class="clearfix"></div>';

        $("#messages").append(content);
        $(".emoji-bq").addClass("bqbox");
    }
    $("#messages").scrollTop($("#messages").prop("scrollHeight"));
}
/*加载表情*/
function onloadBq() {
    for (var i = 0; i < 7; i++) {
        for (var j = 0; j < 15; j++) {
            var bqClass = "bq" + count;
            var content = '<a class=' + bqClass + ' title="' + count + '"></a>';
            $(".chat-bq").append(content);
            var x = (j * -29) + "px";
            var y = (i * -29) + "px";
            document.getElementsByClassName(bqClass)[0].style.backgroundPosition = x + " " + y;
            count++;
        }
    }
}