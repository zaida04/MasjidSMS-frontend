var ur1;
var ur2;
var ur3;
var CaptchaCallback = function () {
    grecaptcha.render(document.getElementById("captcha1"), { 'sitekey': '6Lcz_M0UAAAAAG25qGNtnxTf6N2gLQapXTPK_YDS' })
    grecaptcha.render(document.getElementById("captcha2"), { 'sitekey': '6Lcz_M0UAAAAAG25qGNtnxTf6N2gLQapXTPK_YDS' })
    grecaptcha.render(document.getElementById("captcha3"), { 'sitekey': '6Lcz_M0UAAAAAG25qGNtnxTf6N2gLQapXTPK_YDS' })
    grecaptcha.render(document.getElementById("captcha4"), { 'sitekey': '6Lcz_M0UAAAAAG25qGNtnxTf6N2gLQapXTPK_YDS' })
}
function changeur1(ob) {
    ur1 = "#{url}/api/sms/smslist/" + ob.value + "/sendText";
}
function changeur2(ob) {
    ur2 = "#{url}/api/sms/smslist/" + ob.value + "/add";
}
function changeur3(ob) {
    ur3 = "#{url}/api/sms/smslist/" + ob.value + "/users"
}
function fos(ob) {
    document.getElementById("ca").action = "#{url}/api/users/create" + ob.value;
    console.log(document.getElementById("ca").action);
}
function dimb() {
    document.getElementById("ovl").style.display = "block";
    document.getElementById("midoc").style.display = "block";
}
function undim() {
    document.getElementById("ovl").style.display = "none";
    document.getElementById("midoc").style.display = "none";
}
$(document).ready(function () {
    $('#usl3').click(() => {
        fetch(ur3 + '?token=#{user.token}', { "method": "GET", "mode": 'cors' })
            .then(res => res.json())
            .then(json => {
                json.users.forEach(e => {
                    dimb();
                })
            })
    })
    $('#sendst').click(function () {
        $.post(ur1, $('#st').serialize(), function (data, status) {
            console.log(data);
            console.log(status);
            if (data.status == 200) {
                document.getElementById("succ").children[1].innerHTML = "Successfully sent text to SMSList. Refresh the page to be able to do it again"
                $("#succ").show();
                $("#stcont").hide();
            } else {
                document.getElementById("err").children[1].innerHTML = 'Unsuccessfully sent text to SMSList, error: ' + data.error.description;
                $("#err").show();
            }
            $('html,body').scrollTop(0);
        });
    });
    $('#sendusn').click(function () {
        $.post(ur2, $('#demofm').serialize(), function (data, status) {
            console.log(data);
            if (data.status == 201) {
                document.getElementById("succ").children[1].innerHTML = "Successfully added user to SMSList";
                $("#succ").show();
                $("#sgnup").hide();
            } else {
                document.getElementById("err").children[1].innerHTML = 'Unsuccessfully added user to SMSList, error: ' + data.error.description;
                $("#err").show();
            }
            $('html,body').scrollTop(0);
        });
    });
    $('#slc2').click(function () {
        $.post('#{url}/api/sms/smslist/create', $('#slc1').serialize(), function (data, status) {
            console.log(data);
            if (data.status == 201) {
                document.getElementById("succ").children[1].innerHTML = "Successfully created SMSList";
                $("#succ").show();
                $("#scl").hide();
            } else {
                document.getElementById("err").children[1].innerHTML = 'Unsuccessfully created SMSList, error: ' + data.error.description;
                $("#err").show();
            }
            $('html,body').scrollTop(0);
        });
    });
});
window.onload = () => {
    document.getElementById('loading').style.block = "block";
    fetch(back1 + '/api/sms/smslist/smslists?token=' + tok, { "method": "GET", "mode": 'cors' })
        .then(res => res.json())
        .then(json => {
            console.log(json.smslists.length);
            for (i = 0; i < json.smslists.length; i++) {
                var opt = document.createElement("option");
                opt.text = json.smslists[i].name;
                opt.value = json.smslists[i].name;
                document.getElementById("demo1").add(opt);
            }
            for (i = 0; i < json.smslists.length; i++) {
                var opt = document.createElement("option");
                opt.text = json.smslists[i].name;
                opt.value = json.smslists[i].name;
                document.getElementById("demosn").add(opt);
            }
            for (i = 0; i < json.smslists.length; i++) {
                var opt = document.createElement("option");
                opt.text = json.smslists[i].name;
                opt.value = json.smslists[i].name;
                document.getElementById("usl2").add(opt);
            }
        })
        .then(() => {
            document.getElementById("loading").style.visibility = "hidden";
            document.getElementById("app").style.visibility = "visible";
        })
}
