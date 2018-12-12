function WalletManager() {
    const urlApi = {
        buy_pins: "/transactions/buy-pins",
        transfer: "/transactions/transfer",
        withdraw: "/transactions/withdraw",
        get_wallet: "/account/get-wallet",
    };

    const disableBtnSubmit = (id, is_open) => {
        if (is_open) {
            setTimeout(() => {
                $("body #" + id).removeAttr("disabled");
            }, 1000);
        } else {
            $("body #" + id).attr("disabled", "disabled");
        }
    }

    const getWallet = () => new Promise((rs, rj) => {
        _ajax(
            urlApi.get_wallet,
            "GET",
            null,
            (er, data) => {
                er || data === null ? rj(er) : rs(data);
            }
        );
    })

    const getTransactions = (wallet_name) => {
        _ajax(
            `/transactions/${wallet_name}`,
            "GET",
            null,
            (er, data) => {
                if (!er) {
                    console.log(data);
                    let result = '';
                    for (let i = 0; i < data.data.length; i++) {
                        result += `<tr>
                                <td>${data.data[i].amount.toFixed(2)}</td>
                                <td>${data.data[i].description}</td>
                                <td>${data.data[i].from}</td>
                                <td>${data.data[i].to}</td>
                                <td>${data.data[i].status}</td>
                                <td>${data.data[i].created_at}</td>
                            </tr>`;
                    }
                    $("#wallet-detail #WalletHistory tbody").html(result);
                } else {
                    console.log(er);
                }
            }
        );
    }

    const buyPins = (usg_amount) => new Promise((rs, rj) => {
        _ajax(
            urlApi.buy_pins,
            "POST",
            { usg_amount },
            (er, data) => {
                er || data === null ? rj(er) : rs(data);
            }
        );
    })

    const transfer = (to, usg_amount, password) => new Promise((rs, rj) => {
        _ajax(
            urlApi.transfer,
            "POST",
            { to, usg_amount, password },
            (er, data) => {
                er || data === null ? rj(er) : rs(data);
            }
        );
    });

    const withdraw = (usg_amount, password) => new Promise((rs, rj) => {
        _ajax(
            urlApi.withdraw,
            "POST",
            { usg_amount, password },
            (er, data) => {
                er || data === null ? rj(er) : rs(data);
            }
        );
    })


    const show = {
        error: (er) => {
            toastr.error(er)
        },
        success: (data) => {
            location.reload();
        }
    }

    this.handlerEventWallet = (name) => {
        getTransactions(name);
        getWallet().then(res => {
            const { free_coin, usg_amount } = res.data.finances;
            $("#txt-usg-balance").text(usg_amount.toFixed(2));
            $("#txt-pins-buying").text("0");
            if (name == "pins") {
                $(".txt-pins_amount_wallet_tab").text(free_coin.toFixed(2));
                $(".txt-usg_amount_wallet_tab").hide(0);
            } else {
                $(".txt-usg_amount_wallet_tab").text("$" + usg_amount.toFixed(2));
                $(".txt-pins_amount_wallet_tab").hide(0);
            }
        })
            .catch(er => {
                show.error(er.message || "Can not get wallet");
            })
    }

    this.handlerEventWith = (jwt_user) => {
        // console.log(jwt_user);
        // getTransactions("pins");
        $("#BuyPins").on("click", "#btn-buy_pins", e => {
            disableBtnSubmit("btn-buy_pins", false);
            let usg_amount = $("#ip-buy_pins").val();
            if (Number(usg_amount) && Number(usg_amount) > 0) {
                buyPins(usg_amount)
                    .then((data) => {
                        show.success("Buy pins successful!");
                    })
                    .catch(er => {
                        disableBtnSubmit("btn-buy_pins", true);
                        show.error(er.message || "Can not buy pins!");
                    })
            } else {
                disableBtnSubmit("btn-buy_pins", true);
                show.error("Please input your usg amount!");
            }
        })

        $("#Transfer").on("click", "#btn-transfer", e => {
            let usg_amount = $("#ip-usg_transfer").val();
            let to = $("#ip-username_transfer").val();
            let password = $("#ip-password_transfer").val();

            disableBtnSubmit("btn-transfer", false);
            if (Number(usg_amount) && Number(usg_amount) > 0 && to && password) {
                transfer(to, usg_amount, password)
                    .then((data) => {
                        show.success("Transfer successful!");
                    })
                    .catch(er => {
                        show.error(er.message || "Can not transfer to " + to);
                        disableBtnSubmit("btn-transfer", true);
                    })
            } else {
                show.error("Input invalid");
                disableBtnSubmit("btn-transfer", true);
            }
        })

        $("#Withdraw").on("click", "#btn-withdraw", e => {
            let usg_amount = $("#ip-usg_withdraw").val();
            let password = $("#ip-password_withdraw").val();
            disableBtnSubmit("btn-withdraw", false);
            if (Number(usg_amount) && Number(usg_amount) > 0 && password) {
                withdraw(usg_amount, password)
                    .then((data) => {
                        show.success("Convert successful!");
                    })
                    .catch(er => {
                        show.error(er.message || "Can not Convert to USM");
                        disableBtnSubmit("btn-withdraw", true);
                    })
            } else {
                show.error("Input invalid");
                disableBtnSubmit("btn-withdraw", true);
            }
        })


        $("#WalletLink").click(function (e) {
            getWallet().then(res => {
                const { free_coin, usg_amount } = res.data.finances;
                $(".txt-usg_amount_wallet_tab").show(0).text("$" + usg_amount.toFixed(2));
                $(".txt-pins_amount_wallet_tab").show(0).text(free_coin.toFixed(2));
            })
                .catch(er => {
                    show.error(er.message || "Can not Convert to USM");
                })
        });
    }
}
