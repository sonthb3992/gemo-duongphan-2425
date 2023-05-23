// import React, { Component } from "react";

import { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import { IntlProvider, FormattedMessage } from "react-intl";
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
    };

    this.handleClose = props.handleClose;
    this.updateCartTotalPrice();
  }

  componentDidMount = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    this.setState({ user });
  };
  // addToCart = (item) => {
  //   const { cart } = this.state;
  //   const updatedItem = {
  //     ...item,
  //   };
  //   const updatedItems = [...cart.items, updatedItem];
  //   const updatedCart = {
  //     ...cart,
  //     items: updatedItems,
  //   };
  //   this.setState({ cart: updatedCart }, () => {
  //     this.updateCartTotalPrice();
  //   });
  // };

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

  handleRemoveCartItem = (id) => {
    const { cart } = this.state;
    for (let i = 0; i < cart.items.length; ++i) {
      if (cart.items[i].id === id) {
        cart.items.splice(i, 1);
      }
    }
    this.setCartItems(cart.items);
    this.setState(cart, () => {
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
    console.log(updatedOrder);

    try {
      const response = await axios.post(
        `${backendUrl}/users/${user._id}/orders`,
        updatedOrder
      );
      const createdOrder = response.data;
      // clear cart
      // this.handleClearCart();

      this.getOrdersByUserId();
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  render() {
    const { cart } = this.state;
    const { items } = cart;

    return (
      <IntlProvider>
        <Modal
          show={this.state.isModalOpen}
          onHide={this.handleClose}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">Cart</Modal.Title>
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
                    {items.map((item) => (
                      <tr key={item.id}>
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
                            onClick={() => this.handleRemoveCartItem(item.id)}
                          >
                            <FormattedMessage
                              id="cart.remove"
                              defaultMessage="Remove"
                            />
                          </button>
                        </td>
                        <td></td>
                      </tr>
                    ))}
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>
                        <button
                          onClick={this.handleClearCart}
                          className="btn btn-secondary"
                        >
                          <FormattedMessage
                            id="cart.clear"
                            defaultMessage="Clear Cart"
                          />
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>
                        <button
                          onClick={this.handleAddToOrder}
                          className="btn btn-success"
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
                    <td>
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
                  {/* <td>${cart.cartPrice.totalCartPrice.toFixed(2)}</td> */}
                  <td></td>
                </tr>
                <tr>
                  <td>Tax:</td>
                  <td></td>
                  {/* <td>${cart.cartPrice.tax.toFixed(2)}</td> */}
                  <td></td>
                </tr>
                <tr>
                  <td>Total Price After Tax:</td>
                  <td></td>
                  {/* <td>${cart.cartPrice.totalCartPriceAfterTax.toFixed(2)}</td> */}
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
