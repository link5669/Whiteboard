const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors")

const app = express();
const port = 8080;

let currChord = -1
let gameIndex = -1

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://link5669:56695669@cluster0.fy37yls.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
        useUnifiedTopology: false
    }
});

const dbName = "test";
const userDBName = "chords";

const database = client.db(dbName);
const userDB = database.collection(userDBName);

app.use(cors({
    origin: "*",
    methods: ['GET', 'POST']
}))

app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log(`Received ${req.method} request at ${req.path}`);
    console.log(`Game index: ${gameIndex}`)
    next();
});

app.post('/postChord', (req, res) => {
    if (!req.body.chordId) {
        return res.status(400).json({ error: 'Missing chord' });
    }
    gameIndex++
    currChord = req.body.chordId
    res.status(201).json({ message: 'Data set successfully' });
})

app.post('/reset', (req, res) => {
    gameIndex = 1
    currChord = req.body.chordId
    userDB.deleteMany()
    res.status(201).json({ message: 'Data set successfully' });
})

app.post('/checkAnswer', (req, res) => {
    const newData = req.body;

    if (!newData) {
        return res.status(400).json({ error: 'Empty request body' });
    }
    let chordIndex = -1
    if (newData.chordType == 'major triad') chordIndex = 0
    else if (newData.chordType == 'minor triad') chordIndex = 1
    else if (newData.chordType == 'diminished triad') chordIndex = 2
    else if (newData.chordType == 'augmented') chordIndex = 3
    else if (newData.chordType == 'dominant 7th') chordIndex = 4
    else if (newData.chordType == 'minor 7th') chordIndex = 6
    else if (newData.chordType == 'major 7th') chordIndex = 5
    else if (newData.chordType == 'half diminished') chordIndex = 8
    else if (newData.chordType == 'fully diminished') chordIndex = 7

    console.log(chordIndex, currChord)
    if (chordIndex == currChord) {
        userDB.findOne({ name: newData.name }).then((e) => {
            if (e == null) {
                userDB.insertOne(newData).then(console.log("inserted new user"))
                return
            }
            userDB.updateOne(
                { name: newData.name },
                { $set: { score: e.score + 1 } }
            );
        });
        userDB.find().sort({ score: -1 }).limit(5).toArray().then((e) => {
            res.status(201).json({ message: 'Correct!', leaderboard: e });
        });
    }
    else {
        res.status(201).json({ message: 'Try again' });
        userDB.findOne({ name: newData.name }).then((e) => {
            if (e == null) {
                userDB.insertOne(newData).then(console.log("inserted new user"))
                return
            }
        });
    }
});

app.get('/getData', (req, res) => {
    res.json(dataArray);
});

app.get('/getIndex', (req, res) => {
    res.status(200).json(gameIndex);
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
