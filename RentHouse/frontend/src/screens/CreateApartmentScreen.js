import {createApartment, getCategories, savePhotoApartment} from "../api";
import {getUserInfo} from "../localStorage";
import {hideLoading, showLoading, showMessage} from "../utils";
//Done
const CreateApartmentScreen = {
    after_render: () => {
        let multimedia = 'Відсутня'
        let houseHoldAppliances = 'Відсутня'
        const multimediaInput = document.getElementsByName('multimedia');
        const householdAppliancesInput = document.getElementsByName('householdAppliances');
        const checkBoxMultimedia = document.getElementsByName('checkBoxMultimedia');
        const checkBoxHouseholdAppliances = document.getElementsByName('checkBoxhouseholdAppliances');
        if(checkBoxMultimedia){
            for(let i = 0; i < checkBoxMultimedia.length; i++){
                checkBoxMultimedia[i].addEventListener('change', () => {
                   if(checkBoxMultimedia[i].checked){
                       multimedia = 'ok'
                       multimediaInput[0].classList.remove('hiddenElement');
                   }else{
                       multimediaInput[0].classList.add('hiddenElement');
                       multimedia = 'Відсутня'
                   }
                });
            }
        }
        if(checkBoxHouseholdAppliances){
            for(let i = 0; i < checkBoxHouseholdAppliances.length; i++){
                checkBoxHouseholdAppliances[i].addEventListener('change', () => {
                    if(checkBoxHouseholdAppliances[i].checked){
                        houseHoldAppliances = 'ok'
                        householdAppliancesInput[0].classList.remove('hiddenElement');
                    }else{
                        householdAppliancesInput[0].classList.add('hiddenElement');
                        houseHoldAppliances = 'Відсутня'
                    }
                });
            }
        }
        document.getElementById("сreateApartment-form").addEventListener('submit', async function (e) {
            e.preventDefault();
            let namePhoto = document.getElementById("file").files[0]
            if(!namePhoto){
                namePhoto = '';
            }
            if(namePhoto){
                namePhoto = namePhoto.name;
            }
            if(multimedia === 'ok'){
                multimedia =  multimediaInput[0].value;
            }
            if(houseHoldAppliances === 'ok'){
                houseHoldAppliances =  householdAppliancesInput[0].value;
            }
            showLoading();
            const data = await createApartment({
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
                multimedia: multimedia,
                householdAppliances: houseHoldAppliances,
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
        const categories = await getCategories({});
        return `
        <div class="form-container">
            <form id="сreateApartment-form" enctype="multipart/form-data">
              <ul class="formItems">
                 <li>
                    <h1>Додавання будинку / квартири</h1>
                 </li>
                 <li class="">
                    <label for="name">Назва</label>
                    <input type="text" name="name" id="name"/>
                 </li> 
                 <li>
                    <label for="category">Категорія</label>
                    <select id="category" name="category">
                        <option selected value="Квартири" disabled>Оберіть категорію</option>
                        ${categories.map((el)=> `
                            <option value="${el.name}">${el.name}</option>
                        `).join('\n')
                         }
                    </select>
                 </li>
                 <li>
                    <label for="countRooms">Кількість кімнат</label>
                    <input type="text" name="countRooms" id="countRooms"/>
                 </li> 
                 <li>
                    <label for="totalArea">Загальна площа, м<sup>2</sup></label>
                    <input type="text" name="totalArea" id="totalArea"/>
                 </li>   
                 <li>
                    <label for="city">Місто</label>
                    <input type="text" name="city" id="city"/>
                 </li> 
                 <li>
                    <label for="street">Вулиця</label>
                    <input type="text" name="street" id="street"/>
                 </li> 
                 <li>
                    <label for="totalAction">Тип оренди</label>
                     <select id="totalAction" name="totalAction">
                       <option value="Довгострокова">Довгострокова (від 3 до 5 років)</option>
                       <option value="Середньострокова">Середньострокова (від 1 до 3 років)</option>
                       <option value="Короткострокова">Короткострокова (від годин до 1 року)</option>
                    </select>
                 </li> 
                 <li>
                    <label for="numberApartment">Номер квартири \ будинку</label>
                    <input type="text" name="numberApartment" id="numberApartment"/>
                 </li> 
                 <li>
                    <label for="furnitureAvailability">Наявніть меблів</label>
                     <select id="furnitureAvailability" name="furnitureAvailability">
                        <option selected value="З меблями">З меблями</option>
                        <option value="Відсутні">Відсутні</option>
                    </select>
                 </li> 
                 <li>
                    <label for="floor">Поверх</label>
                    <input type="text" name="floor" id="floor"/>
                 </li> 
                 <li>
                   <div>
                        <input type="checkbox" id="multimedia" name="checkBoxMultimedia" />
                        <label for="multimedia">Мультимедіа</label>
                    </div>
                    <input type="text" name="multimedia" id="multimedia" class="hiddenElement"/>
                 </li>
                 <li>
                     <div>
                        <input type="checkbox" id="householdAppliances" name="checkBoxhouseholdAppliances" />
                        <label for="householdAppliances">Побутова техніка</label>
                    </div>
                    <input type="text" name="householdAppliances" id="householdAppliances" class="hiddenElement"/>
                 </li>  
                 <li>
                    <label for="image">Картинка</label>
                    <input type="file" name="file" id="file"/>
                 </li>  
                 <li>
                    <label for="price">Ціна</label>
                    <input type="text" name="price" id="price"/>
                 </li> 
                  <li>
                    <label for="Characteristics">Опис</label>
                    <textarea name="Characteristics" id="Characteristics"></textarea>
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

export default CreateApartmentScreen;