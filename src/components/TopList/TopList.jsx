import React from 'react';
import Top from "../Top/Top";

const TopList= function(props){
    return(
        <div >
            {props.tops.map((top, index)=>
                //проход по массиву вершин и вывод кадой вершины в виде компонента вершины
                <Top  key={top.id} index={index+1} top={top} choise={props.choise} hide={props.hide}/>
            )}
       </div>
    )

}
export default TopList;