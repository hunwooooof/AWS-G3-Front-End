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
const Collection = () => {
  const { isLogin, jwtToken } = useContext(AuthContext);
  const [collection, setCollection] = useState([]);

  useEffect(() => {
    const localCollection = JSON.parse(localStorage.getItem('collection'));
    if (localCollection === null || localCollection.length === 0) {
      localStorage.setItem('collection', JSON.stringify([]));
    }
  }, []);
  // 如果有登入
  //   先抓會員收藏再抓本地收藏 如果有沒存在會員收藏的本地收藏 先加入會員收藏
  //   重新抓一次會員收藏
  // 沒有登入的話
  //   載入本地收藏
  useEffect(() => {
    async function getCollection() {
      const localCollection = JSON.parse(localStorage.getItem('collection'));
      if (isLogin) {
        const userCollection = (await ec2Api.getCollection(jwtToken)).data;
        const userCollectionId = userCollection.map((product) => product.id);
        const toBeSavedCollection = localCollection.filter(
          (id) => !userCollectionId.includes(id),
        );
        if (toBeSavedCollection.length > 0) {
          for (const productId of toBeSavedCollection) {
            await ec2Api.addCollection(productId);
          }
        }

        const newUserCollection = (await ec2Api.getCollection(jwtToken)).data;
        console.log(newUserCollection);
        setCollection(newUserCollection);
      } else {
        console.log('no user');
        setCollection(localCollection);
      }
    }
    getCollection();
  }, []);

  return (
    <Wrap>
      <Title />
      {collection &&
        collection.map((productInfo, index) => {
          return <Product productInfo={productInfo} key={index} />;
        })}
      {!collection && <>你沒有收藏的商品！</>}
    </Wrap>
  );
};

export default Collection;
