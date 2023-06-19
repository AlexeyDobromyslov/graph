import React, {useState} from 'react';
import './styles.css'





const InfoIcon= function(props){
    const color=props.condition?"rgb(222,67,123)":"teal"
    return(
      <div className='center' >
      <svg width="40px" height="40px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <g>
                  <circle cx="16" cy="16" fill="none"  r="10" stroke={color}  strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                  <line fill="none" stroke={color}  strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="16" x2="16" y1="14" y2="22"/>

                  <line fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="16" x2="16" y1="10" y2="10"/>
                  
              </g>
      </svg>
              
            </div>


    )

}
export default InfoIcon;

