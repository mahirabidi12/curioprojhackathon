// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import HomePage from './pages/Home/HomePage';
import FormPage from './pages/Form/Form';
import GlobalStyles from './styles/GlobalStyles';
import EditPrompt from './pages/EditPrompt/EditPrompt.jsx';


function App() {
  return (
    <Router>
      <GlobalStyles />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<FormPage />} />
        <Route path="/edit-prompt" element={<EditPrompt/>} />
      </Routes>
    </Router>
  );
}

export default App;