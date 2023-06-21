import React, {useState} from 'react';
import './styles.css'

const MoveIcon= function(props){
    const color=props.condition?"rgb(222,67,123)":"teal"
    return(
      <div title="перенести кликом" className='center'>
         <svg width="30px" height="30px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <g>
           
            <circle cx="12" cy="12" fill="none"  r="10" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
            <polyline fill="none" stroke={color} points="10 7 12 5 14 7"  strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
            <polyline fill="none" stroke={color} points="10 17 12 19 14 17"  strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
            <line fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="12" x2="12" y1="17" y2="7"/>
            <polyline fill="none" stroke={color} points="7 14 5 12 7 10"  strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
            <polyline fill="none" stroke={color} points="17 14 19 12 17 10"  strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
            <line fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="7" x2="17" y1="12" y2="12"/>
            
          </g>
        </svg>
      </div>
    )
}
export default MoveIcon;

