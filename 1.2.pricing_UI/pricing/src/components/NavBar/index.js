import { Dropdown, DropdownButton, Nav, Navbar } from "react-bootstrap"
import { BsCart3, BsFillPersonFill } from "react-icons/bs"
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom"
import './NavBar.css'
import Cart from "../Cart/Cart";
import { useState } from "react";

const NavBar = () => {
    const [isModalOpen, setOpenModal] = useState(false)

    const user = JSON.parse(localStorage.getItem("user"));
    if (user == null) {
        return <Navigate to="/login" />;
    }

    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.reload();
    };

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Navbar.Brand as={Link} to="/">
                    Gemo
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav className="icon-cart" onClick={() => { setOpenModal(true) }}><BsCart3 /></Nav>
                    <Nav>
                        {user ? (
                            <>
                                <DropdownButton
                                    variant="primary"
                                    title={<BsFillPersonFill />}
                                    align="end"
                                    id="dropdown-menu-align-end"

                                >
                                    <Dropdown.Item>
                                        <Nav.Link style={{ color: "black" }}>Username: {user.username}</Nav.Link>
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                        <Nav.Link style={{ color: "black" }}>User's Role: {user.role}</Nav.Link>
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                        <Nav.Link style={{ color: "black" }} onClick={handleLogout}>Logout</Nav.Link>
                                    </Dropdown.Item>
                                </DropdownButton>
                            </>
                        ) : (
                            <Nav.Link as={Link} to="/login">
                                Login
                            </Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            {isModalOpen && <Cart isModalOpen={isModalOpen} handleClose={() => setOpenModal(false)} />}
        </>
    )
}

export default NavBar