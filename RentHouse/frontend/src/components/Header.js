import {getUserInfo} from "../localStorage";
import {parseRequestUrl} from "../utils";

const Header = {
    after_render: async () => {
        document.getElementById('searchForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const searchKeyword = document.getElementById('q').value;
            document.location.hash = `/?q=${searchKeyword}`;
        });
        document.getElementById('aside-open-button').addEventListener('click', async () => {
            document.getElementById('aside-container').classList.add('open');
        });
    },
    render: async () => {
        const {name, photo, isAdmin} = getUserInfo();
        return `
       <div class="nameWebSite">
         <button id="aside-open-button" class="bar">
             &#9776;
         </button>
            <a href="/#/">Rent House</a>
        </div>
        <div class="search">
          <form class="searchForm"  id="searchForm">
            <input type="text" name="q" id="q" value="" /> 
            <button type="submit"><i class="fa fa-search"></i></button>
          </form>        
        </div>
        <div>
            <a href="/#/rent">Оренда</a>
        </div>
        <div>
           ${name ? `
          <div class="dropdown text-end">
          <a href="#" class="d-block link-dark text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
            <img src="/files/profile/images/${photo}" alt="${name}" width="32" height="32" class="rounded-circle">
          </a>
          <ul class="dropdown-menu text-big" aria-labelledby="dropdownUser1" style="">
            <li><a class="dropdown-item font" >${name}</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item font" href="/#/profile">Профіль</a></li>
            ${isAdmin ? `<li><a class="dropdown-item font" href="/#/dashboard">Інформаційна панель</a></li>` : ''}
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item font" id="signout">Вийти</a></li>
          </ul
        </div>` :
            ` <a href="/#/signin">Увійти</a>`}
        </div>
        `
    }
}
export default Header;