/* GLOBAL CONSTANTS ========================================================= */
const MAX_VOLUME = 0.05;
const MIN_VOLUME = 0;
const MIN_FREQ   = 2600;
const MAX_FREQ   = 5200;



/* INITIALIZE WEB AUDIO ===================================================== */
var context = new (window.AudioContext || window.webkitAudioContext)();

var osc                 = context.createOscillator();
    osc.type            = 'sine';
    osc.frequency.value = 400; // Arbituary but we need a value

var gain = context.createGain();
    gain.gain.value = MAX_VOLUME;

osc.connect(gain);
gain.connect(context.destination);



/* MASTER CONTROLS ========================================================== */
// The master switch (a) starts the oscillator then (b) definitively deactivates
// it, ceasing all signal processing. In order to reenable it, the page must be
// refreshed. For temporarily pausing the tone, use the volume switch below.
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

// Master Volume
$('.js-volume--input').click(function() {
  gain.gain.value = ($(this).prop('checked')) ? MAX_VOLUME : MIN_VOLUME;
});




/* TONE CONTROLS ============================================================ */
const PITCH_MIN = 0,
      PITCH_MAX = 90;


Math.toRadian = function(degree) {
  return degree * (Math.PI / 180);
};


var min_input        = document.getElementById('js-min-freq--input'),
    max_input        = document.getElementById('js-max-freq--input'),
    min_output       = document.getElementById('js-min-freq--value'),
    max_output       = document.getElementById('js-max-freq--value'),
    degree_output    = document.getElementById('degree-output'),
    slope_output     = document.getElementById('slope-output'),
    frequency_output = document.getElementById('frequency-output');

var min_freq = min_input.valueAsNumber,
    max_freq = max_input.valueAsNumber,
    degree, slope, frequency;

var freq_delta = max_freq - min_freq;


min_input.onchange = function() {
  min_output.innerHTML = min_freq = min_input.valueAsNumber;
  freq_delta = max_freq - min_freq;
};

max_input.onchange = function() {
  max_output.innerHTML = max_freq = max_input.valueAsNumber;
  freq_delta = max_freq - min_freq;
};

window.ondeviceorientation = function (e) {
  degree              = degree_output.innerHTML    = e.beta;
  slope               = slope_output.innerHTML     = Math.sin(Math.toRadian(degree));
  osc.frequency.value = frequency_output.innerHTML = min_freq + (freq_delta * Math.abs(slope));
};
