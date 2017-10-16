function handlerAjaxErr(err){
	console.log('err');
	console.log(err.statusText);
	console.log(err.status);
	(function(){
		$('#errorResponse').html(err.statusText)
		setTimeout(function(){
			$('#errorResponse').html('')
		}, 2000)
	})();
}

function mainContentLoad(data){
	console.log(data)
	$('#mainContent').html(data.html)
}

function getMainContent(type){
	console.log(type+' page button clicked')
	$.ajax('/'+type,{
		success:mainContentLoad,
		error:handlerAjaxErr
	})
}

var $mainContent = $('#mainContent')


$('#getOSPage').on('click', function(){
	getMainContent('OS')
})


$('#getCryptoPage').on('click', () => getMainContent('crypto'))
$('#getCommandsPage').on('click', () => getMainContent('commands'))

