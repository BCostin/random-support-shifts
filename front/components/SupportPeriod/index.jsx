import React from 'react';
import { formatSupportList } from '../../../helpers/supportList';

const SupportPeriod = (props) => {
    const supportPeriodDays = 10; // Total number of working days representing 2 weeks / 10 working days
    
    let supportList = formatSupportList(props.data);
    let supportListLength = supportList.length || 1; // Default Period is 1

    let full = supportListLength % supportPeriodDays == 0;

    let supportPeriod = Math.ceil(supportListLength / supportPeriodDays); // for each 10 working days, we display a new Support Period
        supportPeriod = supportPeriod < 1 ? 1 : supportPeriod;
    
    return(
        <div className="btn">Support Period {supportPeriod} {full ? 'Full' : 'Ongoing'}</div>
    );
}

export default SupportPeriod;