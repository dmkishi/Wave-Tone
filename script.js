function WaveTone(init_gain) {
  var context;
  var that = this;

  init();

  function init() {
    context = new (window.AudioContext || window.webkitAudioContext)();

    that.osc             = context.createOscillator();
    that.osc.type        = 'sine';
    that.gain            = context.createGain();
    that.gain.gain.value = init_gain;

    that.osc.connect(that.gain);
    that.gain.connect(context.destination);
  };

  this.start = function() {
    init();
    that.osc.start(0);
  };

  this.stop = function() {
    that.osc.stop(0);
  };
};


Math.toRadian = function(degree) {
  return degree * (Math.PI / 180);
};




var master_switch    = document.getElementById('js-master-switch'),
    vol_input        = document.getElementById('js-vol--input'),
    vol_output       = document.getElementById('js-vol--value'),
    min_input        = document.getElementById('js-min-freq--input'),
    max_input        = document.getElementById('js-max-freq--input'),
    degree_output    = document.getElementById('degree-output'),
    slope_output     = document.getElementById('slope-output'),
    frequency_output = document.getElementById('frequency-output');
var min_freq   = min_input.valueAsNumber,
    max_freq   = max_input.valueAsNumber,
    freq_delta = max_freq - min_freq,
    degree, slope;
var synth = new WaveTone(vol_input.valueAsNumber / 100);


master_switch.onchange = function() {
  if (this.checked) synth.start();
  else              synth.stop();
};

vol_input.onchange = function() {
  synth.gain.gain.value = this.valueAsNumber / 100;
  vol_output.innerHTML  = this.valueAsNumber;
}

min_input.onchange = function() {
  min_freq = this.valueAsNumber;
  freq_delta = max_freq - min_freq;
};

max_input.onchange = function() {
  max_freq = this.valueAsNumber;
  freq_delta = max_freq - min_freq;
};

window.ondeviceorientation = function(evt) {
  degree                    = degree_output.innerHTML    = evt.beta;
  slope                     = slope_output.innerHTML     = Math.sin(Math.toRadian(degree));
  synth.osc.frequency.value = frequency_output.innerHTML = min_freq + (freq_delta * Math.abs(slope));
};
