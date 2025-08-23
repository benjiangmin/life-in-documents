import Sidebar from "../../../../main/Sidebar"
import AddItemBox from "./AddItemBox"
import BudgetBox from "./BudgetBox"
import DateBox from "./DateBox"
import DisplayItemsBox from "./DisplayItemsBox"
import React from "react"

export default function Money() {
    const [items, setItems] = React.useState([])

    const addItem = (newItem) => {
        setItems((prev) => [...prev, newItem])
    }

    return (
        <section className="money-main">
            <Sidebar />
            <section className="column-1">
                <section className="box-1">
                    <AddItemBox onAddItem={addItem} />
                </section>
                <section className="box-2">
                    <BudgetBox />
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