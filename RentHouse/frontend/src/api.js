import {apiUrl} from "./config.js";
import axios from "axios";
import {getUserInfo} from "./localStorage";
import {parseRequestUrl} from "./utils";

export const getApartments = async ({ searchKeyword = '', names = [], values = [] }) => {
    try {
        let queryString = '?';
        if (searchKeyword) queryString += `name=${searchKeyword}&`;
        if(names && values){
            for(let i = 0; i < names.length; i++){
                queryString += `${names[i]}=${values[i]}&`;
            }
        }
        const response = await axios({
            url: apiUrl + `/api/apartments${queryString}`,
            method: "GET",
            header: {
                'Content-Type': 'application/json'
            }
        });
        if (response.statusText !== "OK") {
            throw new Error(response.data.message);
        }
        return response.data;
    } catch (err) {
        console.log(err);
        return {error: err.response.data.message || err.message};
    }
}

export const getApartment = async (id) => {
    try {
        const response = await axios({
            url: apiUrl + '/api/apartments/' + id,
            method: "GET",
            header: {
                'Content-Type': 'application/json'
            }
        });
        if (response.statusText !== "OK") {
            throw new Error(response.data.message);
        }
        return response.data;
    } catch (err) {
        console.log(err);
        return {error: err.response.data.message || err.message};
    }
}

export const signIn = async ({email, password}) => {
    try {
        const response = await axios({
            url: apiUrl + '/api/users/signin',
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            data: {
                email,
                password
            }
        });
        if (response.statusText !== "OK") {
            throw new Error(response.data.message);
        }
        return response.data;

    } catch (err) {
        console.log(err);
        return {error: err.response.data.message || err.message};
    }
}

export const register = async ({name, email, password, password2}) => {
    try {
        if (password !== password2) {
            throw new Error("Паролі не співпадають");
        }
        const response = await axios({
            url: apiUrl + '/api/users/register',
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            data: {
                name,
                email,
                password
            }
        });
        if (response.statusText !== "OK") {
            throw new Error(response.data.message);
        }
        return response.data;

    } catch (err) {
        return {error: err.response.data.message || err.message};
    }
}

export const updateProfile = async ({name, email, password, photo}) => {
    try {
        const {_id, token} = getUserInfo();
        const formData = new FormData();
        formData.append('file', document.getElementById('file').files[0]);
        const response = await axios({
            url: apiUrl + `/api/users/${_id}`,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            data: {
                name,
                email,
                password,
                photo
            }
        });
        if (response.statusText !== "OK") {
            throw new Error(response.data.message);
        }
        return response.data;

    } catch (err) {
        console.log(err);
        return {error: err.response.data.message || err.message};
    }
}

export const savePhotoProfile = async () => {
    try {
        const {_id, token} = getUserInfo();
        const formData = new FormData();
        formData.append('file', document.getElementById('file').files[0]);
        const requestOptions = {
            method: 'POST',
            body: formData,
            redirect: 'follow',
            headers: {
                "Authorization": `Bearer ${token}`
            },
        }
        const response = await fetch(apiUrl + '/api/uploads/profile/' + _id, requestOptions).then(response => response.text())
        return JSON.parse(response);
    } catch (err) {
        return {error: err.response.data.message || err.message};
    }

}

export const createFinalLease = async (lease) => {
    try {
        const {token} = getUserInfo();
        const response = await axios({
            url: apiUrl + `/api/lease`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            data: lease
        })
        if (response.statusText !== "Created") {
            throw new Error(response.data.message);
        }
        return response.data;
    } catch (err) {
        console.log(err);
        return {error: (err.response ? err.response.data.message : err.message)};
    }

}

export const getLease = async (id) => {
    try{
        const {token} = getUserInfo();
        const response = await axios({
            url: apiUrl + `/api/lease/${id}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        if (response.statusText !== "OK") {
            throw new Error(response.data.message);
        }
        return response.data
    }catch (err) {
        return {error: err.message}
    }
}

export const getMyLeaseAll = async () => {
    try{
        const {token} = getUserInfo();
        const response = await axios({
            url: apiUrl + `/api/lease/mine`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        if (response.statusText !== "OK") {
            throw new Error(response.data.message);
        }
        return response.data
    }catch (err) {
        return {error: (err.response ? err.response.data.message : err.message)};
    }
}

export const createApartment = async ({name, category, countRooms, totalArea, city, street, totalAction, numberApartment, furnitureAvailability, floor, multimedia, householdAppliances, image, price, Characteristics}) => {
    try {
        const {token} = getUserInfo();
        const response = await axios({
            url: apiUrl + '/api/apartments',
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            data: {
                name,
                category,
                countRooms,
                totalArea,
                city,
                street,
                totalAction,
                numberApartment,
                furnitureAvailability,
                floor,
                multimedia,
                householdAppliances,
                image,
                price,
                Characteristics
            }
        });
        if (response.statusText !== "OK") {
            throw new Error(response.data.message);
        }
        return response.data;

    } catch (err) {
        console.log(err);
        return {error: err.response.data.message || err.message};
    }
}

export const savePhotoApartment = async (_id) => {
    try {
        const {token} = getUserInfo();
        const formData = new FormData();
        formData.append('file', document.getElementById('file').files[0]);
        const requestOptions = {
            method: 'POST',
            body: formData,
            redirect: 'follow',
            headers: {
                "Authorization": `Bearer ${token}`
            },
        }
        const response = await fetch(apiUrl + '/api/uploads/apartments/' + _id, requestOptions).then(response => response.text())
        return JSON.parse(response);
    } catch (err) {
        return {error: err.response.data.message || err.message};
    }

}

export const updateApartment = async ({name, category, countRooms, totalArea, city, street, totalAction, numberApartment, furnitureAvailability, floor, multimedia, householdAppliances, image, price, Characteristics}) => {
    try {
        const id = parseRequestUrl().id;
        const {token} = getUserInfo();
        const response = await axios({
            url: apiUrl + `/api/apartments/${id}`,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            data: {
                name,
                category,
                countRooms,
                totalArea,
                city,
                street,
                totalAction,
                numberApartment,
                furnitureAvailability,
                floor,
                multimedia,
                householdAppliances,
                image,
                price,
                Characteristics
            }
        });
        if (response.statusText !== "OK") {
            throw new Error(response.data.message);
        }
        return response.data;

    } catch (err) {
        console.log(err);
        return {error: err.response.data.message || err.message};
    }
}

export const deleteApartment = async (id) => {
    try {
        const {token} = getUserInfo();
        const response = await axios({
            url: apiUrl + `/api/apartments/${id}`,
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        if (response.statusText !== "OK") {
            throw new Error(response.data.message);
        }
        return response.data;

    } catch (err) {
        console.log(err);
        return {error: err.response.data.message || err.message};
    }
}

export const getSummary = async() => {
    try {
        const {token} = getUserInfo();
        const response = await axios({
            url: apiUrl + `/api/lease/summary`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        if (response.statusText !== "OK") {
            throw new Error(response.data.message);
        }
        return response.data;
    } catch (err) {
        console.log(err);
        return {error: err.response.data.message || err.message};
    }
}

export const getAllLease = async({ searchKeyword = '', names = [], values = [] }) => {
    try {
        let queryString = '?';
        if (searchKeyword) queryString += `name=${searchKeyword}&`;
        if(names && values){
            for(let i = 0; i < names.length; i++){
                queryString += `${names[i]}=${values[i]}&`;
            }
        }
        const {token} = getUserInfo();
        const response = await axios({
            url: apiUrl + `/api/lease${queryString}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        if (response.statusText !== "OK") {
            throw new Error(response.data.message);
        }
        return response.data;
    } catch (err) {
        console.log(err);
        return {error: err.response.data.message || err.message};
    }
}

export const deleteLease = async (idLease) => {
    try {
        const {token} = getUserInfo();
        const response = await axios({
            url: apiUrl + `/api/lease/${idLease}`,
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        if (response.statusText !== "OK") {
            throw new Error(response.data.message);
        }
        return response.data;
    } catch (err) {
        console.log(err);
        return {error: err.response.data.message || err.message};
    }
}

export const confirmLease = async (idLease, isConfirm = true) => {
    try {
        const {token} = getUserInfo();
        const response = await axios({
            url: apiUrl + `/api/lease/confirm/${idLease}`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            data:{
                isConfirm
            }
        });
        if (response.statusText !== "OK") {
            throw new Error(response.data.message);
        }
        return response.data;
    } catch (err) {
        console.log(err);
        return {error: err.response.data.message || err.message};
    }
}
export const payLease = async (idLease, status = false) => {
    try {
        const {token} = getUserInfo();
        const response = await axios({
            url: apiUrl + `/api/lease/pay/${idLease}`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            data:{
                status
            }
        });
        if (response.statusText !== "OK") {
            throw new Error(response.data.message);
        }
        return response.data;
    } catch (err) {
        console.log(err);
        return {error: err.response.data.message || err.message};
    }
}

export const getUsers = async ({ searchKeyword = '', names = [], values = [] }) => {
    try {
        let queryString = '?';
        if (searchKeyword) queryString += `name=${searchKeyword}&`;
        if(names && values){
            for(let i = 0; i < names.length; i++){
                queryString += `${names[i]}=${values[i]}&`;
            }
        }
        const {token} = getUserInfo();
        const response = await axios({
            url: apiUrl + `/api/users/${queryString}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        if (response.statusText !== "OK") {
            throw new Error(response.data.message);
        }
        return response.data;
    } catch (err) {
        console.log(err);
        return {error: err.response.data.message || err.message};
    }
}

export const changeRoleUser = async ({idUser, isManager = false, isAdmin = false}) => {
    try {
        const {token} = getUserInfo();
        const response = await axios({
            url: apiUrl + `/api/users/role/${idUser}`,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            data:{
                isManager,
                isAdmin
            }
        });
        if (response.statusText !== "OK") {
            throw new Error(response.data.message);
        }
        return response.data;
    } catch (err) {
        console.log(err);
        return {error: err.response.data.message || err.message};
    }
}
export const deleteUser = async ({idUser}) => {
    try {
        const {token} = getUserInfo();
        const response = await axios({
            url: apiUrl + `/api/users/${idUser}`,
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        if (response.statusText !== "OK") {
            throw new Error(response.data.message);
        }
        return response.data;
    } catch (err) {
        console.log(err);
        return {error: err.response.data.message || err.message};
    }
}

export const createCategory = async ({name}) => {
    try {
        const {token} = getUserInfo();
        const response = await axios({
            url: apiUrl + '/api/categories',
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            data: {
                name
            }
        });
        if (response.statusText !== "OK") {
            throw new Error(response.data.message);
        }
        return response.data;

    } catch (err) {
        console.log(err);
        return {error: err.response.data.message || err.message};
    }
}

export const getCategories = async ({ searchKeyword = '', names = [], values = [] }) => {
    try {
        let queryString = '?';
        if (searchKeyword) queryString += `name=${searchKeyword}&`;
        if(names && values){
            for(let i = 0; i < names.length; i++){
                queryString += `${names[i]}=${values[i]}&`;
            }
        }
        const {token} = getUserInfo();
        const response = await axios({
            url: apiUrl + `/api/categories/${queryString}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        if (response.statusText !== "OK") {
            throw new Error(response.data.message);
        }
        return response.data;
    } catch (err) {
        console.log(err);
        return {error: err.response.data.message || err.message};
    }
}

export const deleteCategory = async ({idCategory}) => {
    try {
        const {token} = getUserInfo();
        const response = await axios({
            url: apiUrl + `/api/categories/${idCategory}`,
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        if (response.statusText !== "OK") {
            throw new Error(response.data.message);
        }
        return response.data;
    } catch (err) {
        console.log(err);
        return {error: err.response.data.message || err.message};
    }
}

export const createReview = async (apartmentId, review) => {
    try {
        const {token} = getUserInfo();
        const response = await axios({
            url: apiUrl + `/api/apartments/${apartmentId}/reviews`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            data: review
        });
        if (response.statusText !== "Created") {
            throw new Error(response.data.message);
        }
        return response.data;

    } catch (err) {
        console.log(err);
        return {error: err.response.data.message || err.message};
    }
}