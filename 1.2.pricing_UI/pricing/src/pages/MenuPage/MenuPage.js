import React from "react";
import { tw } from "twind";
import Item from "../../components/Item/Item";
import Cart from "../../components/Cart/Cart";
import { FormattedMessage, IntlProvider } from "react-intl";

import coffeeImage from "../../images/coffee.png";
import milkteaImage from "../../images/milktea.png";
import bagelImage from "../../images/bagel.png";
import sandwichImage from "../../images/sandwich.png";
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar.js";

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
      user: null,
      locale: "en",
    };
  }

  componentDidMount() {
    const user = JSON.parse(localStorage.getItem("user"));
    this.setState({ user });
  }

  handleTabChange = (tab) => {
    this.setState({ currentTab: tab });
  };

  handleAddToCart = (item) => {
    this.cart.addToCart(item);
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

  render() {
    const { currentTab, menuItems, user, locale } = this.state;

    const filteredItems =
      currentTab === "all"
        ? menuItems
        : menuItems.filter((item) => item.type === currentTab);

    return (
      <IntlProvider locale={locale} messages={this.getLocaleMessages(locale)}>
        <CustomNavbar />
        <div>
          <div className={tw`container mx-auto px-4 py-8`}>
            <nav className={tw`flex mb-4`}>
              <button
                className={tw`mr-4 text-blue-500 hover:text-blue-700 font-bold`}
                onClick={() => this.handleTabChange("all")}
              >
                All Items
              </button>
              <button
                className={tw`mr-4 text-blue-500 hover:text-blue-700 font-bold`}
                onClick={() => this.handleTabChange("drink")}
              >
                Drinks
              </button>
              <button
                className={tw`text-blue-500 hover:text-blue-700 font-bold`}
                onClick={() => this.handleTabChange("food")}
              >
                Food
              </button>
            </nav>

            <div
              className={tw`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4`}
            >
              {filteredItems.map((item) => (
                <Item
                  key={item.id}
                  item={item}
                  onAddToCart={this.handleAddToCart}
                />
              ))}
            </div>
          </div>
          {user && user.role === "customer" && (
            <div class="container border rounded">
              <div className="row">
                <Cart ref={(cart) => (this.cart = cart)} />
              </div>
            </div>
          )}
        </div>
      </IntlProvider>
    );
  }
}

export default MenuPage;
