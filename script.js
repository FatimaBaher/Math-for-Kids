"use strict"

//Defining Variables
let result, ans1, ans2;
let operation="ADD";
let score = 0, hintNb=0;
let loseAudio = new Audio('assets/mixkit-retro-arcade-lose-2027.wav');
let winAudio = new Audio('assets/claps.mp3');
let CountDownTime;
let random = false;

//Grabbing Elements
const refreshBtn = document.querySelector(".refresh");
const btns = document.querySelectorAll('.option');
const generateBtn = document.querySelector(".generate");
const hintBtn = document.querySelector(".hint");
const values = document.querySelectorAll('.numberCard');
const minutesPos = document.querySelector(".timer>span");
const secondsPos = document.querySelector(".timer>span:nth-of-type(3)");
const startTimerBtn = document.querySelector('.watchIcon');

//Adding Event Listeners
generateBtn.addEventListener("click",()=>{
    removeSeconds(10);
    generateEquation();
})

hintBtn.addEventListener("click",()=>{
    useHint(hintNb);
})

btns.forEach((btn)=>{
    btn.addEventListener("click",() => {
        operation = btn.textContent;
        if(operation=="RANDOM"){
            random=true;
        }else{
            random=false;
        }
        generateEquation();
    });
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
    if(score<2 || hintNumber>1){
        alert("Sorry cant");
        return;
    }
    let val = hintNumber==1? ans1 : ans2;
    hintNb++;
    setScore(score-2);
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
    const val1 = Math.round(Math.random()*20);
    const val2 = Math.round(Math.random()*20);
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
            result=val1+val2;
            break;
        case "SUBTRACT":
            operator.textContent = '-';
            result=val1-val2;
            break;
        case "MULTIPLY":
            operator.innerHTML = '*';
            result=val1*val2;
            break;
        case "DIVIDE":
            operator.innerHTML ='&#247';
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

function resetTimer(){
    minutesPos.textContent = '03';
    secondsPos.textContent = '00';
}

function startTimer(){
    minutesPos.textContent = '03';
    secondsPos.textContent = '00';
    let now = new Date().getTime();
    CountDownTime = new Date(now+3*60*1000+2000);  
    let x = setInterval(()=>{
        let now = new Date().getTime();
        let difference = CountDownTime.getTime() - now;
        let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((difference % (1000 * 60)) / 1000);
        minutesPos.textContent = ('0'+minutes).slice(-2);
        secondsPos.textContent =  ('0' + seconds).slice(-2);
        if(minutesPos.textContent<=0 && secondsPos.textContent<=0){
            clearInterval(x);
            resetTimer();
            alert("your score is"+score);
        }
    },1000)
}

function removeSeconds(s){
    CountDownTime = new Date(CountDownTime - s*1000);
}

//Calling needed functions
setScore(0);
generateEquation();
resetTimer();

