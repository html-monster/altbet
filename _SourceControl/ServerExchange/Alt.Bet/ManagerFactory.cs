using Microsoft.Practices.Unity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace AltBet
{
    public class ManagerFactory : DefaultControllerFactory
    {

        protected override IController GetControllerInstance(RequestContext requestContext, Type controllerType)
        {
            try
            {
                if (controllerType == null)
                    //base.GetControllerInstance(requestContext, controllerType);
                    throw new ArgumentNullException("Controller type cannot be null");

                if (!typeof(IController).IsAssignableFrom(controllerType))
                    throw new ArgumentException(string.Format("Type requested is not a controller: {0}", controllerType.Name), "controllerType");

                return MvcUnityContainer.Container.Resolve(controllerType) as IController;
            }
            catch (Exception ex)
            {
                throw;
            }

        }

        public static class MvcUnityContainer
        {
            public static UnityContainer Container { get; set; }
        }
    }
}