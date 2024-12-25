const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.post('/submit-form', (req, res) => {
    const formData = req.body;

    const filePath = path.join(__dirname, 'data.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server Error');
            return;
        }

        let jsonData = [];
        if (data) {
            jsonData = JSON.parse(data);
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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.get('/get-data', (req, res) => {
    const filePath = path.join(__dirname, 'data.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading data file');
            return;
        }
        
        res.json(JSON.parse(data));
    });
});

