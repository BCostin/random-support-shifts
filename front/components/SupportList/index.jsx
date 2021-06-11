import React from 'react';
import { formatSupportList } from '../../../helpers/supportList';

let SupportList = (props) => {
    const supportList = formatSupportList(props.data);

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