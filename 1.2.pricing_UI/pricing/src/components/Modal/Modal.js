import React, { Component } from "react";

class Modal extends Component {
  render() {
    const {
      activeCartId,
      activeCart,
      isModalOpen,
      closeModal,
      updateCartStatusCompleted,
      updateCartStatusCancelled,
    } = this.props;
    const { items } = activeCart;
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
                {activeCart.status === "In Progress" && (
                  <div>
                    <button
                      className="btn btn-danger mr-2"
                      onClick={() => updateCartStatusCancelled(activeCartId)}
                    >
                      Cancel Order
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={() => updateCartStatusCompleted(activeCartId)}
                    >
                      Complete Order
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
