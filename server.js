const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/data.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'data.json'));
});

// Form submission endpoint
app.post('/submit-form', (req, res) => {
    const formData = req.body;
    const filePath = path.join(__dirname, 'data.json');

    if (!formData.personalInformation.firstName || !formData.loginDetails.email) {
        return res.status(400).json({ message: 'First name and email are required' });
    }
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            console.error(err);
            res.status(500).send('Server Error');
            return;
        }

        let jsonData = [];
        if (data) {
            try {
                jsonData = JSON.parse(data);
            } catch (err) {
                return res.status(500).json({ message: 'Error parsing data file' });
            }
        }

        jsonData.push(formData);

        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error writing to file');
                return;
            }

            res.status(200).json({ message: 'Data saved successfully!' });
        });
    });
});

// Get form data endpoint
app.get('/get-data', (req, res) => {
    const filePath = path.join(__dirname, 'data.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading data file');
            return;
        }

        try {
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        } catch (err) {
            res.status(500).json({ message: 'Error parsing data file' });
        }
    });
});

// Get states data endpoint
app.get('/states.json', (req, res) => {
    console.log('Request received for /states.json');
    const filePath = path.join(__dirname, 'states.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading states data');
        }
        res.json(JSON.parse(data)); // Send the parsed JSON data
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
