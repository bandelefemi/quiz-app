import Answers from "./answers";
import React from 'react'

export default function Question(props) {
    
    const answerComponentArray = props.answers.map((item)=> {
        return (
            <Answers 
                key = {item.id}
                value = {item.value}
                isHeld = {item.isHeld}
                isCorrect = {item.isCorrect}
                clickHandler = {()=> props.clickHandler(item.id, props.id)}
                isChecked = {props.isChecked}
                />
        )
    })

    return (
        <div>
            <p dangerouslySetInnerHTML={{__html: props.question}} />

            <div className="options-data"> {answerComponentArray}</div>
        </div>
    )
}