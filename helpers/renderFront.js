
import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { listAll } from '../api/actions/ListAll';
import App from '../front/components/App';

const RenderFront = (req, res) => {
    let indexHtml = path.resolve(__dirname, '../build/index.html');
    
    const context = {};
    const strApp = renderToString(
        <StaticRouter location={req.url} context={context}>
            <App />
        </StaticRouter>
    );
    
    fs.readFile(indexHtml, (err, data) => {
        if (err) {
            throw new Error(`Build Index File cannot be read: ${err.message}`);
        }

        let markup = data.toString();
            markup = markup.replace('<main id="app"></main>', `<main id="app">${strApp}</main>`);
        
        return res.status(200).send(markup);
    })
}

export default RenderFront;