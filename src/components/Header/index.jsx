import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../../context/authContext';
import { CartContext } from '../../context/cartContext';
import cartMobile from './cart-mobile.png';
import cart from './cart.png';
import logo from './logo.png';
import profileMobile from './profile-mobile.png';
import profile from './profile.png';
import search from './search.png';
import defaultPicture from './user-default.png';
import CouponBtn from './CouponBtn';
import ec2Api from '../../utils/ec2Api';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 140px;
  width: 100%;
  padding: 0 54px 0 60px;
  border-bottom: 40px solid #313538;
  z-index: 99;
  background-color: white;
  display: flex;
  align-items: center;

  @media screen and (max-width: 1279px) {
    height: 52px;
    padding: 0;
    border: none;
    justify-content: center;
  }
`;

const Logo = styled(Link)`
  width: 258px;
  height: 48px;
  background-image: url(${logo});
  background-size: contain;

  @media screen and (max-width: 1279px) {
    width: 129px;
    height: 24px;
  }
`;

const CategoryLinks = styled.div`
  margin: 16px 0 0 57px;

  @media screen and (max-width: 1279px) {
    margin: 0;
    position: fixed;
    top: 52px;
    left: 0;
    width: 100%;
    height: 50px;
    display: flex;
    background-color: #313538;
  }
`;

const CategoryLink = styled.a`
  font-size: 20px;
  letter-spacing: 30px;
  padding-left: 39px;
  padding-right: 11px;
  position: relative;
  text-decoration: none;
  color: ${(props) => (props.$isActive ? '#8b572a' : '#3f3a3a')};

  @media screen and (max-width: 1279px) {
    font-size: 16px;
    letter-spacing: normal;
    padding: 0;
    text-align: center;
    color: ${(props) => (props.$isActive ? 'white' : '#828282')};
    line-height: 50px;
    flex-grow: 1;
  }

  &:hover {
    color: #8b572a;
    cursor: pointer;

    @media screen and (max-width: 1279px) {
      color: white;
    }
  }

  & + &::before {
    content: '|';
    position: absolute;
    left: 0;
    color: #3f3a3a;

    @media screen and (max-width: 1279px) {
      color: #828282;
    }
  }
`;

const SearchBox = styled.div`
  position: absolute;
  width: 215px;
  right: 275px;
  top: 30px;
  background-color: white;
  outline: none;
  margin-left: auto;
  padding: 0px 12px;
  border-radius: 20px;
  border: solid 1px #979797;

  @media screen and (max-width: 1279px) {
    width: calc(100% - 110px);
    ${(props) =>
      props.$isAutoComplete
        ? 'border: solid 1px #979797; padding: 1px 24px 12px;'
        : 'height: 0px; border: none; padding: 0px;'}
    position: fixed;
    right: 42px;
    top: 7px;
    background-size: 32px;
  }
`;

const SearchInput = styled.input`
  height: 36px;
  width: 200px;
  outline: none;
  border: none;
  border-radius: 20px;
  background-image: url(${search});
  background-size: 44px;
  background-position: 160px top;
  background-repeat: no-repeat;
  font-size: 20px;
  line-height: 24px;
  color: #8b572a;

  @media screen and (max-width: 1279px) {
    width: 0;
    border: none;
    position: fixed;
    right: 47px;
    background-size: 32px;
    background-position: right top;
    padding: 0 20px;
    &:focus {
      width: calc(100% - 120px);
      border: solid 1px #d3d3d3;
    }
  }
`;

const Divider = styled.div`
  width: 85%;
  height: 1px;
  border: 1px solid #979797ab;

  @media screen and (max-width: 1279px) {
    margin-top: 35px;
    width: 98%;
  }
`;

const Advice = styled.div`
  cursor: pointer;
  font-size: 18px;
  line-height: 24px;
  color: #828282;
  margin: 6px 0;
  padding: 4px 0 4px 8px;
  border-radius: 8px;
  background-color: white;

  &:hover {
    background: #eee;
  }
`;

const PageLinks = styled.div`
  margin-left: auto;
  display: flex;

  @media screen and (max-width: 1279px) {
    width: 100%;
    margin-left: 0;
    height: 60px;
    position: fixed;
    left: 0;
    bottom: 0;
    background-color: #313538;
  }
`;

const PageLink = styled(Link)`
  @media screen and (max-width: 1279px) {
    width: 50%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  & + & {
    margin-left: 42px;

    @media screen and (max-width: 1279px) {
      margin-left: 0;
    }
  }

  & + &::before {
    @media screen and (max-width: 1279px) {
      content: '';
      position: absolute;
      left: 0;
      width: 1px;
      height: 24px;
      margin: 10px 51px 10px 0;
      background-color: #828282;
    }
  }
`;

const CollapsibleMenu = styled.div`
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  gap: 15px;
  position: absolute;
  top: 85px;
  right: 55px;
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0px 0px 3px #313538;
  @media screen and (max-width: 1279px) {
    gap: 10px;
    top: -180px;
    right: 10px;
    bottom: 70px;
    background: #313538;
    border-radius: 8px;
    box-shadow: none;
    border: 0.5px solid white;
    padding: 10px;
  }
`;

const CollapsibleMenuLink = styled(Link)`
  text-decoration: none;
  font-size: 20px;
  color: #313538;
  cursor: pointer;
  padding: 10px 20px;
  &:hover {
    color: #8b572a;
  }
  @media screen and (max-width: 1279px) {
    text-decoration: none;
    font-size: 16px;
    color: #bbb;

    &:hover {
      color: white;
    }
  }
`;

const PageLinkIcon = styled.div`
  width: 44px;
  height: 44px;
  cursor: pointer;
  background-size: contain;
  position: relative;
`;

const PageLinkCartIcon = styled(PageLinkIcon)`
  background-image: url(${cart});

  @media screen and (max-width: 1279px) {
    background-image: url(${cartMobile});
  }
`;

const PageLinkProfileIcon = styled(PageLinkIcon)`
  background-image: url(${({ url }) => url ?? profile});
  border-radius: 50%;

  @media screen and (max-width: 1279px) {
    background-image: url(${profileMobile});
  }
`;

const PageLinkIconNumber = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 24px;
  height: 24px;
  background-color: #8b572a;
  color: white;
  border-radius: 50%;
  text-align: center;
  line-height: 24px;
`;

const PageLinkText = styled.div`
  display: none;
  @media screen and (max-width: 1279px) {
    display: block;
    color: white;
  }
`;

const categories = [
  {
    name: 'women',
    displayText: '女裝',
  },
  {
    name: 'men',
    displayText: '男裝',
  },
  {
    name: 'accessories',
    displayText: '配件',
  },
];

function Header() {
  const [inputValue, setInputValue] = useState('');
  const { user } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const [isProfileMenuShow, setIsProfileMenuShow] = useState(false);
  const [isAutoComplete, setIsAutoComplete] = useState(false);
  const [autoSearch, setAutoSearch] = useState();

  useEffect(() => {
    if (category) setInputValue('');
  }, [category]);

  useEffect(() => {
    async function autoSearchProducts() {
      const response = await ec2Api.autoSearchProducts(inputValue);
      if (response.total > 0) {
        console.log(response);
        setAutoSearch(response.products);
        setIsAutoComplete(true);
      } else {
        setIsAutoComplete(false);
      }
    }
    autoSearchProducts();
  }, [inputValue]);

  const handleProfileMenuShow = (e) => {
    e.stopPropagation();
    setIsProfileMenuShow(!isProfileMenuShow);
  };

  const handleProfileMenuNotShow = () => {
    setIsProfileMenuShow(false);
  };

  return (
    <Wrapper
      onClick={() => {
        handleProfileMenuNotShow();
        setIsAutoComplete(false);
      }}>
      <Logo to='/' />
      <CategoryLinks>
        {categories.map(({ name, displayText }, index) => (
          <CategoryLink
            $isActive={category === name}
            key={index}
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: 'smooth',
              });
              navigate(`/?category=${name}`);
            }}>
            {displayText}
          </CategoryLink>
        ))}
      </CategoryLinks>
      <SearchBox $isAutoComplete={isAutoComplete}>
        <SearchInput
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              navigate(`/?keyword=${inputValue}`);
            }
          }}
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
        />
        {isAutoComplete && <Divider />}
        {isAutoComplete &&
          autoSearch &&
          autoSearch.map((advice) => (
            <Advice
              key={advice.id}
              onClick={() => {
                setIsAutoComplete(false);
                navigate(`/products/${advice.id}`);
              }}>
              {advice.title}
            </Advice>
          ))}
      </SearchBox>
      <PageLinks>
        <PageLink to='/checkout'>
          <PageLinkCartIcon icon={cart}>
            <PageLinkIconNumber>{cartCount}</PageLinkIconNumber>
          </PageLinkCartIcon>
          <PageLinkText>購物車</PageLinkText>
        </PageLink>
        <PageLink onClick={handleProfileMenuShow}>
          <PageLinkProfileIcon icon={profile} url={user?.picture} />
          <PageLinkText>會員</PageLinkText>
        </PageLink>
        {isProfileMenuShow && (
          <CollapsibleMenu>
            <CollapsibleMenuLink to='/collection'>我的收藏</CollapsibleMenuLink>
            <CollapsibleMenuLink to='/coupon'>我的優惠券</CollapsibleMenuLink>
            <CollapsibleMenuLink to='/profile'>
              {JSON.stringify(user) === '{}' ? '會員登入' : '會員資料'}
            </CollapsibleMenuLink>
          </CollapsibleMenu>
        )}
      </PageLinks>
      <CouponBtn />
    </Wrapper>
  );
}

export default Header;
