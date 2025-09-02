import React from "react";

export default function School() {
  const [classes, setClasses] = React.useState([
    {
      name: "Computer Science",
      assignments: [
        { text: "random assignment", due: "Sep 6" }
      ]
    }
  ]);

  const addClass = () => {
    const newClass = {
      name: "New Class",
      assignments: [
        { text: "example assignment", due: "Sep 7" }
      ]
    };
    setClasses([...classes, newClass]);
  };

  return (
    <section className="school-display">
        <section className="school-header">
            <h1>school</h1>
            <button onClick={addClass}>add class</button>
        </section>

        <section className="classes">
            {classes.map((classItem, index) => (
            <section
                key={index}
                className="class"
            >
                <h2>{classItem.name}</h2>
                {classItem.assignments.map((a, i) => (
                <div className="assignment"key={i}>
                    <p>{a.text}</p>
                    <h3>due on {a.due}</h3>
                </div>
                ))}
            </section>
            ))}
        </section>
    </section>
  );
}
