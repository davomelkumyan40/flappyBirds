(function() {
    const birdElem = document.querySelector("#bird");
    const bgImages = [...document.querySelectorAll(".bgImg")];
    const grounds = [...document.querySelectorAll(".ground")];
    const headstone = document.querySelector(".headstone");
    const debugOverlay = document.querySelector(".dContainer");
    const pipePairs = [...document.querySelectorAll(".pair")];
    const debugWindow = document.querySelector("#debugWindow");
    const groundHeight = 170;
    const screen = { height: 720, width: 480 };
    let debugProps = [];
    let gameIsOver = false;
    let gameStarted = false;
    let threadId = 0;
    let keyPressed = undefined;
    let score = 0;
    let coins = 0;
    let pipeY = 85;
    let isDebugMode = false;
    const rand = function(min, max){
        return Math.floor(Math.random() * (max - min)) + min;
    }


    function Bird(){
        this.y = 0;
        this.angle = 0;
        this.inertia = 0;
        this.fallRatio = -9;
        this.fallDistance = 13;
        this.isFalling = false;
        this.speed = 2;

        this.bind = function(screenObj){
            this.y = screenObj.height * 48 / 100;
        }

        this.calculatePhsycs = function(){
            if(this.isFalling)
                this.inertia += 0.5;
            else 
                this.inertia = 0;
        }

        this.fallDown = function(){
            let totalFallDistance = (this.fallDistance + this.inertia);
            if(totalFallDistance)
                this.y -= totalFallDistance / 2;
        }

        this.flyUp = function(){
            this.y += 110;
        }

        this.startFalling = function (){
            this.isFalling = true;
            this.fallDistance = 12;
        }
    
        this.stopFalling = function (){
            this.fallDistance = 0;
            this.isFalling = false;
        }

        this.isDead = function(){
            if(this.y <= groundHeight){
                this.y = groundHeight;
                this.y -= this.inertia + this.fallRatio;
                this.fallRatio = 0;
                if(this.y <= groundHeight - 20){
                    headstone.classList.add("headstoneMoveUp");
                }
                return true;
            }
            return false;
        }
    }

    let bird = new Bird();
    bird.bind(screen);

    function stopGame(){
        clearInterval(threadId);
        gameStarted = false;
        // birdElem.classList.add("upAngle");
        bgImages.forEach((e) => {
            e.classList.add("bgPauseAnim");
        });
        grounds.forEach((e) => {
            e.classList.add("groundPauseAnim");
        });
        birdElem.classList.remove("floatBird");
        birdElem.style.backgroundImage = "url('./Assets/bird_noanim.png')";
    }

    function resetGame(){
        headstone.classList.remove("headstoneMoveUp");
        // birdElem.classList.remove("upAngle");
        birdElem.classList.remove("downAngle");
        birdElem.style.backgroundImage = "url('./Assets/bird.gif')";
        bird = new Bird();
        bird.bind(screen);
        gameIsOver = false;
        bgImages.forEach((e) => {
            e.classList.remove("bgPauseAnim");
        });
        grounds.forEach((e) => {
            e.classList.remove("groundPauseAnim");
        });
        birdElem.classList.add("floatBird");
    }

    function debugModeToggle(){
        isDebugMode = !isDebugMode;
        birdElem.classList.toggle("debugMode");
        debugWindow.classList.toggle("debugOverlay");
        pipePairs.forEach((e, i, a) => {
            e.childNodes.forEach((e, i, a) => e.classList && e.classList.toggle("debugMode"));
        });
    }

    //TODO test remove in end
    document.querySelector(".window").addEventListener("click", () => {
        stopGame();
        resetGame();
        render();
    });

    function render(){
        birdElem.style.bottom = `${bird.y}px`;
        if(isDebugMode){
            debugOverlay.innerHTML = ""; 
            for(let i = 0; i < debugProps.length; i++){
                let p = document.createElement("p");
                let tn = document.createTextNode(debugProps[i]);
                p.appendChild(tn);
                debugOverlay.appendChild(p);
            }
        }
    }

    setInterval(() => {
        if(isDebugMode){
            debugProps = [
                `Y: ${bird.y.toFixed(3)}`,
                `Pipe Pair Y: ${pipeY}`,
                `Bird height: ${(bird.y - groundHeight).toFixed(3)}`,
                `Inertion value: ${bird.inertia}`,
                `Ground heigh: ${groundHeight}`,
                `Height: ${screen.height}px`,
                `Width: ${screen.width}px`,
                `Key pressed: ${keyPressed}`,
                `Game is over: ${gameIsOver}`,
                `Speed value : ${bird.speed}`,
                `Score: ${score}`, /*TODO*/
                `Coins: ${coins}` /*TODO*/
            ];
        }
        render();
    }, 10);
    
    //TODO upNose finish
    window.addEventListener("keydown", function(e) {
        keyPressed = e.key;
        keyPressed = keyPressed.replace(" ", "Space");
        switch (e.key.toLowerCase()) {
            case ' ':
                if(!gameIsOver){
                    bird.stopFalling();
                    birdElem.style.transition = "all 0.25s";
                    // birdElem.classList.add("upNose");
                    birdElem.classList.add("upAngle");
                    birdElem.classList.remove("downAngle");
                    bird.flyUp();
                    if(!gameStarted){
                        birdElem.classList.remove("floatBird");
                        threadId = setInterval(() => {
                            if(!gameIsOver){   
                                bird.calculatePhsycs();
                                bird.fallDown();
                                bird.fallDown();
                                gameIsOver = bird.isDead();
                            } else stopGame();
                        }, 20);
                        gameStarted = true;
                    }
                }
                break;
            case "f8":
                debugModeToggle();
                break;
        }
    });

    birdElem.addEventListener("transitionend", function(){
        this.style.transition = "all 0.1s";
        if(gameStarted){
            bird.startFalling();
            // birdElem.classList.remove("upNose");
            birdElem.classList.remove("upAngle");
            birdElem.classList.add("downAngle");
        }
    });


    setTimeout(() => {

    }, 5);

})();