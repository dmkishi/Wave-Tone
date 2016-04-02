// CONSTANTS ===================================================================
const MIN_VOLUME       = 0;
const MAX_VOLUME       = 1;

const DEFAULT_VOLUME   = 0.25;



// INIT ========================================================================
// Web Audio Nodes -------------------------------------------------------------
var context = new (window.AudioContext || window.webkitAudioContext)();

var osc                 = context.createOscillator();
    osc.type            = 'sine';
    osc.frequency.value = 1;  // Value is irrelavant, must simply exist

var gain = context.createGain();
    gain.gain.value = DEFAULT_VOLUME;

osc.connect(gain);
gain.connect(context.destination);



// MASTER SWITCH ===============================================================
// The master switch, on first press, initiates the tone generator, then, when
// clicked again, definitively deactivates all signal processing, saving CPU
// loads. In order to reenable it, the page must be refreshed. For temporarily 
// pausing the tone, use the volume switch below.
$('.js-switch--input').change(function() {
  if ($(this).prop('checked')) {
    osc.start(0);
  } else {
    osc.stop(0);
    $(this).prop('disabled', true);
    $('.js-switch').addClass('switch__disabled');
    window.ondeviceorientation = null;
    window.ondevicemotion      = null;
  }
});



// TONE CONTROLS ===============================================================
// Volume ----------------------------------------------------------------------
var vol_input  = document.getElementById('js-vol--input'),
    vol_output = document.getElementById('js-vol--value');

vol_input.onchange = function() {
  gain.gain.value      = this.valueAsNumber / 100;
  vol_output.innerHTML = this.valueAsNumber;
}


// Tone ------------------------------------------------------------------------
var min_input        = document.getElementById('js-min-freq--input'),
    max_input        = document.getElementById('js-max-freq--input'),
    min_output       = document.getElementById('js-min-freq--value'),
    max_output       = document.getElementById('js-max-freq--value'),
    degree_output    = document.getElementById('degree-output'),
    slope_output     = document.getElementById('slope-output'),
    frequency_output = document.getElementById('frequency-output');

var min_freq   = min_input.valueAsNumber,
    max_freq   = max_input.valueAsNumber,
    freq_delta = max_freq - min_freq,
    degree, slope, frequency;


Math.toRadian = function(degree) {
  return degree * (Math.PI / 180);
};


min_input.onchange = function() {
  min_output.innerHTML = min_freq = this.valueAsNumber;
  freq_delta = max_freq - min_freq;
};

max_input.onchange = function() {
  max_output.innerHTML = max_freq = this.valueAsNumber;
  freq_delta = max_freq - min_freq;
};

window.ondeviceorientation = function (evt) {
  degree              = degree_output.innerHTML    = evt.beta;
  slope               = slope_output.innerHTML     = Math.sin(Math.toRadian(degree));
  osc.frequency.value = frequency_output.innerHTML = min_freq + (freq_delta * Math.abs(slope));
};
