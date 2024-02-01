import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getUrl } from './utilities';

const App = () => {
  const [note, setNote] = useState('A');
  const [accidental, setAccidental] = useState('#');
  const [chordType, setChordType] = useState('major');
  const [showNameError, setShowNameError] = useState(false)
  const [name, setName] = useState("")
  const [questionIndex, setQuestionIndex] = useState(-1)
  const [listening, setListening] = useState(true)
  const [leaderboard, setLeaderboard] = useState({})

  const handleSubmit = () => {
    if (name === '') {
      setShowNameError(true)
    } else
      axios.post(`${getUrl()}/checkAnswer`, { name: name, note: note, accidental: accidental, chordType: chordType, score: 1 }).then((e) => {
        alert(e.data.message)
        if (e.data.message == 'Correct!') {
          setListening(true)
          console.log(e.data.leaderboard)
          setLeaderboard(e.data.leaderboard)
        }
      }) 
  };

  useEffect(() => {
    axios.get(`${getUrl()}/getIndex`).then((response) => {
      console.log(response.data)
    })
  }, [listening])

  const buttonStyle = {
    padding: '10px 20px',
    margin: '10px',
    fontSize: '18px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
  };

  return (
    <>
      {
        listening
          ? (<>
            <p>Waiting for the next question!</p>
            <button onClick={() => {
              axios.get(`${getUrl()}/getIndex`).then((response) => {
                if (Number(response.data) > -1 && Number(response.data) != questionIndex) {
                  setQuestionIndex(Number(response.data))
                  setListening(false)
                }
              })
            }}>force refresh</button>
            {Object.values(leaderboard).length > 0 && (
              <>
                <h2>LEADERBOARD:</h2>
                {Object.values(leaderboard).map((e) => {
                  return <p>{e.name}: {e.score} points</p>
                })}
              </>
            )}
          </>)
          : (
            <div style={{ maxWidth: '375px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' }}>
              <h1>QUESTION: {questionIndex}</h1>
              <fieldset>
                <legend>Name:</legend>
                <input value={name} onChange={(e) => {
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
              {showNameError && <p style={{ color: 'red' }}>Please include your name!</p>}
            </div>
          )
      }</>)
};

export default App;
