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

const frameRate = 20;
const fishSize = 40;
const sharkSize = 80;
const sharkSpeed = 0.7;
const fishTankSize = 500;
const pointSize = 20;
const pointRadius = 50;
const fishWaitingPeriod = 100;
const boredomRadius = 10;

const greenPoint = {
    id: 'greenCheese',
    color: 'green',
    type: 'cheese',
    x: 30,
    y: 30,
    size: pointSize
};

const bluePoint = {
    id: 'blueCheese',
    color: 'blue',
    type: 'cheese',
    x: 400,
    y: 200,
    size: pointSize
};

const redPoint = {
    id: 'redCheese',
    color: 'red',
    type: 'cheese',
    x: 250,
    y: 400,
    size: pointSize
};

const fishTypes = ['redFish', 'blueFish', 'greenFish', 'orangeFish', 'shark'];
const fishPersonalities = {
    redFish: [
        { type: 'shark', likes: false },
        { type: 'redFish', likes: true },
        { type: 'greenFish', likes: false },
        { type: 'cheese', likes: true },
        { type: 'blueFish', likes: true }
    ],
    blueFish: [
        { type: 'shark', likes: false },
        { type: 'blueFish', likes: true },
        { type: 'cheese', likes: true }
    ],
    greenFish: [
        { type: 'shark', likes: false },
        { type: 'greenFish', likes: true },
        { type: 'cheese', likes: true },
        { type: 'blueFish', likes: true }
    ],
    orangeFish: [
        { type: 'shark', likes: false },
        { type: 'orangeFish', likes: true },
        { type: 'cheese', likes: true },
        { type: 'redFish', likes: true }
    ],
    shark: [
        { type: 'blueFish', likes: true },
        { type: 'greenFish', likes: true },
        { type: 'orangeFish', likes: true },
        { type: 'redFish', likes: true }
    ]
};
const cheeses = [redPoint, bluePoint, greenPoint];
const colors = cheeses.map(point => point.color);

const coinFlip = () => !!Math.floor(Math.random() * 2);

const getSmallDistance = () => Math.floor(Math.random() * pointRadius);

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

const sortDesiresByDistance = (fish, school, cheese) => {
    let desires = school.slice(0).concat(cheese.slice(0));

    desires.forEach((val, index, array) => (array[index] = { x: val.x, y: val.y, source: val }));

    desires.sort((nodeA, nodeB) => {
        return (nodeA.x - fish.x) ** 2 + (nodeA.y - fish.y) ** 2 <
            (nodeB.x - fish.x) ** 2 + (nodeB.y - fish.y) ** 2
            ? -1
            : 1;
    });

    desires.forEach((val, index, array) => (array[index] = val.source));

    return desires;
};

const moveTowardBehaviour = (destination, fish, maxSpeed, acceleration) => {
    this.destination    = destination;
    this.fish           = fish;

    this.velocity       = 0;
    this.maxSpeed       = maxSpeed;
    this.acceleration   = acceleration;

    this.start = () => {};

    this.update = () => {
        let delta = {
            x: this.destination.x - this.fish.x,
            y: this.destination.y - this.fish.y
        };
        const distance = Math.sqrt((delta.x ** 2) + (delta.y ** 2));

        if (distance < this.velocity) {
            this.fish.x = this.destination.x;
            this.fish.y = this.destination.y;

            this.velocity = 0;
        } else {
            const decelerationDistance = (this.velocity ** 2) / (2 * this.acceleration);

            if (distance > decelerationDistance) {
                this.velocity = Math.min(
                    this.velocity + this.acceleration, this.maxSpeed
                );
            } else {
                this.velocity = Math.max(this.velocity - this.acceleration, 0);
            }
            
            const angle     = Math.atan2(delta.x, delta.y);
            const cosAngle  = Math.cos(angle);
            const sinAngle  = Math.sin(angle);

            this.fish.x += (this.velocity * cosAngle);
            this.fish.y += (this.velocity * sinAngle);
        }
    };
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
        const cheeseRef = this.refs.cheese;
        Promise.all([
            blueFishRef,
            greenFishRef,
            redFishRef,
            orangeFishRef,
            sharkRef,
            cheeseRef
        ]).then(() => {
            this.addFish({ fishType: 'redFish' });
            this.addFish({ fishType: 'redFish' });
            this.addFish({ fishType: 'redFish' });
            this.addFish({ fishType: 'blueFish' });
            this.addFish({ fishType: 'blueFish' });
            this.addFish({ fishType: 'blueFish' });
            this.addFish({ fishType: 'greenFish' });
            this.addFish({ fishType: 'greenFish' });
            this.addFish({ fishType: 'greenFish' });
            this.addFish({ fishType: 'orangeFish' });
            this.addFish({ fishType: 'orangeFish' });
            this.addFish({ fishType: 'orangeFish' });
            this.addFish({ fishType: 'shark' });
            this.startTheFish();
        });
    }

    drawAllFish() {
        const canvas = this.refs.canvas;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Cheese
        context.drawImage(this.refs.cheese, redPoint.x, redPoint.y, fishSize, fishSize);
        context.drawImage(this.refs.cheese, bluePoint.x, bluePoint.y, fishSize, fishSize);
        context.drawImage(this.refs.cheese, greenPoint.x, greenPoint.y, fishSize, fishSize);

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
            }, frameRate);

            this.setState({ interval });
        }
    };

    stopTheFish = () => {
        clearInterval(this.state.interval);
        this.setState({ interval: null });
    };

    addFish = options => {
        const { fishType: type } = options || {};
        const fishType = type || fishTypes[Math.floor(Math.random() * (fishTypes.length - 1))];
        const speedModifier = fishType === 'shark' ? sharkSpeed : 1;

        const newFish = {
            id: `${fishType}${id}`,
            fish: this.refs[fishType],
            type: fishType,
            personality: fishPersonalities[fishType],
            x: Math.floor(Math.random() * fishTankSize),
            y: Math.floor(Math.random() * fishTankSize),
            desireX: 225,
            desireY: 225,
            restingPeriod: 0,
            speedModifier,
            isBored: function() {
                const xDiff = Math.abs(this.x - this.desireX);
                const yDiff = Math.abs(this.y - this.desireY);

                return (
                    this.restingPeriod === 0 &&
                    xDiff <= this.speedModifier &&
                    yDiff <= this.speedModifier
                );
            },
            fidget: function() {
                this.desireX = coinFlip() ? this.x + boredomRadius : this.x - boredomRadius;
                this.desireY = coinFlip() ? this.y + boredomRadius : this.y - boredomRadius;
                this.restingPeriod = fishWaitingPeriod;
            },
            moveToDesire: function() {
                // X movement
                const moveX = this.desireX - this.x;
                if (Math.abs(moveX) > this.speedModifier) {
                    moveX > 0 ? (this.x += this.speedModifier) : (this.x -= this.speedModifier);
                }

                // Y movement
                const moveY = this.desireY - this.y;
                if (Math.abs(moveY) > this.speedModifier) {
                    moveY > 0 ? (this.y += this.speedModifier) : (this.y -= this.speedModifier);
                }
            },
            setNewDesire: function(canFidget = true) {
                //reset speed
                this.speedModifier = this.type === 'shark' ? sharkSpeed : 1;
                const closeFish = sortDesiresByDistance(this, school, cheeses).slice(
                    0,
                    fishThreshold
                );

                if (canFidget && coinFlip()) {
                    this.fidget();
                } else {
                    let desireObject;
                    let desireMode;
                    let index = 0;
                    while (!desireObject && index < this.personality.length) {
                        const currentFishCheck = this.personality[index];
                        const foundDesire = closeFish.find(
                            fish => fish.type === currentFishCheck.type
                        );
                        if (foundDesire) {
                            desireObject = foundDesire;
                            desireMode = currentFishCheck.likes;
                        }
                        index++;
                    }

                    if (desireObject) {
                        // likes object
                        if (desireMode === true) {
                            console.log(`moving towards ${desireObject.id}`);
                            this.desireX = coinFlip()
                                ? desireObject.x + getSmallDistance()
                                : desireObject.x - getSmallDistance();
                            this.desireY = coinFlip()
                                ? desireObject.y + getSmallDistance()
                                : desireObject.y - getSmallDistance();
                        } else if (desireMode === false) {
                            // dislikes object
                            console.log(`moving away from ${desireObject.id}`);
                            this.speedModifier = 10;

                            if (desireObject.x > 250 && desireObject.y > 250) {
                                this.desireX = Math.floor(Math.random() * (fishTankSize / 4));
                                this.desireY = Math.floor(Math.random() * (fishTankSize / 4));
                            } else if (desireObject.x <= 250 && desireObject.y > 250) {
                                this.desireX =
                                    Math.floor(Math.random() * (fishTankSize / 4)) +
                                    fishTankSize / 2;
                                this.desireY = Math.floor(Math.random() * (fishTankSize / 4));
                            } else if (desireObject.x > 250 && desireObject.y <= 250) {
                                this.desireX = Math.floor(Math.random() * (fishTankSize / 4));
                                this.desireY =
                                    Math.floor(Math.random() * (fishTankSize / 4)) +
                                    fishTankSize / 2;
                            } else if (desireObject.x <= 250 && desireObject.y <= 250) {
                                this.desireX =
                                    Math.floor(Math.random() * (fishTankSize / 4)) +
                                    fishTankSize / 2;
                                this.desireY =
                                    Math.floor(Math.random() * (fishTankSize / 4)) +
                                    fishTankSize / 2;
                            }
                        }
                    } else {
                        this.fidget();
                    }
                }

                this.desireX = Math.abs(this.desireX);
                this.desireY = Math.abs(this.desireY);
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

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Welcome to THE FISHTANK</h1>
                    <button onClick={this.startTheFish}>Start the fish</button>
                    <button onClick={this.stopTheFish}>Stop the fish</button>
                    <button onClick={this.addFish}>Add a fish</button>
                    <button
                        onClick={() => {
                            this.addFish({ fishType: 'shark' });
                        }}
                    >
                        Add a Shark
                    </button>
                    <button onClick={this.tenEx}>10X the fish</button>
                    <button onClick={() => console.log(school)}>Log</button>
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
                <img
                    src={cheese}
                    ref="cheese"
                    style={{ display: 'none' }}
                    alt="cheese"
                    width={128}
                    height={128}
                />
            </div>
        );
    }
}

export default App;