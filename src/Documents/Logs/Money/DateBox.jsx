import React, { useState, useEffect } from "react";

export default function DateBox() {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000); 

    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long", 
  });

  return (
    <section className="box-3-display">
        <h1 className="currently-viewing-text">currently viewing:</h1>
        <h1 className="display-date">{formattedDate}</h1>
    </section>
  )
}
