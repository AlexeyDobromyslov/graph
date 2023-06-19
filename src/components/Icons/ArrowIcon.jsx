import React, {useState} from 'react';
import './styles.css'





const ArrowIcon= function(props){
    const color=props.condition?"rgb(222,67,123)":"teal"
    return(
      <div title="добавить дугу" className='center'>
         
         <svg width="30px" height="30px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<g>
<polyline fill="none"  points="11.6 18.7 18.7 18.7 18.7 11.6" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
<line fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="5.3" x2="17.1" y1="5.3" y2="17.1"/>
</g>
</svg>
        
      </div>


    )

}
export default ArrowIcon;

