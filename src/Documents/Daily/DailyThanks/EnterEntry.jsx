import React from "react";

export default function EnterEntry( {onSubmitEntry} ) {
    const [input1, setInput1] = React.useState("");
    const [input2, setInput2] = React.useState("");
    const [input3, setInput3] = React.useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmitEntry({input1, input2, input3});

        setInput1("");
        setInput2("");
        setInput3("");
    }

    return (
        <section className="enter-entry-inner-display">
            <h1>today's entry</h1>
            <form className="submitted-3-gratitudes-form" onSubmit={handleSubmit}>
                <label>
                    1:
                    <input  
                        type="text"
                        value={input1}
                        onChange={(e) => setInput1(e.target.value)}
                    />
                </label>
                <label>
                    2:
                    <input  
                        type="text"
                        value={input2}
                        onChange={(e) => setInput2(e.target.value)}
                    />
                </label>
                <label>
                    3:
                    <input  
                        type="text"
                        value={input3}
                        onChange={(e) => setInput3(e.target.value)}
                    />
                </label>
                <button type="submit">enter</button>
            </form>
        </section>
    )   
}