import React,{useState} from 'react';
import'./styles.css';
import ControlProc from './ControlProc';
import ControlButton from './ControlButton';
import LeftIcon from '../Icons/LeftIcon';
import { toInputProc } from '../../functions/toInputProc';


const ControlDist=({title, check, topsDistribution,forDists,SetForDists})=>{
  let infoStyle={display: check?'':'none'}
    function defaultDist(){
      let defaultData=toInputProc(topsDistribution)
      SetForDists(defaultData)
    }
        return(
          <div className='infoTable' style={infoStyle} >
                <div className='infoTitle' >{title}</div>
                <div className='infoContent' >{

                  topsDistribution.map((tops, index)=>{
                    return(
                      <div>
                        <ControlProc 
                        value={forDists[index]} 
                        onChange={
                          (e)=>{
                            forDists[index]=e.target.value
                            SetForDists([...forDists])
                          }
                        }
                    
                        />
                        {`Процессор ${index+1}`}
                      </div>

                    );
                  })
                }
                <ControlButton 
                  content={<LeftIcon/>}
                  onClick={defaultDist}
                />
                </div>
                
              </div>
           );

}


export default ControlDist;
