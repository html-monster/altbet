using System;
using System.IO;
using System.Web.Mvc;
using AltBet.Admin.Models;
using AltBet.Exchange;
using AltBet.Exchange.Managers;

namespace AltBet.Admin.Controllers
{
    [Authorize]
    public class CategoryController : Controller
    {
        //private readonly ICategoryManager _categoryManager;
        
        public CategoryController()
        {
           //_categoryManager = categoryManager;
        }

        //GET: /Category/
        
        public ActionResult NewCategory(string category)
        {
            try
            {
                if (!string.IsNullOrEmpty(category))
                {
                    var result = new CategoryItem();
                    using (var categoryManagerClient = new CategoryServiceReference.CategoryManagerClient("BasicHttpBinding_ICategoryManager"))
                    {
                        result = categoryManagerClient.GetCategoryByUrl(category);
                    }
                    ViewBag.ParentId = result.CatId; 
                    ViewBag.Category = result.CatName;
                }
                else
                {
                    ViewBag.ParentId = Guid.Empty;
                }
                using (var r = new StreamReader(Server.MapPath("~/Icon.json")))
                {
                    ViewBag.AllIcons = r.ReadToEnd();
                }
            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex);
            }

            return View();
        }
        
        public ActionResult EditCategory(string category)
        {
            var model = new CategoryViewModel();
            try
            {
                var result = new CategoryItem();
                using (var categoryManagerClient = new CategoryServiceReference.CategoryManagerClient("BasicHttpBinding_ICategoryManager"))
                {
                    result = categoryManagerClient.GetCategoryByUrl(category);
                }

                using (var r = new StreamReader(Server.MapPath("~/Icon.json")))
                {
                    ViewBag.AllIcons = r.ReadToEnd();
                }

                model = new CategoryViewModel
                {
                    Id = result.CatId,
                    Name = result.CatName,
                    Url = result.CatUrl,
                    Icon = result.CatIcon
                };
            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex);
            }

           return View(model);
        }

        //CREATE CATEGORY
        public ActionResult AddCategory(CategoryViewModel model)
        {
            var result = "100";
            var catUrl = string.Empty;

            if (ModelState.IsValid)
            {
                try
                {
                    var request = new CategoryRequest
                    {
                        Id = Guid.NewGuid(),
                        Name = model.Name,
                        ParentId = model.ParentId,
                        Url = model.Url.Replace(" ","-").ToLower(),
                        Icon = model.Icon
                    };

                    using (var categoryManagerClient = new CategoryServiceReference.CategoryManagerClient("BasicHttpBinding_ICategoryManager"))
                    {
                        result = categoryManagerClient.CreateCategory(request);
                        catUrl = categoryManagerClient.GetCategoryByUrl(request.Url).CatUrlChain;
                    }
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError(string.Empty, ex);
                }
            }
            return result == "200" ? Json(new { Error = result, Param1 = string.Format("/?path={0}&status=New&ln=last-node", catUrl) }) : Json(new { Error = result });
        }

        //EDIT CATEGORY
        public ActionResult ChangeCategory(CategoryViewModel model)
        {
            var result = "100";
            var catUrl = string.Empty;
            
            if (ModelState.IsValid)
            {
                try
                {
                    var request = new CategoryRequest
                    {
                        Id = model.Id,
                        Name = model.Name,
                        Url = model.Url.Replace(" ", "-").ToLower(),
                        Icon = model.Icon
                    };

                    using (var categoryManagerClient = new CategoryServiceReference.CategoryManagerClient("BasicHttpBinding_ICategoryManager"))
                    {
                        result = categoryManagerClient.EditCategory(request);
                        catUrl = categoryManagerClient.GetCategoryByUrl(request.Url).CatUrlChain;
                    }
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError(string.Empty, ex);
                }
            }
            return result == "200" ? Json(new { Error = result, Param1 = string.Format("/?path={0}", catUrl) }) : Json(new { Error = result });
        }

        //DELETE CATEGORY
        public ActionResult RemoveCategory(string name, Guid categoryId, Guid parentId)
        {
            var result = "100";
            var category = string.Empty;

            try
            {
                using (var categoryManagerClient = new CategoryServiceReference.CategoryManagerClient("BasicHttpBinding_ICategoryManager"))
                {
                    category = parentId != Guid.Empty ? string.Format("/?path={0}", categoryManagerClient.GetCategoryById(parentId).CatUrlChain) : null;
                    result = categoryManagerClient.DeleteCategory(categoryId);
                }
            }
            catch (Exception ex)
            {
                ModelState.AddModelError(string.Empty, ex);
            }

            return result == "200" ? Json(new { Error = result, Param1 = category, Param2 = name }) : Json(new { Error = result });
        }

        //MOVE CATEGORY
        public ActionResult MoveCategory(Guid id, int position)
        {
            var result = "100";
           
            try
            {
                using (var categoryManagerClient = new CategoryServiceReference.CategoryManagerClient("BasicHttpBinding_ICategoryManager"))
                {
                    result = categoryManagerClient.MoveCategory(id, position);
                }
            }
            catch (Exception ex)
            {
                ModelState.AddModelError(string.Empty, ex);
            }

            return Json(new { Error = result});
        }

        // DEBUG ACTION
        public ActionResult TestAction()
        {
           return Json(new { Error = "200" });
        }
    }
}
