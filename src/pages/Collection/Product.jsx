import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import ec2Api from '../../utils/ec2Api';
import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import toast, { Toaster } from 'react-hot-toast';

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
  color: #8d8989;
  font-size: 26px;
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

const Product = ({ collection, setCollection, productInfo }) => {
  const { isLogin, jwtToken } = useContext(AuthContext);
  const [isLiked, setIsLiked] = useState(true);
  const toggleLike = async () => {
    setIsLiked(!isLiked);
  };

  useEffect(() => {
    const localCollection = JSON.parse(localStorage.getItem('collection'));
    if (isLiked && !collection.includes(productInfo)) {
      if (isLogin) {
        const checkIsCollected = async () => {
          const isCollected = (await ec2Api.getCollection()).data.find((item) => {
            return item.id === productInfo.id;
          });
          if (!isCollected) {
            ec2Api.addCollection(productInfo.id);
          }
        };
        console.log('hi');
        checkIsCollected();
      } else {
        const isLocalCollected = localCollection.find((item) => {
          return item.id === productInfo.id;
        });
        if (!isLocalCollected) {
          localStorage.setItem('collection', JSON.stringify([...localCollection, productInfo]));
        }
      }
    }
    if (!isLiked && collection.includes(productInfo)) {
      if (isLogin) {
        async function deleteCollection() {
          const response = await ec2Api.deleteCollection(productInfo.id, jwtToken);
          if (response.success) toast(response.message);
          async function getCollection() {
            const response = await ec2Api.getCollection(jwtToken);
            if (response.data) setCollection(response.data);
            else setCollection(false);
          }
          getCollection();
        }
        deleteCollection();
      } else {
        const updatedList = localCollection.filter((item) => item.id !== productInfo.id);
        localStorage.setItem('collection', JSON.stringify(updatedList));
      }
    }
  }, [isLiked]);

  return (
    <Wrapper to={`/products/${productInfo.id}`}>
      <Toaster />
      <Image src={productInfo.main_image} />
      <Details>
        <Title>{productInfo.title}</Title>
        <Price>NT. {productInfo.price}</Price>
      </Details>
      <HeartIcon
        className='material-icons'
        onClick={(e) => {
          toggleLike();
          e.preventDefault();
        }}
        $isLiked={isLiked}>
        {isLiked ? ' favorite' : 'favorite_border'}
      </HeartIcon>
    </Wrapper>
  );
};

export default Product;
