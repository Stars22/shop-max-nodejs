const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);

module.exports = class Cart {
  static addProduct(id, price) {
    fs.readFile(p, (err, data) => {
      let cart;
      //if file doesnt exist or empty creates cart object with added product
      if (err || data.length < 1) {
        cart = { products: [{ id, qty: 1 }], totalPrice: price };
        //add or increase quantity if product (not)exists in cart file
      } else {
        cart = JSON.parse(data);
        let copyOfProducts = [...cart.products];
        const prodIndex = copyOfProducts.findIndex(product => product.id === id);
        let updatedProduct;
        if(prodIndex < 0) {
            updatedProduct = { id, qty: 1 };
            copyOfProducts.push(updatedProduct);
        } else {
            updatedProduct = {...copyOfProducts[prodIndex]};
            updatedProduct.qty += 1;
            copyOfProducts[prodIndex] = updatedProduct;
        }
        // const updatedProduct = prodIndex > -1 ? { ...copyOfProducts[prodIndex] } : { id, qty: 0 };
        // updatedProduct.qty += 1;
        // copyOfProducts[prodIndex] = updatedProduct;
        cart = {
          products: copyOfProducts,
          totalPrice: parseInt(cart.totalPrice) + parseInt(price)
        };
      }
      fs.writeFile(p, JSON.stringify(cart), err => console.log(err));
    });
  }
};
