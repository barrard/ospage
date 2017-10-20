var cmd=require('node-cmd');



 function get_command(command, res){
	console.log('The command is '+command)
	cmd.get(command, function(err, data, stderr){
		console.log('data')
            console.log(data)
            console.log('err? '+err)
            console.log('stderr? '+stderr)
            var resp = {}
            resp.output=data
            resp.err=err
            resp.stderr=stderr
            res.send(resp)
        })
}

function get_ip_address(res){
	var command = 'curl ipinfo.io/ip'
	var resp = {}
	cmd.get(command, function(err, data, stderr){
		// console.log(err)
		// console.log(data)
		// console.log(stderr)
		if(err){
			// console.log('err')
			// console.log(err)
			resp.err=err
			res.send(resp)
		}else if(data){
			// console.log('ip data')
			// console.log(data)
			resp.ip=data
			res.send(resp)

		}
	})

}

function get_daemon_sevice_list(res){
	var command = 'service --status-all'
	var resp = {}
	cmd.get(command, function(err, data, stderr){
		if(err){
			console.log('err')
			console.log(err)
			resp.err=err
			res.send(resp)
		}else if(data){
			console.log('ip data')
			console.log(data)
			resp.service_list=data
			res.send(resp)

		}
	})
}

module.exports = {
	get_command:get_command,
	get_ip_address:get_ip_address,
	get_daemon_sevice_list:get_daemon_sevice_list
}
