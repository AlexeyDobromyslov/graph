export const addTact=(table,data,tact)=>{
  let i=0
  let cell
  let dataCell
    data.map((element)=>{
      if(element){
        if(element.type=="top"){
          cell={value: element.data, condition: 1}
        }else{
          cell={value: element.data,condition: 2}
        }
      }else{
        cell={value: '', condition: 0}
      }
      table[i].push(cell)
      i++
    })
    table[i].push({value: `${tact+1}`, condition: -4})
}