import { checkArcInPath } from "./checkArcInPath"
export const addTableColumn=(table,iter,arc,arcValue,pathes,targetPathIndex, condBuild)=>{
  let end=condBuild==3?true:false
  let styleCondition
    //добавление в новый столбец ячейки номера шага
    table[0].push({value: !end?`${iter+1} (-${Number(arcValue)})`:'Итог:',condition:-1})
    let i=1
    pathes.map((path,index)=>{//проход по всем путям
      if(checkArcInPath(path,arc)&&!end){//путь включает дугу и это не конец таблицы?
        //текущий индекс прохода равен индексу целеыого и пути и метод работает ещё по критическому пути?
        if(targetPathIndex==index&&condBuild==0){
          table[i].push({value: path.pathLength, condition: 2})
        }
        else{
          table[i].push({value: path.pathLength, condition: 1}) 
        }
        path.pathLength-=arcValue//вычет из текущей длины пути значения обнуленной дуги
      }
      else{
        table[i].push({value: path.pathLength, condition: 0})
      }
      i++
    })
    switch(condBuild){
      case 0: styleCondition=-4; break;
      case 1: styleCondition=-6; break;
      case 2: styleCondition=-7; break;
      case 3: styleCondition=-4; break;
      default: styleCondition=-4; 
    }
    //добавление ячейки со значением обнуленной дуги
    table[i].push({value: !end?`${arc.start}-${arc.end}`:'',condition: styleCondition})
}