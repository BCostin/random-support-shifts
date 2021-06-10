import React, { useState } from 'react';

let PickRandom = (props) => {
    const [loading, setLoading] = useState(false);

    const workers = props.workers;
    const supportDay = props.supportDay;
    const stateHandler = typeof props.stateHandler == 'function' ? props.stateHandler : null;

    const updateShiftsEndpoint = `${process.env.API_ENDPOINT}/update-shifts`;
    const randomEndpoint = `${process.env.API_ENDPOINT}/random`;

    const randomPickHandler = async () => {
        if (loading) return false;

        setLoading(true);

        let random = await randomPick(workers);
        if (!random || !random.length) {
            await updateAvailability();
            await randomPick(workers);
        }
        
        setLoading(false);
    }

    const randomPick = async (humans) => {
        if (!humans) console.warn('Missing humans');
        
        let data = {
            method: 'POST',
            body: JSON.stringify({ supportDay: supportDay }),
            headers: { 'Content-Type': 'application/json' },
        }

        return fetch(randomEndpoint, data).then(r => r.json()).then(({ data }) => {
            // Reset availability just for frontend
            let visualWorkers = humans.map(item => {
                item.available = 1;
                return item;
            });

            // If we have 2 new random humans, we will make them unavailable
            if (data) {
                humans.forEach((item, i) => {
                    if (data.indexOf(item.id) !== -1) {
                        visualWorkers[i].available = 0;
                    }
                })
                
                // This will allow you to visualize which humans have been picked
                stateHandler(data, visualWorkers, (data.length ? true : false));
            }

            return data;

        }).catch(err => {
            console.log(`Random Pick Err: ${err}`);
        });
    }

    const updateAvailability = async () => {
        let params = {
            method: 'POST',
            body: JSON.stringify({ supportDay: supportDay }),
            headers: { 'Content-Type': 'application/json' },
        }
        
        return fetch(updateShiftsEndpoint, params).then(r => r.json()).then(({ data }) => {
            if (data && data.workers) {
                stateHandler(null, data.workers);
            }
            
            return data;

        }).catch(err => {
            console.log(`Update Err: ${err}`);
        });
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