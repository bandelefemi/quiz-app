import React from 'react'
import Question from './components/questions'
import {nanoid} from 'nanoid'

export default function App() {
    const [hasStarted, setHasStarted] = React.useState(false)
    const [questionsArray, setQuestionsArray] = React.useState()
    const [isChecked, setIsChecked] = React.useState(false)
    const [isFetched, setIsFetched] = React.useState(false)
    // const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState(null)

    React.useEffect(()=>{
        fetchData()
    }, [])

    function fetchData() {
        fetch("https://opentdb.com/api.php?amount=5&category=18&difficulty=medium")
        .then((response)=> {
            if (!response.ok) {
                throw new Error(`this is an HTTP error: the status is ${response.status}`)
            }
            return response.json();
        })

        .then((data)=> createObjArray(data.results))
        .then((objArray)=> {
            setError(null)
            setQuestionsArray(objArray)
            setIsChecked(false)
        })

        .catch((err) => {
            setError(err)
        })

        .finally(()=> {
            setIsFetched(true)
        })
    }

    function createObjArray(array) {
        return (
            array && array.map((item)=> {
                return {
                    ...item,
                    id: nanoid(),
                    correct_answer: convertCorrectAnswerToObj(item.correct_answer),
                    incorrect_answers: mapIncorrectAnswers(item.incorrect_answers),
                    answers: shuffleArray([
                        ...mapIncorrectAnswers(item.incorrect_answers),
                        convertCorrectAnswerToObj(item.correct_answer)
                    ]),
                };
            })
        );
    }

    function convertCorrectAnswerToObj(correct_answer) {
        return {
            value: correct_answer,
            id: nanoid(),
            isHeld: false,
            isCorrect: true
        }
    }

    function mapIncorrectAnswers(incorrect_answers) {
        return incorrect_answers.map((item)=> {
            return {
                value: item,
                id: nanoid(),
                isHeld: false,
                isCorrect: false
            }
        })
    }

    function shuffleArray(array) {
        return array.sort(()=> Math.random() - 0.5)
    }

    function answerClickHandler(answerId, questionId) {
        !isChecked && setQuestionsArray((prevArray)=> {
            return prevArray.map((question)=> {
                return question.id === questionId?{
                    ...question,
                    answers: question.answers.map((answer)=>{
                        return answer.id === answerId?
                        {...answer, isHeld: true}
                        :{...answer, isHeld: false}
                    })
                }
                : question;
            })
        })
    }

    const questionComponentArray = questionsArray &&
    questionsArray.map((items)=> {
        return (
            <Question 
                key = {items.id}
                question = {items.question}
                answers = {items.answers}
                id= {items.id}
                clickHandler = {answerClickHandler}
                isChecked = {isChecked}
                />
        )
    })

    function checkAnswerBtn() {
        setIsChecked(true)
    }

    function startTheGame(){
        setHasStarted(true)
    }

    function checkScore(){
        let num = 0;
        for (let i=0; i< questionsArray.length; i++) {
            for (let j=0; j< questionsArray[i].answers.length; j++) {
                const answer = questionsArray[i].answers[j]
                if (answer.isHeld && answer.isCorrect) {
                    num++
                }
            }
        }
        return num * 20
    }

    function playAgain(){
        setIsFetched(false)
        fetchData()
    }


    return (
        <main className='main-container'>
            <div className='upper-design'></div>
            <div className='lower-design'></div>
        {!hasStarted ? (
            <div className='init-page-container'>
                <h1>Not so easy to build</h1>
                <p>The questions won't be easy</p>
                <button onClick={startTheGame}>
                    Start Quiz
                </button>
            </div>
        ) : ( 
            <div className='data-container'>
            <div>
                {questionsArray && questionComponentArray}
            </div>
            {!isChecked ? (isFetched && (
                <button className='check-answer' onClick={checkAnswerBtn}>
                    check answers
                </button>
            )
            ) : (
                <div className='quiz-bottom'>
                    <p>
                        you scored...{checkScore()} %
                    </p>
                    <button onClick={playAgain}>
                        Play Again
                    </button>
                </div>
            )
        } 
        </div>
        )}
        </main>
    )
}