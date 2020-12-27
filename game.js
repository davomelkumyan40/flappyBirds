(function() {
    const birdElem = document.querySelector("#bird");
    const bgImages = [...document.querySelectorAll(".bgImg")];
    const ground = document.querySelector(".ground");
    const headstone = document.querySelector(".headstone");
    let gameIsOver = false;
    let gameStarted = false;
    const screen = { height: 720, width: 480 };
    let threadId = 0;
    const groundHeight = 170;


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
            console.log(`Falling: ${this.y}`);
            let totalFallDistance = (this.fallDistance + this.inertia);
            if(totalFallDistance)
                this.y -= totalFallDistance / 2;
        }

        this.flyUp = function(){
            console.log(`Fly up: ${this.y}`);         
            this.y += 110;
        }

        this.upAngle = function(){
            this.angle = -15;
        }

        this.downAngle = function(){
            this.angle = 90;
        }

        this.isDead = function(){
            if(this.y <= groundHeight){
                console.log("Game Over");
                console.log(this.y + " : " + groundHeight);
                this.y = groundHeight;
                console.log("Y: " + this.y);
                console.log("R: " + this.inertia);
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

    //TODO test remove in end
    document.querySelector(".window").addEventListener("click", () => {
        stopGame();
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
                    stopFalling();
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
                                render();
                                bird.fallDown();
                                gameIsOver = bird.isDead();
                                render();
                            } else stopGame();
                        }, 20);
                        gameStarted = true;
                    }
                }
                break;
        }
    });

    birdElem.addEventListener("transitionend", function(){
        this.style.transition = "all 0.1s";
        if(gameStarted){
            startFalling();
            birdElem.classList.remove("upAngle");
            birdElem.classList.add("downAngle");
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