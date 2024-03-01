// const express = require('express');

import db,{query} from "./db.js";
import express from "express";
import { Server } from 'socket.io';
const app = express();
const port = 4000;
const wifiIp = "192.168.1.4"
var server = app.listen(port, () => {
    console.log(`Server is running ${port}`);
});



const io = new Server(server, {
    cors: { origin: "*" }
});

app.get("/", (req, resp) => {
    resp.status(200).json("socket is running");
})

app.get("/api/data-fetch",async (req,resp)=> {
     
    let queryForFetch = "SELECT * FROM vendorlocations WHERE 1";
    let response = await query (queryForFetch);
    console.log("response",response);
    resp.status(200).json(response);
})


io.on('connection', (socket) => {
    console.log('User connection ');
    socket.on("connect user", (userId) => {
        console.log("userId", userId);
        socket.join(userId);
        socket.emit("successfull joined socket", userId)
    })

    socket.on("chat room", (roomId) => {
        console.log("my room Id", roomId);
        socket.join(roomId);
    })
    socket.emit("room connected", "Connection Successfully");

    socket.on("tracking",(btnKaMsg)=>{
        const room = btnKaMsg.room;
        const longitude  = btnKaMsg.location.latitude;
        const latitude = btnKaMsg.location.latitude;
        console.log(latitude);
        socket.join(room);
        socket.emit("room connected","Ho gaya room connection");
        console.log("location",btnKaMsg);
        socket.to(room).emit("message recieved",btnKaMsg);
        io.to(room).emit("track location",btnKaMsg);
        const querydata = "UPDATE `vendorlocations` SET `latitude` = ?, `longitude` = ? WHERE vendor_id = ?";
        query(querydata, [latitude, longitude, btnKaMsg.room], (err, result) => {
            console.log("error",err);
            console.log("response",result);
            // if (err) {
            //     console.error('Error updating vendor location:', err);
            //     return;
            // }
            // console.log('Vendor location updated successfully');
        });
    })


    socket.on('disconnect', (socket) => {
        console.log('Disconnect');
    });
});

