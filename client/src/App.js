import Home from './scenes/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './scenes/Login';
import NotFound from './scenes/NotFound';
import Register from './scenes/Register';

function App() {

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;