

(function (global) {

    var token = 'abc';

    global.token = token; // 将当前闭包内的某个变量绑定到全局环境

})(this);

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) { return c.substring(name.length, c.length); }
    }
    return "";
}

(function ($) {
    $.fn.serializeJson = function () {
        var serializeObj = {};
        var array = this.serializeArray();
        var str = this.serialize();
        $(array).each(function () {
            if (serializeObj[this.name]) {
                if ($.isArray(serializeObj[this.name]) && this.value != "") {
                    serializeObj[this.name].push(this.value);
                } else {
                    if (this.value != "") {
                        serializeObj[this.name] = [serializeObj[this.name], this.value];
                    }
                }
            } else {
                if (this.value != "") {
                    serializeObj[this.name] = this.value;
                }
            }
        });
        return serializeObj;
    };
})(jQuery);

function register() {
    var reg_data = ($('#reg_form').serializeJson());
    if (reg_data.username == undefined || reg_data.password == undefined) {
        alert("用户名或密码不能为空");
        return;
    }
    else
        if (!$("input[type='checkbox']").is(':checked')) {
            alert("请阅读相关规定后，勾选");
            return;
        }

    $.ajax({
        type: "POST",
        dataType: "json",
        url: "https://api.shisanshui.rtxux.xyz/auth/register",
        data: JSON.stringify(reg_data), //提交的数据
        contentType: "application/json;charset-UTF-8",
        success: function (result) { //todo
            console.log(result); //打印服务端返回的数据(调试用)
            if (result.status == 0) {
                alert("注册成功");
                window.location.href = './menu.html'
            };
        },
        error: function () {
            alert("注册失败");

        }
    });
}
function begin() {
    var login_data = ($('#login_form').serializeJson());
    if (login_data.username == undefined || login_data.password == undefined) {
        alert("用户名或密码不能为空");
        return;
    }
    else
        if (!$("input[type='checkbox']").is(':checked')) {
            alert("请阅读相关规定后，勾选");
            return;
        }
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "https://api.shisanshui.rtxux.xyz/auth/login",
        data: JSON.stringify(login_data), //提交的数据
        contentType: "application/json;charset-UTF-8",
        success: function (result) {
            console.log(result); //打印服务端返回的数据(调试用)
            if (result.status == 0) {
                localStorage.setItem('token', result.data.token)
                // $.cookie('token',result.data.token,{ path: "/"})
                // token=result.data.token;
                // document.cookie="token="+token;
                alert("登录成功");
                window.location.href = './menu.html'
            };
        },
        error: function (res) {
            // $("#login_form").reset();
            alert("用户名或密码错误");
        }
    });
}

function exit() {
    window.location.href = "./index.html"
}
function game() {
    document.getElementsByClassName("btns")[0].style.display = "none";
    document.getElementsByClassName("loading")[0].style.display = "flex";
    $.ajax({
        headers: {
            "X-Auth-Token": localStorage.token//此处放置请求到的用户token
        },
        type: "POST",
        url: "https://api.shisanshui.rtxux.xyz/game/open",//请求url
        contentType: "application/json;charset=UTF-8",
        cacheontrol: "no-cache, no-store, max-age=0, must-revalidate",
        success: (data) => {
            document.getElementsByTagName("title")[0].innerText = '游戏中...等待出牌';
            localStorage.setItem('id', data.data.id);
            localStorage.setItem('card', data.data.card);
            window.location.href = "./game.html";
        },
        error: (err) => {
            alert("开局失败");
            console.log(err);
            document.getElementsByClassName("loading")[0].style.display = "none";
            document.getElementsByClassName("btns")[0].style.display = "flex";
        }
    })

}

function submit() {
    var demo = document.getElementById("AI");

    if (demo.innerText == "AI分析出牌") {
        var submit_data = {
            "id": localStorage.id,
            "card": localStorage.card
        }//todo
        console.log(JSON.stringify(submit_data));
        $.ajax({
            headers: {
                "X-Auth-Token": localStorage.token//此处放置请求到的用户token
            },
            type: "POST",
            dataType: "json",
            url: "https://api.shisanshui.rtxux.xyz/game/submit",
            // data: JSON.stringify(submit_data), //提交的数据todo
            data: JSON.stringify(
                {
                    "id": 12916,
                    "card": [
                        "#10 *3 *J",
                        "&4 &6 #A #5 #8",
                        "$K $A $9 $8 $2"
                    ]
                }
            ), //提交的数据todo
            contentType: "application/json;charset-UTF-8",
            success: function (result) {
                console.log(result); //打印服务端返回的数据(调试用)
                if (result.status == 0) {
                    console.log("出牌成功")
                };
            },
            error: function (res) {
                console.log(res);
                alert("出牌失败");
            }
        })
        demo.className = "submit_clicked";
        document.getElementById("AI").innerHTML = "回到主菜单";
        document.getElementById("card").className = "card_click"
    }
    else {
        window.location.href = "./menu.html";
    }

}

function history() {
    console.log(localStorage.getItem('token'));
    // window.location.href="./history.html"
}

function rank() {
    $.ajax({
        type: "GET",
        url: "https://api.shisanshui.rtxux.xyz/rank",
        contentType: "application/json;charset-UTF-8",
        success: function (result) {
            for (var i = 0; i < 5; i++) {
                document.getElementById("name" + i).innerText = result[i].name;
                document.getElementById("score" + i).innerText = result[i].score;
            }
            $('<div>').appendTo('body').addClass('alert alert-success').html('排行榜获取成功').show().delay(1500).fadeOut();
        },
        error: function (res) {
            console.log(res);
            alert("获取排行榜失败");
        }
    })
}

