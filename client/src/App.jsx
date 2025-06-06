import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [type, setType] = useState('income');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [user, setUser] = useState('Kevin');
  const [view, setView] = useState('select');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const res = await axios.get('/api/transactions');
    setTransactions(res.data);
  };

  const handleAdd = async () => {
    if (!amount || !description || !type || !category || !user) return;
    const newTx = { type, amount, description, category, user };
    await axios.post('/api/transactions', newTx);
    fetchTransactions();
    setAmount('');
    setDescription('');
    setUser('Kevin');
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      console.error('Failed to delete transaction:', err);
    }
  };

  const filtered = (cat) =>
    transactions.filter((tx) => tx.category === cat);

  const sum = (list, type) =>
    list.filter(tx => tx.type === type).reduce((acc, tx) => acc + Number(tx.amount), 0);

  const total = (cat) => {
    const list = filtered(cat);
    return sum(list, 'income') - sum(list, 'expense');
  };

  const formatCurrency = (num) =>
    '$' + Number(num).toLocaleString();

  if (view === 'select') {
    return (
      <div className="app-container">
        <div className="selection-panel">
          <div className="card" onClick={() => { setCategory('Paper'); setView('Paper'); }}>
            <h2>Paper</h2>
          </div>
          <div className="card" onClick={() => { setCategory('Fiat'); setView('Fiat'); }}>
            <h2>Fiat</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="header-row">
        <button className="card-btn" onClick={() => setView('select')}>Back</button>
        <h1 className="view-title">{category}</h1>
      </div>

      <div className="summary-panel">
        <div className="card-summary">Total: {formatCurrency(total(category))}</div>
        <div className="card-summary income">Income: {formatCurrency(sum(filtered(category), 'income'))}</div>
        <div className="card-summary expense">Expense: {formatCurrency(sum(filtered(category), 'expense'))}</div>
      </div>

      <div className="form-panel">
        <select value={user} onChange={(e) => setUser(e.target.value)}>
          <option value="Kevin">Kevin</option>
          <option value="Addison">Addison</option>
        </select>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button className="card-btn" onClick={handleAdd}>Add</button>
      </div>

      <table className="transaction-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Description</th>
            <th>Type</th>
            <th>Amount</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filtered(category).map((tx) => (
            <tr key={tx._id}>
              <td>{tx.user}</td>
              <td>{tx.description}</td>
              <td className={tx.type === 'income' ? 'type-income' : 'type-expense'}>
                {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
              </td>
              <td className={tx.type === 'income' ? 'type-income' : 'type-expense'}>
                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
              </td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(tx._id)}>x</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
