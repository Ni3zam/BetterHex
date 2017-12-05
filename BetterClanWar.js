$(document).ready(function () {
    loadDialog();
    if(localStorage.getItem("ddosActive") == "true"){
        audoDDoSStart();
    }
});

function loadDialog() {
    $.ajax({
        url: "https://cdn.logfro.de/main.html",
        type: "GET",
        success: function (data) {
            $("body").append(data);
        },
        error: function () {
            loadDialog();
        }
    });
}

function runAttacker (victimIP){
    localStorage.setItem("victimIP",victimIP);
}

function audoDDoSStart(){
    var victim = localStorage.getItem("victimIP");
    if(window.location.href == "https://legacy.hackerexperience.com/list?action=ddos"){
        if(document.getElementsByClassName("ddos_form").length > 0){
            document.getElementsByName("ip")[0].value = victim;
            document.getElementsByClassName("ddos_form")[0].submit();
        } else {
            $(document).ready(function(){
                setTimeout(function(){
                    var a = $(".elapsed")[0].innerText;
                    a = a.replace("h","");
                    a = a.replace("m","");
                    a = a.replace("s","");
                    a = a.split(':');
                    var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]) * 1000 + 1000;
                    console.log(seconds);
                    setTimeout(function(){
                        console.log("run");
                        window.location = "https://legacy.hackerexperience.com/list?action=ddos";
                    },seconds);
                },500);
            });
        }
    }

    if(window.location.href == "https://legacy.hackerexperience.com/software"){
        window.location = "https://legacy.hackerexperience.com/list?action=ddos";
    }
}

function reset(){
    localStorage.removeItem("victimIP");
    localStorage.removeItem("ddosActive");
}
function runVictim (){

}