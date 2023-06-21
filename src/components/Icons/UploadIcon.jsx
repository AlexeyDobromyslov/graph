import React, {useState} from 'react';
import './styles.css'

const UploadIcon= function(props){
    return(
      <div title="загрузить граф" className='center' >
        <svg className='logoArrow' width="40px" height="40px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <g>
            <path d="M3,12.3v7a2,2,0,0,0,2,2H19a2,2,0,0,0,2-2v-7" fill="none"    strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
              <g>
                <polyline  fill="none"  points="7.9 8.7 12 4.7 16.1 8.7"    strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                <line fill="none"    strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="12" x2="12" y1="17.3" y2="4.7"/>
              </g>
          </g>
        </svg>
      </div>
    )
}
export default UploadIcon;


