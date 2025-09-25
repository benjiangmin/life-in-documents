import React from "react";

export default function Datebox({ selectedMonth, selectedYear, onChangeMonth, onChangeYear }) {
    const months = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
    ]

    const years = Array.from({length: 5}, (_, i) => new Date().getFullYear() - i) // last 5 years

    return (
        <div className="datebox">
            <select value={selectedMonth} onChange={(e) => onChangeMonth(Number(e.target.value))}>
                {months.map((name, idx) => (
                    <option key={idx} value={idx + 1}>{name}</option>
                ))}
            </select>
            <select value={selectedYear} onChange={(e) => onChangeYear(Number(e.target.value))}>
                {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                ))}
            </select>
        </div>
    )
}
