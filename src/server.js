import http from "http";
import express from "express";
import WebSocket from "ws";
import { SocketAddress } from "net";
 
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req,res) => res.render("home"));
app.get("/*",(req,res) => res.redirect("/"));


const handleListen = () => console.log('Listening on http://localhost:3000');

const server = http.createServer(app);
const wss = new WebSocket.Server({server});

//fake DB
const sockets = [];

wss.on("connection", (socket)=>{
    sockets.push(socket);
    socket["nickname"] = "Anony"
    console.log("Connected to Browser ✔");
    socket.on("close",()=>{
        console.log("Disconnected from the Browser ❌");
    });
    socket.on("message",(msg)=>{
        const message = JSON.parse(msg.toString("utf-8"));
        //console.log(parsed);
        switch(message.type) {
            case "new_message":
                sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`)); 
            case "nickname":
                socket["nickname"] = message.payload;
        }       
    });
    socket.send("hello");
});

server.listen(3000,handleListen);