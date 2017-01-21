using schoolDbMvc.baza_con;
using System;using schoolDbMvc.baza_con;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;


namespace schoolDbMvc.Controllers
{
    public class HomeController : Controller
    {


        COPI_15_12_16Entities2 con = new COPI_15_12_16Entities2();

        public ActionResult Index()
        {
            ViewBag.Message = "Modify this template to jump-start your ASP.NET MVC application.";

            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your app description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }


        public ActionResult primer()
        {
           

            return View();
        }
      
        public ActionResult Search_Method(int ValueSubject,string ValueClass,string ValueData)
        {

            Dictionary<string, object> list = new Dictionary<string, object>();
            try
            {
                string SqlZapros = "";
                if (ValueData == "") {

                    SqlZapros = "SELECT TBL_ASSESSMENT.ID, TBL_ASSESSMENT.SUBJECT_ID , TBL_ASSESSMENT.STUDENS_ID,TBL_ASSESSMENT.DATE , TBL_ASSESSMENT.ASSESSMENT,  TBL_ASSESSMENT.CLASS_NAME  ,TBL_STUDENS.ID,TBL_STUDENS.FIO, TBL_STUDENS.CLASS_NAME FROM  TBL_ASSESSMENT INNER JOIN TBL_STUDENS ON  TBL_ASSESSMENT.STUDENS_ID =  TBL_STUDENS.ID WHERE TBL_ASSESSMENT.SUBJECT_ID LIKE '" +
                         ValueSubject + "' AND TBL_ASSESSMENT.CLASS_NAME  LIKE '" + ValueClass + "' ";
                }
                else
                {
                    SqlZapros = "SELECT  TBL_ASSESSMENT.ID, TBL_ASSESSMENT.SUBJECT_ID ,TBL_ASSESSMENT.STUDENS_ID, TBL_ASSESSMENT.DATE , TBL_ASSESSMENT.ASSESSMENT,  TBL_ASSESSMENT.CLASS_NAME  ,TBL_STUDENS.ID,TBL_STUDENS.FIO, TBL_STUDENS.CLASS_NAME FROM  TBL_ASSESSMENT INNER JOIN TBL_STUDENS ON  TBL_ASSESSMENT.STUDENS_ID =  TBL_STUDENS.ID WHERE TBL_ASSESSMENT.SUBJECT_ID LIKE '" +
                         ValueSubject + "' AND TBL_ASSESSMENT.CLASS_NAME  LIKE '" + ValueClass + "' AND TBL_ASSESSMENT.DATE LIKE '" + ValueData + "'";
          
                }
                var items = con.Database.SqlQuery<TBL_ASSESSMENT_NASLEDNIK>(SqlZapros).ToList();
                return Json(items);

                
            }
            catch (Exception e)
            {

                list["errorMessage"] = e.Message;
                return Json(list);
            }

           
        }

        public ActionResult Student()
        {

            return View();
        }

        public ActionResult Subject_Class()
        {

            return View();
        }

        public ActionResult JURNAL()
        {

            return View();
        }

        public ActionResult insert_Jurnal(int SUBJECT_ID, string CLASS_NAME, int STUDENS_ID, string DATE, string ASSESSMENT)
        {
            Dictionary<string, object> list = new Dictionary<string, object>();

            try
            {

                var Jurnal_new = new TBL_ASSESSMENT()
                {
                    
                    SUBJECT_ID = SUBJECT_ID,
                    STUDENS_ID = STUDENS_ID,
                    CLASS_NAME = CLASS_NAME,
                    DATE = DATE,
                    ASSESSMENT = ASSESSMENT

                   
                };

                con.TBL_ASSESSMENT.Add(Jurnal_new);           
                con.SaveChanges();

                list["ok"] = "Сәтті сақталды";
                list["errorMessage"] = null;
            }
            catch (Exception e)
            {

                list["errorMessage"] = e.Message;
            }

            return Json(list);
        }

        public ActionResult Update_Jurnal(int ID, int SUBJECT_ID, string CLASS_NAME, int STUDENS_ID, string DATE, string ASSESSMENT)
        {
            Dictionary<string, object> list = new Dictionary<string, object>();
            try
            {
                
                var record = con.TBL_ASSESSMENT.Find(ID);
                record.SUBJECT_ID = SUBJECT_ID;
                record.CLASS_NAME = CLASS_NAME;
                record.STUDENS_ID = STUDENS_ID;
                record.DATE = DATE;
                record.ASSESSMENT = ASSESSMENT;
               


                con.Entry(record).State = System.Data.EntityState.Modified;
                con.SaveChanges();

                list["ok"] = "Сәтті өзгертілді";
                list["errorMessage"] = null;
            }
            catch (Exception e)
            {

                list["errorMessage"] = e.Message;
            }

            return Json(list);
        }

        public ActionResult Del_Jurnal(int ID)
        {

            Dictionary<string, object> list = new Dictionary<string, object>();
            try
            {
                var row = con.TBL_ASSESSMENT.Find(ID);
                con.TBL_ASSESSMENT.Remove(row);
                int cnt = con.SaveChanges();

                con.SaveChanges();

                list["ok"] = "Сәтті сақталды";
                list["errorMessage"] = null;
            }
            catch (Exception e)
            {

                list["errorMessage"] = e.Message;
            }

            return Json(list);
        }

        public ActionResult get_ValueSubject()
        {

            try
            {
                string sqlQuery = "select * from TBL_SUBJECT ";
                var items = con.Database.SqlQuery<TBL_SUBJECT>(sqlQuery).ToList();
                return Json(items);
            }
            catch (Exception ex)
            {
                Dictionary<string, object> list = new Dictionary<string, object>();
                list["ErrorMessage"] = ex.Message;
                return Json(list);
            }
        }

        public ActionResult get_ValueClass()
        {

            try
            {
                string sqlQuery = "select * from TBL_CLASS ";
                var items = con.Database.SqlQuery<TBL_CLASS>(sqlQuery).ToList();
                return Json(items);
            }
            catch (Exception ex)
            {
                Dictionary<string, object> list = new Dictionary<string, object>();
                list["ErrorMessage"] = ex.Message;
                return Json(list);
            }
        }

        public ActionResult get_TBL_STUDENS(string CLASS_NAME)
        {

            try
            {
                string sqlQuery = "SELECT*FROM TBL_STUDENS WHERE CLASS_NAME LIKE '" + CLASS_NAME + "' ";
                var items = con.Database.SqlQuery<TBL_STUDENS>(sqlQuery).ToList();
                return Json(items);
            }
            catch (Exception ex)
            {
                Dictionary<string, object> list = new Dictionary<string, object>();
                list["ErrorMessage"] = ex.Message;
                return Json(list);
            }
        }

        public ActionResult insert_subject(string val_subject) {
            Dictionary<string, object> list = new Dictionary<string, object>();

            try
            {
                var subject_new = new TBL_SUBJECT()
                {
                    NAME = val_subject,
                };

                con.TBL_SUBJECT.Add(subject_new);
                con.SaveChanges();

                list["ok"] = "Сәтті сақталды";
                list["errorMessage"] = null;
            }
            catch (Exception e)
            {

                list["errorMessage"] = e.Message;
            }

            return Json(list);
        
        }
        public ActionResult insert_class(string val_class)
        {
            Dictionary<string, object> list = new Dictionary<string, object>();

            try
            {
                var class_new = new TBL_CLASS()
                {
                    NAME = val_class,
                };

                con.TBL_CLASS.Add(class_new);
                con.SaveChanges();

                list["ok"] = "Сәтті сақталды";
                list["errorMessage"] = null;
            }
            catch (Exception e)
            {

                list["errorMessage"] = e.Message;
            }

            return Json(list);

        }
        public ActionResult del_subject(int ID)
        {

            Dictionary<string, object> list = new Dictionary<string, object>();
            try
            {
                var row = con.TBL_SUBJECT.Find(ID);
                con.TBL_SUBJECT.Remove(row);
                int cnt = con.SaveChanges();

                con.SaveChanges();

                list["ok"] = "Сәтті сақталды";
                list["errorMessage"] = null;
            }
            catch (Exception e)
            {

                list["errorMessage"] = e.Message;
            }

            return Json(list);
        }

        public ActionResult del_class(int ID)
        {

            Dictionary<string, object> list = new Dictionary<string, object>();
            try
            {
                var row = con.TBL_CLASS.Find(ID);
                con.TBL_CLASS.Remove(row);
                int cnt = con.SaveChanges();

                con.SaveChanges();

                list["ok"] = "Сәтті сақталды";
                list["errorMessage"] = null;
            }
            catch (Exception e)
            {

                list["errorMessage"] = e.Message;
            }

            return Json(list);
        }
        
        public ActionResult TBL_STUDENS()
        {
           
            return View();
        }
        public ActionResult insert_TBL_STUDENS(string FIO, string LOGIN, string PASSWORD, int PHONE_NUMBER, string CLASS_NAME)
        {
            Dictionary<string, object> list = new Dictionary<string, object>();

            try
            {

                var NEW_TBL_STUDENS = new TBL_STUDENS()
                {

                 CDATE=DateTime.Now,
                    FIO= FIO ,               
                LOGIN= LOGIN,
                PASSWORD=PASSWORD,
                PHONE_NUMBER= PHONE_NUMBER,
                CLASS_NAME=CLASS_NAME,


                };

                con.TBL_STUDENS.Add(NEW_TBL_STUDENS);
                con.SaveChanges();

                list["ok"] = "Сәтті сақталды";
                list["errorMessage"] = null;
            }
            catch (Exception e)
            {

                list["errorMessage"] = e.Message;
            }

            return Json(list);
        }

        public ActionResult GET_TBL_STUDENS_GET()
        {

            try
            {
                string sqlQuery = "select * from TBL_STUDENS ";
                var items = con.Database.SqlQuery<TBL_STUDENS>(sqlQuery).ToList();
                return Json(items);
            }
            catch (Exception ex)
            {
                Dictionary<string, object> list = new Dictionary<string, object>();
                list["ErrorMessage"] = ex.Message;
                return Json(list);
            }
        }

        public ActionResult update_TBL_STUDENS(int ID,string FIO, string LOGIN, string PASSWORD, int PHONE_NUMBER, string CLASS_NAME)
        {
            Dictionary<string, object> list = new Dictionary<string, object>();
            try
            {
                //var user = Session["UserInfo"] as TBLPERS;
                //var teacherId = user.ID;

                var record = con.TBL_STUDENS.Find(ID);
                record.UDATE = DateTime.Now;
                record.FIO = FIO;
                record.PHONE_NUMBER = PHONE_NUMBER;
                record.CLASS_NAME = CLASS_NAME;               
                record.LOGIN = LOGIN;
                record.PASSWORD = PASSWORD;



                con.Entry(record).State = System.Data.EntityState.Modified;
                con.SaveChanges();

                list["ok"] = "Сәтті өзгертілді";
                list["errorMessage"] = null;
            }
            catch (Exception e)
            {

                list["errorMessage"] = e.Message;
            }

            return Json(list);
        }

        public ActionResult del_TBL_STUDENS(int ID)
        {

            Dictionary<string, object> list = new Dictionary<string, object>();
            try
            {
                var row = con.TBL_STUDENS.Find(ID);
                con.TBL_STUDENS.Remove(row);
               // int cnt = con.SaveChanges();

                con.SaveChanges();

                list["ok"] = "Сәтті сақталды";
                list["errorMessage"] = null;
            }
            catch (Exception e)
            {

                list["errorMessage"] = e.Message;
            }

            return Json(list);
        }





    }
}
