import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { getNextDayNoWeekend } from '../../../helpers/date';
import ResetDb from '../../components/Buttons/ResetDb';

let today = getNextDayNoWeekend(moment().format("YYYY-MM-DD"));
let tmr = moment().add(1, 'days').format("YYYY-MM-DD");

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

    useEffect(() => {
        // FORMAT ARRAY WITH 1 date and 2 workers, every time we get/update it

    }, [supportList]);

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

    const randomPickHandler = () => {
        if (loading) return false;

        setLoading(true);

        let data = {
            method: 'POST',
            body: JSON.stringify({ supportDay: supportDay }),
            headers: { 'Content-Type': 'application/json' },
        }

        fetch(randomEndpoint, data).then(r => r.json()).then(({ data }) => {
            // Here we reset availability just visually
            let visualWorkers = workers.map(item => {
                item.available = 1;
                return item;
            });

            // Now if we have 2 new random humans, we will make them unavailable
            if (data) {
                setRandomPicks(data);
                workers.forEach((item, i) => {
                    if (data.indexOf(item.id) !== -1) {
                        visualWorkers[i].available = 0;
                    }
                })

                // Enable Save Button
                setCanSave(true);
            }

            // This will allow you to visualize which humans have been picked
            setWorkers(visualWorkers);

        }).finally(() => setLoading(false));
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
            row = null;
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
            setCanSave(false); // Disable Save Button
            setSupportDay(getNextDayNoWeekend(supportDay, 1));
        });
    }

    if (loading) {
        return <div className="loading">Loading ...</div>
    }

    return(
        <>
            <div className="main-nav">
                {/* <div className="days-nav">
                    <button className="btn prev" type="button" onClick={goPrevDay}>Previous Day</button>
                    <button className="btn next" type="button" onClick={goNextDay}>Next Day</button>
                </div> */}
                <h2>Pick 2 Humans for Support Shift on {moment(supportDay).format('dddd Do MMMM')} ({supportDay})</h2>
                <button className="btn btn-random" type="button" onClick={randomPickHandler}>Random Pick</button>
                <button 
                    className={`btn btn-random ${!canSave ? 'disabled' : ''}`} 
                    type="button" 
                    onClick={saveRandomWorkers}
                >
                    Save for {supportDay}
                </button>

                <ResetDb stateHandler={resetDbHandler} />
            </div>

            <section className="workers-list-wrap">
                {workers ? 
                    <ul className="workers-list">
                        {workers.map((item, i) => {
                            return(
                                <li key={i} className={item.available == 1 ? 'green' : 'red'}>
                                    {item.name} 
                                    <span className="total-shifts">{item.totalShifts}</span>
                                </li>
                            );
                        })}
                    </ul>
                : (
                    <div className="">No Heros for Support Shifts</div>
                )}
            </section>

            <section className="saved-list">
                {!supportList.length ? 'Press the "Random Pick" button first!' :
                    supportList.map((item, i) => {
                        // let str = '';
                        // item.workers.forEach(worker => str += worker.name + ' - ');
                        // str += item.day;

                        return(
                            <div 
                                key={i} className="pair-row"
                                data-id={item.worker_id}
                            >
                                {item.support_day + ' - ' + item.name + ' - ' + item.available_on}
                            </div>
                        );
                    })
                }
            </section>
        </>
    );
}

export default Home;