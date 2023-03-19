import React from 'react';
import './App.css'
import AppRouter from "./components/AppRouter";

const App = () => {

    console.log(import.meta.env)

    return (
        <>
            <AppRouter/>
        </>
    );
};

export default App;