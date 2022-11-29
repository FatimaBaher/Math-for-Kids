"use strict"

//Defining Variables
let result, ans1, ans2, secRemoved, xp, upperbound,username, operation, level, min, sec;
let score = 0, hintNb=0;
let loseAudio = new Audio('assets/mixkit-retro-arcade-lose-2027.wav');
let winAudio = new Audio('assets/claps.mp3');
let CountDownTime;
let random = false;


//Grabbing Elements
const refreshBtn = document.querySelector(".refresh");
const generateBtn = document.querySelector(".generate");
const hintBtn = document.querySelector(".hint");
const values = document.querySelectorAll('.numberCard');
const minutesPos = document.querySelector(".timer>span");
const secondsPos = document.querySelector(".timer>span:nth-of-type(3)");
const startTimerBtn = document.querySelector('.watchIcon');
const startGameBtn = document.querySelector(".startGameBtn");
const popup = document.querySelector(".popupContainer");
const title = document.querySelector(".popup>h2");
const hintContainer = document.querySelector(".hintContainer");

//Adding Event Listeners

startGameBtn.addEventListener("click",()=>{
    level = document.querySelector("input[name='level']:checked").value;
    operation = document.querySelector(".operatorsList").value;
    username = document.querySelector(".input>input").value;
    if(operation=="RANDOM"){
        random=true;
    }
    switch(level){
        case "EASY":
            secRemoved = 10;
            xp = 2;
            upperbound = 20;
            min = '03' ;
            sec = '00';
            break; 
        case "MEDIUM":
            secRemoved = 10;
            xp = 3;
            upperbound = 30;
            min = '02';
            sec = '30';
            break;
            
        case "HARD":
            secRemoved = 15;
            xp = 3;
            upperbound = 40;
            min = '02' ;
            sec = '00';
            break; 
    }
    
    console.log(level,username,operation,random,secRemoved,xp,min,sec);
    popup.style.opacity = 0;
    popup.style.pointerEvents = "none";
    hintBtn.textContent = "HINT FOR " + xp + " XP"; 
    setTimer(min,sec);
    startTimer();  
    setScore(0);
    generateEquation();
})

generateBtn.addEventListener("click",()=>{
    removeSeconds(secRemoved);
    generateEquation();
})

hintBtn.addEventListener("click",()=>{
    useHint(hintNb);
})


values.forEach((value)=>{
    value.addEventListener("click",() => checkResult(value.textContent));
})

refreshBtn.addEventListener("click", ()=> {
    setScore(0);
    generateEquation();
}) 

startTimerBtn.addEventListener("click",()=>{
    startTimer();
})

//Defining Functions
function useHint(hintNumber){  
    if(score<xp || hintNumber>1){
        alert("Sorry cant");
        return;
    }
    let val = hintNumber==1? ans1 : ans2;
    hintNb++;
    setScore(score-xp);
    let hintMsg = document.createElement("span");
    hintMsg.textContent = "- "+xp+" XP";
    hintContainer.insertBefore(hintMsg,hintContainer.children[0]);
    hintMsg.style.animation = 'displayHintMsg 1.5s';
    hintMsg.style.color = "#de5252";
    hintMsg.style.fontSize = '30px';
    const myTimeout = setTimeout(()=>{
        hintMsg.style.display = "none";
    }, 1000);
    values.forEach((value)=>{
        if(value.textContent==val){
            value.style.filter="blur(5px)";
            value.style.pointerEvents="none";
            value.style.cursor="not-allowed";
        }
    }) 
}

function setScore(n){
    score = n;
    const scoreVal = document.querySelector(".score>span");
    scoreVal.style.color = '#c98acb';
    scoreVal.style.webkitTextStroke ='1px black'
    scoreVal.textContent = score;
}

function checkResult(chosen){
    if(chosen==result){
        winAudio.play();
        generateEquation();
        setScore(score+1);
    }else{
        loseAudio.play();
        setScore(score-2);
    }
}

function generateEquation(){
    const val1 = Math.round(Math.random()*upperbound);
    const val2 = Math.round(Math.random()*upperbound);
    const operator = document.querySelector('#op');
    const firstVal = document.querySelector("#v1");
    const secondVal = document.querySelector("#v2");
    firstVal.textContent = val1;
    secondVal.textContent = val2; 
    let choices = ["ADD","SUBTRACT","MULTIPLY","DIVIDE"];
    if(random){
        operation = choices[Math.round(Math.random()*3)];
    }
    
    switch(operation){
        case "ADD":
            operator.textContent = '+';
            operator.style.fontSize = '130px';
            result=val1+val2;
            break;
        case "SUBTRACT":
            operator.textContent = '-';
            operator.style.fontSize = '130px';
            result=val1-val2;
            break;
        case "MULTIPLY":
            operator.innerHTML = 'X';
            operator.style.fontSize = '80px';
            result=val1*val2;
            break;
        case "DIVIDE":
            operator.innerHTML ='&#247';
            operator.style.fontSize = '110px';
            if(val2==0) val2=Math.round(Math.random()*19)+1;
            result=val1/val2;
            break;

    }
    values.forEach((value)=>{
        value.style.filter = "blur(0)";
        value.style.cursor = "pointer";
        value.style.pointerEvents="auto";
    })
    hintNb=0;
    fillOptions(); 
    
}

function fillOptions(){
    let op1= document.querySelector('.numberCard1');
    let op2= document.querySelector('.numberCard2');
    let op3= document.querySelector('.numberCard3');
    do{
        ans1 = getRandIntBetween(result-3,result+3);
    }while(ans1==result);
    do{
        ans2 = getRandIntBetween(result-3,result+3);;
    }while(ans2==ans1 || ans2==result);
    if(operation=="DIVIDE"){
        result=result.toFixed(2);
        ans1=(ans1+Math.random()).toFixed(2);
        ans2=(ans2+Math.random()).toFixed(2);
    }
    const answers = [result,ans1,ans2];
    answers.sort(() => (Math.random() > .5) ? 1 : -1);
    op1.textContent = answers[0];
    op2.textContent = answers[1];
    op3.textContent = answers[2];   
}

function getRandIntBetween(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function setTimer(m,s){
    minutesPos.textContent = m;
    secondsPos.textContent = s;
}

function startTimer(){
    minutesPos.textContent = min;
    secondsPos.textContent = sec;
    let now = new Date().getTime();
    CountDownTime = new Date(now+min*60*1000+2000 + sec * 1000);  
    let x = setInterval(()=>{
        let now = new Date().getTime();
        let difference = CountDownTime.getTime() - now;
        let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((difference % (1000 * 60)) / 1000);
        minutesPos.textContent = ('0'+minutes).slice(-2);
        secondsPos.textContent =  ('0' + seconds).slice(-2);
        if((minutesPos.textContent==0 && secondsPos.textContent==0) || minutesPos.textContent < 0){
            clearInterval(x);
            setTimer('00','00')
            alert(username+" your score is "+score);
            title.style.textShadow = '0 0 10px black';
            title.textContent = "YOUR SCORE: " + score;
            popup.style.opacity = 1;
            popup.style.pointerEvents = "auto";
            startGameBtn.textContent = "PLAY AGAIN"

        }
    },1000)
    
}

function removeSeconds(s){
    CountDownTime = new Date(CountDownTime - secRemoved*1000);
}




