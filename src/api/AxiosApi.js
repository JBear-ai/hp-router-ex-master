import AxiosInstance from "./AxiosInstance";

const AxiosApi = {
  // auth controller
  // 회원 가입 여부 확인 (GET)
  memberExist: async (email) => {
    return await AxiosInstance.get(`/auth/exists/${email}`);
  },
  // 회원 가입 (POST)
  memberSignup: async (email, pwd, name) => {
    return await AxiosInstance.post("/auth/signup", { email, pwd, name });
  },
  // 로그인 (POST)
  memberLogin: async (email, pwd) => {
    return await AxiosInstance.post("/auth/login", { email, pwd });
  },
  // 로그아웃 (POST)
  memberLogout: async () => {
    return await AxiosInstance.post("/auth/logout");
  },

  // board controller
  // 게시글 쓰기 (POST)
  boardWrite: async (title, content, email) => {
    return await AxiosInstance.post("/board/write", { title, content });
  },
  // 게시글 전체 목록 조회 (GET)
  boardList: async () => {
    return await AxiosInstance.get("/board/list");
  },
  // 게시글 상세 조회
  boardDetail: async (id) => {
    return await AxiosInstance.get(`/board/${id}`);
  },
  // 게시글 페이지 조회
  // 게시글 수정
  // 게시글 삭제
  // 게시슬 검색

  // comment controller
  // 댓글 쓰기
  commentWrite: async (boardId, content, email) => {
    return await AxiosInstance.post("/comment/write", { boardId, content });
  },
  // 댓글 목록 조회
  commentList: async (boardId) => {
    return await AxiosInstance.get(`/comment/list/${boardId}`);
  },
  // 댓글 수정
  commentModify: async (commentId, content, email) => {
    return await AxiosInstance.put(`/comment/${commentId}`, { content });
  },
  // 댓글 삭제
  commentDelete: async (commentId) => {
    return await AxiosInstance.delete(`/comment/${commentId}`);
  },

  // member constroller
  // 회원 목록 조회
  memberList: async () => {
    return await AxiosInstance.get("/member/list");
  },
  // 회원 정보 수정
  // 회원 목록 페이지 조회
  // 회원 삭제
  // 회원 상세 조회

  // 채팅방 생성
  chatCreate: async (name) => {
    return await AxiosInstance.post("/chat/new", { name });
  },
  // 채팅방 목록
  chatList: async () => {
    return await AxiosInstance.get("/chat/list");
  },
  // 채팅방 정보
  chatRoom: async (roomId) => {
    return await AxiosInstance.get(`/chat/room/${roomId}`);
  },
  // 카카오 로그인
  kakaoLogin: async (code) => {
    return await AxiosInstance.post("/auth/kakao", { code });
  },
};

export default AxiosApi;
