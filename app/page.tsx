'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClients'

export default function Home() {
  const [tasks, setTasks] = useState<any[]>([])
  const [title, setTitle] = useState('')

  useEffect(() => {
    loadTasks()
  }, [])

  async function loadTasks() {
    const { data } = await supabase.from('tasks').select('*')
    setTasks(data || [])
  }

  async function addTask() {
    if (!title) return
    await supabase.from('tasks').insert({ title })
    setTitle('')
    loadTasks()
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>My Web App</h1>

      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="New task"
      />
      <button onClick={addTask}>Add</button>

      <ul>
        {tasks.map(t => (
          <li key={t.id}>{t.title}</li>
        ))}
      </ul>
    </main>
  )
}