﻿
const Card_Picture = [
    'images/img.jpg',
    'images/2c.gif',
    'images/2d.gif',
    'images/2h.gif',
    'images/2s.gif',
    'images/3c.gif',
    'images/3d.gif',
    'images/3h.gif',
    'images/3s.gif',
    'images/4c.gif',
    'images/4d.gif',
    'images/4h.gif',
    'images/4s.gif',
    'images/5c.gif',
    'images/5d.gif',
    'images/5h.gif',
    'images/5s.gif',
    'images/6c.gif',
    'images/6d.gif',
    'images/6h.gif',
    'images/6s.gif',
    'images/7c.gif',
    'images/7d.gif',
    'images/7h.gif',
    'images/7s.gif',
    'images/8c.gif',
    'images/8d.gif',
    'images/8h.gif',
    'images/8s.gif',
    'images/9c.gif',
    'images/9d.gif',
    'images/9h.gif',
    'images/9s.gif',
    'images/ac.gif',
    'images/ad.gif',
    'images/ah.gif',
    'images/as.gif',
    'images/j.gif',
    'images/jc.gif',
    'images/jd.gif',
    'images/jh.gif',
    'images/js.gif',
    'images/kc.gif',
    'images/kd.gif',
    'images/kh.gif',
    'images/ks.gif',
    'images/qc.gif',
    'images/qd.gif',
    'images/qh.gif',
    'images/qs.gif',
    'images/tc.gif',
    'images/td.gif',
    'images/th.gif',
    'images/ts.gif',
]

class Card {
    cardId: number;
    backImage: HTMLImageElement;
    frontImage: HTMLImageElement;
    //isOpen: boolean;
    //isVisible: boolean;
    
    constructor(cardId: number) {
        this.cardId = cardId;
        this.backImage = document.createElement("img");
        this.backImage.setAttribute("src", Card_Picture[0]);
        this.backImage.setAttribute('style', "height:68px;width:50px;");
        this.frontImage = document.createElement("img");
        this.frontImage.setAttribute("src", Card_Picture[cardId+1]);
        this.frontImage.setAttribute('style', "height:68px;width:50px;");
    }
   
};

class Cards {
    num: number;
    cards: Card[] = new Array();

    constructor(num: number) {
        this.num = num;
        for (let i = 0; i < this.num/2; i++){
            this.cards[i] = new Card(i);
            this.cards[i + this.num / 2] = new Card(i);
        }

    }

}

class ConcentrationGame {
    gameLevel: number;
    playerName: string;
    table: Cards;

    constructor(gameLevel: number, playerName: string) {
        this.gameLevel = gameLevel;
        this.playerName = playerName;
        this.table = new Cards(this.gameLevel);              
    }

    showCards() {
        var numberOfRows: number = Math.sqrt(this.gameLevel);
        var tab: HTMLTableElement = <HTMLTableElement>document.getElementById('table');
        if (tab.innerHTML !== '') {
            tab.innerHTML = "";
            numberOfClicks = 0;
        }
        for (let i = 0; i < numberOfRows; i++) {
            var row: HTMLTableRowElement = <HTMLTableRowElement>tab.insertRow();
            for (let j = 0; j < numberOfRows; j++) {
                var n: number = i * numberOfRows + j;
                var backgroundImage = this.table.cards[n].backImage;
                var frontImage = this.table.cards[n].frontImage;
                 
                var cell = row.insertCell(0);                
                cell.setAttribute("id", "card" + n.toString());
                cell.setAttribute("onclick", "onClickCard(" + n + "," + this.table.cards[n].cardId + ","+ this.gameLevel+")");
                cell.appendChild(backgroundImage);
                console.log(cell);              
            }
        }
    }

    mixCards() {
        for (let index = this.table.cards.length - 1; index > 0; index--) {
            let j = Math.floor(Math.random() * (index + 1));
            let tem = this.table.cards[index];
            this.table.cards[index] = this.table.cards[j];
            this.table.cards[j] = tem;
        }
        return this.table.cards;
}
}

let audioCardFlip: HTMLAudioElement;
let audioYes: HTMLAudioElement ;
function startGame() {
    if (mytime !== null) {
        clearInterval(mytime);
        numberOfClicks = 0;
        document.getElementById('numberOfClicks').innerHTML = "Number of clicks: " + numberOfClicks;
    }
    let gameLevel = parseFloat((<HTMLInputElement>document.getElementById("level")).value);
    let playerName = (<HTMLInputElement>document.getElementById("player")).value;
    document.getElementById("name").innerHTML = "Player: " + playerName;
    let cg = new ConcentrationGame(gameLevel, playerName);
    cg.mixCards();
    cg.showCards();
    display();
    let audioOnStart = new Audio("sounds/CardsShuffling.mp3");
    audioOnStart.play();
    audioCardFlip = new Audio("sounds/CardFlip.mp3");
    audioYes = new Audio("sounds/Yes.mp3");
}

var temp: number = null;
var tempCardId: number = null;
var numberOfClicks = 0;
var gameOver = 0;

function onClickCard(i: number, cardId: number, gameLevel: number): any {
    var element = document.getElementById("card" + i);
    var element2:HTMLElement;

    if (element.innerHTML !== '') {
        element.innerHTML = '<img src="' + Card_Picture[cardId + 1] + '" style="height:68px;width:50px;">';
        audioCardFlip.play();
        if (temp === null && tempCardId === null) {
            temp = i;
            tempCardId = cardId;          
        } else if (tempCardId === cardId && temp !== i) {
            element2 = document.getElementById("card" + temp);
            setTimeout(function () {
                element.innerHTML = '';
                element2.innerHTML = '';
                audioYes.play();
            }, 450);
            temp = null;
            tempCardId = null;
            gameOver += 2;            
        } else if (tempCardId === cardId && temp == i) {
            numberOfClicks--;
        } else {         
            element2 = document.getElementById("card" + temp); 
            setTimeout(function () {
                element.innerHTML = '<img src="' + Card_Picture[0] + '" style="height:68px;width:50px;">';
                element2.innerHTML = '<img src="' + Card_Picture[0] + '" style="height:68px;width:50px;">';
                let audioNo = new Audio("sounds/No.wav");
                audioNo.play();
            }, 450);
            temp = null;
            tempCardId = null;
        }

        numberOfClicks++;
        document.getElementById('numberOfClicks').innerHTML = "Number of clicks: " + numberOfClicks;

        if (gameOver === gameLevel) {
            let audioApplause = new Audio("sounds/Applause.mp3");
            audioApplause.play();
            document.getElementById('table').innerHTML = "";
            gameOver = 0;
            numberOfClicks = 0;
            clearInterval(mytime);
        }
    }
}

var h: number = 0;
var m: number = 0;
var s: number = 0;
var str: string;
var mytime: number = 0;

function display() {
    h = m = s = 0;
    var refresh = 1000;
    mytime = setInterval('displayTime()', refresh);
}

function displayTime() {
  
    if (s < 10) {
        var s1 = '0' + s;
    } else {
        var s1 = s.toString();
    }
    if (m < 10) {
        var m1 = '0' + m;
    } else {
        var m1 = m.toString();
    }
    if (h < 10) {
        var h1 = '0' + h;
    } else {
        var h1 = h.toString();
    }

     str= h1 + ':' + m1 + ':' + s1;
    document.getElementById('time').innerHTML = "Time: " + str;
   
    if (s < 59) {
        s = s + 1;
    } else {
        s = 0;
        m = m + 1;
        if (m == 60) {
            m = 0;
            h = h + 1;
        } 
    }
  
}
