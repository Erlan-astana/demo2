(function ($) {

    var shade = "#";

    $.fn.greenify = function () {
        this.css("color", shade);
        return this;
    };

    $.fn.kb = function () {
        return this.kendoButton().data('kendoButton');
    };

    $.fn.kdp = function () {
        return this.kendoDatePicker().data('kendoDatePicker');
    };

    $.fn.kw = function (o) {
        return this.kendoWindow(o).data('kendoWindow');
    };
}(jQuery));