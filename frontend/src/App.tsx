import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage, HomePage ,Login, CaptchaLogin ,Register} from "./pages";
import Chat from "./pages/Chat";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />    {/* 原主页 */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/captcha-login" element={<CaptchaLogin />} />
        <Route path="/chat" element={<Chat />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
