import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import GridExample from './GridExample'

function App() {
  const [doc, setDoc] = useState({ id: null, content: '' })
  const [status, setStatus] = useState('idle')
  const [view, setView] = useState('editor')

  useEffect(() => {
    async function load() {
      setStatus('loading')
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)

      if (error) {
        console.error(error)
        setStatus('error')
        return
      }

      if (data && data.length) {
        setDoc({ id: data[0].id, content: data[0].content })
      }
      setStatus('ready')
    }
    load()
  }, [])

  async function save() {
    setStatus('saving')
    try {
      if (doc.id) {
        const { error } = await supabase
          .from('documents')
          .update({ content: doc.content, updated_at: new Date().toISOString() })
          .eq('id', doc.id)

        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from('documents')
          .insert([{ content: doc.content }])
          .select()

        if (error) throw error
        if (data && data[0]) setDoc({ id: data[0].id, content: data[0].content })
      }
      setStatus('saved')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  return (
    <div className="wrap">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Editor Híbrido — Boilerplate</h1>
        <div className="status">Status: {status}</div>
      </header>

      <nav style={{ marginTop: 12 }}>
        <button onClick={() => setView('editor')}>Editor</button>
        <button onClick={() => setView('grid')} style={{ marginLeft: 8 }}>Grid (HyperFormula)</button>
      </nav>

      <main>
        {view === 'editor' && (
          <section className="editor">
            <textarea
              value={doc.content}
              onChange={(e) => setDoc({ ...doc, content: e.target.value })}
              placeholder="Digite seu documento aqui..."
            />
            <div className="actions">
              <button onClick={save}>Salvar</button>
            </div>

            <section className="viewer">
              <h2>Visualização rápida</h2>
              <pre>{doc.content}</pre>
            </section>
          </section>
        )}

        {view === 'grid' && <GridExample />}
      </main>

      <footer style={{ marginTop: 18 }}>
        <small>Pronto para deploy no Vercel + Supabase</small>
      </footer>
    </div>
  )
}

export default App
