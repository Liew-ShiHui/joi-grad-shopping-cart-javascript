import _ from "lodash";
import Order from "./Order.js";

export default class ShoppingCart {
  constructor(customer, products) {
    this.customer = customer;
    this.products = products;
  }

  addProduct = (product) => {
    this.products.push(product);
  };

  removeProduct = (product) => {
    _.remove(this.products, product);
  };

  checkout = () => {
    let totalPrice = 0;
    let loyaltyPointsEarned = 0;

    this.products.forEach((product) => {
      let { discount, loyaltyPointsEarned: lp } =
        this.calcDiscountAndLoyaltyPoints(product.code, product.price);

      loyaltyPointsEarned += lp;

      totalPrice += product.price - discount;
    });

    return new Order(totalPrice, loyaltyPointsEarned);
  };

  calcDiscountAndLoyaltyPoints = (productCode, price) => {
    if (productCode.startsWith("DIS")) {
      let productCodeArr = productCode.split("_");
      let discount = productCodeArr[1];

      discount = parseInt(discount); // 10, 15, 20
      let discountProp = discount / 100; // 0.1, 0.15, 0.2

      let discounted = price * discountProp;
      let loyaltyPointsEarned = price / discount;

      return {
        discount: discounted,
        loyaltyPointsEarned: loyaltyPointsEarned,
      };
    } else {
      return {
        discount: 0,
        loyaltyPointsEarned: price / 5,
      };
    }
  };

  displaySummary = () => {
    return (
      "Customer: " +
      this.customer.name +
      "\n" +
      "Bought:  \n" +
      this.products.map((p) => "- " + p.name + ", " + p.price).join("\n")
    );
  };
}
