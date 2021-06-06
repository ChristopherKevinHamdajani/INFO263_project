function pageFirstLoad(){
$("#loginImage").delay(100).fadeIn();
$("#schedule").delay(1000).slideUp();
$("#loginPageLoginBox").delay(1500).slideDown();

}


function incorrectLogin(){
    $("#loginImage").show();
    $("#schedule").hide();
    $("#loginPageLoginBox").show();
    $("#inputsDiv").slideUp();
    $("#loginAlert").delay(500).fadeIn();
    $("#inputsDiv").delay(1000).slideDown();

}
