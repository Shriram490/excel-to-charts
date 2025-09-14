import React, { useState } from 'react';
import API from '../api';

export default function UploadForm({ onUploaded }) {
const [file, setFile] = useState(null);
const [msg, setMsg] = useState('');


const submit = async (e) => {
    e.preventDefault();
    if (!file) return setMsg('Please select a file');


    const formData = new FormData();
    formData.append('file', file);


     try {
      const res = await API.post('upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMsg('Upload successful: ' + res.data.name);
      onUploaded && onUploaded(res.data);
    } catch (error) {
      setMsg('Upload failed: ' + (error.response?.data?.error || error.message));
    }
  };
  return (
    <div>
      <form onSubmit={submit}>
        <input type="file" accept=".xlsx,.xls" onChange={e => setFile(e.target.files[0])} />
        <button type="submit">Upload Excel</button>
      </form>
      <div>{msg}</div>
    </div>
  );
}