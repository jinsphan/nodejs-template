function AdminSetting({ userId, userName }, jwt_token) {
    // console.log(jwt_token);
    const parseIntArr = text => text.split(",").map(item => parseInt(item)).filter(item => !isNaN(item))

    function evenHandler(io) {
        $("#btn-crash-game-running").click(e => {
            io.emit("admin_crash_all");
        })

        $("#btn_reload_page").click(e => {
            io.emit("admin_reload_page");
        })


        $(".btn-edit-setting").on("click", e => {
            let isEdited = false;
            switch (e.target.id) {
                case "btn_edit_game_is_running": {
                    io.emit("edit_setting", {
                        name: "game_is_running",
                        value: $("input[name=cb_game_is_running]:checked").val() === "true"
                    })
                    isEdited = true;
                    break;
                }

                case "btn_edit_game_looper_crash_all": {
                    let arrItems = $("#ip_looper_crash_all-arr").val().split(",");
                    let pointsItems = $("#ip_looper_crash_all-points").val().split(",");

                    let realArrItem = arrItems.map(item => parseInt(item)).filter(item => !isNaN(item));
                    let realPoinstItem = pointsItems.map(item => parseInt(item)).filter(item => !isNaN(item) && item >= 100);

                    if (realArrItem.length !== arrItems.length || realPoinstItem.length !== pointsItems.length) break;

                    $("#ip_looper_crash_all-arr").val(realArrItem.join(","))
                    $("#ip_looper_crash_all-points").val(realPoinstItem.join(","))


                    const data = {
                        name: "looper_crash_all",
                        value: {
                            arr: realArrItem,
                            points: realPoinstItem,
                        }
                    }
                    io.emit("edit_setting", data);
                    isEdited = true;
                    break;
                }

                case "btn_edit_game_seed_algorithm": {
                    const max_pins = parseInt($("#ip_seed_algorithm-max_pins").val()) || 0
                    const recharge_amount = parseFloat($("#ip_seed_algorithm-recharge_amount").val()) || 0

                    $("#ip_seed_algorithm-max_pins").val(max_pins)
                    $("#ip_seed_algorithm-recharge_amount").val(recharge_amount)

                    io.emit("edit_setting", {
                        name: "seed_algorithm",
                        value: {
                            max_pins,
                            recharge_amount
                        }
                    });
                    isEdited = true;
                    break;
                }

                case "btn_edit_game_shark_algorithm": {
                    const time_rate = parseInt($("#ip_shark_algorithm-time_rate").val()) || 0
                    const crash_at = parseFloat($("#ip_shark_algorithm-crash_at").val()) || 0

                    $("#ip_shark_algorithm-time_rate").val(time_rate)
                    $("#ip_shark_algorithm-crash_at").val(crash_at)

                    io.emit("edit_setting", {
                        name: "shark_algorithm",
                        value: {
                            time_rate,
                            crash_at
                        }
                    });

                    isEdited = true;
                    break;
                }

                case "btn_edit_game_triad_of_power": {
                    const balance_ratio = parseFloat($("#ip_balance_algorithm-ratio").val()) || 0;
                    const suction_ratio = parseFloat($("#ip_suction_algorithm-ratio").val()) || 0;
                    const suction_fees = parseFloat($("#ip_suction_algorithm-fees").val()) || 0;
                    const discharge_min = parseInt($("#ip_discharge_algorithm-minimum_amount").val()) || 0;
                    const discharge_max_ratio = parseFloat($("#ip_discharge_algorithm-ratio_maximum").val()) || 0;
                    const discharge_random_ratio = parseFloat($("#ip_discharge_algorithm-ratio_random").val()) || 0;

                    $("#ip_balance_algorithm-ratio").val(balance_ratio)
                    $("#ip_suction_algorithm-ratio").val(suction_ratio)
                    $("#ip_suction_algorithm-fees").val(suction_fees)
                    $("#ip_discharge_algorithm-minimum_amount").val(discharge_min)
                    $("#ip_discharge_algorithm-ratio_maximum").val(discharge_max_ratio)
                    $("#ip_discharge_algorithm-ratio_random").val(discharge_random_ratio)

                    io.emit("edit_setting", {
                        name: "balance_algorithm",
                        value: { ratio: balance_ratio }
                    })

                    io.emit("edit_setting", {
                        name: "suction_algorithm",
                        value: { ratio: suction_ratio, fees: suction_fees }
                    })

                    io.emit("edit_setting", {
                        name: "discharge_algorithm",
                        value: {
                            minimum_amount: discharge_min,
                            ratio_maximum: discharge_max_ratio,
                            ratio_random: discharge_random_ratio,
                        }
                    })

                    isEdited = true;

                    break;
                }

                case "btn_edit_game_bots_config": {
                    const REAL_BOT = {
                        num_bot_play: parseInt($("#ip_realbots-num_bot_play").val()) || 0,
                        auto_cash_out: parseIntArr($("#ip_realbots-auto_cash_out").val()).slice(0, 2) || [],
                        bet: parseIntArr($("#ip_realbots-bet").val()).slice(0, 2) || [],
                    }
                    const VIR_BOT_A = {
                        num_bot_play: parseInt($("#ip_virbotsA-num_bot_play").val()) || 0,
                        auto_cash_out: parseIntArr($("#ip_virbotsA-auto_cash_out").val()).slice(0, 2) || [],
                        bet: parseIntArr($("#ip_virbotsA-bet").val()).slice(0, 2) || [],
                    }
                    const VIR_BOT_B = {
                        num_bot_play: parseInt($("#ip_virbotsB-num_bot_play").val()) || 0,
                        auto_cash_out: parseIntArr($("#ip_virbotsB-auto_cash_out").val()).slice(0, 2) || [],
                        bet: parseIntArr($("#ip_virbotsB-bet").val()).slice(0, 2) || [],
                    }

                    $("#ip_realbots-num_bot_play").val(REAL_BOT.num_bot_play)
                    $("#ip_realbots-auto_cash_out").val(REAL_BOT.auto_cash_out.join(","))
                    $("#ip_realbots-bet").val(REAL_BOT.bet.join(","))

                    $("#ip_virbotsA-num_bot_play").val(VIR_BOT_A.num_bot_play)
                    $("#ip_virbotsA-auto_cash_out").val(VIR_BOT_A.auto_cash_out.join(","))
                    $("#ip_virbotsA-bet").val(VIR_BOT_A.bet.join(","))

                    $("#ip_virbotsB-num_bot_play").val(VIR_BOT_B.num_bot_play)
                    $("#ip_virbotsB-auto_cash_out").val(VIR_BOT_B.auto_cash_out.join(","))
                    $("#ip_virbotsB-bet").val(VIR_BOT_B.bet.join(","))


                    const data = {
                        REAL_BOT,
                        VIR_BOT_A,
                        VIR_BOT_B
                    }

                    io.emit("edit_setting", {
                        name: "bots_config",
                        value: data
                    })

                    isEdited = true;
                }

                case "btn_edit_bounty_rate": {
                    let bounty_rate = parseFloat($("#ip_bounty_rate-ratio").val()) || 0
                    if (bounty_rate < 0 || bounty_rate > 1) {
                        alert("Bounty rate not correct");
                        break;
                    }

                    io.emit("edit_setting", {
                        name: "bounty_rate",
                        value: {
                            ratio: bounty_rate,
                        }
                    })

                    isEdited = true;

                }

                case "btn_edit_limit_place_bet": {
                    let limit_bet = parseFloat($("#ip_limit_place_bet-limit_bet").val()) || 0
                    let limit_auto_crash_out = parseFloat($("#ip_limit_place_bet-limit_auto_crash_out").val()) || 0

                    $("#ip_limit_place_bet-limit_bet").val(limit_bet)
                    $("#ip_limit_place_bet-limit_auto_crash_out").val(limit_auto_crash_out)

                    io.emit("edit_setting", {
                        name: "limit_place_bet",
                        value: {
                            limit_bet,
                            limit_auto_crash_out
                        }
                    })

                    isEdited = true;

                }

                case "btn_edit_permissions": {
                    let value = [
                        $("#ip_permissions-transfer").is(":checked") ? 1 : 0,
                        $("#ip_permissions-withdraw").is(":checked") ? 1 : 0,
                        $("#ip_permissions-buy_pins").is(":checked") ? 1 : 0
                    ].join("");

                    io.emit("edit_setting", {
                        name: "permissions",
                        value
                    })

                    isEdited = true;
                }

                case "btn_edit_v3_is_actived": {
                    io.emit("edit_setting", {
                        name: "v3_is_actived",
                        value: $("input[name=cb_v3_is_actived]:checked").val() === "true"
                    })
                    isEdited = true;
                    break;
                }

                case "btn_edit_game_v3_algorithms": {
                    const rounds_config = {
                        rounds_count: Number($("#v3_rounds_config-rounds_count").val()) || 12,
                        num_hut_in_round: Number($("#v3_rounds_config-num_hut_in_round").val()) || 3,
                        max_ratio_bet: Number($("#v3_rounds_config-max_ratio_bet").val()) || 3
                    }

                    const v3_suction_algorithm = {
                        ratio: Number($("#v3_suction_algorithm-ratio").val()) || 0.4,
                        fees_profit_pool: Number($("#v3_suction_algorithm-fees_profit_pool").val()) || 0.05,
                        fees_discharge_wallet: Number($("#v3_suction_algorithm-fees_discharge_wallet").val()) || 0.05,
                    }

                    const v3_discharge_algorithm = {
                        ratio_maximum: Number($("#v3_discharge_algorithm-ratio_maximum").val()) || 0.4,
                    }

                    const v3_invert_suction_algorithm = {
                        is_actived: $("#v3_invert_suction_algorithm-is_actived").prop("checked"),
                        min_ratio_bet: Number($("#v3_invert_suction_algorithm-min_ratio_bet").val()) || 0.33,
                        max_ratio_discharge: Number($("#v3_invert_suction_algorithm-max_ratio_discharge").val()) || 0.5,
                    }

                    Object.entries(rounds_config).forEach(([key, value]) => {
                        $("#v3_rounds_config-" + key).val(value)
                    });
                    Object.entries(v3_suction_algorithm).forEach(([key, value]) => {
                        $("#v3_suction_algorithm-" + key).val(value)
                    });
                    Object.entries(v3_discharge_algorithm).forEach(([key, value]) => {
                        $("#v3_discharge_algorithm-" + key).val(value)
                    });
                    Object.entries(v3_invert_suction_algorithm).forEach(([key, value]) => {
                        if (key == "is_actived") {
                            $("#v3_invert_suction_algorithm-" + key).prop("checked", value)
                        } else {
                            $("#v3_invert_suction_algorithm-" + key).val(value)
                        }
                    });


                    io.emit("edit_setting", {
                        name: "v3_rounds_config",
                        value: rounds_config
                    })

                    io.emit("edit_setting", {
                        name: "v3_suction_algorithm",
                        value: v3_suction_algorithm
                    })

                    io.emit("edit_setting", {
                        name: "v3_discharge_algorithm",
                        value: v3_discharge_algorithm
                    })

                    io.emit("edit_setting", {
                        name: "v3_invert_suction_algorithm",
                        value: v3_invert_suction_algorithm
                    })

                    isEdited = true;
                    break;


                }

                case "btn_edit_bonus_config": {
                    let games_checked = parseFloat($("#ip_bonus_config-games_checked").val()) || 0
                    let ratio_discharge_pool = parseFloat($("#ip_bonus_config-ratio_discharge_pool").val()) || 0

                    $("#ip_bonus_config-games_checked").val(games_checked)
                    $("#ip_bonus_config-ratio_discharge_pool").val(ratio_discharge_pool)

                    io.emit("edit_setting", {
                        name: "bonus_config",
                        value: {
                            games_checked,
                            ratio_discharge_pool
                        }
                    })

                    isEdited = true;
                }

                default: break;

            };
            if (isEdited) toastr.success("Edit successfull");
            else toastr.error("Can not edit");
        })
    }


    const connect = (io) => {
        io.on("disconnect", (er) => {
            console.log("disconnect");
        })

        io.on("connected", (er) => {
            console.log("connected", true);
        })


        evenHandler(io);
    }

    return {
        connect
    }
}