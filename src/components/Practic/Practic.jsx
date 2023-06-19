import React, {useState, useRef}from 'react';
import Area from "../Area/Area";
import ControlForm from "../ControlForm/ControlForm";
import {useSessionStorage} from "../../hooks/useSessionStorage";
import './styles.css'
import {Context} from "../../context"
import { getCritIndexes } from '../../functions/getCritIndexes';
import { getIndexesOfConnectedTopsArray } from '../../functions/getIndexesOfConnectedTopsArray';

import { getAllPath } from '../../functions/getAllPath';
import { convertPathToString } from '../../functions/convertPathToString';
import { addTableColumn } from '../../functions/addTableColumn';
import { nullArcs } from '../../functions/nullArcs';
import { maxPathesIndexes } from '../../functions/maxPathesIndexes';
import { assignTopsForCPU } from '../../functions/assignTopsForCPU';


import { addTact } from '../../functions/addTact';
import { fromInputProc } from '../../functions/fromInputProc';


const Practic= function(props){
  //объект состония флагов-режимов работы 
  const [checks,SetChecks]=useSessionStorage('checks',
  {allowArrow: false, allowFix: false, tryToDragAdd: false, allowAdd: false,allowDelete: false,nameFile: "graph"})
   //глобальный флаг разрешения редактирования времени
  const [update,SetUpdate]=useSessionStorage('update',true)
   const save=useRef()//ссылка на элемент <a>, позволяющий реализовать скачивание
   const upload=useRef()//ссылка на элемент ввода файла
   const form=useRef()//ссылка на скрытувю форму
   
   const [Edge,SetEdge]=useState([0,0]);//параметры зоны, получаемы от компонента зоны

   //смещение внутри номинальной вершины, котора используется для добавления с помощью перетасивания
   const [offsetXY, SetOf]=useState([0,0])

   const [tops, SetTops]=useSessionStorage('tops',[])//массив вершин
  const [arrows,SetArrows]=useSessionStorage('arrows',[])//массив стрелок
  const [choiseTopIndex, SetChoiseTop]=useSessionStorage('topIndex',-1)//индекс выбранной вершины
  const [choiseArrowIndex, SetChoiseArrow]=useSessionStorage('arrowIndex',-1)//индекс выбранной стрелки

  const [areaRef, SetAreaRef]=useState('')//ссылка на элемент зоны, получаемая от компонента зоны
  
  
  const topHalfSize=15//половина размера элемента вершины
  const topLimit=40//предельное количество вершин
  
  
  //функция скачивания файла, содержащей введённый граф
  function download() {
    let param=[tops,arrows,choiseTopIndex, choiseArrowIndex]//массив сохраняемых параметров
    let nameLen=[...checks.fileName].filter((a=>a!==' ')).length
    //использование <a> для хранения данной информации
    save.current.href= `data:text/plain;charset=utf-8,${encodeURIComponent(`${JSON.stringify(param)}`)}`
    
    //наименование файла и его расширение
    save.current.download= `${checks.fileName.length!=0&&nameLen!=0?checks.fileName:'graph'}.lexus`
   
    //вызов события нажатия по <a> тем самым запуская процесс скачивания файла
    save.current.click();
    
}


//функция получения из загруженного файла информации о графе
function getFile(event){
  const reader=new FileReader()//создание объекта чтения файла
  let data, parses=[]
  event.preventDefault();//отменить привычное действие обработчика события
  reader.onload=(e)=>{//обработчик события загрузки файла
    

    //установка параметров
    try{
      data=e.target.result//чтение данных из файла
    parses=JSON.parse(data)//получение массива параметров
      SetTops(parses[0])
    SetArrows(parses[1])
    SetChoiseTop(parses[2])
    SetChoiseArrow(parses[3])
    }catch{

    }
    
  }
  try{//попытка прочитать файл
    reader.readAsText(event.target.files[0])//чтение файла

    //сохранение имени файла в приложении
    SetChecks({...checks, fileName:event.target.files[0].name.replace('.lexus','') })
  }catch(error){

  }

  
  

}

//функция вызова проводника для выбора файла
function clickUpload(){
  upload.current.click();//вызов события нажатия по скрытому полю ввода данных
}
    //функция для получения размеров зоны
    function getEdge(width, height){
      SetEdge([ width, height])

    }
    //функция для получения ссылки на элемент зоны
    function getAreaRef(areaRef){
      SetAreaRef(areaRef)
    }
    
    //функция очищения данных о графе
    function clearGraph(){
      SetChoiseTop(-1)
      SetChoiseArrow(-1)
      SetChecks({...checks, fileName:'' })
      SetTops([])
      SetArrows([])
      form.current.reset();
    }

    //функция расчета для этапа 2
    function calculate(){
      areaRef.current.click()//нажатие по зоне для сброса выбранного элемента графа

      //установка режимов работы для дальнейших этапов
      SetChecks({...checks,allowArrow: false, allowFix: true, tryToDragAdd: false, allowAdd: false,allowDelete: false})
      
      if(tops.length<=1){return 'no'}//если нет вершин или только одна, не продолжать расчет
      let critIndexes=getCritIndexes(tops,arrows)//получение индексов ошибочных вершин
      if(critIndexes.length>0){//если массив индексов ошибочных вершин имеет ненулевую длину
      
      //проход по массиву вершин и высвечтвание ошибочных вершин
      critIndexes.map((critIndex)=>{
        tops[critIndex].error=true
        SetTops([...tops])
      })
      
      return 'no' //не продолжать расчет
    }

    let paths=getAllPath(tops,arrows)//получение всех путецй графа
    if(paths=="error"){
      tops.map((top)=>{
        top.error=true
      })
      return 'no' //не продолжать расчет
    }
    paths.sort((a,b)=>b.pathLength-a.pathLength)//сортировка по длине

    return paths //вернуть полученные пути для этапа 2
    }


    //метод подпорки
    function calculate2(pathes,lastCrit){
      areaRef.current.click()
      //создание массива условий вершин
      let topConditions=[]
      for(let i=0;i<tops.length;i++){

        //для каждой вершины создается объект
        const newConditionTop={
          entry: true, //можно обнулять что-то входе
          exit: true //можно обнулять что-то на выходе
        }
        //объект добавляется в массив
        topConditions.push(newConditionTop)
      }

      //получение индексов всех дуг
      let connectionTopsIndexes=getIndexesOfConnectedTopsArray(tops, arrows)
      
      let table=[] //переменная таблицы вывода
      let nullArrowsIndexes=[]//индексы обнуленных дуг
      let onOneProcessor=[]//массив вершин, выполняющихся на одном процессоре
      let nullConnect=[]//массив обнуленных дуг

      //создание иноформационной первой колонки таблицы
      table[0]=[{value: 'Шаг обнуления:', condition: -3}]
      let i=1
      pathes.map((path)=>{
        table[i]=[{value: convertPathToString(path), condition: -2}]
        i++
      })
      table[i]=[{value: 'Обнуляемая дуга:', condition: -5}]

      let iter=0
      let exitIndex

      let arc={start: -1, end: -1}//объект потенциальной дуги
      let arcValue//переменная хранения значения дуги
      let maxPathIndexes //индексы самых длинных путей
      let exit //переменная для выхода из цикла
      let targetPathIndex //переменная индекса выбранного пути
      let indexPathinMax
      while(true){
        maxPathIndexes=maxPathesIndexes(pathes)//нашли индексы всех путей с максимальной длиной
        exit=false
        exitIndex=0

        targetPathIndex=-1
        indexPathinMax=lastCrit?maxPathIndexes.length-1:0
        let path=pathes[maxPathIndexes[indexPathinMax]].path//берём первый путь из максимальных
        
        for(let j=0; j<path.length-1;j++){//проход по этому пути
          //если выход предшествующей и вход последующей вершин можно обнулить
          if(topConditions[path[j]-1].exit&&topConditions[path[j+1]-1].entry){
            arc.start=path[j]//начало дуги (индекс предшествующей вершины)
            arc.end=path[j+1]//конец дуги (индекс последующей вершины)
            nullConnect.push({parentIndex: path[j]-1, childIndex: path[j+1]-1})
            topConditions[path[j]-1].exit=false//выход предшествующей заблокирован
            topConditions[path[j+1]-1].entry=false//вход последующей заблокирован
            targetPathIndex=maxPathIndexes[indexPathinMax]//индекс теущего пути в массиве путей
            exit=true//выход из цикла обхода пути
          }
          if(exit){
            break
          }
          exitIndex++
        }
        
        //среди путей с максимальной длиной нашли дугу которую можно обнулить
        //надо:
        //сохранить индекс обнуленной дуги
        //изменение в массиве путей (длина)
        if(!exit){//если выход ложный значит путь пройден полностью
          break //и ни одна дуга на этом пути к обнулению недоступна
        }       //следовательно работа метода завершена

       
        //добавление дуги в массив обнуленных дуг
        nullArrowsIndexes.push(pathes[targetPathIndex].arrowIndexes[exitIndex])
        arcValue=arrows[pathes[targetPathIndex].arrowIndexes[exitIndex]].value
        addTableColumn(table,iter,arc,arcValue,pathes,targetPathIndex,0)//добавление колонки в таблицу метода
        
        iter++
      }
      //вторая часть метода
      let parentTopIndex, childTopIndex
      for(let i=0; i<arrows.length;i++){//проход по всем дугам

        //получение индексов вершин в массиве вершин, кторые дуга связывает
        parentTopIndex=connectionTopsIndexes[i].parentIndex
        childTopIndex=connectionTopsIndexes[i].childIndex
        //если выход предшествующей и вход последующей вершин можно обнулить
        if(topConditions[parentTopIndex].exit&&topConditions[childTopIndex].entry){
          //заполнение объекта дуги
          arc.start=parentTopIndex+1
          arc.end=childTopIndex+1
          nullConnect.push({parentIndex: parentTopIndex, childIndex: childTopIndex})
          arcValue=arrows[i].value//значение дуги
          topConditions[parentTopIndex].exit=false//выход предшествующей заблокирован
          topConditions[childTopIndex].entry=false//вход последующей заблокирован
          nullArrowsIndexes.push(i)//добавление индекса обнуленной дуги в массив обнуленныъ дуг
          //построение колонки таблицы метода
          addTableColumn(table,iter,arc,arcValue,pathes,-1,1)
          iter++
        }
      }

      
      onOneProcessor=assignTopsForCPU(tops,nullConnect)

     //третья часть
      let notNullConnect=connectionTopsIndexes.filter(connect=>!nullArrowsIndexes.includes(connect.arrowIndex))

      notNullConnect.map((connect)=>{
        for(let i=0;i<onOneProcessor.length;i++){
          if(onOneProcessor[i].includes(connect.parentIndex)&&onOneProcessor[i].includes(connect.childIndex)){
            arc.start=connect.parentIndex+1
            arc.end=connect.childIndex+1
            arcValue=connect.value
            nullArrowsIndexes.push(connect.arrowIndex)
            addTableColumn(table,iter,arc,arcValue,pathes,-1,2)
            iter++
            
            break
          }
        }
        
      })


      

      
      //построение колонки таблицы метода
      addTableColumn(table,-1,-1,-1,pathes,-1,3)
    
      maxPathIndexes=maxPathesIndexes(pathes)//индексы самых длинных путей
      maxPathIndexes.map((index)=>{//проход по индексам этих путей
        table[index+1].map((column)=>{
          if(column.condition==0){//выделение строк самых длинных по итогу путей в таблице
            column.condition=3
          }
        })
      })
      //высвечивание обнуленных дуг
      nullArcs(arrows,SetArrows, nullArrowsIndexes,true)
      //вернуть таблицу метода и массив индексов обнуленных дуг
      return [table,nullArrowsIndexes, onOneProcessor,connectionTopsIndexes]
    }

    function calculate3(topsDistributionFromInput,allConnect){
      let tact=0
      let table=[]
      let iterTable=0
      let errorFlag=false
      let topsDistribution=fromInputProc(topsDistributionFromInput)
      
      let topConditions=Array(tops.length).fill(0)
      topsDistribution.map((onOneProcessor)=>{
        onOneProcessor.map((top)=>{
          if(top>=0&&top<tops.length){
            topConditions[top]++
          }else{
            errorFlag=true
          }
          
        })
      })

      if(topConditions.findIndex(a=>a!=1)>-1||errorFlag){
        
        table[0]=[{value: `Исходные данные некорректны`, condition: -2}]
        return table
      }
      let connectForGantt=[]
      allConnect.map((connect)=>{
        let condition=true

        for(let i=0;i<topsDistribution.length;i++){
          if(topsDistribution[i].includes(connect.parentIndex)&&topsDistribution[i].includes(connect.childIndex)){
           
            condition=false
            
            break
          }
        }
        if(condition){
          connectForGantt.push(connect)
        }
        
      })
     
      /*topsDistribution.map((topsOnProc)=>{
        let proc=[]
        let time=0
        topsOnProc.map((top)=>{
          let entry=[]
          let entrySum=0
          let exit=[]
          let exitSum=0
          connectForGantt.map((connect,index)=>{
            if(connect.childIndex==top){
              entry.push({index: index, start: -1, end: -1,value: connect.value})
              entrySum+=connect.value
            }
            if(connect.parentIndex==top){
              exit.push({index: index, start: -1, end: -1,value: connect.value})
              exitSum+=connect.value
            }
          })
          if(entrySum>0){
            proc.push({type: 'arcs',data:entry, start: time ,end: time+entrySum,freeStart: time, freeEnd: time+entrySum})
            time+=entrySum
          }
          proc.push({type: 'top',data: top, start: time, end:time+Number(tops[top].value)})
          time+=Number(tops[top].value)
          if(exitSum>0){
            proc.push({type: 'arcs',data:exit,start: time ,end: time+exitSum,freeStart: time, freeEnd: time+exitSum})
            time+=exitSum
          }
          
        })
        allDistribution.push(proc)
      })*/
     
      
      
      let allEntry=[]
      let allExit=[]
     
      //console.log(topsDistribution)
      tops.map((top,topIndex)=>{
        
        let entry=[]
        let entrySum=0
        let exit=[]
        let exitSum=0
        connectForGantt.map((connect,index)=>{
          if(connect.childIndex==topIndex){
            entry.push({index: index,value: connect.value})
            entrySum+=connect.value
          }
          if(connect.parentIndex==topIndex){
            exit.push({
                        index: index,
                        value: connect.value,
                        indexDestinationProc: topsDistribution.findIndex(proc=>proc.includes(connect.childIndex)),
                        transmit: false
                      })
            exitSum+=connect.value
          }
        })
        if(entrySum>0){allEntry.push(entry)}else{allEntry.push(false)}
        if(exitSum>0){allExit.push(exit)}else{allExit.push(false)}

        
      })
      
      
      let allTimeDistribution=[]
      
      let prevConds=[]
      let sheduler=[]
      let prevBusesConds=[],BusDetect=[]
      

      

      topsDistribution.map((proc)=>{
        let prev
        //заполнение состояний процессоров в нулевой момент времени
        let flag=false
        if(proc.includes(0)&&proc.findIndex(a=>a==0)==0){
          
            prev={type: 'top', data: 1, time:Number(tops[0].value)+1}
            flag=true
        }else{
          prev=false
        }
        let procShedule=[]
        proc.map((top)=>{
          let stage
          if(allEntry[top]){
            stage={type: "receive", top: top,arcs: allEntry[top], amount: allEntry[top].length}
            procShedule.push(stage)
          }
          if(Number(tops[top].value)>0&&top!=0||top==0&&flag){ //2 5 10 13 1
          stage={type: "execute", top: top}
          procShedule.push(stage)
          }
        
          if(allExit[top]){
            stage={type: "transmit", top: top, arcs:allExit[top], amount: allExit[top].length}
            procShedule.push(stage)
          }
        })
        sheduler.push(procShedule)
        allTimeDistribution.push([],[])
        prevConds.push(prev)
        prevBusesConds.push(false)
        BusDetect.push(false)
      })

      let currentStage=[]
      let currentIndexStage=[]
      sheduler.map((stages)=>{
        currentStage.push(stages[0])
        currentIndexStage.push(0)
      })
      let iter=0
      //console.log(sheduler)
      while(true){
        
        let newConds=Array(prevConds.length).fill(false)
        let newBusesConds=Array(prevBusesConds.length).fill(false)
        let detect=[]
        let exit=0
        prevConds.map((prev,index)=>{
        let newCond
        if(prev){
          if(prev.time-1>0){
            newCond={type: prev.type, data: prev.data, time: prev.time-1}
            newConds[index]=newCond
          }else{
            
            //if(currentIndexStage[index]<=sheduler[index].length-1){//работает только для вершин
              
            detect.push(index)
           
            
          }
        }else{
          exit++
        }
        })
        if(iter==8){
          console.log(detect)
        }
        prevBusesConds.map((prev,index)=>{
          let newCond
          if(prev){
            if(prev.time-1>0){
              newCond={type: prev.type, data: prev.data, time: prev.time-1}
              newBusesConds[index]=newCond
            }
          }
          
        
        })
        

        if(exit==prevConds.length){
          break
        }
        //узнать новые состояния процессора по планировщику на тех процессорах
        //где что-то закончилось
        
        detect.map((indexProc)=>{
          if(prevConds[indexProc].type=="top"){
            
            currentIndexStage[indexProc]++//индекс следующего состояния по плану
            if(currentIndexStage[indexProc]<sheduler[indexProc].length){
              currentStage[indexProc]=sheduler[indexProc][currentIndexStage[indexProc]]//получение нового состояния
            }else{
              currentStage[indexProc]={type: "end"}
            }
            
            
          }
          //для дуг необходимо определять, последняя ли это дуга в отправке или получении
          if(prevConds[indexProc].type=="arc"){
            currentStage[indexProc].amount--
            if(currentStage[indexProc].amount==0){
              currentIndexStage[indexProc]++//индекс следующего состояния по плану
              if(currentIndexStage[indexProc]<sheduler[indexProc].length){
                currentStage[indexProc]=sheduler[indexProc][currentIndexStage[indexProc]]//получение нового состояния
              }else{
                currentStage[indexProc]={type: "end"}
              }
            }
          }
        })
        let indexOfProcTransmit=[]//массив индексов процессоров, которые собираются что-то передавать
        detect.map((indexProc)=>{
          //console.log(iter,currentStage[indexProc])
          let stageOnProc=currentStage[indexProc]
          
          if(stageOnProc.type=="execute"){
            newConds[indexProc]={type: 'top', data: stageOnProc.top+1, time:Number(tops[stageOnProc.top].value)}
          }
          
          if(stageOnProc.type=="transmit"){
            indexOfProcTransmit.push(indexProc)
          }
        })
        //просмотр пустующих процессоров, которые готовы передавать
        prevConds.map((сond,indexProc)=>{
          let stageOnProc=currentStage[indexProc]
          if(!сond&&stageOnProc.type=="transmit"){
            indexOfProcTransmit.push(indexProc)
          }
        })
        //массив процессоров со значениями дуг с максимальным значением, которые они готовы сейчас отправлять
        let maxTransmit=[]
       
        indexOfProcTransmit.map((indexProc)=>{
          let maxArc=-1
          let maxArcObject=-1
          let canTransmit=currentStage[indexProc].arcs.filter(arc=>!arc.transmit)
          let readyTransmit=[]
          
          canTransmit.map((arc)=>{
            
            if(!newConds[arc.indexDestinationProc]){
              //проверка на то, можно ли передавать в текущее состояние получателя
              if(connectForGantt[arc.index].childIndex<=currentStage[arc.indexDestinationProc].top){
                readyTransmit.push(arc)
              }
              
            }
          })
          
          readyTransmit.map((arc)=>{
            if(arc.value>maxArc){
              maxArc=arc.value
              maxArcObject=arc
            }
          })
          if(maxArc>-1){
            maxTransmit.push({proc: indexProc,max:maxArcObject})
          }
          
        })
        maxTransmit.sort((a,b)=>b.max.value-a.max.value)
        
        maxTransmit.map((procTransmit)=>{
         
          let source=procTransmit.proc//индекс процессора источника
          let destination=procTransmit.max.indexDestinationProc//индекс процессора получателчя
          let arc=procTransmit.max//объект передачи
          //console.log(arc)
          let parent=connectForGantt[arc.index].parentIndex//индекс узла родителя
          let child=connectForGantt[arc.index].childIndex//индекс узла получателя
          if(!newConds[destination]){//если на процессоре-получателе простой
            let listOfIndexInDestination=[]//массив индексов дуг, которые ждет процессор
            currentStage[destination].arcs.map((arc)=>{
              listOfIndexInDestination.push(arc.index)
            })
            if(listOfIndexInDestination.includes(arc.index)){
              newConds[source]={
                type: 'arc', 
                data: `${parent+1}-${child+1}`, 
                time:Number(arc.value)
              }
              newConds[destination]={
                type: 'arc', 
                data: `${parent+1}-${child+1}`, 
                time:Number(arc.value)
              }
              
              for(let i=0;i<newBusesConds.length;i++){
                if(!newBusesConds[i]){
                  BusDetect[i]=true
                  newBusesConds[i]={
                    type: 'arc', 
                    data: `${parent+1}-${child+1}`, 
                    time:Number(arc.value)
                  }
                  break
                }
              }
              //console.log(currentStage[source].arcs)
              let indexTransmit=currentStage[source].arcs.findIndex(a=>a.index==arc.index)
              currentStage[source].arcs[indexTransmit].transmit=true
            }
            
          }
        })
        
        newConds.map((newCond,index)=>{
          allTimeDistribution[index].push(newCond)
        })
        let continueIndex=newConds.length
        newBusesConds.map((newCond)=>{
          allTimeDistribution[continueIndex].push(newCond)
          continueIndex++

        })
        prevConds=newConds
        prevBusesConds=newBusesConds



        iter++
      }





      topsDistribution.map(()=>{
        table[iterTable]=[{value: `Процессор ${iterTable+1}`, condition: -2}]
        iterTable++
      })
      let countDeleteBus=0
      BusDetect.map((detect,index)=>{
        if(detect){
          table[iterTable]=[{value: `Шина ${index+1}`, condition: -2}]
          iterTable++
        }else{
          countDeleteBus++
        }
      })
      
      table[iterTable]=[{value: `Такт`, condition: -5}]
      for(let i=0;i<countDeleteBus;i++){
        allTimeDistribution.pop()
      }
      //console.log(BusDetect)
      let data
      while(tact<iter){
        data=[]
        
        allTimeDistribution.map((timeProc)=>{
          data.push(timeProc[tact])
        })
        
        addTact(table,data,tact)

        
        
        tact++
      }
      return table
    }
    
     

    
   
   
    return(
      <Context.Provider value={{//глобальный контекст для флага редактирования времени
        update,
        SetUpdate
      }}>
        <div>
          <form ref={form} className='asave'>
            <a ref={save}></a>
            <input type='file'  accept='.lexus' ref={upload} onChange={(e)=>{getFile(e)}}/>
          </form>
          <div>
            <ControlForm
              checks={checks} SetChecks={SetChecks}
              arrows={arrows} SetArrows={SetArrows}
              choiseArrowIndex={choiseArrowIndex}
              SetOf={SetOf}
              clear={clearGraph}
              download={download}
              clickUpload={clickUpload}
              calculate={calculate}
              calculate2={calculate2}
              calculate3={calculate3}
              edge={Edge}/>
            <Area 
              checkArrow={checks.allowArrow} 
              checkFix={checks.allowFix} 
              checkDelete={checks.allowDelete} 
              try={checks.tryToDragAdd} 
              add={checks.allowAdd}
              offset={offsetXY} 
              topLimit={topLimit}
              tops={tops} SetTops={SetTops}
              arrows={arrows} SetArrows={SetArrows}
              choiseTopIndex={choiseTopIndex} SetChoiseTop={SetChoiseTop}
              choiseArrowIndex={choiseArrowIndex} SetChoiseArrow={SetChoiseArrow}
              topHalfSize={topHalfSize}
              getEdge={getEdge}
              getAreaRef={getAreaRef}/>
          </div>
        </div>
      </Context.Provider>
    )
}
export default Practic;