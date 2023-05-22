// Menu.js

import React, { Component } from "react";
import Drink from "../../components/Drink/Drink";
import Food from "../../components/Food/Food";
import { FormattedMessage, IntlProvider } from "react-intl";
import { Form } from "react-bootstrap";
import Cart from "../../components/Cart/Cart";
import Order from "../../components/Order/Order";
import NavBar from "../../components/NavBar";
import { Navigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

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

class MenuPage extends Component {
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

  handleAddToCart = (item) => {
    item.id = uuidv4();
    var cartItems = JSON.parse(localStorage.getItem("cartItems"));
    const newCartItems = cartItems ? [...cartItems, item] : [item]
    localStorage.setItem("cartItems", JSON.stringify(newCartItems));
  };

  handleAddToOrder = (cart) => {
    this.order.addToOrder(cart);
  };

  handleDrinkUpdate = (updatedDrink, price) => {
    if (updatedDrink && updatedDrink.id === undefined) {
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

    if (updatedFood.id === undefined) {
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

  // Language
  getLocaleMessages(locale) {
    switch (locale) {
      case "vn":
        return require("../../components/lang/vn.json");
      default:
        return require("../../components/lang/en.json");
    }
  }

  handleLanguageChange = (event) => {
    this.setState({ locale: event.target.value });
  };

  render() {
    const { locale, drink, food, order } = this.state;
    const user = JSON.parse(localStorage.getItem("user"));
    if (user == null) {
      return <Navigate to="/login" />;
    }

    return (
      <IntlProvider locale={locale} messages={this.getLocaleMessages(locale)}>
        <NavBar />
        <div className="d-flex justify-content-end">
          <Form.Select value={locale} onChange={this.handleLanguageChange}>
            <option value="en">English</option>
            <option value="vn">Tiếng Việt</option>
          </Form.Select>
        </div>
        <div>
          {user && user.role === "customer" && (
            <div className="row" style={{ marginRight: 0 }}>
              <div className="col-md-6">
                <Drink
                  {...drink}
                  onChange={(drink, price) =>
                    this.handleDrinkUpdate(drink, price)
                  }
                  onAddToCart={this.handleAddToCart}
                />
              </div>
              <div
                className="col-md-6"
                style={{ borderLeft: "1px solid black" }}
              >
                <Food
                  {...food}
                  onChange={(food, price) => this.handleFoodUpdate(food, price)}
                  onAddToCart={this.handleAddToCart}
                />
              </div>
            </div>
          )}
          <hr />
          {/* {user && user.role === "customer" && (
            <div class="container border rounded">
              <div className="row">
                <Cart
                  ref={(cart) => (this.cart = cart)}
                  addToOrder={this.handleAddToOrder}
                />
              </div>
            </div>
          )}
          <hr /> */}
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

export default MenuPage;
