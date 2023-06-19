import React, {useState} from 'react';
import './styles.css'





const ChoisePathIcon= function(props){
    const color=props.condition?"rgb(222,67,123)":"teal"
    if(!props.condition){
    return(
      <div title="первый крит. путь" className='center' >
      <svg width="40px" height="40px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <g>
                  
                  <line fill="none" stroke={color}  strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="8" x2="8" y1="6" y2="26"/>
                  <line fill="none" stroke={color}  strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="16" x2="16" y1="16" y2="26"/>
                  <line fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="24" x2="24" y1="21" y2="26"/>
                  
              </g>
      </svg>
              
            </div>


    )
    }else{
        return(
            <div title="последний крит. путь" className='center' >
                <svg width="40px" height="40px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <g>
                        <line fill="none" stroke={color}  strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="8" x2="8" y1="21" y2="26"/>
                        <line fill="none" stroke={color}  strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="16" x2="16" y1="16" y2="26"/>
                        <line fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="24" x2="24" y1="6" y2="26"/>  
                    </g>
                </svg>  
            </div>
      
      
          )
    }

}
export default ChoisePathIcon;

