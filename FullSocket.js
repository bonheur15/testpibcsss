const express = require('express')
const app = express();
var cors = require('cors');
const { Hash } = require('crypto');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var crypto = require('crypto');
app.use(cors());
const PORT = process.env.PORT || 5000;
var AdminSocket="";

var Database = {
    "DeviceConnected":0,
    "Devices":
    {
      "StudentMachine":[]
    }
  }

io.on('connection', function(socket){
    ConnectedUser(socket);
socket.on('disconnect',(a)=>{
    DisconnectedUser(socket);
    });
    socket.on("reg",(a)=>{
        NewMachineId=DoHash(Date.now().toString());
        io.to(socket.id).emit("reg",{"Mid":NewMachineId});
        Database.Devices.StudentMachine.push({"Mid":NewMachineId,"alive":1,"socketid":socket.id});
        console.log(Database.Devices.StudentMachine[0]);
    });
    socket.on("alive",(data)=>{
        for(var i = 0; i<Database.Devices.StudentMachine.length;i++){
            if(data.Mid == Database.Devices.StudentMachine[i].Mid){
                Database.Devices.StudentMachine[i].alive=true;
                Database.Devices.StudentMachine[i].socketid = socket.id;
            }
        }
        io.to(AdminSocket).emit("database",Database);
    });
    socket.on("api",()=>{
        AdminSocket = socket.id;
        io.to(socket.id).emit("database",Database);
    });
});
function DoHash(a){
   return crypto.createHash('md5').update(a).digest("hex");
}
function ConnectedUser(socket){
    console.log("New User");
    io.to(AdminSocket).emit("database",Database);

}
function DisconnectedUser(socket){
    for(var i = 0; i<Database.Devices.StudentMachine.length;i++){
        if(socket.id == Database.Devices.StudentMachine[i].socketid) Database.Devices.StudentMachine[i].alive=false;
    }
    io.to(AdminSocket).emit("database",Database);
}

console.log('Listening on 3000');
app.get('/api', (req, res) => {
    res.send(Database);
});
app.use(express.static('public'));
server.listen(PORT);
