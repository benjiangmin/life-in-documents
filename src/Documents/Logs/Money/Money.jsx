import { supabase } from "./supabaseClient"

import Sidebar from "../../../../main/Sidebar"
import AddItemBox from "./AddItemBox"
import BudgetBox from "./BudgetBox"
import DateBox from "./DateBox"
import DisplayItemsBox from "./DisplayItemsBox"
import React from "react"

export default function Money() {
  const [items, setItems] = React.useState([])
  const [monthlyBudgets, setMonthlyBudgets] = React.useState({})
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  const [visible, setVisible] = React.useState(false)

  // Animate visibility
  React.useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  // Fetch items from Supabase on mount
  React.useEffect(() => {
    async function fetchItems() {
      const { data, error } = await supabase.from("items").select("*")
      if (error) console.error("Fetch error:", error)
      else setItems(data)
    }
    fetchItems()
  }, [])

  // Add item to Supabase and state
  const addItem = async (newItem) => {
    const { data, error } = await supabase.from("items").insert([newItem]).select()
    if (error) console.error("Insert error:", error)
    else {
      console.log("Insert succeeded:", data)
      setItems(prev => [...prev, data[0]])
    }
  }

  // Delete item from Supabase and state
  const deleteItem = async (id) => {
    const { error } = await supabase.from("items").delete().eq("id", id)
    if (error) console.error("Delete error:", error)
    else setItems(prev => prev.filter(item => item.id !== id))
  }

  const updateItem = async (id, updatedItem) => {
  const { id: _, ...itemToUpdate } = updatedItem; // exclude id
  const { data, error } = await supabase
    .from("items")
    .update(itemToUpdate)
    .eq("id", id)
    .select(); // <-- important

  if (error) console.error("Update error:", error)
  else setItems(prev => prev.map(item => item.id === id ? data[0] : item))

  console.log("Supabase returned:", data);
}


  // Filter items for current month
  const filteredItems = items.filter(entry => {
    const entryDate = new Date(entry.date + "T00:00")
    return (
      entryDate.getMonth() === currentMonth.getMonth() &&
      entryDate.getFullYear() === currentMonth.getFullYear()
    )
  })

  // Month navigation
  const monthKey = `${currentMonth.getFullYear()}-${currentMonth.getMonth() + 1}`
  const changeMonth = (offset) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + offset)
      return newDate
    })
  }

  // Budget logic
  const currentBudget = monthlyBudgets[monthKey] || 200
  const updateBudget = (newBudget) => {
    setMonthlyBudgets(prev => ({ ...prev, [monthKey]: newBudget }))
  }

  return (
    <section className="money-main">
      <Sidebar />
      <section className="column-1">
        <section className={`box-1 ${visible ? "visible" : ""}`}>
          <AddItemBox onAddItem={addItem} />
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
          <DateBox currentMonth={currentMonth} onChangeMonth={changeMonth} />
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
