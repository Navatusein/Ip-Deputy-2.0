import React, {FC, useEffect, useState} from 'react';
import {Alert, Card} from "react-bootstrap";
import {useAppDispatch} from "../../hooks/redux";
import {userSlice} from "../../store/reducers/UserSlice";
import {useTelegram} from "../../hooks/useTelegram";
import {useParams} from "react-router-dom";
import CardTokenExpire from "../../components/bot/CardTokenExpire";
import {IUser} from "../../models/IUser";
import {IJwtToken} from "../../models/IJwtToken";
import jwt_decode from "jwt-decode";

const Template: FC = () => {
    const dispatch = useAppDispatch();

    const {setUser} = userSlice.actions;

    const {telegram} = useTelegram();
    const {userBase64} = useParams();

    const [tokenActive, setTokenActive] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');

    // Main button click handler
    const mainButtonHandler = () => {
        telegram.close();
    }

    // Fix telegram web app bug
    useEffect(() => {
        telegram.MainButton.onClick(mainButtonHandler);

        return () => {
            telegram.MainButton.offClick(mainButtonHandler);
        }
    }, [mainButtonHandler]);

    // Parse user data and check token
    useEffect(() => {
        if (userBase64 == undefined)
            return;

        const obj = JSON.parse(atob(userBase64));

        const userData: IUser = {
            studentId: obj.StudentId,
            userName: obj.UserName,
            jwtToken: obj.JwtToken
        }

        const decodedToken: IJwtToken = jwt_decode(userData.jwtToken);

        if (decodedToken.exp * 1000 < Date.now())
            return;

        setTokenActive(true);
        dispatch(setUser(userData));
    }, []);

    // If token correct fetch
    useEffect(() => {
        if (!tokenActive)
            return;

        telegram.ready();
    }, [tokenActive]);

    if (tokenActive) {
        return (
            <div className="p-3 bot-bg flex-grow-1">
                <Card className="bot-card-bg">
                    <Card.Body>
                        <Card.Title className="bot-text-color">
                            Template
                        </Card.Title>
                        {errorMessage !== '' &&
                            <Alert variant="danger" className="mt-3" onClose={() => setErrorMessage('')} dismissible>
                                {errorMessage}
                            </Alert>
                        }
                    </Card.Body>
                </Card>
            </div>
        );
    }
    else {
        return (
            <CardTokenExpire buttonName='' menuName=''/>
        );
    }
};

export default Template;