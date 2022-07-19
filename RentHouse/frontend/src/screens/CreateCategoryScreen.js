import {createCategory} from "../api";
import {getUserInfo} from "../localStorage";
import {hideLoading, showLoading, showMessage} from "../utils";
//Done
const CreateCategory = {
    after_render: () => {
        document.getElementById("createCategoryForm").addEventListener('submit', async function (e) {
            e.preventDefault();
            showLoading();
            const data = await createCategory({
                name: document.getElementById('name').value,
            });
            hideLoading();
            if(data.error){
                showMessage(data.error);
            }else{
                document.location.hash = `/categories`
            }
        });
    },
    render: () => {
        const {name, isAdmin} = getUserInfo();
        if(!name || !isAdmin){
            document.location.hash = '/';
        }
        return `
        <div class="form-container">
            <form id="createCategoryForm" enctype="multipart/form-data">
              <ul class="formItems">
                 <li>
                    <h1>Додавання категорії</h1>
                 </li>
                 <li class="">
                    <label for="name">Назва</label>
                    <input type="text" name="name" id="name"/>
                 </li> 
                 <li>
                    <button type="submit" class="primary">Додати</button>
                 </li>
              </ul>
            </form>
        </div>
        `
    }
}

export default CreateCategory;