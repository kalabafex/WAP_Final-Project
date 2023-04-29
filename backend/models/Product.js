class Product {
  constructor(name, price, image, quantity, id = null) {
    this.id = id ? id : ++counter;
    this.name = name;
    this.price = price;
    this.image = image;
    this.quantity = quantity;
  }

  save() {
    dbProducts.push(this);

    return this;
  }

  edit() {
    const index = dbProducts.findIndex((user) => user.id === this.id);

    if (index === -1) throw "Product doesn't exist!";

    if (this.quantity == 0) dbProducts.splice(index, 1);
    else dbProducts.splice(index, 1, this);

    return this;
  }

  static getAll() {
    return dbProducts;
  }

  static findById(id) {
    const product = dbProducts.find((product) => product.id == id);

    if (product === undefined) throw "Product doesn't exist!";

    return product;
  }

  static delete(id) {
    const index = dbProducts.findIndex((product) => product.id == id);

    if (index === -1) throw "Product doesn't exist!";

    const product = dbProducts[index];
    dbProducts.splice(index, 1);

    return product;
  }
}

let counter = 0;
let dbProducts = [
  new Product("Air Force 1", 199.99, "images/air-force-1.jpeg", 15),
  new Product("Lebron 20", 120, "images/lebron-xx.jpeg", 5),
  new Product("Giannis Immortality", 150, "images/GiannisImmortality.jpg", 20),
];

module.exports = Product;
