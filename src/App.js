import "./App.css";
import About from "./pages/About";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import BoardList from "./pages/boards/BoardList";
import BoardWrite from "./pages/boards/BoardWrite";
import BoardDetail from "./pages/boards/BoardDetail";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatList from "./pages/chat/ChatList";
import ChatRoomCreate from "./pages/chat/ChatRoomCreate";
import Chatting from "./pages/chat/Chatting";
import KakaoCallback from "./pages/kakaoCallback";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/oauth/kakao" element={<KakaoCallback />} />
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/board" element={<BoardList />} />
          <Route path="/board/write" element={<BoardWrite />} />
          <Route path="/board/:boardId" element={<BoardDetail />} />
          <Route path="/chat" element={<ChatList />} />
          <Route path="/chat/create" element={<ChatRoomCreate />} />
          <Route path="/chat/:roomId" element={<Chatting />} />

          <Route path="/about" element={<About />} />
          <Route path="/profile/:name" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
