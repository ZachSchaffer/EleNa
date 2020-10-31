import React from 'react';
import './App.css';
import Navbar from '../Navbar/Navbar';
import Routes from '../Routes/Routes';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Navbar></Navbar>
        <Routes></Routes>
      </div>
    );
  }
}
