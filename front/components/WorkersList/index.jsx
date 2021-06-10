import React from 'react';

let WorkersList = (props) => {
    let workers = props.data;

    return(
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
        
    );
}

export default WorkersList;