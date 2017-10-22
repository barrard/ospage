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
	}else if(err.cmd){
		err_msg=err.cmd+': bad command'
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

// CPU graphic logic code functions ===================================
var active_cpu_watch = false
var cpu_graphic_made = false
var timerInterval

$('#watch_cpu_btn').on('click', function(e){
	if(!active_cpu_watch){
		console.log('lets observe the CPU')

		clearInterval(timerInterval);

		timerInterval = setInterval(function(){
			get_cpu_frequency()
		}, 1000)
		$(this).removeClass('btn-info')
		$(this).addClass('btn-danger').html('Stop CPU watch')
		active_cpu_watch = true
	}else{
		console.log('lets stop watching the CPU')

		clearInterval(timerInterval);
		$(this).removeClass('btn-danger')
		$(this).addClass('btn-info').html('CPU watch')
		active_cpu_watch = false
	}
})
function handle_get_cpu_data_success(data){
	var main_CPU_data_array = [
		'Architecture',
		'Model name',
		'CPU max MHz',
		'CPU min MHz',
		'L1d cache',
		'L1i cache',
		'L1 cache',
		'L2 cache',
		'L3 cache',
		'L4 cache'

	]
	// console.log(data)
	//this gives about 26 lines
	//Architecture, CPU(s), "Model name", CPU min MHz, CPU max MHz
	data.data.forEach((i)=>{
		// console.log(i.split(':'))
		var line = i.split(':')
		if(main_CPU_data_array.indexOf(line[0])!=-1){
			console.log(line[0])
			//append this data in the order its found is crazy but works
			//run the functiong to append to the table
			//tr id = "main_CPU_data"
			var data = line[1]
			var td = "<td>"+data+"</td>"
			$('#main_CPU_data').append(td)
		}
	})
}
function handle_get_cpu_frequency_success(data){
	console.log(data)
}
function get_cpu_frequency(){
	$.ajax('/get_cpu_frequency',{
		success:handle_get_cpu_frequency_success,
		error:handle_err
	})

}
function CPU_grapic_make(){
	// make a call to the system to get CPU data
	$.ajax('/get_cpu_data',{
		success:handle_get_cpu_data_success,
		error:handle_err
	})
}
if(!cpu_graphic_made){
	CPU_grapic_make()	
}

//end CPU graphic code logic=============================================

var $mainContent = $('#mainContent')


$('#getOSPage').on('click', function(){
	getMainContent('OS')
})


$('#getCryptoPage').on('click', () => getMainContent('crypto'))
$('#getCommandsPage').on('click', () => getMainContent('commands'))

