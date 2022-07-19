import {checkDatePay, getCorrectName, parseRequestUrl, rerender, showMessage} from "../utils";
import {confirmLease, getLease, payLease} from "../api";
import Data from "../../../backend/data";
import {getUserInfo} from "../localStorage";
//Done
const MyLeaseScreen = {
    after_render: async () => {
        const payButton = document.getElementById('payButton');
        if(payButton){
            payButton.addEventListener('click', async () => {
                let data = await payLease(parseRequestUrl().id, true);
                if (data.error) {
                    showMessage(data.error);
                } else {
                    rerender(MyLeaseScreen);
                }
            });
        }
    },
    render: async () => {
        const {_id} = getUserInfo()
        const request = parseRequestUrl();
        const {
            user,
            rentItems,
            registLease,
            payment,
            itemsPrice,
            isConfirm,
            confirmAt,
            isPaid,
            paidAt
        } = await getLease(request.id);
        const payed = checkDatePay(paidAt);
        const day = getCorrectName(payed.count);
        console.log(payed)
        return `
        <div>
            <h1>Мої оренди</h1>
            <div class="myRent">
                <div class="myRentInfo">
                    <div>
                        <h2>Дані для звязку</h2>
                         <div>
                            Телефон: ${registLease.phone}
                         </div>
                          ${isConfirm? `<div class="success">Підтверджено (${confirmAt.split('T')[0]} ${confirmAt.split('T')[1].split('.')[0]})</div>`:
                                     `<div class="error">Не підтверджено</div>` }
                    </div>
                    <div>
                        <h2>Оплата</h2>
                         <div>
                            Спосіб оплати: ${payment.paymentMethod}
                         </div>
                           ${isPaid? `
<div class="success">Оплачено о (${paidAt.split('T')[0]} ${paidAt.split('T')[1].split('.')[0]})</div>`:
                         `<div class="error">Не оплачено (Остання оплата -${paidAt.split('T')[0]} ${paidAt.split('T')[1].split('.')[0]})</div>` }
                    </div>
                     <div>
                       <ul class="rentListContainer">
                           <li>
                               <h2>Ваш список орендувань</h2>
                                <div>Ціна</div>
                           </li>
                           ${
            rentItems.map(item =>
                `
                                 <li>
                                    <div class="rentImage">
                                      <img src="files/apartments/images/${item.image}" alt="${item.name}">
                                    </div>
                                    <div class="rentName">
                                        <div>
                                             <a href="/#/apartments/${item.apartment}">${item.name}</a>
                                        </div>
                                    </div>
                                    <div class="rentPrice">
                                        ${item.price} грн / місяць
                                    </div>
                                </li>
                                `).join("\n")
        }
                        </ul>
                    </div>
                </div>
                <div class="leaseAction">
                         <ul>
                            <li>
                                <h2>Суммарна сплата</h2>
                            </li>
                            <li>
                               <div>Всього до сплати</div><div class="total">${itemsPrice} грн / місяць</div>
                            </li>
                             <li>
                               <div>Наступна оплата через </div><div class="total">${payed.count} ${day}</div>
                            </li>
                            <li>
                               <div>Наступна оплата</div><div class="${payed.status ? `successColor`: `dangerColor`}">${payed.infoNextPay}</div>
                            </li>
                            ${_id === user && payed.status === false? `<button class="editButton fw" id="payButton">Оплатити</button>` : `` }
                        </ul>
               </div>
            </div>
        </div>
        `
    }

}
export default MyLeaseScreen;