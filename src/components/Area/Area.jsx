import React, {useState,useRef,useMemo,useEffect} from 'react';
import TopList from '../TopList/TopList';
import ArrowList from '../ArrowList/ArrowList';
import './styles.css'

const Area= function({choiseTopIndex,SetChoiseTop,
                      choiseArrowIndex,SetChoiseArrow,
                      arrows,SetArrows,
                      tops, SetTops,
                      topHalfSize, topLimit,
                      getAreaRef,...props}){
    
    
    const [tryToReplace, SetTry]=useState(false) //попытка перемещения
    const [offsetIntoElement, SetOf]=useState([0,0])//смещение внутри вершины
    const [arrow,SetArrow]=useState({x1: 0,y1: 0,x2: 0, y2: 0, id1: 0, id2: 0})//потенциальная стрелка
    const [areaParam,SetAreaParam]=useState({height: 600,width: 600})//начальны параметры размеров зоны
    const areaStyle={
                      height:`${areaParam.height}px`,
                      width: `${areaParam.width}px`
                    } // накладываемый стиль на зону
    
    
    const areaRef=useRef(); //для получения ссылки на зону
    const rightEdge=useRef(); //для получения ссылки на  правую границу зоны
    const bottomEdge=useRef(); //для получения ссылки на нижнюю границу зоны
    const observer=useRef(); //для получения ссылки на наблюдателя (используется в качестве хранения наблюдателя)
    const alreadyOneChoice=useMemo( //переменная "выбрана ли хотя бы одна вершина"
      ()=>{
            if(choiseTopIndex<0){ //если индекс выбранной вершины меньше нуля
              return false //значит ни одна не выбрана
            }
            return true  //хотя бы одна выбрана
          },
          [isNonNegative(choiseTopIndex)]) //пересчитывает каждый раз когда индекс выбранной вершины меняет знак
    
    function isNonNegative(number){//определение знака числа
      return number>=0?true:false 
    }
    useEffect(
      ()=>{
            props.getEdge(areaParam.width, areaParam.height)//передаёт данные о параметрах зоны родителю
          },
          [areaParam.height, areaParam.width]) //выполнять каждый раз при изменении хотя бы одного параметра
    useEffect(
      ()=>{
            getAreaRef(areaRef)//передает родителю ссылку на зону
          },[areaRef])  //выполнять каждый раз при изменении ссылки (отрабатывает только при появлении зоны)
    

    //ответственный за динамическое расширение зоны
    useEffect( 
      ()=>{
            if(observer.current){//если существует текущий наблюдатель
              observer.current.disconnect();//удалить наблюдателя
            }
            var callback = function(entries) { 
              if(entries.length==2){ //если замечено две границы
                if(entries[0].isIntersecting&&areaParam.height<=5000){ //если только пересекли нижнюю границу и высота зоны меньше 5000
                  SetAreaParam({...areaParam, height: 200+areaParam.height}) //установить высоту на 200 пикселей большу
                } 
                if(entries[1].isIntersecting&&areaParam.width<=5000){ //если только пересекли правую границу и ширина меньше 5000
                  SetAreaParam({...areaParam, width: 200+areaParam.width}) //установить ширину на 200 пикселей больше
                }
              }

              if(entries.length==1){ //если замечена одна граница
                if(entries[0].isIntersecting){ //если только пересекли эту границу
                  if(entries[0].target.className=='horline'&&areaParam.height<=5000){ //если это нижняя граница и высота меньше 5000
                    SetAreaParam({...areaParam, height: 200+areaParam.height}) //установить высоту на 200 пикселей больше
                  }
                  if(entries[0].target.className=='vertline'&&areaParam.width<=5000){//если это правая граница и ширина меньше 5000
                    SetAreaParam({...areaParam, width: 200+areaParam.width}) //установить ширину на 200 пикселей брольше
                  }
                }
              }
            }
            observer.current = new IntersectionObserver(callback);//создание наблюдателя
            observer.current.observe(bottomEdge.current) //наблюдатель следит за нижней границей
            observer.current.observe(rightEdge.current) //наблюдатель следит за правой границей
          },
          [areaParam.height,areaParam.width])//отрабатывать каждый раз при изменении размеров зоны


    //выключить реакцию браузера на событие нахождения перетаксиваемого элемента в пределах зоны
    function allowDrop(event){ 
      event.preventDefault();
    }

    //проверка нахождения вершины в пределах зоны
    function checkEdge(x,y){
        let areaHeight=areaRef.current.clientHeight// получение высоты зоны
        let areaWidth=areaRef.current.clientWidth//получение ширины зоны
        let topSize=topHalfSize*2 //размер вершины
        if(y>=0&&y+topSize<=areaHeight&&x>=0&&x+topSize<=areaWidth){//если в пределах зоны
          return true //вернуть истину
        }
        return false
    }


    //нормализация координат
    function convertXY(pageX,pageY){
      let leftEdge=areaRef.current.getBoundingClientRect().left+window.scrollX//поправки для перевода координат относительно 
      let topEdge=areaRef.current.getBoundingClientRect().top+window.scrollY//клиентской области в к-ты относительно html-документа
      let x=pageX-leftEdge//перевод координат
      let y=pageY-topEdge//перевод координат
      return [x,y]
    }
    
    //обработчик события сброса элемента
    function drop(event){
      let offsetX=props.try?props.offset[0]:offsetIntoElement[0]  //если была попытка добавления вершины с помощью 
      let offsetY=props.try?props.offset[1]:offsetIntoElement[1]  //перетаксивания используется смещение при добавлениии 
      let [x,y]=convertXY(event.pageX-offsetX,event.pageY-offsetY)//иначе используется смещение, полученное при захвате
                                                                  //элемента при попытке перемещения                                                     
        let setx=x+topHalfSize //к-ты центра вершин
        let sety=y+topHalfSize
        let nextId //переменная для хранения id перетаскивемой вершины

        let style0={  //стиль, устанавливающий положение вершины
          top: `${y}px`,
          left: `${x}px`
        }
       
        if(checkEdge(x,y)){ //проверка пределов зоны
          if(!props.try){//если закончили перетаскивать и это не добавление
            if(tryToReplace){//проверка на то, что перетаскивали именно вершину
              tops[choiseTopIndex]={...tops[choiseTopIndex], style: style0, x: setx, y: sety}//изменение к-т выбранной вершины
              SetArrow({...arrow,x1: setx, y1: sety}) //изменение к-т начала потенциальной стрелки
              SetTops([...tops])//сохранение изменений
              nextId=tops[choiseTopIndex].id//сохранение id
              if(!props.checkFix){//если фиксация стрелок у вершин выключена
                SetArrows(arrows.filter(arrow=>arrow.id1!==nextId&&arrow.id2!==nextId))//удалить стрелку
              }
              else{
                arrows.map(//цикл по массиву стрелок
                  arrow=>{
                    //если перемещена вершина начала стрелки
                    if(arrow.id1===nextId){
                      arrow.x1=setx
                      arrow.y1=sety
                    }
                    else{
                      //если перемещена вершина конца стрелки
                      if(arrow.id2===nextId){
                        arrow.x2=setx
                        arrow.y2=sety
                      }
                    }
                  }
                )
                SetArrows([...arrows])//сохранение измененного массива стрелок
              }
              SetTry(false)//перемещение закончилось
            } 
          }
          else{//добавление вершины перетаскиванием
            
              buildTop(setx,sety,style0)//построение новой вершины
            
          }
      }
    }
    function buildTop(setx,sety,style0){
      //если кол-во вершин равно или больше заданного, то ничего не строить
      if(tops.length>=topLimit){
        return false
      }

      let id=Date.now()//получение уникального значеня, зависящее от текущего времени
      const newTop={    //объект новой вершины
        id: id,         //идентификатор вершины
        style: style0,  //стили с координатами
        x:setx,         //координаты центра
        y:sety,
        value: 1,       //временная характеристика по умолчанию
        error: false    //сигнализация об ошибке
      }
      topSelect(newTop,true, false)// построенная вершина становится выбранной

    }

    //обработчик события нажатия на зону
    function addClick(event){ 

      
      tops.map((top=>{top.error=false}))//проход по массиву вершин и сброс свойства ошибки у всех элементов
      SetTops([...tops])                //сохранение изменённого массива

      if(props.add){//если режим добавления включен
        let [setx,sety]=convertXY(event.pageX,event.pageY)//нормализация координат центра вершины
        let x=setx-topHalfSize,y=sety-topHalfSize//получение координат для позиционирования
        if(!checkEdge(x,y)){//если в вершина выходит за границы зоны
          arrowSelect({},true)//сделать все стрелки невыбранными
          topSelect({},false, true)//сделать все вершины невыбранными
          return false //завершить выполнение
        }
        
        
        let style0={  //стиль для позиционирования вершины
          top: `${y}px`,
          left: `${x}px`
        }
        buildTop(setx,sety,style0)//построение новой вершины
        
      }
      else{
        arrowSelect({},true)//сделать все стрелки невыбранными
        topSelect({},false, true)//сделать все вершины невыбранными
      }
    }
    
    //функция выбора вершины
    function topSelect(newTop,addCondition,  resetCondition){ 
    //newTop - вершина, которую надо выбрать
    //addCondition - вершина, которую надо выбрать, только что создана?
    //resetCondition- нужно сделать все вершины невыбранными?

      let newIndex//переменная индекса новой вершины
      tops.map((top=>{top.error=false}))//проход по массиву вершин и сброс свойства ошибки у всех элементов
      if(choiseTopIndex!=-1){//если есть выбранная вершина
        tops[choiseTopIndex]={...tops[choiseTopIndex],  cond: false}//сделать её невыбранной
      }
      else{
        if(resetCondition){return [tops,-1]} //выйти, если хотят сбросить все вершины, когда они уже все сброшены
      }
      if(resetCondition){ 
        SetArrow({x1: 0, y1: 0, x2: 0, y2: 0,id1: 0,id2:0})//сброс параметров потенциальной стрелки
      }
      else{
        //выбранная вершина становится потенциальным началом возможной стрелки
        SetArrow({x1: newTop.x, y1: newTop.y, x2: 0, y2: 0,id1: newTop.id,id2:0})
        arrowSelect({},true)//все стрелки сделать невыбранными
      }
      if(addCondition){ //если выбираемая вершина только построена
        SetChoiseTop(tops.length) //сохраенение индекса выбранной вершины (длина массива вершина)
        newIndex=tops.length
        newTop.cond=true//вершина стала выбранной
        SetTops([...tops, newTop])//сохранение изменений в массиве вершин
        tops=[...tops, newTop]
      }
      else{
        if(resetCondition){//если сбрасываются все вершины
          SetChoiseTop(-1) //сохранение индекса как признак отсутсвия выбранных вершин
        }
        else{
          newIndex=tops.findIndex(top=>top.id==newTop.id)//ищем индекс выбираемой вершины в массиве вершин
          SetChoiseTop(newIndex)  //сохраняем индекс
          tops[newIndex].cond=true  //вершина стала выбранной
        }
        SetTops([...tops])//сохранение изменений в массиве вершин
        
      }
      return [tops,newIndex] //вернуть массив вершин и индекс новой выбранной вершины
    }
    
    //функция выбора стрелки
    function arrowSelect(newArrow, resetCondition){
      //newArrow - объект новой стрелки
      //resetCondition - сделать невыбранными все стрелки?
      let newIndex //переменная индекса новой выбранной стрелки

      //проход по массиву вершин и сброс свойства ошибки у всех элементов
      tops.map((top=>{top.error=false}))
      SetTops([...tops])

      if(choiseArrowIndex!=-1){//если есть выбранная стрелка
        arrows[choiseArrowIndex]={...arrows[choiseArrowIndex],  cond: false}//сделать её невыбранной
      }
      else{
        if(resetCondition){return arrows}//выйти, если хотят сбросить все стрелки, когда они уже сброшены
      }
      if(resetCondition){//если сбрасываются все стрелки
        SetChoiseArrow(-1)//сохранение индекса как признак отсутсвия выбранных стрелок
      }
      else{
        newIndex=arrows.findIndex(arrow=>arrow.id==newArrow.id)//поиск индекса выбираемой стрелки в массиве стрелок
        arrows[newIndex].cond=true//стрелка становится выбранной
        SetChoiseArrow(newIndex)//сохранение индекса новой выбранной стрелки
        topSelect({},false,true)//все вершины сделать невыбранными
      }
      SetArrows([...arrows])//сохранение измененения в массиве стрелок
      return arrows         //вернуть массив стрелок

    }

    //функция для обработчика нажатия по вершине
    function choise(top, choiseCondition, deleteCondition){
      //top - вершина, на которую нажали
      //choiseCondition - нужно ли строить стрелку?
      //deleteCondition - нужно ли удалять? (для случая нажатия по времени вершины)
      
      let newIndex //индекс новой выбранной вершины
      if(!(props.checkDelete&&deleteCondition)){ //если не удалять
        if(!top.cond){//пропустить, если эта вершина уже выделенная
          //если ни одна вершина не была выбрана до этого, то точно стрелку не строить
          newIndex=topSelect(top, false, false)[1]//выбор вершины и получение её индекса
          if(!alreadyOneChoice){choiseCondition=false}
            if(choiseCondition&&props.checkArrow){//если режим построения включен и стрелку строить можно
             
              buildArrow(top.x,top.y, top.id, newIndex);//построение стрелки
            }
        }
      }
      else{
        let [tops,choiseIndex]=topSelect({}, false, true)//сделать невыбранными все вершины
        let arrows=arrowSelect({}, true)//сделать невыбранными все стрелки
        SetTops(tops.filter((nonDeleteTop=>nonDeleteTop.id!=top.id)))//удаление выделенной вершины
        SetArrows(arrows.filter(arrow=>arrow.id1!==top.id&&arrow.id2!==top.id))//удаление всех стрелок, которые входят 
                                                                                //входят или исходят из неё
      }
    }


    //функция для обработчика нажатия по стрелке
    function arrowChoise(arrow,deleteCondition){
      //arrow - стрелка, по которой нажали
      //deleteCondition - нужно ли удалять? (для случая нажатия по времени стрелки)
      if(!(props.checkDelete&&deleteCondition)){ //если не удалять
        arrowSelect(arrow, false) //выбрать данную стрелку
      }
      else{
        topSelect({}, false, true)//сделать невыбранными все вершины
        let arrows=arrowSelect({}, true)//сделать невыбранными все стрелки
        SetArrows(arrows.filter(nonDeleteArrow=>nonDeleteArrow.id!==arrow.id))//удалить нажатую стрелку
      }
    }

  
   
    //обработчик события захвата вершины
    function hide(top, topRef,event){
      //top -захваченная вершина
      //topRef - ссылка на захваченную вершину
      //event - объект события с координатми
      let x,y;

      //получение смещения относительно вершины
      x=event.pageX-topRef.current.getBoundingClientRect().left-window.scrollX;
      y=event.pageY-topRef.current.getBoundingClientRect().top-window.scrollY;

      choise(top, false, false)//выбрать данную вершину не для построеня стрелки
      SetOf([x,y])//сохранения смещения
      SetTry(true)//инициализация попытки перетащить вершину
      
    }
  
    //функция проверки наличия стрелок между заданными вершинами
    function checkPairId(id1, id2){
      // поиск стрелок, которые соединяют вершины с идентификаторами id1 id2
      let output=arrows.find(arrow=>(arrow.id1==id1&&arrow.id2==id2)||(arrow.id2==id1&&arrow.id1==id2))
      return output
    }
    
    //функция построения стрелки
    function buildArrow(x,y,id, newIndex){
      //строить только тогда, когда индекс вершины больше текущего выбранного
      if(newIndex>choiseTopIndex){
       if(!checkPairId(id, arrow.id1)){//если стрелок между вершинами нет
        const newArrow={
          ...arrow,       //копипование свойств потенциальной стрелки
          id: Date.now(), //идентификатор стрелки
          x2: x,          //координаты конца стрелки
          y2: y,
          id2: id,        //идентификатор конечной вершины
          cond: false,    //условие выбора стрелки
          deviation: 0,   //степень искривления
          value: 1,       //значение по умолчанию
          crit: false,    //своство принадлежности критическому путю
          null: false,    //свойство принадлежности множеству обнуленных дуг
          storageValue: 0 //свойство для хранения времени стрелки в случае её обнуления
        }
        SetArrows([...arrows,newArrow]) //добавление в массив стрелок
       }
      }
    }
    
    

      
   
    return(
      <div>
      <div className='area' ref={areaRef} onClick={addClick} onDragOver={allowDrop}  onDrop={drop} style={areaStyle}>
      <TopList tops={tops} choise={choise} hide={hide}/>
      <ArrowList arrows={arrows} choise={arrowChoise} edge={[areaStyle.width, areaStyle.height]}/>
      <div className='horline' ref={bottomEdge}></div>
      <div className='vertline' ref={rightEdge}></div>
      </div>
     </div>


    )
    /*компонент возращает непосредственно корневой элемент зоны, в который вложены
      компоненты массива вершин и массива стрелок, а также html-элементы <div>, расположенные
      на границах элемента зоны, необходимые для работы динамического расгирения зоны
    */

}

export default Area;
