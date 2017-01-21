$(function () {

    //JURNAL-----------
    var SUBJECT_ID; var CLASS_NAME; var STUDENS_ID;
    console.log("erlan");
   // alert("erlan");

    var rootUrl = "/";
    var app = {}; 
    get_ValueSubject();
    get_ValueClass();

    createControllers();
    createGrid();
    createWindow();
    button();
    // saveRecord();
    Search();
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
    get_TBL_STUDENS();
    function button() {

        //button insert ---Қосу
        $('.btn-ins').click(function () {

            $('.INP_FIO').removeClass('hide');
            get_TBL_STUDENS();
            app.editMode = "add";
            setRecord();
            app.modalInstrumentsWindow.open();
        });

        //button save -- Сақтау
        $('.btn-save').click(saveRecord);

        //----өзгерту
        $('.btn-update').click(function () {
            $('.INP_FIO').addClass('hide');
            
            app.editMode = "edit";
            setEdit();

        });

        // жанарту
        $('.btn-refresh').click(function () {
            Search();
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

                    $.post(rootUrl + 'Home/Del_Jurnal', { ID: dataItem.ID },
                        function (data) {
                        if (data.ErrorMessage) {
                            openAlertWindow(data.ErrorMessage);
                        } else {
                           // getInstruments();
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
            change: pikcerChange_datePicker
        });

        function pikcerChange_datePicker() {
            var pikcer = $("#datePicker").data('kendoDatePicker');
            var mydate = pikcer.value();
            if (mydate) {

                console.log(mydate);
            }
            return mydate;

        }
                            

        app.cmbx_Subject = $('.cmbx_Subject').kendoDropDownList({
            dataTextField: "NAME",
                dataValueField: "ID",
                change: function () {
                var dataItem = this.dataItem(this.select());
                console.log(dataItem, dataItem.ID);
                SUBJECT_ID = dataItem.ID;
                
            }
        }).getKendoDropDownList();

        app.cmbx_Class = $('.cmbx_Class').kendoDropDownList({
            dataTextField: "NAME",
            dataValueField: "ID",
            change: function () {
                var dataItem = this.dataItem(this.select());
                console.log(dataItem, dataItem.NAME);
                CLASS_NAME = dataItem.NAME;
               
            }
        }).getKendoDropDownList();




        app.INP_FIO = $('.INP_FIO').kendoDropDownList({
            dataTextField: "FIO",
            dataValueField: "ID",
            change: function () {
                var dataItem = this.dataItem(this.select());
                console.log(dataItem, dataItem.ID);
                STUDENS_ID = dataItem.ID;

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
                   field: "FIO",
                   title: "Аты-жөні"
               },
                                
                {
                    field: "DATE",
                    title: "Уақыты"
                },
                        {
                         field: "ASSESSMENT",
                         title: "Бағасы"
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
        var dataItem = app.grid.dataItem(app.grid.select());
        app.editObject = dataItem;
        if (app.editMode == "add") {
           
            $.post(rootUrl + 'Home/insert_Jurnal', {
               
              //  ID: dataItem.ID,
                SUBJECT_ID: SUBJECT_ID,
                CLASS_NAME: CLASS_NAME,
                STUDENS_ID: STUDENS_ID,
               DATE: $('#datePicker').val(),
                ASSESSMENT: $('.INP_ASSESSMENT').val(),
               

            }, function (data) {
                if (data.ErrorMessage) {
                    openAlertWindow(data.ErrorMessage);

                } else {
                    console.log(data);
                  //  getInstruments();
                    app.modalInstrumentsWindow.close();
                }
            });

        } else {
            app.modalInstrumentsWindow.close();

          
            //Модальное окно ашылганда save болмаса update болады
           
            $.post(rootUrl + 'Home/Update_Jurnal', {
                 ID: dataItem.ID,
                SUBJECT_ID: SUBJECT_ID,
                CLASS_NAME: CLASS_NAME,
                STUDENS_ID: dataItem.STUDENS_ID,
                DATE: $('#datePicker').val(),
                ASSESSMENT: $('.INP_ASSESSMENT').val(),
               
            }, function (data) { // data метод кайтарган данныйлар
                if (data.ErrorMessage) {
                    console.log(data.ErrorMessage);
                } else {

                   // getInstruments();
                    app.modalInstrumentsWindow.close();
                }
            });

        }

    }//

    //запрос на контроллер ,базу данных
    //function getInstruments() {
    //    Search();
    //    $.post(rootUrl + 'Home/Search_Method', {
          
    //    }, function (data) {
    //        if (data.ErrorMessage) {
    //            open(data.ErrorMessage);
    //        } else {
                  
    //            app.grid.dataSource.data(data);
    //            console.log(data);
    //        }
    //    });

    //}
   
    function setRecord() {
       
        $('.INP_DATE').val("");
        $('.INP_ASSESSMENT').val("");

      
       
    }

    //update ишинде
    function setEdit() {

        var dataItem = app.grid.dataItem(app.grid.select());
        app.editObject = dataItem;
        if (dataItem == null) {
            openAlertWindow("Объект таңдалмады!");
            return;
        }     

       
       // $('#INP_FIO').val(dataItem.FIO);
       
         $('.INP_DATE').val(dataItem.DATE);
         $('.INP_ASSESSMENT').val(dataItem.ASSESSMENT);
         app.modalInstrumentsWindow.open();

         console.log('[update ишинде dataItem],', dataItem);
    }


    $("#SearchInput_Data").kendoDatePicker({
        start: "month",
        depth: "month",
        format: "yyyy/MM/dd",  //"yyyy.MM.dd"
        change: pikcerChange
    });

    function pikcerChange() {
        var pikcer = $("#SearchInput_Data").data('kendoDatePicker');
        var MyDate = pikcer.value();
        if (MyDate) {

            console.log(MyDate);
        }
        return MyDate;

    }

    function get_ValueSubject() {

        $.post(rootUrl + 'Home/get_ValueSubject', function (data) {
            if (data.ErrorMessage) {
                openAlertWindow(data.ErrorMessage);
            } else {
                app.cmbx_Subject.dataSource.data(data);

            }
        });
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

    function get_TBL_STUDENS() {

        $.post(rootUrl + 'Home/get_TBL_STUDENS',
            {
                CLASS_NAME: CLASS_NAME,
            },
            function (data) {
            if (data.ErrorMessage) {
                openAlertWindow(data.ErrorMessage);
            } else {
                app.INP_FIO.dataSource.data(data);

            }
        });
    }


    //GET_JURNAL
    //----запрос искать по предемету классу и по дате
    function Search() {
        $('.btn-Search').click(function () {
            var valueSubject = SUBJECT_ID; 
            var valueClass = CLASS_NAME;
            var valueData = $("#SearchInput_Data").val();       
            
            $.post(rootUrl + 'Home/Search_Method', {
                ValueSubject: valueSubject,
                ValueClass: valueClass,
                ValueData: valueData,
         
            }, function (data) {
                if (data.ErrorMessage) {
                    openAlertWindow(data.ErrorMessage);

                } else {
                    console.log(data);
                    app.grid.dataSource.data(data);
                }
            });


        });

    }



});
