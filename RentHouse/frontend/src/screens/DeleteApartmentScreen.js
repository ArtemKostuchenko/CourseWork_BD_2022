import {parseRequestUrl} from "../utils";
import {getUserInfo} from "../localStorage";
import {deleteApartment, getApartment} from "../api";
//Done
const DeleteApartmentScreen = {
    after_render: () => {
        const deleteButton = document.getElementById('delete');
        const cancelButton = document.getElementById('cancel');
        if(deleteButton){
            deleteButton.addEventListener('click', async() => {
                const data = await deleteApartment(parseRequestUrl().id);
                location.hash = '/'
            });
        }
        if(cancelButton){
            cancelButton.addEventListener('click', () => {
               location.hash = '/'
            });
        }
    },
    render: async() => {
        const {name, isAdmin} = getUserInfo();
        if(!name || !isAdmin){
            document.location.hash = '/';
        }
        const request = parseRequestUrl();
        const apartment = await getApartment(request.id);
        return `
         <div class="content">
            Ви дійсно бажаєте видалити ${apartment.category === "Квартири"? 'квартиру' : 'будинок'} <a href="/#/apartments/${apartment._id}" class="infoApartmentA">${apartment.name}</a> ?
            <button class="deleteButton deleteScreenButtons" id="delete">Так</button>
            <button class="editButton deleteScreenButtons" id="cancel">Ні</button>
        </div>
        `
    }
}
export default DeleteApartmentScreen;