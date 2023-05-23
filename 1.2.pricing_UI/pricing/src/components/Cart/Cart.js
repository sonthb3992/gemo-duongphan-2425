import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import { IntlProvider, FormattedMessage } from "react-intl";
import CustomAlert from "../CustomAlert/CustomAlert";
import axios from "axios";

const backendUrl =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:8000/api";

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: {
        items: this.getCartItems(),
        status: "",
        cartPrice: {
          totalCartPrice: 0,
          tax: 0,
          totalCartPriceAfterTax: 0,
        },
      },
      locale: "en",
      isModalOpen: props.isModalOpen,
      alert: { show: false, message: "", type: "" },
    };

    this.handleClose = props.handleClose;
    this.updateCartTotalPrice();
  }

  componentDidMount = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    this.setState({ user });
  };

  getCartItems = () => {
    var cartItems = JSON.parse(localStorage.getItem("cartItems"));
    return cartItems ? cartItems : [];
  };

  setCartItems = (items) => {
    localStorage.setItem("cartItems", JSON.stringify(items));
  };

  updateCartTotalPrice = () => {
    let { cart } = this.state;
    let { items } = cart;
    let totalCartPrice = 0;
    for (let i = 0; i < items.length; ++i) {
      totalCartPrice = totalCartPrice + items[i].price;
    }
    let tax = totalCartPrice * 0.0725;
    let totalCartPriceAfterTax = totalCartPrice + tax;
    cart.cartPrice = { totalCartPrice, tax, totalCartPriceAfterTax };
    this.setState({
      cart,
    });
  };

  handleRemoveCartItem = (index) => {
    const { cart } = this.state;
    const updatedItems = [...cart.items];
    updatedItems.splice(index, 1);
    this.setCartItems(updatedItems);
    this.setState({ cart: { ...cart, items: updatedItems } }, () => {
      this.updateCartTotalPrice();
    });
  };

  handleClearCart = () => {
    const { cart } = this.state;
    cart.items = [];
    cart.status = "";
    this.setCartItems(cart.items);
    this.setState({ cart }, () => {
      this.updateCartTotalPrice();
    });
  };

  handleAddToOrder = async () => {
    const { cart, user } = this.state;
    const order = cart;
    const updatedOrder = {
      ...order,
      status: "Pending",
      items: order.items.map((item) => ({
        ...item,
      })),
    };

    try {
      const response = await axios.post(
        `${backendUrl}/users/${user._id}/orders`,
        updatedOrder
      );
      // clear cart
      this.handleClearCart();

      // show alert
      this.setState({
        alert: {
          show: true,
          message: "Order created successfully",
          type: "success",
        },
      });

      // this.getOrdersByUserId();
    } catch (error) {
      // show error alert
      this.setState({
        alert: {
          show: true,
          message: "Error creating order: " + error.message,
          type: "danger",
        },
      });
      console.error("Error creating order:", error);
    }
  };

  dismissAlert = () => {
    this.setState({
      alert: {
        show: false,
        message: "",
        type: "",
      },
    });
  };

  render() {
    const { cart } = this.state;
    const { items } = cart;

    return (
      <IntlProvider>
        {this.state.alert.show && (
          <CustomAlert
            type={this.state.alert.type}
            message={this.state.alert.message}
            dismiss={this.dismissAlert}
          />
        )}
        <Modal
          show={this.state.isModalOpen}
          onHide={this.handleClose}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Cart</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table className="table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? (
                  <>
                    {items.map((item, index) => (
                      <tr key={index}>
                        <td>
                          {item.drink !== undefined ? (
                            <p>
                              Drink: {item.type} {item.drink}: size {item.size}
                              {item.hasWhippingCream && ", has whipping cream"}
                              {item.milkOption !== "None" &&
                                `, ${item.milkOption}`}
                              {item.chocolateSaucePumps > 0 &&
                                `, ${item.chocolateSaucePumps} chocolate sauce`}
                            </p>
                          ) : (
                            <p>
                              Food: {item.food}
                              {item.selectedCustomizations.length > 0 && ": "}
                              {item.selectedCustomizations.map(
                                (food, index) => (
                                  <span key={index}>
                                    {`${food}${
                                      index !==
                                      item.selectedCustomizations.length - 1
                                        ? ", "
                                        : ""
                                    }`}
                                  </span>
                                )
                              )}
                            </p>
                          )}
                        </td>
                        <td>{1}</td>
                        <td>${item.price.toFixed(2)}</td>
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={() => this.handleRemoveCartItem(index)}
                          >
                            <FormattedMessage
                              id="cart.remove"
                              defaultMessage="Remove"
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td></td>
                      <td></td>
                      <td colSpan="4" className="m-2">
                        <button
                          onClick={this.handleClearCart}
                          className="btn btn-secondary"
                        >
                          <FormattedMessage
                            id="cart.clear"
                            defaultMessage="Clear Cart"
                          />
                        </button>
                        <button
                          onClick={this.handleAddToOrder}
                          className="btn btn-success m-2"
                        >
                          <FormattedMessage
                            id="cart.addOrder"
                            defaultMessage="Add To Order"
                          />
                        </button>
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td colSpan="4">
                      <FormattedMessage
                        id="cart.empty"
                        defaultMessage="No items in cart"
                      />
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td>Total Price:</td>
                  <td></td>
                  <td>${cart.cartPrice.totalCartPrice.toFixed(2)}</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Tax:</td>
                  <td></td>
                  <td>${cart.cartPrice.tax.toFixed(2)}</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Total Price After Tax:</td>
                  <td></td>
                  <td>${cart.cartPrice.totalCartPriceAfterTax.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      </IntlProvider>
    );
  }
}

export default Cart;
