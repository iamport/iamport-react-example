
# 리액트에서 아임포트 휴대폰 본인인증 연동하기

리액트 환경에서 아임포트 휴대폰 본인인증 연동을 위한 안내입니다.

## 1. 가맹점 식별하기

`IMP` 객체의 `init` 함수 첫번째 인자에 `가맹점 식별코드`를 추가합니다.

```javascript
const { IMP } = window;
IMP.init('imp00000000'); // 'imp00000000' 대신 발급받은 가맹점 식별코드를 사용합니다.
```

가맹점 식별코드는 <a href="https://admin.iamport.kr" target="_blank">아임포트 관리자 페이지</a> 로그인 후, 시스템 설정 > 내정보에서 확인하실 수 있습니다.

## 2. 본인인증 데이터 정의하기

본인인증에 필요한 데이터를 아래와 같이 정의합니다. 이때 정의한 데이터는 `IMP.certification` 함수 호출시, 첫번째 인자로 전달됩니다. 본인인증 데이터에 대한 보다 자세한 내용은 <a href="https://docs.iamport.kr/tech/mobile-authentication#call-authentication" target="_blank">아임포트 공식 문서</a>를 참고하세요.

```javascript
const data = {
  merchant_uid: `mid_${new Date().getTime()}`  // 주문번호
  company: '아임포트',                           // 회사명 또는 URL
  carrier: 'SKT',                              // 통신사
  name: '홍길동',                                // 이름
  phone: '01012341234',                        // 전화번호
  ...
};
```

## 3. 콜백 함수 정의하기

본인인증 후 실행될 로직을 콜백 함수로 정의합니다. 이때 정의한 함수는 `IMP.certification` 함수 호출시, 두번째 인자로 전달됩니다. 콜백 함수의 첫번째 인자로 본인인증 결과가 객체의 형태로 전달됩니다.

```javascript
function callback(response) {
  const {
    success,
    merchant_uid,
    error_msg,
    ...
  } = response;

  if (success) {
    alert('본인인증 성공');
  } else {
    alert(`본인인증 실패: ${error_msg}`);
  }
}
```

## 4. 본인인증 창 호출하기

본인인증 하기 버튼을 눌렀을때 `IMP` 객체의 `certification` 함수를 호출해 본인인증 창을 호출합니다. `certification` 함수의 첫번째 인자로는 2에서 정의한 `본인인증 데이터`를, 두번째 인자로는 3에서 정의한 `콜백 함수`를 전달합니다.

```javascript
  import React from 'react';

  function Certification() {
    function onClickCertification() {
      /* 1. 가맹점 식별하기 */
      const { IMP } = window;
      IMP.init('imp00000000');

      /* 2. 본인인증 데이터 정의하기 */
      const data = {
        merchant_uid: `mid_${new Date().getTime()}`  // 주문번호
        company: '아임포트',                           // 회사명 또는 URL
        carrier: 'SKT',                              // 통신사
        name: '홍길동',                                // 이름
        phone: '01012341234',                        // 전화번호
        ...
      };

      /* 4. 본인인증 창 호출하기 */
      IMP.certification(data, callback);
    }

    /* 3. 콜백 함수 정의하기 */
    function callback(response) {
      const {
        success,
        merchant_uid,
        error_msg,
        ...
      } = response;

      if (success) {
        alert('본인인증 성공');
      } else {
        alert(`본인인증 실패: ${error_msg}`);
      }
    }

    return (
      ...
      <button onClick={onClickCertification}>본인인증 하기</button>
      ...
    );
  }
```

## 5. 리액트 네이티브 환경에 대응하기

리액트 네이티브에서 해당 본인인증 화면을 웹뷰로 띄워 재사용하는 경우가 있습니다. 이 경우 본인인증 하기 버튼을 눌렀을때 본인인증 환경이 리액트 네이티브인지 판단해, `IMP.certification` 함수 호출이 아닌, **리액트 네이티브로 post message를 보내야** 합니다. 리액트 네이티브에 아임포트 리액트 네이티브 모듈을 설치한 후, 리액트로부터 post message를 받으면 해당 본인인증 화면을 렌더링 하는 로직을 추가해야 합니다.

### 5-1. 리액트 네이티브로 post message 보내기

본인인증 하기 버튼을 눌렀을 때 본인인증 환경을 판단하는 로직을 추가합니다. 본인인증 환경이 리액트 네이티브인 경우, **리액트 네이티브로 `가맹점 식별코드`, `본인인증 데이터` 그리고 `액션 유형`을 post message로 보냅니다.**

```javascript
import React from 'react';

function Certification() {
  function onClickCertification() {
    const userCode = 'imp00000000';

    /* 2. 본인인증 데이터 정의하기 */
    const data = {
      merchant_uid: `mid_${new Date().getTime()}`  // 주문번호
      company: '아임포트',                           // 회사명 또는 URL
      carrier: 'SKT',                              // 통신사
      name: '홍길동',                                // 이름
      phone: '01012341234',                        // 전화번호
      ...
    };

    if (isReactNative()) {
      /* 5. 리액트 네이티브 환경에 대응하기 */
      const params = {
        userCode,                                   // 가맹점 식별코드
        data,                                       // 본인인증 데이터
        type: 'certification',                      // 결제와 본인인증 구분을 위한 필드
      };
      const paramsToString = JSON.stringify(params);
      window.ReactNativeWebView.postMessage(paramsToString);
    } else {
      /* 1. 가맹점 식별하기 */
      const { IMP } = window;
      IMP.init(userCode);
      /* 4. 본인인증 창 호출하기 */
      IMP.certification(data, callback);
    }
  }

  /* 3. 콜백 함수 정의하기 */
  function callback(response) {
    const {
      success,
      merchant_uid,
      error_msg,
      ...
    } = response;

    if (success) {
      alert('본인인증 성공');
    } else {
      alert(`본인인증 실패: ${error_msg}`);
    }
  }

  function isReactNative() {
    /*
      리액트 네이티브 환경인지 여부를 판단해
      리액트 네이티브의 경우 IMP.certification()를 호출하는 대신
      iamport-react-native 모듈로 post message를 보낸다

      아래 예시는 모든 모바일 환경을 리액트 네이티브로 인식한 것으로
      실제로는 user agent에 값을 추가해 정확히 판단해야 한다
    */
    if (ua.mobile) return true;
    return false;
  }

  return (
    ...
    <button onClick={onClickCertification}>본인인증 하기</button>
    ...
  );
}
```

### 5-2. 리액트 네이티브에 아임포트 모듈 설치 및 설정하기

- <a href="https://github.com/iamport/iamport-react-native/blob/master/INSTALL.md" target="_blank">아임포트 리액트 네이티브 모듈 설치하기</a>
- <a href="https://github.com/iamport/iamport-react-native/blob/master/SETTING.md" target="_blank">아임포트 리액트 네이티브 모듈 설정하기</a>

### 5-3. 리액트 네이티브에서 post message를 받았을때 본인인증 화면 렌더링하기

리액트에서 post message를 보내면, WebView의 `onMessage` 함수가 이를 트리거합니다. 메시지 내용 중 액션 유형(`type`)이 `payment`면 본인인증 화면을, `certification`이면 본인인증 화면을 렌더링 하기 위해 해당 라우트로 이동합니다. 이때 **post message로 전달 받은 `가맹점 식별코드`와 `본인인증 데이터`를 `query`로 전달**합니다.

```javascript
import React, { useState, useEffect } from 'react';
import WebView from 'react-native-webview';
import queryString from 'query-string';

function Home({ navigation }) {
  function onMessage(e) {
    /* 리액트로부터 post message를 받았을때 트리거 된다 */
    try {
      /* post message에서 가맹점 식별코드, 본인인증 데이터 그리고 액션 유형을 추출한다 */
      const { userCode, data, type } = JSON.parse(e.nativeEvent.data);
      const params = { userCode, data };
      /* 본인인증 화면으로 이동한다 */
      navigation.push(type === 'payment' ? 'Payment' : 'Certification', params);
    } catch (e) {}
  }

  return (
    <WebView
      source={{ uri: '가맹점 도메인' }} 
      onMessage={onMessage}
      style={{ flex: 1 }}
      injectedJavascript={`(function() {
        window.postMessage = function(data) {
          window.ReactNativeWebView.postMessage(data);
        };
      })()`}
    />
  );
}

export default Home;
```

### 5-4. 리액트 네이티브에 본인인증 화면 추가하기

`가맹점 식별코드`와 `본인인증 데이터`를 쿼리에서 추출해 `IMP.Payment`에 prop 형태로 전달합니다. 이때 본인인증 후 실행될 로직을 작성한 콜백 함수도 함께 전달합니다. 콜백함수에서 본인인증 결과에 따라 로직을 다르게 작성할 수 있습니다. 아래는 본인인증 성공시 웹뷰를 띄운 Home으로 돌아가고, 본인인증 실패시 바로 이전 화면으로 돌아가는 예시입니다.

```javascript
import React from 'react';
import IMP from 'iamport-react-native';

import Loading from './Loading';

function Certification({ navigation }) {
  /* 가맹점 식별코드, 본인인증 데이터 추출 */
  const userCode = navigation.getParam('userCode');
  const data = navigation.getParam('data');
  
  /* 본인인증 후 실행될 콜백 함수 입력 */
  function callback(response) {
    const isSuccessed = getIsSuccessed(response);
    if (isSuccessed) {
      /* 본인인증 성공한 경우, 리디렉션 위해 홈으로 이동한다 */
      const params = {
        ...response,
        type: 'certification', // 결제와 본인인증 구분을 위한 필드
      };
      navigation.replace('Home', params);
    } else {
      /* 본인인증 실패한 경우, 이전 화면으로 돌아간다 */
      navigation.goBack();
    }
  }

  function getIsSuccessed(response) {
    const { success } = response;

    if (typeof success === 'string') return success === 'true';
    if (typeof success === 'boolean') return success === true;
  }

  return (
    <IMP.Certification
      userCode={userCode}
      loading={<Loading />}
      data={{
        ...data,
        app_scheme: 'test',
      }}
      callback={callback}
    />
  );
}

export default Certification;
```

### 5-5. 본인인증 후 리디렉션 설정하기

위의 예시에 따라 본인인증 후, 웹뷰를 띄운 Home으로 돌아갔을때 리디렉션을 위한 추가 로직을 작성해야 합니다. 아래와 같은 경우를 가정합니다.

| 유형        | 도메인                                       |
| ---------- | ------------------------------------------ |
| 홈          | https://example.com                       |
| 본인인증      | https://example.com/certification         |
| 본인인증 완료  | https://example.com/certification/result  |

위와 같은 경우, 본인인증 후 홈으로 렌더링 시 웹뷰의 도메인은 다시 `https://example.com`이 됩니다. 이를 `https://example.com/certification/result`로 리디렉션 하기 위해 홈 컴포넌트에 아래와 같은 로직을 작성합니다.

```javascript
import React, { useState, useEffect } from 'react';
import WebView from 'react-native-webview';
import queryString from 'query-string';

const domain = 'https://example.com'; // 가맹점 도메인
function Home({ navigation }) {
  const [uri, setUri] = useState(domain);

  useEffect(() => {
    /* navigation이 바뀌었을때를 트리거 */
    const response = navigation.getParam('response');
    if (response) {
      const query = queryString.stringify(response);
      const { type } = query;
      if (type === 'certification') {
        /* 본인인증 후 렌더링 되었을 경우, https://example.com/certification/result로 리디렉션 시킨다 */
        setUri(`${domain}/certification/result?${query}`);    
      }
      ...
    }
  }, [navigation]);

  function onMessage(e) {
    try {
      const { userCode, data, type } = JSON.parse(e.nativeEvent.data);
      const params = { userCode, data };
      navigation.push(type === 'payment' ? 'Payment' : 'Certification', params);
    } catch (e) {}
  }

  return (
    <WebView
      source={{ uri }} 
      onMessage={onMessage}
      style={{ flex: 1 }}
      injectedJavascript={`(function() {
        window.postMessage = function(data) {
          window.ReactNativeWebView.postMessage(data);
        };
      })()`}
    />
  );
}

export default Home;
```