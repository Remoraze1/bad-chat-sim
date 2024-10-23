$(document).ready(function(){
		
	//simple method to give random item from array
	var randomItem = function(array){return array[Math.floor(Math.random() * array.length)];};
	
	var username = "Stranger";
		
	var kid = {
		WPM: 80, // typing speed aka time it takes to type response
		status: "not connected",
		maxAttention: 45, // how long in seconds before kid gets bored and leaves
		curAttentionSpan: this.maxAttention, // start at max
		curUsername: "Kid",
		usernames: [
			"urweird",
			"CoolDude_123",
			"HeroGamer",
			"MegaMaster",
			"ur_mad_lol",
			"XtremePlayer_99",
			"EliteSniper_42",
			"ProGamer_5000",
			"im_him_ur-not",
		],
		greetings: [
			"Hey there!",
			"What's up?",
			"Hello!",
			"Hi!",
			"Hey!",
			"Yo!",
			"Howdy!",
		],
		insults: [
			"bet ur mums writing this",
			"bet ur 5",
			"You're SOOO funny!",
			"Nice try!",
			"I didn't ask",
			"u sure dummy",
			"Hey, check your grammar.",
			"idc",
			"ur in pre-school right",
			"U MAD ur mad, ur 100% mad ur mad, HABHAHABHAHAAHA HDBLIHI UR MAD LOLLL",
		],
		copypastas: [
			"( ͡° ͜ʖ ͡°)",
			"balls",
			"Why so serious?",
			"",
			"Did you just say something amazing?",
			"This is too funny to ignore!",
		],
		afkAlmostGone: [
			"...?",
			"Where did you go?",
			"Are you still there?",
			"Did I scare you away?",
			"Thinking hard, aren't you?",
			"If you don't reply soon, I'll assume you're taking a nap!",
		],
		afkGoodbyes: [
			"Okay, gotta run!",
			"See you later!",
			"Alright, don't take care!",
			"Heading out, cya loser",
			"Time to go, catch you later!",
			"Looks like you're busy at kindergarten, I'll go for now!",
			"Aight, I'm out.",
		],
		triggers: [ // specific keyword triggers
			[
				new RegExp(".*(?:i (?:(?:got(?:ta| to))|have to) go|i'?m .*leav(?:e|ing)|bye+|c(?:ea)?ce|gtg).*", 'gi'),
				[
					"Bye!",
					"Catch you later!",
					"See you soon!",
					"Goodbye!",
					"happy to see u leave",
					"i hope ur pillow is warm tonight",
				]
			],
			[
				new RegExp(".*(?:(?:user)?name)[^?]*", 'gi'),
				[
					"My username, ye its fits me right, unlike urs",
					"At least my username is unique!",
					"my name better than ur dumb name lol",
				]
			],
			[
				new RegExp('.*(?:old|age|young).*', 'gi'),
				[
					"yea, im 10, im olde than u so fvck off",
					"age is just a number",
					"ur prob 5",
				]
			],
			[
				new RegExp(".*(?:(?:yo)?u (?:are|r)|ur|you'?re)(?! not).*(?:dumb|stupid|idiot).*", 'gi'),
				[
					"look in the mirror dumbass",
					"no u",
					"bruh im in year 5 im smart lol",
					"",
				]
			],
		],
		reply: function(text){
			this.status = "typing";
			var kidName = this.curUsername;
			var kidWPM = this.WPM;
			var kidReply = "";
			var isCopyPasta = false;
			if(text !== undefined && text !== null && text !== ""){kidReply = text;}else{
				if($(".chatbox .messages-wrapper .you").length === 1){
					kidReply = randomItem(this.greetings);
				}else{
					var finalDecision = randomItem(this.insults);
					var lastUserMessage = $(".chatbox .message.you:last-child .text").text();
					var triggered = false;
					for(var i=0;i<this.triggers.length;i++){
						var curRegex = this.triggers[i][0];
						var randReply = randomItem(this.triggers[i][1]);
						if(lastUserMessage.match(curRegex)){
							console.log("TRIGGERED");
							triggered = true;
							finalDecision = randReply;
							break;
						}
					}
					if(Math.random() < 0.1 && !triggered){
						finalDecision = randomItem(this.copypastas);
						isCopyPasta = true;
					}
					kidReply = finalDecision;
				}
			}
			
			//function to simulate actual typing using WPM to estimate how long it'd take to type up a reply
			var sendReply = function(replyText, isPasta){
				setTimeout(function(){
					sendMsg(kidName, replyText);
					kid.status = "idle";
					$(".reply .typing").text("");
					console.log("done typing! took "+(replyText.length * (1000/((kidWPM * 6)/60)))+"ms to reply");
				}, isPasta?500:(replyText.length * (1000/((kidWPM * 6)/60))));
			};
			//function to delay response time (so kid doesnt start typing response instantly)
			setTimeout(function(){
				$(".reply .typing").text(kidName+" is typing...");
				console.log("typing");
				sendReply(kidReply, isCopyPasta);
			},(250+(Math.random()*5000)));
		},
	};
	
	//start attention span countdown
	var timerActive = false, almostAFK = false;
	var attentionTimer = function(){
		var timer = setInterval(function(){
			//console.log(kid.curAttentionSpan+" "+almostAFK);
			if(kid.curAttentionSpan > 0){
				if(kid.status === "idle"){kid.curAttentionSpan--;}
				if(!almostAFK && kid.curAttentionSpan <= kid.maxAttention - (kid.maxAttention / 2)){
					almostAFK = true;
					if(kid.status !== "typing"){kid.reply(randomItem(kid.afkAlmostGone));}
				}
			}else{
				if(kid.status !== "typing"){
					kid.reply(randomItem(kid.afkGoodbyes));
					kid.status = "disconnected";
					clearInterval(timer);
				}
			}
		}, 1000);
	};
	
	//function to add message to window, if who === username, it's your message, otherwise its the stranger
	var sendMsg = function(who, text){
		if(text === null || text === undefined || text === ""){return;}
		if($(".reply input.usermsg").attr("placeholder") != ""){
			$(".reply input.usermsg").attr("placeholder","");
		}
		var html = ''+
		'<div class="'+(who === username?"you":"them")+' message">'+
			'<div class="avatar"></div>'+
			'<div class="name">'+who+'</div>'+
			'<div class="text">'+text+'</div>'+
		'</div>';
		$(".chatbox .messages-wrapper").append($.parseHTML(html));
		$(".chatbox").scrollTop($(".chatbox .messages-wrapper").height());
		if(who === username){
			if(!timerActive){timerActive = true;attentionTimer();}
			kid.curAttentionSpan = kid.maxAttention;
			almostAFK = false;
			if(kid.status !== "typing"){kid.reply();}
			$(".reply input.usermsg").val("");
		}
	};
		
	//function to set initial username
	$(".setuser button").click(function(){
		var desiredName = $(".setuser .username").val();
		if(desiredName !== "" && desiredName !== null && desiredName !== undefined){
			username = desiredName;
			$(".setuser, .dim").fadeOut(100);
			setTimeout(function(){
				$(".messages-wrapper .status").text("Connected, say hello!");
				$(".reply input.usermsg").prop('disabled', false);
				kid.status = "idle";
				kid.curUsername = randomItem(kid.usernames);
			},(500+(Math.random()*1000)));
		}else{
			alert("Please enter a username.");
			$(".setuser input.username").focus();
		}
	});
	
	//send user's typed message when send button or enter key is pressed
	$(".reply input.usermsg").keydown(function(e){if(e.which === 13){sendMsg(username, $(this).val());}});
	$(".reply button.send").click(function(){sendMsg(username, $(".reply input.usermsg").val());$(".reply input.usermsg").focus();});
	
});
