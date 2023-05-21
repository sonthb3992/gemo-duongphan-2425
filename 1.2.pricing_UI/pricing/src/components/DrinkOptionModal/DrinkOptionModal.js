import React from "react";
import { tw } from "twind";

const TYPE_DRINKS_BASE_PRICES = {
  Coffee: 2,
  "Milk Tea": 2.25,
};

const TYPE_ADJUSTMENTS = {
  Hot: 0,
  Cold: 0,
  Blended: 1,
};

const SIZE_ADJUSTMENTS = {
  S: 0,
  M: 0.5,
  L: 1,
  XL: 1.5,
};

const MILK_OPTION_ADJUSTMENTS = {
  None: 0,
  "Whole Milk": 0,
  "Almond Milk": 0.5,
};

class DrinkOptionModal extends React.Component {
  state = {
    type: "Hot",
    size: "S",
    milkOption: "None",
    chocolateSaucePumps: 0,
  };

  handleOptionChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleIncrement = () => {
    this.setState((prevState) => ({
      chocolateSaucePumps: prevState.chocolateSaucePumps + 1,
    }));
  };

  handleDecrement = () => {
    this.setState((prevState) => ({
      chocolateSaucePumps: Math.max(0, prevState.chocolateSaucePumps - 1),
    }));
  };

  handleConfirm = () => {
    this.props.onConfirm(this.state);
  };

  render() {
    const { open, onClose } = this.props;

    if (!open) {
      return null;
    }

    return (
      <div className={tw`modal fixed inset-0 flex items-center justify-center`}>
        <div
          className={tw`modal-content bg-white rounded-lg p-6 max-w-md mt-10`}
        >
          <h2 className={tw`text-2xl font-bold mb-4`}>Additional Options</h2>
          <p className={tw`mb-4`}>Select additional options for your drink:</p>

          <div className={tw`mb-4`}>
            <label className={tw`mr-2`}>Type:</label>
            <div className={tw`flex items-center`}>
              {Object.keys(TYPE_ADJUSTMENTS).map((type) => (
                <label key={type} className={tw`mr-4 flex items-center`}>
                  <input
                    type="radio"
                    name="type"
                    value={type}
                    checked={this.state.type === type}
                    onChange={this.handleOptionChange}
                    className={tw`form-radio mr-2`}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          <div className={tw`mb-4`}>
            <label className={tw`mr-2`}>Size:</label>
            <div className={tw`flex items-center`}>
              {Object.keys(SIZE_ADJUSTMENTS).map((size) => (
                <label key={size} className={tw`mr-4 flex items-center`}>
                  <input
                    type="radio"
                    name="size"
                    value={size}
                    checked={this.state.size === size}
                    onChange={this.handleOptionChange}
                    className={tw`form-radio mr-2`}
                  />
                  {size}
                </label>
              ))}
            </div>
          </div>

          <div className={tw`mb-4`}>
            <label className={tw`mr-2`}>Milk Option:</label>
            <div className={tw`flex items-center`}>
              {Object.keys(MILK_OPTION_ADJUSTMENTS).map((milkOption) => (
                <label key={milkOption} className={tw`mr-4 flex items-center`}>
                  <input
                    type="radio"
                    name="milkOption"
                    value={milkOption}
                    checked={this.state.milkOption === milkOption}
                    onChange={this.handleOptionChange}
                    className={tw`form-radio mr-2`}
                  />
                  {milkOption.replace("_", " ")}
                </label>
              ))}
            </div>
          </div>

          <div className={tw`mb-4`}>
            <label className={tw`mr-2`}>Chocolate Sauce Pumps:</label>
            <div className={tw`flex items-center`}>
              <button
                onClick={this.handleDecrement}
                className={tw`bg-gray-200 text-gray-700 px-2 py-1 rounded-l`}
              >
                -
              </button>
              <div className={tw`form-input px-2 w-16 text-center`}>
                {this.state.chocolateSaucePumps}
              </div>
              <button
                onClick={this.handleIncrement}
                className={tw`bg-gray-200 text-gray-700 px-2 py-1 rounded-r`}
              >
                +
              </button>
            </div>
          </div>

          <div className={tw`flex justify-end items-center mt-4`}>
            <div className={tw`mr-12 text-lg font-bold`}>
              <strong>Final Price:</strong> ${2}
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

export default DrinkOptionModal;
