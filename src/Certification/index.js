import React from 'react';
import styled from 'styled-components';
import { Form, Input, Button } from 'antd';
import { withRouter } from 'react-router-dom';
import { withUserAgent } from 'react-useragent';
import queryString from 'query-string';

const { Item } = Form;

function Certification({ history, form, ua }) {
  const { getFieldDecorator, validateFieldsAndScroll } = form;

  function handleSubmit(e) {
    e.preventDefault();
    
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        /* 가맹점 식별코드 */
        const userCode = 'imp10391932';
        /* 결제 데이터 */
        const {
          merchant_uid,
          name,
          phone,
          min_age,
        } = values;

        const data = {
          merchant_uid,
        };

        if (name) {
          data.name = name;
        }
        if (phone) {
          data.phone = phone;
        }
        if (min_age) {
          data.min_age = min_age;
        }

        if (isReactNative()) {
          /* 리액트 네이티브 환경일때 */
          const params = {
            userCode,
            data,
            type: 'certification', // 결제와 본인인증을 구분하기 위한 필드
          };
          const paramsToString = JSON.stringify(params);
          window.ReactNativeWebView.postMessage(paramsToString);
        } else {
          /* 웹 환경일때 */
          const { IMP } = window;
          IMP.init(userCode);
          IMP.certification(data, callback);
        }
      }
    });
  }

  /* 본인인증 후 콜백함수 */
  function callback(response) {
    const query = queryString.stringify(response);
    history.push(`/certification/result?${query}`);
  }

  function isReactNative() {
    /*
      리액트 네이티브 환경인지 여부를 판단해
      리액트 네이티브의 경우 IMP.certification()을 호출하는 대신
      iamport-react-native 모듈로 post message를 보낸다

      아래 예시는 모든 모바일 환경을 리액트 네이티브로 인식한 것으로
      실제로는 user agent에 값을 추가해 정확히 판단해야 한다
    */
    if (ua.mobile) return true;
    return false;
  }

  return (
    <Wrapper>
      <Header>아임포트 본인인증 테스트</Header>
      <FormContainer onSubmit={handleSubmit}>
        <Item>
          {getFieldDecorator('merchant_uid', {
            initialValue: `min_${new Date().getTime()}`,
            rules: [{ required: true, message: '주문번호는 필수입력입니다' }],
          })(
            <Input size="large" addonBefore="주문번호" />,
          )}
        </Item>
        <Item>
          {getFieldDecorator('name')(
            <Input size="large" addonBefore="이름" />,
          )}
        </Item>
        <Item>
          {getFieldDecorator('phone')(
            <Input size="large" type="number" addonBefore="전화번호" />,
          )}
        </Item>
        <Item>
          {getFieldDecorator('min_age')(
            <Input
              size="large"
              type="number"
              addonBefore="최소연령"
              placeholder="허용 최소 만 나이"
            />,
          )}
        </Item>
        <Button type="primary" htmlType="submit" size="large">
          본인인증하기
        </Button>
      </FormContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 7rem 0;
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
  .ant-col.ant-form-item-label > label::after {
    display: none;
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

const CertificationForm = Form.create({ name: 'certification' })(Certification);

export default withUserAgent(withRouter(CertificationForm));
