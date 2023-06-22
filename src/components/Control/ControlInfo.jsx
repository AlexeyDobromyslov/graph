import React from 'react';
import'./styles.css';
import { convertPathToString } from '../../functions/convertPathToString';

const ControlInfo=({title, check, content})=>{
  let infoStyle={display: check?'':'none'}
    const height=40*content.data.length
    const parentHeight=height>400?460:height+60
    const childHeight=height>400?400:height
    const heightChildPath={
      height: `${childHeight}px`
    }
    if(!(content.type=='table'||content.type=='diagrams')){
      infoStyle={
        ...infoStyle,
        height: `${parentHeight}px`,
        overflow: 'auto'
      }
    }else{
      infoStyle={
        ...infoStyle,
        display: check?'':'none'
      }
    }
    
    function forSticky(condition,indexRow, length){
      let borderBottomNone=''
      if(indexRow==length-2){
        borderBottomNone=' borderBottomNone'
      }
      switch(condition){
        case -7: return 'forBottom forFinishNull'
        case -6: return 'forBottom forRandom';
        case -5: return 'forLeftBottom';
        case -4: return 'forBottom';
        case -3: return 'forHeadLeftHead' ;
        case -2: return 'forLeftHead'+borderBottomNone ;
        case -1: return 'forHead';
        case 0: return ''+borderBottomNone ;
        case 1: return 'influence'+borderBottomNone ;
        case 2: return 'targetCrit'+borderBottomNone ;
        case 3: return 'crites'+borderBottomNone ;
        default: return '';
      }
    }
    function forDiagrams(condition,indexRow, length){
      let borderBottomNone=''
      if(indexRow==length-2){
        borderBottomNone=' borderBottomNone'
      }
      switch(condition){
      
        case -5: return 'forLeftBottom forTactHead';
        case -4: return 'forTop forTact';
        case -2: return 'forLeftHead' ;
        case 0: return ' forEmpty' ;
        case 1: return ' forTop' ;
        case 2: return ' forArcs' ;
        case 3: return 'crites'+borderBottomNone ;
        default: return '';
      }
    }
    
      if(content.type=='pathes'){
        return(
          <div className='infoPaths' style={infoStyle} >
                <div className='infoTitle' >{title}</div>
                <div className='infoContent' style={heightChildPath}>
                {content.data.map((path, index)=>{
                  return(<div key={index} style={{height: '38px'}}>
                      Путь: {convertPathToString(path)}
                      <br/>
                      Длина пути: {path.pathLength}
                  </div>)
                })}
                </div>
              </div>
           );
      }
      if(content.type=='table'||content.type=='diagrams'){
        return(
          <div className={content.type=='diagrams'?'infoTableDia': 'infoTable'} style={infoStyle} >
                <div className='infoTitle' >{title}</div>
                 
                <div className='infoContent'>
                  <table className={content.type=='diagrams'?'forDiagrams':''}>
                    <tbody>
                    {content.data.map((row,indexRow)=>{
                      return(
                      <tr>
                        {
                          row.map((column)=>{
                    
                            return(
                              <td className={content.type=='diagrams'
                                              ?forDiagrams(column.condition,indexRow,content.data.length)
                                              :forSticky(column.condition,indexRow,content.data.length)
                                            }>
                                {column.value}
                              </td>
                            )
         
                           })
                        }
                       
                      </tr>
                      )
                    })
                    }
                </tbody>
                </table>
                
                </div>
                <div className='footerForTable'>

                </div>
              </div>
           );
      }
      
      return(
        <div className='infoPaths' style={infoStyle} >
              <div className='infoTitle' >{title}</div>
               
              
            </div>
         );

}


export default ControlInfo;
/*
                           row.map((column)=>{
                    
                            return(
                              <td>
                                {column}
                              </td>
                            )
         
                           }) */