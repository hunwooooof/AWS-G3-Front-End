import { useState } from "react";
import styled from "styled-components";
import product from "./product.png";

const Wrapper = styled.div`
  width: 100%;
  height: 236px;
  display: flex;
  margin-bottom: 28px;
`;
const Image = styled.img`
  height: 100%;
  margin-right: 31px;
`;
const Details = styled.div``;

const Title = styled.p`
  color: #3f3a3a;
  font-size: 30px;
  line-height: 38px;
  letter-spacing: 6.4px;
  margin: 9px 0 25px 0;
  white-space: nowrap;
  @media screen and (max-width: 1279px) {
    margin: 4px 0;
    font-size: 20px;
  }
`;
const Price = styled.p`
  color: #3f3a3a;
  font-size: 30px;
  line-height: 36px;
  @media screen and (max-width: 1279px) {
    font-size: 20px;
  }
`;
const HeartIcon = styled.span`
  font-family: "Material Icons";
  font-size: 54px;
  cursor: pointer;
  margin: auto 12px 12px auto;
  color: ${(props) => (props.isLiked ? "#d25e5a" : "#787575")};
  @media screen and (max-width: 1279px) {
    font-size: 36px;
  }
`;

const Product = () => {
  const [isLiked, setIsLiked] = useState(true);

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <Wrapper>
      <Image src={product} />
      <Details>
        <Title>前開衩扭結洋裝</Title>
        <Price>TWD.799</Price>
      </Details>
      <HeartIcon
        className="material-icons"
        onClick={toggleLike}
        isLiked={isLiked}
      >
        {isLiked ? " favorite" : "favorite_border"}
      </HeartIcon>
    </Wrapper>
  );
};

export default Product;
