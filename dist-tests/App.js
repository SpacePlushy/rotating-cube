import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import CubePage from './pages/CubePage.js';
import SnakePage from './pages/SnakePage.js';
function App() {
    const [lightMode, setLightMode] = useState(false);
    const [page, setPage] = useState('home');
    useEffect(() => {
        document.body.classList.toggle('light-mode', lightMode);
    }, [lightMode]);
    return (_jsxs("div", { className: "app", children: [_jsxs("header", { children: [_jsx("h1", { children: "3D Rotating Cube" }), _jsxs("nav", { className: "mainNav", children: [_jsx("button", { onClick: () => setPage('home'), children: "Home" }), _jsx("button", { onClick: () => setPage('snake'), children: "Snake" })] }), _jsx("button", { className: "lightToggleBtn", onClick: () => setLightMode(prev => !prev), "data-testid": "light-mode-toggle", children: lightMode ? 'Dark Mode' : 'Light Mode' })] }), page === 'home' && _jsx(CubePage, {}), page === 'snake' && _jsx(SnakePage, {})] }));
}
export default App;
