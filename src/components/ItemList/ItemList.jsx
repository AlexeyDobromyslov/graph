import React, {useState,useMemo, useEffect}from 'react';
import TopList from '../TopList/TopList';
import ArrowList from '../ArrowList/ArrowList';


const ItemList= function({tops,arrows, SetArrows,SetOf, SetTry,arrowChoise, edge, choiseTopIndex,checkArrow,topSelect,arrow,tryToReplace}){
  const alreadyOneChoice=useMemo(()=>{
    if(choiseTopIndex<0){
      return false
    }
    return true
  },[isNonNegative(choiseTopIndex)])
  
  function isNonNegative(number){
    return number>=0?true:false
  }

  function choise(top, condition){//условие выбора второй вершины для построения стрелки
    
    if(!top.cond){//пропустить, если эта вершина уже выделенная
   if(!alreadyOneChoice){condition=false}//если ни один не выбран, то условия для потенциальной второй вершины ложное
   topSelect(top, false, false)
   if(condition&&checkArrow){
     buildArrow(top.x,top.y, top.id);
   }
   
   
   
}
    
    
    
  }

 

  function hide(top, topRef,event){
    let x,y;
    x=event.pageX-topRef.current.getBoundingClientRect().left-window.scrollX;
    y=event.pageY-topRef.current.getBoundingClientRect().top-window.scrollY;
    choise(top, false)
    SetOf([x,y])
    SetTry(true)
    
  }


  function checkPairId(id1, id2){
    let output
    output=arrows.find(arrow=>(arrow.id1==id1&&arrow.id2==id2)||(arrow.id2==id1&&arrow.id1==id2))
    if(output){
      return true
    }
    return false
  }

  function buildArrow(x,y,id){
    
     if(!checkPairId(id, arrow.id1)){
      const newArrow={
        ...arrow,
        id: Date.now(),
        x2: x,
        y2: y,
        id2: id,
        cond: false,
        deviation: 0
      }
      SetArrows([...arrows,newArrow])
     }
  }
  
  
    return(
        <div >

      <TopList tops={tops} choise={choise} hide={hide}/>
      <ArrowList arrows={arrows} choise={arrowChoise} edge={edge} />
       </div>


    )

}
export default ItemList;