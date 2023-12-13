const blobContainer = document.querySelector('.background-blobs')
let blobCount = 15;
let containerHeight = blobContainer.offsetHeight;
let containerWidth = blobContainer.offsetWidth;
let colourRange = 40;
let size = 20;
for(let i = 0; i<=blobCount; i++) {
    let blob = document.createElement("div");
    blob.classList.add('blob');
    blobContainer.appendChild(blob);
    blob.style.top = Math.random() * containerHeight - (containerHeight * 0.1) + 'px';
    blob.style.left = Math.random() * containerWidth - (containerWidth * 0.1)+ 'px';
    blob.style.background = `hsl(${Math.random() * colourRange}, 100%, 0%)`
}
const blobs = document.querySelectorAll('.blob')
const fonts = ['Bricolage Grotesque', 'Fraunces', 'Josefin Slab', 'Montagu Slab', 'Cabin', 'Montagu Slab']
const adjectives = ['awesome', 'trendy', 'amazing', 'cool']

let mouseX = 0;
let mouseY = 0;
let cursor = document.createElement("img")
cursor.src = './assets/cursor.svg';
cursor.style.position = 'fixed'
cursor.classList.add('cursor');
document.body.appendChild(cursor)

window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.top = mouseY + 'px';
    cursor.style.left = mouseX + 'px';
})
window.addEventListener("mousedown", () => {
    cursor.style.transform = 
    'scaleX(0.9) scaleY(0.9) scaleZ(0.9) rotateX(35deg) rotateY(-6deg) rotateZ(-4deg)'
})
window.addEventListener("mouseup", () => {cursor.style.transform = 'none'; 
})

blobs.forEach(function(blob, index) {
    setTimeout(() => {
        setInterval(() => {
            let randomSize = Math.random * size;
            if(index < blobCount / 2) {
                blob.style.top = Math.random() * 20 + mouseY + 'px';
                blob.style.left = Math.random() * 20 + mouseX + 'px';
                blob.style.width = randomSize + 'vw';
                blob.style.height = randomSize / 3 + 'vh';
            } else {
                blob.style.top = Math.random() * containerHeight - (containerHeight * 0.1) + 'px';
                blob.style.left = Math.random() * containerWidth - (containerWidth * 0.1)+ 'px';
                blob.style.width = randomSize + 'vw';
                blob.style.height = randomSize + 'vh';
            }
            blob.style.background = `hsl(${Math.random() * colourRange}, 100%, 50%)`
            blob.style.transform = 'translate(-50%, -50%)'
        }, 3000);
    }, Math.random() * 1000);
})

function typeWriter(text, speed, random, fontChange) {
    const originalText = text.textContent;
    text.style.height = text.offsetHeight + 'px';
    text.textContent = '';
    const charTimes = [];
    let charSum = 0;
    for(let i = 0; i<originalText.length; i++) {
        const realTime = speed;
        const randomTime = Math.random() * random;
        const outputTime = realTime + randomTime;
        charSum+= outputTime;
        const char = originalText[i];
        charTimes.push({char, charSum});
    }
    let newText = ''
    let delay = 0;
    if(text instanceof HTMLParagraphElement) {delay = 6000;} 
    charTimes.forEach(function(char, index) {
        setTimeout(() => {
            newText += char.char;
            text.textContent = newText;
            if(text instanceof HTMLParagraphElement == false) {
                if(index == charTimes.length - 1) {
                    text.style.height = 'auto'
                    if(fontChange) {
                        text.innerHTML = `Do you want to make <<span>awesome</span>/> websites like this one?`;
                    }
                }
            }
        }, char.charSum + delay);
    })
}

const textArray = document.querySelectorAll('h1, h2:not(.fs-medium), p');
textArray.forEach(el => {fixHeight(el)})
setTimeout(() => {
    setInterval(() => {
        const heading = document.querySelector('.font-change > span')
        let randomIndex = Math.floor(Math.random() * adjectives.length);
        heading.style.fontFamily = fonts[Math.floor(Math.random() * (fonts.length - 1))]
        heading.textContent = adjectives[randomIndex];
    }, 2000);
}, 2000)


const observer = new IntersectionObserver((entries) => {
    entries.forEach(function(entry, index) {
        if(entry.target.classList.contains('activated') == false) {
            if(entry.isIntersecting) {
                if(index == 0) {
                    typeWriter(entry.target, 30, 60, true)
                } else {
                    typeWriter(entry.target, 30, 60, false)
                }
            }
        }
        entry.target.classList.add('activated');
    })
})

textArray.forEach((el) => observer.observe(el))

// Snake Game
const gameContainer = document.querySelector(".snake-container");
const playerContainer = document.querySelector(".player")
const grid = document.querySelector(".grid")
const scoreSpan = document.querySelector(".score");
const highScoreSpan = document.querySelector(".high-score");
const popUp = document.querySelector(".pop-up")
let playerLength = 5;
const gridSize = 17; // Odd numbers only
const playerScale = 0.7;
const fruits = [];
let eaten = 0;
let score = 0;
let scores = [];
let up = false; let down = false; let left = false; let right = false;
let intervalID;

document.addEventListener("keydown", (e) => {
    if(e.key == 'w' || e.code == 'ArrowUp') {up = true; down = false; left = false; right = false}
    if(e.key == 'a' || e.code == 'ArrowLeft') {up = false; down = false; left = false; right = true}
    if(e.key == 's' || e.code == 'ArrowDown') {up = false; down = true; left = false; right = false}
    if(e.key == 'd' || e.code == 'ArrowRight') {up = false; down = false; left = true; right = false}
})

function createGrid(grid, gridSize) {
    let i = 0;
    while(i<gridSize*gridSize) {
        i++;
        let newGridSquare = document.createElement("div")
        if(i % gridSize == 0) {i++}
        if(i % 2 == 0) {newGridSquare.style.background = 'rgba(200,200,200, 0.4)'}
        else {newGridSquare.style.background = 'rgba(150, 150, 150, 0.5)'}

        newGridSquare.style.width = `calc(100% / ${gridSize - 1})`;
        newGridSquare.style.height = `calc(100% / ${gridSize - 1})`;
        grid.appendChild(newGridSquare)
    }
}

function newLimb(i) {
    let newLimb = document.createElement("div")
        newLimb.style.position = 'absolute'
        newLimb.style.width = `calc(100% / ${gridSize - 1})`;
        newLimb.style.height = `calc(100% / ${gridSize - 1})`;
        newLimb.style.boxShadow = `inset 0 0 .5rem rgba(0, 0, 0, 0.5 d )`;
        if(i == 0) {
            newLimb.style.transition = `100ms linear all`
            newLimb.style.background = `hsl(${260 + playerLength * 2}, 100%, 50%)`;
        } else {
            newLimb.style.transition = `${(playerLength - i) * 20}ms linear all`
            newLimb.style.borderRadius = `${((playerLength - i) * 20)}%`
            newLimb.style.background = `hsl(${260 + i * 2}, 100%, 50%)`;
        }
    playerContainer.appendChild(newLimb)
}

function createPlayer(playerLength) {
    for(let i = 0; i<playerLength; i++) {
        newLimb(i)
    }
}

function removePlayer(playerContainer) {
    let items = playerContainer.querySelectorAll("*");
    items.forEach(item => {item.remove()})
}

function youFailed(intervalID, score) {
    clearInterval(intervalID)
    popUp.style.opacity = 1; 
    if(scores.includes(score) == false) {scores.push(score)}
    document.querySelectorAll('.player > .fruit').forEach(item => {item.remove()})
    popUp.querySelector('span').textContent = 'You died! Press the spacebar to retry';
}

function movePlayer(x, y, bufferCoords, playerLimbs, counter) {
    playerLimbs.forEach(function(limb, index) {
        let scale = (index / playerLength) * playerScale * 0.5 + 0.3;
        if(index == 0) {
            limb.style.top = ((playerContainer.offsetHeight) / (gridSize - 1)) * y + 'px';
            limb.style.left = ((playerContainer.offsetWidth) / (gridSize - 1)) * x + 'px';
            limb.style.transform = `scale(${playerScale})`;
            limb.style.opacity = '1'
            for(let i = 0; i<playerLength; i++) {
                try{
                    if(bufferCoords[i].x == x && bufferCoords[i].y == y && counter > playerLength) {
                        console.log('Intersecting!')
                        eaten = 0;
                        youFailed(intervalID, score)
                        playerLength = 5;
                        score = 0;
                    }
                } catch {}
            }
        }
        else {
            limb.style.transform = `scale(${scale}`;
            let format = ((playerContainer.offsetHeight) / (gridSize - 1));
            try {
                limb.style.opacity = '1';
                limb.style.top = format * bufferCoords[index].y + 'px';
                limb.style.left = format * bufferCoords[index].x + 'px';
            } catch(err) {
                if(limb.classList.contains('fruit') == false) {
                    limb.style.opacity = '0';
                }
            }
        }
        if(x >= gridSize - 1 || y >= gridSize - 1 || x < 0 || y < 0) {
            eaten = 0;
            youFailed(intervalID, score)
            playerLength = 5;
            score = 0;
        }
    })
}

function spawnFruit(fruitX, fruitY) {
    const fruit = document.createElement("div");
    console.log(`spawning fruit at x: ${fruitX}, y: ${fruitY}`)
    fruit.classList.add('fruit')

    fruit.style.width = `calc(100% / ${gridSize - 1})`;
    fruit.style.height = `calc(100% / ${gridSize - 1})`;
    fruit.style.position = 'absolute'
    fruit.style.background = 'hsl(230, 100%, 50%)'
    fruit.style.animation = 'colour-bounce infinite 2s'
    fruit.style.borderRadius = '50%'
    fruit.style.top = (playerContainer.offsetWidth) / (gridSize - 1) * fruitY + 'px';
    fruit.style.left = (playerContainer.offsetHeight) / (gridSize - 1) * fruitX + 'px';

    
    playerContainer.appendChild(fruit)
}

createGrid(grid, gridSize);
createPlayer(playerLength)

let fruitX;
let fruitY;

document.addEventListener("keydown", (e) => {
    if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {e.preventDefault();}
    if(e.code == 'Space') {
        e.preventDefault();
        popUp.style.opacity = 0;
        let bufferCoords = [];
        let x = (gridSize - 1) / 2;
        let y = (gridSize - 1) / 2;
        let lastX = x;
        let lastY = y;
        let counter = 0;
        intervalID = setInterval(() => {
            counter++;
            let highScore = Math.max(...scores);
            if(highScore == Number.NEGATIVE_INFINITY) {highScore = 0}
            scoreSpan.innerHTML = `Current Score: ${score}`;
            highScoreSpan.innerHTML = `High Score: ${highScore}`;
            if(up) {y--}
            if(down) {y++}
            if(left) {x++}
            if(right) {x--}
            if(eaten == 0) {
                eaten++
                fruitX = Math.floor(Math.random() * (gridSize - 5) + 2);
                fruitY = Math.floor(Math.random() * (gridSize - 5) + 2);
                spawnFruit(fruitX, fruitY);
            }

            if(fruitX == x && fruitY == y) {
                score++
                removePlayer(playerContainer)
                playerLength+++
                createPlayer(playerLength)
                eaten = 0;
            }
            try {
                let x = lastX;
                let y = lastY;
                bufferCoords.push({x, y})
                if(bufferCoords.length > playerLength) {bufferCoords.splice(0, 1)}
            } catch(err) {}

            const limbs = document.querySelectorAll('.player > div');
            movePlayer(x, y, bufferCoords, limbs, counter)
            lastX = x;
            lastY = y;
        }, 200);
    }
})

function fixHeight(el) {
    el.style.height = `${el.offsetHeight}px'`
}

const scriptURL = 'https://script.google.com/macros/s/AKfycbyhQuFvs33hmgE1cXNmcqnk6CSP5eAKDNjnMqVcZTPM6NjPpMOiI2ZpzzpdxSifiH8/exec'
  const form = document.forms[0]

  form.addEventListener('submit', e => {
      alert('Thank You for signing up to the Web Development Club, you will now recieve relevant news and updates in the future')
    e.preventDefault()
    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
      .then(response => console.log('Success!', response))
      .catch(error => console.error('Error!', error.message))
  })

