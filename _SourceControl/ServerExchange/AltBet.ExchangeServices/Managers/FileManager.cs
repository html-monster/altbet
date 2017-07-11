//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;
//using System.Web;
//using System.IO;

//namespace AltBet.Exchange.Managers
//{
//    public class FileManager : IFileManager
//    {
//        string[] mimeImagetypes = new string[] { "image/jpeg", "image/pjpeg", "image/png" };

//        public List<UploadedImageInfo> UsersImages(string dirPath, string urlTemplate)
//        {
            
//            List<UploadedImageInfo> images = new List<UploadedImageInfo>();
//            DirectoryInfo directory = new DirectoryInfo(dirPath);
//            if(directory.Exists == true)
//            {
//                FileInfo[] files = directory.GetFiles();
//                foreach(FileInfo file in files)
//                {
//                    images.Add(new UploadedImageInfo
//                    {
//                        Name = file.Name,
//                        Length = (int)file.Length,
//                        ContentType = MimeMapping.GetMimeMapping(file.Name),
//                        ErrorCode = 200,
//                        Url = string.Format("{0}/{1}", urlTemplate, file.Name)
//                    });
//                }
//            }
//            return images;
//        }
//        public int DeleteImage(string filePath)
//        {
//            int result = 200;
//            File.Delete(filePath);
//            if(File.Exists(filePath))
//            {
//                result = 100;
//            }

//            return result;
//        }

//        public UploadedImageInfo SaveImage(HttpPostedFileBase file, string filepath, string fileName, string url)
//        {
//            string errorMessage = string.Empty;
//            int errorCode = 200;
//            if(file != null)
//            {
//                if(mimeImagetypes.Contains(file.ContentType) == true)
//                {
//                    if (file.ContentLength < 2000000)
//                    {
//                        file.SaveAs(filepath);
//                        if (File.Exists(filepath) == false)
//                        {
//                            errorMessage = "File has not been saved";
//                            errorCode = 103;
//                        }
//                    }
//                    else
//                    {
//                        errorMessage = "File size more than 500 kB";
//                        errorCode = 102;
//                    }
//                }
//                else
//                {
//                    errorMessage = "incorrect MIME type";
//                    errorCode = 101;
//                }
//            }
//            else
//            {
//                errorMessage = "File null";
//                errorCode = 100;
//            }

//            if (errorMessage != string.Empty)
//            {
//                return new UploadedImageInfo
//                {
//                    ErrorMessage = errorMessage,
//                    ErrorCode = errorCode
//                };
//            }

//            return new UploadedImageInfo
//            {
//                Name = fileName,
//                Url = url,
//                ContentType = file.ContentType,
//                Length = file.ContentLength,
//                ErrorCode = errorCode
//            };
            
//        }
//    }
//}
