import React from "react";
import { tw } from "twind";
import DrinkOptionModal from "../../components/DrinkOptionModal/DrinkOptionModal";

import coffeeImage from "../../images/coffee.png";
import cartIcon from "../../images/cart_icon.png";

class ItemOption extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
  }

  handleAddToCart = () => {
    this.setState({ showModal: true });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  handleConfirmModal = (options) => {
    // Handle the logic to add the item to the cart with the selected options
    // You can implement this according to your specific needs
    console.log("Item added to cart with options:", options);
    this.setState({ showModal: false });
  };

  render() {
    const { showModal } = this.state;

    return (
      <div
        className={tw`max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden`}
      >
        {showModal && (
          <DrinkOptionModal
            open={showModal}
            onClose={this.handleCloseModal}
            onConfirm={this.handleConfirmModal}
          />
        )}

        <div className={tw`relative h-40 bg-gray-300`}>
          <img
            className={tw`absolute inset-0 object-cover w-full h-full transition duration-300 transform hover:scale-110`}
            src={coffeeImage}
            alt="Coffee"
          />
        </div>
        <div className={tw`px-6 py-4 flex items-center justify-between`}>
          <div>
            <div className={tw`font-bold text-xl mb-2`}>Coffee</div>
            <p className={tw`text-gray-700 text-base mb-2 font-bold`}>
              Price: $2
            </p>
          </div>
          <button
            className={tw`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
            onClick={this.handleAddToCart}
          >
            <img
              className={tw`inline-block h-5 w-5 mr-2`}
              src={cartIcon}
              alt="Cart Icon"
            />
            Add to Cart
          </button>
        </div>
      </div>
    );
  }
}

export default ItemOption;
