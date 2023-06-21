import React, {useState} from 'react';
import './styles.css'

const BackIcon= function(props){
    return(
      <div title="пред. этап" className='center' >
        <svg className="logoRun" width="40px" height="40px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <g>
            <circle cx="16" cy="16" fill="none"  r="10"   strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
            <polyline   points="11.6 16 18.6 11 18.6 21 11.6 16"  strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
          </g>
        </svg>
      </div>
    )
}
export default BackIcon;


