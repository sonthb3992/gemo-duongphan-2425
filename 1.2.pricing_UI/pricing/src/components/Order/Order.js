import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import "./Order.css";
import Modal from "../Modal/Modal";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      activeOrderId: null,
      isModalOpen: false,
      activeOrder: {},
      filteredOrderStatus: "all",
      user: null,
    };
  }

  componentDidMount = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    this.setState(
      {
        user: user,
      },
      () => {
        this.getOrdersByUserId();
      }
    );
  };

  getOrdersByUserId = async () => {
    const { user } = this.state;
    try {
      const response = await axios.get(
        `${backendUrl}/users/${user._id}/orders`
      );
      const orders = response.data;
      this.setState({ orders });
    } catch (error) {
      console.error("Error retrieving orders:", error);
    }
  };

  addToOrder = async (order) => {
    const { user } = this.state;
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
      const createdOrder = response.data;
      console.log("New order created:", createdOrder);

      this.getOrdersByUserId();
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  handleOrderClick = (orderId) => {
    const { orders } = this.state;
    const activeOrder = orders.find((order) => order._id === orderId);

    this.setState(
      {
        activeOrderId: orderId,
        isModalOpen: true,
        activeOrder: activeOrder,
      },
      () => {}
    );
  };

  updateOrderStatus = (orderId, status) => {
    // Make HTTP request using Axios to update order status
    const userId = this.state.user._id;
    axios
      .put(`${backendUrl}/users/${userId}/orders/${orderId}/status`, {
        status,
      })
      .then((response) => {
        // Order status updated successfully
        console.log("Order status updated:", response.data.order);

        this.setState({
          isModalOpen: false,
          activeOrder: {},
        });

        this.getOrdersByUserId();
      })
      .catch((error) => {
        console.error(error);
        // Handle error
      });
  };

  closeModal = () => {
    this.setState({
      isModalOpen: false,
      activeOrder: {},
    });
  };

  render() {
    const {
      filteredOrderStatus,
      activeOrderId,
      activeOrder,
      isModalOpen,
      orders,
    } = this.state;
    let filteredOrders = [];
    if (filteredOrderStatus === "all") {
      filteredOrders = orders;
    } else if (filteredOrderStatus === "pending") {
      filteredOrders = orders.filter((order) => order.status === "Pending");
    } else if (filteredOrderStatus === "completed") {
      filteredOrders = orders.filter((order) => order.status === "Completed");
    } else if (filteredOrderStatus === "cancelled") {
      filteredOrders = orders.filter((order) => order.status === "Cancelled");
    } else if (filteredOrderStatus === "inProgress") {
      filteredOrders = orders.filter((order) => order.status === "In Progress");
    }

    return (
      <div className="container">
        <h2 style={{ marginTop: "15px" }}>
          <FormattedMessage id="order.title" defaultMessage="Order" />
        </h2>
        <div className="row mb-3">
          <div className="col-md-12">
            <button
              className={`btn ${
                filteredOrderStatus === "all" ? "btn-primary" : "btn-secondary"
              } mr-2`}
              onClick={() => this.setState({ filteredOrderStatus: "all" })}
            >
              Show All Orders
            </button>
            <button
              className={`btn ${
                filteredOrderStatus === "pending"
                  ? "btn-primary"
                  : "btn-secondary"
              } mr-2`}
              onClick={() => this.setState({ filteredOrderStatus: "pending" })}
            >
              Pending
            </button>
            <button
              className={`btn ${
                filteredOrderStatus === "inProgress"
                  ? "btn-primary"
                  : "btn-secondary"
              } mr-2`}
              onClick={() =>
                this.setState({ filteredOrderStatus: "inProgress" })
              }
            >
              In Progress
            </button>
            <button
              className={`btn ${
                filteredOrderStatus === "completed"
                  ? "btn-primary"
                  : "btn-secondary"
              } mr-2`}
              onClick={() =>
                this.setState({ filteredOrderStatus: "completed" })
              }
            >
              Completed
            </button>
            <button
              className={`btn ${
                filteredOrderStatus === "cancelled"
                  ? "btn-primary"
                  : "btn-secondary"
              } mr-2`}
              onClick={() =>
                this.setState({ filteredOrderStatus: "cancelled" })
              }
            >
              Cancelled
            </button>
          </div>
        </div>
        <div className="row">
          {filteredOrders.map((order, index) => (
            <div key={index} className="col-md-4 mt-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Order #{index + 1}</h5>
                  <div>Status: {order.status}</div>
                </div>
                <div className="card-body">
                  <button
                    className="btn btn-primary"
                    onClick={() => this.handleOrderClick(order._id)}
                  >
                    Show Items
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {isModalOpen && (
          <Modal
            activeOrderId={activeOrderId}
            activeOrder={activeOrder}
            isModalOpen={isModalOpen}
            closeModal={this.closeModal}
            updateOrderStatus={this.updateOrderStatus}
          />
        )}
      </div>
    );
  }
}

export default Order;
