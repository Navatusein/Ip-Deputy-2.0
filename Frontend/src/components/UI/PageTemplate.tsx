import React, {FC} from 'react';
import DefaultNavbar from "./DefaultNavbar";
import {Container} from "react-bootstrap";

interface PageTemplateProps {
    children: React.ReactNode;
}

const PageTemplate: FC<PageTemplateProps> = ({children}) => {
    return (
        <>
            <DefaultNavbar/>
            <Container fluid="true" className="px-xxl-3 px-md-2 px-sm-1 px-2 flex-grow-1 bg-light">
                {children}
            </Container>
        </>
    );
};

export default PageTemplate;