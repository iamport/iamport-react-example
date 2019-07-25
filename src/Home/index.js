import React from 'react';
import styled from 'styled-components';
import { Button, Icon } from 'antd';
import { withRouter } from 'react-router-dom';

function Home({ history }) {
  return (
    <Wrapper>
      <div>
        <h2>아임포트 테스트</h2>
        <h4>아임포트 리액트 테스트 화면입니다.</h4>
        <h4>아래 버튼을 눌러 결제 또는 본인인증 테스트를 진행해주세요.</h4>
      </div>
      <div></div>
      <ButtonContainer>
        <Button onClick={() => history.push('/payment')}>
          <Icon type="credit-card" />
          결제 테스트
        </Button>
        <Button onClick={() => history.push('/certification')}>
          <Icon type="user" />
          본인인증 테스트
        </Button>
      </ButtonContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  > div {
    position: absolute;
    left: 0;
    right: 0;
  }
  > div:first-child {
    background-color: #344e81;
    top: 0;
    bottom: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    > * {
      color: #fff;
    }

    h4 {
      margin: 0;
      line-height: 1.5;
    }
  }
  > div:nth-child(2) {
    top: 50%;
    bottom: 0;
  }
`;

const ButtonContainer = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 50%;
  margin-top: -5rem;

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 10rem;
    width: 15rem;
    margin: 0 0.5rem;
    border: none;
    box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.13);
    .anticon {
      margin-bottom: 0.5rem;
      font-size: 2rem;
      & + span {
        margin: 0;
      }
    }
  }
`;

export default withRouter(Home);
