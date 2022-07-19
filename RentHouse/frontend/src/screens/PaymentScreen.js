import { getUserInfo, setPayment} from "../localStorage";
import CheckoutSteps from "../components/CheckoutSteps";

//Done
const PaymentScreen = {
    after_render: () => {
        document.getElementById("payment-form").addEventListener('submit', async function (e) {
            e.preventDefault();
            const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
            setPayment({
                paymentMethod
            });
            document.location.hash = '/finalrevision'
        });
    },
    render: () => {
        const {name} = getUserInfo();
        if(!name){
            document.location.hash = '/';
        }
        return `
        ${CheckoutSteps.render({step_1: true , step_2: true, step_3: true})}
        <div class="form-container flexToStart">
            <form id="payment-form" >
              <ul class="formItems">
                 <li>
                    <h1>Спосіб оплати</h1>
                 </li>
                 <li>
                    <div>
                      <input type="radio" name="paymentMethod" id="Privat24" value="Privat24" checked>
                      <label for="Privat24">Приват24</label>
                    </div>
                 </li>
                 <li>
                    <div>
                      <input type="radio" name="paymentMethod" id="MasterCard" value="MasterCard" >
                      <label for="MasterCard">MasterCard</label>
                    </div>
                 </li>
                  <li>
                    <div>
                      <input type="radio" name="paymentMethod" id="cash" value="cash" >
                      <label for="cash">Готівка</label>
                    </div>
                 </li>
                 <li>
                    <button type="submit" class="primary">Продовжити</button>
                 </li>
              </ul>
            </form>
        </div>
        `
    }
}

export default PaymentScreen;