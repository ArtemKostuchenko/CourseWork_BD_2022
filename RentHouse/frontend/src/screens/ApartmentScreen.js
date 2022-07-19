import {hideLoading, parseRequestUrl, rerender, showLoading, showMessage} from "../utils.js";
import {createReview, getApartment} from "../api";
import Rating from "../components/Rating";
import {getUserInfo} from "../localStorage";
//Done
const ApartmentScreen = {
    after_render: () => {
        const request = parseRequestUrl();
        const editButtons = document.getElementsByClassName('editButton');
        const deleteButtons = document.getElementsByClassName('deleteButton');
        if (editButtons) {
            for (let i = 0; i < editButtons.length; i++) {
                editButtons[i].addEventListener('click', () => {
                    document.location.hash = `/updateapartment/${request.id}`
                });
            }
        }
        if (deleteButtons) {
            for (let i = 0; i < deleteButtons.length; i++) {
                deleteButtons[i].addEventListener('click', () => {
                    document.location.hash = `/deleteapartment/${request.id}`
                });
            }
        }
        document.getElementById('rentButton').addEventListener('click', function () {
            document.location.hash = `/rent/${request.id}`;
        });
        if (document.getElementById('reviewForm')) {
            document.getElementById('reviewForm').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    showLoading();
                    const data = await createReview(request.id, {
                        comment: document.getElementById('comment').value,
                        rating: document.getElementById('rating').value,
                    });
                    hideLoading();
                    if (data.error) {
                        showMessage(data.error);
                    } else {
                        document.getElementById('rating').value = '';
                        document.getElementById('comment').value = '';
                        await rerender(ApartmentScreen);
                    }
            });
        }
    },
    render: async () => {
        const request = parseRequestUrl();
        showLoading();
        const {isAdmin} = getUserInfo();
        const apartment = await getApartment(request.id);
        if (apartment.error) {
            return `<div>${apartment.error}</div>`
        }
        const userInfo = getUserInfo();
        hideLoading();
        return `
       <div class="content">
            <div class="back-to-homePage">
                <a href="/#/">Головна сторінка</a>
                <a href= "/#/apartments/${apartment._id}">/ ${apartment.name}</a>
            </div>
            <div class="details">
                <div class="details-images">
                    <div class="general-image">
                        <img src="files/apartments/images/${apartment.image}" alt="${apartment.name}"/>
                    </div>
                </div>
                <div class="details-info">
                   <ul>
                        <li>
                            <h1>${apartment.name}</h1>
                        </li>
                         <li>
                            ${Rating.render({value: apartment.rating, text: `${apartment.numReviews} переглядів`})}
                        </li>
                        <li>
                            Ціна оренди: <strong>${apartment.price} грн / місяць</strong>
                        </li>
                        <li>
                            <div class="description">
                                <div class="property-apartments">
                                    <div class="flex-property">
                                        <div class="nameProperty">
                                           Місто
                                        </div>
                                        <div class="valueProperty">
                                           <a href="/#/?city=${apartment.city}" class="infoApartmentA">${apartment.city}</a>
                                        </div>
                                    </div>
                                    <div class="flex-property">
                                        <div class="nameProperty">
                                           Вулиця
                                        </div>
                                        <div class="valueProperty">
                                           <a href="/#/?street=${apartment.street}" class="infoApartmentA">${apartment.street}</a>
                                        </div>
                                    </div>
                                    <div class="flex-property">
                                        <div class="nameProperty">
                                           Кількість кімнат
                                        </div>
                                        <div class="valueProperty">
                                            <a href="/#/?countRooms=${apartment.countRooms}" class="infoApartmentA">${apartment.countRooms}</a>
                                        </div>
                                    </div>
                                     <div class="flex-property">
                                        <div class="nameProperty">
                                           Площа оренди
                                        </div>
                                        <div class="valueProperty">
                                             <a href="/#/?totalArea=${apartment.totalArea}" class="infoApartmentA">${apartment.totalArea} м<sup>2</sup></a>
                                        </div>
                                    </div>
                                     <div class="flex-property">
                                        <div class="nameProperty">
                                           Тип оренди
                                        </div>
                                        <div class="valueProperty">
                                            <a href="/#/?totalAction=${apartment.totalAction}" class="infoApartmentA">${apartment.totalAction}</a>
                                        </div>
                                    </div>
                                     <div class="flex-property">
                                        <div class="nameProperty">
                                           Номер квартири(будинку)
                                        </div>
                                        <div class="valueProperty">
                                            <a href="/#/?numberApartment=${apartment.numberApartment}" class="infoApartmentA">${apartment.numberApartment}</a>
                                        </div>
                                    </div>
                                    <div class="flex-property">
                                        <div class="nameProperty">
                                           Поверх
                                        </div>
                                        <div class="valueProperty">
                                            <a href="/#/?floor=${apartment["floor"]}" class="infoApartmentA">${apartment["floor"]}</a>
                                        </div>
                                    </div>
                                     <div class="flex-property">
                                        <div class="nameProperty">
                                           Наявність меблів
                                        </div>
                                        <div class="valueProperty">
                                            <a href="/#/?furnitureAvailability=${apartment.furnitureAvailability}" class="infoApartmentA">${apartment.furnitureAvailability}</a>
                                        </div>
                                    </div>
                                     <div class="flex-property">
                                        <div class="nameProperty">
                                           Побутова техніка
                                        </div>
                                        <div class="valueProperty">
                                            <a href="/#/?householdAppliances=${apartment.householdAppliances}" class="infoApartmentA">${apartment.householdAppliances}</a>
                                        </div>
                                    </div>
                                     <div class="flex-property">
                                        <div class="nameProperty">
                                           Мультимедіа
                                        </div>
                                        <div class="valueProperty">
                                            <a href="/#/?multimedia=${apartment.multimedia}" class="infoApartmentA">${apartment.multimedia}</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="text-decription">
                                    <p>${apartment.Characteristics}</p>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                 <div class="details-action">
                <ul>
                    <li>
                       Ціна: ${apartment.price} грн / місяць
                    </li>
                     <li>
                       Cтатус: ${apartment.StockIn ? `<span class="error">Орендовано</span>` : `<span class="success">Вільно</span>`}
                    </li>
                    <li>
                      ${apartment.StockIn ? `<button class="primary" disabled>Орендовано</button>` : `<button class="primary" id="rentButton">Орендувати</button>`}
                    </li>
                    ${isAdmin ? `
                    <li class="navigationAdmin">
                       <button id="${apartment._id}" class="editButton">Редагувати</button>
                       <button id="${apartment._id}" class="deleteButton">Видалити</button>
                    </li>
                    ` : ``
        }
                </ul>
            </div>
            </div>
            <div class="content">
               <h2>Відгуки</h2>
               ${apartment.reviews.length === 0 ? `<div>Поки немає відгуків</div>`: ``}
               <ul class="reviews">
                  ${apartment.reviews.map((review) => `
                        <li>
                            <div><b>${review.name}</b></div>
                            <div class="ratingContainer">
                                ${Rating.render({
                                    value: review.rating
                                })}
                                <div>
                                    <div>
                                      ${review.createdAt.substring(0, 10)}
                                     </div>
                                </div>
                            </div>
                             <div>
                                 ${review.comment}
                             </div>
                        </li>
                  `).join('\n')
                    }
                  <li>
                    ${userInfo.name? 
                        `<div class="form-container">
                            <form id="reviewForm">
                              <ul class="formItems">
                              <li> <h3>Залишити відгук</h3></li>
                                <li>
                                  <label for="rating">Рейтинг</label>
                                  <select required name="rating" id="rating">
                                    <option value="" selected disabled>Оберіть рейтинг</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                  </select>
                                </li>
                                <li>
                                  <label for="comment">Коментарій</label>
                                  <textarea required  name="comment" id="comment" ></textarea>
                                </li>
                                <li>
                                  <button type="submit" class="primary">ОК</button>
                                </li>
                              </ul>
                            </form>
                         </div>`
                            : ` 
                        <div>Будь-ласка <a href="/#/signin">увійдіть</a>, щоб написати вігук.</div>`
                    }
                 </li>
               </ul>
            </div>
       </div>
       `;
    }
}
export default ApartmentScreen;
