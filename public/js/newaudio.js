let recBuffers = [[], []];
let recLength = 0;
let numChannels = 2;
let listening = false;
let timeout = null;
let constraints = {
    audio: true
};
var blob = null;
var volume;
let context;
let failedToGetUserMedia = false;
var FFT_SIZE = 2048;
var peak_volume = 0;


if (navigator.getUserMedia) {
    navigator.getUserMedia(constraints, (stream) => {
        init(stream);
    }, (err) => {
        alert('Unable to access audio.\n\n' + err);
        console.log('The following error occurred: ' + err);
        failedToGetUserMedia = true;
    });
}
else if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        init(stream);
    }).catch((err) => {
        alert('Unable to access audio.\n\n' + err);
        console.log('The following error occurred: ' + err);
        failedToGetUserMedia = true;
    });
}
else failedToGetUserMedia = true;

function beginRecording() {
    recBuffers = [[], []];
    recLength = 0;
    listening = true;
}

function endRecording() {

    exportWAV();
}

function init(stream) {
    let audioContext = new AudioContext();
    let source = audioContext.createMediaStreamSource(stream);
    context = source.context;
    let node = (context.createScriptProcessor || context.createJavaScriptNode).call(context, 4096, numChannels, numChannels);

    var analyser = context.createAnalyser();

    source = context.createMediaStreamSource(stream);
    source.connect(analyser);
    
    analyser.smoothingTimeConstant = 0.2;
    analyser.fftSize = FFT_SIZE;
    node.onaudioprocess = (e) => {
        if (!listening) return;
        var spectrum = new Uint8Array(1024);
        analyser.getByteFrequencyData(spectrum);
        var rms = 0;
        for (var i = 0; i < spectrum.length; i++) {
            rms += spectrum[i] * spectrum[i];
        }
        rms /= spectrum.length;
        rms = Math.sqrt(rms);
        if (rms > peak_volume) peak_volume = rms;
        volume = rms;
        for (var i = 0; i < numChannels; i++) {
            recBuffers[i].push([...e.inputBuffer.getChannelData(i)]);
        }

        recLength += recBuffers[0][0].length;
    }
    source.connect(node);
    node.connect(context.destination);
}

function mergeBuffers(buffers, len) {
    let result = new Float32Array(len);
    let offset = 0;
    for (var i = 0; i < buffers.length; i++) {
        result.set(buffers[i], offset);
        offset += buffers[i].length;
    }
    return result;
}

function interleave(inputL, inputR) {
    let len = inputL.length + inputR.length;
    let result = new Float32Array(len);

    let index = 0;
    let inputIndex = 0;

    while (index < len) {
        result[index++] = inputL[inputIndex];
        result[index++] = inputR[inputIndex];
        inputIndex++;
    }

    return result;
}

function exportWAV() {
    let buffers = [];
    for (var i = 0; i < numChannels; i++) {
        buffers.push(mergeBuffers(recBuffers[i], recLength));
    }

    let interleaved = numChannels == 2 ? interleave(buffers[0], buffers[1]) : buffers[0];
    let dataView = encodeWAV(interleaved);
    blob = new Blob([ dataView ], { type: 'audio/wav' });
    blob.name = Math.floor((new Date()).getTime() / 1000) + '.wav';
    const audioUrl = URL.createObjectURL(blob);
    $('#myplayer').attr('src', audioUrl);
    listening = false;
    $('#btnEvaluate').removeAttr('disabled');
}

function floatTo16BitPCM(output, offset, input){
    for (var i = 0; i < input.length; i++, offset+=2){
        var s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
}

function writeString(view, offset, string){
    for (var i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

function encodeWAV(samples){
    var buffer = new ArrayBuffer(44 + samples.length * 2);
    var view = new DataView(buffer);

    /* RIFF identifier */
    writeString(view, 0, 'RIFF');
    /* file length */
    view.setUint32(4, 36 + samples.length * 2, true);
    /* RIFF type */
    writeString(view, 8, 'WAVE');
    /* format chunk identifier */
    writeString(view, 12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, 1, true);
    /* channel count */
    view.setUint16(22, numChannels, true);
    /* sample rate */
    view.setUint32(24, context.sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, context.sampleRate * 4, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, numChannels * 2, true);
    /* bits per sample */
    view.setUint16(34, 16, true);
    /* data chunk identifier */
    writeString(view, 36, 'data');
    /* data chunk length */
    view.setUint32(40, samples.length * 2, true);

    floatTo16BitPCM(view, 44, samples);

    return view;
}