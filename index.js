import "core-js/stable";
import "regenerator-runtime/runtime";
import express from 'express';
import dotenv from 'dotenv';
import RenderFront from './helpers/renderFront';
import router from "./api/routes";
import { DB, initDatabase } from './api/db';

// Init env variables
dotenv.config();

const app = express();
const port = process.env.PORT;
const host = process.env.HOST;

app.use(express.json());

// Main route
app.get(['/', ''], async (req, res) => {
    try {
        RenderFront(req, res);
    } catch(e) {
        res.status(500).send(`Front could not be rendered: ${e.message}`);
    }
});

// Serve static files (After main route so we don't server index.html directly)
app.use(express.static('build'));

// Set api routes
app.use('/api/v1', router);

// Return text if route not found
app.get('*', (req, res) => {
    res.status(404).send('Not found');
});

// Start server
app.listen(port, host, () => {
    console.log(`App running on port ${port} and host ${host}`);
})