export const checkArcInPath=(pathObject, arc)=>{
    let path=pathObject.path//массив вершин, составляющих путь
    for(let j=0; j<path.length-1;j++){//проход по по этому пути
        //если два последовательно идущих элемента связаны дугой arc
        if(arc.start==path[j]&&arc.end==path[j+1]){
            return true//выйти из функции
        }
    }
    return false
}