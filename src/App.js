import React, { useState } from 'react';
import { MainPage } from './pages/MainPage';
import { CommentPage } from './pages/CommentPage';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { Context } from './context';

function App() {
  const [show, setShow] = useState(false);

  const [socketResponse, setSocketResponse] = useState();

  return (
    <Context.Provider value={{show, setShow, socketResponse, setSocketResponse}}>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/commentPage/:id" element={<CommentPage />} />
        </Routes>
      </Router>
    </Context.Provider>
  );
};

export default App;
