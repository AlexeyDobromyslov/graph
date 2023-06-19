import React, {useContext,useEffect,useState} from 'react';
import {getArrowParam} from "../../functions/getArrowParam"
import Time from '../Time/Time';
import { Context } from '../../context';

const Arrow= function(props){
    //получение параметров для построения изображения стрелки и стилизации её корневого элемента
    const [x, y, c, angle, width,begin]=getArrowParam(props.arrow, true, props.edge)

    const [value,SetValue]=useState(props.arrow.value)//переменная состояни значения времени
    
    useEffect(
      ()=>{
      SetValue(props.arrow.value)
      },
      [props.arrow.value])//необходим для случая, когда время дуги меняет не пользователь

    const {update,SetUpdate}=useContext(Context) //глобальный флаг для разрешения редактирования времени

    //стилистические настройки стрелки в зависимости от того
    //выбрана ли она пользователем?
    //принадлежит ли критическому пути?
    //является ли обнуленной?
    const defaultColor=props.arrow.null?"white":"teal"
    const color=props.arrow.cond?"rgb(242, 19, 112)":`${props.arrow.crit?"red":defaultColor}`
    const defaultOpacity=props.arrow.null?0.8:0
    const opacity=props.arrow.cond?0.3:defaultOpacity
    const zIndex=props.arrow.cond?2:1
    const defaultStroke=props.arrow.null?'teal':'rgb(222,67,123)'
    const defaultStrokeWidth=props.arrow.null?9:3
    const defaultStrokeWidth2=props.arrow.null?0:2.5
    
    
   const style0={//стилизация корневого элемента стрелки
      position: "absolute",
      height: `${c}px`,
      top: `${y}px`,
      left: `${x}px`,
      transformOrigin: props.arrow.deviation==0?"center":`${begin}px ${c/2}px`,
      transform: `rotate(${angle}rad)`,
      zIndex: zIndex,
      pointerEvents: 'none',
      //background: "black"
    }
    
    //для обработки событий только при взаимодействии с изображением
    const svgStyle={ pointerEvents:'stroke'}

    const style1={//стилизация текстового поля
      position: 'absolute',
      top: `${c/2-8}px`,
      left: props.arrow.deviation>=0?`auto`:`16px`,
      right: props.arrow.deviation>=0?`16px`:`auto`,
      transformOrigin: "center",
      transform: `rotate(${-angle}rad)`,
      zIndex: zIndex,
      color: props.arrow.null?'transparent':color,
      pointerEvents: 'auto'
      
     }
    
  const forViewBox=props.arrow.deviation!=0//параметры корневого эдемента
  ?`0 0  ${width} ${c+16}`
  :`0 0  ${width} ${c}` 

  const forPath1=props.arrow.deviation!=0 //путь изображения дуги
  ?`M${begin} 8 Q ${begin+10*props.arrow.deviation} ${c/2+8}, ${begin} ${c+8}`
  :`M ${begin} 0 Q ${begin} ${c/2}, ${begin} ${c}`

  //путь изображения указателя дуги
  const forPath2=`M ${begin+10*props.arrow.deviation/2} ${props.arrow.deviation!=0?c/2+13:c/2+5} l 4 -10 l -8 0 l 4 10`
  
   function choise(e,deleteCondition) { //обработчик события нажатия
    props.choise(props.arrow,deleteCondition);
    e.stopPropagation();
   }
   function notZero(e){ //обработчик события ухода с текстового поля
    if(Number(e.target.value)<1&&update){//если значение меньше единицы и эта
                                                    
      
      SetValue(1)
      props.arrow.value=1//установка значения равного единице
    }
   }

    return(
      <div style={style0} >
        <Time value={value} style={style1} readOnly={!update} object={props.arrow}
        onClick={ //обработчик события нажатия по текстовому полю
          (e)=>choise(e, false)
        } 
        onChange={ //обработчик события изменения текстового поля
          (e)=>{
            SetValue(e.target.value)
            props.arrow.value=e.target.value
          }
        }
        onBlur={notZero} />
        <svg version="1.1" width={width} height="100%" viewBox={forViewBox} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <g  
          onClick={//обработчик события нажатия по изображению
            (e)=>choise(e, true)
          }>
            <path style={svgStyle} d={forPath1} fill="none" stroke={defaultStroke} strokeWidth="16" opacity={opacity}/>
            <path style={svgStyle} d={forPath1} fill="none" stroke={color} strokeWidth={defaultStrokeWidth}/>
            <path style={svgStyle} d={forPath2} fill={color} stroke={color} strokeWidth={defaultStrokeWidth2} />
          </g>
        </svg>
      </div>
    )
}
export default Arrow;

