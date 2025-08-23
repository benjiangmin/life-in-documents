export default function DisplayItemsBox( {items} ) {
    return (
        <>
            <h1 className="items-text">items:</h1>
            <section className="display-items-box">
                <div className="item-buttons">
                    {items.slice().reverse().map((entry, index) => (
                        <button key={index} className="item-button">
                        <span className="item-name">{entry.item}</span>
                        <span className="item-price">${entry.price.toFixed(2)}</span>
                        </button>
                    ))}
                </div>
            </section>
        </>
    )
}