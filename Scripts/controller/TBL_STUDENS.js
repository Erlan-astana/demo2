$(function () {

    //Studens-----------

    var rootUrl = "/";
    var app = {};
   
    get_ValueClass();
    cmbx_Class();
    createGrid();
    createWindow();
    button();
    // saveRecord();
    initVars();
    ConvertJsonDateString();

    var CLASS_NAME; 

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

    function initVars() {

        app.paramQuery = {};
        app.paramQuery.filter = 1;

    }

    function button() {

        //button insert ---Қосу
        $('.btn-ins').click(function () {
            get_ValueClass();
            app.editMode = "add";
            setRecord();
            app.modalInstrumentsWindow.open();
        });

        //button save -- Сақтау
        $('.btn-save').click(saveRecord);

        //----өзгерту
        $('.btn-update').click(function () {
            get_ValueClass();
            app.editMode = "edit";
            setEdit();

        });

        // жанарту
        $('.btn-refresh').click(function () {
            GET_TBL_STUDENS_GET();
        })

        //----жою
        $('.btn-del').click(function () {

            var dataItem = app.grid.dataItem(app.grid.select());
            if (dataItem == null) {
                openAlertWindow("Таңдалмады!");
                return;
            }

            openAlertWindow("Шыныменде жойғыңыз келеді ме?", {
                yes: function () {

                    $.post(rootUrl + 'Home/del_TBL_STUDENS', { ID: dataItem.ID },
                        function (data) {
                            if (data.ErrorMessage) {
                                openAlertWindow(data.ErrorMessage);
                            } else {
                                 GET_TBL_STUDENS_GET();
                                app.modalInstrumentsWindow.close();
                            }
                        });

                }
            });

        });

       
    }

    function cmbx_Class() {

        app.cmbx_Class = $('.cmbx_Class').kendoDropDownList({
            dataTextField: "NAME",
            dataValueField: "ID",
            change: function () {
                var dataItem = this.dataItem(this.select());
                console.log("осы жерде cmbx_Class", dataItem.NAME);
                CLASS_NAME = dataItem.NAME;

            }
        }).getKendoDropDownList();


    }

    //таблица грид 
    function createGrid() {

        app.grid = $('#div-grid').kendoGrid({
            dataSource: {
                type: "odata",
                transport: {
                    read: "http://demos.telerik.com/kendo-ui/service/Northwind.svc/Products"
                },
                pageSize: 50
            },         

            height: 400,
            scrollable: true,
            selectable: 'row',
            columns: [
               {
                   field: "FIO",
                   title: "Аты-жөні"
               },

                {
                    field: "LOGIN",
                    title: "Логин"
                },
                        {
                            field: "PASSWORD",
                            title: "Пароль"
                        },

                         {
                             field: "PHONE_NUMBER",
                    title: "Телефон номері"
                },
                        {
                            field: "CLASS_NAME",
                            title: "Класс"
                        }
            ],
            resizable: true
        }).getKendoGrid();

    }
    //окно виндоу моделное окно 
    function createWindow() {

        app.modalInstrumentsWindow = $('.div-studens-window').kendoWindow({
            width: "550px",
            height: "360px",
            title: "Жаңа мәліметтер қосу",
            visible: false,
            modal: true,
            resizable: false,
            draggable: true,
            actions: ["Close"],
            open: function () {

            }
        }).getKendoWindow().center();
    }

    //manderi alip baza jiberedi
    function saveRecord() {
        var dataItem = app.grid.dataItem(app.grid.select());
        app.editObject = dataItem;
        if (app.editMode == "add") {

            $.post(rootUrl + 'Home/insert_TBL_STUDENS', {
                             
                FIO: $('.INP_FIO').val(),               
                LOGIN: $('.INP_LOGIN').val(),
                PASSWORD: $('.INP_PASSWORD').val(),
                PHONE_NUMBER: $('.INP_PHONE_NUMBER').val(),
                CLASS_NAME: CLASS_NAME,


            }, function (data) {
                if (data.ErrorMessage) {
                    openAlertWindow(data.ErrorMessage);

                } else {
                    console.log(data);
                    GET_TBL_STUDENS_GET();
                    app.modalInstrumentsWindow.close();
                }
            });

        } else {
            app.modalInstrumentsWindow.close();
           
            var valCLASS_NAME = "";

            //Модальное окно ашылганда save болмаса update болады
            //if (class_name == null) {
            //    valclass_name = dataitem.class_name;

            //} else { valclass_name=class_name }
            var s = $(".cmbx_Class").val();
           // s2 = JSON.stringify(s);
           //s3= JSON.toString(s2);
            $.post(rootUrl + 'Home/update_TBL_STUDENS', {
                ID: dataItem.ID,
                FIO: $('.INP_FIO').val(),
                LOGIN: $('.INP_LOGIN').val(),
                PASSWORD: $('.INP_PASSWORD').val(),
                PHONE_NUMBER: $('.INP_PHONE_NUMBER').val(),               
                CLASS_NAME: s,

            }, function (data) { // data метод кайтарган данныйлар
                if (data.ErrorMessage) {
                    console.log(data.ErrorMessage);
                } else {

                     GET_TBL_STUDENS_GET();
                    app.modalInstrumentsWindow.close();
                }
            });

        }

    }//

    //запрос на контроллер ,базу данных
    function GET_TBL_STUDENS_GET() {

        $.post(rootUrl + 'Home/GET_TBL_STUDENS_GET', {
        }, function (data) {
            if (data.ErrorMessage) {
                open(data.ErrorMessage);
            } else {

               
                app.grid.dataSource.data(data);
                console.log(data);
            }
        });

    }

    function setRecord() {

        $('.INP_FIO').val(""),
        $('.INP_LOGIN').val(""),
        $('.INP_PASSWORD').val(""),
        $('.INP_PHONE_NUMBER').val(""),
        $('.cmbx_Class').val("");
       



    }

    //update ишинде
    function setEdit() {

        var dataItem = app.grid.dataItem(app.grid.select());
        app.editObject = dataItem;
        if (dataItem == null) {
            openAlertWindow("Объект таңдалмады!");
            return;
        }
      //  string1 = JSON.parse(dataItem.CLASS_NAME);
        $('.INP_FIO').val(dataItem.FIO),
       $('.INP_LOGIN').val(dataItem.LOGIN),
       $('.INP_PASSWORD').val(dataItem.PASSWORD),
       $('.INP_PHONE_NUMBER').val(dataItem.PHONE_NUMBER),
        console.log(dataItem.CLASS_NAME);
        app.cmbx_Clas.value(dataItem.CLASS_NAME),
         //$(".cmbx_Class").value(dataItem.CLASS_NAME),
      
               app.modalInstrumentsWindow.open();

        console.log('[update ишинде dataItem],', dataItem);
    }

   
    function get_ValueClass() {

        $.post(rootUrl + 'Home/get_ValueClass', function (data) {
            if (data.ErrorMessage) {
                openAlertWindow(data.ErrorMessage);
            } else {
                app.cmbx_Class.dataSource.data(data);

            }
        });
    }




});
