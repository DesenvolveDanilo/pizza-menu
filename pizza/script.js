let modalQt = 1;
let cart = [];
let modalKey = 0;

const c = (el) => {
  return document.querySelector(el); // se não passar com parametro não consigo chamar a função como seu retorno ela se tornaria um callback
};
const cs = (el) => {
  return document.querySelectorAll(el);
};

pizzaJson.map((item, index) => {
  let pizzaItem = c(".models .pizza-item").cloneNode(true);
  pizzaItem.setAttribute("data-key", index);
  pizzaItem.querySelector(".pizza-item--img img").src = item.img;
  pizzaItem.querySelector(".pizza-item--price").innerHTML =
    "R$ " + item.price.toFixed(2);
  pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
  pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;
  pizzaItem.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault();
    let key = e.target.closest(".pizza-item").getAttribute("data-key");
    modalKey = key;
    modalQt = 1;
    // console.log(e.target);
    console.log("pizzada clicada: " + key);
    c(".pizzaInfo h1").innerHTML = pizzaJson[key].name;
    c(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;
    c(".pizzaInfo--actualPrice").innerHTML =
      "R$:  " + pizzaJson[key].price.toFixed(2);
    c(".pizzaWindowArea img").src = pizzaJson[key].img;
    c(".pizzaInfo--size.selected").classList.remove(".selected");
    cs(".pizzaInfo--size").forEach((size, sizeIndex) => {
      if (sizeIndex == 2) {
        size.classList.add("selected");
      }
      size.querySelector("span").innerHTML = pizzaJson[key].sizes[sizeIndex];
    });
    c(".pizzaInfo--qt").innerHTML = modalQt; //pra deixar o 1 como default na quantidade de pizzas
    //===================
    c(".pizzaWindowArea").style.opacity = 0;
    c(".pizzaWindowArea").style.display = "flex";
    setTimeout(() => {
      c(".pizzaWindowArea").style.opacity = 1;
    }, 100);
  });
  c(".pizza-area").append(pizzaItem);
});

//eventos do MODAL
function closeModal() {
  c(".pizzaWindowArea").style.opacity = 0;
  setTimeout(() => (c(".pizzaWindowArea").style.display = "none"), 500);
}
//lembrar do cs para pegar mais de um elemento
cs(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach(
  (item) => {
    item.addEventListener("click", closeModal);
  }
);
//botao menos
c(".pizzaInfo--qtmenos").addEventListener("click", () => {
  if (modalQt > 1) {
    modalQt--;
    c(".pizzaInfo--qt").innerHTML = modalQt;
  }
});
c(".pizzaInfo--qtmais").addEventListener("click", () => {
  modalQt++;
  c(".pizzaInfo--qt").innerHTML = modalQt;
});
//tamanhos pizza
cs(".pizzaInfo--size").forEach((size, sizeIndex) => {
  size.addEventListener("click", (e) => {
    c(".pizzaInfo--size.selected").classList.remove("selected"); //retira o selecionados anteriormente
    size.classList.add("selected");
  });
});
//botao adicionar
c(".pizzaInfo--addButton").addEventListener("click", () => {
  //qual é  pizza?
  // modalKey

  //qual tamanho?
  let size = parseInt(c(".pizzaInfo--size.selected").getAttribute("data-key"));
  //quantidade?
  // modalQt
  let identifier = pizzaJson[modalKey].id + "@" + size;

  let key = cart.findIndex((item) => {
    return item.identifier == identifier;
  }); // se achar um identifier igual retorna seu indice
  //===========
  console.log(cart[key]);
  //=============
  if (key > -1) {
    cart[key].qt += modalQt;
  } else {
    cart.push({
      identifier,
      id: pizzaJson[modalKey].id,
      size,
      qt: modalQt,
    });
  }
  updateCart();
  closeModal(); //para fechar
  //console.log(pizzaJson[modalKey])
});
  //mobile
c('.menu-openner').addEventListener('click',()=>{
  if(cart.length >0){
    c('aside').style.left = '0';
  }else if (cart.length ==0){
   window.alert('seu carrinho esta vazio') 
  }
})
c('.menu-closer').addEventListener('click',()=>{
  c('aside').style.left = '100vw'
} )
//=====================================
function updateCart() {
  //mobile
  c('.menu-openner span').innerHTML= cart.length;
  //=====================================
  //pc
  if (cart.length > 0) {
    c("aside").classList.add("show");
    c(".cart").innerHTML = "";
      let subtotal = 0;
      let desconto = 0;
      let total= 0;

    for (let i in cart) {
      let pizzaItem = pizzaJson.find((item) => {
        return item.id == cart[i].id;
      });
      subtotal+= pizzaItem.price * cart[i].qt
      let cartItem = c(".models .cart--item").cloneNode(true);
      c(".cart").append(cartItem);
      let pizzaSizeName;
      switch (cart[i].size) {
        case 0:
          pizzaSizeName = "PEQUENA";
          break;
        case 1:
          pizzaSizeName = "MÉDIA";
          break;
        case 2:
          pizzaSizeName = "GRANDE";
          break;

        default:
          break;
      }
      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
      cartItem.querySelector("img").src = pizzaItem.img;
      cartItem.querySelector(".cart--item-nome").innerHTML = pizzaName;
      cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].qt;
      cartItem.querySelector(".cart--item-qtmenos").addEventListener("click", () => {
          if (cart[i].qt > 1) {
            cart[i].qt--;
          } else {
            cart.splice(i, 1);
          }
          updateCart();
        });
      cartItem.querySelector(".cart--item-qtmais").addEventListener("click", () => {
          cart[i].qt++;
          updateCart();
        });
      c('.cart').append(cartItem)
    }
    desconto = subtotal *0.1;
    total = subtotal - desconto;
    c('.subtotal span:last-child').innerHTML = `R$: ${subtotal.toFixed(2)}`
    c('.desconto span:last-child').innerHTML = `R$: ${desconto.toFixed(2)}`
    c('.total span:last-child').innerHTML = `R$: ${total.toFixed(2)}`
  } else {
    c("aside").classList.remove("show");
    c('aside').style.left = '100vw';

  }
}
