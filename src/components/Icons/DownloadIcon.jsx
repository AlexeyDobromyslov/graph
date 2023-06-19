import React, {useState} from 'react';
import './styles.css'





const DownloadIcon= function(props){
    return(
      <div title="скачать граф" className='center' >
        
        <svg className='logoArrow' width="40px" height="40px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <g>
            <path d="M3,12.3v7a2,2,0,0,0,2,2H19a2,2,0,0,0,2-2v-7" fill="none"    strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
              <g>
                <polyline  fill="none"  points="7.9 13.3 12 17.3 16.1 13.3"    strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                <line fill="none"    strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="12" x2="12" y1="4.7" y2="16.2"/>
              </g>
          </g>
        </svg>
        
      </div>


    )

}
export default DownloadIcon;


