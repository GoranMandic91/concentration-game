﻿ const Card_Picture = [
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
];
 const Background =[
     'images/back.jpg',
     'images/img.jpg',
     'images/b.gif'
 ];

class Card {
    cardId: number;
    backImage: HTMLImageElement;
    frontImage: HTMLImageElement;

    constructor(cardId: number, backImgId:number) {
        this.cardId = cardId;
        this.backImage = document.createElement("img");
        this.backImage.setAttribute("src", Background[backImageId]);
        this.frontImage = document.createElement("img");
        this.frontImage.setAttribute("src", Card_Picture[cardId]);
    }
   
};

class Cards {
    num: number;
    cards: Card[] = new Array();

    constructor(num: number, backImgId:number ) {
        this.num = num;
        for (let i = 0; i < this.num/2; i++){
            this.cards[i] = new Card(i,backImgId);
            this.cards[i + this.num / 2] = new Card(i,backImgId);
        }
    }
}

class ConcentrationGame {
    gameLevel: number;
    rowNum:number;
    columnNum:number;
    playerName: string;
    backImgId: number
    table: Cards;

    constructor(gameLevel: number,rowNum: number,columnNum: number, playerName: string, backImgId: number) {
        this.gameLevel = gameLevel;
        this.rowNum=rowNum;
        this.columnNum=columnNum;
        this.playerName = playerName;
        this.backImgId=backImgId;
        this.table = new Cards(this.gameLevel, this.backImgId);              
    }

    showCards() {
        let tab: HTMLTableElement = <HTMLTableElement>document.getElementById('table');
        if (tab.innerHTML !== '') {
            tab.innerHTML = "";
            numberOfClicks = 0;
        }
        for (let i = 0; i < this.rowNum; i++) {
            var row: HTMLTableRowElement = <HTMLTableRowElement>tab.insertRow();
            for (let j = 0; j < this.columnNum; j++) {
                let n: number = i * this.columnNum + j;
                let backgroundImage = this.table.cards[n].backImage;
                let frontImage = this.table.cards[n].frontImage;             
                let cell = row.insertCell(0);
                let section=document.createElement('section');
                section.className="containerCard";
                let div=document.createElement('div');
                div.setAttribute("id", "card"+n);
                div.className="card";
                div.setAttribute("onclick", "onClickCard("+ n +","+this.table.cards[n].cardId +","+this.gameLevel+")");
                
                let div2=document.createElement('div');
                div2.className="back";
                div2.appendChild(backgroundImage);
                div.appendChild(div2);

                let div1=document.createElement('div');
                div1.className="front";
                div1.appendChild(frontImage);
                div.appendChild(div1);

                section.appendChild(div); 
                cell.appendChild(section);         
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

class Highscore{
    
    constructor(public level: number, public name: string, public score:number, public time: string, public numOfCliks: number) {
    }
}

let audioNo: HTMLAudioElement, audioYes: HTMLAudioElement ;
let audioOnStart: HTMLAudioElement, audioApplause : HTMLAudioElement ;
let audioCardFlip: HTMLAudioElement ;
let backImageId: number;

function startGame() {
    flag = false;
    if (mytime !== null) {
        clearInterval(mytime);
        numberOfClicks = 0;
        gameOver=0;
        score=0;
        document.getElementById('numberOfClicks').innerHTML = "Number of clicks: " + numberOfClicks;
        document.getElementById('highscore').innerHTML = "";
        document.getElementById('share').innerHTML = "";
    }
    let gameLevel = parseFloat((<HTMLInputElement>document.getElementById("level")).value);
    let rowNumber= (<HTMLInputElement>document.getElementById("row")).value;
    let columnNumber=(<HTMLInputElement>document.getElementById("column")).value;
    backImageId = parseFloat((<HTMLInputElement>document.getElementById("back")).value);
    let playerName = (<HTMLInputElement>document.getElementById("player")).value;
    if(playerName!==''){
        document.getElementById("warning").removeAttribute("class");
        document.getElementById("warning").innerHTML="";
        document.getElementById("warningSize").removeAttribute("class");
        document.getElementById("warningSize").innerHTML="";
        document.getElementById("name").innerHTML = "Player: " + playerName;
        let cg: ConcentrationGame;
        if(rowNumber === '' || columnNumber === ''){
            cg = new ConcentrationGame(gameLevel, Math.sqrt(gameLevel), Math.sqrt(gameLevel), playerName,backImageId);
            cg.mixCards();
            cg.showCards();
            display();
            audioOnStart.play();
        }else if(parseFloat(rowNumber)*parseFloat(columnNumber)%2 === 0){
            gameLevel=parseFloat(rowNumber)*parseFloat(columnNumber);
            if(gameLevel<=100){
                cg = new ConcentrationGame(gameLevel, parseFloat(columnNumber), parseFloat(rowNumber), playerName,backImageId);
                cg.mixCards();
                cg.showCards();
                display();
                audioOnStart.play();
            }else{
                document.getElementById("warningSize").innerHTML = "100 cards on table is maximum! ";
                document.getElementById("warningSize").setAttribute("class", "ui pointing red basic label");
            }
        }else{
            document.getElementById("warningSize").innerHTML = "You must insert correct values! ";
            document.getElementById("warningSize").setAttribute("class", "ui pointing red basic label");
        }
        
    }else {
        document.getElementById("warning").innerHTML = "You must insert your name! ";
        document.getElementById("warning").setAttribute("class", "ui right pointing red basic label")
    }
}

window.onload = function() {
    audioOnStart = new Audio("sounds/CardsShuffling.mp3");
    audioNo = new Audio("sounds/No.wav");
    audioCardFlip = new Audio("sounds/CardFlip.mp3");
    audioYes = new Audio("sounds/Yes.mp3");
    audioApplause = new Audio("sounds/Applause.mp3");
};

let temp: number = null;
let tempCardId: number = null;
let numberOfClicks = 0;
let gameOver = 0;
let score=0;
let flag:boolean = false;

function onClickCard(i: number, cardId: number, gameLevel: number ): any {
    let element: HTMLElement= document.getElementById("card" + i);
    let element2: HTMLElement;
    if (element.innerHTML !== '<div class="cardFrame"></div>' &&  flag === false) {
        element.classList.toggle("flipped");
        audioCardFlip.play();
        if (temp === null && tempCardId === null) {
            temp = i;
            tempCardId = cardId;          
        } else if (tempCardId === cardId && temp !== i) {
            element2 = <HTMLImageElement> document.getElementById("card" + temp);
            setTimeout(function () {
                element.classList.toggle("flipped");
                element2.classList.toggle("flipped");
                setTimeout(function(){
                    element.innerHTML  ='<div class="cardFrame"></div>'
                    element2.innerHTML ='<div class="cardFrame"></div>';
                
                },220);
                audioYes.play();
                flag=false;
            }, 780);
            temp = null;
            tempCardId = null;
            score+=5;
            gameOver += 2; 
            flag=true;           
        } else if (tempCardId === cardId && temp == i) {
            numberOfClicks--;
            element.classList.toggle("flipped");
        } else {         
            element2 =document.getElementById("card" + temp); 
            setTimeout(function () {
                element.classList.toggle("flipped");
                element2.classList.toggle("flipped");
                score-=1;
                audioNo.play();
                flag=false;
            }, 1000);
            temp = null;
            tempCardId = null;
            flag=true;
        }
        numberOfClicks++;
        document.getElementById('score').innerHTML = "Score: " + score;
        document.getElementById('numberOfClicks').innerHTML = "Number of clicks: " + numberOfClicks;
        if (gameOver === gameLevel) {           
            audioApplause.play();
            setTimeout(function () {
                document.getElementById('table').innerHTML = "";
            }, 1000);
            let name = (<HTMLInputElement>document.getElementById("player")).value;
            let hs = new Highscore(gameLevel, name, score, str, numberOfClicks);
            addToHighscore(hs);
            setTimeout(function(){
                printHighScoreTable(gameLevel.toString());
            }, 1000);
            gameOver = 0;
            numberOfClicks = 0;
            score=0;
            clearInterval(mytime);
            flag=false;
        }
    }
}

let h: number = 0,  m: number = 0, s: number = 0, mytime: number = 0 ;
let str: string;

function display() {
    h = m = s = 0;
    mytime = setInterval('displayTime()',1000);
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

function muteSounds() {
        audioOnStart.muted = true;
        audioNo.muted = true;
        audioCardFlip.muted = true;
        audioYes.muted = true;
        audioApplause.muted = true;      
}

function unmuteSounds(){
        audioOnStart.muted = false;
        audioNo.muted = false;
        audioCardFlip.muted = false;
        audioYes.muted = false;
        audioApplause.muted = false;
}



function addToHighscore(hs: Highscore){
    let highscore: Highscore[] = new Array();
    if (typeof(Storage) !== "undefined") {
        for(let i=0; i<10; i++){
                highscore[i] = <Highscore>JSON.parse(localStorage.getItem(hs.level.toString()+i));
        }
        console.log(highscore);
        for(let i=0; i<10; i++){
                if(highscore[i] !== null && hs.score>= highscore[i].score){
                      let temp: Highscore =highscore[i];
                      let temp2:Highscore;
                      highscore[i]=hs;
                      for(let j=i+1;j<10;j++){
                        temp2 =highscore[j];
                        highscore[j]=temp;
                        temp=temp2;
                      }
                      break;  
                }else if(highscore[i] === null){
                    highscore[i]=hs;
                    break;
                }
        }
        console.log(highscore);
        for(let i=0; i<10; i++){
                localStorage.setItem(hs.level.toString()+i, JSON.stringify(highscore[i]));
        }
    } else {
        document.getElementById("highscore").innerHTML = "Sorry, your browser does not support Web Storage...";
    }
}

function printHighScoreTable(level:string){
    let table: HTMLTableElement = <HTMLTableElement>document.getElementById('highscore');
    let header = table.createTHead();
    let row: HTMLTableRowElement = <HTMLTableRowElement>header.insertRow(-1);
    let cell = row.insertCell(-1);
    cell.setAttribute("class", "center aligned");
    cell.innerHTML ="High score table"; 
    header = table.createTHead();
    row = <HTMLTableRowElement>header.insertRow(-1);
    row.setAttribute("class", "center aligned");
    cell = row.insertCell(-1);                
    cell.innerHTML ="Player name";
    cell = row.insertCell(-1);                
    cell.innerHTML="Score";
    cell = row.insertCell(-1);                
    cell.innerHTML="Number of clicks";
    cell = row.insertCell(-1);                
    cell.innerHTML="Time";
    for (let i = 0; i < 10; i++) {
            let myObject:Highscore = JSON.parse(localStorage.getItem(level+i));                           
            if(myObject!==null){
            row = <HTMLTableRowElement>table.insertRow();
            row.setAttribute("class", "center aligned");
            cell = row.insertCell(-1);                
            cell.innerHTML = myObject.name;
            cell = row.insertCell(-1);                
            cell.innerHTML=myObject.score.toString();
            cell = row.insertCell(-1);                
            cell.innerHTML=myObject.numOfCliks.toString();
            cell = row.insertCell(-1);                
            cell.innerHTML=myObject.time;
        }
    }
    showShareButtons();
}

function showShareButtons(){
    let share= document.getElementById('share');
    let h2=document.createElement('h2');
    h2.innerHTML="Share your score on: ";
    share.appendChild(h2);

    let a = document.createElement('a');
    a.setAttribute("onclick", "openNewWindow('http://www.facebook.com/sharer.php?u=https://www.google.rs/#q=Concentration+Game&t=I%20just%20scored%20" + score +"%20points%20in%20Concentration%20game'); return false;");
    a.setAttribute("target", "_blank");
    let img=document.createElement('img');
    img.setAttribute("src", "images/facebook.png");
    a.appendChild(img);
    share.appendChild(a);

    a = document.createElement('a');
    a.setAttribute("onclick", "openNewWindow('https://twitter.com/share?text=I%20just%20scored%20" +score + "%20points%20in%20Concentration%20game&amp;hashtags=ConcentrationGame'); return false;");
    a.setAttribute("target", "_blank");
    img=document.createElement('img');
    img.setAttribute("src", "images/twitter.png");
    a.appendChild(img);
    share.appendChild(a);

    a = document.createElement('a');
    a.setAttribute("onclick", "openNewWindow('http://www.linkedin.com/shareArticle?mini=true&url=https://www.google.rs/&title=I%20just%20scored%20"+score+"%20points%20in%20Concentration%20game&summary=My%20favorite%20game&source=ConcentrationGame'); return false;");
    a.setAttribute("target", "_blank");
    img=document.createElement('img');
    img.setAttribute("src", "images/linkedin.png");
    a.appendChild(img);
    share.appendChild(a);

}

function openNewWindow(url:string) {
    let width: number = 600;
    let height:number = 400; 
    let newWindow=window.open(url, name || 'window' + Math.floor(Math.random() * 10000 + 1), 'width='+width+', height='+height); if (window.focus) {
        newWindow.focus();
    }
}
