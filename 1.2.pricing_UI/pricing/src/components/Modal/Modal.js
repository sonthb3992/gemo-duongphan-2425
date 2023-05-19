import React, { Component } from "react";

class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: JSON.parse(localStorage.getItem("user")),
    };
  }
  render() {
    const {
      activeCartId,
      activeCart,
      isModalOpen,
      closeModal,
      updateCartStatus,
    } = this.props;
    const { items } = activeCart;
    const { user } = this.state;
    return (
      <div
        className="modal"
        style={{ display: isModalOpen ? "block" : "none" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Items in Cart</h5>
              <button type="button" className="close" onClick={closeModal}>
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <ul className="list-group">
                {items.map((item, index) => (
                  <li key={index} className="list-group-item">
                    {item.drink && (
                      <div>
                        <p>
                          Drink: {item.type} {item.drink}: size {item.size}
                          {item.hasWhippingCream && ", has whipping cream"}
                          {item.milkOption !== "none" && `, ${item.milkOption}`}
                          {item.chocolateSaucePumps > 0 &&
                            `, ${item.chocolateSaucePumps} chocolate sauce`}
                        </p>
                      </div>
                    )}
                    {item.food && (
                      <div>
                        <p>
                          Food: {item.food}
                          {item.additionalFoods.length > 0 && ": "}
                          {item.additionalFoods.map((food, index) => (
                            <span key={index}>
                              {`${food}${
                                index !== item.additionalFoods.length - 1
                                  ? ", "
                                  : ""
                              }`}
                            </span>
                          ))}
                        </p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="modal-footer">
              <div>
                <span className="mr-2">Status: {activeCart.status}</span>
                <br />
                <span className="mr-2">
                  Price:{" $"}
                  {activeCart.cartPrice.totalCartPriceAfterTax.toFixed(2)}
                </span>
                {(activeCart.status === "Completed" ||
                  activeCart.status === "Cancelled") &&
                  null}
                {activeCart.status === "In Progress" ||
                  (activeCart.status === "Pending" && (
                    <div>
                      {user.role == "staff" ? (
                        <>
                          <button
                            className="btn btn-danger mr-2"
                            onClick={() =>
                              updateCartStatus(activeCartId, "Cancelled")
                            }
                          >
                            Cancel Order
                          </button>
                          <button
                            className="btn btn-success mr-2"
                            onClick={() =>
                              updateCartStatus(activeCartId, "Completed")
                            }
                          >
                            Complete Order
                          </button>
                          <button
                            className="btn btn-warning"
                            onClick={() =>
                              updateCartStatus(activeCartId, "In Progress")
                            }
                          >
                            In Progress
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            updateCartStatus(activeCartId, "Cancelled")
                          }
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
