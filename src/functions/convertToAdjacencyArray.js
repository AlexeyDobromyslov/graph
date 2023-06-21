export const convertToAdjacencyArray=(tops,arrows)=>{
    let adjacencyArray=[] //переменная массива смежности
    let trackArray=Array(tops.length).fill(-1)//массив отслеживания вершин
    let index1, index2
    let iter=0
    arrows.map((arrow,arrowIndex)=>{//проход по всем дугам
        index1=tops.findIndex(top=>top.id==arrow.id1)//индекс вершины начала дуги
        index2=tops.findIndex(top=>top.id==arrow.id2)//индекс вершины конца дуги
        if(trackArray[index1]==-1){//если индекс вершины начала ещё не встречался
            //добавление нового элемента в массив смежности
            adjacencyArray.push({
                                    parent: index1,//индекс вершины
                                    //индекс последующей вершины
                                    //индекс дуги
                                    //значение дуги
                                    childs: [[index2,arrowIndex,Number(arrow.value)]]
                                })
            trackArray[index1]=iter//помечаем, что вершина уже встречалась
            iter++

        }
        else{
            //добавление данных о последователе в массив последователей родительской вершины
            adjacencyArray[trackArray[index1]].childs.push([index2,arrowIndex,Number(arrow.value)])  
        }
    })
    adjacencyArray.sort((a,b)=>{//сортировка массива по родительским вершинам
        return a.parent-b.parent
    })
    return adjacencyArray//вернукть массив смежности
}
