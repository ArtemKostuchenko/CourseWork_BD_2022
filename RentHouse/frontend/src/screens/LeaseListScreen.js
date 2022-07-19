import {confirmLease, deleteLease, getAllLease} from "../api";
import {getUserInfo} from "../localStorage";
import DashboardMenu from "../components/DashboardMenu";
import {parseRequestUrl, rerender, showMessage} from "../utils";

//Done
const LeaseListScreen = {
    after_render: () => {
        const viewButtons = document.getElementsByClassName('viewButton');
        const confirmButtons = document.getElementsByClassName('editButton');
        const deleteButtons = document.getElementsByClassName('deleteButton');
        const table = document.getElementsByTagName('table');
        if (viewButtons && table) {
            for (let i = 0; i < viewButtons.length; i++) {
                viewButtons[i].addEventListener('click', () => {
                    document.location.hash = `/lease/${table[0].children[1].children[i].children[0].innerText}`
                });
            }
        }
        if (confirmButtons && table) {
            for (let i = 0; i < confirmButtons.length; i++) {
                confirmButtons[i].addEventListener('click', async (e) => {
                    let data = await confirmLease(e.composedPath()[2].children[0].innerText, true);
                    if (data.error) {
                        showMessage(data.error);
                    } else {
                        rerender(LeaseListScreen);
                    }
                });
            }
        }
        if (deleteButtons && table) {
            for (let i = 0; i < deleteButtons.length; i++) {
                deleteButtons[i].addEventListener('click', async (e) => {
                    let data = await deleteLease(e.composedPath()[2].children[0].innerText);
                    if (data.error) {
                        showMessage(data.error);
                    } else {
                        rerender(LeaseListScreen);
                    }
                });
            }
        }
        document.getElementById('searchFieldLease').addEventListener('submit', async (e) => {
            e.preventDefault();
            const searchKeyword = document.getElementById('qLease').value;
            const selectedField = document.getElementById('field').value;
            let location = `/leaselist?${selectedField}=${searchKeyword}`
            const paid = document.getElementsByName('paid');
            const confirm = document.getElementsByName('confirm');
            console.log(confirm)
            if (paid) {
                for (let i = 0; i < paid.length; i++) {
                    if (paid[i].checked) {
                        location += `&isPaid=${paid[i].value}`
                    }
                }
            }
            if (confirm) {
                for (let i = 0; i < confirm.length; i++) {
                    if (confirm[i].checked) {
                        location += `&isConfirm=${confirm[i].value}`
                    }
                }
            }
            document.location.hash = location;
        });
    },
    render: async () => {
        const {isAdmin} = getUserInfo();
        if (isAdmin) {
            const {names, values} = parseRequestUrl();
            const leaseAll = await getAllLease({names, values});
            console.log(leaseAll);
            return `
                <div class="dashboard">
                    ${DashboardMenu.render({selected: 'leaselist'})}
                    <div class="dashboardContent">
                        <h1>Орендовані будинки</h1>
                          <div class="searchDiv">
                             <form class="searchForm"  id="searchFieldLease">
                                <div class="searchDiv">
                                     <input type="text" name="qLease" id="qLease" value="" /> 
                                         <select id="field" class="fieldOption">
                                            <option value="name" selected>Імя користувача</option>
                                            <option value="_id" >Ідентифікатор</option>
                                         </select>
                                     <button type="submit"><i class="fa fa-search"></i></button>
                                </div>
                                <div class="Filter">
                                    <div class="nameFilter">
                                        <h4>Оплачено</h4>
                                    </div>
                                    <div class="parametersFilter">
                                        <div>
                                            <input type="radio" name="paid" id="paidTrue" value="true">
                                            <label for="paidTrue">Так</label>
                                        </div>
                                         <div>
                                          <input type="radio" name="paid" id="paidFalse" value="false">   
                                          <label for="paidFalse">Ні</label>
                                        </div>
                                    </div>                
                                </div>
                                <div class="Filter">
                                    <div class="nameFilter">
                                        <h4>Підтверджено</h4>
                                    </div>
                                    <div class="parametersFilter">
                                        <div>
                                            <input type="radio" name="confirm" id="сonfirmTrue" value="true">
                                            <label for="сonfirmTrue">Так</label>
                                        </div>
                                         <div>
                                          <input type="radio" name="confirm" id="сonfirmFalse" value="false">   
                                          <label for="сonfirmFalse">Ні</label>
                                        </div>
                                    </div>                
                                </div>
                             </form> 
                            </div>
                        <div class="leaseList">
                          <table>
                              <thead>
                                 <tr>
                                     <th>ID</th>
                                     <th>Дата</th>
                                     <th>Всього</th>
                                     <th>Користувач</th>
                                     <th>Оплачено</th>
                                     <th>Підтверджено</th>
                                     <th class="trAction">Дії</th>
                                 </tr>
                            </thead>
                            <tbody>
                                ${leaseAll.map(lease => `
                                    <tr>
                                        <td>${lease._id}</td>
                                        <td>${new Date(lease.createdAt).toLocaleDateString('uk-UA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</td>
                                        <td>${lease.itemsPrice}</td>
                                        <td>${lease.user.name}</td>
                                        <td>${lease.isPaid ? `Так` : `Ні`}</td>
                                        <td>${lease.isConfirm ? `Так` : `Ні`}</td>
                                        <td style="display: flex; float: right">
                                              ${!lease.isConfirm ? `<button id="${lease._id}" class="editButton m">Підтвердити</button>` : ``}
                                             <button id="${lease._id}" class="viewButton m">Переглянути</button>
                                             <button id="${lease._id}" class="deleteButton m">Видалити</button>
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
}

export default LeaseListScreen;