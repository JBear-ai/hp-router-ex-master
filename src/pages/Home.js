import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

//콤보 박스(select 박스를 만들고 선택된 값을 전달해 페이지 이동 하기

const Home = () => {
  const nav = useNavigate(); // 페이지 이동을 위해서 사용
  const [selected, setSelected] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSelected(value);
    if (value) nav(`/profile/${value}`);
  };

  return (
    <div>
      <h1>여기가 홈 입니다.</h1>
      <p>가장 먼저 보여지는 페이지 입니다.</p>
      <Link to="/about">소개 페이지로 이동</Link>
      <br />

      <h3>콤보 박스로 프로필 이동</h3>
      <select value={selected} onChange={handleChange}>
        <option value="">--- 프로필 선택 ---</option>
        <option value="frontend">프론트엔드</option>
        <option value="backend">백엔드</option>
        <option value="dba">DBA</option>
      </select>
    </div>
  );
};
export default Home;
