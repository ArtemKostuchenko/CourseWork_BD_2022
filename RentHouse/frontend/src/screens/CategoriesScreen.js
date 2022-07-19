import DashboardMenu from "../components/DashboardMenu";
import {deleteCategory,getCategories} from "../api";
import {getUserInfo} from "../localStorage";
import {parseRequestUrl, rerender, showMessage} from "../utils";
//Done
const CategoriesScreen = {
    after_render: () => {
        document.getElementById('createCategoryButton').addEventListener('click', () => {
            document.location.hash = '/createcategory'
        });
        document.getElementById('searchFieldCategory').addEventListener('submit', async (e) => {
            e.preventDefault();
            const searchKeyword = document.getElementById('qUsers').value;
            if(searchKeyword !== ''){
                document.location.hash = `/categories?name=${searchKeyword}`;
            }else {
                document.location.hash = `/categories`;
            }
        });
        const table = document.getElementsByTagName('table');
        const deleteButtonsCategories = document.getElementsByClassName('deleteButton')
        if(deleteButtonsCategories && table){
            for(let i = 0; i < deleteButtonsCategories.length; i++){
                deleteButtonsCategories[i].addEventListener('click', async () => {
                    const deletedCategory = await deleteCategory({idCategory: table[0].children[1].children[i].children[0].innerText});
                    if(deletedCategory.error){
                        showMessage(deletedCategory.error);
                    }else{
                        await rerender(CategoriesScreen);
                    }
                });
            }
        }
    },
    render: async () => {
        const {name, isAdmin} = getUserInfo();
        if (!name || !isAdmin) {
            document.location.hash = '/';
        }
        const {names, values} = parseRequestUrl();
        const categories = await getCategories({names, values})
        return `
        <div class="dashboard">
            ${DashboardMenu.render({selected: 'categories'})}
            <div class="dashboardContent">
                <h1>Категорії</h1>
                <div class="searchDiv">
                 <form class="searchForm"  id="searchFieldCategory">
                    <div class="searchDiv">
                         <input type="text" name="qUsers" id="qUsers" value="" /> 
                         <button type="submit"><i class="fa fa-search"></i></button>
                    </div>
                 </form> 
                </div>
               <button id="createCategoryButton" class="primary">Додати категорію</button>
                <div class="listScreen">
                  <table>
                      <thead>
                         <tr>
                             <th>ID</th>
                             <th>Назва категорії</th>
                             <th class="trAction">Дія</th>
                         </tr>
                    </thead>
                    <tbody>
                        ${ categories.length !== 0 ? categories.map(category => `
                            <tr>
                                <td>${category._id}</td>
                                <td>${category.name}</td>
                                <td style="display: flex;">
                                     <button id="${categories._id}" class="deleteButton">Видалити</button>
                                </td>
                            </tr>
                        `).join('\n') : ``
                       }
                    </tbody>
                  </table>
                </div>
            </div>
        </div>
        `
    }
}

export default CategoriesScreen