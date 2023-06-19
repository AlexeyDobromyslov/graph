export const maxPathesIndexes=(pathes)=>{
    let maxLen=-1,//текущий максимум
        maxPathIndexes=[]//массив с индексами самых длинных путей
    pathes.map((path, indexPath)=>{//проход по массиву путей
      if(path.pathLength==maxLen){//если длина текущего пути равна максимальной, добавить в массив
        maxPathIndexes.push(indexPath)
      }
      if(path.pathLength>maxLen){//если длина текущего пути больше максимальной
        maxLen=path.pathLength //новый максимум
        maxPathIndexes=[indexPath]//создать новый массив
      }
    })
    return maxPathIndexes
}