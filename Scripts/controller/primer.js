$(function () {
    var rootUrl = "/";
    var app = {};
    createControllers();
    createGrid();
    createWindow();
    button();
    // saveRecord();
    initVars();
    ConvertJsonDateString();
   

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

        //button insert қосу
        $('.btn-ins').click(function () {

            app.editMode = "add";
            setRecord();
            app.modalInstrumentsWindow.open();
        });

        //button save -- window
        $('.btn-save').click(saveRecord);

        //----өзгерту
        $('.btn-update').click(function () {

            app.editMode = "edit";
            setEdit();

        });

        // жанарту
        $('.btn-refresh').click(function () {
            getInstruments();
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

                    $.post(rootUrl + 'Home/PRIMERdelInstruments', { id: dataItem.id }, function (data) {
                        if (data.ErrorMessage) {
                            openAlertWindow(data.ErrorMessage);
                        } else {
                            getInstruments();
                            app.modalInstrumentsWindow.close();
                        }
                    });

                }
            });

        });

        //-----excel
        $('.btn-excel').click(function () {
            console.log("excel");

            app.grid.saveAsExcel();

        });
    }

    function createControllers() {

        //app.dtBirth = $('#datePicker').kendoDatePicker({
        //    value: new Date(),
        //    format: "dd.MM.yyyy"//"yyyy.MM.dd"
        //}).data('kendoDatePicker');
       
        $("#datePicker").kendoDatePicker({
            start: "month",
            depth: "month",
            format: "yyyy/MM/dd",  //"yyyy.MM.dd"
            change: pikcerChange
        });
       
        function pikcerChange () {
            var pikcer = $("#datePicker").data('kendoDatePicker');
            var mydate = pikcer.value();
            if (mydate) {

                console.log(mydate);
            }
            return mydate;
            
        }
      


        app.cmbxMeasure = $('.cmbx-measure').kendoDropDownList({
            dataTextField: "NAME",
            dataValueField: "ID",
            change: function () {
                var dataItem = this.dataItem(this.select());
            }
        }).getKendoDropDownList();

        //----филтер
        app.cmbxFilter = $('.cmbx-filter').kendoComboBox({
            dataSource: [{ ID: 1, NAME: "Барлығы" }, { ID: 2, NAME: "Қолдансытағы құралдар" }, { ID: 3, NAME: "Бұзылған құралдар" }, { ID: 4, NAME: 'Қолданыста емес құралдар' }],
            dataTextField: "NAME",
            dataValueField: "ID",
            change: function () {
                var dataItem = this.dataItem(this.select());
                app.paramQuery.filter = dataItem.ID;
                getInstruments();

            }
        }).data('kendoComboBox');


    }

    //таблица грид 
    function createGrid() {

        app.grid = $('#div-grid').kendoGrid({
            dataSource: {
                type: "odata",
                transport: {
                    read: "http://demos.telerik.com/kendo-ui/service/Northwind.svc/Products"
                },
                pageSize: 100
            },
            excel: {
                fileName: "Kendo UI Grid Export.xlsx"
            },
            pdf: {
                allPages: true,
                avoidLinks: true,
                paperSize: "A4",
                margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
                landscape: true,
                repeatHeaders: true,
                template: $("#page-template").html(),
                scale: 0.8
            },

            height: 400,
            scrollable: true,
            selectable: 'row',
            columns: [
               {
                   field: "name",
                   title: "Аты"
               },
                {
                    field: "surname",
                    title: "Тегі"
                }, {
                    field: "assessment",
                    title: "Бағасы"
                },
                 {
                     field: "theAssessment",
                   title: "Уақыт"
               },
                {
                    field: "classes",
                    title: "Класс"
                }
            ],
            resizable: true
        }).getKendoGrid();

    }
    //окно виндоу моделное окно 
    function createWindow() {

        app.modalInstrumentsWindow = $('.div-instruments-window').kendoWindow({
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

        if (app.editMode == "add") {

            $.post(rootUrl + 'Home/insertPRIMER', {
                name: $('.inp-name').val(),
                surname: $('.inp-surname').val(),
                assessment: $('.inp-assessment').val(),
                theAssessment:$("#datePicker").val(), // $('.inp-theAssessment').val(),
                classes: $('.inp-classes').val(),
             

            }, function (data) {
                if (data.ErrorMessage) {
                    openAlertWindow(data.ErrorMessage);

                } else {
                    console.log(data);
                    getInstruments();
                    app.modalInstrumentsWindow.close();
                }
            });
            
        } else {
            app.modalInstrumentsWindow.close();
            console.log("id:", app.editObject.ID);
            //Модальное окно ашылганда save болмаса update болады

            $.post(rootUrl + 'Home/PRIMERupdateInstruments', {
                id: app.editObject.id,
                name: $('.inp-name').val(),
                surname: $('.inp-surname').val(),
                assessment: $('.inp-assessment').val(),
                theAssessment: $("#datePicker").val(),
                classes: $('.inp-classes').val(),
            }, function (data) { // data метод кайтарган данныйлар
                if (data.ErrorMessage) {
                    console.log(data.ErrorMessage);
                } else {

                    getInstruments();
                    app.modalInstrumentsWindow.close();
                }
            });

        }

    }//

    //запрос на контроллер ,базу данных
    function getInstruments() {

        $.post(rootUrl + 'Home/PRIMERgetInstruments', {
            filter: app.paramQuery.filter
        }, function (data) {
            if (data.ErrorMessage) {
                open(data.ErrorMessage);
            } else {

                //data = JSON.parse(data);
                $.map(data, function (item) {

                    //item.NAME = ConvertJsonDateString(item.NAME);
                    //item.AGE = parseInt(item.AGE);
                    //item.CITY = ConvertJsonDateString(item.CITY);
                });



               
                app.grid.dataSource.data(data); 
                console.log(data);
            }
        });

    }

    //val=пустой кылу
    function setRecord() {
        $('.inp-name').val('');
        $('.inp-surname').val('');
        $('.inp-assesment').val('');
        $('.inp-theAssessment').val('');
        $('.inp-classes').val('');

      

    }

    //update ишинде
    function setEdit() {

        var dataItem = app.grid.dataItem(app.grid.select());
        app.editObject = dataItem;
        if (dataItem == null) {
            openAlertWindow("Объект таңдалмады!");
            return;
        }

        app.modalInstrumentsWindow.open();

        //app.cmbxMeasure.value(dataItem.id);
        $('.inp-name').val(dataItem.name);
        $('.inp-surname').val(dataItem.surname);
        $('.inp-assessment').val(dataItem.assessment);
        $('#datePicker').val(dataItem.theAssessment);
        $('.inp-classes').val(dataItem.classes);
       
        console.log('[dataItem],', dataItem, dataItem.id, app);
    }

 
   
    $('.btn-Search').click(function () {
        var value = $('.SearchInput').val();
        $.post(rootUrl + 'Home/Search_Method', {
            SearchString: value,


        }, function (data) {
            if (data.ErrorMessage) {
                openAlertWindow(data.ErrorMessage);

            } else {
                console.log(data);
                app.grid.dataSource.data(data);
            }
        });
    });
   
   
});
