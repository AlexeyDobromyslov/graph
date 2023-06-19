import { convertToAdjacencyArray } from "./convertToAdjacencyArray"

export const getAllPath=(tops,arrows)=>{
  let adjacencyArray=convertToAdjacencyArray(tops,arrows)//получение массива смежности
  const paths=[{//переменная массива объектов путей
                //начальный объект для работы алгоритма
                path:[1],//массив вершин, принадлежащие пути
                pathLength: Number(tops[0].value),//длина пути
                arrowIndexes:[]//массив индексов дуг в массиве дуг
              }]
              
  let end=tops.length //длина массива объектов вершин равна индексу последнего элемента+1 
  let exit=false
  while(!exit){
    let oldLength=paths.length //длина массива путей
    let trackEnd=[] //массив отслеживани выхода
    for(let i=0;i<oldLength;i++){//проход по полученной длине
      let newConnects=[]//массив связей пред вершины с последующими
      let oldPath=[...paths[i].path]
      let oldPathLength=paths[i].pathLength
      let oldIndexes=[...paths[i].arrowIndexes]
      let localEnd=oldPath[oldPath.length-1]//последняя вершина в массиве объекта текущего пути
      if(localEnd!=end){//если последняя вершина текущего пути не равна последней вешине графа
        //массив всех последователей конечной вершины массива вершин текущего пути
        newConnects=adjacencyArray[localEnd-1].childs
        //if(newConnects.length>0){//если последователи есть
          for(let j=0;j<newConnects.length;j++){//проход по всем последователям
            if(j==0){
              //для первой итерации дополняем текущий путь
              paths[i].path.push(newConnects[j][0]+1)//+1 так как в пути содержатся индексы вершин +1
              //текущая длина пути + длина слудущей дуги+время следущей вершины
              paths[i].pathLength+=newConnects[j][2]+Number(tops[newConnects[j][0]].value)
              //добавление в массив дуг текущего объекта пути индекса новой дуги
              paths[i].arrowIndexes.push(newConnects[j][1])
            }else{
              //для последующих итераций дублируем старый путь и также дополняем
              const newPath={
                path: [...oldPath,newConnects[j][0]+1],
                //текущая длина пути + длина слудущей дуги+время следущей вершины
                pathLength: oldPathLength+newConnects[j][2]+Number(tops[newConnects[j][0]].value),
                //добавление в массив дуг текущего объекта пути индекса новой дуги
                arrowIndexes: [...oldIndexes,newConnects[j][1]]
              }
              paths.push(newPath)//добавляем дублированный путь с новым дополнением в массив путей
            }
          }
        //}
        
      }
      else{
        //если путь достиг конца добавляем в массив отслеживания элемент
        trackEnd.push(true)
      }
    }
    if(paths.length>1024){
      exit=true
      return "error"
    }
    if(trackEnd.length>=paths.length){
      //если длина массива остлеживания будет равна длине массива объектов путей
      //то это будет означать, что все пути уже достигли конечной вершины
      exit=true
    }
  }
      return paths;
}