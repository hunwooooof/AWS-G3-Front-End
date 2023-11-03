import styled from "styled-components";
import Product from "./Product";
import Title from "./Title";

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
  return (
    <Wrap>
      <Title />
      <Product />
      <Product />
      <Product />
      <Product />
      <Product />
    </Wrap>
  );
};

export default Collection;
