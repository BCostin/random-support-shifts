import React, { useState } from 'react';

let PickRandom = (props) => {
    const [loading, setLoading] = useState(false);

    const workers = props.workers;
    const supportDay = props.supportDay;
    const randomEndpoint = `${process.env.API_ENDPOINT}/random`;
    const stateHandler = typeof props.stateHandler == 'function' ? props.stateHandler : null;


    const randomPickHandler = () => {
        if (loading) return false;

        setLoading(true);

        let data = {
            method: 'POST',
            body: JSON.stringify({ supportDay: supportDay }),
            headers: { 'Content-Type': 'application/json' },
        }

        fetch(randomEndpoint, data).then(r => r.json()).then(({ data }) => {
            // Reset availability just for frontend
            let visualWorkers = workers.map(item => {
                item.available = 1;
                return item;
            });

            // If we have 2 new random humans, we will make them unavailable
            if (data) {
                workers.forEach((item, i) => {
                    if (data.indexOf(item.id) !== -1) {
                        visualWorkers[i].available = 0;
                    }
                })
                
                // This will allow you to visualize which humans have been picked
                stateHandler(data, visualWorkers, (data.length ? true : false));
            }

        }).finally(() => setLoading(false));
    }

    return(
        <button  
            type="button"
            className="btn btn-random" 
            onClick={randomPickHandler}
        >
            Random Pick
        </button>
    );
}

export default PickRandom;