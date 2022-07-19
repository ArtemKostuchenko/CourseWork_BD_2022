import {getMyLeaseAll, savePhotoProfile, updateProfile} from "../api";
import {getUserInfo, setUserInfo} from "../localStorage";
import {hideLoading, showLoading, showMessage} from "../utils";
//Done
const ProfileScreen = {
    after_render: () => {
        document.getElementById("profile-form").addEventListener('submit', async function (e) {
            e.preventDefault();
            let namePhoto = document.getElementById("file").files[0]
            if(!namePhoto){
                namePhoto = '';
            }
            if(namePhoto){
                namePhoto = namePhoto.name;
            }
            showLoading();
            const data = await updateProfile({
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                password: document.getElementById("password").value,
                photo: namePhoto,
            });
            hideLoading();
            let responsePhoto = null;
            if(namePhoto){
                responsePhoto = await savePhotoProfile();
            }
            if(data.error){
                showMessage(data.error);
            }else{
                if(responsePhoto){
                    if(responsePhoto.error){
                        document.getElementById('loadingOverlay').style.display = 'none';
                        showMessage(responsePhoto.error);
                    }
                }
                setUserInfo(data);
                document.location.hash = '/';
            }
        });
    },
    render: async () => {
        const {name, email} = getUserInfo();
        if(!name){
            document.location.hash = '/';
        }
        const lease = await getMyLeaseAll();
        console.log(lease);
        return `
        <div class="content profile">
            <div class="profileInfo">
                     <div class="form-container">
                        <form id="profile-form" enctype="multipart/form-data" >
                          <ul class="formItems">
                             <li>
                                <h1>Мій профіль</h1>
                             </li>
                             <li>
                                <label for="name">Ім'я</label>
                                <input type="text" name="name" id="name" value="${name}"/>
                             </li>
                             <li>
                                <label for="email">Електрона пошта</label>
                                <input type="email" name="email" id="email" value="${email}"/>
                             </li>
                             <li>
                                <label for="password">Пароль</label>
                                <input type="password" name="password" id="password"/>
                             </li>
                              <li>
                                <label for="file">Обрати фото:</label>
                                <input type="file" name="file" id="file"/>
                             </li>
                             <li>
                                <button type="submit" class="primary">Оновити</button>
                             </li>
                          </ul>
                        </form>
                     </div>
            </div>
            <div class="profileLease">
                <h2>Історія моїх оренд</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID оренди</th>
                            <th>Дата</th>
                            <th>Ціна</th>
                            <th>Оплачено</th>
                            <th>Підтверджено</th>
                            <th>Дія</th>
                        </tr>
                    </thead>
                    <tbody>
                       ${lease.length === 0? `<tr><td colspan="6">Ви поки що нічого не орендували</td></tr>`:
                        lease.map(ls => `
                                <tr>
                                    <td>${ls._id}</td>
                                    <td>${ls.createdAt.split('T')[0]} ${ls.createdAt.split('T')[1].split('.')[0]}</td>
                                    <td>${ls.itemsPrice}</td>
                                    <td>${ls.isPaid? 'Так': 'Ні'}</td>
                                    <td>${ls.isConfirm? 'Так': 'Ні'}</td>
                                    <td><a href="/#/mylease/${ls._id}">Переглянути</a></td>
                                </tr>
                            `).join('\n')
                         }
                    </tbody>
                    
                </table>
            </div>
        </div>
       
        `
    }
}

export default ProfileScreen;