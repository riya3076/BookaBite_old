import React from "react";
import Router from "./Routes";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ScrollToTop from "./utils/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop>
        <Router />
      </ScrollToTop>
    </BrowserRouter>
  );
}

export default App;
