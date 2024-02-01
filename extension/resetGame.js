DEBUG = true

chordId = localStorage.getItem('chord').split("Chord\\\":")[1].split(",")[0]
if (DEBUG)
    fetch("http://localhost:8080/reset", {
        method: "POST",
        body: JSON.stringify({
            chordId: chordId
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
else
    fetch("https://whiteboard-backend.fly.dev/reset", {
        method: "POST",
        body: JSON.stringify({
            chordId: chordId
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });