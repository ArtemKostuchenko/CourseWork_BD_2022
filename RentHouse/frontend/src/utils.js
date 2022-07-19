import {getRentItems} from "./localStorage";

export const  parseRequestUrl = () => {
    const address = document.location.hash.slice(1).split('?')[0];
    const queryString =
        document.location.hash.slice(1).split('?').length === 2
            ? document.location.hash.slice(1).split('?')[1]
            : '';

    const url = address.toLowerCase() || '/';
    const q = queryString.split('=');
    const allQuery = queryString.split('&');
    let values = [];
    let names = [];
    if(allQuery){
       for(let i = 0; i < allQuery.length; i++){
           const fieldsAndNames = allQuery[i].split('=');
           names.push(fieldsAndNames[0]);
           values.push(fieldsAndNames[1]);
       }
    }
    const request = url.split('/');
    return {
        resource: request[1],
        id: request[2],
        action: request[3],
        name: q[0],
        value: q[1],
        values: values,
        names: names
    }
}
export const rerender = async (component) => {
    document.getElementById('main-container').innerHTML = await component.render();
    await component.after_render();
}

export const showLoading = () => {
    document.getElementById('loadingOverlay').classList.add('active');
}

export const hideLoading = () => {
    document.getElementById('loadingOverlay').classList.remove('active');
}

export const showMessage = (message, callback) => {
    document.getElementById('message-overlay').innerHTML =
        `<div>
             <div id="message-overlay-content">${message}</div>
             <button id="message-overlay-close-button">Закрити</button>       
         </div>`
    document.getElementById('message-overlay').classList.add('active');
    document.getElementById('message-overlay-close-button').addEventListener('click', function(){
        document.getElementById('message-overlay').classList.remove('active');
        if(callback){
            callback();
        }
    });
}

export const redirectUser = () => {
    if(getRentItems().length !== 0){
        document.location.hash = '/registrationlease'
    }else{
        document.location.hash = '/'

    }
}

export const checkDatePay = (payedAt) =>{
    const dateToday = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(new Date().getMonth() + 1)
    nextMonth.setDate(-1);
    const countDaysInMonth  =  nextMonth.getDate();
    console.log(countDaysInMonth, nextMonth);
    const datePayed = new Date(payedAt);
    const options = {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }
    if((dateToday.getDate() - datePayed.getDate()) === countDaysInMonth){
        const date = new Date();
        date.setDate(countDaysInMonth + datePayed.getDate());
        return {
            status: false,
            count: 0,
            infoNextPay: new Date().toLocaleDateString('uk-UA', options)
        }
    }else if(datePayed.getDate() > dateToday.getDate() && datePayed.getMonth() < dateToday.getMonth()){
            let countDaysPassed = dateToday.getDate() + (countDaysInMonth - datePayed.getDate() + 1)
            if(countDaysInMonth === countDaysPassed){
                const date = new Date();
                date.setDate(countDaysInMonth + datePayed.getDate());
                return {
                    status: false,
                    count: 0,
                    infoNextPay: date.toLocaleDateString('uk-UA', options)
                }
            }else if(countDaysInMonth < countDaysPassed){
                const date = new Date();
                date.setDate(countDaysInMonth + datePayed.getDate());
                return {
                    status: false,
                    count: countDaysPassed - countDaysInMonth,
                    infoNextPay: date.toLocaleDateString('uk-UA', options)
                }
            }else{
                return {
                    status: true,
                    count:  countDaysInMonth - countDaysPassed,
                }
            }
    }else{
        const date = new Date();
        date.setDate(countDaysInMonth + datePayed.getDate());
        return {
            status: true,
            count:  countDaysInMonth - (dateToday.getDate() - datePayed.getDate()),
            infoNextPay: date.toLocaleDateString('uk-UA', options)
        }
    }
}

export const getCorrectName = (number) =>{
    switch (number){
        case 1: return 'днів'
        case 2: return 'дня'
        case 3: return 'дня'
        case 4: return 'дня'
        case 21: return 'день'
        case 22: return 'день'
        case 23: return 'дня'
        case 24: return 'дня'
        case 31: return 'день'
        default: return 'днів'
    }
}