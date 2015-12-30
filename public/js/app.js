var socket = io();

socket.on('connect', function (){
	console.log('front end connected to server');
})

socket.on('message', function (message){
	$('#msg-monitor').append('<p>'+message.time+ ': ' +message.text+'<p>');
})

$('#msg-form').on('submit', function (event){
	event.preventDefault();

	$msg = $('#msg-form').find('input[name=message]');

	socket.emit('message', {
		text: $msg.val()
	});

	$msg.val('');
});


