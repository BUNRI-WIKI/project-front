import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isLoggedInState } from "../../state/authState";
import AuthToken from "./AuthToken";
import "./MyPageForm.css";

function MyPageForm() {
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const navigate = useNavigate();
  const [account, setAccount] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인한 회원만 볼 수 있습니다.");
      navigate("/");
    } else {
      (async () => {
        try {
          const response = await AuthToken.get(
            "http://3.39.190.90/api/account/list"
          );
          const accountName = localStorage.getItem("accountName");
          const matchingAccount = response.data.find(
            (account) => account.accountName === accountName
          );
          if (matchingAccount) setAccount(matchingAccount);
        } catch (error) {
          console.error("계정 정보를 가져오는 데 실패했습니다.", error);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [isLoggedIn, navigate]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="myPage">
      <h2>내 정보</h2>
      {account ? (
        <div className="accountInfo">
          <ul>
            <li>ID: {account.id}</li>
            <li>아이디: {account.accountName}</li>
            <li>이메일: {account.email}</li>
            <li>닉네임: {account.nickname}</li>
          </ul>
          {/* <button onClick={}>정보 수정</button> */}
        </div>
      ) : (
        <div>계정 정보를 찾을 수 없습니다.</div>
      )}
    </div>
  );
}

export default MyPageForm;
