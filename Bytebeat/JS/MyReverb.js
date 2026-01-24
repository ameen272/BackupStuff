// ==ByteBeat==
// @title Bytebeat Reverb
// @freq 48000
// @f48k no
// @mode floatbeat
// @parallel no
// ==/ByteBeat==


// CAUTION: If this lags, use Kimapr's player.
// Link: https://bytebeat.kimapr.net


// Unique features:
// Accepts both mono and stereo Bytebeats! (Surprisingly, nobody has done this before)
// The pitch decays too!
// Supports multiple sample rates (Use TargetSampleRate)
// Preserves quality of original signal by deflaut (You can turn it off)

t||(
OrigSampleRate=32000,
TargetSampleRate=32000,
PreserveQuantisation=1
),

Inp=(t=>( // Input your Bytebeat here.

out=0,J=(c,d,m)=>{a=[];for(i=0;i<d;i++)a[i]=floor((c*i+m)/d)%c;return a},Jhas=(c,d,m,a)=>J(c,d,m).includes(a%c),mix=(a,v)=>out+=(a&255)*(v&255)/255,b=t>>12,b2=floor(b/3),mix(100*random(),5*(16-b2%16)),mix(3*t/2,(b2>>5)%4*(t/3>>10&31)),mix(12*t/5*3/4,b2%64*(b%3*30+40)/200),mix(9*t/4,b2%64*((b>>1)%3*4+40)/200),mix(12*t/5,b2%64*((b>>2)%3*5+40)/200),mix(Jhas(12,7,6,b)?2*random()+(t|t<<2)&47:0,256-(t>>4)&255),mix(Jhas(6,4,4,b)?3*t&127:0,(b2>>4)%4*(64-(t>>6)&63)),mix(Jhas(12,4*(b2>>6&3),0,b)?t-t*(b2>>3&1)*(b2>>5&1)/5>>1&(t<<3|(b2>>4)%4*(t>>8)):0,100-(t>>6&63)),mix(Jhas(12,5+((b2>>5)+3)%4,7,b)?t*(2+(b2>>1)%8)&128:0,(b2>>5)%4*(60-(t>>3)&53)),out

))(t/TargetSampleRate*OrigSampleRate)||0,

t||(PreCalc={ // Precalculate stuff to save CPU cycles.
APFMod:[31824,30768,27593,19601,29743,23471,24491,24293,29140,23845,32942,28493,38142].map(x=>7/x),
Decays:[.97,.98,.95,.96,.98,.94,.93,.94,.95,.97,.95],
LPFDecay:[.99,.99,.98,.97,.965,.96,.957,.955].map(x=>x*.8),
PitchDecays:[.9998312,.9997843,.9998527,.999935,.9998352,.9997634,.99963121,.999736,.9997317,.999782,.999852].map(x=>1/x),
CosfMod:[482,294,492,174,330,185,237,284,489,500,381].map(x=>1/x)
},

ReverbStuff={
Init:Array(32).fill(0),
i0:Array(l0=9417*TargetSampleRate/32000|0).fill(0),
i1:Array(l1=9173*TargetSampleRate/32000|0).fill(0),
i2:Array(l2=8777*TargetSampleRate/32000|0).fill(0),
i3:Array(l3=5431*TargetSampleRate/32000|0).fill(0),
i4:Array(l4=3577*TargetSampleRate/32000|0).fill(0),
i5:Array(l5=9783*TargetSampleRate/32000|0).fill(0),
i6:Array(l6=11734*TargetSampleRate/32000|0).fill(0),
i7:Array(l7=6217*TargetSampleRate/32000|0).fill(0),
i8:Array(l8=2743*TargetSampleRate/32000|0).fill(0),
i9:Array(l9=4921*TargetSampleRate/32000|0).fill(0),
iA:Array(lA=26281*TargetSampleRate/32000|0).fill(0),
Cosf:x=>(cos(x*PI/512)+1)
},

Lpfr=(x,y)=>(Cnt=LpfI++,FilterStuff.z0[Cnt]??=0,FilterStuff.z0[Cnt]+=(x-FilterStuff.z0[Cnt])*y),

FilterStuff={
XPBuffer:[],
YPBuffer:[],
z0:[],
z1:[]
}),
// AllPass Filter made by Ameen and made infReverbStuff.Initely instanciable by Tutaful (Two2Fall)
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
Inp=Array.isArray(Inp)?(APF(Inp[0]%256,-.25)+APF(Inp[1]%256,.25))/256-1:Inp%256/128-1, // Check wether Bytebeat is stereo or mono to handle it correctly.

LpfI=0,
(PreserveQuantisation?(ReverbStuff.Init[t%(TargetSampleRate/OrigSampleRate)|0]=Inp,Inp=ReverbStuff.Init[0]):0), // Crush Bytebeat back to original quality to preserve sound accuracy.

// Remove DC offsets.
tInp=Inp-Lpfr(Inp,.02),

// Outputs.
Out0=tInp+ReverbStuff.i0[t%l0],
Out1=tInp+ReverbStuff.i1[t%l1],
Out2=tInp+ReverbStuff.i2[t%l2],
Out3=tInp+ReverbStuff.i3[t%l3],
Out4=tInp+ReverbStuff.i4[t%l4],
Out5=tInp+ReverbStuff.i5[t%l5],
Out6=tInp+ReverbStuff.i6[t%l6],
Out7=tInp+ReverbStuff.i7[t%l7],
Out8=tInp+ReverbStuff.i8[t%l8],
Out9=tInp+ReverbStuff.i9[t%l9],
OutA=tInp+ReverbStuff.iA[t%lA],

RealT=t,
t+=28318,
// Arrays (Delays/Combs)
ReverbStuff.i0[(t*PreCalc.PitchDecays[0]+ReverbStuff.Cosf(RealT*PreCalc.CosfMod[0])*165+4921)%l0|0]=APF(Lpfr(Out0*PreCalc.Decays[0],PreCalc.LPFDecay[0]),sin(RealT*PreCalc.APFMod[0])*.99),

ReverbStuff.i1[(t*PreCalc.PitchDecays[1]+ReverbStuff.Cosf(RealT*PreCalc.CosfMod[1])*180+1838)%l1|0]=APF(Lpfr(Out1*PreCalc.Decays[1],PreCalc.LPFDecay[1]),sin(RealT*PreCalc.APFMod[1])*.87),

ReverbStuff.i2[(t*PreCalc.PitchDecays[2]+ReverbStuff.Cosf(RealT*PreCalc.CosfMod[2])*300+6938)%l2|0]=APF(Lpfr(Out2*PreCalc.Decays[2],PreCalc.LPFDecay[2]),sin(RealT*PreCalc.APFMod[2])*.91),

ReverbStuff.i3[(t*PreCalc.PitchDecays[3]+ReverbStuff.Cosf(RealT*PreCalc.CosfMod[3])*200+2918)%l3|0]=APF(Lpfr(Out3*PreCalc.Decays[3],PreCalc.LPFDecay[3]),sin(RealT*PreCalc.APFMod[3])*.93),

ReverbStuff.i4[(t*PreCalc.PitchDecays[4]+ReverbStuff.Cosf(RealT*PreCalc.CosfMod[4])*201+1923)%l4|0]=APF(Lpfr(Out4*PreCalc.Decays[4],PreCalc.LPFDecay[3]),sin(RealT*PreCalc.APFMod[4])*.87),

ReverbStuff.i5[(t*PreCalc.PitchDecays[5]+ReverbStuff.Cosf(RealT*PreCalc.CosfMod[5])*421+3822)%l5|0]=APF(Lpfr(Out5*PreCalc.Decays[4],PreCalc.LPFDecay[4]),sin(RealT*PreCalc.APFMod[5])*.94),

ReverbStuff.i6[(t*PreCalc.PitchDecays[6]+ReverbStuff.Cosf(RealT*PreCalc.CosfMod[6])*140)%l6|0]=APF(Lpfr(Out6*PreCalc.Decays[5],PreCalc.LPFDecay[5]),sin(RealT*PreCalc.APFMod[6])*.89),

ReverbStuff.i7[(t*PreCalc.PitchDecays[7]+ReverbStuff.Cosf(RealT*PreCalc.CosfMod[7])*518+2828)%l7|0]=APF(Lpfr(Out7*PreCalc.Decays[6],PreCalc.LPFDecay[6]),sin(RealT*PreCalc.APFMod[7])*.93),

ReverbStuff.i8[(t*PreCalc.PitchDecays[8]+ReverbStuff.Cosf(RealT*PreCalc.CosfMod[8])*230+38e3)%l8|0]=APF(Lpfr(Out7*PreCalc.Decays[7],PreCalc.LPFDecay[7]),sin(RealT*PreCalc.APFMod[8])*.91),

ReverbStuff.i9[(t*PreCalc.PitchDecays[9]+ReverbStuff.Cosf(RealT*PreCalc.CosfMod[9])*128+12003)%l9|0]=APF(Out9*PreCalc.Decays[7],sin(RealT*PreCalc.APFMod[8])*.9),

ReverbStuff.iA[(t*PreCalc.PitchDecays[10]+ReverbStuff.Cosf(RealT*PreCalc.CosfMod[10])*128+16e3)%lA|0]=APF(OutA*PreCalc.Decays[8],sin(RealT*PreCalc.APFMod[9])*.9),

[(Out=Lpfr(Out0+Out1+Out2+Out3+Out4+Out6*2+Out5+Out7+Out8+Out9+OutA*1.33,.6)*.05)+Lpfr(tInp,.3)*.4,Lpfr(Out*2+OutA*.01,.5)].map(x=>Lpfr(x*.5,.6))
 // Final output

// Unstable table (Only useful to me, ignore this)
// Out0 very
// Out1 kinda
// Out2 very
// Out3 vevevery
// Out4 VERYYYYYYYYY
// Out5 kinda
// Out6 stable
// Out7 Very
// Out8 very
// Out9 (kinda+very)*.5
// OutA stable
