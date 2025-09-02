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

  const addAssignment = (classIndex) => {
    // copy classes
    const updatedClasses = [...classes];
    // add a placeholder assignment
    updatedClasses[classIndex].assignments.push({
      text: "new assignment",
      due: "TBD"
    });
    // update state
    setClasses(updatedClasses);
  };

  return (
    <section className="school-display">
      <section className="school-header">
        <h1>school</h1>
        <button onClick={addClass}>add class</button>
      </section>

      <section className="classes">
        {classes.map((classItem, index) => (
          <section key={index} className="class">
            <h2>{classItem.name}</h2>
            <section className="assignments-section">
              <section className="assignments">
                {classItem.assignments.map((a, i) => (
                  <div className="assignment" key={i}>
                    <p>{a.text}</p>
                    <p>due on {a.due}</p>
                  </div>
                ))}
              </section>
            </section>

            <button onClick={() => addAssignment(index)}>
              add assignment
            </button>
          </section>
        ))}
      </section>
    </section>
  );
}
