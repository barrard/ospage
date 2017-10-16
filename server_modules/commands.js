var cmd=require('node-cmd');



module.exports = function(command, res){
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
