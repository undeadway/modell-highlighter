using System;
using System.Collections.Generic;
using System.Collections;
using System.Linq;
using System.Text;
using ERP.DataBase;
using ERP.Ent;
using System.Text.RegularExpressions;
using System.Data;
using ESBRequest;
namespace ERP.BLL
{
    public class WorkFlow
    {
        private static string startcode = "_BOF";

        public static string NG = "ng";


        public static string WFPCode = "ProjectCode";

        public static string WFCode = "WFCode";

        public static string WFType = "WFType";

        public static DateTime BusinessAlineDataTime = DateTime.Parse("2017-04-09 23:59:59");


        #region 流程ID号
        /// <summary>
        /// 获取流程ID号
        /// </summary>
        /// <returns></returns>
        public static string GetWorkFlowCode()
        {
            string ret = string.Empty;
            string date = DateTime.Now.ToString("yyyyMMdd");

            object o = ERPWORKFLOWSTAFFINSTANCE.ExecuteScalar(string.Format("", date));
            if (o != null && o.ToString() != "")
            {
                int currentcount = 0;
                string tmp = o.ToString().Substring(8);
                int.TryParse(tmp, out currentcount);
                ret = string.Format("{0}{1}", date, FormatCode(currentcount + 1, 5));
            }
            else
            {
                ret = string.Format("{0}00001", date);
            }
            return ret;
        }
        private static string FormatCode(int aCode, int n)
        {
            StringBuilder stb = new StringBuilder();
            if (aCode.ToString().Length >= n)
            {
                return aCode.ToString();
            }
            else
            {
                for (int i = 0; i < n - aCode.ToString().Length; i++)
                {
                    stb.Append("0");
                }
                return stb.Append(aCode.ToString()).ToString();
            }

        }
        #endregion

        /// <summary>
        /// 
        /// </summary>
        /// <param name="aWFCode"></param>
        /// <returns></returns>
        public static Examine GetDeliveryExamine(string aWFCode)
        {
            Examine deliveryexamine = null;
            IList l = ERPELEVATORSYMBOLDELIVERYEXAMINE.GetList(string.Format(" EESDEWFCODE = '{0}' ", aWFCode));
            if (l != null && l.Count > 0)
            {
                deliveryexamine = l[0] as Examine;
            }
            return deliveryexamine;
        }

        #region 流程辅助类
        public static bool GetWFDecisionCondtion(string aCode, Hashtable aHt)
        {
            switch (aCode)
            {
                //项目相关
                case "hasdlssqqy":
                    if (BLL.Project.ProjectBaseInfo.IsSWDSaler(projectbaseinfo) == (int)Ent.YesNO.No)
                    {
                        if (projectbaseinfo.EPBMYCOMPANYID == projectbaseinfo.EPBMYOPPONENT)
                        {
                            ret = false;
                        }
                        else ret = true;
                    }
                    else
                    {
                        ret = false;
                    }
                    break;
                case "ykq":
                    if (brqy == dsqy)
                    {
                        ret = false;
                    }
                    else ret = true;
                    break;
                case "wkqwaz":
                    if (brqy == dsqy && projectbaseinfo.HasAZ == (int)Ent.YesNO.No)
                    {
                        ret = true;
                    }
                    else ret = false;
                    break;
                default:
                    break;
            }

            foreach (List fbsb in fblist)
            {
                // 拷贝文件
                System.IO.File.Copy(oldFilePath, tmp);
            }
        }
        #endregion
    }

    enum ActionEnum
    {
        [Description(Constants.URL_EXPORTS)]
        EXPORTS,
        [Description(Constants.URL_NEW_BOOK)]
        ADD_BOOKS,
        [Description(Constants.URL_NEW_USER)]
        ADD_USERS,
        [Description(Constants.URL_NEW_ORG)]
        ADD_ORG
    }
}