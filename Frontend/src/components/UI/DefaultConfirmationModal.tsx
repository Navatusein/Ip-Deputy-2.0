import React, {FC} from 'react';
import {Button, Modal} from "react-bootstrap";

interface DefaultConfirmationModalProps {
    show: boolean;
    handlerClose: () => void;
    onConfirm: () => void;
    value: string;
}

const DefaultConfirmationModal: FC<DefaultConfirmationModalProps> = ({show, handlerClose, onConfirm, value}) => {

    const handlerSaveChangesButton = () => {
        onConfirm();
        handlerClose();
    }

    return (
        <Modal show={show} onHide={() => {handlerClose()}}>
            <Modal.Header closeButton>
                <Modal.Title>Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {value}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => {handlerClose()}}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => {handlerSaveChangesButton()}}>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DefaultConfirmationModal;