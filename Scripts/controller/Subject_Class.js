$(function () {

    //ctrl + g ---поиск переход на строку 
    //Subject_Class-----
    
    var rootUrl = "/";
    var app = {}; 
      
    get_ValueSubject();
    get_ValueClass();
  
    subject_createGrid();
    subject_window();
    //subject_saveRecord();
    class_createGrid();
    class_window();
    // class_saveRecord();
    button();
    

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

    function button() {

        //button insert ---Қосу
        $('.btn_ins_sub').click(function () {                             
           
            app.subject_window.open();
        });
        $('.btn_ins_cl').click(function () {
               app.class_window.open();
        });

        //button save -- Сақтау
        $('.btn_save_sub').click(subject_saveRecord);
        $('.btn_save_cl').click(class_saveRecord);


        // жанарту
        $('.btn_refresh_sub').click(function () {
            get_ValueSubject();
        });
        $('.btn_refresh_cl').click(function () {
            get_ValueClass();
        });

      //  ----жою
        $('.btn_del_sub').click(function () {

            var dataItem = app.grid_subject.dataItem(app.grid_subject.select());
            if (dataItem == null) {
                openAlertWindow("Таңдалмады!");
                return;
            }

            openAlertWindow("Шыныменде жойғыңыз келеді ме?", {
                yes: function () {

                    $.post(rootUrl + 'Home/del_subject', { ID: dataItem.ID },
                        function (data) {
                            if (data.ErrorMessage) {
                                openAlertWindow(data.ErrorMessage);
                            } else {
                                 get_ValueSubject();
                                 app.subject_window.close();
                            }
                        });

                }
            });

        });
        $('.btn_del_cl').click(function () {

            var dataItem = app.grid_class.dataItem(app.grid_class.select());
            if (dataItem == null) {
                openAlertWindow("Таңдалмады!");
                return;
            }

            openAlertWindow("Шыныменде жойғыңыз келеді ме?", {
                yes: function () {

                    $.post(rootUrl + 'Home/del_class', { ID: dataItem.ID },
                        function (data) {
                            if (data.ErrorMessage) {
                                openAlertWindow(data.ErrorMessage);
                            } else {
                                get_ValueSubject();
                                app.class_window.close();
                            }
                        });

                }
            });

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
       
    function subject_createGrid() {

        app.grid_subject = $('#div_grid_subject').kendoGrid({
            dataSource: {
                type: "odata",
                transport: {
                    read: "http://demos.telerik.com/kendo-ui/service/Northwind.svc/Products"
                },
                pageSize: 100
            },          
           
            height: 400,
            scrollable: true,
            selectable: 'row',
            columns: [
               {
                   field: "NAME",
                   title: "Пән-аты"
               }

               
            ],
            resizable: true
        }).getKendoGrid();

    }
    function subject_window() {

        app.subject_window = $('.div_subject_window').kendoWindow({
            width: "350px",
            height: "260px",
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

    function subject_saveRecord() {
        var dataItem = app.grid_subject.dataItem(app.grid_subject.select());
        app.editObject = dataItem;

        $.post(rootUrl + 'Home/insert_subject', {

            val_subject: $(".INP_NEW_SUBJECT").val(),
        },
                  function (data) {
                      if (data.ErrorMessage) {
                          openAlertWindow(data.ErrorMessage);

                      } else {
                          console.log(data);                                                 
                         
                          get_ValueSubject();
                          subject_clean();
                          app.subject_window.close();
                      }
                  });

    }

    function get_ValueSubject() {

        $.post(rootUrl + 'Home/get_ValueSubject', function (data) {
            if (data.ErrorMessage) {
                openAlertWindow(data.ErrorMessage);
            } else {
                app.grid_subject.dataSource.data(data);

            }
        });
    }
    function subject_clean() {

        $('.INP_NEW_SUBJECT').val("");
       
    }
    
    
    function class_createGrid() {

        app.grid_class = $('#div_grid_class').kendoGrid({
            dataSource: {
                type: "odata",
                transport: {
                    read: "http://demos.telerik.com/kendo-ui/service/Northwind.svc/Products"
                },
                pageSize: 100
            },

            height: 400,
            scrollable: true,
            selectable: 'row',
            columns: [
               {
                   field: "NAME",
                   title: "Пән-аты"
               }


            ],
            resizable: true
        }).getKendoGrid();

    }
    
    function class_window() {

        app.class_window = $('.div_class_window').kendoWindow({
            width: "350px",
            height: "260px",
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
    function class_saveRecord() {
           

            $.post(rootUrl + 'Home/insert_class', {
                val_class: $(".INP_NEW_CLASS").val(),

            }, function (data) {
                if (data.ErrorMessage) {
                    openAlertWindow(data.ErrorMessage);
                }  else {
                   
                    get_ValueClass();
                    class_clean();
                    app.class_window.close();
                }
                
            });        

        }

    
    function class_clean() {

        $('.INP_NEW_CLASS').val("");
    }

    function get_ValueClass() {

        $.post(rootUrl + 'Home/get_ValueClass', function (data) {
            if (data.ErrorMessage) {
                openAlertWindow(data.ErrorMessage);
            } else {
                app.grid_class.dataSource.data(data);

            }
        });
    }


});
