import React, {FC} from 'react';
import {Card} from "react-bootstrap";

interface CardTokenExpireProps {
    buttonName: string;
    menuName: string;
}

const CardTokenExpire:FC<CardTokenExpireProps> = ({buttonName, menuName}) => {
    return (
        <div className="p-3 bot-bg flex-grow-1">
            <Card className="bot-card-bg">
                <Card.Body>
                    <Card.Title className="bot-text-color">Застарілий токен</Card.Title>
                    <Card.Text className="bot-text-color">
                        Будьласка натисніть кнопку {buttonName}. <br/>
                        Ця кнопка у меню {menuName}.
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    );
};

export default CardTokenExpire;