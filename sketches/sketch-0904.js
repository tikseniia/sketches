let sketch0904 = function(p) {
  let osc, oscTop, envelope, envelopeTop, fft, cSize;

  let scaleArray = [40, 45, 38, 47, 36, 45, 34, 50];
  let scaleArrayTop = [55, 57, 55, 59];
  let note = 0;
  let noteTop = 0;

  p.setup = function() {
    cSize = document.getElementById('fSketch').offsetWidth;
    p.createCanvas(cSize, cSize);
    p.textSize(cSize / 10);
    p.textAlign(p.CENTER, p.CENTER);

    osc = new p5.SinOsc(1);
    oscTop = new p5.SinOsc(1);

    // Instantiate the envelope
    envelope = new p5.Env();
    // set attackTime, decayTime, sustainRatio, releaseTime
    envelope.setADSR(.5, .5, 0, .7);
    // set attackLevel, releaseLevel
    envelope.setRange(1, 0);

     // Instantiate the envelope
    envelopeTop = new p5.Env();
    // set attackTime, decayTime, sustainRatio, releaseTime
    envelopeTop.setADSR(0, .5, 1, 0);
    // set attackLevel, releaseLevel
    envelopeTop.setRange(1, 0);

    osc.start();
    oscTop.start();

    fft = new p5.FFT();
    p.noStroke();
  }

  p.draw = function() {

    p.background('pink');
    p.fill(255);
    p.text('apr9', cSize / 2, cSize / 2);

    if (p.mouseIsPressed && (p.mouseX < document.getElementById('fSketch').offsetWidth)) {

      if (p.frameCount % 7 === 0 || p.frameCount === 1) {
        let midiValue = scaleArray[note];
        let freqValue = p.midiToFreq(midiValue);
        osc.freq(freqValue);

        envelope.play(osc, 0, 0.1);
        note = (note + 1) % scaleArray.length;
      }

      if (p.frameCount % 14 === 0 || p.frameCount === 1) {
        let midiValueTop = scaleArrayTop[noteTop];
        let freqValueTop = p.midiToFreq(midiValueTop);
        oscTop.freq(freqValueTop);

        envelopeTop.play(oscTop, 0, 0.1);
        noteTop = (noteTop + 1) % scaleArrayTop.length;
      }

      // plot FFT.analyze() frequency analysis on the canvas
      let spectrum = fft.analyze();
      for (let i = 0; i < spectrum.length / 20; i++) {
        p.fill(`rgba(${spectrum[i]}, ${spectrum[i]}, 100, .1)`);
        let x = p.map(i, 0, spectrum.length / 20, 0, p.width);
        let h = p.map(spectrum[i], 0, 255, 0, p.height / 2);

        p.rect(x, p.height / 2, spectrum.length / 100, h / 2);
        p.rect(x, p.height / 2, spectrum.length / 100, -h / 2);
      }

    }
  }
}

new p5(sketch0904, document.getElementById("fSketch"));
