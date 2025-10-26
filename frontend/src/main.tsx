import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// import HomePage from './pages/HomePage.tsx'
import axios from "axios";               // ✅ 新增
import { getToken } from "./utils/session.ts"; // ✅ 新增
import "@fortawesome/fontawesome-free/css/all.min.css";


// ✅ 启动时恢复 token
const token = getToken();
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <HomePage/> */}
    <App />
  </StrictMode>,
)
