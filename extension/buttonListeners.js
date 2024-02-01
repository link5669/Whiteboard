buttons = document.getElementsByClassName("MusicType")
console.log(buttons)
for (let item of buttons) {
    item = item.parentElement.parentElement.parentElement
    item.addEventListener('click', () => {
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
    })
}