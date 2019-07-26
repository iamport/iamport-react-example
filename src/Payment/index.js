import React, { useState } from 'react';
import styled from 'styled-components';
import { Form, Select, Icon, Input, Switch, Button } from 'antd';
import { withRouter } from 'react-router-dom';
import { withUserAgent } from 'react-useragent';
import queryString from 'query-string';

import {
  PGS,
  METHODS_FOR_INICIS,
  QUOTAS_FOR_INICIS_AND_KCP,
} from './constants';
import { getMethods, getQuotas } from './utils';

const { Item } = Form;
const { Option } = Select;

function Payment({ history, form, ua }) {
  const [methods, setMethods] = useState(METHODS_FOR_INICIS);
  const [quotas, setQuotas] = useState(QUOTAS_FOR_INICIS_AND_KCP);
  const [isQuotaRequired, setIsQuotaRequired] = useState(true);
  const [isDigitalRequired, setIsDigitalRequired] = useState(false);
  const [isVbankDueRequired, setIsVbankDueRequired] = useState(false);
  const [isBizNumRequired, setisBizNumRequired] = useState(false);
  const { getFieldDecorator, validateFieldsAndScroll, setFieldsValue, getFieldsValue } = form;

  function handleSubmit(e) {
    e.preventDefault();
    
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        /* 가맹점 식별코드 */
        const userCode = 'imp19424728';
        /* 결제 데이터 */
        const {
          pg,
          pay_method,
          merchant_uid,
          name,
          amount,
          buyer_name,
          buyer_tel,
          buyer_email,
          escrow,
          card_quota,
          biz_num,
          vbank_due,
          digital,
        } = values;

        const data = {
          pg,
          pay_method,
          merchant_uid,
          name,
          amount,
          buyer_name,
          buyer_tel,
          buyer_email,
          escrow,
        };

        if (pay_method === 'vbank') {
          data.vbank_due = vbank_due;
          if (pg === 'danal_tpay') {
            data.biz_num = biz_num;
          }
        }
        if (pay_method === 'card') {
          if (card_quota !== 0) {
            data.digital = { card_quota: card_quota === 1 ? [] : card_quota };
          }
        }
        if (pay_method === 'phone') {
          data.digital = digital;
        }

        if (isReactNative()) {
          /* 리액트 네이티브 환경일때 */
          const params = {
            userCode,
            data,
            type: 'payment', // 결제와 본인인증을 구분하기 위한 필드
          };
          const paramsToString = JSON.stringify(params);
          window.ReactNativeWebView.postMessage(paramsToString);
        } else {
          /* 웹 환경일때 */
          const { IMP } = window;
          IMP.init(userCode);
          IMP.request_pay(data, callback);
        }
      }
    });
  }

  function callback(response) {
    const query = queryString.stringify(response);
    history.push(`/payment/result?${query}`);
  }

  function onChangePg(value) {
    /* 결제수단 */
    const methods = getMethods(value);
    setMethods(methods);
    setFieldsValue({ pay_method: methods[0].value })

    /* 할부개월수 설정 */
    const { pay_method } = getFieldsValue();
    handleQuotas(value, pay_method);

    /* 사업자번호/입금기한 설정 */
    let isBizNumRequired = false;
    let isVbankDueRequired = false;
    if (pay_method === 'vbank') {
      if (value === 'danal_tpay') {
        isBizNumRequired = true;
      }
      isVbankDueRequired = true;
    }
    setisBizNumRequired(isBizNumRequired);
    setIsVbankDueRequired(isVbankDueRequired);
  }

  function onChangePayMethod(value) {
    const { pg } = getFieldsValue();
    let isQuotaRequired = false;
    let isDigitalRequired = false;
    let isVbankDueRequired = false;
    let isBizNumRequired = false;
    switch (value) {
      case 'card': {
        isQuotaRequired = true;
        break;
      }
      case 'phone': {
        isDigitalRequired = true;
        break;
      }
      case 'vbank': {
        if (pg === 'danal_tpay') {
          isBizNumRequired = true;
        }
        isVbankDueRequired = true;
        break;
      }
      default:
        break;
    }
    setIsQuotaRequired(isQuotaRequired);
    setIsDigitalRequired(isDigitalRequired);
    setIsVbankDueRequired(isVbankDueRequired);
    setisBizNumRequired(isBizNumRequired);

    /* 할부개월수 설정 */
    handleQuotas(pg, value);
  }

  function handleQuotas(pg, pay_method) {
    const { isQuotaRequired, quotas } = getQuotas(pg, pay_method);
    setIsQuotaRequired(isQuotaRequired);
    setQuotas(quotas);
    setFieldsValue({ card_quota: quotas[0].value })
  }

  function isReactNative() {
    /*
      리액트 네이티브 환경인지 여부를 판단해
      리액트 네이티브의 경우 IMP.payment()를 호출하는 대신
      iamport-react-native 모듈로 post message를 보낸다

      아래 예시는 모든 모바일 환경을 리액트 네이티브로 인식한 것으로
      실제로는 user agent에 값을 추가해 정확히 판단해야 한다
    */
    if (ua.mobile) return true;
    return false;
  }

  return (
    <Wrapper>
      <Header>아임포트 결제 테스트</Header>
      <FormContainer onSubmit={handleSubmit}>
        <Item label="PG사">
          {getFieldDecorator('pg', {
            initialValue: 'html5_inicis',
          })(
            <Select
              size="large"
              onChange={onChangePg}
              suffixIcon={<Icon type="caret-down" />}
            >
              {PGS.map(pg => {
                const { value, label } = pg;
                return <Option value={value} key={value}>{label}</Option>;
              })}
            </Select>
          )}
        </Item>
        <Item label="결제수단">
          {getFieldDecorator('pay_method', {
            initialValue: 'card',
          })(
            <Select
              size="large"
              onChange={onChangePayMethod}
              suffixIcon={<Icon type="caret-down" />}
            >
              {methods.map(method => {
                const { value, label } = method;
                return <Option value={value} key={value}>{label}</Option>;
              })}
            </Select>
          )}
        </Item>
        {isQuotaRequired && (
          <Item label="할부개월수">
            {getFieldDecorator('card_quota', {
              initialValue: 0,
            })(
              <Select size="large" suffixIcon={<Icon type="caret-down" />}>
                {quotas.map(quota => {
                  const { value, label } = quota;
                  return <Option value={value} key={value}>{label}</Option>;
                })}
              </Select>
            )}
          </Item>
        )}
        {isVbankDueRequired && (<Item>
          {getFieldDecorator('vbank_due', {
            rules: [{ required: true, message: '입금기한은 필수입력입니다' }],
          })(
            <Input size="large" type="number" addonBefore="입금기한" placeholder="YYYYMMDDhhmm" />,
          )}
        </Item>)}
        {isBizNumRequired && (
          <Item>
            {getFieldDecorator('biz_num', {
              rules: [{ required: true, message: '사업자번호는 필수입력입니다' }],
            })(
              <Input size="large" type="number" addonBefore="사업자번호" />,
            )}
          </Item>
        )}
        {isDigitalRequired && (
          <Item label="실물여부" className="toggle-container">
            {getFieldDecorator('digital', {
              valuePropName: 'checked',
            })(<Switch />)}
          </Item>
        )}
        <Item label="에스크로" className="toggle-container">
          {getFieldDecorator('escrow', {
            valuePropName: 'checked',
          })(<Switch />)}
        </Item>
        <Item>
          {getFieldDecorator('name', {
            initialValue: '아임포트 결제 데이터 분석',
            rules: [{ required: true, message: '주문명은 필수입력입니다' }],
          })(
            <Input size="large" addonBefore="주문명" />,
          )}
        </Item>
        <Item>
          {getFieldDecorator('amount', {
            initialValue: '39000',
            rules: [{ required: true, message: '결제금액은 필수입력입니다' }],
          })(
            <Input size="large" type="number" addonBefore="결제금액" />,
          )}
        </Item>
        <Item>
          {getFieldDecorator('merchant_uid', {
            initialValue: `min_${new Date().getTime()}`,
            rules: [{ required: true, message: '주문번호는 필수입력입니다' }],
          })(
            <Input size="large" addonBefore="주문번호" />,
          )}
        </Item>
        <Item>
          {getFieldDecorator('buyer_name', {
            initialValue: '홍길동',
            rules: [{ required: true, message: '구매자 이름은 필수입력입니다' }],
          })(
            <Input size="large" addonBefore="이름" />,
          )}
        </Item>
        <Item>
          {getFieldDecorator('buyer_tel', {
            initialValue: '01012341234',
            rules: [{ required: true, message: '구매자 전화번호는 필수입력입니다' }],
          })(
            <Input size="large" type="number" addonBefore="전화번호" />,
          )}
        </Item>
        <Item>
          {getFieldDecorator('buyer_email', {
            initialValue: 'example@example.com',
            rules: [{ required: true, message: '구매자 이메일은 필수입력입니다' }],
          })(
            <Input size="large" addonBefore="이메일" />,
          )}
        </Item>
        <Button type="primary" htmlType="submit" size="large">
          결제하기
        </Button>
      </FormContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Header = styled.div`
  font-weight: bold;
  text-align: center;
  padding: 2rem;
  padding-top: 0;
  font-size: 3rem;
`;

const FormContainer = styled(Form)`
  width: 350px;
  border-radius: 3px;

  .ant-row {
    margin-bottom: 1rem;
  }
  .ant-form-item {
    display: flex;
    align-items: center;
  }
  .ant-col.ant-form-item-label {
    padding: 0 11px;
    width: 9rem;
    text-align: left;
    label {
      color: #888;
      font-size: 1.2rem;
    }
    & + .ant-col.ant-form-item-control-wrapper {
      width: 26rem;
      .ant-form-item-control {
        line-height: inherit;
      }
    }
  }
  .ant-col.ant-form-item-label > label::after {
    display: none;
  }
  .ant-row.ant-form-item.toggle-container .ant-form-item-control {
    padding: 0 11px;
    height: 4rem;
    display: flex;
    align-items: center;
    .ant-switch {
      margin: 0;
    }
  }

  .ant-form-explain {
    margin-top: 0.5rem;
    margin-left: 9rem;
  }

  .ant-input-group-addon:first-child {
    width: 9rem;
    text-align: left;
    color: #888;
    font-size: 1.2rem;
    border: none;
    background-color: inherit;
  }
  .ant-input-group > .ant-input:last-child {
    border-radius: 4px;
  }

  .ant-col {
    width: 100%;
  }

  button[type='submit'] {
    width: 100%;
    height: 5rem;
    font-size: 1.6rem;
    margin-top: 2rem;
  }
`;

const PaymentForm = Form.create({ name: 'payment' })(Payment);

export default withUserAgent(withRouter(PaymentForm));
