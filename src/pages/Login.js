import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import AxiosApi from "../api/AxiosApi";

// 화면 전체를 차지하고, 가운데에 로그인 박스를 배치
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 30px;
  box-sizing: border-box;
`;

// 실제 로그인 영역: 최대 너비 제한 + 요소 간 간격
const Form = styled.form`
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.h1`
  margin: 0 0 20px;
  text-align: center;
  font-size: 28px;
`;

const SignupText = styled.p`
  margin-top: 8px;
  text-align: center;
  font-size: 14px;
  color: #666;

  a {
    margin-left: 6px;
    color: orange;
    font-weight: 700;
    text-decoration: none;
  }
`;

const KakaoBtn = styled.button`
  width: 100%;
  height: 50px;
  color: #191919;
  background-color: #fee500; /* 카카오 노란색 */
  font-size: 15px;
  font-weight: 700;
  border: none;
  border-radius: 18px;
  cursor: pointer;
`;

// 카카오 인가 코드 요청 주소 (client_id = REST API 키, 공개돼도 되는 값)
const KAKAO_AUTH_URL =
  "https://kauth.kakao.com/oauth/authorize?response_type=code" +
  `&client_id=${process.env.REACT_APP_KAKAO_CLIENT_ID}` +
  "&redirect_uri=" +
  encodeURIComponent(process.env.REACT_APP_KAKAO_REDIRECT_URI);

const Login = () => {
  const [inputEmail, setInputEmail] = useState("");
  const [inputPwd, setInputPwd] = useState("");

  const nav = useNavigate();

  // 둘 다 입력돼야 버튼 활성화
  const isValid = inputEmail.trim() !== "" && inputPwd !== "";

  // form의 onSubmit으로 처리하면 Enter 키로도 로그인 가능
  const onSubmit = async (e) => {
    e.preventDefault(); // 페이지 새로고침 방지

    try {
      const response = await AxiosApi.memberLogin(inputEmail, inputPwd);
      console.log(response.data);
      // 응답: { grantType, accessToken, accessTokenExpiresIn, refreshToken, refreshTokenExpiresIn }
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("email", inputEmail); // 화면 표시용 (내 댓글 삭제 버튼 등)
      localStorage.setItem("isLogin", "TRUE");
      nav("/home", { replace: true }); // 뒤로가기로 로그인 화면에 다시 오지 않도록
    } catch (err) {
      // 실패 시 서버가 401 + { message, code } 응답
      alert(err.response?.data?.message ?? "이메일 또는 비밀번호가 틀립니다.");
    }
  };

  return (
    <Container>
      <Form onSubmit={onSubmit}>
        <Title>로그인</Title>
        <Input
          type="email"
          value={inputEmail}
          placeholder="이메일"
          onChange={(e) => setInputEmail(e.target.value)}
        />
        <Input
          type="password"
          value={inputPwd}
          placeholder="비밀번호"
          onChange={(e) => setInputPwd(e.target.value)}
        />
        <Button type="submit" enabled={isValid}>
          로그인
        </Button>
        <KakaoBtn
          type="button"
          onClick={() => (window.location.href = KAKAO_AUTH_URL)}
        >
          카카오 로그인
        </KakaoBtn>
        <SignupText>
          계정이 없으신가요?
          <Link to="/signup">회원가입</Link>
        </SignupText>
      </Form>
    </Container>
  );
};

export default Login;
