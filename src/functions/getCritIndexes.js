export const getCritIndexes=(tops,arrows)=>{
    let conditionsTops=[]//массив отслеживания для каждой вершины
      let firstIndex, lastIndex
      let withoutParent=[], //массив вершин без предшественников
          withoutChild=[], //массив вершин без последователей
          isolate=[], //массив вершин изолированных
          critIndexes=[]
      for(let i=0;i<tops.length;i++){//заполнение массива отслеживания
        conditionsTops.push([false,false])
      }
      arrows.forEach((arrow)=>{//проход по всем дугам
        //получение индексов вершин, которые соединяет дуга
        firstIndex=tops.findIndex(top=>top.id==arrow.id1)
        lastIndex=tops.findIndex(top=>top.id==arrow.id2)
        if(conditionsTops[firstIndex][1]==false){
          conditionsTops[firstIndex][1]=true // у этой вершины есть исходящая дуга
        }
        if(conditionsTops[lastIndex][0]==false){
          conditionsTops[lastIndex][0]=true //у этой вершины есть входящая дуга
        }
      })
      
      conditionsTops.map((conditions,index)=>{//проход по массиву отслеживания
        if(conditions[0]==false&&conditions[1]==true){//вершины без предшественников
          withoutParent.push(index)
        }
        if(conditions[0]==false&&conditions[1]==false){//вершины изолированные
          isolate.push(index)
        }
        if(conditions[0]==true&&conditions[1]==false){//вершины без последователей
          withoutChild.push(index)
        }

      })
      if(withoutParent.length>1){//если количество вершин без предшественников больше одного
        critIndexes=[...critIndexes,...withoutParent]//запоминаем их индексы
      }
      if(isolate.length>0){//если есть изолированные
        critIndexes=[...critIndexes,...isolate]//запоминаем их индексы
      }
      if(withoutChild.length>1){//если количество вершин без последователей больше одного
        critIndexes=[...critIndexes,...withoutChild]//запоминаем их индексы
      }
      //вернуть ошибочные индексы
      return critIndexes
}