import React, { Component } from "react";
import axios from "axios";
import Order from "../../components/Order/Order";

import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

import "./OrderPage.css";
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";

const backendUrl =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:8000/api";

class OrderPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orders: [],
      filteredOrders: [],
      displayOrders: [],
      currentPage: 1,
      ordersPerPage: 3,
      pageNumbers: 1,
      user: JSON.parse(localStorage.getItem("user")),
      tab: "Pending",
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

  handleTabListChange = (event, newValue) => {
    this.setState({ tab: newValue, currentPage: 1 }, () => {
      this.filteredOrdersUpdate();
    });
  };

  filteredOrdersUpdate = () => {
    const { ordersPerPage, orders, tab } = this.state;
    let filteredOrders = orders;
    if (tab === "Pending") {
      filteredOrders = orders.filter((order) => order.status === "Pending");
    } else if (tab === "In Progress") {
      filteredOrders = orders.filter((order) => order.status === "In Progress");
    } else if (tab === "Completed") {
      filteredOrders = orders.filter((order) => order.status === "Completed");
    } else if (tab === "Cancelled") {
      filteredOrders = orders.filter((order) => order.status === "Cancelled");
    }
    const pageNumbers = Math.ceil(filteredOrders.length / ordersPerPage);
    this.setState({ filteredOrders, pageNumbers }, () => {
      this.updateDisplayOrders();
    });
  };

  updateDisplayOrders = () => {
    const { currentPage, ordersPerPage, filteredOrders } = this.state;
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const displayOrders = filteredOrders.slice(
      indexOfFirstOrder,
      indexOfLastOrder
    );
    this.setState({ displayOrders });
  };

  getOrdersByUserId = async () => {
    const { user } = this.state;
    try {
      const response = await axios.get(
        `${backendUrl}/users/${user._id}/orders`
      );
      const orders = response.data;
      orders.reverse();
      this.setState({ orders }, () => {
        this.filteredOrdersUpdate();
        this.updateDisplayOrders();
      });
    } catch (error) {
      console.error("Error retrieving orders:", error);
    }
  };

  renderPagination = () => {
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
  };

  handlePageChange = (pageNumber) => {
    pageNumber = Math.max(1, pageNumber);
    this.setState({ currentPage: pageNumber }, () => {
      this.updateDisplayOrders();
    });
  };

  render() {
    const { tab, displayOrders } = this.state;
    return (
      <div>
        <CustomNavbar className="mb-2" />
        <div className="container border">
          <h2 className="text-2xl align-items-center font-bold mb-4">Orders</h2>
          <div>
            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabContext value={tab}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList
                    onChange={this.handleTabListChange}
                    aria-label="lab API tabs example"
                  >
                    <Tab label="All" value="All" />
                    <Tab label="Pending" value="Pending" />
                    <Tab label="In Progress" value="In Progress" />
                    <Tab label="Completed" value="Completed" />
                    <Tab label="Cancelled" value="Cancelled" />
                  </TabList>
                </Box>
                {displayOrders.map((order) => (
                  <TabPanel key={order._id} value={tab}>
                    <Order
                      order={order}
                      getOrdersByUserId={this.getOrdersByUserId}
                    />
                  </TabPanel>
                ))}
              </TabContext>
            </Box>
          </div>
          {this.renderPagination()}
        </div>
      </div>
    );
  }
}

export default OrderPage;
