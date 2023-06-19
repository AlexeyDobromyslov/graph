export const assignTopsForCPU=(tops,nullConnect)=>{
  let forProcessors=[]
  let nullPath=[]
  nullConnect.sort((a,b)=>a.parentIndex-b.parentIndex)
      let connectConditions=Array(nullConnect.length).fill(true)
      let topConditions=Array(tops.length).fill(true)
      let nullArcIndex, parentIndex
      for(let i=0;i<nullConnect.length;i++){
        if(connectConditions[i]){
        nullPath=[]
        nullPath.push(nullConnect[i].parentIndex,nullConnect[i].childIndex)
        topConditions[nullConnect[i].parentIndex]=false
        topConditions[nullConnect[i].childIndex]=false
        connectConditions[i]=false
        parentIndex=nullConnect[i].childIndex
        while(true){
          nullArcIndex=nullConnect.findIndex((a)=>a.parentIndex==parentIndex)
          if(nullArcIndex==-1){
            break
          }
          //здесь проверка условия на то, используется ли уже дуга, не нужна
          nullPath.push(nullConnect[nullArcIndex].childIndex)
          parentIndex=nullConnect[nullArcIndex].childIndex
          topConditions[parentIndex]=false
          connectConditions[nullArcIndex]=false
        
        }
        forProcessors.push(nullPath)
      }
        
      }
      topConditions.map((condition,index)=>{
        if(condition){
          forProcessors.push([index])
        }
      })
      return forProcessors
    
}