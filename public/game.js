{
    const config = {
        type: Phaser.WEBGL,
        width: 1020,
        height: 980,
        parent: 'phaser-example',
        backgroundColor: '#1c1917',
        dom: {
            createContainer: true
        },
        physics: {
            default: 'arcade',
            arcade: {
                debug: true,
                gravity: { y: 400 }
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

        let game = new Phaser.Game(config);
        let emitters = [];
        let onceEmitters = true;
        let emittersStart= false;

        let lastTime = 0;
        let forever = false;
        let count = 0;
        let lifeSpanProcent = 1800*.5;
        let life;

        let graphics;
        const curves = [];

        const chosenColors = [];

        let treeTopRed;
        let treeTopBlue;
        let sliderValueTop = 5;

        let inProgress =  false;

        let socket;

        document.querySelector(`.phaser`).classList.add('none');
        
        function preload() {
            this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json');
            this.load.image('tree', 'assets/boom.png');
        }

        function create() {
            
            graphics = this.add.graphics();
            socket = io();

            const posX = 30;
            const min = -40;
            const max = 40;

            const colors = ['blue', 'red'];

            for (let i = 0; i < 20; i++) {
                curves.push(new Phaser.Curves.Spline([ 
                    100+posX*i + Phaser.Math.Between(min, max), 941, 
                    100+posX*i+ Phaser.Math.Between(min, max), 821 + Phaser.Math.Between(min, max),
                    100+posX*i + Phaser.Math.Between(min, max), 719 + Phaser.Math.Between(min, max), 
                    100+posX*i + Phaser.Math.Between(min, max), 641 + Phaser.Math.Between(min, max), 
                    100+posX*i, 536])
                    );
            }

            const particles = this.add.particles('flares');
            for (let i = 0; i < curves.length; i++) {
                const thisColor = colors[Phaser.Math.Between(0, 1)];
                emitters.push(particles.createEmitter({
                    frame: { frames:[thisColor], cycle: true },
                    scale: .1 ,
                    lifespan: 2000,
                    blendMode: 'NORMAL',
                    emitZone: { type: 'edge', source: curves[i], quantity: 350 },
                    alpha: 1
                }));
                chosenColors.push(thisColor);
            }

            emitters.forEach(emitter=> {
                emitter.stop();
            });

            const shape1 = new Phaser.Geom.Rectangle(-350, -250, 900, 450);

            treeTopRed = particles.createEmitter({
                frame: { frames:[colors[1]], cycle: false },
                x: 400, y: 300,
                lifespan: 4000,
                quantity: 1,
                scale: 0.2,
                alpha: { start: 0, end: 1 },
                blendMode: 'NORMAL',
                emitZone: { type: 'random', source: shape1 }
            });
            treeTopBlue = particles.createEmitter({
                frame: { frames:[colors[0]], cycle: false },
                x: 400, y: 300,
                lifespan: 4000,
                quantity: 1,
                scale: 0.2,
                alpha: { start: 0, end: 1 },
                blendMode: 'NORMAL',
                emitZone: { type: 'random', source: shape1 }
            });

            treeTopRed.stop();
            treeTopBlue.stop();

            // event listeners
            document.querySelector(`.start`).addEventListener('click', handleClickButton);
            document.querySelector(`.showMode`).addEventListener('click', handleClickShow);

            socket.on('showButton', function(bool){
                if(bool) {
                    document.querySelector(`.showMode`).style.display = 'none';
                } else {
                    document.querySelector(`.showMode`).style.display = 'block';
                }
            })

            socket.on(`inprogress`, function (bool) {
                console.log(bool);
                inProgress = bool;
            })

            socket.on('codeString', function (code) {
                if (!emittersStart && !inProgress) {
                    console.log(code);
                    startWithCode(code);
                    emittersStart= true;  
                    onceEmitters= true;
                } else {
                    console.log('wait for the other animation to end');
                }
            });
        }

        function handleClickShow() { 
            document.querySelector(`.uiUser`).classList.add('none');
            document.querySelector(`.phaser`).classList.remove('none');
            socket.emit('hideShowButton', false);
        }

        function handleClickButton() {
            socket.emit("start", document.querySelector(`.code`).value);
        }

        function createLifepoints() {
            return 99;
        }
        
        function startWithCode(code) {
            const leavesCode = parseInt(code.slice(0, -2));
            const waterCode = parseInt(code.slice(2, 4));

            const sliderValue = (waterCode*400)
            emitters.forEach(emitter => {
                emitter.lifespan.propertyValue = sliderValue;
            });

            sliderValueTop = leavesCode;
            treeTopBlue.quantity.propertyValue = sliderValueTop;

        }

        function emitterDies() {
            emitters.forEach(emitter => {
                if (emitter.lifespan.propertyValue <= 0) {
                    emitter.stop();
                } else {
                    if(life >= 10) {
                        emitter.alpha.propertyValue = .5* parseFloat(`.${life}`);
                    } else {
                        emitter.alpha.propertyValue = .5* parseFloat(`.0${life}`);
                    }
                }
            });

            const quantityEmitter = treeTopBlue.quantity.propertyValue;
            if (life <= 0) {
                treeTopBlue.stop();
                emittersStart =false;
                lastTime= 0;
                socket.emit('stop', 'stop de interactie');
            } else {
                if(life >= 80 && life < 90) {
                    treeTopBlue.quantity.propertyValue = sliderValueTop * .75;
                } else if (life < 50 && life > 10) {
                    treeTopBlue.quantity.propertyValue = sliderValueTop * .5;
                } else if (life === 99) {
                    treeTopBlue.quantity.propertyValue = sliderValueTop;
                } else {
                    treeTopBlue.quantity.propertyValue = sliderValueTop * .25;
                }
            }
        }

        function update(time, delta) {
            if (emittersStart) {
                if (lastTime === 0) {
                    lastTime = time;
                    life = createLifepoints(99);
                } else if((time - lastTime) >= 300) {
                    lastTime = time;
                    if (!forever) {
                        life = life - 1;                      
                    }
                    count++;
                    if (Math.sign(life) == -1) {
                        life = 0;
                    }
                }

                if(onceEmitters) {
                    emitters.forEach(emitter=> {
                        var callback = function() {
                            emitter.start();
                          }
                        setTimeout(callback, Phaser.Math.Between(0, 3000)); 
                    });
                    onceEmitters = false;

                    treeTopBlue.start();
                }
            }
            // life time of emitter
            emitterDies();

            graphics.clear();

            for (let i = 0; i < curves.length; i++) {
                if(chosenColors[i] === 'red') {
                    graphics.lineStyle(6, 0xe2a681, .25);
                } else {
                    graphics.lineStyle(6, 0xb2dcff, .25);
                }
                curves[i].draw(graphics);
            }
        }
}
