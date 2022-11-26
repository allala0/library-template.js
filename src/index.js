import React from 'react';
import ReactDOM from 'react-dom/client';

const root = document.getElementById('root');

function App(){
    return (
        <div>
            Hello world
        </div>
    );
}

ReactDOM.createRoot(root).render(<App />);
