import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

// Import main React App Component-Container
import App from './components/App';

// Hydrate dom because the app is already rendered Server-Side (avoid double-rendering)
hydrate(
    <Router>
        <App />
    </Router>,
    document.getElementById('app')
);