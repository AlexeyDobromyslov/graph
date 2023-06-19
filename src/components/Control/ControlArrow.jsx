import React, {useEffect} from 'react';
import'./styles.css';

const ControlArrow=({onMouseDown,onMouseOut, onMouseUp, content})=>{
    
    
    
    
 return(

<div className='controlButton' onMouseDown={onMouseDown} onMouseOut={onMouseOut} onMouseUp={onMouseUp}>
{content}
</div>
 );
}

export default ControlArrow;