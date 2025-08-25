import Sidebar from "../../../../main/Sidebar"
import AddItemBox from "./AddItemBox"
import BudgetBox from "./BudgetBox"
import DateBox from "./DateBox"
import DisplayItemsBox from "./DisplayItemsBox"
import React from "react"

export default function Money() {
    // 1. Load saved items from localStorage (if any) when the component starts
    const [items, setItems] = React.useState(() => {
        const saved = localStorage.getItem("items"); 
        return saved ? JSON.parse(saved) : []; // if found, parse it back into an array
    });

    // 2. Every time `items` changes, save it to localStorage
    React.useEffect(() => {
        localStorage.setItem("items", JSON.stringify(items));
    }, [items]);

    // 3. Function for adding a new item
    const addItem = (newItem) => {
        setItems((prev) => [...prev, newItem]);
    };

    return (
        <section className="money-main">
            <Sidebar />
            <section className="column-1">
                <section className="box-1">
                    <AddItemBox onAddItem={addItem} />
                </section>
                <section className="box-2">
                    <BudgetBox items={items}/>
                </section>
            </section>

            <section className="column-2">
                <section className="box-3">
                    <DateBox />
                </section>
                <section className="box-4">
                    <DisplayItemsBox items={items} />
                </section>
            </section>
        </section>
    )
}
