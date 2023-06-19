import React, {useEffect} from 'react';
import'./styles.css';

const Setting=({checked, onClick,content})=>{
    
       
    
    
 return(

<div className={`item ${checked?'active':'nonActive'}`} onClick={onClick}>
{content}
</div>
 );
}

export default Setting;
/*<input type="checkbox" class="check" id={props.value} {...props}/> 
      <label htmlFor={props.value}>{props.content}</label>*/