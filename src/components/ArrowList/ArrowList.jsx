import React, {useState}from 'react';
import Arrow from "../Arrow/Arrow";

const ArrowList= function(props){
    return(
        <div >
            {props.arrows.map((arrow)=>
                //проход по массиву стрелок и вывод каждой стрелки в виде компонента стрелки
                <Arrow  key={arrow.id} arrow={arrow} choise={props.choise} edge={props.edge}/>
            )}
       </div>
    )

}
export default ArrowList;