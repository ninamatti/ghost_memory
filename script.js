'use strict'
// Please don't delete the 'use strict' line above



class AudioController {
  constructor() {
    this.bgMusic = new Audio('Assets/music/TheWayoftheGhost.mp3');
    this.flipSound = new Audio('Assets/music/flip.wav');
    this.matchSound = new Audio('Assets/music/match.wav');
    this.victorySound = new Audio('Assets/music/victory.wav');
    this.gameOverSound = new Audio('Assets/music/gameOver.wav');
    this.bgMusic.volumne = 0.5;
    this.bgMusic.loop = true;
  }
  startMusic() {
    this.stopMusic();
    this.bgMusic.play();
  }
  stopMusic() {
    this.bgMusic.pause();
    this.bgMusic.currentTime = 0;
  }
  flip() {
    this.flipSound.play();
  }
  match() {
    this.matchSound.play();
  }
  victory() {
    this.stopMusic();
    this.victorySound.play();
  }
  gameOver() {
    this.stopMusic();
    this.gameOverSound.play();
  }
}

class MixOrMatch {
  constructor(totalTime, cards) {
    this.cardsArray = cards;
    this.totalTime = totalTime;
    this.timeRemaining = totalTime;
    this.timer = document.getElementById('time-remaining');
    this.ticker = document.getElementById('flips');
    this.audioController = new AudioController();  
  }

  startGame() {
    this.cardToCheck = null;
    this.totalClicks = 0;
    this.timeRemaining = this.totalTime;
    this.matchedCards = [];
    this.busy = true;
    document.getElementById('game-over-text').style.display = 'none';
    document.getElementById('victory-text').style.display = 'none';
    
    setTimeout(() => {
      this.audioController.startMusic();
      this.shuffleCards();
      this.countDown = this.startCountDown();
      this.busy = false;
    }, 500);
    this.hideCards();
    this.timer.innerText = this.timeRemaining;
    this.ticker.innerText = this.totalClicks;
  }
  hideCards() {
    this.cardsArray.forEach(card => {
      card.classList.remove('visible');
      card.classList.remove('matched');
    });
  }
  flipCard(card) {
    if(this.canFlipCard(card)) {
      this.audioController.flip();
      this.totalClicks++;
      this.ticker.innerText = this.totalClicks;
      card.classList.add('visible');

      if(this.cardToCheck) {
        this.checkForCardMatch(card);
      } else {
        this.cardToCheck = card;
      }
    };
  }
  checkForCardMatch(card) {
    if(this.getCardType(card) === this.getCardType(this.cardToCheck)) {
      this.cardMatch(card, this.cardToCheck);
    } else {
      this.cardMisMatch(card, this.cardToCheck);
    };

    this.cardToCheck = null;
  }

  cardMatch(card1, card2) {
    this.matchedCards.push(card1);
    this.matchedCards.push(card2);
    card1.classList.add('matched');
    card2.classList.add('matched');
    this.audioController.match();
    if(this.matchedCards.length === this.cardsArray.length) {
      this.victory();
    }
  }
  cardMisMatch(card1, card2) {
    this.busy = true;
    setTimeout(() => {
      card1.classList.remove('visible');
      card2.classList.remove('visible');
      this.busy = false;
    }, 1000);
  }

  getCardType(card) {
    return card.getElementsByClassName('card-value')[0].src;
  }

  startCountDown() {
    return setInterval(() => {
      this.timeRemaining--;
      this.timer.innerText = this.timeRemaining;
      if (this.timeRemaining === 0) {
        this.gameOver();
      }
    }, 1000);
  }

  gameOver() {
    clearInterval(this.countDown);
    this.audioController.gameOver();
    document.getElementById('game-over-text').style.display = 'flex';
  }
  victory() {
    clearInterval(this.countDown);
    this.audioController.victory();
    document.getElementById('victory-text').style.display = 'flex';
  }

  shuffleCards() {
    // fisher-yates shuffle algorithm
    for(let i = this.cardsArray.length - 1; i > 0; i--) {
      let randIndex = Math.floor(Math.random() * (i+1));
      this.cardsArray[randIndex].style.order = i;
      this.cardsArray[i].style.order = randIndex;
    }
  }


  canFlipCard(card) {
    return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
  }
}

function ready() {
  let overlays = Array.from(document.getElementsByClassName('overlay-text'));
  let cards = Array.from(document.getElementsByClassName('card'));
  let game = new MixOrMatch(100, cards);
  

  overlays.forEach(overlay => {
    overlay.addEventListener('click', () => {
      game.startGame();
      // let audioController = new AudioController();
      // audioController.startMusic();
    });
  });

  cards.forEach(card => {
    card.addEventListener('click', () => {
      game.flipCard(card);
    });
  });
}

if(document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ready());
} else {
  ready();
}

// display prompt if user is accessing game via safari browser
if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
  console.log('it works!');
  alert("Please play me on Chrome!");          
}



