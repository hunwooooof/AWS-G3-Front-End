import { Link } from 'react-router-dom';
import styled from 'styled-components';
import couponIcon from './coupon.png';
import { useState } from 'react';

const Container = styled.div`
  position: fixed;
  right: 40px;
  top: 180px;
`;

const Wrapper = styled.div`
  position: relative;
`;

const Close = styled.div`
  position: absolute;
  right: 0;
  z-index: 5;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  font-family: 'Material Icons';
  border-radius: 50%;
  background-color: #9d9d9d9d;
  cursor: pointer;
  &:hover {
    background-color: #9d9d9d;
  }
`;

const Button = styled(Link)`
  position: absolute;
  right: 5px;
  top: 5px;
  width: 100px;
  height: 100px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: 0px 0px 10px #1c1c1ce0;
  background-color: #ffc928;
  &:hover {
    box-shadow: 0px 0px 10px #e4e4e4;
  }
`;

const Img = styled.img`
  width: 100%;
  transform: rotate(20deg);
`;

function CouponBtn() {
  const [isShow, setIsShow] = useState(true);
  const handleClick = () => {
    setIsShow(false);
  };
  return (
    <>
      {isShow && (
        <Container>
          <Wrapper>
            <Close onClick={handleClick}>close</Close>
            <Button to='/coupon' onClick={handleClick}>
              <Img src={couponIcon} alt='coupon-icon' />
            </Button>
          </Wrapper>
        </Container>
      )}
    </>
  );
}
export default CouponBtn;
