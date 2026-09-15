// Botanical Atelier Ambient Soundscape Synthesizer
// Uses Web Audio API to create a soothing, organic breeze and subtle foliage rustle
// 100% client-side, 0kb external files, soothing and gentle.

class BotanicalAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private lfoNode: OscillatorNode | null = null;

  public init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }

  public start() {
    if (!this.ctx) this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    try {
      // 1. Create Pink Noise Buffer for organic leaf breeze
      const bufferSize = this.ctx.sampleRate * 4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.035;
        b6 = white * 0.115926;
      }

      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = buffer;
      this.noiseNode.loop = true;

      // 2. Low-pass filter simulating wind through dense preserved leaves
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.value = 420;
      this.filterNode.Q.value = 1.2;

      // 3. Gentle LFO to modulate breeze frequency
      this.lfoNode = this.ctx.createOscillator();
      this.lfoNode.frequency.value = 0.18; // Slow, natural respiration rhythm
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.value = 180;
      this.lfoNode.connect(lfoGain);
      lfoGain.connect(this.filterNode.frequency);

      // 4. Master Gain for gentle fade-in
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(0.08, this.ctx.currentTime + 2.5);

      this.noiseNode.connect(this.filterNode);
      this.filterNode.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.noiseNode.start();
      this.lfoNode.start();
      this.isPlaying = true;
    } catch (e) {
      console.warn('Botanical soundscape unavailable:', e);
      this.isPlaying = false;
    }
  }

  public stop() {
    if (!this.ctx || !this.isPlaying || !this.masterGain) return;
    try {
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);
      setTimeout(() => {
        try {
          this.noiseNode?.stop();
          this.noiseNode?.disconnect();
          this.lfoNode?.stop();
          this.lfoNode?.disconnect();
        } catch (err) {}
        this.isPlaying = false;
      }, 1300);
    } catch (e) {
      this.isPlaying = false;
    }
  }
}

export const botanicalAudio = new BotanicalAudioEngine();
