import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Modal } from "react-bootstrap";
import { FormattedMessage, injectIntl } from "react-intl";
import CustomAlert from "../CustomAlert/CustomAlert";
import { removeFromCart, clearCart } from "../../redux/actions/cartActions";
import { showAlert } from "../../redux/actions/alertActions";

import axios from "axios";
const backendUrl =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:8000/api";

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: props.isModalOpen,
      user: JSON.parse(localStorage.getItem("user")),
    };
  }

  handleRemoveCartItem = (itemId) => {
    this.props.removeFromCart(itemId);
  };

  handleClearCart = () => {
    this.props.clearCart();
  };

  handleAddToOrder = async () => {
    const { user } = this.state;
    const { cart } = this.props;
    const order = cart;
    const updatedOrder = {
      ...order,
      status: "Pending",
      items: order.items.map(({ id, ...item }) => item),
    };

    try {
      const response = await axios.post(
        `${backendUrl}/users/${user._id}/orders`,
        updatedOrder
      );
      // clear cart
      this.handleClearCart();

      // show alert
      this.props.showAlert("success", "Order created successfully");
    } catch (error) {
      // show error alert
      this.props.showAlert("danger", `Error creating order: ${error.message}`);
    }
  };

  render() {
    const { cart } = this.props;
    const { items } = cart;

    console.log("cart: ", cart);

    return (
      <>
        <Modal
          show={this.state.isModalOpen}
          onHide={this.props.handleClose}
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
                              {item.type} {item.drink}: size {item.size}
                              {item.hasWhippingCream && ", has whipping cream"}
                              {item.milkOption !== "None" &&
                                `, ${item.milkOption}`}
                              {item.chocolateSaucePumps > 0 &&
                                `, ${item.chocolateSaucePumps} chocolate sauce`}
                            </p>
                          ) : (
                            <p>
                              {item.food}
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
                      </tr>
                    ))}
                    <tr>
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
            <Button onClick={this.props.handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  cart: state.cart,
});

const mapDispatchToProps = {
  removeFromCart,
  clearCart,
  showAlert,
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Cart));
