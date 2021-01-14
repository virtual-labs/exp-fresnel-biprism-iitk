var v = 0;
var u = 0;
var h1 = 0;
var h2 = 0;
var f = 150;
var fw = 0;
var wl = 589.3;
var d1 = 342.86;
var d2 = 75;
var d = 0;

//update the x and y coordinate
var update = function(x, y) {
    var tempX = document.getElementById("mouseX");
    var tempY = document.getElementById("mouseY");
    if (tempX && tempY) {
        tempX.innerHTML = x;
        tempY.innerHTML = y;
    }
};

var Terminal = function() {
    this.obj = document.getElementById("terminal");
    this.obj.innerHTML = ">>";
    this.update = function(str) {
        this.value = this.obj.innerHTML;
        this.value += str + "<br>>>";
        this.obj.innerHTML = this.value;
        this.obj.scrollTo(0, this.obj.scrollHeight);
    }
    this.reset = function() {
        this.obj.innerHTML = ">>";
    }
};

var getMousePos = function(canvas, e) {
    var boundingClientRect = canvas.getBoundingClientRect();
    var tx = e.clientX - boundingClientRect.left;
    var ty = e.clientY - boundingClientRect.top;
    return {
        x: tx < 0 ? 0 : tx,
        y: ty < 0 ? 0 : ty
    };
};

var Simulation = function() {
    this.start = function() {
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].getAttribute("vlab-action") == "START_SIMULATOR") {
                buttons[i].classList.add("disabled");
                buttons[i].setAttribute("disabled", "true");
                continue;
            }
            buttons[i].classList.remove("disabled");
            buttons[i].removeAttribute("disabled");
        }
        terminal.update("Simulator Started");
    }
    this.stop = function() {
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].getAttribute("vlab-action") == "START_SIMULATOR") {
                buttons[i].classList.remove("disabled");
                buttons[i].removeAttribute("disabled");
                continue;
            }
            buttons[i].classList.add("disabled");
            buttons[i].setAttribute("disabled", "true");
        }
        terminal.update("Simulator Stopped");
    }
}

var Canvas = function(id) {
    this.id = id;
    this.obj = document.getElementById(this.id);
    this.parent = this.obj.parentElement;
    this.width = this.parent.clientWidth;
    this.height = this.parent.clientHeight;
    this.obj.setAttribute("width", this.width);
    this.obj.setAttribute("height", this.height);
    this.context = this.obj.getContext('2d');
    this.clear = function() {
        this.context.clearRect(0, 0, canvas.width, canvas.height);
    }
    this.reset = function() {
        canvas.clear();
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].getAttribute("vlab-action") == "START_SIMULATOR") {
                continue;
            }
            buttons[i].classList.remove("disabled");
            buttons[i].removeAttribute("disabled");
        }
    }
}

window.onload = function() {
    window.terminal = new Terminal();
    window.simulation = new Simulation();
    window.canvas = new this.Canvas("myCanvas");
    window.buttons = this.document.getElementsByClassName("btn");
    window.lineimg = document.getElementById("lineimg");
    window.eyeimg = document.getElementById("eyeimg");
    window.lensimg = document.getElementById("lensimg");
    simulation.stop();
    document.getElementById("reset").addEventListener("click", function() {
        terminal.update("Reset Done..");
        canvas.reset();
    });
    document.getElementById("poweron").addEventListener("click", simulation.start);
    document.getElementById("poweroff").addEventListener("click", function() {
        canvas.clear();
        terminal.reset();
        simulation.stop();
    });

    this.document.addEventListener("mousedown", function(e) {
        var tempPos = getMousePos(window.canvas.obj, e);
        update(tempPos.x, tempPos.y);
        if (typeof mouseLeftDown === "function") {
            if (e.button == 0)
                mouseLeftDown(tempPos.x, tempPos.y);
        }
    }, false);

    this.document.addEventListener("mousemove", function(e) {
        var tempPos = getMousePos(window.canvas.obj, e);
        update(tempPos.x, tempPos.y);
        if (typeof mouseMove === "function") {
            mouseMove(tempPos.x, tempPos.y);
        }
    }, false);

    document.getElementById("bench").addEventListener("click", function() {
        bench();
        document.getElementById("bench").classList.add("disabled");
        document.getElementById("bench").setAttribute("disabled", "true");
    });

    document.getElementById("lsource").addEventListener("click", function() {
        lsource();
        document.getElementById("lsource").classList.add("disabled");
        document.getElementById("lsource").setAttribute("disabled", "true");
    });

    document.getElementById("biprism").addEventListener("click", function() {
        biprism();
        document.getElementById("biprism").classList.add("disabled");
        document.getElementById("biprism").setAttribute("disabled", "true");
    });

    document.getElementById("eyepiece").addEventListener("click", function() {
        eyepiece();
        terminal.update("Distance B/W the slit and the eyepiece (D) = 630 cm");
        document.getElementById("eyepiece").classList.add("disabled");
        document.getElementById("eyepiece").setAttribute("disabled", "true");
    });

    document.getElementById("lens").addEventListener("click", function() {
        window.lx = 50;
        window.ly = 259;
        lens(lx, ly);
        document.getElementById("bench").classList.add("disabled");
        document.getElementById("bench").setAttribute("disabled", "true");
        document.getElementById("eyepiece").classList.add("disabled");
        document.getElementById("eyepiece").setAttribute("disabled", "true");
        document.getElementById("lsource").classList.add("disabled");
        document.getElementById("lsource").setAttribute("disabled", "true");
        document.getElementById("biprism").classList.add("disabled");
        document.getElementById("biprism").setAttribute("disabled", "true");
        document.getElementById("lens").classList.add("disabled");
        document.getElementById("lens").setAttribute("disabled", "true");
    });

    document.getElementById("add").addEventListener("click", function() {
        canvas.clear();
        lsource();
        bench();
        eyepiece();
        biprism();
        fringe();
        if ((lx >= 300)) {
            terminal.update("You can't move the Lens A further..");
        } else {
            lx += 10;
        }
        lens(lx, ly);
        draw();
    });

    document.getElementById("sub").addEventListener("click", function() {
        canvas.clear();
        lsource();
        bench();
        eyepiece();
        biprism();
        fringe();
        if ((lx <= -70)) {
            terminal.update("You can't move the Lens A further..");
        } else {
            lx -= 10;
        }
        lens(lx, ly);
        draw();
    })
}

function lens(x, y) {
    canvas.context.drawImage(lensimg, x + 201, y - 102, 200, 204);
    canvas.context.font = "16px Inter";
    canvas.context.fillStyle = "black";
    canvas.context.fillText("Lens", x + 275, 390);
}

function biprism() {
    canvas.context.beginPath();
    canvas.context.moveTo(100, 161);
    canvas.context.lineTo(170, 259);
    canvas.context.lineTo(100, 359);
    canvas.context.lineTo(100, 161);
    canvas.context.lineWidth = 2;
    canvas.context.strokeStyle = "black"
    canvas.context.stroke();
    canvas.context.font = "16px Inter";
    canvas.context.fillStyle = "black";
    canvas.context.fillText("Bi-Prism", 95, 390);
}

function bench() {
    canvas.context.beginPath();
    canvas.context.moveTo(49, 259);
    canvas.context.lineTo(851, 259);
    canvas.context.strokeStyle = "black"
    canvas.context.lineWidth = 5;
    canvas.context.stroke();
    canvas.context.font = "18px Inter";
    canvas.context.fillStyle = "black";
    canvas.context.fillText("0", 43, 295);

    for (var i = 0, j = 8; i <= 805; i += 10) {
        if (i % 50 === 0) {
            if (!(i >= 300 && i <= 220)) {
                canvas.context.beginPath();
                canvas.context.moveTo(50 + i, 259);
                canvas.context.lineTo(50 + i, 259 + j + j);
                canvas.context.strokeStyle = "black";
                canvas.context.lineWidth = 2;
                canvas.context.stroke();
                canvas.context.closePath();
            }
        } else {
            canvas.context.beginPath();
            canvas.context.moveTo(50 + i, 259);
            canvas.context.lineTo(50 + i, 259 + j);
            canvas.context.strokeStyle = "black";
            canvas.context.lineWidth = 1;
            canvas.context.stroke();
            canvas.context.closePath();
        }
    }
}

function eyepiece() {
    canvas.context.drawImage(eyeimg, 725, 158, 130, 201);
    canvas.context.font = "16px Inter";
    canvas.context.fillStyle = "black";
    canvas.context.fillText("Eyepiece", 755, 390);
}

function lsource() {
    canvas.context.drawImage(lineimg, -33, 167, 130, 180);
    canvas.context.font = "16px Inter";
    canvas.context.fillStyle = "black";
    canvas.context.fillText("2d", 7, 265);
    canvas.context.font = "14px Inter";
    canvas.context.fillText("S1", 40, 166);
    canvas.context.fillText("S2", 40, 361);
    //canvas.context.fillText("Light Source", 809, 390);
}

function draw() {
    u = lx + 270;
    v = u * f / (u - f);
    h1 = (80 * (-1 * v)) / u;
    var a = (ly - h1) - (ly + h1);
    d = Math.sqrt(d1 * d2);
    var wlc = parseFloat((wl * Math.pow(10, -7)).toFixed(8));
    console.log(wlc);
    console.log(typeof(wlc));
    fw = (wlc * 630) / d;

    canvas.context.beginPath();
    canvas.context.moveTo(50, 179);
    canvas.context.lineTo(lx + 319, 179);
    canvas.context.lineTo(50 + u + v, ly - h1);
    canvas.context.strokeStyle = "purple";
    canvas.context.lineWidth = 3;
    canvas.context.stroke();
    canvas.context.closePath();

    canvas.context.beginPath();
    canvas.context.moveTo(50, 179);
    canvas.context.lineTo(50 + u + v, ly - h1);
    canvas.context.strokeStyle = "purple";
    canvas.context.lineWidth = 3;
    canvas.context.stroke();
    canvas.context.closePath();

    canvas.context.beginPath();
    canvas.context.moveTo(50 + u + v, 259);
    canvas.context.lineTo(50 + u + v, ly - h1 - 5);
    canvas.context.strokeStyle = "red"
    canvas.context.lineWidth = 4;
    canvas.context.stroke();
    canvas.context.closePath();

    canvas.context.beginPath();
    canvas.context.moveTo(50 + u + v, ly - h1);
    canvas.context.lineTo(45 + u + v, ly - h1 - 8);
    canvas.context.lineTo(55 + u + v, ly - h1 - 8);
    canvas.context.lineTo(50 + u + v, ly - h1);
    canvas.context.strokeStyle = "red"
    canvas.context.lineWidth = 1;
    canvas.context.fillStyle = "red";
    canvas.context.fill();
    canvas.context.stroke();
    canvas.context.closePath();

    canvas.context.beginPath();
    canvas.context.moveTo(50, 339);
    canvas.context.lineTo(lx + 319, 339);
    canvas.context.lineTo(50 + u + v, ly + h1);
    canvas.context.strokeStyle = "grey";
    canvas.context.lineWidth = 3;
    canvas.context.stroke();
    canvas.context.closePath();

    canvas.context.beginPath();
    canvas.context.moveTo(50, 339);
    canvas.context.lineTo(50 + u + v, ly + h1);
    canvas.context.strokeStyle = "grey";
    canvas.context.lineWidth = 3;
    canvas.context.stroke();
    canvas.context.closePath();

    canvas.context.beginPath();
    canvas.context.moveTo(50 + u + v, 259);
    canvas.context.lineTo(50 + u + v, ly + h1 + 5);
    canvas.context.strokeStyle = "red"
    canvas.context.lineWidth = 4;
    canvas.context.stroke();
    canvas.context.closePath();

    canvas.context.beginPath();
    canvas.context.moveTo(50 + u + v, ly + h1);
    canvas.context.lineTo(45 + u + v, ly + h1 + 8);
    canvas.context.lineTo(55 + u + v, ly + h1 + 8);
    canvas.context.lineTo(50 + u + v, ly + h1);
    canvas.context.strokeStyle = "red"
    canvas.context.lineWidth = 1;
    canvas.context.fillStyle = "red";
    canvas.context.fill();
    canvas.context.stroke();
    canvas.context.closePath();

    if (u <= 300) {
        terminal.update("Distance b/w two image formed by lens at 1st position (d1)=" + a.toFixed(2) + " cm");

    } else {
        terminal.update("Distance b/w two image formed by lens at 2nd position (d2)=" + a.toFixed(2) + " cm");
    }

    if (a.toFixed(2) == d1 || a.toFixed(2) == d2) {
        for (i = 410; i < 580; i += 10) {
            canvas.context.beginPath();
            canvas.context.moveTo(i, 15);
            canvas.context.lineTo(i, 115);
            canvas.context.lineWidth = 3;
            canvas.context.strokeStyle = "yellow";
            canvas.context.stroke();
            canvas.context.closePath();
        }
        terminal.update("Fringe Width = " + fw.toFixed(5) + " cm");
    }
}

function fringe() {
    canvas.context.fillStyle = "rgb(94, 0, 0)";
    canvas.context.fillRect(400, 15, 180, 100);
    canvas.context.font = "16px Inter";
    canvas.context.fillStyle = "black";
    canvas.context.fillText("Fringe Pattern", 440, 135);
    canvas.context.closePath();
}

function calcwl() {

    var fw1 = parseFloat(document.getElementById('fw1').value);
    var fw2 = parseFloat(document.getElementById('fw2').value);
    var fw3 = parseFloat(document.getElementById('fw3').value);
    var fw4 = parseFloat(document.getElementById('fw4').value);
    var fw5 = parseFloat(document.getElementById('fw5').value);

    var d1 = parseFloat(document.getElementById('2d1').value);
    var d2 = parseFloat(document.getElementById('2d2').value);
    var d3 = parseFloat(document.getElementById('2d3').value);
    var d4 = parseFloat(document.getElementById('2d4').value);
    var d5 = parseFloat(document.getElementById('2d5').value);

    var D1 = parseFloat(document.getElementById('D1').value);
    var D2 = parseFloat(document.getElementById('D2').value);
    var D3 = parseFloat(document.getElementById('D3').value);
    var D4 = parseFloat(document.getElementById('D4').value);
    var D5 = parseFloat(document.getElementById('D5').value);

    var x1 = parseFloat(parseFloat((fw1 * d1) / D1).toFixed(8));
    var x2 = parseFloat(parseFloat((fw2 * d2) / D2).toFixed(8));
    var x3 = parseFloat(parseFloat((fw3 * d3) / D3).toFixed(8));
    var x4 = parseFloat(parseFloat((fw4 * d4) / D4).toFixed(8));
    var x5 = parseFloat(parseFloat((fw5 * d5) / D5).toFixed(8));
    window.x6 = ((x1 + x2 + x3 + x4 + x5) / 5).toFixed(8);

    document.getElementById('wl1').innerHTML = x1;
    document.getElementById('wl2').innerHTML = x2;
    document.getElementById('wl3').innerHTML = x3;
    document.getElementById('wl4').innerHTML = x4;
    document.getElementById('wl5').innerHTML = x5;
    document.getElementById('meanwl').innerHTML = window.x6;
}

function verifywl() {
    var meanv = parseFloat(window.x6);
    var wlf = parseFloat((wl * Math.pow(10, -7)).toFixed(8));
    var perError = 100 * (wlf - meanv) / wlf;
    document.getElementById('verify').innerHTML = "Percentage Error : " + perError.toFixed(2) + "%";
    terminal.update("Percentage Error : " + perError.toFixed(2) + "%");
}