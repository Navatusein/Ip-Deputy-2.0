import React, {FC, useEffect, useState} from 'react';
import {Alert, Card} from "react-bootstrap";
import {useTelegram} from "../../hooks/useTelegram";
import {useParams} from "react-router-dom";
import {IUser} from "../../models/IUser";
import jwt_decode from "jwt-decode";
import {useAppDispatch} from "../../hooks/redux";
import {userSlice} from "../../store/reducers/UserSlice";
import {fetchAllSubgroups} from "../../services/SubgroupsService";
import CardTokenExpire from '../../components/bot/CardTokenExpire';
import {IJwtToken} from "../../models/IJwtToken";

const FullSchedulePage:FC = () => {
    const dispatch = useAppDispatch();

    const {setUser} = userSlice.actions;

    const {telegram} = useTelegram();
    const {userBase64} = useParams();

    const [userData, setUserData] = useState<IUser>();
    const [tokenActive, setTokenActive] = useState(false);

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
        setUserData(userData);
        dispatch(setUser(userData));
    }, []);

    useEffect(() => {
        if (!tokenActive)
            return;

        dispatch(fetchAllSubgroups());
    }, [tokenActive]);

    useEffect(() => {
        if ('subgroupsError'.includes('401'))
            setTokenActive(false);

    }, []);

    if (tokenActive) {
        return (
            <div className="p-2">
                <Card>
                    <Card.Body>
                        <Card.Title>Test Page</Card.Title>
                    </Card.Body>
                </Card>
            </div>
        );
    }
    else {
       return (
           <CardTokenExpire buttonName='🗓 Весь розклад' menuName='🗓 Розклад'/>
       );
    }
};

export default FullSchedulePage;