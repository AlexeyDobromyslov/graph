import React, {useState} from 'react';
import './styles.css'

const RightIcon= function(props){
    return(
      <div title="искривить дугу" className='center' >
        <svg className='logoArrow' width="40px" height="40px" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
          <g>
            <polyline fill="none"  points="22.4 12 28.5 18 22.4 24"  strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.3"/>
            <line fill="none"  strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.3" x1="28.5" x2="7.5" y1="18" y2="18"/>
          </g>
        </svg>
      </div>
    )

}
export default RightIcon;

