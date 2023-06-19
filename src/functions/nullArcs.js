export const nullArcs=(arrows,SetArrows, nullArrowsIndexes,condition)=>{
    if(!condition){//если нужно сбросить обнуление
        arrows.map((arrow)=>{//проход по дугам
            if(arrow.null){//если свойство обнуления взведено
                //восстанавливаем ненулевое значение
                arrow.value=arrow.storageValue 
            }
            arrow.null=false
        })
    }else{
        //сброс у всех дуг свойства принадлежности крит пути
        arrows.map((arrow)=>{
            arrow.crit=false
        })
        //проход по массиву обнуленных индексов дуг
        nullArrowsIndexes.map((arrowIndex)=>{
            //обнуляем дугу
            arrows[arrowIndex].null=true
            //сохраняем старое ненулевое значение
            arrows[arrowIndex].storageValue=arrows[arrowIndex].value
            //делаем текущим нулевое значение
            arrows[arrowIndex].value=0
        })
    }
    SetArrows([...arrows])
}