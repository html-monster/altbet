using AltBet.Exchange.Managers;
using Microsoft.Practices.Unity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.Practices.Unity.Mvc;
using NLog;
using AltBet.ExchangeServices.Services;

namespace AltBet
{
    public class Bootstrapper
    {
        public static IUnityContainer Initialise()
        {
            var container = BuildUnityContainer();
            DependencyResolver.SetResolver(new UnityDependencyResolver(container));
            return container;
        }
        private static IUnityContainer BuildUnityContainer()
        {
            var container = new UnityContainer();
            container.RegisterType<IBalanceManager, BalanceService>();
            container.RegisterType<IOrderManager, OrderService>();
            container.RegisterType<IExchangeManager, ExchangeService>();
            container.RegisterType<IUserManager, UserService>();
            container.RegisterType<ICategoryManager, CategoryService>();
            container.RegisterType<ILogger, Logger>();
            container.RegisterType<IPaymentManager, PaymentService>();
            container.RegisterType<IFileManager, FileService>();
            container.RegisterType<IMailSettingsManager, MailSettingsService>();
            ManagerFactory.MvcUnityContainer.Container = container;
            return container;
        }
    }
}