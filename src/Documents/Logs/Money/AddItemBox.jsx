import React from "react"

export default function AddItemBox( {onAddItem} ) {
    const [item, setItem] = React.useState("")
    const [type, setType] = React.useState("")
    const [price, setPrice] = React.useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!item || !type || !price) return

        const newItem = {
            name: item, // match Supabase column
            type,
            price: parseFloat(price),
            date: new Date().toLocaleDateString("en-CA"),
            budget_id: 1 // default budget id
        }

        onAddItem(newItem)

        setItem("")
        setType("")
        setPrice("")
    }

    return (
        <section className="box-1-display">
            <h1>add item:</h1>
            <form className="add-item-form" onSubmit={handleSubmit}>
                <input 
                    className="item-name-input"
                    type="text"
                    value={item}
                    onChange={(e) => setItem(e.target.value)}
                    placeholder="enter item name"
                    required
                    />
                <br /><br />

                <select className="select-type-form" value={type} onChange={(e) => setType(e.target.value)} required>
                    <option value="" disabled selected>select type</option>
                    <option value="food">food</option>
                    <option value="groceries">groceries</option>
                    <option value="clothing">clothing</option>
                    <option value="games">games</option>
                    <option value="abby">abby</option>
                    <option value="other">other</option>
                </select>
                <br /><br />

                <input
                    className="price-input-form"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="price"
                    step="0.01"
                    required
                    />
                <br /><br />

                <button className="add-item-button" type="submit">+</button>
            </form>
        </section>
    )
}