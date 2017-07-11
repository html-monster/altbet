using AltBet.Exchange;
using AltBet.Exchange.Managers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using AltBet.Exchange.Utils;

namespace AltBet.Services.WCF
{
    public class UserService : IUserManager
    {
        private User User;
        private AltBet.Exchange.Managers.Authorization UserLogin = new AltBet.Exchange.Managers.Authorization();

        public void Register(Model.User user)
        {
            CommonManager.Server.AddUserRequestMethod(new AddUserRequest
            {
                User = new User
                {
                    UserName = user.NickName,
                    NickName = user.NickName,
                    Password = PasswordManager.CreatePasswordHash(user.NickName, user.Password),
                    Email = user.Email,
                    //FirstName = user.FirstName,
                    //LastName = user.LastName,
                    DateOfBirth = user.DateOfBirth,
                    Country = user.Country,
                    //Address = user.Address,
                    //Phone = user.Phone,
                    Accounts = new List<Account>
                    {
                        new Account
                        {
                            Name = user.NickName,
                            Email = user.Email,
                            Balance = 0,
                            Currency = "USD",
                            Mode = Mode.Basic.ToString().ToLower(),
                            Bettor = false.ToString().ToLower(),
                            Trade = false.ToString().ToLower(),
                            Theme = "dark",
                            MailNews = true.ToString().ToLower(),
                            MailUpdates = true.ToString().ToLower(),
                            MailActivity = true.ToString().ToLower(),
                            MailFrequency = MailFrequency.Daily.ToString().ToLower(),
                            //Currency = ManagementResources.DefaultAccountCurrency
                            TariffPlan = new TariffPlan
                            {
                                BeginTime = DateTime.UtcNow,
                                Name = "empty",
                                Quantity = 0
                            }
                        }
                    }
                }
            });

        }

        public string GetLocation(string ip)
        {
            var ipAddress = IPAddress.None;
            var parseResult = IPAddress.TryParse(ip, out ipAddress);

            var result = string.Empty;

            if (parseResult)
            {
                var city = GeoFromIp.GetCityFromIp(ipAddress);

                result = city == null ? string.Empty : city.Country.IsoCode;

                if (result == "US")
                    result = string.Format("{0}-{1}", result, city.Subdivisions.First().IsoCode);
            }

            return result;
        }

        public AltBet.Exchange.Managers.Authorization Login(string identity, string password, string currentPage, string browser, string ip)
        {
            var response = CommonManager.Server.LoginRequestMethod(new LoginRequest
            {
                Email = identity.Contains("@") ? identity : string.Empty,
                UserName = identity.Contains("@") ? string.Empty : identity,
                Password = PasswordManager.CreatePasswordHash(identity, password),
                UserBrowser = browser,
                UserIp = ip,
                Url = currentPage
            });

            if (response != null)
            {
                var account = response.Accounts.FirstOrDefault();

                switch (response.LoginResult)
                {
                    case LoginResult.OK:
                        UserLogin = new AltBet.Exchange.Managers.Authorization
                        {
                            UserName = account.Name,
                            Error = "",
                            Mode = account.Mode,
                            Bettor = account.Bettor,
                            Trade = account.Trade,
                            Theme = account.Theme
                        };
                        break;
                    case LoginResult.InvalidCredentials:
                        UserLogin = new AltBet.Exchange.Managers.Authorization { UserName = "", Message = "Invalid user" };
                        break;
                    case LoginResult.AlreadyLogged:
                        UserLogin = new AltBet.Exchange.Managers.Authorization { UserName = "", Message = "This user has already logged in" };
                        break;
                    case LoginResult.InternalError:
                        UserLogin = new AltBet.Exchange.Managers.Authorization { UserName = "", Message = "Internal error" };
                        break;
                }
            }
            return UserLogin;
        }

        public void Logout(string username, string browser, string ip)
        {
            CommonManager.Server.LogoutRequestMethod(new LogoutRequest
            {
                UserName = username,
                UserBrowser = browser,
                UserIp = ip
            });
        }

        public User GetUserInfo(string userName)
        {
            return CommonManager.Server.GetUserInfoRequestMethod(new GetUserInfoRequest
            {
                UserName = userName
            });
        }

        public string EditUserTheme(string userName, string theme)
        {
            return CommonManager.Server.EditUserThemeRequestMethod(userName, theme);
        }

        public string EditUserInfo(Model.User user)
        {
            return CommonManager.Server.EditUserInfoRequestMethod(new EditUserRequest
            {
                User = new User
                {
                    UserName = user.NickName,
                    Password = "",
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    DateOfBirth = user.DateOfBirth,
                    Country = user.Country,
                    Address = user.Address,
                    Phone = user.Phone,
                    LastEditedDate = DateTime.UtcNow,
                    Accounts = new List<Account>
                    {
                        new Account
                        {
                            Name = "",
                            Email = "",
                            Balance = 0,
                            Currency = "",
                            TariffPlan = new TariffPlan
                            {
                                BeginTime = DateTime.UtcNow,
                                Name = "empty",
                                Quantity = 0
                            },
                            Mode = user.Mode,
                            Bettor = user.Bettor,
                            Trade = user.Trade,
                            Theme = user.Theme
                        }
                    }
                }
            });
        }

        public string EditPreferences(Model.User user)
        {
            return CommonManager.Server.EditUserPreferencesRequestMethod(new EditUserRequest
            {
                User = new User
                {
                    UserName = user.NickName,
                    Password = "",
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    DateOfBirth = user.DateOfBirth,
                    Country = user.Country,
                    Address = user.Address,
                    Phone = user.Phone,
                    LastEditedDate = DateTime.UtcNow,
                    Accounts = new List<Account>
                    {
                        new Account
                        {
                            Name = "",
                            Email = "",
                            Balance = 0,
                            Currency = "",
                            TariffPlan = new TariffPlan
                            {
                                BeginTime = DateTime.UtcNow,
                                Name = "empty",
                                Quantity = 0
                            },
                            Mode = user.Mode,
                            Bettor = user.Bettor,
                            Trade = user.Trade,
                            Theme = user.Theme,
                            MailNews = user.MailNews,
                            MailUpdates = user.MailUpdates,
                            MailActivity = user.MailActivity,
                            MailFrequency = user.MailFrequency

                        }
                    }
                }
            });
        }

        public ResultObj ChangePassword(string userName, string oldPassword, string newPassword)
        {
            return CommonManager.Server.ChangePasswordRequestMethod(new ChangePasswordRequest
            {
                UserName = userName,
                OldPassword = oldPassword,
                NewPassword = newPassword
            });
        }

        public AltBet.Exchange.Managers.Authorization LoginAdmin(string userName, string password)
        {
            var response = CommonManager.Server.LoginAdminRequestMethod(new LoginRequest
            {
                UserName = userName,
                Password = password
            });

            if (response != null)
            {
                switch (response.AdminLoginResult)
                {
                    case LoginResult.OK:
                        UserLogin = new AltBet.Exchange.Managers.Authorization
                        {
                            UserName = response.User,
                            Error = "200"
                        };
                        break;
                    case LoginResult.InvalidCredentials:
                        UserLogin = new AltBet.Exchange.Managers.Authorization { UserName = "", Message = "Invalid user" };
                        break;
                    case LoginResult.AlreadyLogged:
                        UserLogin = new AltBet.Exchange.Managers.Authorization { UserName = "", Message = "This user has already logged in" };
                        break;
                    case LoginResult.InternalError:
                        UserLogin = new AltBet.Exchange.Managers.Authorization { UserName = "", Message = "Internal error" };
                        break;
                }
            }
            return UserLogin;
        }

        public void LogoutAdmin(string username)
        {
            CommonManager.Server.LogoutAdminRequestMethod(new LogoutRequest
            {
                UserName = username
            });
        }

        public void UnsubscribeMail(string name, string type, string id)
        {
            var password = PasswordManager.CreatePasswordHash(name, "UNSUBSCRIBE");
            if (type == NotificationType.Updates.ToString())
            {
                if (id.Equals(password))
                {
                    EditPreferences(new Model.User { NickName = name, MailUpdates = false.ToString().ToLower() });
                }
            }
            if (type == NotificationType.Activity.ToString())
            {
                if (id.Equals(password))
                {
                    EditPreferences(new Model.User { NickName = name, MailFrequency = MailFrequency.Never.ToString().ToLower() });
                }
            }
            if (type == NotificationType.News.ToString())
            {
                EditPreferences(new Model.User { NickName = name, MailNews = false.ToString().ToLower() });
            }



        }

    }
}
