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
        let once =true

        let codeGlobal;

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

            socket.on(`inprogress`, function (bool) {
                inProgress = bool;
                if (bool) {
                    document.querySelector(`.button`).textContent = "Even geduld";                 
                } else {
                    document.querySelector(`.button`).textContent = "Start animatie";
                }
            })

            socket.on('codeString', function (code) {
                let notok = false;
                switch (code) {
                    case '0101':
                        console.log('oke')
                        break;

                        case '0102':
                        console.log('oke')
                        break;

                        case '0103':
                        console.log('oke')
                        break;

                        case '0104':
                        console.log('oke')
                        break;

                        case '0105':
                        console.log('oke')
                        break;

                        case '0106':
                        console.log('oke')
                        break;

                        case '0107':
                        console.log('oke')
                        break;

                        case '0108':
                        console.log('oke')
                        break;

                        case '0109':
                        console.log('oke')
                        break;

                        case '0110':
                        console.log('oke')
                        break;

                        case '0201':
                        console.log('oke')
                        break;

                        case '0301':
                        console.log('oke')
                        break;

                        case '0401':
                        console.log('oke')
                        break;

                        case '0501':
                        console.log('oke')
                        break;

                        case '0601':
                        console.log('oke')
                        break;

                        case '0701':
                        console.log('oke')
                        break;

                        case '0801':
                        console.log('oke')
                        break;

                        case '0901':
                        console.log('oke')
                        break;

                        case '1001':
                        console.log('oke')
                        break;

                        case '0202':
                        console.log('oke')
                        break;

                        case '0303':
                        console.log('oke')
                        break;

                        case '0404':
                        console.log('oke')
                        break;

                        case '0505':
                        console.log('oke')
                        break;

                        case '0606':
                        console.log('oke')
                        break;

                        case '0707':
                        console.log('oke')
                        break;

                        case '0808':
                        console.log('oke')
                        break;

                        case '0909':
                        console.log('oke')
                        break;

                        case '1010':
                        console.log('oke')
                        break;

                        case '8888':
                        console.log('oke')
                        break;
                
                    default:
                        notok = true;
                        break;
                }
                if(!notok) {
                    if(code == 8888 && document.querySelector(`.code`).value == 8888) {
                        document.querySelector(`.phaser`).classList.remove('none');
                    } else {
                        if (!emittersStart && !inProgress) {
                            console.log(code);
                            codeGlobal = code;
                            startWithCode(code);
                            emittersStart= true;  
                            onceEmitters= true;
                            once = true;
                            document.querySelector(`.button`).textContent = "Even geduld";
                        } else {
                            document.querySelector(`.button`).textContent = "Even geduld";
                        }
                    }    
                } else {
                    console.log('invalid code');
                }
            });
        }

        function handleClickButton() {
            socket.emit("start", document.querySelector(`.code`).value);
        }

        function createLifepoints(codeF) {
            const arr = codeF.split(``)
            let first = arr[0]+arr[1];
            let second =  arr[2]+arr[3];
            const comb = parseInt(first) + parseInt(second); 

            if(comb === 2) {
                return 80
            } if(comb <= 5) {
                return 85
            } if(comb <= 10) {
                return 90
            } else {
                return 99;
            }
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
                if (once) {
                    socket.emit('stop', 'stop de interactie');
                    once =false;
                }
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
                    life = createLifepoints(codeGlobal);
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
        document.querySelector(`.start`).addEventListener('click', handleClickButton);
}
