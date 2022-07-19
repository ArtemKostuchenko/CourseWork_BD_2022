const CheckoutSteps = {
    render: (props) => {
        return `<div class="checkoutSteps">
                    <div class="${props.step_1 ? 'active' : ''}">
                        Вхід
                    </div>
                     <div class="${props.step_2 ? 'active' : ''}">
                        Дані для звязку
                    </div>
                     <div class="${props.step_3 ? 'active' : ''}">
                        Оплата
                    </div>
                     <div class="${props.step_4 ? 'active' : ''}">
                        Остаточний перегляд
                    </div>
                </div>`
    }
}

export  default CheckoutSteps;