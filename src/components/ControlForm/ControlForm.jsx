import React, {useState, useRef,useContext, useEffect}from 'react';
import './styles.css'
import Setting from "../Setting/Setting";
import ArrowIcon from "../Icons/ArrowIcon"
import BlockIcon from "../Icons/BlockIcon"
import AddIcon from "../Icons/AddIcon"
import DeleteIcon from "../Icons/DeleteIcon"
import LeftIcon from "../Icons/LeftIcon"
import RightIcon from "../Icons/RightIcon"
import BascetIcon from "../Icons/BascetIcon"
import RunIcon from "../Icons/RunIcon"
import DownloadIcon from "../Icons/DownloadIcon"
import UploadIcon from "../Icons/UploadIcon"
import DistIcon from "../Icons/DistIcon"
import ControlArrow from "../Control/ControlArrow"
import ControlButton from "../Control/ControlButton"
import {getArrowParam} from "../../functions/getArrowParam"
import '../Top/styles.css'
import BackIcon from '../Icons/BackIcon';
import {Context} from "../../context"
import ControlInput from '../Control/ControlInput';
import { criticalPathes } from '../../functions/criticalPathes';
import InfoIcon from '../Icons/InfoIcon';
import ControlInfo from '../Control/ControlInfo';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { nullArcs } from '../../functions/nullArcs';
import PathZeroIcon from '../Icons/PathZeroIcon';
import ControlDist from '../Control/ControlDist';
import { toInputProc } from '../../functions/toInputProc';
import ChoisePathIcon from '../Icons/ChoisePathIcon';
import MoveIcon from '../Icons/MoveIcon';


const ControlForm= function({checks,SetChecks,arrows, SetArrows, SetOf,choiseArrowIndex,
                             clear, edge, download,clickUpload, calculate,calculate2,calculate3, stage, SetStage}){
  //переменная для гибкого изменения режимов раьоты
  const forChecks={allowArrow: false, allowFix: checks.allowFix, tryToDragAdd: false, 
                  allowAdd: false,allowDelete: false,allowMove: false,fileName: checks.fileName}

  const topRef=useRef()//ссылка на элемент добавочной вершины
   
  const [pathes2,SetPathes2]=useSessionStorage('pathes2',[])//переменная хранения всех путей на этапе 2
  const [pathes3,SetPathes3]=useSessionStorage('pathes3',[])//переменная хранения всех путей на этапе 3
  const [nullArrows,SetNullArrows]=useSessionStorage('null',[])//массив индексов обнуленных дуг
  const [allArrows,SetAllArrows]=useSessionStorage('all',[])//массив индексов обнуленных дуг

  const [topsDistribution,SetTopsDistribution]=useSessionStorage('topsDistribution',[])
  
  //флаги, отвечающие за вывод информации
  const [showChecks,SetShowChecks]=useSessionStorage('showChecks',{showInfo: false, showCrit: false,lastCrit: false,showDist: false})
  
  const [content,SetContent]=useSessionStorage('content',{})//выводимый контент
  const [diagrams,SetDiagrams]=useSessionStorage('diagrams',{type: 'diagrams', data: []})//для диагармм

   const [timeId, SetTimeId]=useState(-1)//переменная для хранения id таймера
  
   let speed=100;//начальная скорость искривления
  
  const {update,SetUpdate}=useContext(Context)//глобальный флаг изменения времени
  const [forDists,SetForDists]=useSessionStorage('inputProc',[])//для inputProc
  
  //функция перехода на второй этап 
  function toStage2(){
      let paths=calculate()//расчет всех путей
      if(paths==='no'){return}//выход, если не удалось этого сделать
      criticalPathes(arrows,SetArrows,paths,true)//расчет критических путей
      SetUpdate(false)//запрет едактирования времени
      SetStage(2) //этап становится вторым
      SetPathes2(paths)//с0хранение полученных путей
      SetContent({type: 'pathes', data: paths})//генерация информации о полученных путях
   }

   //функция ухода со второго этапа
   function fromStage2(){
    SetStage(1) //этап стал первым
    SetUpdate(true) //редактирование времени разрешено
    criticalPathes(arrows,SetArrows,{},false)//критические пути больше не выделяются на графе
   }

   //функция перехода на 3 этап
   function toStage3(){
    let copyPathes=[]//пустой массив для копирования путей

    //проход по массиву путей, полученных на этапе 2
    pathes2.map((element)=>{
      const copyPath={//новый объект для копии пути
        path: [...element.path],//копирование массива вершин, составляющих путь
        pathLength: element.pathLength,//передача значения длины пути
        arrowIndexes: [...element.arrowIndexes]//копипование индексов стрелок в пути
      }
      copyPathes.push(copyPath)//добавления нового объекта в массив копий путей
    })
    let [table, nullArcs,calculateTopsDistribution,allConnect]=calculate2(copyPathes,showChecks.lastCrit)//метод подпорки
    SetPathes3(copyPathes) //сохранение измененных объектов путей на этапе 3
    SetNullArrows(nullArcs) //сохранение обнуленных дуг
    SetAllArrows(allConnect)
    SetTopsDistribution(calculateTopsDistribution)
    SetStage(3) //этап стал третьим
    if(showChecks.showCrit){//если режим показа критических путей
      arrows.map((arrow)=>{
        arrow.null=false//не показываем обнуленность дуг
      })
      criticalPathes(arrows,SetArrows,copyPathes,true)//показываем критические пути
    }
    SetContent({type: 'table', data: table})//генерация информации о работе метода подпорки



   
    SetForDists(toInputProc(calculateTopsDistribution))
   }

   //уход с 3 этапа
   function fromStage3(){
    if(showChecks.showCrit){//если показываются критические пути

      //сбросить у всех стрелок совйство принадлежности критическому пути
      arrows.map((arrow)=>{
        arrow.crit=false
      })

      //вернуть вид всем обнулённым дугам
      nullArrows.map((index)=>{
        arrows[index].null=true
      })
      SetArrows([...arrows])
    }
    SetStage(2)
    nullArcs(arrows,SetArrows,[],false)//полный сброс всех обнуленных дуг
    criticalPathes(arrows,SetArrows,pathes2,true)//вывод кртитических путей этапа 2
    SetContent({type: 'pathes', data: pathes2})//генерация информации о критических путях этапа 2
   }

   //переход на 4 этап
   function toStage4(){
    SetStage(4)
    let table=calculate3(forDists,allArrows)
    SetShowChecks({...showChecks,showInfo: false})
    SetDiagrams({...diagrams, data: table})
   }

   //уход с 4 этапа
   function fromStage4(){
    SetStage(3)
   }

   //функция выбора режима показа графа на 3 этапе
   function nullCrites(showCondition){
    if(showCondition){
      //сброс "внешнего обнуления" у всех дуг
      arrows.map((arrow)=>{
        arrow.null=false 
      })
      criticalPathes(arrows,SetArrows,pathes3,true)//высвечивание крит путей
    }else{
      //сброс "внешней" принадлежности крит путям у всех дуг
      arrows.map((arrow)=>{
        arrow.crit=false
      })
      //высвечивание обнуленных дуг
      nullArrows.map((index)=>{
        arrows[index].null=true
      })
      SetArrows([...arrows])
    }
   }


    //функция добавления вершины с помощью перетаскивания
    //обработчик события захвата элемента
    function dragAdd(event){
        SetChecks({...checks, tryToDragAdd: true})//инициализация попытки добавления

        //получение координат смещения относительно вершины
        let x=event.pageX-topRef.current.getBoundingClientRect().left-window.scrollX;
        let y=event.pageY-topRef.current.getBoundingClientRect().top-window.scrollY;
        SetOf([x,y])//сохранение координат
    }
      
      //функция искривления стрелки на одну позицию
      function deviation(side){
        //входной параметр отвечает за сторону
        if(choiseArrowIndex!=-1){//если есть выбранная стрелка
          if(side){
            //изменение свойства искривления у выбранной стрелки
            arrows[choiseArrowIndex]={...arrows[choiseArrowIndex], deviation: ++arrows[choiseArrowIndex].deviation }
          }else{
            //изменение свойства искривления у выбранной стрелки
            arrows[choiseArrowIndex]={...arrows[choiseArrowIndex], deviation: --arrows[choiseArrowIndex].deviation }
          }
        SetArrows([...arrows])//запомнить изменение
        }
      }
  

      //функция повтора функции искривления
      function deviationRepeat(side){
        //входной параметр отвечает за сторону
        if(choiseArrowIndex!=-1){//если есть выбранная стрелка
          if(checkArrowBorder(choiseArrowIndex, side)){//проверка на выход за границу зоны
          deviation(side)//функция искривления стрелки на одну позицию

          //рекурсивный вызов этой же функции через некторое время и сохранение id таймера
          SetTimeId(setTimeout(deviationRepeat,speed,side))
          speed=speed/1.5//сокращение этого некоторого времени
          }
        }
      }
  
      //функция отсановки таймера и прекращения вызова функции искривления
      function stopDeviation(){
        clearInterval(timeId)
      }
      
      //функция проверки выхода стрелки за границы
      function checkArrowBorder(choiseArrowIndex,side){
        //в зависимости от сторны потенциального искривления узанется значение нового искривления
        const newDeviation=side?arrows[choiseArrowIndex].deviation+1:arrows[choiseArrowIndex].deviation-1
        const arrow={ //копия объекта выбранной стрелки с новым искривлением
          ...arrows[choiseArrowIndex],
          deviation: newDeviation
        }
      return getArrowParam(arrow, false, edge)//проверка выхода за границы зоны
      }
      
  if(stage==1){//если первый эта работы приложения
    return(
      <div>
        <div className='control'>
          <div className='childControl'>
            <Setting  
              content={<ArrowIcon condition={checks.allowArrow}/>} 
              checked={checks.allowArrow} 
              onClick={()=>{SetChecks({...forChecks, allowArrow: !checks.allowArrow})}}/>
            <Setting  
              content={<BlockIcon condition={checks.allowFix}/>} 
              checked={checks.allowFix} 
              onClick={()=>{SetChecks({...checks, allowFix: !checks.allowFix})}}/>
            <Setting  
              content={<AddIcon condition={checks.allowAdd}/>} 
              checked={checks.allowAdd} 
              onClick={()=>{SetChecks({...forChecks, allowAdd: !checks.allowAdd})}}/>
            <Setting  
              content={<DeleteIcon condition={checks.allowDelete}/>} 
              checked={checks.allowDelete} 
              onClick={()=>{SetChecks({...forChecks, allowDelete: !checks.allowDelete})}}/>

            <Setting  
              content={<MoveIcon condition={checks.allowMove}/>} 
              checked={checks.allowMove} 
              onClick={()=>{SetChecks({...forChecks, allowMove: !checks.allowMove})}}/>

            <Setting content={
              <div title="перетащить шаблон" className='top top_select' style={{position: 'relative'}} ref={topRef} draggable="true" 
              onDragStart={
                (e)=>{
                  dragAdd(e)
                }
              }
              onDragEnd={
                ()=>{
                  SetChecks({...checks, tryToDragAdd: false})
                }
              }>
              </div>
            }/>
            <ControlArrow 
              content={<LeftIcon/>} 
              onMouseDown={()=>{deviationRepeat(false)}} 
              onMouseOut={stopDeviation} 
              onMouseUp={stopDeviation}/>
            <ControlArrow 
              content={<RightIcon/>} 
              onMouseDown={()=>{deviationRepeat(true)}} 
              onMouseOut={stopDeviation} 
              onMouseUp={stopDeviation}/>
           
          </div>
          <div className='childControl'>
            <ControlInput 
              value={checks.fileName} 
              onChange={
                (e)=>{SetChecks({...checks,fileName:e.target.value})}
              }/>
            <ControlButton 
              content={<UploadIcon/>}
              onClick={clickUpload}/>
            <ControlButton 
              content={<DownloadIcon/>} 
              onClick={download}/>
            <ControlButton 
              content={<BascetIcon/>} 
              onClick={clear}/>
               <ControlButton 
              content={<RunIcon/>} 
              onClick={toStage2}/>
          </div>
        </div>
      </div>
    )
  }
   
  if(stage==2){ //если второй этап выполнения программы
    return(
      <div>
        <div className='control2'>
          <div className='childControl2'>
            <ControlButton 
              content={<BackIcon/>} 
              onClick={fromStage2}/>
              <Setting  
              content={<MoveIcon condition={checks.allowMove}/>} 
              checked={checks.allowMove} 
              onClick={()=>{SetChecks({...forChecks, allowMove: !checks.allowMove})}}/>
            <ControlArrow 
              content={<LeftIcon/>} 
              onMouseDown={()=>{deviationRepeat(false)}} 
              onMouseOut={stopDeviation} 
              onMouseUp={stopDeviation}/>
            <ControlArrow 
              content={<RightIcon/>} 
              onMouseDown={()=>{deviationRepeat(true)}} 
              onMouseOut={stopDeviation} 
              onMouseUp={stopDeviation}/>
            <Setting  
              content={<InfoIcon condition={showChecks.showInfo}/>} 
              checked={showChecks.showInfo} 
              onClick={
                ()=>{
                  SetShowChecks({...showChecks, showInfo: !showChecks.showInfo})
                }
              }/>
              <Setting  
              content={<ChoisePathIcon condition={showChecks.lastCrit}/>} 
              checked={showChecks.lastCrit} 
              onClick={
                ()=>{
                  SetShowChecks({...showChecks, lastCrit: !showChecks.lastCrit})
                }
              }/>
            <ControlButton 
              content={<RunIcon/>} 
              onClick={toStage3}/>
          </div>
        </div>
        <ControlInfo 
          check={showChecks.showInfo} 
          title={`Все пути в количестве ${pathes2.length} штук:`}
          content={content}/>
      </div>
    )
  }
  if(stage==3){//если третий этап выполнения программы
    return(
      <div>
        <div className='control2'>
          <div className='childControl2'>
            <ControlButton 
              content={<BackIcon/>} 
              onClick={fromStage3}/>
              <Setting  
              content={<MoveIcon condition={checks.allowMove}/>} 
              checked={checks.allowMove} 
              onClick={()=>{SetChecks({...forChecks, allowMove: !checks.allowMove})}}/>
            <ControlArrow 
              content={<LeftIcon/>} 
              onMouseDown={()=>{deviationRepeat(false)}} 
              onMouseOut={stopDeviation} 
              onMouseUp={stopDeviation}/>
            <ControlArrow 
              content={<RightIcon/>} 
              onMouseDown={()=>{deviationRepeat(true)}} 
              onMouseOut={stopDeviation} 
              onMouseUp={stopDeviation}/>
            <Setting  
              content={<InfoIcon condition={showChecks.showInfo}/>} 
              checked={showChecks.showInfo} 
              onClick={
                ()=>{
                  SetShowChecks({...showChecks, showInfo: !showChecks.showInfo}) 
                  }
              }/>
              
              <Setting  
              content={<DistIcon condition={showChecks.showDist}/>} 
              checked={showChecks.showDist} 
              onClick={
                ()=>{
                  SetShowChecks({...showChecks, showDist: !showChecks.showDist}) 
                  }
              }/>
            <Setting  
              content={<PathZeroIcon condition={showChecks.showCrit}/>} 
              checked={showChecks.showCrit} 
              onClick={
                ()=>{
                  SetShowChecks({...showChecks, showCrit: !showChecks.showCrit})
                  nullCrites(!showChecks.showCrit)
                }
              }/>
            <ControlButton 
              content={<RunIcon/>} 
              onClick={toStage4}/>
          </div>
        </div>
        <ControlInfo 
          check={showChecks.showInfo} 
          title="Таблица обнуления:"
          content={content}/>
          <ControlDist
            check={showChecks.showDist} 
            title="Редактирование распределения подзадач:"
            topsDistribution={topsDistribution}
            forDists={forDists}
            SetForDists={SetForDists}

          />
      </div>
    )
  }
  if(stage==4){
    return(
      <div>
        <div className='control2'>
          <div className='childControl2'>
            <ControlButton 
              content={<BackIcon/>} 
              onClick={fromStage4}/>
          </div>
        </div>
        <ControlInfo 
          check={true} 
          title="Диаграммы Ганта"
          content={diagrams}/>
      </div>
    )
  }

}
export default ControlForm;








