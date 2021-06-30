

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
        $('#wave-line').css('background-color', '#990000');
        recording = true;
        $('#recordme').val('Stop');
        $('#playme').attr('disabled', 'disabled');
        $('#wave-indicator').html('');
        left = 0;
        beginRecording();
        //Mic = new Microphone();
        //mycontext = new AudioContext();
        //Mic.startMic(mycontext);
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
            if (recording == true && volume > 0) {
                var newbar = $('<span class="indic">');
                newbar.css({
                    height: volume + 'px',
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
        //mediaRecorder.stop();
        endRecording();
        $('#playme').removeAttr('disabled');
        window.clearInterval(waveInterval);
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
    $('#wave-indicator span').css('border-color', '#990000');
    $('#wave-line').css('background-color', '#007fff');
    var myTime = control.currentTime;
    myTime = myTime * 1000;
    var bar = Math.floor(myTime/200);
    bar++;
    $('#wave-indicator span').slice(0, bar).css('border-color', '#007FFF');
}


function nextStage(){
    if (blob != null){
        var base64;
        var reader = new window.FileReader();
        reader.readAsDataURL(blob); 
        reader.onloadend = function() {
            base64 = reader.result;
            base64 = base64.split(',')[1];
            var obj = {'wave': base64, 'text':$('#sentence').val()};
            obj = JSON.stringify(obj);            
            $('#screen').fadeIn().css('display', 'flex');
            $.ajax({
                url:'/sendthis',
                type: 'POST',
                dataType: 'JSON',
                contentType: 'application/json',
                data: obj,
                success: function(data){
                    $('.fb').remove();
                    var feedback = JSON.parse(data.feedback);
                    console.log(feedback);
                    for (var i = 0; i < Object.keys(feedback).length;i++){
                        var word = $('<td class="fb"/>');
                        $(word).html(feedback[i].word);
                        var cmu = $('<td class="fb"/>');
                        for (var j = 0; j < feedback[i].cmu_phns.length; j++){
                            var phone = $('<span/>');
                            if (feedback[i].mpd_phns[j] == 'sil'){
                                $(phone).html(feedback[i].cmu_phns[j]).addClass('wrong');
                            }
                            else if (feedback[i].cmu_phns[j] == 'sil'){
                                $(phone).html('&nbsp;&nbsp;');
                            }
                            else{
                                $(phone).html(feedback[i].cmu_phns[j]);
                            }
                            $(cmu).append($(phone));
                        }
                        var mpd = $('<td class="fb"/>');
                        for (var j = 0; j < feedback[i].mpd_phns.length; j++){
                            var phone = $('<span/>');
                            if (feedback[i].cmu_phns[j] == 'sil'){
                                $(phone).html(feedback[i].cmu_phns[j]).addClass('wrong');
                            }
                            else if (feedback[i].mpd_phns[j] == 'sil'){
                                $(phone).html('&nbsp;&nbsp;');
                            }
                            else{
                                $(phone).html(feedback[i].mpd_phns[j]);
                            }
                            $(mpd).append($(phone));
                        }
                        $('#word').append($(word));
                        $('#cmu').append($(cmu));
                        $('#mpd').append($(mpd));
                        $('#screen').fadeOut();
                    }
                                 
                }
            })

        }
    }
        
}