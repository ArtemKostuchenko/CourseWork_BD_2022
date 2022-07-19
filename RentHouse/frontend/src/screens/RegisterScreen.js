import {register} from "../api";
import {getUserInfo, setUserInfo} from "../localStorage";
import {hideLoading, redirectUser, showLoading, showMessage} from "../utils";
//Done
const RegisterScreen = {
    after_render: () => {
        document.getElementById("register-form").addEventListener('submit', async function (e) {
            e.preventDefault();
            showLoading();
            const data = await register({
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                password: document.getElementById("password").value,
                password2: document.getElementById("repassword").value,
            });
            hideLoading();
            if(data.error){
                showMessage(data.error);
            }else{
                setUserInfo(data);
                redirectUser();
            }
        });
    },
    render: () => {
        if(getUserInfo().name){
            redirectUser();
        }
        return `
        <div class="form-container">
            <form id="register-form">
              <ul class="formItems">
                 <li>
                    <h1>Реєстрація</h1>
                 </li>
                 <li>
                    <label for="name">Ім'я</label>
                    <input type="text" name="name" id="name"/>
                 </li>
                 <li>
                    <label for="email">Електрона пошта</label>
                    <input type="email" name="email" id="email"/>
                 </li>
                 <li>
                    <label for="password">Пароль</label>
                    <input type="password" name="password" id="password"/>
                 </li>
                  <li>
                    <label for="repassword">Повтроріть пароль</label>
                    <input type="password" name="repassword" id="repassword"/>
                 </li>
                 <li>
                    <button type="submit" class="primary">Зареєструватися</button>
                 </li>
                 <li>
                    <div>
                        Вже маєте аккаунт? <a href="/#/signin">Увійти</a>
                    </div>
                 </li>
              </ul>
            </form>
        </div>
        `
    }
}

export default RegisterScreen;