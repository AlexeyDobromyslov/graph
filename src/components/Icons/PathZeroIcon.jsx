import React, {useState} from 'react';
import './styles.css'





const PathZeroIcon= function(props){
    const color=props.condition?"rgb(222,67,123)":"teal"
    
    return(
      <div title="режим вывода" className='center'>
       
       <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="17" cy="7" fill="none" stroke={color}  r="3"   strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
      <circle cx="7" cy="17" fill="none" stroke={color}  r="3"   strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
      <path d="M 10 14 l 4 -4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      
      </div>


    )


}
export default PathZeroIcon;

/*d="M8.12132 15.8787
C 7.57843 15.3358 6.82843 15 6 15
C 4.34315 15 3 16.3431 3 18
C 3 19.6569 4.34315 21 6 21
C 7.65685 21 9 19.6569 9 18
C 9 17.1716 8.66421 16.4216 8.12132 15.8787
Z
M 8.12132 15.8787
L 15.8787 8.12132M15.8787 8.12132C16.4216 8.66421 17.1716 9 18 9
C 19.6569 9 21 7.65685 21 6
C 21 4.34315 19.6569 3 18 3
C 16.3431 3 15 4.34315 15 6
C 15 6.82843 15.3358 7.57843 15.8787 8.12132 
Z
M 15.8787 8.12132
L 15.8828 8.11719"  */
