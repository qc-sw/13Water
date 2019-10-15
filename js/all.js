

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


////////    begin加入战局    ////////////////
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

////////    submit    ////////////////
function submit() {
    var tao="♠";//$
    var xin="♥";//&
    var hua="♣";//*
    var jiao="♦";//#
    var card_map={"$":"♣","&":"♥","*":"♣","#":"♦"}
    var index;
    var demo = document.getElementById("AI");

    if (demo.innerText == "AI分析出牌") {
        var submit_data = {
            "id": localStorage.id,
            "card": localStorage.card
        }//todo
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "http://47.101.140.66:80/handle/hello2",
            // data: JSON.stringify(submit_data), //提交的数据todo
            data: JSON.stringify(
                {
                    "id": parseInt(localStorage.id),
                    "card": localStorage.card
                }
            ),
            contentType: "application/json;charset-UTF-8",
            success: function (result) {
                console.log(result); //打印服务端返回的数据(调试用)
                localStorage.setItem("cards", result.card);
                y=-1;
                document.getElementById("card").childNodes.forEach(element => {
                    index=0;y+=1;
                    if(element.NodeType==1){
                        element.childNodes.forEach(res => {
                            index++;
                            if(res.NodeType==1){
                                res.innerHTML="&nbsp;"+result.card[Math.floor(y/2)][3*index-2]+"<span>"+map.card[Math.floor(y/2)][3*index-3]+"</span>"
                                
                            }
                        })
                    }
                });
                // .childNodes[i].innerHTML//todo将桌面的牌换掉

                document.getElementById("card").className = "card_click";
                $('<div>').appendTo('body').addClass('alert alert-success').html('AI分析完成').show().delay(1500).fadeOut();
            },
            error: function (res) {
                console.log(res);
                alert("AI失联...");
            }
        })
        // $.ajax({
        //     headers: {
        //         "X-Auth-Token": localStorage.token//此处放置请求到的用户token
        //     },
        //     type: "POST",
        //     dataType: "json",
        //     url: "https://api.shisanshui.rtxux.xyz/game/submit",
        //     // data: JSON.stringify(submit_data), //提交的数据todo
        //     data: JSON.stringify(
        //         {
        //             "id": 12916,
        //             "card": [
        //                 "#10 *3 *J",
        //                 "&4 &6 #A #5 #8",
        //                 "$K $A $9 $8 $2"
        //             ]
        //         }
        //     ), //提交的数据todo
        //     contentType: "application/json;charset-UTF-8",
        //     success: function (result) {
        //         console.log(result); //打印服务端返回的数据(调试用)
        //         if (result.status == 0) {
        //             console.log("出牌成功")
        //         };
        //     },
        //     error: function (res) {
        //         console.log(res);
        //         alert("出牌失败");
        //     }
        // })
        demo.className = "submit_clicked";
        document.getElementById("AI").innerHTML = "返回";
    }
    else {
        window.location.href = "./menu.html";
    }

}



////////    rank    ////////////////
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

////////    history    ////////////////
function history() {
    window.location.href = "./history.html"
}
//用于判断当前列表是否已经打开
var history_flag = {};
for (var i = 1; i < 300; i++) history_flag[i] = 0;


function test(obj) {
    var str = obj.parentNode.id;
    str = str.substring(7, str.length) //得到当前的序号
    if (history_flag[parseInt(str)] == 0) {
        $.ajax({
            headers: {
                "X-Auth-Token": localStorage.token //此处放置请求到的用户token
            },
            type: "GET",
            url: "https://api.shisanshui.rtxux.xyz/history/" + 12479,//todo 
            contentType: "application/json;charset-UTF-8",
            success: function (result) {
                var arr = result.data.detail
                if (arr.length > 0) {
                    xxx = '<p>'
                    arr.forEach(element => {
                        xxx += "<span style='color:cadetblue'>name:</span>" + element.name + "   <span style='color:cadetblue'>card:</span>" +
                         element.card + "	<span style='color:cadetblue'>score:</span>" +
                            element
                                .score + "<br>";
                    });
                    xxx += "</p>"
                }
                // document.getElementById("collapse5").childNodes[1].childNodes[1].innerText=JSON.stringify(result.data.detail);
                // console.log(obj.childNodes[1].innerText[8]);

                document.getElementById("collapse" + str).childNodes[1].innerHTML = xxx;
            },
            error: function (res) {
                console.log(res);
                alert("获取对战失败");
            }
        })
        history_flag[parseInt(str)] = 1;
    } else {
        history_flag[parseInt(str)] = 0;
    }
}