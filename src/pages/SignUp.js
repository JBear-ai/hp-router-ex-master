import styled from "styled-components";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import AxiosAPi from "../api/AxiosAPi";

/* ───────── 정규식 ───────── */
// 이메일: 공백·@ 없는 문자 + @ + 도메인 + . + 2자 이상 최상위 도메인
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// 비밀번호: 8~20자, 영문 + 숫자 + 특수문자(!@#$%^&*) 각 1개 이상
const PWD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
// 이름: 한글 또는 영문 2~10자
const NAME_REGEX = /^[가-힣a-zA-Z]{2,10}$/;

/* ───────── 스타일 (Login과 동일한 레이아웃) ───────── */
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 30px;
  box-sizing: border-box;
`;

const Form = styled.form`
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h1`
  margin: 0 0 20px;
  text-align: center;
  font-size: 28px;
`;

// 입력창 + 메시지를 한 묶음으로
const Field = styled.div`
  display: flex;
  flex-direction: column;
`;

// 입력창 오른쪽 하단 메시지. 높이를 고정해 메시지가 생겨도 레이아웃이 흔들리지 않음
const Message = styled.p`
  margin: 4px 8px 0;
  min-height: 18px;
  text-align: right;
  font-size: 12px;
  color: ${({ $valid }) => ($valid ? "#2e9e4f" : "#e5484d")};
`;

const BottomText = styled.p`
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

const Signup = () => {
  const [inputEmail, setInputEmail] = useState("");
  const [inputPwd, setInputPwd] = useState("");
  const [inputPwdCheck, setInputPwdCheck] = useState("");
  const [inputName, setInputName] = useState("");
  const [isDuplicate, setIsDuplicate] = useState(false);

  const nav = useNavigate();

  // 중복여부 검사
  const checkEmail = async (e) => {
    const email = e.target.value.trim();
    setInputEmail(email);

    // 형식이 맞지 않으면 서버 확인하지 않음
    if (!EMAIL_REGEX.test(email)) {
      setIsDuplicate(false);
      return;
    }

    // 서버에 이메일 존재 여부 확인
    const response = await AxiosAPi.memberExist(email);
    console.log("중복확인 응답:", response.data);
    setIsDuplicate(response.data);
  };

  /*
  // 이메일 중복 체크
//
// 이메일을 입력할 때마다 서버에 요청하면
// 한 글자를 입력할 때마다 API가 호출되어 서버에 불필요한 요청이 많이 발생할 수 있음.
//
// 그래서 이메일 형식이 맞는 경우에만
// 사용자가 입력을 멈춘 뒤 0.5초 후 서버에 중복 확인 요청을 보냄.
// → 이런 방식을 디바운스(Debounce)라고 함.
//
// inputEmail이 변경될 때마다 useEffect가 다시 실행됨.
useEffect(() => {
  // 이메일 형식이 맞지 않으면 서버까지 확인할 필요가 없음
  if (!isEmail) {
    setEmailStatus("idle");
    return;
  }

  // 이메일 형식이 맞으면 중복 확인 중 상태로 변경
  setEmailStatus("checking");

  // 이전 요청의 결과인지 판단하기 위한 변수
  let ignore = false;

  // 사용자가 입력을 멈춘 뒤 0.5초 후 실행
  const timer = setTimeout(async () => {
    try {
      // 서버에 해당 이메일이 존재하는지 요청
      const response = await AxiosApi.memberExist(inputEmail);

      // 이메일이 이미 변경된 뒤 도착한 이전 응답이라면 무시
      if (ignore) return;

      // 서버 응답
      // true  → 이미 존재하는 이메일
      // false → 사용 가능한 이메일
      setEmailStatus(
        response.data === true ? "duplicate" : "available"
      );
    } catch (error) {
      // 서버 요청 자체가 실패한 경우
      if (!ignore) {
        setEmailStatus("error");
      }
    }
  }, 500);

  // inputEmail이 다시 변경되거나 컴포넌트가 사라질 때 실행
  return () => {
    // 이미 진행 중이던 이전 응답은 사용하지 않도록 표시
    ignore = true;

    // 0.5초가 지나기 전에 새로운 입력이 들어오면
    // 이전에 예약했던 서버 요청을 취소
    clearTimeout(timer);
  };
}, [inputEmail, isEmail]);
  */

  /* 유효성은 state로 따로 두지 않고 렌더링 때 계산(파생값)
     → 비밀번호를 바꾸면 재확인 결과도 자동으로 다시 계산됨 */
  const isEmail = EMAIL_REGEX.test(inputEmail);
  const isPwd = PWD_REGEX.test(inputPwd);
  const isPwdCheck = inputPwdCheck !== "" && inputPwd === inputPwdCheck;
  const isName = NAME_REGEX.test(inputName);

  // 이메일 형식도 맞고,
  // 서버 중복 검사 결과도 available이어야 최종 통과
  // const isEmailOk =
  // isEmail && emailStatus === "available";

  const isAllValid = isEmail && !isDuplicate && isPwd && isPwdCheck && isName;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isAllValid) return;

    // localStorage.setItem("email", inputEmail);
    // localStorage.setItem("pwd", inputPwd);
    // localStorage.setItem("name", inputName);
    const memberSignup = await AxiosAPi.memberSingup(
      inputEmail,
      inputPwd,
      inputName,
    );
    console.log(memberSignup.data);
    if (memberSignup.data === true) {
      alert(`${inputName}님, 회원가입이 완료되었습니다.`);
      nav("/", { replace: true }); // 로그인 페이지 경로에 맞게 수정
      // 회원 가입 페이지를 다시 돌아가는걸 막기 위해
    } else {
      alert("회원 가입이 실패 하였습니다.");
    }
  };

  return (
    <Container>
      <Form onSubmit={onSubmit}>
        <Title>회원가입</Title>

        <Field>
          <Input
            type="email"
            value={inputEmail}
            placeholder="이메일"
            onChange={checkEmail}
          />
          <Message $valid={isEmail && !isDuplicate}>
            {inputEmail &&
              (!isEmail
                ? "이메일 형식이 올바르지 않습니다"
                : isDuplicate
                  ? "이미 존재하는 이메일입니다."
                  : "사용 가능한 이메일입니다")}
          </Message>
        </Field>

        <Field>
          <Input
            type="password"
            value={inputPwd}
            placeholder="비밀번호"
            onChange={(e) => setInputPwd(e.target.value)}
          />
          <Message $valid={isPwd}>
            {inputPwd &&
              (isPwd
                ? "사용 가능한 비밀번호입니다."
                : "영문, 숫자, 특수문자 포함 8~20자로 입력하세요.")}
          </Message>
        </Field>

        <Field>
          <Input
            type="password"
            value={inputPwdCheck}
            placeholder="비밀번호 확인"
            onChange={(e) => setInputPwdCheck(e.target.value)}
          />
          <Message $valid={isPwdCheck}>
            {inputPwdCheck &&
              (isPwdCheck
                ? "비밀번호가 일치합니다."
                : "비밀번호가 일치하지 않습니다.")}
          </Message>
        </Field>

        <Field>
          <Input
            value={inputName}
            placeholder="이름"
            onChange={(e) => setInputName(e.target.value.trim())}
          />
          <Message $valid={isName}>
            {inputName &&
              (isName
                ? "사용 가능한 이름입니다."
                : "한글 또는 영문 2~10자로 입력하세요.")}
          </Message>
        </Field>

        <Button type="submit" enabled={isAllValid}>
          가입하기
        </Button>

        <BottomText>
          이미 계정이 있으신가요?
          <Link to="/">로그인</Link>
        </BottomText>
      </Form>
    </Container>
  );
};

export default Signup;
