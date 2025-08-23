export default function DisplayItemsBox({ items }) {
  // helper to get ordinal suffix
  const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return (
    <>
      <h1 className="items-text">items:</h1>
      <section className="display-items-box">
        <div className="item-buttons">
          {items.slice().reverse().map((entry, index) => {
            const day = new Date(entry.date).getDate();
            const dayWithSuffix = getOrdinal(day);

            return (
              <button key={index} className="item-button">
                <span className="item-day">{dayWithSuffix}:</span>
                <span className="item-name">{entry.item}</span>
                <span className="item-price">${entry.price.toFixed(2)}</span>
              </button>
            );
          })}
        </div>
      </section>
    </>
  );
}
