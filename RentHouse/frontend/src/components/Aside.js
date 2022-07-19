import {getCategories} from "../api";

const Aside = {
    render: async () => {
        const categories = await getCategories({});
        return `
   <div class="aside-header">
    <div>Категорії</div>
    <button class="aside-close-button" id="aside-close-button"><i class="fa fa-window-close" aria-hidden="true"></i></button>
  </div>
  <div class="aside-body">
    <ul class="categories">
     ${categories.map((el) => `
        <li>
            <a href="/#/?category=${el.name}"
              >${el.name}
              <span><i class="fa fa-chevron-right"></i></span>
            </a>
      </li>
     `).join('\n')}
    </ul>
  </div>`;
    },
    after_render: async () => {
        document.getElementById('aside-container').classList.remove('open');
        document
            .getElementById('aside-close-button')
            .addEventListener('click', async () => {
                document.getElementById('aside-container').classList.remove('open');
            });
    },
};

export default Aside;