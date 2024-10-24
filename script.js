$(document).ready(function(){
    var randomItem = function(array){return array[Math.floor(Math.random() * array.length)];};
    
    var username = "Stranger";
    
    var kid = {
        WPM: 80,
        status: "not connected",
        maxAttention: 45,
        curAttentionSpan: this.maxAttention,
        curUsername: "Kid",
        usernames: [
            "SuperC0D3r",
            "CoolDude_123",
            "HeroGamer",
            // add more usernames here
        ],
        greetings: [
            "Hey there!", "What's up?", "Hello!"
        ],
        insults: [
            "No way!", "You're funny!", "Nice try!"
        ],
        copypastas: [
            "( ͡° ͜ʖ ͡°)", "Why so serious? 😎"
        ],
        afkAlmostGone: [
            "...?", "Where did you go?"
        ],
        afkGoodbyes: [
            "Okay, gotta run!", "See you later!"
        ],
        triggers: [
            [new RegExp(".*(?:dumb).*", 'gi'), ["Why would you say that?", "That's rude!"]],
            // add more triggers here
        ],
        reply: function(){
            this.status = "typing";
            var lastUserMessage = $(".chatbox .message.you:last-child .text").text();
            var triggered = false;
            var finalDecision = randomItem(this.insults);

            for(var i=0; i<this.triggers.length; i++){
                var curRegex = this.triggers[i][0];
                var randReply = randomItem(this.triggers[i][1]);
                if(lastUserMessage.match(curRegex)){
                    finalDecision = randReply;
                    triggered = true;
                    break;
                }
            }

            setTimeout(function(){
                sendMsg(kid.curUsername, finalDecision);
                $(".reply .typing").text("");
                kid.status = "idle";
            }, (finalDecision.length * (1000 / ((kid.WPM * 6) / 60))));
        },
    };

    var sendMsg = function(who, text){
        if(text === "") return;
        var html = `<div class="${who === username ? "you" : "them"} message">
                        <div class="name">${who}</div>
                        <div class="text">${text}</div>
                    </div>`;
        $(".chatbox .messages-wrapper").append($.parseHTML(html));
        $(".chatbox").scrollTop($(".chatbox .messages-wrapper").height());

        if(who === username){
            kid.curAttentionSpan = kid.maxAttention;
            if(kid.status !== "typing"){ kid.reply(); }
            $(".reply input.usermsg").val("");
        }
    };

    $(".setuser button").click(function(){
        var desiredName = $(".setuser .username").val();
        if(desiredName !== ""){
            username = desiredName;
            $(".setuser, .dim").fadeOut(100);
            $(".reply input.usermsg").prop('disabled', false);
            kid.status = "idle";
            kid.curUsername = randomItem(kid.usernames);
        }else{
            alert("Please enter a username.");
        }
    });

    $(".reply input.usermsg").keydown(function(e){ if(e.which === 13){ sendMsg(username, $(this).val()); }});
    $(".reply button.send").click(function(){ sendMsg(username, $(".reply input.usermsg").val()); $(".reply input.usermsg").focus(); });
});

