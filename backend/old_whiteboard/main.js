const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors")

const app = express();
const port = 8080;

app.use(cors({
    origin: "*",
    methods: ['GET', 'POST']
}))

// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());

// Array to store received data
let dataArray = [];

// Middleware to log incoming requests
app.use((req, res, next) => {
    console.log(`Received ${req.method} request at ${req.path}`);
    next();
});

// Endpoint to append data to the array
app.post('/appendData', (req, res) => {
    const newData = req.body;

    // Check if the request body is empty
    if (!newData) {
        return res.status(400).json({ error: 'Empty request body' });
    }

    // Append data to the array
    let found = false
    for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i].name == newData.name) {
            dataArray[i] = newData
            found = true
        }
    }
    if (!found)
        dataArray.push(newData);

    // Send a response
    res.status(201).json({ message: 'Data appended successfully' });
});

app.post('/eraseData', (req, res) => {
    dataArray = []
    res.status(201).json({ message: 'Data erased successfully' });
});
// Endpoint to get the array
app.get('/getData', (req, res) => {
    res.json(dataArray);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});