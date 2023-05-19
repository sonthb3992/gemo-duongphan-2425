import React from "react";
import { Alert } from "react-bootstrap";
import { Navigate } from "react-router-dom";

const accounts = [
  { username: "staff", password: "staff", role: "staff" },
  { username: "customer", password: "customer", role: "customer" },
];

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      showError: false,
    };
  }

  componentDidMount = () => {
    // localStorage.removeItem("user");
  };

  handleEmailChange = (e) => {
    this.setState({ email: e.target.value });
  };

  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value });
  };

  handleFormSubmit = (e) => {
    e.preventDefault();

    const { email, password } = this.state;

    // Check if entered email and password match any account
    const matchedAccount = accounts.find(
      (account) => account.username === email && account.password === password
    );

    if (matchedAccount) {
      console.log("Logged in successfully");
      localStorage.setItem("user", JSON.stringify(matchedAccount));
      window.location.reload();
    } else {
      // Wrong username or password
      this.setState({ showError: true });
    }
  };

  render() {
    const { showError } = this.state;
    const user = JSON.parse(localStorage.getItem("user"));

    return (
      <div className="container">
        {user ? <Navigate to="/" /> : null}
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card mt-5">
              <div className="card-header">
                <h4>Login</h4>
              </div>
              <div className="card-body">
                {showError && (
                  <Alert
                    variant="danger"
                    onClose={() => this.setState({ showError: false })}
                  >
                    Wrong username or password. Please try again.
                    <br />
                    Customer Account:
                    <br />
                    username: customer
                    <br />
                    password: customer
                    <br />
                    <br />
                    Staff Account:
                    <br />
                    username: staff <br />
                    password: staff
                  </Alert>
                )}
                <form onSubmit={this.handleFormSubmit}>
                  <div className="form-group">
                    <label htmlFor="email">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      id="email"
                      placeholder="Enter your email"
                      value={this.state.email}
                      onChange={this.handleEmailChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Enter your password"
                      value={this.state.password}
                      onChange={this.handlePasswordChange}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
