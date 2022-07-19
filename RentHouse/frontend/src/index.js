import HomeScreen  from "./screens/HomeScreen.js";
import ApartmentScreen from "./screens/ApartmentScreen.js";
import Error404Screen from "./screens/Error404Screen.js";
import {hideLoading, parseRequestUrl, showLoading} from "./utils.js";
import RentScreen from "./screens/RentScreen";
import SignInScreen from "./screens/SignInScreen.js";
import Header from "./components/Header";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import {clearUser} from "./localStorage";
import RegistrationLeaseScreen from "./screens/RegistrationLeaseScreen";
import PaymentScreen from "./screens/PaymentScreen";
import FinalRevisionScreen from "./screens/FinalRevisionScreen";
import MyLeaseScreen from "./screens/MyLeaseScreen";
import DashboardScreen from "./screens/DashboardScreen";
import ApartmentsListScreen from "./screens/ApartmentsListScreen";
import CreateApartmentScreen from "./screens/CreateApartmentScreen";
import UpdateApartmentScreen from "./screens/UpdateApartmentScreen";
import DeleteApartmentScreen from "./screens/DeleteApartmentScreen";
import LeaseListScreen from "./screens/LeaseListScreen";
import Aside from "./components/Aside";
import UsersScreen from "./screens/UsersScreen";
import CategoriesScreen from "./screens/CategoriesScreen";
import CreateCategory from "./screens/CreateCategoryScreen";
const  routers = {
    "/": HomeScreen,
    "/apartments/:id": ApartmentScreen,
    '/rent/:id': RentScreen,
    '/rent': RentScreen,
    '/signin': SignInScreen,
    '/register': RegisterScreen,
    '/profile': ProfileScreen,
    '/registrationlease': RegistrationLeaseScreen,
    '/payment': PaymentScreen,
    '/finalrevision': FinalRevisionScreen,
    '/mylease/:id': MyLeaseScreen,
    '/lease/:id': MyLeaseScreen,
    '/dashboard': DashboardScreen,
    '/apartmentslist': ApartmentsListScreen,
    '/createapartment': CreateApartmentScreen,
    '/updateapartment/:id': UpdateApartmentScreen,
    '/deleteapartment/:id': DeleteApartmentScreen,
    '/leaselist': LeaseListScreen,
    '/users': UsersScreen,
    '/categories': CategoriesScreen,
    '/createcategory': CreateCategory
}
const  router = async() => {
    document.getElementById('main-container').classList.remove('homeScreenContainer')
    showLoading();
    const request = parseRequestUrl();
    const parseUrl = (request.resource ? `/${request.resource}`: '/') +
        (request.id ? '/:id': '') + (request.action ? `/${request.action}`: "");
    const screen = routers[parseUrl]? routers[parseUrl]: Error404Screen;
    const header = document.getElementById('header-container');
    header.innerHTML = await Header.render();
    await Header.after_render();
    const aside = document.getElementById('aside-container');
    aside.innerHTML = await Aside.render();
    await Aside.after_render();
    const main = document.getElementById('main-container');
    main.innerHTML = await screen.render();
    if(screen.after_render) await screen.after_render();
    hideLoading();
    document.getElementById("signout").addEventListener('click', async function(){
        await clearUser();
        document.location.hash= '/sigin';
        document.location.hash= '/';
    });
}
window.addEventListener('load', router);
window.addEventListener('hashchange', router);
