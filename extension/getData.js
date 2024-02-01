DEBUG = true
//major - 0
//minor - 1
//dim - 2
//aug - 3
//dom7 - 4
//major 7 - 5
//m7 - 6
//dim7 - 7
//m7b5 - 8  
chordId = localStorage.getItem('chord').split("Chord\\\":")[1].split(",")[0]
if (DEBUG)
    fetch("http://localhost:8080/postChord", {
        method: "POST",
        body: JSON.stringify({
            chordId: chordId
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
else
    fetch("https://whiteboard-backend.fly.dev/postChord", {
        method: "POST",
        body: JSON.stringify({
            chordId: chordId
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });