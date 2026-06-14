import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    }

    const menuItems = [
        { path: '/home', label: 'Home' },
        { path: '/tournaments', label: 'Tournaments' },
    ];

    return (
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <button className="toggle-button" onClick={toggleSidebar}>
                {isCollapsed ? '☰' : '✕'}
            </button>
            <nav>
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <a href = {item.path}
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate(item.path);
                                }}
                            >
                                {!isCollapsed && <span className="label">{item.label}</span> }
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;