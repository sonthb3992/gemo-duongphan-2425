import React from "react";
import { Alert } from "react-bootstrap";
import { FormattedMessage, IntlProvider } from "react-intl";
const FOOD_BASE_PRICE = 3;

const FOOD_CUSTOMIZATIONS = {
  sandwich: {
    Egg: 1,
    Turkey: 1,
  },
  bagel: {
    Butter: 0.5,
    "Cream Cheese": 0.5,
  },
  showError: false,
  errorText: "",
};

class Food extends React.Component {
  constructor(props) {
    super(props);
    const { food, additionalFoods } = props;
    this.state = {
      food,
      additionalFoods,
      price: 0,
    };
  }

  componentDidMount() {
    this.setPrice();
  }

  handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    const inputValue = type === "checkbox" ? checked : value;
    this.setState({
      showError: false,
      errorText: "",
    });
    if (name == "additionalFoods") {
      let { additionalFoods } = this.state;
      if (checked == true) additionalFoods.push(value);
      else {
        for (let i = additionalFoods.length - 1; i >= 0; i--) {
          if (additionalFoods[i] === value) {
            additionalFoods.splice(i, 1);
          }
        }
      }
      this.setState({ additionalFoods }, () => {
        this.setPrice();
      });
    } else if (name == "food") {
      this.setState({ [name]: inputValue, additionalFoods: [] }, () => {
        this.setPrice();
      });
    }
  };

  getCustomizationPrice() {
    const foodCustomization = FOOD_CUSTOMIZATIONS[this.state.food];
    if (!foodCustomization) {
      this.setState({
        showError: true,
        errorText: `Invalid food: ${this.state.food}. Please choose a valid food.`,
      });
      return 0;
    }

    let additionalFoods = this.state.additionalFoods;
    let additionalFoodsPrice = 0;
    for (let i = 0; i < additionalFoods.length; i++) {
      let additionalFood = additionalFoods[i];
      let additionalFoodPrice = foodCustomization[additionalFood];
      if (additionalFoodPrice === undefined) {
        this.setState({
          showError: true,
          errorText: `Invalid additionalFood: ${additionalFood} for food: ${this.state.food}. Please choose a valid additionalFood.`,
        });
        return 0;
      }
      additionalFoodsPrice += additionalFoodPrice;
    }
    return additionalFoodsPrice;
  }

  getBasePrice() {
    return FOOD_BASE_PRICE;
  }

  handleAddToCart = () => {
    const { showError, errorText, ...itemCopy } = this.state;
    this.props.onAddToCart(itemCopy);
  };

  setPrice() {
    const basePrice = this.getBasePrice();
    const customizationPrice = this.getCustomizationPrice();
    const totalPrice = basePrice + customizationPrice;

    this.setState(
      {
        price: totalPrice,
      },
      () => {
        this.props.onChange(this.state, this.state.price);
      }
    );

    return totalPrice;
  }

  render() {
    const { food, additionalFoods, showError, errorText } = this.state;

    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <h2>Food</h2>
            {showError && (
              <Alert
                variant="danger"
                onClose={() => this.setState({ showError: false })}
              >
                {errorText}
              </Alert>
            )}
            <label className="form-label">Food:</label>
            <select
              className="form-control"
              name="food"
              value={this.state.food}
              onChange={this.handleInputChange}
            >
              <option value="sandwich">Sandwich</option>
              <option value="bagel">Bagel</option>
            </select>
            <br />
            <label className="form-label">Additional Food:</label>
            <ul className="list-group">
              {Object.keys(FOOD_CUSTOMIZATIONS[food]).map((additionalFood) => (
                <li key={additionalFood} className="list-group-item">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="additionalFoods"
                      value={additionalFood}
                      checked={additionalFoods.includes(additionalFood)}
                      onChange={this.handleInputChange}
                    />
                    <label className="form-check-label">{additionalFood}</label>
                  </div>
                </li>
              ))}
            </ul>
            <div className="text-center">
              <h3>Price: ${this.state.price.toFixed(2)}</h3>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="btn btn-primary mt-2"
                onClick={this.handleAddToCart}
              >
                <FormattedMessage
                  id="menu.addCart"
                  defaultMessage="Add To Cart"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Food;
