# Wave Tone

A simple WebAudio tone generator responsive to a single dimension of device orientation.

This is a simple web page with no hand-wavy magic; i.e. no Grunt, Bower, or SASS.

### Getting Started
This app is reliant on the device orientation API so it must be viewed on a capable device and browser, e.g. a smart phone or tablet. Consequently, it must be served from a user's computer.

On OS X, open the folder in the Terminal app and type "`python -m SimpleHTTPServer 8000`". This will now serve the folder contents. You will now need to find your computer's IP address (available in the System Preferences under Network), which will look something like "10.0.0.1". Now enter this followed by ":8000", e.g. "10.0.0.1:8000", into your device.

For development, [`watch-http-server`](https://www.npmjs.com/package/watch-http-server) (or just `whs`) is pretty nice.
