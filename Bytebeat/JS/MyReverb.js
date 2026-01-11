// CAUTION: If this lags, use Kimapr's player.
// Link: https://bytebeat.kimapr.net

// Values for Kimapr users:
// ==ByteBeat==
// @title Bytebeat Reverb
// @freq 24000
// @f48k no
// @mode floatbeat
// @parallel no
// ==/ByteBeat==

// Unique features:
// Accepts both mono and stereo Bytebeats! (Surprisingly, nobody has done this before)
// Supports multiple sample rates (Use TargetSampleRate)
// Preserves quality of original signal by deflaut (You can turn it off)

t||(
OrigSampleRate=8000,
TargetSampleRate=24000,
PreserveQuantisation=1
),

Inp=(t=>( // Input your Bytebeat here.

((sb=t>65535)&0)+max(min(((y=2**([15,15,23,8][t>>14&3]/12))&0)+1.2*((y*t*.241&63)+(y*t*.25&63))+(((a=1-(t&2047)/2047)&0)+((5*t&2047)*a&128)*(1394811683>>(t>>11&31)&1)*a+((d=(14*t*t^t)&2047)*a&127)*(2755970116>>(t>>11&31)&1)*a*1.5+.1337*(a*a*d*(t>>9&1)&127))*sb+((g=(t&2047)/2047)&0)+((g=1-g*g)&0)+((h=2**([[15,18,17,17,17,17,999,999,22,22,999,18,999,15,20,22],[20,18,17,17,10,10,999,999,20,22,20,18,17,18,17,10]][2<(t>>14&3)&1][t>>10&15]/12))&0)+((h*t&31)+(h*t*1.992&31)+(h*t*.497&31)+(h*t*.977&31)-64)*g*2*sb,127),-128)+128


))(t/TargetSampleRate*OrigSampleRate)||0,

t||( // To speed up calculations. (Initialise once)

PreCalc={ // Precalculate stuff to save CPU cycles.
APFMod:[31824,30768,27593,18601,29743,23471,24491,24293,29140,23845,32942,28493].map(x=>2/x),
Decays:[.93,.97,.95,.91,.98,.93,.85,.87,.92,.77,.94].map(x=>x*.93),
LPFDecay:[.99,.98,.97,.96,.95,.94,.93,.94]
},

Init=Array(32).fill(0),
i0=Array(l0=8797*TargetSampleRate/48000|0).fill(0),
i1=Array(l1=8173*TargetSampleRate/48000|0).fill(0),
i2=Array(l2=7777*TargetSampleRate/48000|0).fill(0),
i3=Array(l3=5431*TargetSampleRate/48000|0).fill(0),
i4=Array(l4=3577*TargetSampleRate/48000|0).fill(0),
i5=Array(l5=9783*TargetSampleRate/48000|0).fill(0),
i6=Array(l6=11734*TargetSampleRate/48000|0).fill(0),
i7=Array(l7=6217*TargetSampleRate/48000|0).fill(0),
i8=Array(l8=2743*TargetSampleRate/48000|0).fill(0),
i9=Array(l9=4921*TargetSampleRate/48000|0).fill(0),

Lpfr=(x,y)=>(Cnt=LpfI++,FilterStuff.z0[Cnt]??=0,FilterStuff.z0[Cnt]+=(x-FilterStuff.z0[Cnt])*y),

FilterStuff={
XPBuffer:[],
YPBuffer:[],
z0:[],
z1:[]
}
),
// AllPass Filter made by Ameen and made infinitely instanciable by Tutaful (Two2Fall)
// Anyone can use this!
AllPassCount=0,
APF = AllPass = (x, Alpha) => (
	APCall = AllPassCount++,
	this.FilterStuff.XPBuffer[APCall] ??= 0,
	this.FilterStuff.YPBuffer[APCall] ??= 0,

	y = (
		-Alpha * x + this.FilterStuff.XPBuffer[APCall]
		+ Alpha * this.FilterStuff.YPBuffer[APCall]
	),

	this.FilterStuff.XPBuffer[APCall] = x,
	this.FilterStuff.YPBuffer[APCall] = y,

	this.FilterStuff.YPBuffer[APCall]
),
Inp=Array.isArray(Inp)?(Inp[0]%256+Inp[1]%256)/256-1:Inp%256/128-1, // Check wether Bytebeat is stereo or mono to handle it correctly.

LpfI=0,
(PreserveQuantisation?(Init[t%(TargetSampleRate/OrigSampleRate)|0]=Inp,Inp=Init[0]):0), // Crush Bytebeat back to original quality to preserve sound accuracy.

// Remove DC offsets.
tInp=Inp-Lpfr(Inp,.005),

// Outputs.
Out0=tInp+i0[t%l0],
Out1=tInp+i1[t%l1],
Out2=tInp+i2[t%l2],
Out3=tInp+i3[t%l3],
Out4=tInp+i4[t%l4],
Out5=tInp+i5[t%l5],
Out6=tInp+i6[t%l6],
Out7=tInp+i7[t%l7],
Out8=tInp+i8[t%l8],
Out9=tInp+i9[t%l9],


// Arrays (Delays/Combs)
i0[t%l0]=APF(Lpfr(Out0*PreCalc.Decays[0],PreCalc.LPFDecay[0]),sin(t*PreCalc.APFMod[0])*.99),

i1[t%l1]=APF(Lpfr(Out1*PreCalc.Decays[1],PreCalc.LPFDecay[1]),sin(t*PreCalc.APFMod[1])*.88),

i2[t%l2]=APF(Lpfr(Out2*PreCalc.Decays[2],PreCalc.LPFDecay[2]),sin(t*PreCalc.APFMod[2])*.91),

i3[t%l3]=APF(Lpfr(Out3*PreCalc.Decays[3],PreCalc.LPFDecay[3]),sin(t*PreCalc.APFMod[3])*.93),

i4[t%l4]=APF(Lpfr(Out4*PreCalc.Decays[4],PreCalc.LPFDecay[3]),sin(t*PreCalc.APFMod[4])*.87),

i5[t%l5]=APF(Lpfr(Out5*PreCalc.Decays[4],PreCalc.LPFDecay[4]),sin(t*PreCalc.APFMod[5])*.94),

i6[t%l6]=APF(Lpfr(Out6*PreCalc.Decays[5],PreCalc.LPFDecay[5]),sin(t*PreCalc.APFMod[6])*.89),

i7[t%l7]=APF(Lpfr(Out7*PreCalc.Decays[6],PreCalc.LPFDecay[6]),sin(t*PreCalc.APFMod[7])*.93),

i8[t%l8]=APF(Lpfr(Out7*PreCalc.Decays[7],PreCalc.LPFDecay[7]),sin(t*PreCalc.APFMod[8])*.91),

i9[t%l9]=APF(Out8*PreCalc.Decays[7],sin(t*PreCalc.APFMod[8])*.8),


Out=Lpfr(Lpfr((Out0+Out1*.2+Out2*.4+Out3*.4+Out4*.1+Out6*.2+Out5*.4+Out7*.4+Out8*.4+Out9*.25)*.2,.8),.8),


[Out,(Lpfr(Out+Out0*.2,.03)*1.8+Out)*.6] // Final output (Stereo, of course.)
