// import React, { Component } from "react";
// import { FormattedMessage } from "react-intl";

import { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import { FormattedMessage } from "react-intl";
import axios from "axios";
import './Cart.css';
import { HiOutlineTrash } from "react-icons/hi";
import emptyCartImage from '../../images/empty_cart.png';

const backendUrl =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:8000/api";

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: {
        items: this.getCartItems(),
        status: "",
        id: "",
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
    console.log("cart", cart);
    const order = cart;
    console.log(order);
    const updatedOrder = {
      ...order,
      status: "Pending",
      items: order.items.map((item) => ({
        ...item,
      })),
    };

    try {
      await axios.post(
        `${backendUrl}/users/${user._id}/orders`,
        updatedOrder
      );
      // const createdOrder = response.data;
      // clear cart
      this.handleClearCart();

      this.getOrdersByUserId();
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  formatDrinkTopping(item) {
    let topping = "";
    if (!item.hasWhippingCream && item.milkOption === "None") topping = "None";
    else if (!item.hasWhippingCream && item.milkOption !== "None") topping = item.milkOption;
    else if (item.hasWhippingCream && item.milkOption === "None") topping = "Whipping cream";
    else topping = "Whipping cream, " + item.milkOption;

    if (item.chocolateSaucePumps && item.chocolateSaucePumps > 0) topping += ", Chocolate Sauce (" + item.chocolateSaucePumps + ")";
    return topping;
  }

  formatFoodTopping(item) {
    if (!item.selectedCustomizations.length) return "None";
    let topping = "";
    for (let i = 0; i < item.selectedCustomizations.length; i++) {
      if (i !== item.selectedCustomizations.length - 1) topping += item.selectedCustomizations[i] + ", "
      else topping += item.selectedCustomizations[i]
    }

    return topping;
  }

  render() {
    const { cart } = this.state;
    const { items } = cart;

    return (
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
          {items.length > 0 ? (
            <table className="table">
              <tbody>
                <>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td style={{ width: 150 }}>
                        <img
                          className="cart-image"
                          src={item.image}
                          alt={item.name}
                        />
                      </td>
                      <td>
                        {item.drink !== undefined ? (<p><b>Drink:</b> {item.drink}</p>) : (<p><b>Food:</b> {item.food}</p>)}
                        {item.drink !== undefined ? (<p><b>Type:</b> {item.type}</p>) : <></>}
                        {item.drink !== undefined ? (<p><b>Size:</b> {item.size}</p>) : <></>}
                        {item.drink !== undefined ? (
                          <p style={{ wordWrap: "break-word" }}>
                            <b>Topping:</b> {this.formatDrinkTopping(item)}
                          </p>) : (
                          <p style={{ wordWrap: "break-word" }}>
                            <b>Topping:</b> {this.formatFoodTopping(item)}
                          </p>)}
                      </td>
                      <td style={{ verticalAlign: "middle", width: 100 }}><b>${item.price.toFixed(2)}</b></td>
                      <td style={{ width: 150, verticalAlign: "middle" }}>
                        <button
                          className="btn btn-danger"
                          onClick={() => this.handleRemoveCartItem(item.id)}
                          style={{ padding: 10, fontSize: 20 }}
                        >
                          {/* <FormattedMessage
                            id="cart.remove"
                            defaultMessage="Remove"
                          /> */}
                          <HiOutlineTrash />
                        </button>
                      </td>
                      <td></td>
                    </tr>
                  ))}
                  {/* <tr>
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
                  </tr> */}
                </>

              </tbody>
            </table>
          ) : (
            <>
              <div className="d-flex justify-content-center">
                <img style={{ width: 500 }} src={emptyCartImage} alt="empty" />
              </div>
              <div className="d-flex justify-content-center" style={{fontSize: 25, fontWeight: 500, color: "#7290d4"}}>
                <FormattedMessage
                  id="cart.empty"
                  defaultMessage="No items in cart"
                />
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleClose}>Cancel</Button>
          {items.length ? (<button
            onClick={this.handleAddToOrder}
            className="btn btn-success"
          >
            <FormattedMessage
              id="cart.addOrder"
              defaultMessage="Add To Order"
            />
          </button>) : (<>
          </>)}

        </Modal.Footer>
      </Modal>
    );
  }
}

export default Cart;
