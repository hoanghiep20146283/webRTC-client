//const socket = io("http://localhost:8001");
const socket = io("https://hoanghiep-webrtc.herokuapp.com/");
$("#chat").hide();
$("#sign_up").show();
function openStream(){
	const config = {audio:false, video:true}
	return navigator.mediaDevices.getUserMedia(config);
}
function playStream(idVideoTag,stream){
	const video = document.getElementById(idVideoTag);	
	video.srcObject = stream;
	video.play();
}

function uniqId() {
  return Math.round(new Date().getTime() + (Math.random() * 100));
}
//const peer = new Peer({key:'abc'});
    var peer = new Peer();
peer.on('open', id => {
	$("#my-peer").append(id);
	$("#btn_sign").click(function(){
	const username = $("#username").val();
	socket.emit("sign",{username:username,key:id});
});
});
$("#btn_call").click(function(){
	const id = $("#remoteid").val();
	openStream().then(stream => {
		playStream('localstream',stream);
		const call = peer.call(id,stream);
		call.on('stream', remotestream => playStream('remotestream', remotestream));
		console.log('called!');
	});
});
peer.on('call',function(call){
	openStream()
	.then( stream => {
		call.answer(stream);
		playStream('localstream',stream);
		call.on('stream', remotestream => {
			playStream('remotestream',remotestream);
			console.log("answered!");
			});
		console.log("answered2!");
	});
});
socket.on('list_user',function(data){
	$("#sign_up").hide(1000);
	$("#chat").show(1500);
	data.forEach(function(item){
		$("#list_user").append("<li id=\""+item.id+"\" key=\""+item.key+"\">"+item.username+"</li>");
	});
	socket.on('new_user',function(data){
		
		{
			alert(socket.id);
			alert(data.id);
			$("#list_user").append("<li id=\""+data.data.id+"\" key=\""+data.data.key+"\">"+data.data.username+"</li>");
		}
		alert("new user");
	});
	socket.on('disconnect',function(id){
		document.getElementById(id).remove();
		alert(id);
	});
});

socket.on('sign_failure',function(){
	alert("Please choose another username!!");
	$("#username").val("");
});
$("#list_user").on('click','li',function(){
	const id_remote = $(this).attr('key');
	alert(id_remote);
	openStream().then(stream => {
		playStream('localstream',stream);
		const call = peer.call(id_remote,stream);
		call.on('stream', remotestream => playStream('remotestream', remotestream));
		console.log('called!');
	});
});