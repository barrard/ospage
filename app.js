var express = require('express');
var os = require('os')
var bodyParser = require('body-parser');
var commands = require('./server_modules/commands')
var crypto = require('./server_modules/crypto')
var app = express();
app.engine('html', require('ejs').renderFile);
app.use(express.static('www'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.set('publicRoot', {root: __dirname + '/www/'})
app.set('views', __dirname+'/www/views/')

app.get('/', function(req, res){

	res.sendFile('index.html', app.get('publicRoot'), function (err) {
	    if (err) {
	    	console.log(err)
	    } else {
	      console.log('Sent:');
	    }
	  });

})

app.get('/crypto', function(req, res){
	res.render(app.get('views')+'crypto.html',function(err, html){
		if(err) {
			console.log(err)
			response.err=err	
		} 
		else{
			console.log('sent crypto to '+req.ip)
			// console.log(html)
			var response={
				html:html,
				ip:req.ip
			}
			res.send(response)
		}			
	})
})

app.get('/OS', function(req, res){
	res.render(app.get('views')+'OS.html',function(err, html){
		if(err){
			console.log(err)
			response.err=err	
		} 
		else{
			console.log('sent OS to '+req.ip)
			// console.log(html)
			var response={
				html:html,
				ip:req.ip
			}
			res.send(response)
		}			
	})
})

app.get('/commands', function(req, res){
	res.render(app.get('views')+'commands.html',function(err, html){
		if(err){
			console.log(err)
			response.err=err	
		} 
		else{
			console.log('sent commands to '+req.ip)
			// console.log(html)
			var response={
				html:html,
				ip:req.ip
			}
			res.send(response)
		}			
	})
})


app.post('/run_command', function(req, res){
	console.log(req.params)
	console.log(req.query)
	console.log(req.body)
	console.log('run a command')
	//send to module commands.js
	commands.get_command(req.body.cmd, res)
})

app.post('/cryptoEnc', function(req, res){
	crypto.encrypt(req.body, res)
})
app.post('/cryptoDec', function(req, res){
	crypto.decrypt(req.body, res)
})
app.post('/cryptoHash', function(req, res){
	crypto.hash(req.body, res)
})
app.get('/get_user_ip_address', function(req, res){
	commands.get_ip_address(res)
})
app.get('/get_daemon_sevice_list', function(req, res){
	commands.get_daemon_sevice_list(res)
})






var port = 8080
app.listen(port)
console.log('listening on port '+port)

console.log('EOL is '+os.EOL)
console.log('arch is '+os.arch)
console.log('username '+process.env.USER)
console.log('desktop  '+process.env.XDG_SESSION_DESKTOP)