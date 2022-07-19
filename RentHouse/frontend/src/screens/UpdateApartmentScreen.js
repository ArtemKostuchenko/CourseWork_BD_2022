import {getApartment, savePhotoApartment, updateApartment} from "../api";
import {getUserInfo} from "../localStorage";
import {hideLoading, parseRequestUrl, showLoading, showMessage} from "../utils";
//Done
const UpdateApartmentScreen = {
    after_render: () => {
        document.getElementById("updateApartment-form").addEventListener('submit', async function (e) {
            e.preventDefault();
            let namePhoto = document.getElementById("file").files[0]
            if(!namePhoto){
                namePhoto = '';
            }
            if(namePhoto){
                namePhoto = namePhoto.name;
            }
            showLoading();
            const data = await updateApartment({
                name: document.getElementById('name').value,
                category: document.getElementById('category').value,
                countRooms: document.getElementById('countRooms').value,
                totalArea: document.getElementById('totalArea').value,
                city: document.getElementById('city').value,
                street: document.getElementById('street').value,
                totalAction: document.getElementById('totalAction').value,
                numberApartment: document.getElementById('numberApartment').value,
                furnitureAvailability: document.getElementById('furnitureAvailability').value,
                floor: document.getElementById('floor').value,
                multimedia: document.getElementById('multimedia').value,
                householdAppliances: document.getElementById('householdAppliances').value,
                image: namePhoto,
                price: document.getElementById('price').value,
                Characteristics: document.getElementById('Characteristics').value,

            });
            hideLoading();
            let responsePhoto = null;
            if(namePhoto && data._id){
                responsePhoto = await savePhotoApartment(data._id);
            }
            if(data.error){
                showMessage(data.error);
            }else{
                document.location.hash = `/apartments/${data._id}`
            }
        });
    },
    render: async() => {
        const {name, isAdmin} = getUserInfo();
        if(!name || !isAdmin){
            document.location.hash = '/';
        }
        const request = parseRequestUrl();
        console.log(request.id)
        const apartment = await getApartment(request.id);
        return `
        <div class="form-container">
            <form id="updateApartment-form" enctype="multipart/form-data">
              <ul class="formItems">
                 <li>
                    <h1>Оновлення будинку / квартири</h1>
                 </li>
                 <li class="">
                    <label for="name">Назва</label>
                    <input type="text" name="name" id="name" value="${apartment.name}"/>
                 </li> 
                 <li>
                    <label for="category">Категорія</label>
                    <select id="category" name="category">
                    ${apartment.category === "Квартири" ? `
                        <option selected value="Квартири">Квартири</option>
                        <option value="Будинки">Будинки</option>
                    ` : `
                        <option value="Квартири">Квартири</option>
                        <option selected  value="Будинки">Будинки</option>
                    `}
                        
                    </select>
                 </li>
                 <li>
                    <label for="countRooms">Кількість кімнат</label>
                    <input type="text" name="countRooms" id="countRooms" value="${apartment.countRooms}"/>
                 </li> 
                 <li>
                    <label for="totalArea">Загальна площа</label>
                    <input type="text" name="totalArea" id="totalArea" value="${apartment.totalArea}"/>
                 </li>   
                 <li>
                    <label for="city">Місто</label>
                    <input type="text" name="city" id="city" value="${apartment.city}"/>
                 </li> 
                 <li>
                    <label for="street">Вулиця</label>
                    <input type="text" name="street" id="street" value="${apartment.street}"/>
                 </li> 
                 <li>
                    <label for="totalAction">Тип оренди</label>
                    <input type="text" name="totalAction" id="totalAction" value="${apartment.totalAction}"/>
                 </li> 
                 <li>
                    <label for="numberApartment">Номер квартири \ будинку</label>
                    <input type="text" name="numberApartment" id="numberApartment" value="${apartment.numberApartment}"/>
                 </li> 
                 <li>
                    <label for="furnitureAvailability">Наявніть меблів</label>
                     <select id="furnitureAvailability" name="furnitureAvailability">
                        ${apartment.furnitureAvailability === "З меблями" ? `
                         <option selected value="З меблями">З меблями</option>
                         <option value="Відсутні">Відсутні</option>
                        `: `
                         <option value="З меблями">З меблями</option>
                         <option selected value="Відсутні">Відсутні</option>
                        `}
                       
                    </select>
                 </li> 
                 <li>
                    <label for="floor">Поверх</label>
                    <input type="text" name="floor" id="floor" value="${apartment["floor"]}"/>
                 </li> 
                 <li>
                    <label for="multimedia">Мультимедіа</label>
                    <input type="text" name="multimedia" id="multimedia" value="${apartment.multimedia}"/>
                 </li>
                 <li>
                    <label for="householdAppliances">Побутова техніка</label>
                    <input type="text" name="householdAppliances" id="householdAppliances" value="${apartment.householdAppliances}"/>
                 </li>  
                 <li>
                    <label for="image">Картинка</label>
                    <input type="file" name="file" id="file"/>
                 </li>  
                 <li>
                    <label for="price">Ціна</label>
                    <input type="text" name="price" id="price" value="${apartment.price}"/>
                 </li> 
                  <li>
                    <label for="Characteristics">Опис</label>
                    <textarea name="Characteristics" id="Characteristics">${apartment.Characteristics}</textarea>
                 </li>  
                 <li>
                    <button type="submit" class="primary">Оновити</button>
                 </li>
              </ul>
            </form>
        </div>
        `
    }
}

export default UpdateApartmentScreen;