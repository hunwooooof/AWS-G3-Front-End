import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import discountImage from './discount.webp';
import freeFreightImage from './free-freight-fee.webp';
import disabledDiscountImage from './discount-disabled.webp';
import disabledFreeFreightImage from './free-freight-fee-disabled.webp';
import ec2Api from '../../utils/ec2Api';
import { AuthContext } from '../../context/authContext';
import toast, { Toaster } from 'react-hot-toast';

const Wrapper = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 65px 0 49px;
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 1279px) {
    padding: 48px 50px 32px;
  }
`;

const Title = styled.h2`
  line-height: 1.5;
  font-size: 38px;
  letter-spacing: 6.4px;
  color: #3f3a3a;
  margin-bottom: 48px;
  @media screen and (max-width: 1279px) {
    line-height: 24px;
    font-size: 24px;
    letter-spacing: 4px;
  }
`;

const SubTitle = styled.div`
  display: flex;
  gap: 40px;
  border-bottom: 1px solid #bababa;
  margin-bottom: 48px;
  @media screen and (max-width: 1279px) {
    margin-bottom: 40px;
    gap: 15px;
  }
`;

const Tag = styled.div`
  line-height: 36px;
  font-size: 20px;
  padding: 20px;
  color: ${(props) => (props.$isActive ? '#8b572a' : '#3f3a3a')};
  border-bottom: ${(props) => (props.$isActive ? '3px solid #8b572a' : 'none')};
  &:hover {
    cursor: pointer;
    color: #8b572a;
  }
  @media screen and (max-width: 1279px) {
    font-size: 14px;
    padding: 10px;
  }
`;

const Section = styled.section`
  margin: 0 100px;
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 40px;
  @media screen and (max-width: 1279px) {
    margin: 0;
  }
`;

const Item = styled.div`
  display: flex;
  gap: 10px;
  background-color: white;
  box-shadow: 2px 2px 3px #cbcbcb;
  @media screen and (max-width: 1279px) {
    gap: 10px;
  }
`;

const Img = styled.img`
  width: 30%;
  @media screen and (max-width: 1279px) {
    width: 40%;
  }
`;

const ItemDetail = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  @media screen and (max-width: 1279px) {
    padding: 10% 30px;
  }
  @media screen and (max-width: 479px) {
    padding: 30px 10px;
  }
`;

const ItemInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ItemInfoName = styled.div`
  letter-spacing: 1.2px;
  font-weight: bold;
  font-size: 28px;
  @media screen and (max-width: 1279px) {
    font-size: 24px;
  }
  @media screen and (max-width: 479px) {
    font-size: 14px;
  }
`;

const GetButton = styled.button`
  white-space: nowrap;
  background-color: #3f3a3a;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 20px;

  &:hover {
    cursor: pointer;
    box-shadow: 0px 0px 5px #a1a1a1;
  }
  &:disabled {
    cursor: not-allowed;
    background-color: #bababa;
    color: white;
    box-shadow: none;
  }
  @media screen and (max-width: 479px) {
    font-size: 12px;
    padding: 5px;
  }
`;

const ExpireDate = styled.div`
  font-size: 24px;
  color: #504d4d;
  @media screen and (max-width: 1279px) {
    font-size: 20px;
  }
  @media screen and (max-width: 479px) {
    font-size: 14px;
  }
`;

const Warning = styled.div`
  letter-spacing: 2px;
  margin-top: 50px;
  text-align: center;
  font-size: 36px;
  @media screen and (max-width: 1279px) {
    font-size: 20px;
  }
`;

const NoCoupon = styled(Warning)`
  color: #cbcbcb;
`;

const Loading = styled(Warning)`
  color: #cbcbcb;
`;

const NoMore = styled(Warning)`
  color: #ff7373;
  margin-top: 0px;
  font-size: 20px;
`;

function Coupon() {
  const { isLogin, jwtToken } = useContext(AuthContext);
  const [couponsTag, setCouponsTag] = useState('All');
  const [allCoupons, setAllCoupons] = useState(null);
  const [userValidCoupons, setUserValidCoupons] = useState(null);
  const [userInvalidCoupons, setUserInvalidCoupons] = useState(null);
  const coupons =
    couponsTag === 'All' ? allCoupons : couponsTag === 'UserCoupons' ? userValidCoupons : userInvalidCoupons;

  useEffect(() => {
    async function getAllCoupons() {
      const { data } = await ec2Api.getAllCoupons();
      setAllCoupons(data);
      console.log('所有', data);
    }
    getAllCoupons();
  }, [couponsTag]);

  useEffect(() => {
    async function getUserValidCoupons() {
      const { data } = await ec2Api.getUserValidCoupons(jwtToken);
      setUserValidCoupons(data);
      console.log('可用', data);
    }
    if (isLogin) getUserValidCoupons();
  }, [couponsTag]);

  useEffect(() => {
    async function getUserInvalidCoupons() {
      const { data } = await ec2Api.getUserInvalidCoupons(jwtToken);
      setUserInvalidCoupons(data);
      console.log('已失效', data);
    }
    if (isLogin) getUserInvalidCoupons();
  }, [couponsTag]);

  const handleCouponTag = (e) => {
    e.target.id !== 'All'
      ? isLogin
        ? setCouponsTag(e.target.id)
        : toast('請先登入再查看優惠券', { icon: '❗️' })
      : setCouponsTag(e.target.id);
  };

  const handleClaimCoupon = (e) => {
    async function postClaimCoupon() {
      const response = await ec2Api.postClaimCoupon(e.target.id, jwtToken);
      if (response) {
        response.success ? toast.success('優惠券歸戶成功！') : null;
        async function getUserValidCoupons() {
          const { data } = await ec2Api.getUserValidCoupons(jwtToken);
          setUserValidCoupons(data);
          console.log('可用', data);
        }
        getUserValidCoupons();
      }
    }
    isLogin ? postClaimCoupon() : toast('請先登入', { icon: '❗️' });
  };

  return (
    <Wrapper>
      <Title>優惠券專區</Title>
      <Toaster
        toastOptions={{
          duration: 1000,
          style: {
            background: '#ebebebd1',
            padding: '5px 10px',
            textAlign: 'center',
            color: '#181818',
            fontSize: '28px',
            margin: '10px',
          },
        }}
      />
      <SubTitle>
        <Tag id='All' onClick={handleCouponTag} $isActive={couponsTag === 'All'}>
          未領取
        </Tag>
        <Tag id='UserCoupons' onClick={handleCouponTag} $isActive={couponsTag === 'UserCoupons'}>
          已領取
        </Tag>
        <Tag id='CouponHistory' onClick={handleCouponTag} $isActive={couponsTag === 'CouponHistory'}>
          歷史紀錄
        </Tag>
      </SubTitle>
      <Section>
        {coupons ? (
          coupons.length > 0 ? (
            userValidCoupons ? (
              coupons.map((coupon) => {
                const couponImg =
                  coupon.type === '折扣'
                    ? couponsTag === 'CouponHistory'
                      ? disabledDiscountImage
                      : discountImage
                    : couponsTag === 'CouponHistory'
                    ? disabledFreeFreightImage
                    : freeFreightImage;
                const expiredDate = coupon.expiredDate.slice(0, 10);
                return (
                  <Item key={coupon.id}>
                    <Img src={couponImg} alt='coupon.couponTitle' />
                    <ItemDetail>
                      <ItemInfo>
                        <ItemInfoName>{coupon.title}</ItemInfoName>
                        {couponsTag === 'All' ? (
                          userValidCoupons.some((userCoupon) => userCoupon.id === coupon.id) ? (
                            <GetButton disabled>已領取</GetButton>
                          ) : coupon.amount === 0 ? (
                            <NoMore>剩下０張</NoMore>
                          ) : (
                            <GetButton onClick={handleClaimCoupon} id={coupon.id}>
                              領取
                            </GetButton>
                          )
                        ) : null}
                      </ItemInfo>
                      <ExpireDate>有效期限：{expiredDate}</ExpireDate>
                    </ItemDetail>
                  </Item>
                );
              })
            ) : (
              coupons.map((coupon) => {
                const couponImg = coupon.type === '折扣' ? discountImage : freeFreightImage;
                const expiredDate = coupon.expiredDate.slice(0, 10);
                return (
                  <Item key={coupon.id}>
                    <Img src={couponImg} alt='coupon.couponTitle' />
                    <ItemDetail>
                      <ItemInfo>
                        <ItemInfoName>{coupon.title}</ItemInfoName>
                        <GetButton onClick={handleClaimCoupon} id={coupon.id}>
                          領取
                        </GetButton>
                      </ItemInfo>
                      <ExpireDate>有效期限：{expiredDate}</ExpireDate>
                    </ItemDetail>
                  </Item>
                );
              })
            )
          ) : (
            <NoCoupon>目前沒有優惠券唷！</NoCoupon>
          )
        ) : (
          <Loading>載入優惠券中⋯</Loading>
        )}
      </Section>
    </Wrapper>
  );
}

export default Coupon;
