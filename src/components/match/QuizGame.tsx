'use client';

import { useEffect, useMemo, useState } from "react";
import { quizQuestions, quizCategoryMeta } from "@/data/quiz";
import type { QuizCategoryKey, QuizQuestion } from "@/data/quiz";
import type { WinnerType } from "@/types/game";

const TOTAL_QUESTIONS = 6;
const ROUND_TIME = 30;
const STEAL_TIME = 10;

function shuffleArray<T>(items:T[]){
  const array=[...items];

  for(let i=array.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [array[i],array[j]]=[array[j],array[i]];
  }

  return array;
}

export default function QuizGame({
  side1Name,
  side2Name,
  onRoundEnd,
  roundKey,
  category,
}:{
  side1Name:string;
  side2Name:string;
  onRoundEnd:(winner?:WinnerType)=>void;
  roundKey:number;
  category?:QuizCategoryKey|null;
}){

const [questions,setQuestions]=useState<QuizQuestion[]>([]);
const [index,setIndex]=useState(0);

const [showAnswer,setShowAnswer]=useState(false);
const [showOptions,setShowOptions]=useState(false);

const [timeLeft,setTimeLeft]=useState(ROUND_TIME);
const [stealMode,setStealMode]=useState(false);

const [side1Score,setSide1Score]=useState(0);
const [side2Score,setSide2Score]=useState(0);

useEffect(()=>{

if(!category) return;

const picked=quizQuestions[category] ?? [];

setQuestions(
shuffleArray(picked).slice(0,TOTAL_QUESTIONS)
);

setIndex(0);
setShowAnswer(false);
setShowOptions(false);
setTimeLeft(ROUND_TIME);

setStealMode(false);

setSide1Score(0);
setSide2Score(0);

},[category,roundKey]);

const current=questions[index];
const meta=category ? quizCategoryMeta[category] : null;

const originalTurn:"side1"|"side2"=useMemo(()=>{

return index%2===0
?"side1"
:"side2"

},[index]);

const currentTurn=
stealMode
?originalTurn==="side1"
?"side2"
:"side1"
:originalTurn;

const currentTeamName=
currentTurn==="side1"
?(side1Name||"فريق 1")
:(side2Name||"فريق 2");


useEffect(()=>{

if(showAnswer || !current) return;

if(timeLeft<=0){

handleWrong();
return;

}

const timer=setTimeout(()=>{

setTimeLeft(prev=>prev-1)

},1000);

return ()=>clearTimeout(timer);

},[
timeLeft,
showAnswer,
current,
stealMode
]);

function finishQuiz(
final1:number,
final2:number
){

if(final1>final2)
return onRoundEnd("side1");

if(final2>final1)
return onRoundEnd("side2");

return onRoundEnd("none");

}

function nextQuestion(
next1:number,
next2:number
){

if(index+1>=TOTAL_QUESTIONS){

finishQuiz(
next1,
next2
);

return;

}

setIndex(i=>i+1);

setShowAnswer(false);

setShowOptions(false);

setStealMode(false);

setTimeLeft(ROUND_TIME);

}

function handleCorrect(){

const next1=
side1Score+
(currentTurn==="side1"?1:0);

const next2=
side2Score+
(currentTurn==="side2"?1:0);

setSide1Score(next1);
setSide2Score(next2);

nextQuestion(
next1,
next2
);

}

function handleWrong() {
  if (!stealMode) {
    setStealMode(true);
    setTimeLeft(STEAL_TIME);
    return;
  }

  setShowAnswer(true);
}

if(!current){

return null;

}

const timerColor=
timeLeft<=5
?"text-red-300 animate-pulse"
:timeLeft<=10
?"text-yellow-300"
:"text-cyan-300";

return(

<div className="mx-auto max-w-4xl rounded-[28px] border border-white/10 bg-black/20 p-6 text-center text-white">

<p className="text-sm font-black tracking-[0.18em] text-cyan-300/80">
QUIZ
</p>

<h2 className="mt-2 text-3xl font-black">
{meta?.emoji} {meta?.title}
</h2>

<div className="mt-6 grid gap-3 md:grid-cols-3">

<div className="rounded-2xl bg-pink-500/10 p-4">
<p>{side1Name}</p>
<p className="text-3xl font-black">
{side1Score}
</p>
</div>

<div className="rounded-2xl bg-white/10 p-4">

<p>
{stealMode
?"فرصة السرقة"
:"الدور"}
</p>

<p className="text-lg font-black">
{currentTeamName}
</p>

<p className={`text-3xl ${timerColor}`}>
{timeLeft}
</p>

<p>
{index+1}/{TOTAL_QUESTIONS}
</p>

</div>

<div className="rounded-2xl bg-cyan-500/10 p-4">
<p>{side2Name}</p>
<p className="text-3xl font-black">
{side2Score}
</p>
</div>

</div>


<div className="mt-7 rounded-3xl border border-white/10 bg-white/10 p-6">

{current.image && (

<img
src={current.image}
alt=""
className="mx-auto mb-5 max-h-[260px] rounded-2xl"
/>

)}

<p className="text-2xl font-black">
{current.question}
</p>

{showOptions && (

<div className="mt-6 grid grid-cols-2 gap-3">

{current.options?.map(option=>(

<div
key={option}
className="rounded-2xl bg-black/20 p-4"
>

{option}

</div>

))}

</div>

)}

</div>


{showAnswer&&(

<div className="mt-5 rounded-2xl bg-yellow-300/10 p-5">

<p>الإجابة</p>

<p className="text-xl font-bold">

{current.answer}

</p>

</div>

)}

<div className="mt-6 flex flex-wrap justify-center gap-3">

{!showAnswer ? (

<>

{!showOptions&&(

<button
onClick={()=>setShowOptions(true)}
className="btn-secondary"
>
إظهار الخيارات
</button>

)}

<button
onClick={handleCorrect}
className="btn-primary"
>

إجابة صحيحة

</button>

<button
onClick={handleWrong}
className="btn-secondary"
>

خطأ / ما جاوب

</button>

</>

):(

<button
onClick={()=>nextQuestion(
side1Score,
side2Score
)}
className="btn-primary"
>

التالي

</button>

)}

</div>

</div>

)

}
