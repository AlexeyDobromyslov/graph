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