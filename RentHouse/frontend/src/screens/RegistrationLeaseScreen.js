import { getLeaseInfo, getUserInfo, setLeaseInfo} from "../localStorage";
import CheckoutSteps from "../components/CheckoutSteps";
//Done
const RegistrationLeaseScreen = {
    after_render: () => {
        document.getElementById("registlease-form").addEventListener('submit', async function (e) {
            e.preventDefault();
            setLeaseInfo({
                phone: document.getElementById('phone').value,
                countPeople: document.getElementById('countPeople').value,
                description: document.getElementById('description').value
            });
            document.location.hash = '/payment'
        });
    },
    render: () => {
        const {name} = getUserInfo();
        if(!name){
            document.location.hash = '/';
        }
        const {phone,countPeople, description} = getLeaseInfo();
        return `
        ${CheckoutSteps.render({step_1: true , step_2: true})}
        <div class="form-container flexToStart">
            <form id="registlease-form" >
              <ul class="formItems">
                 <li>
                    <h1>Заповніть будь-ласка дані</h1>
                 </li>
                 <li>
                    <label for="phone">Номер телефону</label>
                    <input type="text" name="phone" id="phone" value="${phone}"/>
                 </li>
                  <li>
                    <label for="countPeople">Кількістю людей, що проживатимуть</label>
                    <input type="text" name="countPeople" id="countPeople" value="${countPeople}"/>
                 </li>
                  <li>
                    <label for="description">Ваші побажання</label>
                    <textarea name="description" id="description" cols="20" rows="5">${description}</textarea>
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

export default RegistrationLeaseScreen;