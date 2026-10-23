// 현업스럽게 만들어볼려고
import axios from "axios"; // 비동기 통신 라이브러리

const HM_DOMAIN = "http://localhost:8111"; // 나중에 수정을 할때 편하게 하기 위한 밑작업

const AxiosApi = {
  // 로그인 (Auth_Controller)
  // 회원 가입 여부 (GET)
  memberExist: async (email) => {
    return await axios.get(HM_DOMAIN + `/auth/exits/${email}`);
  },

  // 회원가입 (POST)
  memberSingup: async (email, pwd, name) => {
    return await axios.post(HM_DOMAIN + "/auth/signUp", { email, pwd, name });
  },
  // 로그인 (POST)
  memberLogin: async (email, pwd) => {
    return await axios.post(HM_DOMAIN + "/auth/login", { email, pwd });
  },

  // 회원 (Member_Controller)
  // 전체 회원 조회 (GET)
  memberList: async () => {
    return await axios.get(HM_DOMAIN + "/member/list");
  },
  // 회원 상세 조회 (GET)
  memberSerch: async (email) => {
    return await axios.get(HM_DOMAIN + `/member/${email}`);
  },
  // 회원 삭제  (DEL)
  memberDelete: async (email) => {
    return await axios.delete(HM_DOMAIN + `/member/${email}`);
  },
  // 회원 수정  (PUT)
  memberModify: async (pwd, name, image, email) => {
    return await axios.put(HM_DOMAIN + "/member/modify", {
      pwd,
      name,
      image,
      email,
    });
  },
  // 회원 페이지네이션  (GET)

  // 게시판 (Board_Controller)
  // 게시글 쓰기 (POST)
  boardWrite: async (title, content, email) => {
    return await axios.post(HM_DOMAIN + "/board/write", {
      title,
      content,
      email,
    });
  },
  // 게시릊 전체 목록 조회 (GET)
  boardList: async () => {
    return await axios.get(HM_DOMAIN + "/board/list");
  },
  // 게시글 상세 조회 (GET {ID})
  boardDetail: async (id) => {
    return await axios.get(HM_DOMAIN + `/board/${id}`);
  },

  // 게시글 검색 search (GET) {keyword,page,size / query}

  // 좋아요 (POST)
  boardLike: async (id) => {
    return await axios.post(HM_DOMAIN + `/board/${id}/like`);
  },

  // 게시글 수정 (PUT)
  boardModify: async (id, title, content) => {
    return await axios.put(HM_DOMAIN + "/board/modify", { id, title, content });
  },
  // 게시글 삭제 (DEL)
  boardDelete: async (id) => {
    return await axios.delete(HM_DOMAIN + `/board/${id}`);
  },
  // 게시글 페이지네이션 (GET)

  // 댓글 (Comment_Controller)
  // 특정 게시글 댓글 목록 조회 (GET)
  commentList: async (boardId) => {
    return await axios.get(HM_DOMAIN + `/comment/list/${boardId}`);
  },
  // 댓글 작성 (POST)
  commentWrite: async (boardId, content, email) => {
    return await axios.post(HM_DOMAIN + "/comment/write", {
      boardId,
      content,
      email,
    });
  },
  // 댓글 수정 (PUT)
  commentModify: async (commentId, content, email) => {
    return await axios.put(HM_DOMAIN + `/comment/${commentId}`, {
      content,
      email,
    });
  },
  // 댓글 삭제 (DEL)
  commentDelete: async (commentId) => {
    return await axios.delete(HM_DOMAIN + `/comment/${commentId}`);
  },
  // 댓글 페이지네이션(GET)
};

export default AxiosApi;
