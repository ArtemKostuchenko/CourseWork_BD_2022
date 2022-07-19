export const getRentItems = () => {
    return localStorage.getItem('rentItems') ? JSON.parse(localStorage.getItem('rentItems')) : [];
}

export const setRentItems = (rentItems) => {
    localStorage.setItem('rentItems', JSON.stringify(rentItems));
}

export const clearRent = () => {
    localStorage.removeItem('rentItems');
}

export const setUserInfo = ({
                                _id = "",
                                name = "",
                                email = "",
                                password = "",
                                photo = "",
                                token = "",
                                isAdmin = false,
                                isManager = false
                            }) => {
    localStorage.setItem('userInfo', JSON.stringify({
        _id, name, email, password, token, isAdmin, photo, isManager
    }));
}

export const getUserInfo = () => {
    return localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) :
        {
            name: '',
            email: '',
            password: ''
        }
}

export const clearUser = async () => {
    await localStorage.removeItem('userInfo');
}

export const getLeaseInfo = () => {
    return localStorage.getItem('lease') ? JSON.parse(localStorage.getItem('lease')) : {
        phone: '',
        countPeople: '',
        description: ''
    };
}

export const setLeaseInfo = ({phone = '', countPeople = '', description = ''}) => {
    localStorage.setItem('lease', JSON.stringify({phone, countPeople, description}));
}

export const getPayment = () => {
    return localStorage.getItem('payment') ? JSON.parse(localStorage.getItem('payment')) : {
         paymentMethod: 'Privat24',
    };
}

export const setPayment = ({paymentMethod = 'Privat24'}) => {

    localStorage.setItem('payment', JSON.stringify({paymentMethod}));
}


