import React from "react"

export default function AddItemBox() {
    const [item, setItem] = React.useState("")
    const [type, setType] = React.useState("")
    const [price, setPrice] = React.useState("")

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!item || !type || !price) return; // simple validation

        console.log({ item, type, price: parseFloat(price) }); // for now, just log

        setItem("");
        setType("");
        setPrice("");
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
                    <option value="">--Select type--</option>
                    <option value="food">Food</option>
                    <option value="clothing">Clothing</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="other">Other</option>
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