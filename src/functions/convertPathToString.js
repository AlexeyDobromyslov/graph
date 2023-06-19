export const convertPathToString=(path)=>{
  let pathString='', i=0
  path.path.map((element)=>{//проход по всему пути
    //добавление элементов массива пути в строку
    if(i!=0){
      pathString+=`-${element}`
    }else{
      pathString+=`${element}`
    }
    i++;
  })
  //вернуть путь, сконвертированный в строку
  return pathString
}