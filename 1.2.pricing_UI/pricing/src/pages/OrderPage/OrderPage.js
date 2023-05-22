import React, { Component } from "react";
import axios from "axios";
import ProgressBar from "../../components/ProgressBar/ProgressBar";

import coffeeImage from "../../images/coffee.png";
import milkteaImage from "../../images/milktea.png";
import bagelImage from "../../images/bagel.png";
import sandwichImage from "../../images/sandwich.png";

import "./OrderPage.css"; // Import the CSS file
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";

const backendUrl =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:8000/api";

class OrderPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orders: [],
      currentPage: 1,
      ordersPerPage: 3,
      pageNumbers: 1,
    };
  }

  componentDidMount() {
    this.fetchOrders();
  }

  fetchOrders() {
    const user = JSON.parse(localStorage.getItem("user"));
    this.setState(
      {
        user: user,
      },
      () => {
        this.getOrdersByUserId();
      }
    );
  }

  getOrdersByUserId = async () => {
    const { user } = this.state;
    try {
      const response = await axios.get(
        `${backendUrl}/users/${user._id}/orders`
      );
      const orders = response.data;
      console.log(orders);
      this.setState({ orders }, () => {
        console.log(orders);
        const pageNumbers = Math.ceil(orders.length / this.state.ordersPerPage);
        this.setState({ pageNumbers });
      });
    } catch (error) {
      console.error("Error retrieving orders:", error);
    }
  };

  handleStatusUpdate(orderId, newStatus) {
    const updatedOrders = this.state.orders.map((order) => {
      if (order._id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    });

    this.setState({ orders: updatedOrders });
  }

  renderItemImage(item) {
    if (item.drink) {
      if (item.drink === "Coffee") {
        return coffeeImage;
      } else if (item.drink === "Milk Tea") {
        return milkteaImage;
      }
    } else if (item.food) {
      if (item.food === "Bagel") {
        return bagelImage;
      } else if (item.food === "Sandwich") {
        return sandwichImage;
      }
    }
  }

  handleCancelOrder = (orderId) => {
    // Implement cancel order functionality here
    console.log(`Cancel Order: ${orderId}`);
  };

  renderOrder(order, index) {
    const { items } = order;
    return (
      <div key={order._id} className="col-lg-10 col-xl-12 p-6 mb-4">
        <div className="card">
          <div className="card-header bg-light">
            <h5 className="text-muted mb-0">Order #{index + 1}</h5>
          </div>
          <div className="card-body">
            <div className="card mb-4">
              <div className="card-body">
                {items.map((item) => (
                  <div className="row border rounded mb-2" key={item._id}>
                    <div className="col-md-2">
                      <div className="image-container">
                        <img
                          src={this.renderItemImage(item)}
                          className="img-fluid"
                          alt="Item"
                        />
                      </div>
                    </div>
                    <div className="col-md-10 mt-2 text-left">
                      <div className="text-muted mb-0 fs-4">
                        <h2 className="fw-bold fs-6">
                          {item.drink || item.food}
                        </h2>
                      </div>
                      <div>
                        {item.drink !== undefined ? (
                          <p>
                            Topping: {item.type}, size {item.size}
                            {item.hasWhippingCream && ", has whipping cream"}
                            {item.milkOption !== "none" &&
                              `, ${item.milkOption}`}
                            {item.chocolateSaucePumps > 0 &&
                              `, ${item.chocolateSaucePumps} chocolate sauce`}
                          </p>
                        ) : (
                          <p>
                            {item.additionalFoods.length > 0 && "Topping: "}
                            {item.additionalFoods.join(", ")}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="mb-0">
                          <span className="fw-bold">Price:</span>
                          {" $"}
                          {item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <hr className="mb-4 mt-4" />
                <ProgressBar status={order.status} />
              </div>
            </div>

            <div className="d-flex justify-content-between pt-2">
              <p className="fw-bold mb-0">Order Details</p>
              <p className="text-muted mb-0">
                <span className="fw-bold me-4">Total</span> $
                {order.cartPrice.totalCartPrice.toFixed(2)}
              </p>
            </div>

            <div className="d-flex justify-content-between pt-2">
              <p className="text-muted mb-0"></p>
              <p className="text-muted mb-0">
                <span className="fw-bold me-4">Tax</span>
                {" $"}
                {order.cartPrice.tax.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="card-footer bg-primary text-white">
            <div className="d-flex justify-content-between align-items-center">
              <button
                className="btn btn-danger"
                onClick={() => this.handleCancelOrder(order._id)}
              >
                Cancel Order
              </button>
              <h5 className="d-flex align-items-center justify-content-end text-uppercase mb-0">
                Total paid:{" "}
                <span className="h2 mb-0 ms-2">
                  ${order.cartPrice.totalCartPriceAfterTax.toFixed(2)}
                </span>
              </h5>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderOrders() {
    const { currentPage, ordersPerPage, orders } = this.state;
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    return currentOrders.map((order, index) => this.renderOrder(order, index));
  }

  renderPagination() {
    const { currentPage, pageNumbers } = this.state;

    return (
      <div className="mt-4">
        <ul className="pagination">
          {Array.from({ length: pageNumbers }).map((_, index) => (
            <li
              key={index}
              className={`page-item ${
                currentPage === index + 1 ? "active" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => this.handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  handlePageChange(pageNumber) {
    pageNumber = Math.max(1, pageNumber);
    this.setState({ currentPage: pageNumber });
  }

  render() {
    return (
      <div>
        <CustomNavbar className="mb-2" />
        <div className="container border">
          <h2 className="text-2xl align-items-center font-bold mb-4">Orders</h2>
          <div className="space-y-4">{this.renderOrders()}</div>
          {this.renderPagination()}
        </div>
      </div>
    );
  }
}

export default OrderPage;
