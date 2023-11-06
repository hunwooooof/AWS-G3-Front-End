import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import ec2Api from '../../utils/ec2Api';
import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';

const Wrapper = styled(Link)`
  width: 100%;
  height: 236px;
  display: flex;
  margin-bottom: 28px;
  text-decoration: none;
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
  font-family: 'Material Icons';
  font-size: 54px;
  cursor: pointer;
  margin: auto 12px 12px auto;
  color: ${(props) => (props.$isLiked ? '#d25e5a' : '#787575')};
  @media screen and (max-width: 1279px) {
    font-size: 36px;
  }
`;

const Product = ({ productInfo }) => {
  const { isLogin } = useContext(AuthContext);
  const [isLiked, setIsLiked] = useState(true);

  const toggleLike = async () => {
    setIsLiked(!isLiked);
  };

  // 收藏商品
  //   有登入的話
  //     不在用戶收藏內的話（防止初始載入重新加入）
  //       打api加入收藏
  //   沒登入的話
  //     不在localstorage的話（防止初始載入重新加入）
  //       加入localstorage
  // 刪除收藏
  //   有登入的話
  //     刪除用戶收藏
  //   沒登入的話
  //     從localstorage collection 刪除此商品

  useEffect(() => {
    const localCollection = JSON.parse(localStorage.getItem('collection'));
    if (isLiked) {
      if (isLogin) {
        const checkIsCollected = async () => {
          const isCollected = (await ec2Api.getCollection()).data.find(
            (item) => {
              return item.id === productInfo.id;
            },
          );
          if (!isCollected) {
            ec2Api.addCollection(productInfo.id);
          }
        };
        checkIsCollected();
      } else {
        const isLocalCollected = localCollection.find((item) => {
          return item.id === productInfo.id;
        });
        if (!isLocalCollected) {
          localStorage.setItem(
            'collection',
            JSON.stringify([...localCollection, productInfo]),
          );
        }
      }
    } else {
      if (isLogin) {
        ec2Api.deleteCollection(productInfo.id);
      } else {
        const updatedList = localCollection.filter(
          (item) => item.id !== productInfo.id,
        );
        localStorage.setItem('collection', JSON.stringify(updatedList));
      }
    }
  }, [isLiked]);

  return (
    <Wrapper to="/product">
      <Image src={productInfo.main_image} />
      <Details>
        <Title>{productInfo.title}</Title>
        {/* <Price>{productInfo.price}</Price> */}
      </Details>
      <HeartIcon
        className="material-icons"
        onClick={(e) => {
          toggleLike();
          e.preventDefault();
        }}
        $isLiked={isLiked}
      >
        {isLiked ? ' favorite' : 'favorite_border'}
      </HeartIcon>
    </Wrapper>
  );
};

export default Product;
