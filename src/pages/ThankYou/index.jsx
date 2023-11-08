import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import completeURL from './complete.png';

const Wrapper = styled.div`
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const CompleteImg = styled.img`
  width: 70px;
  margin-bottom: 50px;
  @media screen and (max-width: 1279px) {
    width: 50px;
  }
`;

const Title = styled.div`
  padding-bottom: 16px;
  border-bottom: 1px solid #979797;
  font-size: 24px;
  font-weight: bold;
`;

const Content = styled.div`
  font-size: 24px;
  margin-top: 36px;
  @media screen and (max-width: 1279px) {
    font-size: 20px;
  }
`;

const OrderID = styled.div`
  margin: 44px 0;
  font-size: 25px;
  font-weight: bold;
  letter-spacing: 1.2px;
  @media screen and (max-width: 1279px) {
    font-size: 15px;
  }
`;

const BackButton = styled.button`
  margin-top: 24px;
  display: block;
  text-decoration: none;
  text-align: center;
  width: 250px;
  margin: 0 auto;
  padding: 25px 0;
  background: #000;
  color: #fff;
  font-size: 25px;
  letter-spacing: 4px;
  &:hover {
    cursor: pointer;
  }
  @media screen and (max-width: 1279px) {
    font-size: 20px;
    margin-bottom: 30px;
    padding: 15px 0;
  }
`;

function ThankYou() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <Navigate to='/' replace />;

  return (
    <Wrapper>
      <CompleteImg src={completeURL} />
      <Title>感謝您的購買，我們會盡快將商品送達！</Title>
      <Content>請記住以下訂單編號，以便查詢</Content>
      <OrderID>—— {state.orderNumber} ——</OrderID>
      <BackButton onClick={() => navigate('/')}>繼續購物</BackButton>
    </Wrapper>
  );
}

export default ThankYou;
