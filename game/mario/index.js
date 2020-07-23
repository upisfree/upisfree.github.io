var time = Date.now();

window.onkeypress = function(e) {
    startApp();
}

window.isVictory = false;

window.onload = function() {
    document.getElementById('startScreenMusic').volume = 0.75;
};

function startApp(restart) {
    window.onkeypress = null;
    window.isVictory = false;

    document.getElementById("startScreen").style.display = "none";
    document.getElementById("startScreenText").style.display = "none";
    document.getElementById("endScreen").style.display = "none";    
    document.getElementById("endCopyright").style.display = "none";    
    document.getElementById("loadScreen").style.display = "block";    

    document.getElementById('startScreenMusic').pause();

    $('#fotorama').show();

    if (!restart) {        
        window.fotoramaDiv = $('#fotorama').fotorama({
            width: '100%',
            height: '100%',
            nav: false,
            click: true,
            swipe: true,
            arrows: 'always',
            fit: 'scaledown'
        });

        window.fotorama = fotoramaDiv.data('fotorama');

        var UserWrapper = new UserWrappr.UserWrappr(FullScreenMario.FullScreenMario.prototype.proliferate(
        {
            "GameStartrConstructor": FullScreenMario.FullScreenMario
        }, FullScreenMario.FullScreenMario.settings.ui, true));

        // mobile
        setTimeout(function () {
            UserWrapper.GameStarter.TouchPasser.enable();
        });

        // перевод
        document.getElementsByClassName("FullScreenMario_value score")[0].childNodes[0].textContent = "очки";
        document.getElementsByClassName("FullScreenMario_value time")[0].childNodes[0].textContent = "время";
        document.getElementsByClassName("FullScreenMario_value world")[0].childNodes[0].textContent = "мир";
        document.getElementsByClassName("FullScreenMario_value world")[0].style.display = "none";
        document.getElementsByClassName("FullScreenMario_value coins")[0].childNodes[0].textContent = "монеты";
        document.getElementsByClassName("FullScreenMario_value coins")[0].style.display = "none";
        document.getElementsByClassName("FullScreenMario_value lives")[0].childNodes[0].textContent = "справки";
        document.getElementsByClassName("FullScreenMario_value lives")[0].style.display = "block";
    } else {
        FSM.AudioPlayer.clearAll();
        FSM.gameStart();
        FSM.ItemsHolder.displayContainer();
    }
};

function showEndImage() {
    if (window.isVictory) {
        document.getElementById("endImageWin").style.display = "block";
        document.getElementById("endImageFail").style.display = "none";
    } else {
        document.getElementById("endImageWin").style.display = "none";
        document.getElementById("endImageFail").style.display = "block";
    }
}

function showEndScreen() {
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("startScreenText").style.display = "none";
    document.getElementById("endScreen").style.display = "block";
    document.getElementById("endCopyright").style.display = "block";

    document.getElementById("endImageWin").style.display = "none";
    document.getElementById("endImageFail").style.display = "none";

    // if (!window.isVictory) {
    //     document.getElementById("vkAuthText").style.display = "none";
    //     document.getElementById("vkAuth").style.display = "none";
    //     // document.getElementsByClassName("startButton")[1].style.marginRight = "33%";
    // }
    // else {
    //     document.getElementById("vkAuthText").style.display = "block";
    //     document.getElementById("vkAuth").style.display = "block";
    //     // document.getElementsByClassName("startButton")[1].style.marginRight = "13%";
    // }
}