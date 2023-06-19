export const getIndexesOfConnectedTopsArray=(tops,arrows)=>{
    let ArrayOfConnectionTopsIndexes=[]//массив объектов связей
    let index1, index2 //индексы вершин, которые соединяет дуга
    arrows.map((arrow,index)=>{ //проход по массиву дуг
        //получение индексов вершин у дуги
        index1=tops.findIndex(top=>top.id==arrow.id1)
        index2=tops.findIndex(top=>top.id==arrow.id2)
        //добпвление в массив связей объекта
        ArrayOfConnectionTopsIndexes.push({
                                            arrowIndex: index, //индекс дуги
                                            parentIndex: index1, //индекс предшественника
                                            childIndex: index2,  //индекс последователя
                                            value: Number(arrow.value)   //значение дуги
                                        })
        
    })
    //сортировка массива по свойству arrowIndex
    ArrayOfConnectionTopsIndexes.sort((a,b)=>a.arrowIndex-b.arrowIndex)
    return ArrayOfConnectionTopsIndexes
}