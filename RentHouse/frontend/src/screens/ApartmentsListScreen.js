import DashboardMenu from "../components/DashboardMenu";
import {getApartments, getCategories} from "../api";
import {getUserInfo} from "../localStorage";
import {parseRequestUrl} from "../utils";
//Done
const ApartmentsListScreen = {
    after_render: () => {
        document.getElementById('createApartmentButton').addEventListener('click', () => {
            document.location.hash = '/createapartment'
        });
        const editButtons = document.getElementsByClassName('editButton');
        const deleteButtons = document.getElementsByClassName('deleteButton');
        const table = document.getElementsByTagName('table');
        if(editButtons && table){
            for(let i = 0; i < editButtons.length; i++){
                editButtons[i].addEventListener('click', () => {
                    document.location.hash = `/updateapartment/${table[0].children[1].children[i].children[0].innerText}`
                });
            }
        }
        if(deleteButtons && table){
            for(let i = 0; i < deleteButtons.length; i++){
                deleteButtons[i].addEventListener('click', () => {
                    document.location.hash = `/deleteapartment/${table[0].children[1].children[i].children[0].innerText}`
                });
            }
        }
        document.getElementById('searchFieldApartment').addEventListener('submit', async (e) => {
            e.preventDefault();
            let category = [];
            let price = [];
            const searchKeyword = document.getElementById('qApartmentList').value;
            const selectedField = document.getElementById('field').value;
            const filterCategory = document.getElementsByName('category');
            if(filterCategory){
                for(let i = 0; i < filterCategory.length; i++){
                    if(filterCategory[i].checked){
                        category.push(filterCategory[i].value);
                    }
                }
            }
            const filterPrice = document.getElementsByName('price');
            console.log(filterPrice);
            let location = `/apartmentslist?${selectedField}=${searchKeyword}`
            if(category.length !== 0){
                location += `&category=${category}`
            }
            if(filterPrice){
                price.push(filterPrice[0].value)
                price.push(filterPrice[1].value)
            }
            if(price.length !== 0){
                location += `&price=${price}`
            }
            document.location.hash = location;
        });
    },
    render: async () => {
        const {name, isAdmin} = getUserInfo();
        if(!name || !isAdmin){
            document.location.hash = '/';
        }
        const {names, values} = parseRequestUrl();
        const apartments = await getApartments({searchKeyword: '', names, values});
        const categories = await getCategories({});
        return `
        <div class="dashboard">
            ${DashboardMenu.render({selected: 'apartmentslist'})}
            <div class="dashboardContent">
                <h1>Будинки / квартири</h1>
                <div class="searchDiv">
                 <form class="searchForm"  id="searchFieldApartment">
                    <div class="searchDiv">
                         <input type="text" name="qApartmentList" id="qApartmentList" value="" /> 
                             <select id="field" class="fieldOption">
                                <option value="name" selected>Назва</option>
                                <option value="_id" >Ідентифікатор</option>
                             </select>
                         <button type="submit"><i class="fa fa-search"></i></button>
                    </div>
                    <div class="Filter">
                        <div class="nameFilter">
                            <h4>Категорія</h4>
                        </div>
                        <div class="parametersFilter">
                            ${categories.map((el)=> `
                                 <div>
                                    <input type="checkbox" name="category" id="${el.name}" value="${el.name}">
                                    <label for="${el.name}">${el.name}</label>
                                </div>
                            `).join('\n')
                            }
                        </div>                
                    </div>
                    <div class="Filter">
                        <div class="nameFilter">
                            <h4>Ціна</h4>
                        </div>
                        <div class="parametersFilter space-around">
                            <div>
                                <label for="for">Від</label>
                                <input type="text" name="price" id="for" value="0">
                            </div>
                             <div>
                               <label for="to">До</label>
                              <input type="text" name="price" id="to" value="100000">   
                            </div>
                        </div>                
                    </div>
                 </form> 
                </div>
                <button id="createApartmentButton" class="primary">Додати будинок / квартиру</button>
                <div class="apartmentsList">
                  <table>
                      <thead>
                         <tr>
                             <th>ID</th>
                             <th>Назва</th>
                             <th>Ціна оренди</th>
                             <th>Категорія</th>
                             <th class="trAction">Дії</th>
                         </tr>
                    </thead>
                    <tbody>
                        ${apartments.map(apartment => `
                            <tr>
                                <td>${apartment._id}</td>
                                <td><a href="/#/apartments/${apartment._id}" style="color: cornflowerblue;">${apartment.name}</a></td>
                                <td>${apartment.price}</td>
                                <td>${apartment.category}</td>
                                <td style="display: flex;">
                                     <button id="${apartment._id}" class="editButton">Редагувати</button>
                                     <button id="${apartment._id}" class="deleteButton">Видалити</button>
                                </td>
                            </tr>
                        `).join('\n')
        }
                    </tbody>
                  </table>
                </div>
            </div>
        </div>
        `
    }
}

export default ApartmentsListScreen