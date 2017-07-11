using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AltBet.Exchange.Managers
{
    public class CategoryManager:ICategoryManager
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
