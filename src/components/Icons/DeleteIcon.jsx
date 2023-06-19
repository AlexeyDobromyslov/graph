import React, {useState} from 'react';
import './styles.css'





const DeleteIcon= function(props){
    const color=props.condition?"rgb(222,67,123)":"teal"
    return(
      <div title="удалить элемент" className='center'>
         
         <svg width="30px" height="30px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <g>
            <line fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" x1="18.5" x2="5.5" y1="5.5" y2="18.5"/>
            <line fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" x1="18.5" x2="5.5" y1="18.5" y2="5.5"/>
          </g>
        </svg>
        
      </div>


    )

}
export default DeleteIcon;

