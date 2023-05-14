// Menu.js

import React, { Component } from "react";
import Drink from "./Drink";
import Food from "./Food";
import { v4 as uuidv4 } from "uuid";

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
      order: [],
      orderPrice: {
        totalOrderPrice: 0,
        tax: 0,
        totalOrderPriceAfterTax: 0,
      },
    };
  }

  // Drink
  handleAddDrink = (event, drink) => {
    event.preventDefault();
    const { order } = this.state;
    const uniqueId = uuidv4();
    const newDrink = { ...drink, id: uniqueId };
    console.log("newDrink", newDrink);
    const newOrder = [...order, newDrink];
    this.setState({ order: newOrder }, () => {
      this.updateOrderTotalPrice();
    });
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
    } else {
      for (let i = 0; i < order.length; ++i) {
        if (order[i].id == updatedDrink.id) {
          order[i].drink = updatedDrink.drink;
          order[i].type = updatedDrink.type;
          order[i].size = updatedDrink.size;
          order[i].hasWhippingCream = updatedDrink.hasWhippingCream;
          order[i].milkOption = updatedDrink.milkOption;
          order[i].chocolateSaucePumps = updatedDrink.chocolateSaucePumps;
          order[i].price = price;
        }
      }
      this.setState({ order }, () => this.updateOrderTotalPrice());
    }
  };

  // Food
  handleAddFood = (event, food) => {
    event.preventDefault();
    const { order } = this.state;
    const uniqueId = uuidv4();
    const newFood = { ...food, id: uniqueId };
    const newOrder = [...order, newFood];
    this.setState({ order: newOrder }, () => {
      this.updateOrderTotalPrice();
    });
  };

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
    } else {
      for (let i = 0; i < order.length; ++i) {
        if (order[i].id == updatedFood.id) {
          order[i].food = updatedFood.food;
          order[i].additionalFoods = newAdditionalFoods;
          order[i].price = price;
        }
      }
      this.setState({ order }, () => this.updateOrderTotalPrice());
    }
  };

  // Order
  updateOrderTotalPrice = () => {
    let { order } = this.state;
    let totalOrderPrice = 0;
    for (let i = 0; i < order.length; ++i) {
      totalOrderPrice = totalOrderPrice + order[i].price;
    }
    let tax = totalOrderPrice * 0.0725;
    let totalOrderPriceAfterTax = totalOrderPrice + tax;
    this.setState({
      orderPrice: { totalOrderPrice, tax, totalOrderPriceAfterTax },
    });
  };

  handleRemoveOrderItem = (id) => {
    this.setState(
      (prevState) => ({
        order: prevState.order.filter((item) => item.id !== id),
      }),
      () => {
        this.updateOrderTotalPrice();
      }
    );
  };

  handleClearOrder = () => {
    this.setState({ order: [], orderPrice: 0 }, () => {
      this.updateOrderTotalPrice();
    });
  };

  render() {
    const { drink, food, order, orderPrice } = this.state;
    console.log(order);
    return (
      <div>
        <h2>Menu</h2>
        <div className="row">
          <div className="col-md-6">
            <form onSubmit={(event) => this.handleAddDrink(event, drink)}>
              <Drink
                {...drink}
                onChange={(drink, price) =>
                  this.handleDrinkUpdate(drink, price)
                }
              />
              <div className="text-center">
                <button type="submit" className="btn btn-primary mt-2">
                  Add to Order
                </button>
              </div>
            </form>
          </div>
          <div className="col-md-6" style={{ borderLeft: "1px solid black" }}>
            <form onSubmit={(event) => this.handleAddFood(event, food)}>
              <Food
                {...food}
                onChange={(food, price) => this.handleFoodUpdate(food, price)}
              />
              <div className="text-center">
                <button type="submit" className="btn btn-primary mt-2">
                  Add to Order
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="container">
          <div class="row">
            <div class="col-md-10 mx-auto">
              <h2>Order</h2>
              {order.length > 0 ? (
                <div>
                  {order.map((item) => (
                    <div key={item.id}>
                      {item.drink !== undefined ? (
                        <Drink
                          {...item}
                          onChange={(drink, price) =>
                            this.handleDrinkUpdate(drink, price)
                          }
                        />
                      ) : (
                        <Food
                          {...item}
                          onChange={(food, price) =>
                            this.handleFoodUpdate(food, price)
                          }
                        />
                      )}
                      <div class="row">
                        <button
                          className="btn btn-danger mx-auto"
                          onClick={() => this.handleRemoveOrderItem(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <br />
                  <div className="text-center">
                    <button
                      onClick={this.handleClearOrder}
                      className="btn btn-secondary mr-2"
                    >
                      Clear Order
                    </button>
                    <div className="text-center">
                      <h3>
                        Order Price: ${orderPrice.totalOrderPrice.toFixed(2)}
                      </h3>
                      <h3>Tax: ${orderPrice.tax.toFixed(2)}</h3>
                      <h3>
                        Order Price After Tax: $
                        {orderPrice.totalOrderPriceAfterTax.toFixed(2)}
                      </h3>
                    </div>
                  </div>
                </div>
              ) : (
                <p>No items in order.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Menu;
