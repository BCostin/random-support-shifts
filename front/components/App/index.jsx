import React from 'react';
import { Switch, Route } from 'react-router';
import Home from '../../screens/Home';

const App = () => {
    return(
        <div className="container">
        <Switch>
            <Route to="/" component={Home} />
        </Switch>
        </div>
    );
}

export default App;