import { maxPathesIndexes } from "./maxPathesIndexes"
export const criticalPathes=(arrows,SetArrows, pathes,condition)=>{
    //condition - выделить или сбросить критические пути
    let arrowIndexes=[], uniq=[], critPathes=[],min=-1
    if(!condition){//если нужно перестать высвечивать крит пути
        //проход по всем душам и сброс свойства крит пути 
        arrows.map((arrow)=>{
            arrow.crit=false
        })
    }
    else{
        critPathes=maxPathesIndexes(pathes)//получение индексов критическмх путей
        critPathes.map((indexCrit)=>{ //проход по крит пути
            //добавление в массив индекса текущей дуги
           arrowIndexes=[...arrowIndexes,...pathes[indexCrit].arrowIndexes] 
        })
        uniq=[...new Set(arrowIndexes)]//создание массива без дубликатов индексов
        arrows.map((arrow)=>{//сброс на всех дугах свойства крит пути
            arrow.crit=false
        })
        uniq.map((index)=>{//выставление свойства крит пути на дугах с полученными индексами
            arrows[index].crit=true
        })
    }
    SetArrows([...arrows])//сохранить изменение в массиве дуг
}