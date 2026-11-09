/* rms-meter AudioWorklet processor — sample-accurate per-bus meters */
class RMSMeter extends AudioWorkletProcessor {
  process(inputs){
    const ch=inputs[0];
    if(ch&&ch.length){
      const d=ch[0];
      let sum=0,pk=0;
      for(let i=0;i<d.length;i++){const v=d[i];sum+=v*v;const a=v<0?-v:v;if(a>pk)pk=a;}
      this.port.postMessage({rms:Math.sqrt(sum/d.length),peak:pk});
    }
    return true;
  }
}
registerProcessor('rms-meter',RMSMeter);
