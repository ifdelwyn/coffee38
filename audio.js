// Audio Engine for HBcoffee: Hỗ trợ cả file MP3 chất lượng cao & Web Audio API Synthesizer Lo-Fi BGM
class SoundManager {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem('cf_sound') !== 'false';
    this.bgmPlaying = false;
    this.bgmOscillators = [];
    this.bgmInterval = null;

    // Load actual audio files
    this.sounds = {
      open: new Audio('audio/openstore.mp3'),
      click: new Audio('audio/click.mp3'),
      correct: new Audio('audio/correct.mp3'),
      ing: new Audio('audio/ingredient.mp3')
    };

    // Preload & lower volume slightly for comfort
    Object.values(this.sounds).forEach(audio => {
      audio.volume = 0.6;
    });
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('cf_sound', this.enabled);
    if (!this.enabled) {
      this.stopBGM();
    } else {
      this.playCoin();
      this.startBGM();
    }
    return this.enabled;
  }

  playAudio(key) {
    if (!this.enabled) return;
    try {
      if (this.sounds[key]) {
        this.sounds[key].currentTime = 0;
        this.sounds[key].play().catch(() => {});
      }
    } catch (e) {}
  }

  playOpenStore() {
    this.playAudio('open');
  }

  playClick() {
    this.playAudio('click');
  }

  playAdd() {
    this.playAudio('ing');
  }

  playServeSuccess() {
    this.playAudio('correct');
  }

  playCoin() {
    this.init();
    if (!this.enabled || !this.ctx) return;
    this.playTone(987.77, 'sine', 0.08, 0, 0.15); // B5
    this.playTone(1318.51, 'sine', 0.22, 0.08, 0.18); // E6
  }

  playServeFail() {
    this.init();
    if (!this.enabled || !this.ctx) return;
    this.playTone(280, 'sawtooth', 0.15, 0, 0.12);
    this.playTone(210, 'sawtooth', 0.22, 0.12, 0.12);
  }

  playDrama() {
    this.init();
    if (!this.enabled || !this.ctx) return;
    this.playTone(440, 'square', 0.09, 0, 0.15);
    this.playTone(330, 'square', 0.09, 0.08, 0.15);
    this.playTone(440, 'square', 0.25, 0.16, 0.18);
  }

  playTone(freq, type, duration, startTime = 0, gainVal = 0.12) {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = this.ctx.currentTime + startTime;

      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(gainVal, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + duration);
    } catch (e) {}
  }

  // Cozy Lo-Fi Chill Cafe Chord Progression (Web Audio Synthesizer)
  startBGM() {
    if (!this.enabled || this.bgmPlaying) return;
    this.init();
    if (!this.ctx) return;
    this.bgmPlaying = true;

    // Jazzy Lo-Fi chords: Dmaj9 -> C#m7 -> Bm7 -> Aadd9
    const chords = [
      [146.83, 220.00, 277.18, 329.63, 440.00], // Dmaj9
      [138.59, 207.65, 246.94, 329.63, 415.30], // C#m7
      [123.47, 185.00, 220.00, 293.66, 369.99], // Bm7
      [110.00, 164.81, 220.00, 277.18, 329.63]  // Aadd9
    ];
    let chordIdx = 0;

    const playChordStep = () => {
      if (!this.bgmPlaying || !this.enabled || !this.ctx) return;
      const t = this.ctx.currentTime;
      const notes = chords[chordIdx];
      chordIdx = (chordIdx + 1) % chords.length;

      notes.forEach((freq, i) => {
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = i === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, t);

          // Gentle soft Rhodes electric piano envelope
          const vel = i === 0 ? 0.08 : 0.035;
          gain.gain.setValueAtTime(0.001, t);
          gain.gain.linearRampToValueAtTime(vel, t + 0.15);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 2.8);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 2.9);
        } catch (e) {}
      });
    };

    playChordStep();
    this.bgmInterval = setInterval(playChordStep, 3000);
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

const snd = new SoundManager();
