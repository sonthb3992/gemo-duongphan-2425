// Menu.js

import React, { Component } from "react";
import Drink from "../Drink/Drink";
import Food from "../Food/Food";
import { v4 as uuidv4 } from "uuid";
import { FormattedMessage, IntlProvider } from "react-intl";
import { Form } from "react-bootstrap";
import Cart from "../Cart/Cart";
import Order from "../Order/Order";

const initialDrink = {
  drink: "coffee",
  type: "hot",
  size: "S",
  hasWhippingCream: false,
  milkOption: "none",
  chocolateSaucePumps: 0,
};

const initialFood = {
  food: "sandwich",
  additionalFoods: [],
};

class Menu extends Component {
  constructor(props) {
    super(props);
    this.handleDrinkUpdate = this.handleDrinkUpdate.bind(this);
    this.handleFoodUpdate = this.handleFoodUpdate.bind(this);
    this.state = {
      drink: initialDrink,
      food: initialFood,
      locale: "en",
    };
  }

  handleAddToCart = (event, item) => {
    // Call the function in the Cart component
    event.preventDefault();
    this.cart.addToCart(item);
  };

  handleAddToOrder = (cart) => {
    this.order.addToOrder(cart);
  };

  handleDrinkUpdate = (updatedDrink, price) => {
    let { drink, order } = this.state;
    if (updatedDrink && updatedDrink.id == undefined) {
      this.setState({
        drink: {
          drink: updatedDrink.drink,
          type: updatedDrink.type,
          size: updatedDrink.size,
          hasWhippingCream: updatedDrink.hasWhippingCream,
          milkOption: updatedDrink.milkOption,
          chocolateSaucePumps: updatedDrink.chocolateSaucePumps,
          price: price,
        },
      });
    }
    // } else {
    //   for (let i = 0; i < order.length; ++i) {
    //     if (order[i].id == updatedDrink.id) {
    //       order[i].drink = updatedDrink.drink;
    //       order[i].type = updatedDrink.type;
    //       order[i].size = updatedDrink.size;
    //       order[i].hasWhippingCream = updatedDrink.hasWhippingCream;
    //       order[i].milkOption = updatedDrink.milkOption;
    //       order[i].chocolateSaucePumps = updatedDrink.chocolateSaucePumps;
    //       order[i].price = price;
    //     }
    //   }
    //   this.setState({ order }, () => this.updateOrderTotalPrice());
    // }
  };

  // Food
  handleFoodUpdate = (updatedFood, price) => {
    let { Food, order } = this.state;
    const newAdditionalFoods = [...updatedFood.additionalFoods];

    if (updatedFood.id == undefined) {
      this.setState({
        food: {
          food: updatedFood.food,
          additionalFoods: newAdditionalFoods,
          price: price,
        },
      });
    }
    // } else {
    //   for (let i = 0; i < order.length; ++i) {
    //     if (order[i].id == updatedFood.id) {
    //       order[i].food = updatedFood.food;
    //       order[i].additionalFoods = newAdditionalFoods;
    //       order[i].price = price;
    //     }
    //   }
    //   this.setState({ order }, () => this.updateOrderTotalPrice());
  };

  getLocaleMessages(locale) {
    switch (locale) {
      case "vn":
        return require("../lang/vn.json");
      default:
        return require("../lang/en.json");
    }
  }

  handleLanguageChange = (event) => {
    this.setState({ locale: event.target.value });
  };

  render() {
    const { locale, drink, food, order, orderPrice } = this.state;
    console.log(order);
    return (
      <IntlProvider locale={locale} messages={this.getLocaleMessages(locale)}>
        <div className="d-flex justify-content-end">
          <Form.Select value={locale} onChange={this.handleLanguageChange}>
            <option value="en">English</option>
            <option value="vn">Tiếng Việt</option>
          </Form.Select>
        </div>
        <div>
          <div className="row">
            <div className="col-md-6">
              <form onSubmit={(event) => this.handleAddToCart(event, drink)}>
                <Drink
                  {...drink}
                  onChange={(drink, price) =>
                    this.handleDrinkUpdate(drink, price)
                  }
                />
                <div className="text-center">
                  <button type="submit" className="btn btn-primary mt-2">
                    <FormattedMessage
                      id="menu.addCart"
                      defaultMessage="Add To Cart"
                    />
                  </button>
                </div>
              </form>
            </div>
            <div className="col-md-6" style={{ borderLeft: "1px solid black" }}>
              <form onSubmit={(event) => this.handleAddToCart(event, food)}>
                <Food
                  {...food}
                  onChange={(food, price) => this.handleFoodUpdate(food, price)}
                />
                <div className="text-center">
                  <button type="submit" className="btn btn-primary mt-2">
                    <FormattedMessage
                      id="menu.addCart"
                      defaultMessage="Add To Cart"
                    />
                  </button>
                </div>
              </form>
            </div>
          </div>
          <hr />
          <div class="container border rounded">
            <div className="row">
              <Cart
                ref={(cart) => (this.cart = cart)}
                addToOrder={this.handleAddToOrder}
              />
            </div>
          </div>
          <hr />
          <div class="container border rounded">
            <div className="row">
              <Order ref={(order) => (this.order = order)} />
            </div>
          </div>
        </div>
      </IntlProvider>
    );
  }
}

export default Menu;
