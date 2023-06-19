
export const getArrowParam=(arrow, condition, edge)=>{
  //condition - false - просто проверка за выход границ edge
  //condition - true - изменение искривления стрелки до тех пор, пока она не будет в границе edge

  //расчет ширины коревого блока изображения стрелки
  let width=arrow.deviation!=0// если искривление не равно нулю
  ?16+Math.abs(10*arrow.deviation)/2
  :16
  //определение начала отрисовки изображения по горизонтали
  let begin=arrow.deviation>=0?8:width-8
  let end=width-begin//конец отрисовки по горизонтали
  
  let x1=arrow.x1-begin,//параллельный сдвиг по горизонтали
      x2=arrow.x2-begin,  
      y1=arrow.y1, 
      y2=arrow.y2
  let 
      //координаты позиционирования
      x,
      y,
      //переменные для промежуточных расчетов 
      midy, 
      midx,
      //угол поворота 
      angle, 
      //катеты
      a, 
      b, 
      //гипотенуза
      c, 
      //границы корневого юлока
      minx,
      miny,
      maxx,
      maxy
  //определение катетов для расчета угла   
  a=x2-x1;
  b=y2-y1;

  //расчет угла поворота
  if(y2>y1){
      angle=Math.atan(-a/b);
  }
  if(y2<y1){
      angle=Math.atan(-a/b)+Math.PI; 
  }
  if(y2===y1){
      if(x2<x1){
          angle=Math.PI/2
      }else{
          angle=-Math.PI/2
      }
  }

  if(arrow.deviation!=0){//если искривление не равно нулю
    let sin=Math.sin(angle)
    let cos=Math.cos(angle)
    let updateX=sin*8;//cos(90-a)
    let updateY=cos*8;//sin(90-a)
    
    //поправки на координаты
    x1+=updateX
    x2-=updateX
    y1-=updateY
    y2+=updateY

    //расчет границ коревого блока
    maxx=Math.max(x1-cos*begin+begin,x1+cos*end+begin,x2-cos*begin+begin,x2+cos*end+begin)
    minx=Math.min(x1-cos*begin+begin,x1+cos*end+begin,x2-cos*begin+begin,x2+cos*end+begin)
    maxy=Math.max(y1-sin*begin,y1+sin*end,y2-sin*begin, y2+sin*end)
    miny=Math.min(y1-sin*begin,y1+sin*end,y2-sin*begin, y2+sin*end)
    if(!condition){//если просто проверяем границы
      if(minx<0||maxx>edge[0]||miny<0||maxy>edge[1]-5){
          return false
      }
      return true
    }
    while((minx<0||maxx>edge[0]||miny<0||maxy>edge[1]-5)){//пока оно за границами
      if(arrow.deviation>=0){ 
        arrow.deviation-=4;
      }
      else{
        arrow.deviation+=4;   
      }
      width=16+Math.abs(10*arrow.deviation)/2//расчитываем новую ширину
      begin=arrow.deviation>=0?8:width-8 //расчитываем новое начало
      end=width-begin //расчитываем новый конец
      //параллельный сдвиг по горизонтали
      x1=arrow.x1-begin
      x2=arrow.x2-begin
      //поправка
      x1+=updateX
      x2-=updateX
      //определение границ корневого блока
      maxx=Math.max(x1-cos*begin+begin,x1+cos*end+begin,x2-cos*begin+begin,x2+cos*end+begin)
      minx=Math.min(x1-cos*begin+begin,x1+cos*end+begin,x2-cos*begin+begin,x2+cos*end+begin)
      maxy=Math.max(y1-sin*begin,y1+sin*end,y2-sin*begin, y2+sin*end)
      miny=Math.min(y1-sin*begin,y1+sin*end,y2-sin*begin, y2+sin*end)
    }
    //расчет катетов для гипотенузы
    a=x2-x1;
    b=y2-y1;
  }
  c=Math.sqrt(a*a+b*b);
  midx=(x1+x2)/2;
  midy=(y1+y2)/2;
  //определение координат позиционирования изображения
  y=midy-c/2;
  x=midx+0;
  return [x, y, c, angle, width,begin]
}
