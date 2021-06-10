import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { getNextDayNoWeekend } from '../../../helpers/date';
import ResetDb from '../../components/Buttons/ResetDb';
import SupportList from '../../components/SupportList';
import WorkersList from '../../components/WorkersList';
import PickRandom from '../../components/Buttons/PickRandom';

let today = getNextDayNoWeekend(moment().format("YYYY-MM-DD"));

const Home = () => {
    const [workers, setWorkers] = useState([]);
    const [randomPicks, setRandomPicks] = useState([]);
    const [supportDay, setSupportDay] = useState(today);
    const [supportList, setSupportList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [canSave, setCanSave] = useState(false);

    const allEndpoint = `${process.env.API_ENDPOINT}/engineers`;
    const randomEndpoint = `${process.env.API_ENDPOINT}/random`;
    const saveEndpoint = `${process.env.API_ENDPOINT}/save`;

    useEffect(() => {
        if (!workers.length) {
            fetch(allEndpoint, { method: 'GET' })
            .then(r => r.json()).then(({ data }) => {
                if (data && data.workers) {
                    handleInitialList(data);
                }
                
            }).finally(() => setLoading(false));
        }

    }, []);

    const handleInitialList = (data) => {
        setWorkers(data.workers);
        setSupportList(data.support);
        
        if (data.nextSupportDay) {
            setSupportDay(data.nextSupportDay);
        }
    }

    const resetDbHandler = (data) => {
        handleInitialList(data);
        setSupportDay(today);
        setSupportList([]);
    }

    const randomPickStateHandler = (data, workers, canSave) => {
        if (data) setRandomPicks(data);
        if (workers) setWorkers(workers);
        if (canSave != undefined) setCanSave(canSave);
    }

    const saveRandomWorkers = () => {
        // Stop here if we didn't randomly choose 2 workers
        if (!randomPicks.length || loading || !canSave) return false;

        setLoading(true); // Start loading / Avoid spam

        let rows = [];
        randomPicks.forEach(item => {
            let row = {
                worker_id: item,
                supportDay: supportDay,
                status: 1,
            };
            rows.push(row);
        });

        let data = {
            method: 'POST',
            body: JSON.stringify({ rows: rows, supportDay: supportDay }),
            headers: { 'Content-Type': 'application/json' },
        }

        fetch(saveEndpoint, data).then(r => r.json()).then(({ data }) => {
            if (data) {
                handleInitialList(data);
                setSupportList(data.support);
            }

        }).finally(() => {
            setLoading(false);
            setCanSave(false);
            setSupportDay(getNextDayNoWeekend(supportDay, 1));
        });
    }

    // A basic loader, not really needed but it's good practice
    // if (loading) {
    //     return <div className="loading">Loading ...</div>
    // }

    let friendlyDate = moment(supportDay).format('dddd Do MMMM');
    return(
        <>
            <div className="main-nav">
                <h2>Pick 2 Humans for Support Shift on {friendlyDate} ({supportDay})</h2>

                <PickRandom 
                    workers={workers} 
                    supportDay={supportDay}
                    stateHandler={randomPickStateHandler}
                />

                <button 
                    className={`btn btn-random ${!canSave ? 'disabled' : ''}`} 
                    type="button" 
                    onClick={saveRandomWorkers}
                >
                    Save for {supportDay}
                </button>

                <ResetDb stateHandler={resetDbHandler} />
            </div>

            <WorkersList data={workers} />
            
            <SupportList data={supportList} />
        </>
    );
}

export default Home;