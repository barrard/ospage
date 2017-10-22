window.onload = function(){init()}
function init(){
	console.log('INIT THIS BITCH')
	get_user_ip_address()
}

Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function red_or_green(core_MHz, core_id, MHz_min, MHz_max){
	var core_color = ~~core_MHz.map(MHz_min, MHz_max, 0, 510)

	if(core_color < 255){
		// console.log('This should be green-yellow')
		// console.log('core_color = '+core_color)
		$('#cpu_core_'+core_id).css('background', 'rgb('+core_color+',255 , 0)')
	}else{
		// console.log('This should be yellow-red')
		// console.log('core_color = '+core_color)
		core_color-=255

		$('#cpu_core_'+core_id).css('background', 'rgb(255 ,'+ (255-core_color) +', 0)')
		// console.log('this should be yellow'+ (255-core_color))
	}
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
var MHz_min, MHz_max;

function remove_cpu_inacitve_class(){
	Array.prototype.forEach.call($('.cpu_core_square'), function(i){
		$(i).removeClass('cpu_core_inactive')
	})
}

function add_cpu_inacitve_class(){
	Array.prototype.forEach.call($('.cpu_core_square'), function(i){
		$(i).addClass('cpu_core_inactive')
	})
}

$('#watch_cpu_btn').on('click', function(e){
	if(!active_cpu_watch){
		console.log('lets observe the CPU')
		remove_cpu_inacitve_class()

		clearInterval(timerInterval);

		timerInterval = setInterval(function(){
			get_cpu_frequency()
		}, 1000)
		$(this).removeClass('btn-info')
		$(this).addClass('btn-danger').html('Stop CPU watch')
		active_cpu_watch = true
	}else{
		console.log('lets stop watching the CPU')
		add_cpu_inacitve_class()

		clearInterval(timerInterval);
		$(this).removeClass('btn-danger')
		$(this).addClass('btn-info').html('watch CPU cores')
		active_cpu_watch = false
	}
})

//makes boxes for the cores

function make_cpu_squares(cores){
	for (var i = 0; i < cores+1; i++) {
		console.log('i');
		var core = document.createElement('div');
		core.id="cpu_core_"+i
		core.classList.add('cpu_core_square')
		core.classList.add('cpu_core_inactive')
		core.innerHTML=i+1
		if(i===cores){
			core.innerHTML='Avg.'
			core.id="cpu_core_avg"
		} 
		$('#cpu_cores_container').append(core);
	}
}


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
		if(line[0]==='CPU(s)'){
			console.log('cores is '+line[1])
			make_cpu_squares(parseInt(line[1]))
		}
		if(line[0]==='CPU max MHz'){
			MHz_max = line[1]
		}
		if(line[0]==='CPU min MHz'){
			MHz_min = line[1]
		}
		if(main_CPU_data_array.indexOf(line[0])!=-1){
			console.log(line[0])
			//append this data in the order its found is crazy but works
			//run the functiong to append to the table
			//tr id = "main_CPU_data"
			var head = line[0]
			var th = "<th>"+head+"</th>"
			$('#main_CPU_head').append(th)
			var data = line[1]
			//fix numers like 3500.0000
			if(!isNaN(data)) data = Math.floor(data)
			var td = "<td>"+data+"</td>"
			$('#main_CPU_data').append(td)
		}
	})
}
function handle_get_cpu_frequency_success(data){
	(function(){var cores_array = data.data.slice(0, -1)
	var core_avg=0;
	var core_count = 0
	console.log(cores_array)
	console.log(MHz_max)
	console.log(MHz_min)
	var core_id
	var core_MHz = 0
	cores_array.forEach((i, ind)=>{

		if(ind%2===0){
			//processor line, slip on :
			core_id = parseInt(i.split(':')[1])
			console.log('mod 2 === true')
			console.log(core_id)
		}else{
			core_count++
			//core MHz line
			core_MHz = parseInt(i.split(':')[1])
			console.log('core mhz is '+core_MHz)
			// console.log('THE STARTING CORE_COLOR IS '+core_color)
			red_or_green(core_MHz, core_id, MHz_min, MHz_max)

			core_avg+=core_MHz
		}

		console.log('cpu_core_'+core_id+' should be MHZ '+core_MHz)
		console.log('maps too '+~~core_MHz.map(MHz_min, MHz_max, 0, 510))



//  this needs to be incremented last
	})
	core_avg /=core_count
	//          ~~ === Math.floor()
	console.log(~~core_avg)
	red_or_green(~~core_avg,'avg', MHz_min, MHz_max)})(MHz_min, MHz_max)
}

function get_cpu_frequency(){
	$.ajax('/get_cpu_frequency',{
		success:handle_get_cpu_frequency_success,
		error:handle_err
	})

}
function CPU_grapic_make(){
	cpu_graphic_made = true
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

