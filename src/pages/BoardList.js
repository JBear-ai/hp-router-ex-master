import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AxiosAPi from "../api/AxiosAPi";

const Container = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 24px 20px;
`;

// 제목과 글쓰기 버튼을 한 줄에 배치
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

const WriteBtn = styled.button`
  padding: 10px 18px;
  color: white;
  background-color: orange;
  font-size: 14px;
  font-weight: 700;
  border: none;
  border-radius: 18px;
  cursor: pointer;

  &:active {
    background-color: #e69500;
  }
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Empty = styled.p`
  text-align: center;
  color: #888;
`;

const BoardList = () => {
  const [boards, setBoards] = useState([]);
  const nav = useNavigate();

  // 화면이 처음 보일 때 게시글 목록 조회
  // 렌더링 이후에 무엇을 할건가?
  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await AxiosAPi.boardList();
        console.log(res.data);
        setBoards(res.data);
      } catch (err) {
        console.log(err);
        alert("게시글 목록을 불러오지 못했습니다.");
      }
    };
    fetchList();
  }, []);

  // 게시글 상세 페이지로 이동
  const handleItemClick = (boardId) => {
    nav(`/board/${boardId}`);
  };

  return (
    <Container>
      <Top>
        <Title>게시판</Title>
        <WriteBtn onClick={() => nav("/board/write")}>글쓰기</WriteBtn>
      </Top>
      {boards.length === 0 ? (
        <Empty>등록된 게시글이 없습니다.</Empty>
      ) : (
        <List>
          {boards.map((board) => (
            <p key={board.boardId}>
              {board.title}: {board.content}
            </p>
          ))}
        </List>
      )}
    </Container>
  );
};
export default BoardList;
