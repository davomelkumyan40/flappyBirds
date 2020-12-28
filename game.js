(function() {
    const birdElem = document.querySelector("#bird");
    const bgImages = [...document.querySelectorAll(".bgImg")];
    const ground = document.querySelector(".ground");
    const headstone = document.querySelector(".headstone");
    const debugOverlay = document.querySelector("#debugWindow");
    let debugPropsElems = [...debugOverlay.querySelectorAll("p")];
    let debugProps = {};
    let gameIsOver = false;
    let gameStarted = false;
    const screen = { height: 720, width: 480 };
    let threadId = 0;
    const groundHeight = 170;
    let keyPressed = undefined;


    function Bird(){
        this.y = 0;
        this.angle = 0;
        this.inertia = 0;
        this.fallRatio = -9;
        this.fallDistance = 13;
        this.isFalling = false;

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
                if(this.y <= groundHeight - 43){
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
        bgImages.forEach((e) => {
            e.classList.add("bgPauseAnim");
        });
        ground.classList.remove("movingGround");
        birdElem.classList.remove("floatBird");
        birdElem.style.backgroundImage = "url('./Assets/bird_noanim.png')";
    }

    function resetGame(){
        headstone.classList.remove("headstoneMoveUp");
        birdElem.classList.remove("upAngle");
        birdElem.classList.remove("downAngle");
        birdElem.style.backgroundImage = "url('./Assets/bird.gif')";
        bird = new Bird();
        bird.bind(screen);
        gameIsOver = false;
        bgImages.forEach((e) => {
            e.classList.remove("bgPauseAnim");
        });
        ground.classList.add("movingGround");
        birdElem.classList.add("floatBird");
    }

    function debugModeToggle(){
        birdElem.classList.toggle("debugMode");
        debugOverlay.classList.toggle("debugOverlay");
    }

    //TODO test remove in end
    document.querySelector(".window").addEventListener("click", () => {
        stopGame();
        resetGame();
        render();
    });

    function render(){
        birdElem.style.bottom = `${bird.y}px`;
        debugPropsElems.forEach((e, i, a) => {
            e.innerHTML = debugProps[i];
        });
    }

    setInterval(() => {
        debugProps = [
            `Y: ${bird.y.toFixed(3)}`,
            `Bird height: ${(bird.y - groundHeight).toFixed(3)}`,
            `Inertion value: ${bird.inertia}`,
            `Ground heigh: ${groundHeight}`,
            `Height: ${screen.height}px`,
            `Width: ${screen.width}px`,
            `Key pressed: ${keyPressed}`,
            `Game is over: ${gameIsOver}`,
            `Game is running: ${gameStarted}`
        ];
        render();
    }, 10);
    
    window.addEventListener("keydown", function(e) {
        keyPressed = e.key;
        keyPressed = keyPressed.replace(" ", "Space");
        switch (e.key.toLowerCase()) {
            case ' ':
                if(!gameIsOver){
                    bird.stopFalling();
                    birdElem.style.transition = "all 0.25s";
                    bird.flyUp();
                    birdElem.classList.remove("downAngle");
                    birdElem.classList.add("upAngle");
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
            birdElem.classList.remove("upAngle");
            birdElem.classList.add("downAngle");
        }
    });

})();