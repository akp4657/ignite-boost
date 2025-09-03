const path = require('path');
const express = require('express');
const app = express();
const port = 3000;

// Serve static files from the Angular dist directory
app.use('/assets', express.static(path.resolve(`${__dirname}/../dist/browser/assets`)));
app.use(express.static(path.resolve(`${__dirname}/../dist/browser`)));

// API endpoint
app.get('/api/data', (req, res) => {
    res.json({ message: 'Hello from express' });
});

// Catch-all route ot serve Angular's index.html
app.get('/{*splat}', (req, res) => {
    console.log(`${__dirname}/../dist/browser/index.html`);
    res.sendFile(path.resolve(`${__dirname}/../dist/browser/index.html`));
});

app.listen(port, () => {
    console.log(`Server running at http://locahost:${port}`);
});