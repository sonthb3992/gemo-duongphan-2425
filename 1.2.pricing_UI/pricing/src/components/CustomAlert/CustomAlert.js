import React, { Component } from "react";
import "./CustomAlert.css";
import { Alert as BootstrapAlert } from "react-bootstrap";

class CustomAlert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlert: true,
    };
  }

  componentDidMount() {
    this.dismissAlert();
  }

  dismissAlert = () => {
    setTimeout(() => {
      this.setState({ showAlert: false });
      this.props.dismiss();
    }, 3000);
  };

  render() {
    const { type, message } = this.props;
    const { showAlert } = this.state;

    const alertClassName = `alert ${type === "success" ? "success" : "error"}`;

    return showAlert ? (
      <div className={alertClassName}>
        <BootstrapAlert
          variant={type === "success" ? "success" : "danger"}
          dismissible
          onClose={() => this.setState({ showAlert: false })}
        >
          {message}
        </BootstrapAlert>
      </div>
    ) : null;
  }
}

export default CustomAlert;
