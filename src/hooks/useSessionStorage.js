import {useState} from "react";

export const useSessionStorage=(key, value)=>{
 const[storedValue, SetStoredValue]=useState(
    ()=>{
        const item=window.sessionStorage.getItem(key);
        return item?JSON.parse(item):value
        //установка в storedValue значения из хранилища сессии
        //если оно есть, в противном случае входной параметр value
    }
 )
 const SetValue=(value)=>{
    SetStoredValue(value);//установка нового значения
    //его занесение в хранилище сессии
    window.sessionStorage.setItem(key,JSON.stringify(value));
 }
 return [storedValue, SetValue]
 }

