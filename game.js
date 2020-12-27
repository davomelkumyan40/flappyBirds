(function() {
    const birdElem = document.querySelector("#bird");
    const bgImages = [...document.querySelectorAll(".bgImg")];
    const ground = document.querySelector(".ground");
    let gameIsOver = false;
    let gameStarted = false;
    const screen = { height: 720, width: 480 };
    let threadId = 0;


    function Bird(){
        this.y = 0;
        this.angle = 0;
        this.fallRatio = 0;
        this.fallDistance = 13;
        this.isFalling = false;

        this.bind = function(screenObj){
            this.y = screenObj.height * 48 / 100;
        }

        this.calculatePhsycs = function(){
            if(this.isFalling) this.fallRatio += 0.4;
            else this.fallRatio = 0;
        }

        this.fallDown = function(){
            console.log(`Falling: ${this.y}`);
            this.y -= (this.fallDistance + this.fallRatio) / 2;
        }

        this.flyUp = function(){
            console.log(`Fly up: ${this.y}`);         
            this.y += 110;
        }

        this.isDead = function(){
            if(this.y <= screen.height * 24 / 100){
                console.log("GO");
                console.log(this.y + " : " + screen.height * 24 / 100);
                this.y += this.fallDistance / 2;
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

    document.querySelector(".window").addEventListener("click", () => {
        resetGame();
        render();
    });

    

    function render(){
        birdElem.style.bottom = `${bird.y}px`;
    }
    
    window.addEventListener("keyup", function(e) {
        switch (e.key) {
            case ' ':
                if(!gameIsOver){
                    if(!gameStarted){
                        birdElem.classList.remove("floatBird");
                        threadId = setInterval(() => {
                            if(!gameIsOver){
                                bird.calculatePhsycs();
                                bird.fallDown();
                                render();
                                bird.fallDown();
                                gameIsOver = bird.isDead();
                                render();
                            } else stopGame();
                        }, 20);
                        gameStarted = true;
                    }
                    stopFalling();
                    birdElem.style.transition = "all 0.25s";
                    bird.flyUp();
                }
                break;
        }
    });

    birdElem.addEventListener("transitionend", function(){
        this.style.transition = "all 0.1s";
        if(gameStarted){
            startFalling();
        }
    });

    function startFalling(){
        bird.isFalling = true;
        bird.fallDistance = 12;
    }

    function stopFalling(){
        bird.fallDistance = 0;
        bird.isFalling = false;
    }
})();