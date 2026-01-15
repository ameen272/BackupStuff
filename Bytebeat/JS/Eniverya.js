t||(
fi=0,
GenNote=x=>int(2**(x*.083333)*.03125*2.37*2048)/2048||0,
Tri=x=>int(asin(sin(x*PI/4))*.625*8)/2,
Squ=(x,y=1)=>(x*=.25,(x*y&1))*2-2||0,

Melody0='ffm m ffm m ffm m fhjkjhffm m ffm m ffm m aabbdd',

Melody1='jjjj  hhhh  ffff  hhfghijjjj  hhhh  eeee  aaaa'
),

TriVol=fi+=((t*(1+1/3)&32768?0:7)-fi)/128,

Inpp=(x=1)=>(
Squ(t*GenNote(parseInt(Melody0[(t>>13)%48],36)-27),x)*7
+(Squ(t*GenNote(parseInt(Melody1[(t>>13)%48],36)-7),x)+Squ(t*GenNote(parseInt(Melody1[(t>>13)%48],36)-12),x))*(t>39e4)*3
+(t>1175e3)*Tri(t/(26.8+x/8))*TriVol
),

Inpp()
