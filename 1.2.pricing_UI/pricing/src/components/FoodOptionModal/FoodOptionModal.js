import React from "react";
import { tw } from "twind";
import sandwichImage from "../../images/sandwich.png";

const FOOD_CUSTOMIZATIONS = {
  Sandwich: {
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

class FoodOptionModal extends React.Component {
  state = {
    selectedCustomizations: [],
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

  handleOptionChange = (event) => {
    const { name, checked } = event.target;
    const { selectedCustomizations } = this.state;

    let updatedCustomizations;

    if (checked) {
      updatedCustomizations = [...selectedCustomizations, name];
    } else {
      updatedCustomizations = selectedCustomizations.filter(
        (customization) => customization !== name
      );
    }

    this.setState({ selectedCustomizations: updatedCustomizations });
  };

  handleConfirm = () => {
    const { selectedCustomizations } = this.state;
    const { onConfirm } = this.props;

    const totalCustomizationPrice = selectedCustomizations.reduce(
      (total, customization) =>
        total + FOOD_CUSTOMIZATIONS.sandwich[customization],
      0
    );

    onConfirm(totalCustomizationPrice);
  };

  render() {
    const { open, onClose, item } = this.props;
    const { selectedCustomizations } = this.state;

    if (!open) {
      return null;
    }

    return (
      <div className={tw`modal fixed inset-0 flex items-center justify-center`}>
        <div
          className={tw`modal-content bg-white rounded-lg p-6 max-w-md mt-10`}
        >
          <div className={tw`flex items-center mb-4`}>
            <img
              className={tw`inset-0 object-cover w-30 h-20 transition duration-300 transform hover:scale-110`}
              src={item.image}
              alt="Item Image"
            />
            <h2 className={tw`ml-4 text-2xl font-bold`}>Additional Options</h2>
          </div>
          <p className={tw`mb-4`}>Select additional options for your food:</p>

          <div className={tw`mb-4`}>
            {Object.keys(FOOD_CUSTOMIZATIONS.sandwich).map((customization) => (
              <label key={customization} className={tw`mr-4 flex items-center`}>
                <input
                  type="radio"
                  name={customization}
                  checked={selectedCustomizations.includes(customization)}
                  onChange={this.handleOptionChange}
                  className={tw`form-checkbox mr-2`}
                />
                {customization}
              </label>
            ))}
          </div>

          {FOOD_CUSTOMIZATIONS.showError && (
            <p className={tw`text-red-500 mb-4`}>
              {FOOD_CUSTOMIZATIONS.errorText}
            </p>
          )}

          <div className={tw`flex justify-end items-center mt-4`}>
            <div className={tw`mr-20 text-lg font-bold`}>
              <strong>Price:</strong> ${2}
            </div>
            <div>
              <button
                onClick={this.handleConfirm}
                className={tw`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2`}
              >
                Confirm
              </button>
              <button
                onClick={onClose}
                className={tw`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FoodOptionModal;
