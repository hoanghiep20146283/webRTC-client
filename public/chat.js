	socket = io("http://localhost:8090");
			console.log("connected!");
			$(document).ready(function(){
				$("#loginForm").show();
				$("#chatForm").hide();
				$("#btn_register").click(function(){
					socket.emit("register",$("#username").val());
				});
				socket.on("register_failure",function(){
					alert("This username has already registered !!");
				});
				socket.on("register_success",function(data){
					$("#loginForm").hide(500);
					$("#chatForm").show(1500);
					$("#current_user").html(data);
					alert("Register successfull !!");
				});
				socket.on("list_online",function(data){
					console.log(data);
					$("#content_online").html("");
					data.registered.forEach(function(i){
						$("#content_online").append("<div class=\"user_online\" id=\""+i+"users_online"+"\">"+i+"</div>");					
					});
				});
				$("#btn_logout").click(function(){
					socket.emit("logout");
					$("#loginForm").show(1500);
					$("#chatForm").hide(1000);
				});
				$("#btn_send_message").click(function(){
					socket.emit("send_message",$("#type_message").val());
					$("#type_message").val("");
				});
				socket.on("server_send_message",function(data){
					console.log("server_send_message"+data.message);
					$("#list_message").append("<div class=\"message\">"+data.username+":"+data.message+"</div>");
				});
			});