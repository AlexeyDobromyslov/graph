import React, {useState} from 'react';
import './styles.css'





const RunIcon= function(props){
    return(
      <div title="след. этап" className='center' >
<svg className="logoRun" width="40px" height="40px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
<g>
            <circle cx="16" cy="16" fill="none"  r="10"   strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
            <polyline   points="20.6 16 13.6 11 13.6 21 20.6 16"  strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
            
        </g>
</svg>
        
      </div>


    )

}
export default RunIcon;
/* <path d="M 21.6 16 l -8 -6 l 0 12 l 8 -6"   strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" />*/

