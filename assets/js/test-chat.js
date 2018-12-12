'use strict';




const initMessages = messages => {
    const _html = messages.reduce((cur, next) => {
        return cur + `
            <p>
                <b>${next.author}: </b>
                <span>${next.value}</span>
            </p>
        `
    }, "");
    $("#messages-content").append(_html);
}

const newMessage = ({ author, value }) => {
    const _html = `
            <p>
                <b>${author}: </b>
                <span>${value}</span>
            </p>
        `;
    $("#messages-content").append(_html);
};


function Chat() {
    const socket = io("/test-chat");
    let _room_id = null;
    let _fullname = null;

    const connect = (room_id, fullname) => {
        _room_id = room_id;
        _fullname = fullname;

        socket.on("welcome", console.log);
        socket.emit("join-room", { room_id, fullname });

        socket.on("history-messages", initMessages);
        socket.on("new-message", newMessage)
    }

    $("#btn-send").click(() => {
        let value = $("#chat-input").val();
        if (value != "") {
            socket.emit("new-message", {
                room_id: _room_id,
                fullname: _fullname,
                value,
            });
            $("#chat-input").text("");
        }
    })

    return {
        connect
    }
}

const _chat = new Chat();