import React from 'react';
import'./styles.css';

const ControlInput=({...props})=>{
    
    
    
    
 return(
<input type="text" {...props} className='controlInput' maxLength='40'/>
 );
}

export default ControlInput;