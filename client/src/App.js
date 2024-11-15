import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Socket } from './context/Socket';
import Main from './component/Main';
import Test from './component/Test';

function App() {
  return (
  <Socket.Provider value={{ socket : Socket._currentValue }}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Main/> }/>
        <Route path="/test" element={ <Test/> }/>
        <Route path="*" element={ <div>Hello</div>}/>
      </Routes>
    </BrowserRouter>
  </Socket.Provider>
  )
}

export default App;
