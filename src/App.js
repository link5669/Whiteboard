import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [note, setNote] = useState('A');
  const [accidental, setAccidental] = useState('#');
  const [chordType, setChordType] = useState('major');
  const [name, setName] = useState("")

  const handleSubmit = () => {
    // axios.post("https://whiteboard-backend.fly.dev/appendData", { note: note, accidental: accidental, chordType: chordType })
    axios.post("https://whiteboard-backend.fly.dev/appendData", { name: name, note: note, accidental: accidental, chordType: chordType }).then(alert("submitted!"))

  };

  const buttonStyle = {
    padding: '10px 20px',
    margin: '10px',
    fontSize: '18px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
  };

  return (
    <div style={{ maxWidth: '375px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' }}>
      <fieldset>
        <legend>Name:</legend>
        <input onChange={(e) => {
          setName(e.target.value)
        }}></input>
      </fieldset>
      <fieldset>
        <legend>Note:</legend>
        {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((n) => (
          <label key={n} style={{ display: 'block', margin: '10px 0' }}>
            <input type="radio" value={n} checked={note === n} onChange={() => setNote(n)} />
            <span style={buttonStyle}>{n}</span>
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Accidental:</legend>
        {['#', 'b', 'nat'].map((a) => (
          <label key={a} style={{ display: 'block', margin: '10px 0' }}>
            <input type="radio" value={a} checked={accidental === a} onChange={() => setAccidental(a)} />
            <span style={buttonStyle}>{a}</span>
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Chord Type:</legend>
        {['major triad', 'minor triad', 'diminished triad', 'augmented', 'dominant 7th', 'minor 7th', 'major 7th', 'half diminished', 'fully diminished'].map((c) => (
          <label key={c} style={{ display: 'block', margin: '10px 0' }}>
            <input type="radio" value={c} checked={chordType === c} onChange={() => setChordType(c)} />
            <span style={buttonStyle}>{c}</span>
          </label>
        ))}
      </fieldset>
      <button onClick={handleSubmit} style={{ ...buttonStyle, backgroundColor: '#4CAF50', color: 'white' }}>
        Submit
      </button>
    </div>
  );
};

export default App;
