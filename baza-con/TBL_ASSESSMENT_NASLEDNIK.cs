using schoolDbMvc.baza_con;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace schoolDbMvc.baza_con
{
    public class TBL_ASSESSMENT_NASLEDNIK : TBL_ASSESSMENT
    {
        public int ID { get; set; }
        public string FIO { get; set; }
        public string CLASS_NAME { get; set; }

    }
}