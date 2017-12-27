import React, { Component } from 'react';
import blueFish from './blueFish.png';
import cheese from './cheese.png';
import cheeseDeath from './cheeseDeath.png';
import greenFish from './greenFish.png';
import orangeFish from './orangeFish.png';
import redFish from './redFish.png';
import shark from './shark.png';
import skelly from './skelly.png';
import './App.css';

let id = 1;
const school = [];
const fishThreshold = 3;

const fishSpeed = 20;
const fishSize = 40;
const sharkSize = 80;
const fishTankSize = 500;
const pointSize = 20;
const pointRadius = 50;
const fishWaitingPeriod = 200;
const boredomRadius = 10;

const greenPoint = {
    color: 'green',
    x: 30,
    y: 30,
    size: pointSize
};

const bluePoint = {
    color: 'blue',
    x: 400,
    y: 200,
    size: pointSize
};

const redPoint = {
    color: 'red',
    x: 250,
    y: 400,
    size: pointSize
};

const fishTypes = ['redFish', 'blueFish', 'greenFish', 'orangeFish', 'shark'];
const points = [redPoint, bluePoint, greenPoint];
const colors = points.map(point => point.color);

const coinFlip = () => !!Math.floor(Math.random() * 2);

const findCloseFish = fish => {
    const sortedFish = school
        .slice(0)
        .sort((oneFish, twoFish) => {
            const distanceFromOneFish = Math.sqrt(
                ((oneFish.x - fish.x) ^ 2) + ((oneFish.y - fish.y) ^ 2)
            );
            const distanceFromTwoFish = Math.sqrt(
                ((twoFish.x - fish.x) ^ 2) + ((twoFish.y - fish.y) ^ 2)
            );
            if (distanceFromOneFish < distanceFromTwoFish) {
                return -1;
            }
            if (distanceFromOneFish > distanceFromTwoFish) {
                return 1;
            }
            return 0;
        })
        .slice(1);
    return sortedFish;
};

class App extends Component {
    state = {
        interval: null
    };

    componentDidMount() {
        const blueFishRef = this.refs.blueFish;
        const greenFishRef = this.refs.greenFish;
        const redFishRef = this.refs.redFish;
        const orangeFishRef = this.refs.orangeFish;
        const sharkRef = this.refs.shark;
        Promise.all([blueFishRef, greenFishRef, redFishRef, orangeFishRef, sharkRef]).then(() => {
            this.startTheFish();
        });
    }

    drawAllFish() {
        const canvas = this.refs.canvas;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        this.drawPOI(context, redPoint);
        this.drawPOI(context, bluePoint);
        this.drawPOI(context, greenPoint);

        school.forEach(fish => {
            if (fish.restingPeriod !== 0) fish.restingPeriod--;
            if (!fish.isBored()) {
                fish.moveToDesire();
            } else {
                fish.setNewDesire();
            }
            const imageSize = fish.type === 'shark' ? sharkSize : fishSize;
            context.drawImage(fish.fish, fish.x, fish.y, imageSize, imageSize);
        });
    }

    startTheFish = () => {
        const { interval } = this.state;
        if (!interval) {
            const interval = setInterval(() => {
                this.drawAllFish();
            }, fishSpeed);

            this.setState({ interval });
        }
    };

    stopTheFish = () => {
        clearInterval(this.state.interval);
        this.setState({ interval: null });
    };

    addFish = () => {
        const fishType = fishTypes[Math.floor(Math.random() * fishTypes.length)];

        const newFish = {
            id: `${fishType}${id}`,
            fish: this.refs[fishType],
            type: fishType,
            x: Math.floor(Math.random() * fishTankSize),
            y: Math.floor(Math.random() * fishTankSize),
            desireX: 225,
            desireY: 225,
            restingPeriod: 0,
            isBored: function() {
                return (
                    this.restingPeriod === 0 && this.x === this.desireX && this.y === this.desireY
                );
            },
            moveToDesire: function() {
                // X movement
                const moveX = this.desireX - this.x;
                if (moveX !== 0) {
                    moveX > 0 ? this.x++ : this.x--;
                }

                // Y movement
                const moveY = this.desireY - this.y;
                if (moveY !== 0) {
                    moveY > 0 ? this.y++ : this.y--;
                }
            },
            setNewDesire: function(canFidget = true) {
                if (canFidget && coinFlip()) {
                    this.restingPeriod = fishWaitingPeriod;

                    //fidget
                    this.desireX = coinFlip() ? this.x + boredomRadius : this.x - boredomRadius;
                    this.desireY = coinFlip() ? this.y + boredomRadius : this.y - boredomRadius;
                } else {
                    //Blue fish logic
                    if (this.type === 'blueFish') {
                        const favColor = colors[Math.floor(Math.random() * colors.length)];
                        const point = points.find(point => point.color === favColor);

                        this.desireX = coinFlip()
                            ? point.x + Math.floor(Math.random() * pointRadius)
                            : point.x - Math.floor(Math.random() * pointRadius);
                        this.desireY = coinFlip()
                            ? point.y + Math.floor(Math.random() * pointRadius)
                            : point.y - Math.floor(Math.random() * pointRadius);
                    } else {
                        const favFish = findCloseFish(this)[
                            Math.floor(Math.random() * fishThreshold)
                        ];
                        if (favFish && favFish.type !== 'shark') {
                            this.desireX = coinFlip()
                                ? favFish.x + Math.floor(Math.random() * pointRadius)
                                : favFish.x - Math.floor(Math.random() * pointRadius);
                            this.desireY = coinFlip()
                                ? favFish.y + Math.floor(Math.random() * pointRadius)
                                : favFish.y - Math.floor(Math.random() * pointRadius);
                        } else {
                            //shark
                            const favColor = colors[Math.floor(Math.random() * colors.length)];
                            const point = points.find(point => point.color === favColor);
                            this.desireX = coinFlip()
                                ? point.x + Math.floor(Math.random() * pointRadius)
                                : point.x - Math.floor(Math.random() * pointRadius);
                            this.desireY = coinFlip()
                                ? point.y + Math.floor(Math.random() * pointRadius)
                                : point.y - Math.floor(Math.random() * pointRadius);
                        }
                    }
                }
            }
        };
        id++;
        newFish.setNewDesire(false);
        school.push(newFish);
    };

    tenEx = () => {
        school.forEach(fish => {
            let index;
            for (index = 0; index < 9; index++) {
                this.addFish();
            }
        });
    };

    drawPOI = (context, point) => {
        context.fillStyle = point.color;
        context.fillRect(point.x, point.y, point.size, point.size);
    };

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Welcome to THE FISHTANK</h1>
                    <button onClick={this.startTheFish}>Start the fish</button>
                    <button onClick={this.stopTheFish}>Stop the fish</button>
                    <button onClick={this.addFish}>Add a fish</button>
                    <button onClick={this.tenEx}>10X the fish</button>
                    <button onClick={() => findCloseFish(school[0])}>Log</button>
                </header>
                <canvas
                    ref="canvas"
                    height={fishTankSize}
                    width={fishTankSize}
                    style={{ border: '1px solid #000' }}
                />
                <img
                    src={blueFish}
                    ref="blueFish"
                    style={{ display: 'none' }}
                    alt="blueFish"
                    width={128}
                    height={128}
                />
                <img
                    src={redFish}
                    ref="redFish"
                    style={{ display: 'none' }}
                    alt="redFish"
                    width={128}
                    height={128}
                />
                <img
                    src={greenFish}
                    ref="greenFish"
                    style={{ display: 'none' }}
                    alt="greenFish"
                    width={128}
                    height={128}
                />
                <img
                    src={orangeFish}
                    ref="orangeFish"
                    style={{ display: 'none' }}
                    alt="orangeFish"
                    width={128}
                    height={128}
                />
                <img
                    src={shark}
                    ref="shark"
                    style={{ display: 'none' }}
                    alt="shark"
                    width={128}
                    height={128}
                />
            </div>
        );
    }
}

export default App;
