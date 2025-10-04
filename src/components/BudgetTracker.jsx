import React, { useState } from 'react';
export default function BudgetTracker({ markers = [], updateMarker }) {
  const [selectedId, setSelectedId] = useState(markers[0]?.id ?? '');
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const addExpense = () => {
    if (!selectedId || !amount) return alert('Select stop and amount');
    const m = markers.find(x => x.id === Number(selectedId));
    const expenses = m.expenses ? [...m.expenses] : [];
    expenses.push({ id: Date.now(), desc, amount: Number(amount) });
    updateMarker(m.id, { expenses });
    setDesc(''); setAmount('');
  };
  const totalAll = markers.reduce((sum,m)=> sum + (m.expenses? m.expenses.reduce((s,e)=>s+(e.amount||0),0):0), 0);
  return (
    <div>
      <h3>Budget & Expenses</h3>
      <div className='small'>Total: ₹{totalAll.toFixed(2)}</div>
      <div style={{ marginTop:8 }}>
        <select className='input' value={selectedId} onChange={e=>setSelectedId(e.target.value)}>
          <option value=''>Select stop</option>
          {markers.map(m=> <option key={m.id} value={m.id}>{m.title}</option>)}
        </select>
        <input className='input' placeholder='Expense description' value={desc} onChange={e=>setDesc(e.target.value)} />
        <input className='input' placeholder='Amount' value={amount} onChange={e=>setAmount(e.target.value)} />
        <button className='btn' onClick={addExpense}>Add Expense</button>
      </div>
      <div style={{ marginTop:10 }}>
        {markers.map(m=>(
          <div key={m.id} style={{ marginBottom:8 }}>
            <div style={{ fontWeight:700 }}>{m.title}</div>
            <ul>
              {(m.expenses||[]).map(ex=> <li key={ex.id}>{ex.desc} — ₹{ex.amount}</li>)}
            </ul>
            <div className='small'>Subtotal: ₹{(m.expenses||[]).reduce((s,e)=>s+(e.amount||0),0).toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
