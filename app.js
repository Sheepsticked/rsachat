const createError = require('http-errors');
const express = require('express');
const db = require("./db");
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const initDb = require("./utils/insert");
const { exec, spawn } = require('child_process');


const http = require('http');
const server = http.createServer(app);

const Server = require("socket.io");

const io = Server(server);

app.set('port', '5000');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname,'rsaclient','build')));

app.get("/", function(req,res){
  res.sendFile(path.join(__dirname,'rsaclient','build','index.html'));
});
  
app.get("*", function(req,res){
  res.redirect("/");
});


initDb().then(function (){
  db.defaults({users: []}).write();
  db.get("users").remove().write();
})



io.on("connection",(socket) =>{
  console.log(socket.id);
  socket.on("requestAccepted",(state, tarSocket)=>{
    if(state === true){
      socket.emit("request",db.get("users").find({socketId: tarSocket}).value());
      io.to(tarSocket).emit("request", db.get("users").find({socketId: socket.id}).value());
      db.get("users").find({socketId: socket.id}).assign({connected: true}).write();
      db.get("users").find({socketId: tarSocket}).assign({connected: true}).write();
      setInterval(()=>{
        if(db.get("users").find({socketId: socket.id}).value() === undefined || db.get("users").find({socketId: tarSocket}).value() === undefined){
        io.to(tarSocket).emit("end");
        socket.emit("end");
        clearInterval();
        }
      },1000);
    }
    else{
      io.to(tarSocket).emit("requestDeclined",db.get("users").find({socketId: socket.id}).value().username);
    }
  });
  socket.on("req",(data)=>{
    switch (data.type){
      //gen keys
      case 1:
        let arr;
        exec(`./keys ${data.mes.p} ${data.mes.q}`, (error, stdout, stderr)=>{
          stdout = stdout + "";
          arr = stdout.split(/\s+/);
          db.get("users").find({socketId: socket.id}).assign({publickey: {e: arr[0], n: arr[2]}}).write();
          data.mes = {}
          data.mes = {
            e: arr[0],
            d: arr[1],
            n: arr[2],
          }
          socket.emit("res",data);
          data.type = 10;
          data.mes = {
            open: true,
            publickey: db.get("users").find({socketId: socket.id}).value().publickey,
          };
          io.to(data.socketId).emit("res",data);
        });
        
        break;
      //encrypt
      case 2:
        let i=0;
        let tmp = [];
        while(i<data.mes.message.length){
          tmp.push(data.mes.message.charCodeAt(i).toString());
          i = i+1;
        }
        tmp.unshift(db.get("users").find({socketId: data.socketId}).value().publickey.e,db.get("users").find({socketId: data.socketId}).value().publickey.n)
        const encrypt = spawn("./encrypt", tmp);
        encrypt.stdout.on("data",(d)=>{
          d = d + "";
          let arr = d.split(/\s+/);
          arr.pop();
          data.mes = {};
          data.mes = {
            encmessage: arr,
            logs: "send",
          }
          socket.emit("res",data);
          data.mes.logs = "rec";
          io.to(data.socketId).emit("res", data);
        });
        break;
      case 3:
        let tmas;
        tmas = data.mes.arr;
        tmas.unshift(data.mes.d,data.mes.n);
        const decrypt = spawn("./decrypt", tmas);
        decrypt.stdout.on("data",(d)=>{
          d = d + "";
          let arr = d.split(/\s+/);
          data.type = 3;
          data.mes = {
            message: arr,
          }
          socket.emit("res", data);
        });
        break;
      case 10:
        io.to(data.socketId).emit("res", data);
        break;
      default:
        break;  
    }
  });
  socket.on("endSession", (targSocket)=>{
    io.to(targSocket).emit("end");
    socket.emit("end");
  });
  socket.on("startSession",(targetSocketId)=>{
    io.to(targetSocketId).emit("receiveRequest",db.get("users").find({socketId: socket.id}).value());
  });
  socket.on("user",(username,socketId, connected)=> {
    db.get("users").push({username: username,socketId: socketId, connected: connected, publickey: {}}).write();
  });
  setInterval(()=>{
    socket.emit("online",db.get("users").value());
  },1000);
  socket.on("disconnect", (reason)=>{
    db.get("users").remove({socketId: socket.id}).write();
    console.log(reason);
  });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

server.listen(5000, function(){
  console.log("Server is started");
});

module.exports = app;
