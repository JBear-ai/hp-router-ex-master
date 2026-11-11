import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import AxiosApi from "../../api/AxiosApi";
import { WS_URL } from "../../api/AxiosInstance";

const Container = styled.div`
  max-width: 720px;
  height: 100%;
  margin: 0 auto;
  padding: 16px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
`;

const ExitBtn = styled.button`
  padding: 8px 14px;
  color: white;
  background-color: #999;
  font-weight: 700;
  border: none;
  border-radius: 14px;
  cursor: pointer;
`;

const MessageBox = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  background-color: white;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// 입장·퇴장 안내
const Notice = styled.p`
  margin: 0;
  text-align: center;
  font-size: 12px;
  color: #888;
`;

// 내 메시지는 오른쪽, 다른 사람 메시지는 왼쪽
const Bubble = styled.div`
  max-width: 70%;
  align-self: ${({ $mine }) => ($mine ? "flex-end" : "flex-start")};
  small {
    display: block;
    margin-bottom: 2px;
    font-size: 11px;
    color: #888;
    text-align: ${({ $mine }) => ($mine ? "right" : "left")};
  }
  p {
    margin: 0;
    padding: 8px 12px;
    border-radius: 14px;
    white-space: pre-wrap;
    background-color: ${({ $mine }) => ($mine ? "orange" : "#eee")};
    color: ${({ $mine }) => ($mine ? "white" : "#333")};
  }
`;

const InputRow = styled.form`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

const MsgInput = styled.input`
  flex: 1;
  padding: 0 1em;
  height: 44px;
  font-size: 14px;
  border: 1px solid #999;
  border-radius: 18px;
  outline: none;
  &:focus {
    border-color: orange;
  }
`;

const SendBtn = styled.button`
  width: 80px;
  color: white;
  background-color: orange;
  font-weight: 700;
  border: none;
  border-radius: 18px;
  cursor: pointer;
`;

const Chatting = () => {
  const { roomId } = useParams();
  const nav = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [chatList, setChatList] = useState([]); // 받은 메시지 목록
  const [inputMsg, setInputMsg] = useState("");
  const ws = useRef(null); // WebSocket 객체 (리렌더링돼도 유지)
  const bottomRef = useRef(null); // 자동 스크롤 위치
  const sender = localStorage.getItem("email") ?? "익명"; // 보내는 사람

  // ① 방 정보 조회 (방 이름 표시, 없는 방이면 목록으로)
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await AxiosApi.chatRoom(roomId);
        if (!res.data) {
          alert("존재하지 않는 채팅방입니다.");
          nav("/chat", { replace: true });
          return;
        }
        setRoomName(res.data.name);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRoom();
  }, [roomId, nav]);

  // ② WebSocket 연결
  useEffect(() => {
    const socket = new WebSocket(WS_URL);
    ws.current = socket;

    // 연결되면 입장 메시지 전송
    socket.onopen = () => {
      socket.send(
        JSON.stringify({ type: "ENTER", roomId, sender, message: "" }),
      );
    };
    // 서버가 보낸 메시지 수신 → 목록에 추가
    socket.onmessage = (e) => {
      setChatList((prev) => [...prev, JSON.parse(e.data)]);
    };
    socket.onclose = (e) => {
      console.log("WebSocket 종료:", e.code);
    };

    // 화면을 떠나면 연결 종료
    // (StrictMode에서 연결 중에 닫히면 onopen이 실행되지 않아 ENTER가 중복되지 않음)
    return () => socket.close();
  }, [roomId, sender]);

  // 새 메시지가 오면 맨 아래로 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatList]);

  // 메시지 전송
  const onSend = (e) => {
    e.preventDefault();
    if (inputMsg.trim() === "") return;
    if (ws.current?.readyState !== WebSocket.OPEN) {
      alert("채팅 서버에 연결되지 않았습니다.");
      return;
    }
    ws.current.send(
      JSON.stringify({ type: "TALK", roomId, sender, message: inputMsg }),
    );
    setInputMsg("");
  };

  // 나가기: 퇴장 메시지를 위해 CLOSE(sender 포함)를 보낸 뒤 이동
  const onExit = () => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: "CLOSE", roomId, sender }));
    }
    nav("/chat");
  };

  return (
    <Container>
      <Top>
        <Title>{roomName}</Title>
        <ExitBtn onClick={onExit}>나가기</ExitBtn>
      </Top>

      <MessageBox>
        {chatList.map((chat, idx) =>
          chat.type === "TALK" ? (
            <Bubble key={idx} $mine={chat.sender === sender}>
              <small>{chat.sender}</small>
              <p>{chat.message}</p>
            </Bubble>
          ) : (
            <Notice key={idx}>{chat.message}</Notice>
          ),
        )}
        <div ref={bottomRef} />
      </MessageBox>

      <InputRow onSubmit={onSend}>
        <MsgInput
          value={inputMsg}
          placeholder="메시지를 입력하세요"
          onChange={(e) => setInputMsg(e.target.value)}
        />
        <SendBtn type="submit">전송</SendBtn>
      </InputRow>
    </Container>
  );
};

export default Chatting;
