import { supabase } from "./supabaseClient"

import Sidebar from "../../../../main/Sidebar"
import AddItemBox from "./AddItemBox"
import BudgetBox from "./BudgetBox"
import DateBox from "./DateBox"
import DisplayItemsBox from "./DisplayItemsBox"
import React from "react"

export default function Money() {
      async function fetchItems() {
      const { data, error } = await supabase.from("items").select("*")
      console.log(data)
    }

    fetchItems()
    
    const [items, setItems] = React.useState(() => {
      const saved = localStorage.getItem("items"); 
      return saved ? JSON.parse(saved) : [];
    });
    const [monthlyBudgets, setMonthlyBudgets] = React.useState(() => {
        const saved = localStorage.getItem("monthlyBudgets");
        return saved ? JSON.parse(saved) : {}; // e.g. { "2025-8": 400 }
    });
    const [currentMonth, setCurrentMonth] = React.useState(new Date());
    const [visible, setVisible] = React.useState(false)
    React.useEffect(() => {
      const timer = setTimeout(() => setVisible(true), 50); // small delay for mount
      return () => clearTimeout(timer);
    }, []);


      
      //Items logic.
      const addItem = (newItem) => setItems(prev => [...prev, newItem]);
      const deleteItem = (index) => setItems(prev => prev.filter((_, i) => i !== index));
      const filteredItems = items
      .map((entry, index) => ({ ...entry, index }))
      .filter(entry => {
        const entryDate = new Date(entry.date + "T00:00");
        return (
          entryDate.getMonth() === currentMonth.getMonth() &&
          entryDate.getFullYear() === currentMonth.getFullYear()
        );
      });
      const updateItem = (index, updatedItem) => {
        setItems(prev => {
          const newItems = [...prev];
          newItems[index] = updatedItem;
          return newItems;
        });
      };
      React.useEffect(() => {
        localStorage.setItem("items", JSON.stringify(items));
      }, [items]);
    
      //Month logic.
      const monthKey = `${currentMonth.getFullYear()}-${currentMonth.getMonth() + 1}`;
      function changeMonth(offset) {
        setCurrentMonth(prev => {
          const newDate = new Date(prev);
          newDate.setMonth(prev.getMonth() + offset);
          return newDate;
        });
      }
        
      //Budget logic.
      const currentBudget = monthlyBudgets[monthKey] || 200;
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
        <section className={`box-1 ${visible ? "visible" : ""}`}>
          <AddItemBox 
            onAddItem={addItem} 
          />
        </section>
        <section className={`box-2 ${visible ? "visible" : ""}`}>
          <BudgetBox 
            items={filteredItems} 
            budget={currentBudget} 
            onUpdateBudget={updateBudget}
          />
        </section>
      </section>

      <section className="column-2">
        <section className={`box-3 ${visible ? "visible" : ""}`}>
          <DateBox 
            currentMonth={currentMonth} 
            onChangeMonth={changeMonth} 
          />
        </section>
        <section className={`box-4 ${visible ? "visible" : ""}`}>
          <DisplayItemsBox 
            items={filteredItems} 
            onUpdateItem={updateItem} 
            onDeleteItem={deleteItem} 
          />
        </section>
      </section>
    </section>
  )
}
