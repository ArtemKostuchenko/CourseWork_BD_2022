import {clearRent, getLeaseInfo, getPayment, getRentItems} from "../localStorage";
import CheckoutSteps from "../components/CheckoutSteps";
import {hideLoading, showLoading, showMessage} from "../utils";
import {createFinalLease} from "../api";
//Done
const convertRentToFinalScreen = () => {
    const rentItems = getRentItems();
    if (rentItems.length === 0) {
        document.location.hash = '/rent';
    }
    const lease = getLeaseInfo();
    if (!lease.phone) {
        document.location.hash = '/registrationlease';
    }
    const payment = getPayment();
    if (!payment.paymentMethod) {
        document.location.hash = '/payment';
    }
    const itemsPrice = rentItems.reduce((a, c) => a + c.price, 0);
    return {
        rentItems,
        lease,
        payment,
        itemsPrice
    }
}
const FinalRevisionScreen = {
    after_render: async () => {
        document.getElementById('confirmRent').addEventListener('click', async () => {
            const rentFinal = convertRentToFinalScreen();
            showLoading();
            const data = await createFinalLease(rentFinal);
            hideLoading();
            if(data.error){
                showMessage(data.error);
            }else{
                clearRent();
                document.location.hash = '/mylease/' + data.lease.createdLease._id
            }
        });
    },
    render: () => {
        const {
            rentItems,
            lease,
            payment,
            itemsPrice
        } = convertRentToFinalScreen();
        return `
        <div>
            ${CheckoutSteps.render({step_1: true, step_2: true, step_3: true, step_4: true})}
            <div class="myRent">
                <div class="myRentInfo">
                    <div>
                        <h2>Дані для звязку</h2>
                         <div>
                            Телефон: ${lease.phone}
                         </div>
                    </div>
                    <div>
                        <h2>Оплата</h2>
                         <div>
                            Спосіб оплати: ${payment.paymentMethod}
                         </div>
                    </div>
                     <div>
                       <ul class="rentListContainer">
                           <li>
                               <h2>Ваш список обраних оренд</h2>
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
                            ${rentItems.length > 1 ?`<button class="primary">Підтвердити оформлення оренд</button>` :
            `<button class="primary" id="confirmRent">Підтвердити оформлення оренди</button>`
        }
                        </ul>
                     </div>
            </div>
        </div>
        `
    }

}
export default FinalRevisionScreen;