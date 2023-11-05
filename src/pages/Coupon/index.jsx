import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactLoading from 'react-loading';
import styled from 'styled-components';
import api from '../../utils/api';
import discountImage from './discount.webp';
import freeFreightImage from './free-freight-fee.webp';
import ec2Api from '../../utils/ec2Api';

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

const warning = styled.div`
  letter-spacing: 2px;
  margin-top: 50px;
  text-align: center;
  font-size: 36px;
  @media screen and (max-width: 1279px) {
    font-size: 20px;
  }
`;

const NoCoupon = styled(warning)`
  color: #cbcbcb;
`;

const Loading = styled(warning)`
  color: #cbcbcb;
`;

function Coupon() {
  const [couponsTag, setCouponsTag] = useState('All');
  const [allCoupons, setAllCoupons] = useState(null);
  const [userCoupons, setUserCoupons] = useState(null);
  const coupons =
    couponsTag === 'All'
      ? allCoupons
      : couponsTag === 'UserCoupons'
      ? userCoupons.filter((coupon) => !coupon.isUsed)
      : userCoupons.filter((coupon) => coupon.isUsed);

  useEffect(() => {
    async function getAllCoupons() {
      const { data } = await ec2Api.getAllCoupons();
      setAllCoupons(data);
      console.log(data);
    }
    getAllCoupons();
  }, []);

  useEffect(() => {
    async function getUserCoupons() {
      const { data } = await ec2Api.getUserCoupons();
      setUserCoupons(data);
      console.log(data);
    }
    getUserCoupons();
  }, []);

  const handleCouponTag = (e) => {
    setCouponsTag(e.target.id);
  };

  // const handleClaimCoupon = (jwtToken) => {
  //   async function postClaimCoupon() {
  //     const { data } = await ec2Api.postClaimCoupon(jwtToken);
  //     console.log(data);
  //   }
  //   postClaimCoupon();
  // };

  return (
    <Wrapper>
      <Title>優惠券專區</Title>
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
          coupons.length > 0 && userCoupons ? (
            coupons.map((coupon) => {
              const couponImg = coupon.couponType === '折扣' ? discountImage : freeFreightImage;
              return (
                <Item key={coupon.couponId}>
                  <Img src={couponImg} alt='coupon.couponTitle' />
                  <ItemDetail>
                    <ItemInfo>
                      <ItemInfoName>{coupon.couponTitle}</ItemInfoName>
                      {couponsTag === 'All' ? (
                        userCoupons.some((userCoupon) => userCoupon.couponId === coupon.couponId) ? (
                          <GetButton disabled>已領取</GetButton>
                        ) : (
                          <GetButton>領取</GetButton>
                        )
                      ) : null}
                    </ItemInfo>
                    <ExpireDate>有效期限：{coupon.couponExpiredDate}</ExpireDate>
                  </ItemDetail>
                </Item>
              );
            })
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
