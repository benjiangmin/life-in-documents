import Sidebar from "../../../../main/Sidebar"
import AddItemBox from "./AddItemBox"
import BudgetBox from "./BudgetBox"
import DateBox from "./DateBox"
import DisplayItemsBox from "./DisplayItemsBox"
import React from "react"

export default function Money() {
  // 1. Load saved items
  const [items, setItems] = React.useState(() => {
    const saved = localStorage.getItem("items"); 
    return saved ? JSON.parse(saved) : [];
  });

  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  // 2. Load monthly budgets
  const [monthlyBudgets, setMonthlyBudgets] = React.useState(() => {
    const saved = localStorage.getItem("monthlyBudgets");
    return saved ? JSON.parse(saved) : {}; // e.g. { "2025-8": 400 }
  });

  // Save items to localStorage
  React.useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  // Function for adding a new item
  const addItem = (newItem) => setItems(prev => [...prev, newItem]);

  const updateItem = (index, updatedItem) => {
    setItems(prev => {
      const newItems = [...prev];
      newItems[index] = updatedItem;
      return newItems;
    });
  };

  const deleteItem = (index) => setItems(prev => prev.filter((_, i) => i !== index));

  // Filter items for current month, attach original index
  const filteredItems = items
    .map((entry, index) => ({ ...entry, index }))
    .filter(entry => {
      const entryDate = new Date(entry.date + "T00:00");
      return (
        entryDate.getMonth() === currentMonth.getMonth() &&
        entryDate.getFullYear() === currentMonth.getFullYear()
      );
    });

  // Change month
  function changeMonth(offset) {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + offset);
      return newDate;
    });
  }

  // Get month key for budget storage
  const monthKey = `${currentMonth.getFullYear()}-${currentMonth.getMonth() + 1}`;
  const currentBudget = monthlyBudgets[monthKey] || 400;

  // Update budget for current month
  const updateBudget = (newBudget) => {
    setMonthlyBudgets(prev => {
      const updated = { ...prev, [monthKey]: newBudget };
      localStorage.setItem("monthlyBudgets", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <section className="money-main">
      <Sidebar />
      <section className="column-1">
        <section className="box-1">
          <AddItemBox onAddItem={addItem} />
        </section>
        <section className="box-2">
          <BudgetBox 
            items={filteredItems} 
            budget={currentBudget} 
            onUpdateBudget={updateBudget}
          />
        </section>
      </section>

      <section className="column-2">
        <section className="box-3">
          <DateBox 
            currentMonth={currentMonth} 
            onChangeMonth={changeMonth} 
          />
        </section>
        <section className="box-4">
          <DisplayItemsBox 
            items={filteredItems} 
            onUpdateItem={updateItem} 
            onDeleteItem={deleteItem} 
          />
        </section>
      </section>
    </section>
  );
}
