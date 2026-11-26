import styled from "styled-components";

// 리스트의 각 항목 (하위 컴포넌트)
const Item = styled.li`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.1s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const Title = styled.h3`
  margin: 0;
  font-size: 17px;
  /* 제목이 길면 한 줄로 자르고 ... 처리 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Meta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #888;
`;

// [RAG] 색인 상태 배지
const INDEX_LABEL = {
  READY: { text: "검색 가능", bg: "#dcfce7", color: "#166534" },
  INDEXING: { text: "색인 중", bg: "#e5e7eb", color: "#374151" },
  FAILED: { text: "색인 실패", bg: "#fee2e2", color: "#991b1b" },
};
const NOT_INDEXED = { text: "미색인", bg: "#f3f4f6", color: "#6b7280" };

const Badge = styled.span`
  align-self: flex-start;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 99px;
  background: ${(p) => p.$bg};
  color: ${(p) => p.$color};
`;

// 부모(BoardList)로부터 게시글 데이터(board)와 클릭 핸들러(onClick)를 props로 받음
const BoardItem = ({ board, onClick }) => {
  const badge = INDEX_LABEL[board.indexStatus] ?? NOT_INDEXED; // [RAG] 예전 글은 상태가 없음(null)
  return (
    <Item onClick={() => onClick(board.boardId)}>
      <Badge $bg={badge.bg} $color={badge.color}>
        {badge.text}
      </Badge>
      <Title>{board.title}</Title>
      <Meta>
        <span>{board.name || board.email}</span>
        <span>{board.regDate?.substring(0, 10)}</span>
      </Meta>
    </Item>
  );
};

export default BoardItem;
