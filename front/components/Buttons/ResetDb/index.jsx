import React, { useState } from 'react';

const ResetDb = (props) => {
    const [loading, setLoading] = useState(false);

    const stateHandler = typeof props.stateHandler == 'function' ? props.stateHandler : null;
    const resetEndpoint = `${process.env.API_ENDPOINT}/reset-db`;

    const handleClick = () => {
        if (loading) return false;
        
        setLoading(true);

        let data = {
            method: 'POST',
            body: JSON.stringify({ resetDb: 1 }),
            headers: { 'Content-Type': 'application/json' },
        }

        fetch(resetEndpoint, data).then(r => r.json()).then(({ data }) => {
            if (data) {
                stateHandler(data);
            }
        }).catch((err) => {
            console.log(`Err: ${err}`);

        }).finally(() => setLoading(false));
    }

    return(
        <button 
            className={`btn reset-db`} 
            type="button" 
            onClick={handleClick}
        >
            Reset DB
        </button>
    );
}

export default ResetDb;