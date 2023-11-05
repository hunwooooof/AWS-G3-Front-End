import { useContext, useState } from 'react';
import ReactLoading from 'react-loading';
import styled from 'styled-components';
import { AuthContext } from '../../context/authContext';
import facebookImgUrl from './FacebookLogo.png';
import sImgUrl from './s-logo.png';

const Wrapper = styled.div`
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Title = styled.div`
  padding-bottom: 16px;
  border-bottom: 1px solid #979797;
  font-size: 24px;
  font-weight: bold;
`;

const Photo = styled.img`
  margin-top: 24px;
`;

const Content = styled.div`
  margin-top: 24px;
`;

const LogoutButton = styled.button`
  margin-top: 24px;
`;

const Text = styled.div`
  letter-spacing: 2px;
  font-size: 20px;
  color: #3f3a3aa6;
  margin: 50px 0;
`;

const LogIn = styled.div`
  display: flex;
  gap: 40px;
  justify-content: center;
  align-items: center;
`;

const Label = styled.label`
  width: 100px;
  margin: 20px 0;
  font-size: 20px;
  text-align: end;
  color: #3f3a3a;
  letter-spacing: 1.2px;
`;

const Input = styled.input`
  width: 300px;
  height: 35px;
  padding: 0 10px;
  border-radius: 4px;
  border: 1px solid #3f3a3a;
  font-size: 20px;
  color: #8b572a;
  letter-spacing: 1.2px;
`;

const Btn = styled.a`
  cursor: pointer;
  margin-bottom: 100px;
`;

const NativeBtn = styled(Btn)`
  margin-top: 50px;
  font-size: 20px;
  letter-spacing: 1.2px;
  color: #3f3a3a;
  &:hover {
    color: #8b572a;
  }
`;

const Loading = styled(ReactLoading)`
  margin-top: 50px;
`;

function Profile() {
  const { user, isLogin, login, nativeLogin, logout, loading } = useContext(AuthContext);
  const [isNativeShow, setIsNativeLoginShow] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    provider: 'native',
    email: '12345@123.com',
    password: '12345678hi',
  });

  const renderContent = () => {
    if (loading) return <Loading type='spinningBubbles' color='#313538' />;
    if (isLogin)
      return (
        <>
          <Photo src={user.picture} />
          <Content>{user.name}</Content>
          <Content>{user.email}</Content>
          <LogoutButton onClick={logout}>登出</LogoutButton>
        </>
      );
    return (
      <>
        <Text>選擇登入方式</Text>
        <LogIn>
          <Btn onClick={login}>
            <img src={facebookImgUrl} width={50} alt='facebook-logo' />
          </Btn>
          <Btn
            onClick={() => {
              setIsNativeLoginShow(!isNativeShow);
            }}>
            <img src={sImgUrl} width={50} alt='stylish-s-logo' />
          </Btn>
        </LogIn>
        {isNativeShow && (
          <>
            <LogIn>
              <Label>Email</Label>
              <Input
                value={loginInfo.email}
                type='email'
                name='email'
                onChange={(e) => {
                  setLoginInfo({ ...loginInfo, email: e.target.value });
                }}
              />
            </LogIn>
            <LogIn>
              <Label>Password</Label>
              <Input
                value={loginInfo.password}
                type='text'
                name='password'
                onChange={(e) => {
                  setLoginInfo({ ...loginInfo, password: e.target.value });
                }}
              />
            </LogIn>
            <LogIn>
              <NativeBtn
                type='submit'
                onClick={() => {
                  nativeLogin(loginInfo);
                }}>
                登入
              </NativeBtn>
            </LogIn>
          </>
        )}
      </>
    );
  };
  return (
    <Wrapper>
      <Title>會員基本資訊</Title>
      {renderContent()}
    </Wrapper>
  );
}

export default Profile;
