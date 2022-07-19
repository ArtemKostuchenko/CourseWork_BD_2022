const DashboardMenu = {
    render: (props) => {
        return `
        <div class="dashboardMenu">
            <ul>
                <li class="${props.selected === 'dashboard'? 'selected' : ''}">
                    <a href="/#/dashboard">Інформаційна панель</a>
                </li>
                <li class="${props.selected === 'leaselist'? 'selected' : ''}">
                    <a href="/#/leaselist">Орендовані будинки</a>
                </li>
                 <li class="${props.selected === 'apartmentslist'? 'selected' : ''}">
                    <a href="/#/apartmentslist">Будинки / квартири</a>
                </li>
                 <li class="${props.selected === 'users'? 'selected' : ''}">
                    <a href="/#/users">Користувачі</a>
                </li>
                 <li class="${props.selected === 'categories'? 'selected' : ''}">
                    <a href="/#/categories">Категорії</a>
                </li>
            </ul>
        </div>
        `
    }
}

export default DashboardMenu;