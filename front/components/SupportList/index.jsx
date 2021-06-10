import React from 'react';

let SupportList = (props) => {
    let supportList = props.data;

    return(
        <section className="saved-list">
            {(!supportList || !supportList.length) ? 'Press the "Random Pick" then "Save"' :
                <table>
                    <thead>
                        <tr>
                            <th>Support Day</th>
                            <th>Name</th>
                            <th>Next Availability</th>
                        </tr>
                    </thead>
                    <tbody>
                        {supportList.map((item, i) => {
                            return(
                                <tr key={i}>
                                    <td>
                                        <div 
                                            className="pair-row"
                                            data-id={item.worker_id}
                                        >
                                            {item.support_day}
                                        </div>
                                    </td>
                                    <td>{item.name}</td>
                                    <td>{item.available_on}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            }
        </section>
    );
}

export default SupportList;