using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Text;
using System.Web;

namespace AltBet.Exchange.Managers
{
    [ServiceContract]
    public interface IFileManager
    {
        [OperationContract]
        UploadedImageInfo SaveImage(HttpPostedFileBase file, string filePath, string fileName, string domainName);

        [OperationContract]
        int DeleteImage(string filePath);

        [OperationContract]
        List<UploadedImageInfo> UsersImages(string dirPath, string urlTemplate);
    }
}
