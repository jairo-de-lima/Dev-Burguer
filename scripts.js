
const menu = document.getElementById('menu');
const addCartBtn = document.getElementsByClassName('add-to-cart-btn');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.querySelector('.cart-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const checkoutBtn = document.getElementById('checkout-btn')
const cartCounter = document.getElementById('cart-count')
const addressInput = document.getElementById('address')
const addressWarn = document.getElementById('address-warn')


let cart = [];

/*abre carrinho no botao*/
cartBtn.addEventListener('click', function () {
    updateCartModal();
    cartModal.style.display = 'flex';
});
/*fecha carrinho click na tela*/
cartModal.addEventListener('click', function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = 'none'
    }
});

/*fecha carrinho click botao fechar*/
closeModalBtn.addEventListener('click', function () {
    cartModal.style.display = 'none';
});

/*pega valor e nome do produto ao clicar no botao add carrinho*/
menu.addEventListener('click', function (event) {
    //console.log(event.target)
    const parentButton = event.target.closest('.add-to-cart-btn')
    if (parentButton) {
        const name = parentButton.getAttribute('data-name')
        const price = parseFloat(parentButton.getAttribute('data-price'))

        addToCart(name, price)
    }
})

/*add ao carrinho*/
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name)

    if (existingItem) {
        /*se o item ja exite aumenta apenas a quantidade*/
        existingItem.quantity += 1;
    } else {

        cart.push({
            name,
            price,
            quantity: 1,
        })

    }

    updateCartModal()
}


/*att carrinho*/
function updateCartModal() {
    console.log("Atualizando modal do carrinho");
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemsElement = document.createElement("div");
        cartItemsElement.classList.add("cart-items")
        cartItemsElement.innerHTML = `
        <div class="itemsCart">
            <div>
                <h4>${item.name}</h4>
                <p>Qtd: ${item.quantity}</p>
                <p>R$ ${item.price.toFixed(2)}</p>      
            </div>

            <div>
                <button class="remove-from-cart-btn" data-name=${item.name}>
                    Remover
                </button>      
            </div>
        </div>
       `

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemsElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
    })

    cartCounter.innerHTML = cart.length;

}

/*remover item carinho*/
function removeItemCart(name) {
    console.log("Atualizando modal do carrinho");
    const index = cart.findIndex(item => item.name === name)
    console.log("Índice encontrado:", index);

    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            cart.splice(index, 1);
        }

        updateCartModal();
    }

}

cartItemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name");
        console.log("Botão de remoção clicado para:", name);

        removeItemCart(name)
    }
})


addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500") // Adiciona parênteses para remover a classe
        addressWarn.classList.add("hidden")
    }
})

checkoutBtn.addEventListener("click", function () {

    const isOpen = checkRestaurantOpen();
    if (!isOpen) {
        alert("RESTAURANTE FECHADO NO MOMENTO!")
        return;

    }


    if (cart.length === 0) return;
    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    /*chamar zap*/
    const cartItems = cart.map((item) => {
        return (
            ` ${item.name} Quantidade: (${item.quantity}) Preço: R${item.price} `
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "11940107909"
    window.open(`https://wa.me/${phone}?text=${message} endereco: ${addressInput.value}`, "blank")

    cart = [];
    updateCartModal()


})

/*verificar estaurante aberto*/
function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22; // Correção da expressão de comparação
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
    spanItem.style.backgroundColor = "#54CC0A";
} else {
    spanItem.style.backgroundColor = "red";
}