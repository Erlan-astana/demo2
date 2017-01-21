$(function () {

    var buttons = '.btn-yes, .btn-cancel, .btn-ok';
    $(buttons).kendoButton();
    createWindows();

    function createWindows() {

        asd.modalWindowAlert = $(".divAlertWindow").kendoWindow({
            width: "400px",
            height: "182px",
            title: "Подтвердить",
            visible: false,
            modal: true,
            draggable: true,
            activate: function () {
                asd.modalWindowAlert.toFront();
            }
        }).getKendoWindow().center();

    };




});

function openAlertWindow(message, options) {
    var wnw = asd.modalWindowAlert;

    if (!options)
        options = { ok: function () { } };

    $('.sp-question').html(message);
    if (options.ok) {
        $(".divAlertWindow .btn-yes").hide();
        $(".divAlertWindow .btn-cancel").hide();
        $(".divAlertWindow .btn-ok").show();
    } else {
        $(".divAlertWindow .btn-yes").show();
        $(".divAlertWindow .btn-cancel").show();
        $(".divAlertWindow .btn-ok").hide();
    }
    if (message.length > 50)
        wnw.wrapper.css('width', '400px').css('height', '182px');
    else
        wnw.wrapper.css('width', '350px').css('height', '106px');

    if (options.size) {
        wnw.wrapper
            .css('width', options.size.width + 'px')
            .css('height', options.size.height + 'px');
    }

    wnw.open();

    var btnYes = $(".divAlertWindow .btn-yes");
    var yesFunc = function () {
        if (options.yes) {
            options.yes();
            wnw.close();
        }
        btnYes.off('click', yesFunc);
    };
    btnYes.on('click', yesFunc);

    var btnCancel = $(".divAlertWindow .btn-cancel");

    var cancelFunc = function () {
        wnw.close();
        btnCancel.off('click', cancelFunc);
        btnYes.off('click', yesFunc);
    };

    btnCancel.on('click', cancelFunc);

    var btnOk = $(".divAlertWindow .btn-ok");
    var okFunc = function () {
        setCookie("entred", "0");
        wnw.close();
        btnOk.off('click', okFunc);
    };
    btnOk.on('click', okFunc);
}


function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}

function setCookie(cname, cvalue) {
    var d = new Date();
    d.setTime(d.getTime() + (60 * 60 * 1000)); //(exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function ConvertJsonDateString(jsonDate) {
    var shortDate = null;
    if (jsonDate) {
        var regex = /-?\d+/;
        var matches = regex.exec(jsonDate);
        var dt = new Date(parseInt(matches[0]));
        var month = dt.getMonth() + 1;
        var monthString = month > 9 ? month : '0' + month;
        var day = dt.getDate();
        var dayString = day > 9 ? day : '0' + day;
        var year = dt.getFullYear();
        shortDate = dayString + '.' + monthString + '.' + year;
    }
    return shortDate;
};

function getDateStrFromEFDateFormat(date, format) {
    try {
        date = getDateFromEFDateFormat(date);
        var dateStr = getDateStrFromDate(date, format);
        return dateStr;
    } catch (e) {
        return '';
    }
}

function getDateStrFromDate(date, format) {
    if (!date)
        return '';
    var dateStr = null;
    if (!format) format = 'DD.MM.YYYY hh:mm:ss';
    switch (format) {
        case 'YYYY.MM.DD':
            dateStr = padStr(date.getFullYear()) + "." +
			    padStr(1 + date.getMonth()) + "." +
			    padStr(date.getDate());
            break;
        case 'YYYY.MM.DD hh:mm:ss':
            dateStr = padStr(date.getFullYear()) + "." +
                          padStr(1 + date.getMonth()) + "." +
                          padStr(date.getDate()) + " " +
                          padStr(date.getHours()) + ":" +
                          padStr(date.getMinutes()) + ":" +
                          padStr(date.getSeconds());
            break;
        case 'DD.MM.YYYY hh:mm:ss':
            dateStr = padStr(date.getDate()) + "." +
                          padStr(1 + date.getMonth()) + "." +
                          padStr(date.getFullYear()) + " " +
                          padStr(date.getHours()) + ":" +
                          padStr(date.getMinutes()) + ":" +
                          padStr(date.getSeconds());
            break;
        case 'DD.MM.YYYY hh:mm':
            dateStr = padStr(date.getDate()) + "." +
                          padStr(1 + date.getMonth()) + "." +
                          padStr(date.getFullYear()) + " " +
                          padStr(date.getHours()) + ":" +
                          padStr(date.getMinutes());
            break;
        case 'DD.MM.YY':
            dateStr = padStr(date.getDate()) + "." +
                          padStr(1 + date.getMonth()) + "." +
                          (padStr(date.getFullYear()) - 2000);
            break;
        case 'MM.DD.YY':
            dateStr = padStr(padStr(1 + date.getMonth()) + "." +
                          date.getDate()) + "." +
                          (padStr(date.getFullYear()) - 2000);
            break;
        case 'DD.MM.YYYY':
            dateStr = padStr(date.getDate()) + "." +
                          padStr(1 + date.getMonth()) + "." +
                          padStr(date.getFullYear());
            break;
        case 'yyyy-MM-dd':
            dateStr = padStr(date.getFullYear()) + "-" +
                          padStr(1 + date.getMonth()) + "-" +
                          padStr(date.getDate());
            break;
        case 'CURRYEAR/MM/DD':
            dateStr = (new Date().getFullYear()) + "/" +
                          (date.getMonth()) + "/" +
                          (date.getDate());
            break;
        case 'DD MMMM':
            dateStr = date.getDate() + ' ' + getMonthName(1 + date.getMonth());
            break;
        case 'hh:mm':
            dateStr = padStr(date.getHours()) + ":" + padStr(date.getMinutes());
            break;
        default: break;
    }
    return dateStr;
}

function padStr(i) {
    return (i < 10) ? "0" + i : "" + i;
}