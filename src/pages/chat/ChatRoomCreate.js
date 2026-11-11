import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AxiosApi from "../../api/AxiosApi";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const Container = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 24px 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.h1`
  margin: 0 0 8px;
  font-size: 24px;
`;

const ChatRoomCreate = () => {
  const [name, setName] = useState("");
  const nav = useNavigate();
  const isValid = name.trim() !== "";

  // 채팅방 생성: POST /chat/new → roomId
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    try {
      const res = await AxiosApi.chatCreate(name);
      nav(`/chat/${res.data}`, { replace: true }); // 만든 방으로 바로 입장
    } catch (err) {
      console.error(err);
      alert("채팅방을 만들지 못했습니다.");
    }
  };

  return (
    <Container>
      <Form onSubmit={onSubmit}>
        <Title>채팅방 만들기</Title>
        <Input
          value={name}
          placeholder="채팅방 이름"
          onChange={(e) => setName(e.target.value)}
        />
        <Button type="submit" enabled={isValid}>
          만들기
        </Button>
      </Form>
    </Container>
  );
};

export default ChatRoomCreate;
