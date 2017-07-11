using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace AltBet.ExchangeServices.Utils
{
    internal class PasswordManager
    {
        private static int SaltByteLength = 16;
        private static int DerivedKeyLength = 32;

        public static string CreatePasswordHash(string userName, string password)
        {
            var salt = GenerateSalt(userName);
            var iterationCount = Int16.MaxValue;
            var hashValue = GenerateHashValue(password, salt, iterationCount);
            var iterationCountBtyeArr = BitConverter.GetBytes(iterationCount);
            var valueToSave = new byte[SaltByteLength + DerivedKeyLength + iterationCountBtyeArr.Length];

            Buffer.BlockCopy(salt, 0, valueToSave, 0, SaltByteLength);
            Buffer.BlockCopy(hashValue, 0, valueToSave, SaltByteLength, DerivedKeyLength);
            Buffer.BlockCopy(iterationCountBtyeArr, 0, valueToSave, salt.Length + hashValue.Length, iterationCountBtyeArr.Length);

            return Convert.ToBase64String(valueToSave);
        }

        private static byte[] GenerateRandomSalt()
        {
            var csprng = new RNGCryptoServiceProvider();
            var salt = new byte[SaltByteLength];
            csprng.GetBytes(salt);
            return salt;
        }

        private static byte[] GenerateSalt(string saltBase)
        {
            var stringRepeatcount = Math.Ceiling((decimal)SaltByteLength / saltBase.Length);

            //repeat string until salt length reached
            var configuredSaltBase = String.Concat(Enumerable.Repeat(saltBase, (int)stringRepeatcount)).Substring(0, SaltByteLength);

            //reverse salt string
            var a = configuredSaltBase.ToCharArray();
            Array.Reverse(a);
            configuredSaltBase = new string(a);

            return Encoding.ASCII.GetBytes(configuredSaltBase);
        }

        private static byte[] GenerateHashValue(string password, byte[] salt, int iterationCount)
        {
            byte[] hashValue;
            var valueToHash = string.IsNullOrEmpty(password) ? string.Empty : password;
            using (var crypto = new Rfc2898DeriveBytes(valueToHash, salt, iterationCount))
            {
                hashValue = crypto.GetBytes(DerivedKeyLength);
            }
            return hashValue;
        }
    }
}