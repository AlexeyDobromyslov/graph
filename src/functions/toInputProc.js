export const toInputProc=(topsDistribution)=>{
    let arrayInput=[]
    topsDistribution.map((tops, index)=>{
      let onOneProcessor=""
      tops.map((top)=>{
        onOneProcessor+=` ${top+1}`
      })
      arrayInput.push(onOneProcessor)
    })
    return arrayInput
}