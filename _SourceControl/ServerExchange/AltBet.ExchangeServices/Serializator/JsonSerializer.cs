using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Threading.Tasks;

namespace AltBet.Exchange.Serializator
{
    class JsonSerializer: ISerializer
    {
        public string Serialize<T>(T obj)
        {
            string result = "";
            var memoryStream = new MemoryStream();
            var serializer = new DataContractJsonSerializer(obj.GetType());

            try
            {
                serializer.WriteObject(memoryStream, obj);
                memoryStream.Position = 0;
                var streamReader = new StreamReader(memoryStream);
                result = streamReader.ReadToEnd();
                streamReader.Dispose();
            }
            catch { }
            finally
            {
                memoryStream.Dispose();
            }
            return result;
        }

        public T Deserialize<T>(string data)
        {
            T result = default(T);
            var memoryStream = new MemoryStream();
            var streamWriter = new StreamWriter(memoryStream);
            try
            {
                streamWriter.Write(data);
                streamWriter.Flush();
                memoryStream.Position = 0;
                var ser = new DataContractJsonSerializer(typeof(T));
                result = (T)ser.ReadObject(memoryStream);
            }
            catch { }
            finally
            {
                memoryStream.Dispose();
                streamWriter.Dispose();
            }
            return result;
        }
    }
}
