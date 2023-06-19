import React, {useState, useRef, useContext}from 'react';
import './styles.css'
import Time from '../Time/Time';
import {Context} from "../../context"


const Top= function(props){
    
   const topRef=useRef() //ссылка на элемент вершины

   //выбор класса таблицы стилей в зависимости от того, выбрана вершина или нет
   const selectClasses=`${props.top.cond?'top_select':'top_nonselect'}`

   //выбор класса таблицы стилей в зависимости от свойства ошибки вершины
   const classes=`top ${props.top.error?'top_error':selectClasses}`

   const [value,SetValue]=useState(props.top.value)//для взаимодействия с временной характеристикой
   const {update,SetUpdate}=useContext(Context) //глобальный флаг для разрешения редактирования времени
 
   const style0={//стилизация временной характеристики
    position: 'absolute',
    top:-20,
    color: props.top.error?'red':'teal'
   }

   //функция обработки нажатия на вершину
   function choise(e,choiseCondition, deleteCondition) { 
    props.choise(props.top, choiseCondition, deleteCondition);//выбор вершины (функция передана из компонента Area)
    e.stopPropagation(); //предотвращение дальнейшего распространения события
   }
   
    return(
        <div className={classes} ref={topRef} style={props.top.style}  draggable={true}  
        onDragStart={//обраюотчик события начала перетаскивания
          (event)=>props.hide(props.top, topRef,event)//(функция передана из компонента Area)
        } 
        onClick={//обработчик события нажатия на вершину
          (e)=>choise(e,true,true)
        }>
          {props.index}
          <Time value={value} style={style0} readOnly={!update} object={props.top}
          onClick={//обработчик нажатия на текстовое поле
            (e)=>{choise(e,false,false)}
          }
          onChange={//обработчик события изменения текстового поля
            (e)=>{
              SetValue(e.target.value)
              props.top.value=e.target.value
            }
          }
          />
        </div>
    )

}
export default Top;