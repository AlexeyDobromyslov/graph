import React, {useEffect} from 'react';
import'./styles.css';

const ControlButton=({onClick, content})=>{
    
    
    
    
 return(

<div className='controlButton' onClick={onClick}>
{content}
</div>
 );
}

export default ControlButton;