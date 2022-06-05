import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { WebMidi } from "webmidi";

function App() {
  function onEnabled() {
    // Display available MIDI input devices
    if (WebMidi.outputs.length < 1) {
      console.log("No device detected.");
    } else {
      WebMidi.outputs.forEach((device, index) => {
        console.log(`${index}: ${device.name}`);
      });
    }
    let output = WebMidi.outputs[0];
    output.channels.forEach((output, index) => {
      console.log(`Output: ${index}`);
    });
  }
  function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

  async function playTest() {
    let output = WebMidi.outputs[0];
    let channel = output.channels[1];

    channel.playNote("C3", {rawAttack: 123, duration: 100})
    .playNote("C0", {rawAttack: 123, duration: 100});
    
  }

  async function poly() {
    WebMidi.outputs[0].channels[8]
    .sendPitchBend(-0.25)
    .playNote("C7");
  }

  async function schedule() {
    WebMidi.outputs[0].channels[1].playNote("C3", {time: WebMidi.time + 3000});
    WebMidi.outputs[0].channels[1].playNote("C3", {time: "+2000"});
  }

  async function connect() {
    WebMidi.enable({ sysex: true })
      .then(onEnabled)
      .catch((err) => alert(err));


      const socket = new WebSocket('wss://api.thegraph.com/subgraphs/name/gundamdweeb/superrare-proto');

      // Connection opened
      socket.addEventListener('open', function (event) {
          socket.send('Hello Server!');
      });
      
      // Listen for messages
      socket.addEventListener('message', function (event) {
          console.log('Message from server ', event.data);
      });
    // Function triggered when WebMidi.js is ready
  }


  return (
    <div className="App">
      <header className="App-header">
      <button onClick={() => connect()}>Connect</button>
        <button onClick={() => playTest()}>Play Test</button>
        <button onClick={() => poly()}>Poly</button>
        <button onClick={() => schedule()}>Schedule</button>
      </header>
    </div>
  );
}

export default App;
