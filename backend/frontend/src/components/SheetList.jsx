import React, { useEffect, useState } from 'react';
import API from '../api';

export default function SheetList({ onSelect }) {
  const [sheets, setSheets] = useState([]);

  const loadSheets = async () => {
    try {
      const res = await API.get(' ');
      setSheets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadSheets();
  }, []);

  // Delete sheet by id
  const removeSheet = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sheet?')) return;
    try {
      await API.delete(`${id}/`);
      console.log('deleted succesfully')
      loadSheets();
    } catch (err) {
      console.error('Failed to delete', err);
      alert('Failed to delete sheet');
    }
  };

  return (
    <div>
      <h3>Uploaded Sheets</h3>
      {sheets.length === 0 && <p>No sheets uploaded yet</p>}
      <ul>
        {sheets.map((sheet) => (
          <li key={sheet.id}>
            <button onClick={() => onSelect(sheet.id)}>{sheet.name}</button>{' '}
            <button onClick={() => removeSheet(sheet.id)} style={{color: 'red'}}>
              Remove
            </button>
            <br />
            <small>{new Date(sheet.uploaded_at).toLocaleString()}</small>
          </li>
        ))}
      </ul>
      <button onClick={loadSheets}>Refresh</button>
    </div>
  );
}
