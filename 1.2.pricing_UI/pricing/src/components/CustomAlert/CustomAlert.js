import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Alert as BootstrapAlert } from "react-bootstrap";
import { dismissAlert } from "../../redux/actions/alertActions";
import "./CustomAlert.css";

const CustomAlert = ({ alert, dismissAlert }) => {
  useEffect(() => {
    if (alert.show) {
      setTimeout(() => {
        dismissAlert();
      }, 2000); // Automatically dismiss after 3 seconds
    }
  }, [alert.show, dismissAlert]);

  const { type, message } = alert;

  const alertClassName = `alert ${type === "success" ? "success" : "error"}`;

  return alert.show ? (
    <div className={alertClassName}>
      <BootstrapAlert
        variant={type === "success" ? "success" : "danger"}
        dismissible
        onClose={dismissAlert}
      >
        {message}
      </BootstrapAlert>
    </div>
  ) : null;
};

const mapStateToProps = (state) => {
  return {
    alert: state.alert,
  };
};

export default connect(mapStateToProps, { dismissAlert })(CustomAlert);
