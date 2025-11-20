import { Routes, Route } from 'react-router-dom';
import DataGridPage from './pages/DataGridPage';
import DetailPage from './pages/DetailPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DataGridPage />} />
      <Route path="/detail/:id" element={<DetailPage />} />
    </Routes>
  );
}

export default App;

