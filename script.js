const showButton = document.getElementById("showButton");
const christmasMessage = document.getElementById("Merry");

showButton.addEventListener("click", function () {
  if (christmasMessage.style.display === "none") {
    christmasMessage.style.display = "block";
  } else {
    christmasMessage.style.display = "none";
  }
});
document.getElementById("closeButton").addEventListener("click", function () {
  document.getElementById("Merry").style.display = "block";
});


document.getElementById("showButton").addEventListener("click", function() {
    var guideInfo = document.getElementById("guideInfo");
    var button = document.getElementById("showButton");

    button.classList.add("hidden");

    guideInfo.classList.remove("hidden");
    guideInfo.classList.add("show");
});

document.getElementById("closeButton").addEventListener("click", function() {
    var guideInfo = document.getElementById("guideInfo");
    var button = document.getElementById("showButton");

    guideInfo.classList.remove("show");
    setTimeout(function() {
        guideInfo.classList.add("hidden");  
        button.classList.remove("hidden"); 
    }, 500); 
});

document.addEventListener("DOMContentLoaded", function () {
    var canvas = document.getElementById("cas");
    var ctx = canvas.getContext("2d");
  
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  
    resizeCanvas();
  
    window.addEventListener("resize", resizeCanvas);
  
    var listFire = [];
    var listFirework = [];
    var fireNumber = 10;
    var center = { x: canvas.width / 2, y: canvas.height / 2 };
    var range = 100;
  
    var isMobile = window.innerWidth <= 768;
  
    var fireSizeFactor = isMobile ? 2 : 1;
  
    for (var i = 0; i < fireNumber; i++) {
      var fire = {
        x: (Math.random() * range) / 2 - range / 4 + center.x,
        y: Math.random() * range * 2 + canvas.height,
        size: (Math.random() + 0.5) * fireSizeFactor,
        fill: "#fd1",
        vx: Math.random() - 0.5,
        vy: -(Math.random() + 4),
        ax: Math.random() * 0.02 - 0.01,
        far: Math.random() * range + (center.y - range),
        shape: Math.random() < 0.5 ? "circle" : "heart", 
      };
  
      fire.base = {
        x: fire.x,
        y: fire.y,
        vx: fire.vx,
      };
  
      listFire.push(fire);
    }
  
    function randColor() {
      var r = Math.floor(Math.random() * 256);
      var g = Math.floor(Math.random() * 256);
      var b = Math.floor(Math.random() * 256);
      return "rgb(" + r + "," + g + "," + b + ")";
    }
  
    function loop() {
      requestAnimationFrame(loop);
      update();
      draw();
    }
  
    function update() {
      for (var i = 0; i < listFire.length; i++) {
        var fire = listFire[i];
        if (fire.y <= fire.far) {
          var color = randColor();
          for (var j = 0; j < fireNumber * 5; j++) {
            var firework = {
              x: fire.x,
              y: fire.y,
              size: (Math.random() + 1.5) * fireSizeFactor,
              fill: color,
              vx: Math.random() * 5 - 2.5,
              vy: Math.random() * -5 + 1.5,
              ay: 0.05,
              alpha: 1,
              life: Math.round((Math.random() * range) / 2) + range / 2,
              shape: fire.shape, 
            };
  
            firework.base = {
              life: firework.life,
              size: firework.size,
            };
  
            listFirework.push(firework);
          }
          // reset
          fire.y = fire.base.y;
          fire.x = fire.base.x;
          fire.vx = fire.base.vx;
          fire.ax = Math.random() * 0.02 - 0.01;
        }
        fire.x += fire.vx;
        fire.y += fire.vy;
        fire.vx += fire.ax;
      }
  
      for (var i = listFirework.length - 1; i >= 0; i--) {
        var firework = listFirework[i];
        if (firework) {
          firework.x += firework.vx;
          firework.y += firework.vy;
          firework.vy += firework.ay;
          firework.alpha = firework.life / firework.base.life;
          firework.size = firework.alpha * firework.base.size;
          firework.alpha = firework.alpha > 0.6 ? 1 : firework.alpha;
          firework.life--;
          if (firework.life <= 0) {
            listFirework.splice(i, 1);
          }
        }
      }
    }
  
    function draw() {
      // clear
      var img = new Image();
      img.src = "image/tet.jpg";
  
      img.onload = function () {
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 0.18;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
  
      // re-draw
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = 1;
      for (var i = 0; i < listFire.length; i++) {
        var fire = listFire[i];
        ctx.beginPath();
        ctx.arc(fire.x, fire.y, fire.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = fire.fill;
        ctx.fill();
      }
  
      for (var i = 0; i < listFirework.length; i++) {
        var firework = listFirework[i];
  
        if (firework.shape === "circle") {
          ctx.beginPath();
          ctx.arc(firework.x, firework.y, firework.size, 0, Math.PI * 2);
          ctx.closePath();
          ctx.fillStyle = firework.fill;
          ctx.fill();
        } else if (firework.shape === "heart") {
          ctx.beginPath();
          ctx.moveTo(firework.x, firework.y);
          ctx.bezierCurveTo(
            firework.x - 3,
            firework.y - 3,
            firework.x - 3,
            firework.y + 3,
            firework.x,
            firework.y + 3
          );
          ctx.bezierCurveTo(
            firework.x + 3,
            firework.y + 3,
            firework.x + 3,
            firework.y - 3,
            firework.x,
            firework.y
          );
          ctx.closePath();
          ctx.fillStyle = firework.fill;
          ctx.fill();
        }
      }
    }
  
    loop();
  });
  