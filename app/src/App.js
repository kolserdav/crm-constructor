import React from 'react';
import logo from './logo.svg';
import './App.css';
import openSocket from 'socket.io-client';
const socket = openSocket.connect('https://localhost:3002', { transports: ['websocket'] } );

function App() {
	socket.open()
	socket.on( 'connect', _ => {
		console.log('a')
	} );
	socket.on( 'env', ( data ) => {
		console.log(data)
	} );
	socket.on( 'news', ( data ) => {
		console.log(data)
	} );
	socket.emit('my', 'ds2d')
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Ed <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
