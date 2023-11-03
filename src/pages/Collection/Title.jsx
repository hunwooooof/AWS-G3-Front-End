import React from "react";
import styled from "styled-components";

const Text = styled.p`
  color: #3f3a3a;
  font-size: 30px;
  line-height: 38px;
  letter-spacing: 6.4px;
  margin-bottom: 25.5px;
  @media screen and (max-width: 1279px) {
    font-size: 20px;
    margin-bottom: 15.5px;
  }
`;
const Divider = styled.div`
  width: 100%;
  border: 1px #3f3a3a solid;
  margin-bottom: 54.5px;
  @media screen and (max-width: 1279px) {
    width: 100%;
    margin-bottom: 28.5px;
  }
`;
const Title = () => {
  return (
    <>
      <Text>我的收藏</Text>
      <Divider />
    </>
  );
};

export default Title;
