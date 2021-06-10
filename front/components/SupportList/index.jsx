import React from 'react';

let SupportList = (props) => {
    const formatList = (data) => {
        if (!data) return [];
        let format = [];
        let dates = {};
        data.forEach(item => {
            if (!dates[item.support_day]) {
                dates[item.support_day] = item.name;
            } else {
                dates[item.support_day] += ` + ${item.name}`;
            }
        })
        
        if (dates) {
            let keys = Object.keys(dates);
            for (let k in keys) {
                format.push({ day: keys[k], names: dates[keys[k]]});
            }

        }
        return format;
    }

    const supportList = formatList(props.data);

    return(
        <section className="saved-list">
            {(!supportList || !supportList.length) ? 'Press the "Random Pick" then "Save"' :
                <table>
                    <thead>
                        <tr>
                            <th>Support Day</th>
                            <th>Real Heroes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {supportList.map((item, i) => {
                            return(
                                <tr key={i}>
                                    <td>{item.day}</td>
                                    <td>{item.names}</td>
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