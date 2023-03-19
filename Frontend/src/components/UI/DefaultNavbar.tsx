import React, {FC} from 'react';
import {Nav, Navbar} from "react-bootstrap";
import {Link} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {userSlice} from "../../store/reducers/UserSlice";

const DefaultNavbar: FC = () => {
    const dispatcher = useAppDispatch();
    const {user} = useAppSelector(state => state.userReducer);
    const {logout} = userSlice.actions;

    const handleLogout = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();
        dispatcher(logout());
    }

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="px-xxl-5 px-md-2 px-sm-1 px-2">
            <Navbar.Brand>Admin Panel</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                    {user !== null &&
                        <>
                            <Nav.Link as={Link} to="/dashboard/groups">Groups</Nav.Link>
                            <Nav.Link as={Link} to="/dashboard/subgroups">Subgroups</Nav.Link>
                            <Nav.Link as={Link} to="/dashboard/students">Students</Nav.Link>
                            <Nav.Link as={Link} to="/dashboard/teachers">Teachers</Nav.Link>
                            <Nav.Link as={Link} to="/dashboard/subjects">Subjects</Nav.Link>
                            <Nav.Link as={Link} to="/dashboard/schedule">Schedule</Nav.Link>
                            <Nav.Link as={Link} to="/dashboard/submission-config">Submission Config</Nav.Link>
                        </>
                    }
                </Nav>
                <Nav>
                    {user !== null ?
                        <>
                            <Nav.Link as={Link} to="/profile">{user.userName}</Nav.Link>
                            <Nav.Link onClick={e => {handleLogout(e)}}>Logout</Nav.Link>
                        </>:
                        <>
                            <Nav.Link as={Link} to="/login">Sign in</Nav.Link>
                        </>
                    }
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default DefaultNavbar;