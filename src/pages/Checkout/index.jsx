import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../components/Button';
import { AuthContext } from '../../context/authContext';
import { CartContext } from '../../context/cartContext';
import ec2Api from '../../utils/ec2Api';
import tappay from '../../utils/tappay';
import Cart from './Cart';
import discountImage from './discount.webp';
import freeFreightImage from './free-freight-fee.webp';
import toast, { ToastBar, Toaster } from 'react-hot-toast';

const Wrapper = styled.div`
  margin: 0 auto;
  padding: 47px 0 263px;
  max-width: 1160px;
  line-height: 19px;
  font-size: 16px;
  color: #3f3a3a;

  @media screen and (max-width: 1279px) {
    padding: 20px 24px 236px;
  }
`;

const GrayBlock = styled.div`
  padding: 22px 30px;
  margin-top: 26px;
  background-color: #e8e8e8;
  display: flex;
  align-items: center;
  line-height: 19px;
  font-size: 16px;

  @media screen and (max-width: 1279px) {
    padding: 10px 10px 20px;
    flex-direction: column;
    align-items: flex-start;
    font-size: 14px;
    line-height: 17px;
  }
`;

const Label = styled.label`
  color: #3f3a3a;
  margin-left: 30px;

  @media screen and (max-width: 1279px) {
    margin-left: 0;
  }
`;

const Select = styled.select`
  width: 171px;
  height: 30px;
  margin-left: 20px;
  padding-left: 17px;
  border-radius: 8px;
  border: solid 1px #979797;
  background-color: #f3f3f3;

  & + ${Label} {
    margin-left: 82px;

    @media screen and (max-width: 1279px) {
      margin-left: 0;
      margin-top: 20px;
    }
  }

  @media screen and (max-width: 1279px) {
    margin-left: 0;
    margin-top: 10px;
    width: 100%;
  }
`;

const Note = styled.div`
  line-height: 26px;
  margin-top: 20px;
  font-size: 16px;
  color: #3f3a3a;
`;

const FormFieldSet = styled.fieldset`
  margin-top: 50px;

  @media screen and (max-width: 1279px) {
    margin-top: 20px;
  }
`;

const FormLegend = styled.legend`
  line-height: 19px;
  font-size: 16px;
  font-weight: bold;
  color: #3f3a3a;
  padding-bottom: 16px;
  border-bottom: 1px solid #3f3a3a;
  width: 100%;
`;

const FormGroup = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 30px;
  width: 684px;

  ${FormLegend} + & {
    margin-top: 25px;
  }

  @media screen and (max-width: 1279px) {
    line-height: 17px;
    font-size: 14px;
    margin-top: 20px;
    width: 100%;

    ${FormLegend} + & {
      margin-top: 20px;
    }
  }
`;

const FormLabel = styled.label`
  width: 110px;
  line-height: 19px;
  font-size: 16px;
  color: #3f3a3a;
  display: block;

  @media screen and (max-width: 1279px) {
    width: 100%;
  }
`;

const FormControl = styled.input`
  width: 574px;
  height: 30px;
  border-radius: 8px;
  border: solid 1px ${({ invalid }) => (invalid ? '#CB4042' : '#979797')};

  @media screen and (max-width: 1279px) {
    margin-top: 10px;
    width: 100%;
  }
`;

const FormText = styled.div`
  line-height: 19px;
  font-size: 16px;
  color: #8b572a;
  margin-top: 10px;
  width: 100%;
  text-align: right;
`;

const FormCheck = styled.div`
  margin-left: 8px;
  display: flex;
  align-items: center;

  & + & {
    margin-left: 30px;
  }

  @media screen and (max-width: 1279px) {
    margin-left: 0;
    margin-top: 10px;

    & + & {
      margin-left: 27px;
    }
  }
`;

const FormCheckInput = styled.input`
  margin: 0;
  width: 16px;
  height: 16px;
`;

const FormCheckLabel = styled.label`
  margin-left: 10px;
  line-height: 26px;

  @media screen and (max-width: 1279px) {
    font-size: 14px;
  }
`;

const Price = styled.div`
  display: flex;
  align-items: center;
  width: 240px;
  margin-left: auto;

  @media screen and (max-width: 1279px) {
    width: 200px;
  }
`;

const SubtotalPrice = styled(Price)`
  margin-top: 40px;

  @media screen and (max-width: 1279px) {
    margin-top: 24px;
  }
`;

const ShippingPrice = styled(Price)`
  margin-top: 20px;

  @media screen and (max-width: 1279px) {
    margin-top: 20px;
  }
`;

const CouponDiscount = styled(Price)`
  margin-top: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #3f3a3a;

  @media screen and (max-width: 1279px) {
    margin-top: 20px;
    padding-bottom: 24px;
    border-bottom: 1px solid #3f3a3a;
  }
`;

const TotalPrice = styled(Price)`
  margin-top: 20px;

  @media screen and (max-width: 1279px) {
    margin-top: 16px;
  }
`;

const PriceName = styled.div`
  line-height: 19px;
  font-size: 16px;
  color: #3f3a3a;

  @media screen and (max-width: 1279px) {
    line-height: 17px;
    font-size: 14px;
  }
`;

const Currency = styled.div`
  margin-left: auto;
  line-height: 19px;
  font-size: 16px;
  color: #3f3a3a;
`;

const PriceValue = styled.div`
  line-height: 36px;
  margin-left: 10px;
  font-size: 30px;
  color: #3f3a3a;
`;

const CouponWrap = styled.div``;
const CouponWrapTitle = styled.p`
  line-height: 19px;
  font-size: 16px;
  font-weight: bold;
  color: #3f3a3a;
  padding-bottom: 16px;
  border-bottom: 1px solid #3f3a3a;
  width: 100%;
  margin-top: 50px;
`;
const CouponButton = styled.p`
  margin-top: 25px;
  border: none;
  background-color: transparent;
  color: #919191;
  cursor: pointer;
`;

const SelectWindowBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
  width: 100%;
  padding: 10rem 8rem;
`;
const SelectWindow = styled.div`
  position: relative;
  background-color: white;
  width: 100%;
  height: 100%;
  z-index: 200;
  padding: 2.5rem;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 1279px) {
    min-height: 600px;
  }
`;
const SelectWindowTitle = styled.div`
  font-size: 30px;
`;
const ButtonWrap = styled.div`
  bottom: 2rem;
  margin-top: 1.5rem;
  border-radius: 10px;
  margin-left: auto;
  display: flex;
  flex-wrap: nowrap;
  @media screen and (max-width: 1279px) {
    max-width: 100%;
  }
`;

const Cancel = styled.button`
  height: 40px;
  width: 150px;
  background-color: white;
  border: 1px #bababa solid;
  color: #bababa;
  margin-right: 0.5rem;
  @media screen and (max-width: 1279px) {
    margin-right: 0;
    max-width: 100%;
  }
`;
const Confirm = styled.button`
  height: 40px;
  width: 150px;
  background-color: #313538;
  color: white;
  border: none;
  @media screen and (max-width: 1279px) {
    max-width: 100%;
  }
`;

const SelectWindowCouponWrap = styled.div`
  height: 100%;
  margin-top: 2rem;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const Coupon = styled.div`
  background-color: #f0f0f0;
  height: 10rem;
  display: flex;
`;

const CouponImage = styled.img`
  height: 100%;
  margin-right: 1rem;
`;
const CouponInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 1rem 0;
`;
const CouponTitle = styled.p`
  font-size: 20px;
`;
const CouponDate = styled.p`
  color: #bababa;
`;

const SelectCouponButton = styled.button`
  margin: auto 1.5rem auto auto;
  width: 20px;
  height: 20px;
  border-radius: 100%;
  border: 1px #bababa solid;
  cursor: pointer;

  background-color: ${(props) => (props.isActive ? '#dc5f45' : '#f0f0f0')};
`;

const SelectedCouponWrap = styled.div`
  display: flex;
  margin-top: 25px;
`;

const ChangeSelectedCouponButton = styled.p`
  border: none;
  background-color: transparent;
  color: #919191;
  margin-left: 2rem;
  cursor: pointer;
`;
const EmptyMessage = styled.p`
  margin: auto;
  font-size: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #bababa;
  letter-spacing: 1.5px;
`;
const EmptyLink = styled(Link)`
  color: #6da6e0;
  text-decoration: none;
`;
const formInputs = [
  {
    label: '收件人姓名',
    key: 'name',
    text: '務必填寫完整收件人姓名，避免包裹無法順利簽收',
  },
  { label: 'Email', key: 'email' },
  { label: '手機', key: 'phone' },
  { label: '地址', key: 'address' },
];

const timeOptions = [
  {
    label: '08:00-12:00',
    value: 'morning',
  },
  {
    label: '14:00-18:00',
    value: 'afternoon',
  },
  {
    label: '不指定',
    value: 'anytime',
  },
];

function Checkout() {
  const [recipient, setRecipient] = useState({
    name: '王小明',
    email: 'xiaominwang@gmail.com',
    phone: '0987654321',
    address: '新北市永和區環河西路',
    time: 'anytime',
  });
  const [invalidFields, setInvalidFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSelectingCoupon, setIsSelectingCoupon] = useState(false);
  const [validCoupon, setValidCoupon] = useState([]);
  const [redButtonIndex, setRedButtonIndex] = useState(0);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const navigate = useNavigate();
  const cardNumberRef = useRef();
  const cardExpirationDateRef = useRef();
  const cardCCVRef = useRef();
  const formRef = useRef();

  const { jwtToken, isLogin, login } = useContext(AuthContext);
  const { cartItems, setCartItems } = useContext(CartContext);

  useEffect(() => {
    const setupTappay = async () => {
      await tappay.setupSDK();
      tappay.setupCard(cardNumberRef.current, cardExpirationDateRef.current, cardCCVRef.current);
    };
    setupTappay();
  }, []);

  const subtotal = cartItems.reduce((prev, item) => prev + item.price * item.qty, 0);

  const freight = 30;

  const couponDiscount = () => {
    return selectedCoupon && selectedCoupon.type === '免運'
      ? -freight
      : Math.floor(-((subtotal * selectedCoupon.discount) / 100));
  };

  async function checkout() {
    try {
      setLoading(true);

      const token = isLogin ? jwtToken : await login();

      if (!token) {
        window.alert('請登入會員');
        return;
      }

      if (cartItems.length === 0) {
        window.alert('尚未選購商品');
        return;
      }

      if (Object.values(recipient).some((value) => !value)) {
        window.alert('請填寫完整訂購資料');
        setInvalidFields(Object.keys(recipient).filter((key) => !recipient[key]));
        formRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        return;
      }

      if (!tappay.canGetPrime()) {
        window.alert('付款資料輸入有誤');
        return;
      }

      const result = await tappay.getPrime();
      if (result.status !== 0) {
        window.alert('付款資料輸入有誤');
        return;
      }
      const finalFreight = selectedCoupon && selectedCoupon.type === '免運' ? 0 : freight;
      const finalSubtotal =
        selectedCoupon && selectedCoupon.type === '折扣'
          ? Math.floor(subtotal - (subtotal * selectedCoupon.discount) / 100)
          : subtotal;

      const newCartItems = cartItems.map((item) => {
        const { image, stock, ...newItem } = item;
        return newItem;
      });
      const res = await ec2Api.checkout(
        {
          prime: result.card.prime,
          couponId: selectedCoupon && selectedCoupon.id,
          order: {
            shipping: 'delivery',
            payment: 'credit_card',
            subtotal: finalSubtotal,
            freight: finalFreight,
            total: finalSubtotal + finalFreight,
            recipient,
            list: newCartItems,
          },
        },
        jwtToken,
      );
      if (res.errors) {
        getValidCoupon();
        console.log(res.errors);
        toast.error('訂單送出失敗，請重新確認訂單');
      } else if (res.data) {
        window.alert('付款成功');
        navigate('/thankyou', { state: { orderNumber: res.data.number } });
        setCartItems([]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  const getValidCoupon = async function () {
    const { data } = await ec2Api.getUserValidCoupons(jwtToken);
    if (data) {
      setValidCoupon(data);
      console.log(data);
    }
  };

  useEffect(() => {
    getValidCoupon();
  }, []);

  return (
    <Wrapper>
      <Toaster />
      <Cart />
      <GrayBlock>
        <Label>配送國家</Label>
        <Select>
          <option>臺灣及離島</option>
        </Select>
        <Label>付款方式</Label>
        <Select>
          <option>信用卡付款</option>
        </Select>
      </GrayBlock>
      <Note>
        ※ 提醒您：
        <br />● 選擇宅配-請填寫正確收件人資訊，避免包裹配送不達
        <br />● 選擇超商-請填寫正確收件人姓名(與證件相符)，避免無法領取
      </Note>
      <form ref={formRef}>
        <FormFieldSet>
          <FormLegend>訂購資料</FormLegend>
          {formInputs.map((input) => (
            <FormGroup key={input.key}>
              <FormLabel>{input.label}</FormLabel>
              <FormControl
                value={recipient[input.key]}
                onChange={(e) => setRecipient({ ...recipient, [input.key]: e.target.value })}
                invalid={invalidFields.includes(input.key)}
              />
              {input.text && <FormText>{input.text}</FormText>}
            </FormGroup>
          ))}
          <FormGroup>
            <FormLabel>配送時間</FormLabel>
            {timeOptions.map((option) => (
              <FormCheck key={option.value}>
                <FormCheckInput
                  type='radio'
                  checked={recipient.time === option.value}
                  onChange={(e) => {
                    if (e.target.checked) setRecipient({ ...recipient, time: option.value });
                  }}
                />
                <FormCheckLabel>{option.label}</FormCheckLabel>
              </FormCheck>
            ))}
          </FormGroup>
        </FormFieldSet>
        <FormFieldSet>
          <FormLegend>付款資料</FormLegend>
          <FormGroup>
            <FormLabel>信用卡號碼</FormLabel>
            <FormControl as='div' ref={cardNumberRef} />
          </FormGroup>
          <FormGroup>
            <FormLabel>有效期限</FormLabel>
            <FormControl as='div' ref={cardExpirationDateRef} />
          </FormGroup>
          <FormGroup>
            <FormLabel>安全碼</FormLabel>
            <FormControl as='div' ref={cardCCVRef} />
          </FormGroup>
        </FormFieldSet>
      </form>

      <CouponWrap>
        <CouponWrapTitle>優惠券</CouponWrapTitle>
        {!selectedCoupon ? (
          <CouponButton
            onClick={() => {
              setIsSelectingCoupon(!isSelectingCoupon);
            }}>
            選擇優惠券
          </CouponButton>
        ) : (
          <SelectedCouponWrap>
            <span style={{ color: 'black', marginRight: '1rem' }}>已選取</span>
            <span style={{ color: '#8b572a' }}>
              {selectedCoupon.title} {selectedCoupon.type}券 （{selectedCoupon.discount}
              {selectedCoupon.type === '折扣' ? '% off' : ''} ）
            </span>

            <ChangeSelectedCouponButton
              onClick={() => {
                setIsSelectingCoupon(!isSelectingCoupon);
              }}>
              變更
            </ChangeSelectedCouponButton>
          </SelectedCouponWrap>
        )}
      </CouponWrap>
      {isSelectingCoupon && (
        <SelectWindowBackground>
          <SelectWindow>
            <SelectWindowTitle>選擇優惠券</SelectWindowTitle>
            <SelectWindowCouponWrap>
              {validCoupon && validCoupon.length > 0 ? (
                validCoupon.map((coupon, index) => {
                  return (
                    <Coupon key={coupon.id}>
                      <CouponImage src={coupon.type === '免運' ? freeFreightImage : discountImage}></CouponImage>
                      <CouponInfo>
                        <CouponTitle>{coupon.title}</CouponTitle>
                        <CouponDate>有效日期 {coupon.expiredDate}</CouponDate>
                      </CouponInfo>
                      <SelectCouponButton
                        isActive={index === redButtonIndex}
                        onClick={() => {
                          setRedButtonIndex(index);
                        }}></SelectCouponButton>
                    </Coupon>
                  );
                })
              ) : (
                <EmptyMessage>
                  <span>目前沒有優惠券哦</span>
                  <br />
                  <span
                    style={{
                      fontSize: '16px',
                      marginTop: '10px',
                    }}>
                    前往
                    <EmptyLink to={`/coupon`}>優惠券專區</EmptyLink>
                    領取
                  </span>
                </EmptyMessage>
              )}
            </SelectWindowCouponWrap>

            <ButtonWrap>
              <Cancel
                onClick={() => {
                  setIsSelectingCoupon(!isSelectingCoupon);
                }}>
                取消
              </Cancel>
              <Confirm
                onClick={() => {
                  setSelectedCoupon(validCoupon[redButtonIndex]);
                  setIsSelectingCoupon(!isSelectingCoupon);
                }}>
                好
              </Confirm>
            </ButtonWrap>
          </SelectWindow>
        </SelectWindowBackground>
      )}

      <SubtotalPrice>
        <PriceName>總金額</PriceName>
        <Currency>NT.</Currency>
        <PriceValue>{subtotal}</PriceValue>
      </SubtotalPrice>
      <ShippingPrice>
        <PriceName>運費</PriceName>
        <Currency>NT.</Currency>
        <PriceValue>{freight}</PriceValue>
      </ShippingPrice>

      {selectedCoupon ? (
        <CouponDiscount>
          <PriceName>{selectedCoupon.type}</PriceName>
          <Currency>NT.</Currency>
          <PriceValue>{couponDiscount()}</PriceValue>
        </CouponDiscount>
      ) : (
        <></>
      )}

      <TotalPrice>
        <PriceName>應付金額</PriceName>
        <Currency>NT.</Currency>
        <PriceValue>{subtotal + freight + (selectedCoupon && couponDiscount())}</PriceValue>
      </TotalPrice>
      <Button loading={loading} onClick={checkout}>
        確認付款
      </Button>
    </Wrapper>
  );
}

export default Checkout;
