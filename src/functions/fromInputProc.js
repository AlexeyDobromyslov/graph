export const fromInputProc=(topsDistributionInput)=>{
    let topsDistribution=[]
    topsDistributionInput.map((tops)=>{
      let onOneProcessor=tops.split(" ")
      
      let forInput=[]
      onOneProcessor.map((indexString)=>{
        if(indexString!==""){
        if(Number(indexString)-1>=0){
          forInput.push(Number(indexString)-1)
        }else{
          forInput.push(-1)
        }
      }
        
      })
      if(forInput.length>0){
        topsDistribution.push(forInput)
      }
      
    })
    return topsDistribution
}