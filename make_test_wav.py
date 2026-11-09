import numpy as np, wave, sys
SR, DUR = 48000, 6
NCH = int(sys.argv[1]) if len(sys.argv) > 1 else 12
OUT = sys.argv[2] if len(sys.argv) > 2 else f"test_{NCH}ch.wav"
t = np.arange(SR*DUR)/SR
freqs = [220,277,330,40,440,554,660,880,1000,1200,1400,1600]
ch = []
for c in range(NCH):
    if c == 3:   ch.append(np.sin(2*np.pi*40*t))
    elif c >= 8: ch.append(np.sin(2*np.pi*freqs[c]*t)*((t%4>=2)&(t%4<3)))
    else:        ch.append(np.sin(2*np.pi*freqs[c]*t)*(0.5+0.5*np.sin(2*np.pi*t/3)))
data = (np.stack(ch, axis=1)*0.6*32767).astype('<i2')
w = wave.open(OUT,'wb'); w.setnchannels(NCH); w.setsampwidth(2); w.setframerate(SR)
w.writeframes(data.tobytes()); w.close()
print("wrote", OUT)
