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
      activeOrderId,
      activeOrder,
      isModalOpen,
      closeModal,
      updateOrderStatus,
    } = this.props;
    const { items } = activeOrder || [];
    const { user } = this.state;

    return (
      <div
        className="modal"
        style={{ display: isModalOpen ? "block" : "none" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Items in Order</h5>
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
                <span className="mr-2">Status: {activeOrder.status}</span>
                <br />
                <span className="mr-2">
                  Price:{" $"}
                  {activeOrder.cartPrice.totalCartPriceAfterTax.toFixed(2)}
                </span>
                {(activeOrder.status === "Completed" ||
                  activeOrder.status === "Cancelled") &&
                  null}
                {(activeOrder.status === "In Progress" ||
                  activeOrder.status === "Pending") && (
                  <div>
                    {user.role === "staff" ? (
                      <>
                        {activeOrder.status === "Pending" && (
                          <button
                            className="btn btn-warning"
                            onClick={() =>
                              updateOrderStatus(activeOrderId, "In Progress")
                            }
                          >
                            In Progress
                          </button>
                        )}
                        {activeOrder.status === "In Progress" && (
                          <button
                            className="btn btn-success mr-2"
                            onClick={() =>
                              updateOrderStatus(activeOrderId, "Completed")
                            }
                          >
                            Complete Order
                          </button>
                        )}
                        <button
                          className="btn btn-danger mr-2"
                          onClick={() =>
                            updateOrderStatus(activeOrderId, "Cancelled")
                          }
                        >
                          Cancel Order
                        </button>
                      </>
                    ) : (
                      <>
                        {activeOrder.status !== "In Progress" && (
                          <button
                            className="btn btn-danger"
                            onClick={() =>
                              updateOrderStatus(activeOrderId, "Cancelled")
                            }
                          >
                            Cancel Order
                          </button>
                        )}
                      </>
                    )}
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
