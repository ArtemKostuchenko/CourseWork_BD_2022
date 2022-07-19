import DashboardMenu from "../components/DashboardMenu";
import {changeRoleUser, deleteUser, getUsers} from "../api";
import {getUserInfo} from "../localStorage";
import {parseRequestUrl, rerender, showMessage} from "../utils";
//Done
const UsersScreen = {
    after_render: () => {
        document.getElementById('searchFieldUsers').addEventListener('submit', async (e) => {
            e.preventDefault();
            let role = [];
            const searchKeyword = document.getElementById('qUsers').value;
            const selectedField = document.getElementById('field').value;
            const filterRole = document.getElementsByName('role');
            if (filterRole) {
                for (let i = 0; i < filterRole.length; i++) {
                    if (filterRole[i].checked) {
                        role.push(filterRole[i].value);
                    }
                }
            }
            let location = `/users?${selectedField}=${searchKeyword}`
            if (role.length !== 0) {
                role.forEach((el) => {
                    location += `&is${el[0].toUpperCase() + el.slice(1)}=true`
                })
            }
            document.location.hash = location;
        });
        const table = document.getElementsByTagName('table');
        const selectManagerAction = document.getElementsByClassName('managerAction');
        const adminAction = document.getElementsByClassName('adminAction');
        if (selectManagerAction && table && adminAction) {
            for (let i = 0; i < selectManagerAction.length; i++) {
                selectManagerAction[i].addEventListener('change', async () => {
                    await setRole(table[0].children[1].children[i].children[0].innerText, selectManagerAction[i].value, adminAction[i].value);
                });
                adminAction[i].addEventListener('change', async () => {
                    await setRole(table[0].children[1].children[i].children[0].innerText, selectManagerAction[i].value, adminAction[i].value);
                });
            }
        }
        const deleteButtonsUsers = document.getElementsByClassName('deleteButton')
        if(deleteButtonsUsers){
            for(let i = 0; i < deleteButtonsUsers.length; i++){
                deleteButtonsUsers[i].addEventListener('click', async () => {
                    const deletedUser = await deleteUser({idUser: table[0].children[1].children[i].children[0].innerText});
                    if(deletedUser.error){
                        showMessage(deletedUser.error);
                    }else{
                        await rerender(UsersScreen);
                    }
                });
            }
        }
        async function setRole(id, isManager, isAdmin) {
            const roleRequest = await changeRoleUser({idUser: id, isManager: isManager, isAdmin: isAdmin});
            if (roleRequest.error) {
                showMessage(roleRequest.error);
            } else {
                await rerender(UsersScreen);
            }
        }
    },
    render: async () => {
        const {name, isAdmin} = getUserInfo();
        if (!name || !isAdmin) {
            document.location.hash = '/';
        }
        const {names, values} = parseRequestUrl();
        const users = await getUsers({names, values});
        console.log(users);
        return `
        <div class="dashboard">
            ${DashboardMenu.render({selected: 'users'})}
            <div class="dashboardContent">
                <h1>Користувачі</h1>
                <div class="searchDiv">
                 <form class="searchForm"  id="searchFieldUsers">
                    <div class="searchDiv">
                         <input type="text" name="qUsers" id="qUsers" value="" /> 
                             <select id="field" class="fieldOption">
                                <option value="name" selected>Імя</option>
                                <option value="_id" >Ідентифікатор</option>
                                <option value="email">Електрона пошта</option>
                             </select>
                         <button type="submit"><i class="fa fa-search"></i></button>
                    </div>
                    <div class="Filter">
                        <div class="nameFilter">
                            <h4>Ролі</h4>
                        </div>
                        <div class="parametersFilter">
                            <div>
                                <input type="checkbox" name="role" id="admin" value="admin">
                                <label for="admin">Адміністратор</label>
                            </div>
                             <div>
                              <input type="checkbox" name="role" id="manager" value="manager">   
                              <label for="manager">Менеджер</label>
                            </div>
                        </div>                
                    </div>
                 </form> 
                </div>
                <div class="listScreen">
                  <table>
                      <thead>
                         <tr>
                             <th>ID</th>
                             <th>Імя</th>
                             <th>Електрона пошта</th>
                             <th>Менеджер</th>
                             <th>Адміністратор</th>
                             <th class="trAction">Дії</th>
                         </tr>
                    </thead>
                    <tbody>
                        ${users.map(user => `
                            <tr>
                                <td>${user._id}</td>
                                <td>${user.name}</td>
                                <td>${user.email}</td>
                                <td><select class="warningButton managerAction">${user.isManager ?
            `<option value="true" selected>Так</option><option value="false">Ні</option>` :
            `<option value="true">Так</option><option value="false" selected>Ні</option>`
        }</select></td>
                                 <td><select class="warningButton adminAction">${user.isAdmin ?
            `<option value="true" selected>Так</option><option value="false">Ні</option>` :
            `<option value="true">Так</option><option value="false" selected>Ні</option>`
        }</select></td>
                                <td style="display: flex;">
                                     <button id="${user._id}" class="deleteButton">Видалити</button>
                                </td>
                            </tr>
                        `).join('\n')
        }
                    </tbody>
                  </table>
                </div>
            </div>
        </div>
        `
    }
}

export default UsersScreen