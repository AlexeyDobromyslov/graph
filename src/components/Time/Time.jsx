import {React,useRef} from 'react';
import'./styles.css';

const Time=({...props})=>{
    const inputRef=useRef()
        let num=Number(props.value) //конвертация значения в число
        if(!Number.isInteger(num)){//если не число
            props.value=0//значение по умолчанию 0
            props.object.value=0;//я как то очень сильно сломал логику библиотеки
        }else{
            if(num<0||num>100){//если выпадает из данного диапазона
                props.value=0//значение по умолчанию 0
                props.object.value=0;//я как то очень сильно сломал логику библиотеки
            }else{
                props.value=num//устанавливается значение, введённое пользователем
            }
        }
        props.style={//стилизация для текстовго поля
                        ...props.style,//копирование предыдущей стилизации
                         width:`${(String(props.value).length)*10}px`//динамичепская ширина поля
        }
   
    //функция автоматического выделения текста при попытке изменения поля
    function end(){
        inputRef.current.setSelectionRange(0,10)
    }
    
    
 return(
    <input type="text" ref={inputRef} {...props} className='input' onFocus={end}  />
    );
}
export default Time;

//onfocus
    //inputRef.current.selectionStart=inputRef.current.selectionEnd=String(props.value).length