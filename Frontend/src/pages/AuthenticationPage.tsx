import React, {FC, useState} from 'react';
import {Form, Button, Card} from "react-bootstrap";
import {ILoginData} from "../models/ILoginData";
import {useAppDispatch} from "../hooks/redux";
import {loginUser} from "../services/UserService";
import PageTemplate from "../components/UI/PageTemplate";
import { useNavigate } from "react-router-dom";

const AuthenticationPage: FC = () => {
    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const [loginData, setLoginData] = useState<ILoginData>({login: '', password: ''});

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        dispatch(loginUser(loginData));
        navigate("/students");
    }

    return (
        <PageTemplate>
            <Card className="col-xl-4 col-lg-6 col-sm-12 mt-4 offset-lg-3 offset-xl-4">
                <Card.Body>
                    <Card.Title>Sing in</Card.Title>
                    <Form>
                        <Form.Group>
                            <Form.Label>Login</Form.Label>
                            <Form.Control type="text" name="login" value={loginData.login} onChange={e => setLoginData({...loginData, login: e.target.value})}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="pass"  value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})}/>
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-3" onClick={e => {handleSubmit(e);}}>
                            Sign in
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </PageTemplate>
    );
};

export default AuthenticationPage;