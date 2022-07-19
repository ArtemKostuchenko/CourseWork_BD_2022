import {signIn} from "../api";
import {getUserInfo, setUserInfo} from "../localStorage";
import {hideLoading, redirectUser, showLoading, showMessage} from "../utils";
//Done
const SignInScreen = {
    after_render: () => {
        document.getElementById("signIn").addEventListener('submit', async function (e) {
            e.preventDefault();
            showLoading();
            const data = await signIn({
                email: document.getElementById("email").value,
                password: document.getElementById("password").value,
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
            <form id="signIn">
              <ul class="formItems">
                 <li>
                    <h1>Вхід</h1>
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
                    <button type="submit" class="primary">Увійти</button>
                 </li>
                 <li>
                    <div>
                        Новий користувач? <a href="/#/register">Зареєструватися</a>
                    </div>
                 </li>
              </ul>
            </form>
        </div>
        `
    }
}

export default SignInScreen;