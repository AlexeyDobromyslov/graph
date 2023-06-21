import React, {useState} from 'react';
import './styles.css'

const AddIcon= function(props){
    const color=props.condition?"rgb(222,67,123)":"teal"
    return(
      <div title="добавить узел" className='center' >
         <svg width="30px" height="30px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <g>
            <circle cx="12" cy="12" fill="none"  r="10" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
            <line fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="12" x2="12" y1="17" y2="7"/>
            <line fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="7" x2="17" y1="12" y2="12"/>
        </g>
      </svg>
        
      </div>


    )

}
export default AddIcon;

