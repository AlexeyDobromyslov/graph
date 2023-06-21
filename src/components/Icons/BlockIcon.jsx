import React, {useState} from 'react';
import './styles.css'
const BlockIcon= function(props){
  const color=props.condition?"rgb(222,67,123)":"teal"
  if(props.condition){
    return(
      <div title="фиксировать дуги" className='center'>
        <svg width="30px" height="30px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <g>
          <rect fill="none" height="10" rx="2" ry="2" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="16" x="4" y="11"/>
          <path d="M16.5,11V8h0c0-2.8-.5-5-4.5-5S7.5,5.2,7.5,8h0v3" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
          </g>
        </svg>
      </div>


    )
  }else{
    return(
      <div title="не фиксировать дуги" className='center'>
        <svg width="30px" height="30px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <g>
            <rect fill="none" height="10" rx="2" ry="2" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="16" x="4" y="11"/>
            <path d="M16.5,11V8h0c0-2.8-.5-5-4.5-5" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
          </g>
        </svg>
      </div>
    )
  }
}
export default BlockIcon;

