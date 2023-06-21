import React from 'react';
import'./styles.css';

const ControlProc=({...props})=>{
 return(
<input type="text" {...props} className='controlProc' />
 );
}

export default ControlProc;