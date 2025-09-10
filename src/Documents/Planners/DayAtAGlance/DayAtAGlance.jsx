import { useEffect, useState } from "react";
import Sidebar from "../../../../main/Sidebar";
import School from "./School";
import Other from "./Other";
import Backlog from "./Backlog";
import { supabase } from "./supabaseClient"; // make sure this path is correct

export default function TheDailyStuffs() {
  const [visible, setVisible] = useState(false);
  const [showBacklog, setShowBacklog] = useState(false);

  // Lifted state for classes + assignments
  const [classes, setClasses] = useState([]);

  // -------------------------
  // Utility: Format due dates
  // -------------------------
  const formatDue = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [year, month, day] = dueDate.split("-").map(Number);
    const due = new Date(year, month - 1, day);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    const formattedDate = due.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    if (diffDays < 0) return { dueIn: "overdue", dueDate: formattedDate };
    if (diffDays === 0) return { dueIn: "due today", dueDate: formattedDate };
    return { dueIn: `due in ${diffDays} day${diffDays !== 1 ? "s" : ""}`, dueDate: formattedDate };
  };

  // -------------------------
  // Fetch classes + assignments once
  // -------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: classesData, error: classErr } = await supabase.from("classes").select("*");
        if (classErr) throw classErr;

        const { data: assignmentsData, error: assignErr } = await supabase.from("assignments").select("*");
        if (assignErr) throw assignErr;

        const merged = classesData.map((c) => ({
          ...c,
          assignments: assignmentsData
            .filter((a) => a.class_id === c.id)
            .map((a) => {
              const { dueIn, dueDate } = formatDue(a.raw_due);
              return { ...a, due_in: dueIn, due_date: dueDate, show: true, fadingOut: false };
            })
        }));

        setClasses(merged);
      } catch (err) {
        console.error("Error fetching school data:", err.message);
      }
    };

    fetchData();
  }, []);

  // -------------------------
  // Visibility animation
  // -------------------------
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // -------------------------
  // Lifted addAssignment function
  // -------------------------
  const addAssignment = async (classIndex, text, due) => {
    if (!text.trim() || !due) return;
    const clsId = classes[classIndex].id;

    const { dueIn, dueDate } = formatDue(due);

    const { data, error } = await supabase
      .from("assignments")
      .insert([{ class_id: clsId, text, raw_due: due, due_in: dueIn, due_date: dueDate, color: "red" }])
      .select()
      .single();

    if (error) return console.error("Error adding assignment:", error.message);

    setClasses((prev) => {
      const updated = [...prev];
      updated[classIndex].assignments.push({ ...data, show: false, fadingOut: false });
      return updated;
    });

    setTimeout(() => {
      setClasses((prev) => {
        const updated = [...prev];
        const idx = updated[classIndex].assignments.findIndex((a) => a.id === data.id);
        updated[classIndex].assignments[idx].show = true;
        return updated;
      });
    }, 50);
  };

  // -------------------------
  // Render
  // -------------------------
  return (
    <section className="the-daily-stuffs-main">
      <Sidebar onOpenBacklog={() => setShowBacklog(true)} showSchoolBacklogButton={true} />

      <section className={`school-section ${visible ? "visible" : ""}`}>
        <School classes={classes} setClasses={setClasses} addAssignment={addAssignment} />
      </section>

      <section className={`other-section ${visible ? "visible" : ""}`}>
        <Other />
      </section>

      {showBacklog && (
        <Backlog
          onClose={() => setShowBacklog(false)}
          classes={classes}
          addAssignment={addAssignment} // now backlog can add assignments too
        />
      )}
    </section>
  );
}
