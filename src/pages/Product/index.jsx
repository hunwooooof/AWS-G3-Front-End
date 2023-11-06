import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../utils/api';
import ec2Api from '../../utils/ec2Api';
import ProductVariants from './ProductVariants';
import { AuthContext } from '../../context/authContext';

const Wrapper = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 65px 0 49px;
  display: flex;
  flex-wrap: wrap;

  @media screen and (max-width: 1279px) {
    padding: 0 0 32px;
  }
`;

const MainImage = styled.img`
  width: 560px;

  @media screen and (max-width: 1279px) {
    width: 100%;
  }
`;

const Details = styled.div`
  margin-left: 42px;
  flex-grow: 1;

  @media screen and (max-width: 1279px) {
    margin: 17px 24px 0;
  }
`;

const Title = styled.div`
  line-height: 38px;
  font-size: 32px;
  letter-spacing: 6.4px;
  color: #3f3a3a;

  @media screen and (max-width: 1279px) {
    line-height: 24px;
    font-size: 20px;
    letter-spacing: 4px;
  }
`;

const ID = styled.div`
  line-height: 24px;
  margin-top: 16px;
  font-size: 20px;
  letter-spacing: 4px;
  color: #bababa;

  @media screen and (max-width: 1279px) {
    line-height: 19px;
    margin-top: 10px;
    font-size: 16px;
    letter-spacing: 3.2px;
  }
`;

const Price = styled.div`
  display: flex;
  justify-content: space-between;
  line-height: 36px;
  margin-top: 40px;
  font-size: 30px;
  color: #3f3a3a;
  padding-bottom: 20px;
  border-bottom: 1px solid #3f3a3a;

  @media screen and (max-width: 1279px) {
    line-height: 24px;
    margin-top: 20px;
    font-size: 20px;
    padding-bottom: 10px;
  }
`;

const HeartIcon = styled.span`
  font-family: 'Material Icons';
  font-size: 40px;
  cursor: pointer;
  color: ${(props) => (props.$isLiked ? '#d25e5a' : '#787575')};
  @media screen and (max-width: 1279px) {
    font-size: 36px;
  }
`;

const Detail = styled.div`
  line-height: 30px;
  font-size: 20px;
  color: #3f3a3a;

  @media screen and (max-width: 1279px) {
    line-height: 24px;
    font-size: 14px;
  }
`;

const Note = styled(Detail)`
  margin-top: 40px;

  @media screen and (max-width: 1279px) {
    margin-top: 28px;
  }
`;

const Texture = styled(Detail)`
  margin-top: 30px;

  @media screen and (max-width: 1279px) {
    margin-top: 24px;
  }
`;

const Description = styled(Detail)`
  white-space: pre;
`;

const Place = styled(Detail)`
  ${Description} + & {
    margin-top: 30px;

    @media screen and (max-width: 1279px) {
      margin-top: 24px;
    }
  }
`;

const Story = styled.div`
  margin: 50px 0 0;
  width: 100%;

  @media screen and (max-width: 1279px) {
    margin: 28px 24px 0;
  }
`;

const StoryTitle = styled.div`
  line-height: 30px;
  font-size: 20px;
  letter-spacing: 4px;
  color: #8b572a;
  display: flex;
  align-items: center;

  @media screen and (max-width: 1279px) {
    font-size: 16px;
    letter-spacing: 3.2px;
  }

  &::after {
    content: '';
    height: 1px;
    flex-grow: 1;
    background-color: #3f3a3a;
    margin-left: 64px;

    @media screen and (max-width: 1279px) {
      margin-left: 35px;
    }
  }
`;

const StoryContent = styled.div`
  line-height: 30px;
  margin-top: 28px;
  font-size: 20px;
  color: #3f3a3a;

  @media screen and (max-width: 1279px) {
    line-height: 25px;
    margin-top: 12px;
    font-size: 14px;
  }
`;

const Images = styled.div`
  margin: 30px 0 0;

  @media screen and (max-width: 1279px) {
    margin: 20px 24px 0;
    width: 100%;
  }
`;

const Image = styled.img`
  @media screen and (max-width: 1279px) {
    width: 100%;
  }

  & + & {
    margin-top: 30px;

    @media screen and (max-width: 1279px) {
      margin-top: 20px;
    }
  }
`;

function Product() {
  const { isLogin, jwtToken } = useContext(AuthContext);
  const { id } = useParams();
  const [product, setProduct] = useState();
  const [isLiked, setIsLiked] = useState(false);

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  useEffect(() => {
    async function getProduct() {
      const { data } = await api.getProduct(id);
      setProduct(data);
    }
    getProduct();
  }, [id]);

  useEffect(() => {
    const getInitialCollectStatus = async () => {
      if (isLogin) {
        const { data } = await ec2Api.getCollection();
        const userCollections = data.products;
        if (
          userCollections.some((collection) => {
            collection.id === id;
          })
        ) {
          setIsLiked(true);
        }
      } else {
        const localCollection = JSON.parse(localStorage.getItem('collection'));
        if (
          localCollection.some((collection) => {
            collection.id === product.id;
          })
        ) {
          setIsLiked(true);
        }
      }
    };
    getInitialCollectStatus();
  }, [id]);

  useEffect(() => {
    const localCollection = JSON.parse(localStorage.getItem('collection'));
    const updatedList = localCollection.filter((item) => item !== product.id);
    isLiked
      ? isLogin
        ? ec2Api.addCollection(product.id, jwtToken)
        : localStorage.setItem('collection', JSON.stringify([...localCollection, product.id]))
      : isLogin
      ? ec2Api.deleteCollection(product.id, jwtToken)
      : localStorage.setItem('collection', JSON.stringify(updatedList));
  }, [product, isLiked]);

  if (!product) return null;

  return (
    <Wrapper>
      <MainImage src={product.main_image} />
      <Details>
        <Title>{product.title}</Title>
        <ID>{product.id}</ID>
        <Price>
          TWD.{product.price}
          <HeartIcon className='material-icons' onClick={toggleLike} $isLiked={isLiked}>
            {isLiked ? ' favorite' : 'favorite_border'}
          </HeartIcon>
        </Price>
        <ProductVariants product={product} />
        <Note>{product.note}</Note>
        <Texture>{product.texture}</Texture>
        <Description>{product.description}</Description>
        <Place>素材產地 / {product.place}</Place>
        <Place>加工產地 / {product.place}</Place>
      </Details>
      <Story>
        <StoryTitle>細部說明</StoryTitle>
        <StoryContent>{product.story}</StoryContent>
      </Story>
      <Images>
        {product.images.map((image, index) => (
          <Image src={image} key={index} />
        ))}
      </Images>
    </Wrapper>
  );
}

export default Product;
