var watch = require('node-watch');


module.exports = function(socket, publicRoot){
  console.log(publicRoot.root)
  watch('/home/sailor/express_os_sec/www/', { recursive: true }, function(event_type, filename){
    console.log(event_type)
    socket.emit('auto_reload');
    
  })
  // console.log(watch)
}