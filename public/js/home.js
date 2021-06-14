

$(function(){

});

function activate(){
    $('#mylbl').css({
        'top': '-20px',
        'font-size': '8px',
        'color': 'blue'
    });
    $('#sentence').focus();
}
function goback(){
    if ($('#sentence').val().length == 0){
        $('#mylbl').css({
            'top': '5px',
            'font-size': '14px',
            'color': 'black'
        });
    }
}

function checktext(){
    if ($('#sentence').val().length > 1){
        $('#recordme').removeAttr('disabled');
    }
    else{
        $('#recordme').attr('disabled', 'disabled');
    }
}

function startRecording() {
    if (recording == false) {
        recording = true;
        $('#recordme').val('Stop');
        $('#playme').attr('disabled', 'disabled');
        $('#wave-indicator').html('');
        left = 0;
        Mic = new Microphone();
        mycontext = new AudioContext();
        Mic.startMic(mycontext);
        /*
        soundIndicatorInterval = window.setInterval(() => {
            if(recording == true){
                $('#sound-indicator').css({
                    width: Mic.getVol() + 50 + 'px',
                    height: Mic.getVol() + 50 + 'px'
                })
            }
            
        }, 100);
        */
        waveInterval = window.setInterval(() => {
            if (recording == true && Mic.getVol() > 0) {
                var newbar = $('<span class="indic">');
                newbar.css({
                    height: Mic.getVol() + 'px',
                    left: left + 'px'
                });
                $('#wave-indicator').append(newbar);
                $('#wave-indicator').scrollLeft($('#wave-indicator')[0].scrollWidth);
                left = left + 3;
            }
        }, 200);

    }
    else {
        recording = false;
        $('#recordme').val('Record');
        mediaRecorder.stop();
        $('#playme').removeAttr('disabled');
        nextStage();
    }

}

function playaudio(){
    if ($('#myplayer')[0].paused){
        $('#playme').val('pause');
        $('#myplayer')[0].play();
        $('#recordme').attr('disabled', 'disabled');
    }
    else{
        $('#playme').val('play');
        $('#myplayer')[0].pause();
        $('#recordme').removeAttr('disabled');
    }
}

function playingended(){
    $('#playme').val('play');
    $('#recordme').removeAttr('disabled');
}

function showBars(control){
    $('#wave-indicator span').css('border-color', '#007FFF');
    var myTime = control.currentTime;
    myTime = myTime * 1000;
    var bar = Math.floor(myTime/200);
    bar++;
    $('#wave-indicator span').slice(0, bar).css('border-color', '#ffffff');
}


function nextStage(){
    console.log(blobToSend);
        var base64;
        var reader = new window.FileReader();
        reader.readAsDataURL(blobToSend); 
        reader.onloadend = function() {
            base64 = reader.result;
            base64 = base64.split(',')[1];
            var obj = {'wave': base64, 'text':$('#sentence').val()};
            obj = JSON.stringify(obj);            
            $('#screen').fadeIn().css('display', 'flex');
            $.ajax({
                beforeSend: function(xhr) { 
                    xhr.setRequestHeader("Authorization", "Basic " + btoa("username:password")); 
                  },
                url:'http://10.90.22.242:8080/mpdget_mpd_result',
                type: 'POST',
                dataType: 'JSON',
                contentType: 'application/json',
                processData: false,
                data: obj,
                success: function(data){
                    console.log(data);
                }
            })

        }
    }