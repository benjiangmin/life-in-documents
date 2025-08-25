import React, { useState } from "react";

export default function BudgetBox({ items }) {
    const [budget, setBudget] = useState(400); // hardcoded budget
    const [isEditing, setIsEditing] = useState(false); 
    const [newBudget, setNewBudget] = useState(budget); 

    const spent = items.reduce(
        (total, entry) => total + parseFloat(entry.price || 0),
        0
    );

    const left = budget - spent;

    const totalsByType = items.reduce((acc, entry) => {
        const type = entry.type || "other";
        const price = parseFloat(entry.price) || 0;
        if (!acc[type]) acc[type] = 0;
        acc[type] += price;
        return acc;
    }, {});

    return (
        <section className="box-2-display">
        <h1 className="budget-text-display">budget:</h1>

        <section className="budget-detailed-display">
            <section className="budget-budget-display">
            <h3>budget:</h3>
            <h2
                className="clickable-budget"
                style={{ cursor: "pointer" }}
                onClick={() => setIsEditing(true)}
            >
                ${budget.toFixed(2)}
            </h2>
            </section>

            <section className="spent-display">
            <h3>spent:</h3>
            <h2>${spent.toFixed(2)}</h2>
            </section>

            <section className="left-display">
            <h3>left:</h3>
            <h2 style={{ color: left < 0 ? "#a33939ff" : "#d0fbcfff" }}>
                ${left.toFixed(2)}
            </h2>
            </section>
        </section>

        <section className="break-line"></section>

        <section className="item-details">
            <section className="item-details-display">
                <h1>food:</h1>
                <h2>${(totalsByType.food || 0).toFixed(2)}</h2>
            </section>
            <section className="item-details-display">
                <h1>groceries:</h1>
                <h2>${(totalsByType.groceries || 0).toFixed(2)}</h2>
            </section>
            <section className="item-details-display">
                <h1>clothing:</h1>
                <h2>${(totalsByType.clothing || 0).toFixed(2)}</h2>
            </section>
            <section className="item-details-display">
                <h1>games:</h1>
                <h2>${(totalsByType.games || 0).toFixed(2)}</h2>
            </section>
            <section className="item-details-display">
                <h1>abby:</h1>
                <h2>${(totalsByType.abby || 0).toFixed(2)}</h2>
            </section>
            <section className="item-details-display">
                <h1>other:</h1>
                <h2>${(totalsByType.other || 0).toFixed(2)}</h2>
            </section>
        </section>

        {isEditing && (
            <div className="popup-overlay">
            <div className="popup">
                <h3>edit budget</h3>
                <input
                    className="input-button"
                    type="number"
                    value={newBudget}
                    onChange={(e) => setNewBudget(Number(e.target.value))}
                />
                <section className="popup-buttons-container">
                    <button
                        className="popup-button"
                        onClick={() => {
                            setBudget(newBudget); 
                            setIsEditing(false);
                        }}
                        >
                        enter
                    </button>
                    <button className="popup-button" onClick={() => setIsEditing(false)}>cancel</button>
                </section>
            </div>
            </div>
        )}
        </section>
    )
}
