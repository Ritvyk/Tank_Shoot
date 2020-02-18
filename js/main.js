//date : 18-feb 2020
var score = 0;
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
        var GW = UI.getWindowHW();
        function fall() {
            //checking if the bullet has struck to a target
            // var bulletPos=Bullet.getBulletCurrentPostion();
            // var targetPos=target.getBoundingClientRect();
            // if(bulletPos.x===targetPos.x)
            // {
            //     console.log("HIT");
            // }
            if (document.getElementById(target.id)) {
                target.style.top = down + "px";
                if (down + 30 > GW.height) {
                    document.getElementById("main-window").removeChild(target);
                    var notification=document.getElementById("notification");
                    notification.innerText="Game Over!";
                    notification.style.display="block";
                    alert("Game Over!");
                    window.location.reload();
                }
                down++;
            }
        }
        setInterval(fall, 100);
    }
    fireBullet(object) {
        var bullet = object;
        // console.log(bullet.id);
        var GW = UI.getWindowHW();
        // console.log(GW);
        var up = 5;


        // console.log(bullet.getBoundingClientRect()); 
        // console.log();
        var bpos = Bullet.getBulletCurrentPostion(bullet);
        function fire() {
            seeHit();
            //checking if the bullet currently exists in the game window
            if (document.getElementById(bullet.id)) {
                bullet.style.top = (bpos.y - up) + "px";
                up += 2;
                if (up + 50 > GW.height) {
                    document.getElementById("game-window").removeChild(bullet);
                }
            }
            //    console.log(up);
        }
        setInterval(fire, 1);

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

function startGame() {
    //droping a random target after 1.5 sec...
    // UIControl.dropTarget();
    setInterval(UIControl.dropTarget, 1500);
}
document.body.onkeypress = function (e) {
    if (e.keyCode == 32) {
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

            UIControl.shootBullet();
        }
        else if (e.target.classList.contains("moveright")) {

            Player.moveLeft();
            // console.log("right")
        }
        else if (e.target.classList.contains("startgame")) {
            document.getElementById("notification").style.display = "none";
            startGame();
        }
        else if (e.target.classList.contains("reload")) {
            window.location.reload();
        }
    }
})
// startGame();