const express = require('express')
const app = express();
var cors = require('cors')
var server = require('http').createServer(app);
var io = require('socket.io')(server);
app.use(cors())
var Database = {
  "DeviceConnected":0,
  "Devices":
  {
    "StudentMachine":[]
  }
}


io.on('connection', function(socket){
  Database.DeviceConnected+=1;
  socket.on('disconnect',(a)=>{
    DisconnectedUser(socket);
  });
  socket.on("RegisterMe",(data)=>{
     
    if(data.As == "StudentMachine") Database.Devices.StudentMachine.push({"id":socket.id,"alive":1});

  });
});

function DisconnectedUser(socket){
  Database.DeviceConnected-=1;
  var o = Database.Devices.StudentMachine;
  for(var i=0;i<o.length;i++){
    console.log(socket.id);
    if(socket.id == o[i].id) Database.Devices.StudentMachine[i].alive = 0;
  }
}


app.get('/api', (req, res) => {
  res.send(Database);
});
app.use(express.static('public'));

console.log('Listening on 8888');
server.listen(3000);



// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// });