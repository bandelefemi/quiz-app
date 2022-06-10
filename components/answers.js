export default function Answers(props) {


    let style;
    if (props.isChecked) {
        if (props.isCorrect) {
            style = {
                backgroundColor: "#94d7a2",
                border: props.isHeld? "1px solid #d6dbf5" : "1px solid #d6dbf5",
            };
        } else {
            if (props.isHeld) {
                style = {
                    backgroundColor: "#f8bcbc",
                    border: props.isHeld? "1px solid #d6dbf5" : "1px solid #d6dbf5"
                };
            }
        }
    } else {
        style = {
            backgroundColor: props.isHeld? "#d6dbf5" : "#ffffff00",
            border: props.isHeld? "1px solid #d6dbf5" : "1px solid #4d5b9e"
        };
    }

    return (
        <div>
            <button className="answer" style={style} onClick={props.clickHandler}
                dangerouslySetInnerHTML = {{__html: props.value}}
            />
        </div>
    )
}
