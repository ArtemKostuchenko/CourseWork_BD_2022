import {parseRequestUrl, rerender} from "../utils";
import {getApartment} from "../api";
import {getRentItems, setRentItems} from "../localStorage";
//Done
const addToRent = (item, forceUpdate = false) => {
    let rentItems = getRentItems();
    const existItem = rentItems.find(x => x.apartment === item.apartment);
    if(existItem){
        rentItems = rentItems.map((x) => x.apartment === existItem.apartment ? item: x);
    }else {
        rentItems = [...rentItems, item];
    }
    setRentItems(rentItems);
}

const removeFromRent = (id) => {
    setRentItems(getRentItems().filter(x => x.apartment !== id));
    if(id === parseRequestUrl().id){
        document.location.hash = '/rent';
    }else{
        rerender(RentScreen);
    }
}

const RentScreen = {
    after_render: () => {
        const deleteButtons = document.getElementsByClassName('deleteItemRent');
        Array.from(deleteButtons).forEach(deleteButton => {
           deleteButton.addEventListener('click', function () {
              removeFromRent(deleteButton.id);
           });
        });
        document.getElementById('checkoutRent').addEventListener('click', function () {
            document.location.hash = "/signin"
        });
    },
    render: async () => {
        const request = parseRequestUrl();
        if(request.id){
            const apartment = await getApartment(request.id);
            addToRent({
                apartment: apartment._id,
                name: apartment.name,
                image: apartment.image,
                price: apartment.price,
                StockIn: apartment.StockIn,
            });
        }
        const rentItems = getRentItems();
        return `
            <div class="content rent">
                <div class="rentList">
                    <ul class="rentListContainer">
                        <li>
                            <h3>Мої оренди</h3>
                            <div>Ціна</div>
                        </li>
                        ${
                         rentItems.length === 0?
                             '<div>Ви поки нічого не орендували</div>':
                             rentItems.map(item => `
                                <li>
                                    <div class="rentImage">
                                      <img src="files/apartments/images/${item.image}" alt="${item.name}">
                                    </div>
                                    <div class="rentName">
                                        <div>
                                             <a href="/#/apartments/${item.apartment}">${item.name}</a>
                                        </div>
                                        <div>
                                             <button class="deleteItemRent" id="${item.apartment}">Видалити</button>
                                        </div>
                                    </div>
                                    <div class="rentPrice">
                                        ${item.price} грн / місяць
                                    </div>
                                </li>
                             `).join('\n')
                        }
                    </ul>
                </div>
                <div class="rentAction">
                    <h3>Остаточна ціна (${rentItems.length} оренд(-и)): ${rentItems.reduce((a, c) => a + c.price, 0)} грн</h3>
                    <button id="checkoutRent" class="primary">Перейти до орендування</button>
                </div>
            </div>
        `
    }
}

export default  RentScreen;