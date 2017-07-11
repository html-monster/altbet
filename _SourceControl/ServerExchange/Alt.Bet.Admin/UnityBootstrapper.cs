using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AltBet.Admin.Managers;
using AltBet.Exchange.Managers;
using Microsoft.Practices.Unity;
using Microsoft.Practices.Unity.Mvc;

namespace AltBet.Admin
{
    public class UnityBootstrapper
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
            container.RegisterType<IFeedManager, FeedManager>();
            UnityControllerFactory.MvcUnityContainer.Container = container;
            return container;
        }
    }
}