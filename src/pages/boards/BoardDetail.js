import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import AxiosApi from "../../api/AxiosApi";
import Button from "../../components/common/Button";

const Container = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 24px 20px;
`;

const Card = styled.article`
  padding: 24px;
  margin-bottom: 16px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
`;

const Title = styled.h1`
  margin: 0 0 8px;
  font-size: 24px;
`;

const Meta = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid #eee;
  font-size: 13px;
  color: #888;
`;

// 줄바꿈(\n)을 그대로 보여주기 위해 pre-wrap 사용
const Content = styled.p`
  margin: 0;
  min-height: 200px;
  line-height: 1.6;
  white-space: pre-wrap;
`;

/* ---------- 댓글 영역 ---------- */
const CommentHeading = styled.h3`
  margin: 0 0 12px;
  font-size: 16px;

  span {
    color: orange;
  }
`;

const CommentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const TextArea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  min-height: 80px;
  padding: 1em;
  font-size: 14px;
  font-family: inherit;
  border: 1px solid #999;
  border-radius: 18px;
  outline: none;
  resize: vertical;

  &:focus {
    border-color: orange;
  }
`;

const CommentList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const CommentItem = styled.li`
  padding: 12px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const CommentMeta = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 13px;
  color: #888;

  b {
    margin-right: 8px;
    color: #333;
  }
`;

const CommentText = styled.p`
  margin: 0;
  line-height: 1.5;
  white-space: pre-wrap;
`;

const DeleteBtn = styled.button`
  padding: 0;
  font-size: 13px;
  color: #e74c3c;
  background: none;
  border: none;
  cursor: pointer;
`;

const Empty = styled.p`
  margin: 0;
  text-align: center;
  font-size: 14px;
  color: #888;
`;

const BackBtn = styled.button`
  padding: 10px 18px;
  background-color: #999;
  color: white;
  font-weight: 700;
  border: none;
  border-radius: 18px;
  cursor: pointer;
`;

const BoardDetail = () => {
  const { boardId } = useParams(); // 주소의 :boardId 값
  const [board, setBoard] = useState();
  const [comments, setComments] = useState([]); // 댓글 목록
  const [commentText, setCommentText] = useState(""); // 댓글 입력값
  const nav = useNavigate();
  const myEmail = localStorage.getItem("email"); // 로그인한 사용자

  // 게시글 상세 조회: GET /board/{id}
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await AxiosApi.boardDetail(boardId);
        console.log(res.data);
        setBoard(res.data);
      } catch (err) {
        console.error(err);
        alert("게시글을 불러오지 못했습니다.");
        nav("/board");
      }
    };
    fetchDetail();
  }, [boardId, nav]);

  // 댓글 목록 조회: GET /comment/list/{boardId}
  // 등록/삭제 후에도 다시 호출해야 하므로 useEffect 밖에 정의
  const fetchComments = useCallback(async () => {
    try {
      const res = await AxiosApi.commentList(boardId);
      console.log(res.data);
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [boardId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // 댓글 등록: POST /comment/write
  const onCommentSubmit = async (e) => {
    e.preventDefault();
    if (commentText.trim() === "") return;
    if (!myEmail) {
      alert("로그인이 필요합니다.");
      nav("/");
      return;
    }
    try {
      const res = await AxiosApi.commentWrite(boardId, commentText, myEmail);
      if (res.data) {
        setCommentText(""); // 입력창 비우기
        fetchComments(); // 목록 새로고침
      } else {
        alert("댓글 등록에 실패했습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("서버와 통신 중 오류가 발생했습니다.");
    }
  };

  // 댓글 삭제: DELETE /comment/{commentId}
  const onCommentDelete = async (commentId) => {
    if (!window.confirm("댓글을 삭제할까요?")) return;
    try {
      const res = await AxiosApi.commentDelete(commentId);
      if (res.data) fetchComments();
      else alert("댓글 삭제에 실패했습니다.");
    } catch (err) {
      console.error(err);
      alert("서버와 통신 중 오류가 발생했습니다.");
    }
  };

  if (!board) return <Container>불러오는 중...</Container>;

  return (
    <Container>
      {/* 게시글 */}
      <Card>
        <Title>{board.title}</Title>
        <Meta>
          <span>{board.name || board.email}</span>
          <span>{board.regDate?.substring(0, 10)}</span>
        </Meta>
        <Content>{board.content}</Content>
      </Card>

      {/* 댓글 */}
      <Card>
        <CommentHeading>
          댓글 <span>{comments.length}</span>
        </CommentHeading>

        <CommentForm onSubmit={onCommentSubmit}>
          <TextArea
            value={commentText}
            placeholder="댓글을 입력하세요"
            onChange={(e) => setCommentText(e.target.value)}
          />
          <Button type="submit" enabled={commentText.trim() !== ""}>
            댓글 등록
          </Button>
        </CommentForm>

        {comments.length === 0 ? (
          <Empty>첫 댓글을 남겨보세요.</Empty>
        ) : (
          <CommentList>
            {comments.map((c) => (
              <CommentItem key={c.commentId}>
                <CommentMeta>
                  <span>
                    <b>{c.name || c.email}</b>
                    {c.regDate?.substring(0, 16).replace("T", " ")}
                  </span>
                  {/* 내 댓글일 때만 삭제 버튼 표시 */}
                  {c.email === myEmail && (
                    <DeleteBtn onClick={() => onCommentDelete(c.commentId)}>
                      삭제
                    </DeleteBtn>
                  )}
                </CommentMeta>
                <CommentText>{c.content}</CommentText>
              </CommentItem>
            ))}
          </CommentList>
        )}
      </Card>

      <BackBtn onClick={() => nav("/board")}>목록으로</BackBtn>
    </Container>
  );
};

export default BoardDetail;
