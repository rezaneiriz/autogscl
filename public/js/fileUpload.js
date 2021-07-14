










var dictionary = {
    'aa': '&#593;',
    'ae': '&aelig;',
    'ah': '&#601;',
    'ao': '&#596;',
    'aw': 'a&#650;',
    'ay': 'a&#618;',
    'b': 'b',
    'ch': 't&#643;',
    'd': 'd',
    'dh': '&eth;',
    'eh': '&epsilon;',
    'er': '&#604;r',
    'ey': 'e&#618;',
    'f': 'f',
    'g': 'g',
    'hh': 'h',
    'ih': '&#618;',
    'iy': 'i:',
    'jh': 'd&#658;',
    'k': 'k',
    'l': 'l',
    'm': 'm',
    'n': 'n',
    'ng': '&#331;',
    'ow': 'o&#650',
    'oy': 'o&#618;',
    'p': 'p',
    'r': 'r',
    's': 's',
    'sh': '&#643;',
    't': 't',
    'th': '&#629;',
    'uh':'&#650;',
    'uw': 'u',
    'v': 'v',
    'w': 'w',
    'z': 'z',
    'zh': '&#658;',
    'y': 'j'
};
var examples = {
    'iy' : ['h#e&', 'w#ee&k', 'th#e&se'],
    'ih' : ['h#i&d', 'h#i&s', 'l#i&ve'],
    'uh' : ['h#oo&k', 'b#oo&k', 'f#u&ll'],
    'u' : ['wh#o&', 'f#oo&d', 'ch#oo&se'],
    'eh' : ['h#ea&d', 'p#e&t', 'dr#e&ss'],
    'ae' : ['h#a&d', 'm#a&n', 'gr#a&ss'],
    'ao' : ['h#o&rse', 'c#ou&rt', 'imp#o&rtant'],
    'ah' : ['c#u&t', 's#o&me', 'm#u&ch'],
    'aa' : ['p#o&t', 'w#a&lk', 'cl#o&ck'],
    'oy' : ['b#oy&', 't#oy&', 'n#oi&se'],
    'ey' : ['h#ay&', 'm#a&ke', 'g#a&me'],
    'ay' : ['h#i&de', 'r#i&de', 'gu#i&de'],
    'ow' : ['g#o&', 'sp#o&ke', 'th#o&se'],
    'au' : ['n#ow&', 'c#ow&', 'h#ou&se'],
    'er' : ['h#er&', 'b#ir&d', 'th#ir&d'],
    'p' : ['#p&ut', 'ha#pp&y', 'dro#p&'],
    'b' : ['#b&ook', 'ta#b&le', 'jo#b&'],
    't' : ['#t&ake', 'la#t&er', 'pu#t&'],
    'd' : ['#d&own', 'bo#d&y', 'woo#d&'],
    'k' : ['#c&ar', 'lo#c&al', 'bla#ck&'],
    'g' : ['#g&ood', 'be#g&an', 'ba#g&'],
    'f' : ['#f&ace', 'o#ff&ice', 'wi#f&e'],
    'v' : ['#v&an', 'e#v&er', 'lo#v&e'],
    'th' : ['#th&ank', 'no#th&ing', 'wi#th&'],
    'dh' : ['#th&e', '#th&is', 'mo#th&er'],
    's' : ['#s&ide', 'de#c&ide', 'fa#c&e'],
    'z' : ['#z&oo', 'vi#s&it', 'hi#s&'],
    'hh' : ['#h&igh', '#h&ome', 'be#h&ind'],
    'm' : ['#m&ake', 're#m&ove', 'so#m&e'],
    'n' : ['#n&eed', 'fi#n&al', 'ma#n&'],
    'ng' : ['fi#n&ger', 'hu#n&g', 'wro#n&g'],
    'sh' : ['#sh&ow', 'na#ti&on', 'wi#sh&'],
    'zh' : ['plea#s&ure', 'trea#s&ure', 'enclo#s&ure'],
    'ch' : ['#ch&oose', 'tea#ch&er', 'su#ch&'],
    'jh' : ['#j&et', 'en#j&oy', 'bri#dg&e'],
    'w' : ['#w&ind', '#w&eek', 'a#w&ay'],
    'y' : ['#y&our', '#y&oung', 'be#y&ond'],
    'l' : ['#l&oud', 'fo#ll&ow', 'ca#ll&'],
    'r' : ['#r&oom', 'a#r&ound', 'fo#r&']
};




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
    $('#fileUploader')[0].click();
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
    if ($('#fileUploader')[0].files[0] != null){
        $('#example-pronunciation').hide();
        var base64;
        var reader = new window.FileReader();
        reader.readAsBinaryString($('#fileUploader')[0].files[0]); 
        reader.onloadend = function() {
            console.log(reader.result);
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

                        var word = $('<td class="fb" onclick="readThis(this)"/>');
                        $(word).html('<span class="wordbody clickable1">' + feedback[i].word + '</span>').addClass('nowrap');
                        $('#word').append($(word));

                        
                        var cmumpd = $('<td class="fb border"/>');                        
                        var fbtable = $('<table />');
                        var cmuRow = $('<tr />');
                        var mpdRow = $('<tr />');
                        for (var j = 0; j< feedback[i].cmu_phns.length; j++){
                            var cmu = feedback[i].cmu_phns[j];
                            var mpd = feedback[i].mpd_phns[j];
                            if (cmu == 'sil'){
                                var cmuFb = $('<td />');
                                $(cmuFb).html('');
                                var mpdFb = $('<td onclick="showSample(\'' + mpd + '\')"/>');
                                $(mpdFb).html(dictionary[mpd]).addClass('extra clickable');
                            }
                            else if(mpd == 'sil'){
                                var cmuFb = $('<td onclick="showSample(\'' + cmu + '\')"/>').addClass('missing clickable');
                                $(cmuFb).html(dictionary[cmu]);
                                var mpdFb = $('<td />');
                                $(mpdFb).html('');
                            }
                            else if (cmu != mpd){
                                var cmuFb = $('<td onclick="showSample(\'' + cmu + '\')"/>');
                                $(cmuFb).html(dictionary[cmu]).addClass('clickable');
                                var mpdFb = $('<td onclick="showSample(\'' + mpd + '\')"/>');
                                $(mpdFb).html(dictionary[mpd]).addClass('wrong clickable');
                            }
                            else{
                                var cmuFb = $('<td onclick="showSample(\'' + cmu + '\')"/>');
                                $(cmuFb).html(dictionary[cmu]).addClass('clickable');
                                var mpdFb = $('<td onclick="showSample(\'' + mpd + '\')"/>');
                                $(mpdFb).html(dictionary[mpd]).addClass('clickable');
                            }

                            $(cmuFb).addClass('space');
                            $(mpdFb).addClass('space');
                            $(cmuRow).append($(cmuFb));
                            $(mpdRow).append($(mpdFb));
                        }
                        $(fbtable).append($(cmuRow));
                        $(fbtable).append($(mpdRow));
                        $(cmumpd).append($(fbtable));
                        $('#cmu-mpd').append($(cmumpd));
                        
                        $('#screen').fadeOut();
                        $('#btnEvaluate').attr('disabled', 'disabled');
                    }
                                 
                },
                error: function(){
                    $('#screen').fadeOut();
                    alert('An error occured! Please try a different sentence/phrase.');
                }
            })

        }
    }
        
}

function readThis(text){
    var speech = new SpeechSynthesisUtterance();
    speech.lang = 'en';
    speech.rate = 0.8;
    speech.text = $(text).find('.wordbody').eq(0).html();
    window.speechSynthesis.speak(speech);
}

function showSample(arpabet){
    exm = examples[arpabet];
    var word;
    var wordInner;
    $('#examps').html('');
    exm.forEach((item, index)=>{
        word = $('<li data-word="' + item.replace(/[#&]/g, '') + '" onclick="readThis2(this)"/>');
        wordInner = $('<span class="clickable2" />');
        $(wordInner).html(item.replace('#', '<span class="emph">').replace('&', '</span>'));
        $(word).append($(wordInner));
        $('#examps').append($(word));
    });
    $('#example-pronunciation').fadeIn();
}

function readThis2(text){
    var speech = new SpeechSynthesisUtterance();
    speech.lang = 'en';
    speech.rate = 0.8;
    speech.text = $(text).data('word');
    window.speechSynthesis.speak(speech);
}