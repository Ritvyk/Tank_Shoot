//date : 18-feb 2020
var score = 0;
function getStoredScore()
{
    var score=JSON.parse(localStorage.getItem("upshoot_score"));
    return score.upshoot_score;
}
function seeHit() {
    var targets = document.querySelectorAll(".target");
    var bullets = document.querySelectorAll(".bullet");
    for (var i = 0; i < bullets.length; i++) {
        var tempBulletPos = bullets[i].getBoundingClientRect();
        for (var j = 0; j < targets.length; j++) {
            var tempTargetPos = targets[j].getBoundingClientRect();
            if ((tempBulletPos.x > tempTargetPos.x - 5 && tempBulletPos.x < tempTargetPos.x + 15) && (tempBulletPos.y > tempTargetPos.y - 5 && tempBulletPos.y < tempTargetPos.y + 15)) {
                document.getElementById("main-window").removeChild(targets[j]);
                document.getElementById("game-window").removeChild(bullets[i]);
                score += 5;
                document.getElementById("score").innerText = score;
            }
        }
    }

}
function checkNewHighScore()
{
    if(localStorage.getItem("upshoot_score")!=null)
    {
        var prevHScore=getStoredScore();
        if(prevHScore<score)
        {
            return true;
        }
        else{
            return false;
        }
    }
    else{
        return false;
    }
}
// seeHit();
function getID() {
    return (1 + Math.random() * 99271);
}
class UI {
    static getWindowHW() {
        var mainWindow = document.getElementById("game-window");
        var object = {
            width: mainWindow.clientWidth,
            height: mainWindow.clientHeight
        }
        return object;
    }
    static setUI()
    {
        if(localStorage.getItem("upshoot_score")!=null)
        {
            var score=JSON.parse(localStorage.getItem("upshoot_score"));
            document.getElementById("Hscore").innerText=score.upshoot_score;
        }
    }
    static SOUND(toPlay)
    {
        if(toPlay==="back")
        {
            var sound=document.getElementById("back_music");
            sound.volume=0.50;
            sound.play();
        }
    }
}
function shootSound()
{
    var sound=document.getElementById("shoot_music");
            sound.volume=0.75;
            sound.play();
}
class Player {
    static moveLeft() {
        var player = document.getElementById("player-model");
        var GW = UI.getWindowHW();
        var playerPos = UIControl.playerCurrentPosition();
        // console.log(playerPos);

        if (playerPos.x + 10 < GW.width - 20) {
            player.style.left = (playerPos.x + 15) + "px";
        }
    }
    static moveRight() {
        var player = document.getElementById("player-model");
        var GW = UI.getWindowHW();
        var playerPos = UIControl.playerCurrentPosition();
        // console.log(playerPos);

        if (playerPos.x > 10) {
            player.style.left = (playerPos.x - 35) + "px";
        }

    }
}
class Target {
    setPosition() {
        var MainWindowWidth = document.getElementById("game-window").clientWidth;
        var offsetLeft = (Math.random() * (MainWindowWidth - 30));
        return offsetLeft;
    }
    static createTarget() {
        var target = document.createElement("div");
        target.className = "target";
        target.id = getID();
        UI.newTargetId += 1;
        let T = new Target();
        target.style.left = T.setPosition() + "px";
        return target;
    }
}
class UIControl {

    fallDown(object) {
        var target = object;
        var down = 1;
        var gameOver=false;
        var GW = UI.getWindowHW();
        var dropInterval= setInterval(fall, 100);
        function fall() {
            if(gameOver)
            {
                clearInterval(dropInterval);
            }
            if (document.getElementById(target.id)) {
                target.style.top = down + "px";
                if (down + 30 > GW.height) {
                    document.getElementById("main-window").removeChild(target);
                    var notification = document.getElementById("notification");
                    notification.innerText = "Game Over!";
                    notification.style.display = "block";
                    var ifHighScored=checkNewHighScore();
                    if(ifHighScored)
                    {
                        var noti=document.createElement("p");
                        noti.innerText="New High Score!";
                        noti.className="text-center font-xm p-0 m-0 mt-1 d-block";
                        notification.appendChild(noti);
                    }
                    stopGame("stop");
                    gameOver=true;
                    clearInterval(dropInterval);
                    // window.location.reload();
                }
                down++;
            }
        }
       
    }
    fireBullet(object) {

        var bullet = object;
        // console.log(bullet.id);
        var GW = UI.getWindowHW();
        // console.log(GW);
        var up = 5;


        // console.log(bullet.getBoundingClientRect()); 
        // console.log();
        var fireInterval = setInterval(fire, 1);
        var bpos = Bullet.getBulletCurrentPostion(bullet);
        
        function fire() {
            seeHit();
            //checking if the bullet currently exists in the game window
            if (document.getElementById(bullet.id)) {
                bullet.style.top = (bpos.y - up) + "px";
                up += 2;
                if (up + 50 > GW.height) {
                    document.getElementById("game-window").removeChild(bullet);
                    //clearing the interval when bullet has reached above the game window...
                    clearInterval(fireInterval);
                }
            }
            //    console.log(up);
        }


    }
    static playerCurrentPosition() {
        var player = document.getElementById("player-model").getBoundingClientRect();
        var obj = {
            "x": player.x,
            "y": player.y
        }
        return obj;
    }
    static dropTarget() {
        var target = Target.createTarget();
        // console.log("droping")
        var mainWindow = document.getElementById("main-window");
        mainWindow.appendChild(target);
        var UI = new UIControl();
        UI.fallDown(target);
    }
    //shoot bullet
    static shootBullet() {
        var bullet = Bullet.createBullet();
        // console.log(bullet);
        var gameWindow = document.getElementById("game-window");
        gameWindow.appendChild(bullet);
        var UI = new UIControl();
        UI.fireBullet(bullet);
    }
}
class Bullet {

    setBulletPosition() {
        var playerPos = UIControl.playerCurrentPosition();
        // console.log(playerPos);
        var obj = {
            "x": playerPos.x + 8,
            "y": playerPos.y - 8
        }
        return obj;
    }
    static getBulletCurrentPostion(bulletObj) {
        var bulletPos = bulletObj.getBoundingClientRect();
        var obj = {
            "x": bulletPos.x,
            "y": bulletPos.y
        }
        return obj;
    }
    static createBullet() {
        var bullet = document.createElement("div");
        bullet.className = "bullet";
        bullet.id = getID();
        UI.newBulletId += 1;
        var b = new Bullet();
        var positions = b.setBulletPosition()
        bullet.style.top = positions.y + "px";
        bullet.style.left = positions.x + "px";
        return bullet;
    }
}
//window vars
var gameFlag=true;
function startGame(action=false) {
    //droping a random target after 1.5 sec...
        if(gameFlag)
        {
            var running=setInterval(UIControl.dropTarget, 2500);
        }
}
function stopGame(action)
{
    if(action==="stop")
    {
        var finalScore=score;
        var obj={
            "upshoot_score":finalScore
        }
        if(localStorage.getItem("upshoot_score")!=null)
        {
            var hscore=JSON.parse(localStorage.getItem("upshoot_score"));
            if(hscore.upshoot_score<finalScore)
            {
                localStorage.setItem("upshoot_score",JSON.stringify(obj));
            }
        }
        else{
            localStorage.setItem("upshoot_score",JSON.stringify(obj));
        }
        document.getElementById("game-window").innerText="";
    }
}
document.body.onkeypress = function (e) {
    if (e.keyCode == 32) {
        shootSound();
        UIControl.shootBullet();
    }
    else if (e.keyCode == 100) {
        Player.moveLeft();
        // console.log("left")
    }
    else if (e.keyCode == 97) {
        Player.moveRight();
        // console.log("right")
    }
}
document.getElementById("remote").addEventListener("click", function (e) {
    if (e.target.classList.contains("action")) {
        if (e.target.classList.contains("moveleft")) {

            Player.moveRight();
            // console.log("left");

        }
        else if (e.target.classList.contains("shoot")) {
            shootSound();
            UIControl.shootBullet();
        }
        else if (e.target.classList.contains("moveright")) {

            Player.moveLeft();
            // console.log("right")
        }
        else if (e.target.classList.contains("startgame")) {
            document.getElementById("notification").style.display = "none";
            UI.SOUND("back");
            startGame();
        }
        else if (e.target.classList.contains("reload")) {
            window.location.reload();
        }
    }
})
UI.setUI();
