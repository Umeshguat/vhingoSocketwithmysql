// const express = require('express');

import db, { query } from "./db.js";
import express from "express";
import { Server } from 'socket.io';
const app = express();
const port = 4000;
import moment from "moment";
const wifiIp = "192.168.1.4"
var server = app.listen(port, () => {
    console.log(`Server is running ${port}`);
});

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, resp) => {
    resp.status(200).json("socket is running");
})

app.get("/room", (req, resp) => {
    resp.render("room");
});

const io = new Server(server, {
    cors: { origin: "*" }
});
app.use(express.json());


app.post('/emit', (req, resp) => {

    const { event, channel, data } = req.body;
    if (!event || !channel || !data) {
        return resp.status(400).send({ error: 'Missing required fields' });
    }
    io.to(channel).emit(event, data);
    resp.send({ status: 'emitted' });
});


io.on('connection', (socket) => {
    console.log("user is comming");
    socket.emit("userConnected", "Connected Successfully");

    socket.on("joinRoom", (data) => {
        socket.join(data.room);
        console.log("Client joined room:", data.room);
    });

    socket.on("qrcode", (data) => {
        const room = data.room;
        socket.join(room); // Join room if not already
            console.log("qrcode event   received with data:", data);

        if (data.token) {
            console.log("Sending token to room:", room);
            io.to(room).emit("accessToken", data.token);
        }
    });

    //update code for
    socket.on("video_play", async (btnKaMsg) => {
        const { room, video_id, store_id, type } = btnKaMsg;
        const endtime = moment().format('HH:mm:ss');
        try {
            if (type === 'live') {

                const currentDate = moment().format('YYYY-MM-DD');
                const updateQuery = `INSERT INTO videos_played_history (video_id, store_id, date, start_time)
                            VALUES (?, ?, ?, ?, ?, ?, ?)
                        `;
                const result = await query(updateQuery, [video_id, store_id, currentDate, endtime]);
                console.log("End time updated successfully:", result);

            } else if (type === 'end') {

                const currentDate = moment().format('YYYY-MM-DD');
                const updateQuery = `
                    UPDATE videos_played_history 
                    SET end_time = ? 
                    WHERE video_id = ? AND store_id = ? AND date = ? AND end_time IS NULL`;
                const result = await query(updateQuery, [endtime, video_id, store_id, currentDate]);
                console.log("End time updated successfully:", result);
            }
        } catch (e) {
            console.log("error", e);
        }

        socket.join(room);
        socket.emit("room connected", "Ho gaya room connection");
        console.log("location", btnKaMsg);
        socket.to(room).emit("message received", btnKaMsg);
    });

    socket.on('disconnect', (socket) => {
        console.log('Disconnect');
    });
});

