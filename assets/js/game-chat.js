function getHtmlMessage(message) {

    return `
        <p class="chat-message">
            <span class="time">${message.createdAt}</span>
            <a style="color: ${message.user.chat ? message.user.chat.color : "#1fd384"}" href="user/${message.user.username}" class="author">${message.user.username}:</a>
            <span class="message">${message.message}</span>
        </p>
    `;
}

function scrollToBottom(ele) {
    ele.scrollTop(ele[0].scrollHeight);
}

function makeLoading(bool) {
    if (bool) $(".tabs-controls .tabs-content .loading").fadeIn(100);
    if (!bool) $(".tabs-controls .tabs-content .loading").fadeOut(1000);
}


function Chat({userId, userName}, jwt_token) {
    const txtField = $("#chat-text-field");

    const enterMessage = (message, io) => {
        io.emit("new-message", {
            message,
            userId
        }, (data) => {
            txtField.val(null);
        })
    }

    const enventHandler = io => {
        $("#form-chat-container").submit(e => {
            txtField.val().trim() !== "" ? enterMessage(txtField.val().trim(), io) : () => {}
            e.preventDefault();
        })
        // txtField.keypress(e => e.which == 13 && txtField.val().trim() !== "" ? enterMessage(txtField.val().trim(), io) : () => { })
    }

    const connect = (io) => {
        makeLoading(true);

        io.emit("all-messages", { userId }, ({ allMessages }) => {
            innerHtml($(".chat-messages"), allMessages.reduce((cur, next) => `${cur}${getHtmlMessage(next)}`, ""));
            scrollToBottom($(".chat-messages"));
            makeLoading(false);
        })

        io.on("new-message", newMessage => {
            innerHtml($(".chat-messages"), getHtmlMessage(newMessage));
            scrollToBottom($(".chat-messages"));
        })

        io.on("disconnect", (er) => {
            console.log("disconnect");
            makeLoading(true);
        })

        io.on("connected", (er) => {
            makeLoading(false);
        })

        enventHandler(io);
    }


    return {
        connect,
    }
}

