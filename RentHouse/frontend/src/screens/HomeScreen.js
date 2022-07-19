import Rating from "../components/Rating";
import {parseRequestUrl, showLoading} from "../utils";
import {getApartments} from "../api";
//Done
const HomeScreen = {
    after_render: async() => {
        const {names, values} = parseRequestUrl();
        for(let i = 0; i < values.length; i++){
            if(names[i] === 'furnitureAvailability'){
                let elem = document.getElementsByName(names[i].toString());
                for(let j = 0; j < elem.length; j++){
                     if(decodeURI(values[i]) === 'З меблями'){
                         if(elem[j].value === 'yes'){
                             elem[j].checked = true;
                         }
                     }
                 }
            }else{
                let elem = document.getElementById(names[i].toString());
                if(elem){
                    if(names[i] === `multimedia` ){
                        elem.checked = false;
                    }else if(names[i] === `householdAppliances`){
                        elem.checked = false;
                    }
                    else{
                        elem.value = decodeURI(values[i]);
                    }
                }
            }
        }
        const cityQuery = document.getElementById('city');
        const streetQuery = document.getElementById('street');
        const countRoomsQuery = document.getElementById('countRooms');
        const totalAreaQuery = document.getElementById('totalArea');
        const totalActionQuery = document.getElementById('totalAction');
        const numberApartmentQuery = document.getElementById('numberApartment');
        const floorQuery = document.getElementById('floor');
        const furnitureQuery = document.getElementsByName('furnitureAvailability');
        const multimediaQuery = document.getElementById('multimedia');
        const houseAppQuery = document.getElementById('householdAppliances');
        let multimedia = '';
        let houseApp = '';
        if(multimediaQuery){
            multimediaQuery.addEventListener('change', ()=> {
                if(multimediaQuery.checked){
                    multimedia = '';
                } else{
                    multimedia = 'Відсутня';
                }
            });
        }
        if(houseAppQuery){
            houseAppQuery.addEventListener('change', ()=> {
                if(houseAppQuery.checked){
                    houseApp = '';
                } else{
                    houseApp = 'Відсутня';
                }
            });
        }
        document.getElementById('filterButton').addEventListener('click', () => {
            let location = '/?'
            location += queryFilterAdd(cityQuery, location, 'city');
            location += queryFilterAdd(streetQuery, location, 'street');
            location += queryFilterAdd(countRoomsQuery, location, 'countRooms');
            location += queryFilterAdd(totalAreaQuery, location, 'totalArea');
            location += queryFilterAdd(totalActionQuery, location, 'totalAction');
            location += queryFilterAdd(numberApartmentQuery, location, 'numberApartment');
            location += queryFilterAdd(floorQuery, location, 'floor');
            if(furnitureQuery){
                for(let i = 0; i < furnitureQuery.length; i++){
                    if(furnitureQuery[i].checked){
                        if(furnitureQuery[i].value === 'yes'){
                            if(location.length > 2){
                                location += '&furnitureAvailability=З меблями';
                            }else{
                                location += 'furnitureAvailability=З меблями';
                            }
                        }else if(furnitureQuery[i].value === 'no'){
                            if(location.length > 2){
                                location += '&furnitureAvailability=Відсутні';
                            }else{
                                location += 'furnitureAvailability=Відсутні';
                            }
                        }else {
                            location += '';
                        }
                    }
                }
            }
            if(multimedia !== ''){
                if(location.length > 2){
                    location += `&multimedia=${multimedia}`;
                }else{
                    location += `multimedia=${multimedia}`;
                }
            }
            if(houseApp !== ''){
                if(location.length > 2){
                    location += `&householdAppliances=${houseApp}`;
                }else{
                    location += `householdAppliances=${houseApp}`;
                }
            }
            document.location.hash = location;
        })
        function queryFilterAdd(obj, location, nameFilter){
            if(obj){
                    if(obj.value !== ""){
                        if(location.length > 2){
                            return `&${nameFilter}=${obj.value}`
                        }else{
                            return `${nameFilter}=${obj.value}`
                        }
                    }else{
                        return '';
                    }
            }else{
                return ''
            }
        }
    },
    render: async () => {
        showLoading();
        const {names, values} = parseRequestUrl();
        const apartments = await getApartments({searchKeyword: '', values, names});
        if(apartments.error){
            return `<div class="error">${apartments.error}</div>`
        }
        document.getElementById('main-container').classList.add('homeScreenContainer')
        return `
        <div class="filterDiv">
             <div class="Filter homeScreenFilter">
                 <div class="nameFilter">
                    <h4>Місто</h4>
                 </div>
                 <div class="parametersFilter">
                     <div>
                         <input type="text" name="city" id="city" value="">
                     </div>
                </div> 
                 <div class="nameFilter">
                    <h4>Вулиця</h4>
                 </div>
                 <div class="parametersFilter">
                     <div>
                         <input type="text" name="street" id="street" value="">
                     </div>
                </div>   
                 <div class="nameFilter">
                    <h4>Кількість кімнат</h4>
                 </div>
                 <div class="parametersFilter">
                     <div>
                         <select name="countRooms" id="countRooms">
                            <option value="1">1 кімната</option>
                            <option value="2">2 кімнати</option>
                            <option value="3">3 кімнати</option>
                            <option value="4">4 кімнати</option>
                            <option value="5">5 кімнат</option>
                            <option value="6">6 кімнат</option>
                            <option value="7">7 кімнат</option>
                            <option value="8">8 кімнат</option>
                         </select>
                     </div>
                </div>     
                 <div class="nameFilter">
                    <h4>Площа оренди</h4>
                 </div>
                 <div class="parametersFilter">
                     <div>
                         <input type="text" name="totalArea" id="totalArea" value="">
                     </div>
                </div>    
                 <div class="nameFilter">
                    <h4>Тип оренди</h4>
                 </div>
                 <div class="parametersFilter">
                     <div>
                         <select id="totalAction" name="totalAction">
                           <option value="Довгострокова">Довгострокова</option>
                           <option value="Середньострокова">Середньострокова</option>
                           <option value="Короткострокова">Короткострокова</option>
                         </select>
                     </div>
                </div>    
                 <div class="nameFilter">
                    <h4>Номер квартири</h4>
                 </div>
                 <div class="parametersFilter">
                     <div>
                         <input type="number" name="numberApartment" id="numberApartment" value="" min="1" max="400">
                     </div>
                </div>        
                <div class="nameFilter">
                    <h4>Поверх</h4>
                 </div>
                 <div class="parametersFilter">
                     <div>
                         <input type="number" name="floor" id="floor" value="" min="1" max="90">
                     </div>
                </div>  
                <div class="nameFilter">
                   <h4>Наявність меблів</h4>
                 </div>
                 <div class="parametersFilter">
                       <div>
                           <input type="radio" name="furnitureAvailability" id="yes" value="yes">
                           <label for="yes">Так</label>
                        </div>
                        <div>
                            <input type="radio" name="furnitureAvailability" id="no" value="no">   
                            <label for="no">Ні</label>
                        </div>
                 </div> 
                  <div class="parametersFilter">
                       <div>
                           <input type="checkbox" name="other" id="multimedia" checked>
                           <label for="multimedia">Мультимедіа</label>
                        </div>
                        <div>
                            <input type="checkbox" name="other" id="householdAppliances" checked>   
                            <label for="householdAppliances">Побутова техніка</label>
                        </div>
                 </div> 
                 <button class="primary" id="filterButton">Фільтрувати</button>
            </div>
        </div>
        <ul class = "apartmentList homeScreen">
           ${apartments.length === 0? `
                <div class="notFound">
                    Нічого не знайдено
                </div>
            ` : apartments.map(apartment => `
                 ${!apartment.StockIn? ` <li>
                 <div class="apartmentItem">
                        <a href="/#/apartments/${apartment._id}">
                            <img src="files/apartments/images/${apartment.image}" alt="${apartment.name}"/>
                        </a>
                        <div class="apartmentName">
                            <a href="/#/apartments/${apartment._id}">
                               ${apartment.name}
                            </a>
                        </div>
                        <div class="apartmentRating">
                            ${Rating.render({value: apartment.rating, text: apartment.numReviews + " переглядів"})}
                        </div>
                        <div class="infoApartment">
                            ${apartment.category}| ${apartment.countRooms} 
                        </div>
                        <div class="apartmentPrice">
                            <p>${apartment.price} грн / місяць</p>
                        </div>
                   </div>
                </li>` : ``}
           `).join("\n")}
         </ul>
        `
    }
}
export default HomeScreen;