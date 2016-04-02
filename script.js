// GLOBAL CONSTANTS ============================================================
const MIN_VOLUME     = 0;
const MAX_VOLUME     = 1;
const DEFAULT_VOLUME = 0.25;
const MIN_FREQ       = 2600;
const MAX_FREQ       = 5200;
const DEFAULT_FREQ   = MIN_FREQ;



// INITIALIZE WEB AUDIO ========================================================
var context = new (window.AudioContext || window.webkitAudioContext)();

var osc                 = context.createOscillator();
    osc.type            = 'sine';
    osc.frequency.value = DEFAULT_FREQ;

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
    $('.js-volume').removeClass('volume__disabled');
    $('.js-volume--input').prop({'disabled': false, 'checked': true});
    osc.start(0);
  } else {
    $(this).prop('disabled', true);
    $('.js-volume--input').prop({'disabled': true, 'checked': false});
    $('.js-switch').addClass('switch__disabled');
    $('.js-volume').addClass('volume__disabled');
    osc.stop(0);
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
