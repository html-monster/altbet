using AltBet.Exchange;
using AltBet.Exchange.Managers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;

namespace AltBet.Services.WCF
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "CategoryService" in code, svc and config file together.
    // NOTE: In order to launch WCF Test Client for testing this service, please select CategoryService.svc or CategoryService.svc.cs at the Solution Explorer and start debugging.
    public class CategoryService : ICategoryManager
    {
        public string CreateCategory(CategoryRequest request)
        {
            return CommonManager.Server.CreateCategoryRequestMethod(request);
        }

        public string EditCategory(CategoryRequest request)
        {
            return CommonManager.Server.EditCategoryRequestMethod(request);
        }

        public string DeleteCategory(Guid id)
        {
            return CommonManager.Server.DeleteCategoryRequestMethod(id);
        }

        public string MoveCategory(Guid id, int position)
        {
            return CommonManager.Server.MoveCategoryRequestMethod(id, position);
        }

        public List<CategoryItem> GetAllCategoryItem()
        {
            return CommonManager.Server.GetAllCategoryRequestMethod();
        }

        public CategoryItem GetCategoryByUrl(string category)
        {
            //refactoring
            var result = GetAllCategoryItem().FirstOrDefault(c => c.CatUrl == category);

            return result;
        }

        public CategoryItem GetCategoryByUrlChain(string path)
        {
            //refactoring
            var result = GetAllCategoryItem().FirstOrDefault(c => c.CatUrlChain == path);

            return result;
        }

        public CategoryItem GetCategoryById(Guid id)
        {
            //refactoring
            var result = GetAllCategoryItem().FirstOrDefault(c => c.CatId == id);

            return result;
        }
    }
}
