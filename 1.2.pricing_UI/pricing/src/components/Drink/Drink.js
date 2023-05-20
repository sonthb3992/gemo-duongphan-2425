import React from "react";
import { Alert } from "react-bootstrap";
import { FormattedMessage, IntlProvider } from "react-intl";

const TYPE_DRINKS_BASE_PRICES = {
  coffee: 2,
  milk_tea: 2.25,
};

const TYPE_ADJUSTMENTS = {
  hot: 0,
  cold: 0,
  blended: 1,
};

const SIZE_ADJUSTMENTS = {
  S: 0,
  M: 0.5,
  L: 1,
  XL: 1.5,
};

const MILK_OPTION_ADJUSTMENTS = {
  none: 0,
  whole_milk: 0,
  almond_milk: 0.5,
};

const WHIPPING_CREAM_ADJUSTMENT = 0.5;

const CHOCOLATE_SAUCE_PUMP_PRICE = 0.5;
const MAX_CHOCOLATE_SAUCE_PUMPS = 6;

class Drink extends React.Component {
  constructor(props) {
    super(props);
    const {
      drink,
      type,
      size,
      hasWhippingCream,
      milkOption,
      chocolateSaucePumps,
    } = props;
    this.state = {
      drink,
      type,
      size,
      hasWhippingCream,
      milkOption,
      chocolateSaucePumps,
      price: 0,
      showError: false,
      errorText: "",
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
    this.setState({ [name]: inputValue }, () => {
      this.setPrice();
    });
  };

  getBasePriceByDrink() {
    if (TYPE_DRINKS_BASE_PRICES[this.state.drink] === undefined) {
      this.setState({
        showError: true,
        errorText: `Invalid drink ${this.state.drink} selected. Please choose a valid drink.`,
      });
      return 0;
    }
    return TYPE_DRINKS_BASE_PRICES[this.state.drink];
  }

  getTypeAdjustment() {
    if (TYPE_ADJUSTMENTS[this.state.type] === undefined) {
      this.setState({
        showError: true,
        errorText: `Invalid drink ${this.state.type} selected. Please choose a valid type.`,
      });
      return 0;
    }
    return TYPE_ADJUSTMENTS[this.state.type];
  }

  getSizeAdjustment() {
    if (this.state.size === "L" && this.state.type === "hot") {
      this.setState({
        showError: true,
        errorText: `Invalid size ${this.state.size} for ${this.state.type} drink. Please choose a valid size.`,
      });
      return 0;
    }
    if (SIZE_ADJUSTMENTS[this.state.size] === undefined) {
      this.setState({
        showError: true,
        errorText: "Invalid drink size selected. Please choose a valid size.",
      });
      return 0;
    }
    return SIZE_ADJUSTMENTS[this.state.size];
  }

  getWhippingCreamAdjustment() {
    return this.state.hasWhippingCream ? WHIPPING_CREAM_ADJUSTMENT : 0;
  }

  getMilkOptionAdjustment() {
    if (MILK_OPTION_ADJUSTMENTS[this.state.milkOption] === undefined) {
      this.setState({
        showError: true,
        errorText: `Invalid milk option: ${this.state.milkOption}. Please choose a valid option.`,
      });
      return 0;
    }
    return MILK_OPTION_ADJUSTMENTS[this.state.milkOption];
  }

  getChocolateSauceAdjustment() {
    if (this.state.chocolateSaucePumps > 0 && this.state.type !== "hot") {
      this.setState({
        showError: true,
        errorText: `Chocolate sauce pumps cannot be added to a ${this.state.type} drink.`,
      });
      return 0;
    }
    if (this.state.chocolateSaucePumps > MAX_CHOCOLATE_SAUCE_PUMPS) {
      this.setState({
        showError: true,
        errorText: `Invalid number of chocolate sauce pumps: ${this.state.chocolateSaucePumps}. Please choose a valid number.`,
      });
      return 0;
    }
    return this.state.chocolateSaucePumps <= 2
      ? 0
      : (this.state.chocolateSaucePumps - 2) * CHOCOLATE_SAUCE_PUMP_PRICE;
  }

  setPrice() {
    const basePrice = this.getBasePriceByDrink();
    const typeAdjustment = this.getTypeAdjustment();
    const sizeAdjustment = this.getSizeAdjustment();
    const whippingCreamAdjustment = this.getWhippingCreamAdjustment();
    const milkOptionAdjustment = this.getMilkOptionAdjustment();
    const chocolateSauceAdjustment = this.getChocolateSauceAdjustment();

    const totalPrice =
      basePrice +
      typeAdjustment +
      sizeAdjustment +
      whippingCreamAdjustment +
      milkOptionAdjustment +
      chocolateSauceAdjustment;

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

  handleAddToCart = () => {
    const { showError, errorText, ...itemCopy } = this.state;
    this.props.onAddToCart(itemCopy);
  };
  render() {
    const { showError, errorText } = this.state;
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <h2>Drink</h2>
            {showError && (
              <Alert
                variant="danger"
                onClose={() => this.setState({ showError: false })}
              >
                {errorText}
              </Alert>
            )}
            <form>
              <div className="form-group">
                <label>Drink:</label>
                <select
                  name="drink"
                  value={this.state.drink}
                  onChange={this.handleInputChange}
                  className="form-control"
                >
                  <option value="coffee">Coffee</option>
                  <option value="milk_tea">Milk Tea</option>
                </select>
              </div>
              <div className="form-group">
                <label>Type:</label>
                <select
                  name="type"
                  value={this.state.type}
                  onChange={this.handleInputChange}
                  defaultValue="hot"
                  className="form-control"
                >
                  <option value="hot">Hot</option>
                  <option value="cold">Cold</option>
                  <option value="blended">Blended</option>
                </select>
              </div>
              <div className="form-group">
                <label>Size:</label>
                <select
                  name="size"
                  value={this.state.size}
                  onChange={this.handleInputChange}
                  defaultValue="S"
                  className="form-control"
                >
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                </select>
              </div>
              <div className="form-check">
                <input
                  type="checkbox"
                  name="hasWhippingCream"
                  checked={this.state.hasWhippingCream}
                  onChange={this.handleInputChange}
                  className="form-check-input"
                />
                <label className="form-check-label">Whipping Cream</label>
              </div>
              <div className="form-group">
                <label>Milk Option:</label>
                <select
                  name="milkOption"
                  value={this.state.milkOption}
                  onChange={this.handleInputChange}
                  defaultValue="none"
                  className="form-control"
                >
                  <option value="none">None</option>
                  <option value="whole_milk">Whole Milk</option>
                  <option value="almond_milk">Almond Milk</option>
                </select>
              </div>
              <div className="form-group">
                <label>Chocolate Sauce Pumps:</label>
                <input
                  type="number"
                  name="chocolateSaucePumps"
                  value={this.state.chocolateSaucePumps}
                  onChange={this.handleInputChange}
                  className="form-control"
                />
              </div>
            </form>
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

export default Drink;
