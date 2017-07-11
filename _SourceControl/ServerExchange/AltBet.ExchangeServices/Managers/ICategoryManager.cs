using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Text;
using System.Threading.Tasks;

namespace AltBet.Exchange.Managers
{
    [ServiceContract]
    public interface ICategoryManager
    {
        [OperationContract]
        string CreateCategory(CategoryRequest request);

        [OperationContract]
        string EditCategory(CategoryRequest request);

        [OperationContract]
        string DeleteCategory(Guid id);

        [OperationContract]
        string MoveCategory(Guid id, int position);

        [OperationContract]
        List<CategoryItem> GetAllCategoryItem();

        [OperationContract]
        CategoryItem GetCategoryByUrl(string category);

        [OperationContract]
        CategoryItem GetCategoryByUrlChain(string path);

        [OperationContract]
        CategoryItem GetCategoryById(Guid id);
    }
}
