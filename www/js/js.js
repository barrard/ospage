console.log('hi')
window.onload = function(){init()}
function init(){
	console.log('INIT THIS BITCH')
	get_user_ip_address()
}

function handle_err(err){
	console.log('err handler called');
	console.log(err);
	var err_msg=''

	if(err.statusText){
		err_msg=err.statusText
	} 
	else if(err.err) {
		err_msg=err.err
	}else{
		err_msg=err
	}
	console.log(err_msg);
		$('#errorResponse').html(err_msg)
		setTimeout(function(){
			$('#errorResponse').html('')
		}, 2000)
}

function mainContentLoad(data){
	console.log(data)
	$('#mainContent').html(data.html)
}

function getMainContent(type){
	console.log(type+' page button clicked')
	$.ajax('/'+type,{
		success:mainContentLoad,
		error:handle_err
	})
}

function get_user_ip_address(){
	var ip_address = $('#user_ip_address')
	$.ajax('/get_user_ip_address',{
		success:function(data){
			ip_address.html(data.ip)
		},
		error:function(err){
			ip_address.html(err.err)
		}
	})
}

var $mainContent = $('#mainContent')


$('#getOSPage').on('click', function(){
	getMainContent('OS')
})


$('#getCryptoPage').on('click', () => getMainContent('crypto0'))
$('#getCommandsPage').on('click', () => getMainContent('commands'))

