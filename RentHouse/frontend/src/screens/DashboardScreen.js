import DashboardMenu from "../components/DashboardMenu";
import {getSummary} from "../api";
import Chartist from 'chartist';
//Done
let summary = {}
const DashboardScreen = {
    after_render: async () => {
        summary = await getSummary();
        if(summary.lease.length > 0){
            new Chartist.Line(
                '.ct-chart-line',
                {
                    labels: summary.dailyRent.map((x) => x._id),
                    series: [summary.dailyRent.map((x) => x.sales)],
                },
                {
                    showArea: true,
                }
            );
            new Chartist.Pie(
                '.ct-chart-pie',
                {
                    labels: summary.apartmentCategories.map((x) => x._id),
                    series: summary.apartmentCategories.map((x) => x.count),
                },
                {
                    donut: true,
                    donutWidth: 40,
                    startAngle: 270,
                    showLabel: true,
                    donutSolid: true,
                }
            );
        }
    },
    render: async () => {
        summary = await getSummary();
        return `
         <div class="dashboard">
            ${DashboardMenu.render({selected: 'dashboard'})}
            ${summary.lease.length > 0? 
            `
             <div class="dashboardContent">
                <h1>Інформаційна панель</h1>
                <ul class="summaryItems">
                  <li>
                    <div class="summaryTitle color1">
                      <span><i class="fa fa-users"></i> Користувачі</span>
                    </div>
                    <div class="summaryBody">${summary.users[0].numUsers}</div>
                  </li>
                  <li>
                    <div class="summaryTitle color2">
                      <span><i class="fa fa-home"></i> Оформлені оренди</span>
                    </div>
                    <div class="summaryBody">${summary.lease[0].numLease}</div>
                  </li>
                  <li>
                    <div class="summaryTitle color3">
                      <span><i class="fa fa-money"></i> Прибуток</span>
                    </div>
                    <div class="summaryBody">${summary.lease[0].totalSales} грн</div>
                  </li>
                </ul>
                 <div class="charts">
                      <div>
                        <h2>Прибуток з оренд</h2>
                        <div class="ct-perfect-fourth ct-chart-line"></div>
                      </div>
                      <div>
                        <h2>Категорії</h2>
                        <div class="ct-perfect-fourth ct-chart-pie ct-label"></div>
                      </div>
                 </div>       
            </div>
            `: `
             <div class="dashboardContent">
                <h1>Інформаційна панель</h1>
                <h1 class="successColor">Поки відстуня інформація</h1>
             </div>
            `}
           
        </div>
        `
    }
}
export default DashboardScreen;