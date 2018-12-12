// const betChart = BetChart();
const historiesManager = new HistoryManager();
const chartHistories = new ChartHistories();

let timeoutCountdown = new Object();


const y = x => x * x;
const getY = time => parseInt((y(time / 1000) + 100))
const formatCrashOut = (co, end_key = "") => co ? (+co / 100).toFixed(2) + end_key : "-";

const STATUS_ALL_HIDE = "000";
const STATUS_COUTDOWN = "001";
const STATUS_CRASHING = "100";
const STATUS_CRASHED = "010";

const BTN_BETTING = "BTN_BETTING";
const BTN_PLACED = "BTN_PLACED";
const BTN_READY = "BTN_READY";

function showBigAnimal(at) {
    if (at >= 1000 && at < 5000) {
        $(".animal-big-crash-out #phoenix-gif").hide(0);
        // $(".animal-big-crash-out #horse-gif").show(100);
    } else if (at >= 5000) {
        $(".animal-big-crash-out #phoenix-gif").show(100);
        $(".animal-big-crash-out #horse-gif").hide(0);
    } else {
        $(".animal-big-crash-out img").hide(0);
    }
}

function showStatus(status, type = "not-playing") {
    +status[0] ? $(".crashing").show(0) : $(".crashing").hide(0);
    +status[1] ? $(".crashed").show(0) : $(".crashed").hide(0);
    +status[2] ? $(".count-down-time").show(0) : $(".count-down-time").hide(0);

    if (type == "playing") {
        $(".crashing").addClass("playing");
    } else $(".crashing").removeClass("playing");
}

function UpdateAccountUser(account) {
    $(".account-free_coin").text(account.free_coin.toFixed(2));
    $(".account-usg_amount").text(account.usg_amount.toFixed(2));
}

/**
 * 
 * Functions get html
 *  
 */

function getHtmHistoryLine(history) {
    let crash_at = formatCrashOut(history.crash_at);
    return `
        <span style="color: ${getColorGame(crash_at)}">${crash_at}x</span>
    `;
}

function getHtmlRowHistory(history) {
    let crash_at = formatCrashOut(history.crash_at);

    return `
            <tr>
                    <td width="30%" style="color: ${getColorGame(crash_at)}">${crash_at}x</td>
                    <td width="10%">${history.cashed_out}</td>
                    <td width="10%">${history.bet}</td>
                    <td class="hash-history-text" width="10%">${history.bonus}</td>
                    <td width="10%">${history.profit}</td>
                    <td class="hash-history-text" width="30%"> <span><span class="text-hash">${history._id.slice(0, 10)}...</span>  <img class="btn-copy_hash" id="history-${history._id}" src="styles/images/hist-icon.png"></span></td>
            </tr>
    `;
}

function getHtmlRowBoardPlayer(player) {
    let status = {
        "PLAYING": "table-color-betting",
        "CASHED_OUT": "table-color-war",
        "LOSS": "table-color-red",
    };

    return `
        <tr class="${status[player.status]}">
            <td width="25%" ><a href="/user/${player.user.username}">${player.user.username}</a></td>
            <td width="15%" >${player.status == "LOSS" ? "-" : (formatCrashOut(player.stoppedAt) || "-")}</td>
            <td width="20%" >${player.status !== "PLAYING" ? player.bet : "-"}</td>
            <td width="20%" >${player.bonus ? parseFloat(player.bonus).toFixed(2) : "-"}</td>
            <td width="20%" >${player.profit ? parseFloat(player.profit).toFixed(2) : "-"}</td>
        </tr>
    `
}


function countDown(time) {
    // clearTimeout(timeoutCountdown);
    // $(".count-down-time .txt-value").text((time / 1000).toFixed(1));
    // timeoutCountdown = setTimeout(() => {
    //     countDown(time - 100)
    // }, 100);
}

const getTypeCashOut = pl => pl.stoppedAt ? pl.stoppedAt : pl.auto_cash_out
const sortPlayers = (players) => {
    return Object.entries(players)
        .sort((a, b) => getTypeCashOut(a[1]) - getTypeCashOut(b[1]))
}

const arrangeBoardPlayers = players => {
    let playersCashedOut = [];
    let playersPlaying = [];
    let playersLoss = [];

    Object.entries(players).forEach(([username, player]) => {
        if (player.status == "PLAYING") {
            playersPlaying.push(player);
        }
        if (player.status == "CASHED_OUT") {
            playersCashedOut.push(player);
        }
        if (player.status == "LOSS") {
            playersLoss.push(player);
        }
    })

    return [
        ...playersLoss.sort((a, b) => a.bet - b.bet),
        ...playersPlaying.sort((a, b) => a.bet - b.bet),
        ...playersCashedOut.sort((a, b) => b.stoppedAt - a.stoppedAt),
    ];
}

function DrawBoardPlayers(players) {
    $(".board-players .table-body tbody").html(
        arrangeBoardPlayers(players)
            .reduce(
                (cur, player) => cur + getHtmlRowBoardPlayer(player),
                ''
            )
    )
}

function DrawHistoriesLine(histories) {
    $(".histories-line").html(histories.slice(0, 7).reduce((cur, history) => cur + getHtmHistoryLine(history), ''))
}

function DrawTableHistories(histories) {
    $(".history-table table tbody").html(histories.reduce((cur, history) => cur + getHtmlRowHistory(history), ''))
}

function DrawGameHistories(data, type) {
    if (type == "PREPEND") {
        $(".histories-line span").last().remove();

        $(".history-table table tbody").prepend(getHtmlRowHistory(data))
        $(".histories-line").prepend(getHtmHistoryLine(data));
    }
    if (type == "HTML") {
        DrawTableHistories(data);
        DrawHistoriesLine(data);
    }
}

function showPlayerWin(money) {
    document.getElementById("audio-win_sound").play();
    $("#modal-game-result").modal("show");

    $("#modal-game-result #text-game-status").text("You win");
    $("#text-game-result").html(`<b id="currency">$</b><span id="money">${money}</span>`)

    // $("#modal-game-result #text-game-result #currency").text("$")
    // $("#modal-game-result #money").text(money);

    setTimeout(() => {
        $("#modal-game-result").modal("hide");
    }, 2300);
}

function showPlayerBonus(money) {
    document.getElementById("audio-win_sound").play();
    $("#modal-game-result").modal("show");

    $("#modal-game-result #text-game-status").text("Your Bonus");
    $("#text-game-result").html(`<span id="money">${money}</span><b id="currency"> PINS</b>`)

    // $("#modal-game-result #text-game-result #currency").text("pins: ")
    // $("#modal-game-result #money").text(money);
    setTimeout(() => {
        $("#modal-game-result").modal("hide");
    }, 2300);
}

const showGameConnecting = (isConnecting) => {
    if (isConnecting) {
        $(".area-connecting").fadeIn(0);
        ChartCanvas().starting();
    } else {
        $(".area-connecting").fadeOut(1000);
    }
}

const showStatusBarPlayers = (total_players, total_betting) => {
    $(".betting-bar .players-count .txt-value").text(total_players);
    $(".betting-bar .betting-profit .txt-value").text(total_betting);
}

const showStatusBtnPlaceBet = (status = BTN_READY, profit = 0) => {
    $(".btn-place-bet").removeClass("betting");
    $(".btn-place-bet").removeClass("placed");
    $(".btn-place-bet").removeClass("actived");


    switch (status) {
        case BTN_BETTING: {
            $(".btn-place-bet").addClass("betting");
            $(".btn-place-bet").addClass("actived");
            $(".btn-place-bet #btn-bet span").text("BUYING (Payout)");
            // $(".btn-place-bet #btn-bet span").text("Cash out @" + profit);
            break;
        }
        case BTN_PLACED: {
            $(".btn-place-bet").addClass("actived");
            $(".btn-place-bet").addClass("placed");
            $(".btn-place-bet #btn-bet span").text("BOUGHT (Cancel)");
            break;
        }
        case BTN_READY: {
            $(".btn-place-bet #btn-bet span").text("BUY");
            break;
        }
        default: return;
    }
}

const totalBet = (players) => Object.entries(players).map(item => item[1]).reduce((cur, next) => cur + +next.bet, 0);

const getEventBtnBetClick = cb => {
    $(".contentLeft").off("click").on("click", "#btn-bet", (e) => {
        const numInput = $(".contentTop-right").is(":visible") ? 1 : 2;
        const amount = parseFloat($("#input-bet-" + numInput).val());
        const autoCashOut = parseInt(parseFloat($("#input-crash-out-" + numInput).val()) * 100);
        if (amount && autoCashOut) {
            cb({
                amount,
                autoCashOut
            });
        } else {
            toastr.error("Can not place a trade with " + amount + "  " + autoCashOut)
        }
    })
}
const getEventBtnCopyHash = cb => {
    $(".history-table").on("click", ".btn-copy_hash", e => {
        let hash = e.target.id.split("-")[1];
        copyToClipboard(hash);
        toastr.success("Copied hash: " + hash);
    })
}

const uppdateAutoBetConfig = (config, isWin) => {
    if (isWin) {
        if (!config.on_win.is_return_base_bet) {
            config.cur_bet *= +config.on_win.increase_bet_by;
        } else {
            config.cur_bet = config.base_bet;
        }
    } else {
        if (!config.on_loss.is_return_base_bet) {
            config.cur_bet *= +config.on_loss.increase_bet_by;
        } else {
            config.cur_bet = config.base_bet;
        }
    }
    if (config.cur_bet > config.max_bet_stop) {
        $(".bet-logged #btn_stop_auto").trigger("click");
        config.is_auto = false;
    }
    return config;
}

const getDataFromAutoForm = () => {
    let base_bet = parseInt($(".type-auto-bet #base_bet").val() || 1);
    let auto_crash_out = parseFloat($(".type-auto-bet #auto_crash_out").val() || 1) * 100;
    return {
        is_auto: false,
        base_bet,
        cur_bet: base_bet,
        cur_auto_crash: auto_crash_out,
        auto_crash_out,
        max_bet_stop: parseFloat($(".type-auto-bet #max_bet_stop").val() || 1),
        on_loss: {
            is_return_base_bet: $(".type-auto-bet input[name='on-loss']:checked").val() === "return",
            increase_bet_by: parseFloat($(".type-auto-bet #on_loss_increase_value").val() || 1),
        },
        on_win: {
            is_return_base_bet: $(".type-auto-bet input[name='on-win']:checked").val() === "return",
            increase_bet_by: parseFloat($(".type-auto-bet #on_win_increase_value").val() || 1)
        },
    };
}

const getEventAutoBarClick = (cb) => {
    $(".bet-logged #form_auto_control").on("submit", e => {
        e.preventDefault();
    })

    $(".bet-logged").off("click").on("click", ".btn-control_auto button", (e) => {
        let AutoBetConfig = getDataFromAutoForm();

        if (e.target.id == "btn_start_auto") {
            cb({ ...AutoBetConfig, is_auto: true });
        }

        if (e.target.id == "btn_stop_auto") {
            cb({ ...AutoBetConfig, is_auto: false });
        }
    })
}

const makeAutoBet = (config, cb) => {
    if (config.is_auto) {
        cb({
            amount: config.cur_bet,
            autoCashOut: parseFloat(config.cur_auto_crash),
        })
    }
}

const CheckOnData = (data, check, cb) => {
    data.find(check) ? cb(data.find(check)) : cb(false);
}

const checkWin = game => game.crashed_out !== 0;
const checkLose = game => game.crashed_out === 0;

const checkExistPlayer = (players, userName, take = "user") => {
    if (
        players[userName] &&
        players[userName].user &&
        players[userName].user.username === userName &&
        players[userName][take]) {
        return players[userName][take];
    }
    return null;
}

function GameBet({ userId, userName }, jwt_token) {
    let CACHED = {
        playBet: null,
    }
    let players = {};
    let AutoBetConfig = getDataFromAutoForm();

    const enventHandler = io => {

        getEventBtnBetClick((newBet) => {
            placeBet(io, newBet);
        })

        getEventBtnCopyHash((hash) => {
            alert(hash)
        });

        getEventAutoBarClick(config => {
            AutoBetConfig = config;
            if (config.is_auto) {
                $("#btn_start_auto").prop("disabled", true).text("STARTED");
            } else {
                $("#btn_start_auto").prop("disabled", false).text("START");
            }
        })
    }

    const placeBet = (io, newBet) => {
        io.emit("place_bet", newBet, (er) => {
            if (er == "CANCEL_BETTING") {
                delete players[userName];
                DrawBoardPlayers(players);
                showStatusBtnPlaceBet(BTN_READY);
            }

            if (er == "GAME_IN_PROGRESS") {
                switch (checkExistPlayer(players, userName, "status")) {
                    case "PLAYING": {
                        io.emit("cash_out", er => {
                            er && console.log(er);
                        });
                        break;
                    }
                    default: {
                        if (CACHED.playBet) {
                            CACHED.playBet = null;
                            showStatusBtnPlaceBet(BTN_READY);
                        } else {
                            showStatusBtnPlaceBet(BTN_PLACED);
                            CACHED.playBet = newBet;
                        }
                    }
                }
            }

            if (er == "NOT_ENOUGH_COIN") {
                toastr.error("You are not enough PINS to trade");
                showStatusBtnPlaceBet(BTN_READY);
            }

            if (er && er.message == "LIMIT_PLACE_BET") {
                toastr.error(er.limit);
            }
        });
    }

    const connect = (io) => {
        io.on("disconnect", (er) => {
            console.log("disconnect");
            showGameConnecting(true);
        })

        io.on("connected", (er) => {
            console.log("connected", true);
            // betChart.resetChart();
            showGameConnecting(false);
        })
        // 
        /**
         * Game place
         */


        io.on("game_status", (data) => {
            const elapsed = Math.abs(Date.now() - new Date(data.startTime).getTime())
            players = data.players;
            showBigAnimal(false);

            if (data.game_state == "STARTING") {
                showStatusBarPlayers("?", "?");
                ChartCanvas().starting();

                if (checkExistPlayer(players, userName, "status") == "PLAYING") {
                    showStatusBtnPlaceBet(BTN_PLACED);
                }
            }

            if (data.game_state == "IN_PROGRESS") {
                ChartCanvas().started(elapsed);
                showStatusBarPlayers(Object.keys(players).length, totalBet(players))
                if (checkExistPlayer(players, userName, "status") == "PLAYING") {
                    showStatusBtnPlaceBet(BTN_BETTING);
                    ChartCanvas().setPlayer(true);
                }
            }

            if (data.game_state == "ENDED") {
                ChartCanvas().stoped(data.forcePoint);
                showStatusBarPlayers(Object.keys(players).length, totalBet(players))
            }

            // DrawGameHistories(data.game_histories, "HTML")
            DrawBoardPlayers(players);
            chartHistories.updateCharts(data.historyChart);
        })

        io.on("top-histories", data => {
            DrawGameHistories(data, "HTML")
        })

        io.on("tick", time => {
            let yChart = growthFunc(time);
            showBigAnimal(yChart);

            if (Math.abs(+yChart - ChartCanvas().getCurrentGamePayout()) > 5) {
                ChartCanvas().started(time);
            }

            if (players[userName] && players[userName].status == "PLAYING") {
                const pl = players[userName];
                const profit = parseFloat(pl.bet * (yChart / 100)).toFixed(2);
                showStatusBtnPlaceBet(BTN_BETTING, profit);
            }
        })

        io.on("bet", (data) => {
            players[data.user.username] = data;
            DrawBoardPlayers(players);
            if (checkExistPlayer(players, userName, "status")) {
                showStatusBtnPlaceBet(BTN_PLACED);
            }
        })

        io.on("game_starting", data => {
            players = {};
            ChartCanvas().starting();

            if (CACHED.playBet) {
                placeBet(io, CACHED.playBet);
                showStatusBtnPlaceBet(BTN_PLACED);
                CACHED.playBet = null;
            } else {
                showStatusBtnPlaceBet(BTN_READY);
            }

            countDown(data.time_till_start);
            DrawBoardPlayers(players);
            showStatusBarPlayers("?", "?");

            makeAutoBet(AutoBetConfig, newBet => {
                const numInput = $(".contentTop-right").is(":visible") ? 1 : 2;
                $("#input-bet-" + numInput).val(newBet.amount);
                $("#input-crash-out-" + numInput).val(parseFloat(newBet.autoCashOut / 100).toFixed(2))

                placeBet(io, newBet);
            })
        })

        io.on("bets", data => {
            DrawBoardPlayers(data.bets);
        })

        io.on("game_started", data => {
            players = data.bets;
            // betChart.resetChart();
            ChartCanvas().started();

            DrawBoardPlayers(players);
            showStatusBarPlayers(Object.keys(players).length, totalBet(players))

            if (checkExistPlayer(players, userName, "status")) {
                // betChart.setColorLine("playing");
                // showStatus(STATUS_CRASHING, "playing");
                ChartCanvas().setPlayer(true);
                showStatusBtnPlaceBet(BTN_BETTING);
            } else {
                ChartCanvas().setPlayer(false);
                // showStatus(STATUS_CRASHING, "not-playing");
            }
        })

        io.on("game_crash", data => {
            historiesManager.addHistory(data.history);
            chartHistories.updateCharts(data.historyChart);
            // $(".crashed .txt-value").text(formatCrashOut(data.history.crash_at));
            showBigAnimal(false);
            ChartCanvas().stoped(data.history.crash_at);
            DrawBoardPlayers(data.players);
            if (CACHED.playBet == null) {
                showStatusBtnPlaceBet(BTN_READY);
            }

            data.history = {
                ...data.history,
                cashed_out: "-",
                bet: "-",
                profit: "-",
                bonus: "-",
            }

            CheckOnData(
                Object.entries(data.players).map(item => item[1]),
                player => player.user._id === userId,
                (player) => {
                    if (player) {
                        const { bet, profit, bonus, cashed_out } = player;
                        io.emit("my_account", jwt_token, data => UpdateAccountUser(data))
                        if (bonus > 0) {
                            showPlayerBonus(
                                bonus.toFixed(2)
                            );
                        }

                        DrawGameHistories({
                            ...data.history,
                            cashed_out: formatCrashOut(cashed_out, "x"),
                            bet: _fixed(bet),
                            profit: _fixed(profit),
                            bonus: _fixed(bonus)
                        }, "PREPEND");

                        AutoBetConfig = uppdateAutoBetConfig(AutoBetConfig, player.status === "CASHED_OUT");
                    } else {
                        DrawGameHistories(data.history, "PREPEND");
                    }
                }
            );
        })

        io.on("cashed_out", player => {
            players[player.user.username] = player;
            DrawBoardPlayers(players);
            if (player.user.username === userName) {
                let profit = getProfit(player.stoppedAt, player.bet, player.bonus);
                if (+player.stoppedAt > 100) {
                    showPlayerWin(
                        (exchangeMoney("pins-usg", profit)).toFixed(2)
                    );
                }

                // betChart.setColorLine("not-playing");
                // showStatus(STATUS_CRASHING, "not-playing");
                showStatusBtnPlaceBet(BTN_READY);
                ChartCanvas().setPlayer(false);

                CACHED.playBet = null;
                io.emit("my_account", jwt_token, data => UpdateAccountUser(data))
            }
        })

        io.on('reload_page', () => {
            window.location.reload();
        })

        io.on("err", err => {
            console.log("ERROR", err);
            toastr.error(err || "Cant not do this actions");
        })
        enventHandler(io);
    }

    return {
        connect,
    }
}
