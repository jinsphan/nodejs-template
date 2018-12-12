const COLOR = {
    grey: "grey",
    red: "#ef6862",
    green: "#1fd384",
    yellow: "#ffff69"
}

function copyToClipboard(str) {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};

function innerHtml(ele, _html) {
    ele.append(_html);
}

function inverseGrowth(result) { // crashPoint -> time duration
    var c = 16666.666667;
    return c * Math.log(0.01 * result);
}

function growthFunc(ms) { // elapsed -> crashPoint
    var r = 0.00006;
    return Math.floor(100 * Math.pow(Math.E, r * ms));
}


function exchangeMoney(type = "usg-pins", amount) {
    switch (type) {
        case "usg-pins": {
            return +amount * 10;
        }
        case "pins-usg": {
            return +amount / 10;
        }
        default: return +amount;
    }
}

function _fixed(str) {
    return str ? str.toFixed(2) : 0.00
}

function _ajax(url, method, data, cb) {
    $.ajax({
        url: "/api" + url, method,
        data,
        success: data => {
            cb(null, data);
        },
        error: er => {
            er ? cb(JSON.parse(er.responseText)) : cb(true)
        }
    })
}

const _libs = {
    // isNumber: 
}


function getColorGame(crash_at) {
    if (!crash_at) return "";
    if (crash_at < 1.5) return COLOR.red;
    if (crash_at >= 1.5 && crash_at < 10) return COLOR.green;
    return COLOR.yellow;
}

function getProfit (cashed_out, bet, bonus) {
    if (cashed_out) {
        return parseFloat(+bet * ((cashed_out - 100) / 100)) + parseFloat(+bonus)
    }
    return +bet * -1 + +bonus;
}

// toastr config
toastr.options = {
    "closeButton": true,
    "positionClass": "toast-bottom-right",
    // "progressBar": true,
    //   "showDuration": "300",
    //   "hideDuration": "1000",
      "timeOut": "2000",
    //   "extendedTimeOut": "1000",
    //   "showEasing": "swing",
    //   "hideEasing": "linear",
    //   "showMethod": "fadeIn",
    //   "hideMethod": "fadeOut"
}