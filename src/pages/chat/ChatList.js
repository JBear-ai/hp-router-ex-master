import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AxiosApi from "../../api/AxiosApi";

const Container = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 24px 20px;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
`;

const CreateBtn = styled.button`
  padding: 10px 18px;
  color: white;
  background-color: orange;
  font-size: 14px;
  font-weight: 700;
  border: none;
  border-radius: 18px;
  cursor: pointer;
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Item = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 16px 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  span {
    font-size: 13px;
    color: #888;
  }
`;

const Empty = styled.p`
  text-align: center;
  color: #888;
`;

const ChatList = () => {
  const [rooms, setRooms] = useState([]);
  const nav = useNavigate();

  // 채팅방 목록 조회: GET /chat/list
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await AxiosApi.chatList();
        setRooms(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRooms();
  }, []);

  return (
    <Container>
      <Top>
        <Title>채팅방</Title>
        <CreateBtn onClick={() => nav("/chat/create")}>방 만들기</CreateBtn>
      </Top>
      {rooms.length === 0 ? (
        <Empty>열려 있는 채팅방이 없습니다.</Empty>
      ) : (
        <List>
          {rooms.map((room) => (
            <Item key={room.roomId} onClick={() => nav(`/chat/${room.roomId}`)}>
              <b>{room.name}</b>
              <span>{room.regDate?.substring(0, 16).replace("T", " ")}</span>
            </Item>
          ))}
        </List>
      )}
    </Container>
  );
};

export default ChatList;
