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
  font-size: 33px;
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
  color: #3f3a3a; //8b572a
  border-bottom: 3px solid #8b572a;
  @media screen and (max-width: 1279px) {
    font-size: 14px;
    padding: 10px;
  }
`;

const Section = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 50px;
  grid-row-gap: 40px;
  @media screen and (max-width: 1279px) {
    grid-template-columns: 430px;
    grid-column-gap: 0px;
    margin: 0 auto;
  }
  @media screen and (max-width: 579px) {
    grid-template-columns: 1fr;
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
  width: 160px;
  @media screen and (max-width: 1279px) {
    width: 120px;
  }
`;

const ItemDetail = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  @media screen and (max-width: 1279px) {
    padding: 10px;
  }
`;

const ItemInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ItemInfoName = styled.div`
  font-size: 24px;
  @media screen and (max-width: 1279px) {
    font-size: 16px;
  }
`;

const GetButton = styled.button`
  background-color: #3f3a3a;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 20px;
  &:hover {
    background-color: #bababa;
    color: #3f3a3a;
    cursor: pointer;
  }
  @media screen and (max-width: 1279px) {
    font-size: 14px;
    padding: 5px 10px;
  }
`;

const ExpireDate = styled.div`
  color: #3f3a3a;
  @media screen and (max-width: 1279px) {
    font-size: 14px;
  }
`;

const warning = styled.div`
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
  const [allCoupons, setAllCoupons] = useState(null);
  useEffect(() => {
    async function getAllCoupons() {
      const { data } = await ec2Api.getAllCoupons();
      setAllCoupons(data);
      console.log(data);
    }
    getAllCoupons();
  }, []);

  return (
    <Wrapper>
      <Title>優惠券專區</Title>
      <SubTitle>
        <Tag>未領取</Tag>
        <Tag>已領取</Tag>
        <Tag>歷史紀錄</Tag>
      </SubTitle>
      <Section>
        {allCoupons ? (
          allCoupons.length > 0 ? (
            allCoupons.map((coupon) => {
              const couponImg = coupon.couponType === '折扣' ? discountImage : freeFreightImage;
              return (
                <Item key={coupon.couponId}>
                  <Img src={couponImg} alt='coupon.couponTitle' />
                  <ItemDetail>
                    <ItemInfo>
                      <ItemInfoName>{coupon.couponTitle}</ItemInfoName>
                      <GetButton>領取</GetButton>
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
