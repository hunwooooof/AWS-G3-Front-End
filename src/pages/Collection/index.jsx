import styled from 'styled-components';
import Product from './Product';
import Title from './Title';
import ec2Api from '../../utils/ec2Api';
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';

const Wrap = styled.div`
  width: 960px;
  margin: 65px auto;
  @media screen and (max-width: 1279px) {
    width: auto;
    max-width: 100%;
    min-width: auto;
    margin: 0;
    padding: 21px 39px;
  }
`;

const Warning = styled.div`
  letter-spacing: 2px;
  margin-top: 50px;
  text-align: center;
  font-size: 36px;
  color: #8d8989;
  @media screen and (max-width: 1279px) {
    font-size: 20px;
  }
`;

const Collection = () => {
  const { isLogin, jwtToken } = useContext(AuthContext);
  const [collection, setCollection] = useState([]);

  useEffect(() => {
    async function getCollection() {
      const localCollection = JSON.parse(localStorage.getItem('collection'));
      if (isLogin && localCollection) {
        localCollection.forEach((item) => ec2Api.addCollection(item.id, jwtToken));
        setTimeout(() => {
          ec2Api.getCollection(jwtToken).then((res) => setCollection(res.data));
        }, 800);
        localStorage.removeItem('collection');
      } else if (isLogin) {
        ec2Api.getCollection(jwtToken).then((res) => setCollection(res.data));
      } else {
        setCollection(localCollection);
      }
    }
    getCollection();
  }, []);

  return (
    <Wrap>
      <Title />
      {collection &&
        collection.map((productInfo) => {
          return (
            <Product
              productInfo={productInfo}
              collection={collection}
              setCollection={setCollection}
              key={productInfo.id}
            />
          );
        })}
      {collection.length === 0 && <Warning>目前沒有收藏的商品！</Warning>}
    </Wrap>
  );
};

export default Collection;
