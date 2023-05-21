import React from "react";
import { tw } from "twind";
import Item from "../../components/Item/Item";
import coffeeImage from "../../images/coffee.png";
import milkteaImage from "../../images/milktea.png";
import bagelImage from "../../images/bagel.png";
import sandwichImage from "../../images/sandwich.png";

class MenuPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: "all",
      menuItems: [
        {
          id: 1,
          name: "Coffee",
          type: "drink",
          image: coffeeImage,
          price: 2,
        },
        {
          id: 2,
          name: "Milk Tea",
          type: "drink",
          image: milkteaImage,
          price: 2.25,
        },
        { id: 3, name: "Bagel", type: "food", image: bagelImage, price: 3 },
        {
          id: 4,
          name: "Sandwich",
          type: "food",
          image: sandwichImage,
          price: 3,
        },
      ],
    };
  }

  handleTabChange = (tab) => {
    this.setState({ currentTab: tab });
  };

  render() {
    const { currentTab, menuItems } = this.state;

    const filteredItems =
      currentTab === "all"
        ? menuItems
        : menuItems.filter((item) => item.type === currentTab);

    return (
      <div className={tw`container mx-auto px-4 py-8`}>
        <nav className={tw`flex mb-4`}>
          <button
            className={tw`mr-4 text-blue-500`}
            onClick={() => this.handleTabChange("all")}
          >
            All Items
          </button>
          <button
            className={tw`mr-4 text-blue-500`}
            onClick={() => this.handleTabChange("drink")}
          >
            Drinks
          </button>
          <button
            className={tw`text-blue-500`}
            onClick={() => this.handleTabChange("food")}
          >
            Food
          </button>
        </nav>
        <div
          className={tw`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4`}
        >
          {filteredItems.map((item) => (
            <Item key={item.id} item={item} />
          ))}
        </div>
      </div>
    );
  }
}

export default MenuPage;
