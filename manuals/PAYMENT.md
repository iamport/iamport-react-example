
# 리액트에서 아임포트 결제 연동하기

리액트 환경에서 아임포트 결제 연동을 위한 안내입니다.

## 1. 가맹점 식별하기

`IMP` 객체의 `init` 함수 첫번째 인자에 `가맹점 식별코드`를 추가합니다.

```javascript
const { IMP } = window;
IMP.init('imp00000000'); // 'imp00000000' 대신 발급받은 가맹점 식별코드를 사용합니다.
```

가맹점 식별코드는 <a href="https://admin.iamport.kr" target="_blank">아임포트 관리자 페이지</a> 로그인 후, 시스템 설정 > 내정보에서 확인하실 수 있습니다.

## 2. 결제 데이터 정의하기

결제에 필요한 데이터를 아래와 같이 정의합니다. 이때 정의한 데이터는 `IMP.request_pay` 함수 호출시, 첫번째 인자로 전달됩니다. 결제 데이터에 대한 보다 자세한 내용은 <a href="https://docs.iamport.kr/tech/imp#param" target="_blank">아임포트 공식 문서</a>를 참고하세요.

```javascript
const data = {
  pg: 'html5_inicis',                           // PG사
  pay_method: 'card',                           // 결제수단
  merchant_uid: `mid_${new Date().getTime()}`   // 주문번호
  amount: 1000,                                 // 결제금액
  name: '아임포트 결제 데이터 분석',                  // 주문명
  buyer_name: '홍길동',                           // 구매자 이름
  buyer_tel: '01012341234',                     // 구매자 전화번호
  buyer_email: 'example@example',               // 구매자 이메일
  buyer_addr: '신사동 661-16',                    // 구매자 주소
  buyer_postcode: '06018',                      // 구매자 우편번호
  ...
};
```

## 3. 콜백 함수 정의하기

결제 후 실행될 로직을 콜백 함수로 정의합니다. 이때 정의한 함수는 `IMP.request_pay` 함수 호출시, 두번째 인자로 전달됩니다. 콜백 함수의 첫번째 인자로 결제 결과가 객체의 형태로 전달됩니다. 결제 결과에 대한 보다 자세한 내용은 <a href="https://docs.iamport.kr/tech/imp#callback" target="_blank">아임포트 공식 문서</a>를 참고하세요.

```javascript
function callback(response) {
  const {
    success,
    merchant_uid,
    error_msg,
    ...
  } = response;

  if (success) {
    alert('결제 성공');
  } else {
    alert(`결제 실패: ${error_msg}`);
  }
}
```

## 4. 결제 창 호출하기

결제하기 버튼을 눌렀을때 `IMP` 객체의 `request_pay` 함수를 호출해 결제 창을 호출합니다. `request_pay` 함수의 첫번째 인자로는 2에서 정의한 `결제 데이터`를, 두번째 인자로는 3에서 정의한 `콜백 함수`를 전달합니다.

```javascript
import React from 'react';

function Payment() {
  function onClickPayment() {
    /* 1. 가맹점 식별하기 */
    const { IMP } = window;
    IMP.init('imp00000000');

    /* 2. 결제 데이터 정의하기 */
    const data = {
      pg: 'html5_inicis',                           // PG사
      pay_method: 'card',                           // 결제수단
      merchant_uid: `mid_${new Date().getTime()}`   // 주문번호
      amount: 1000,                                 // 결제금액
      name: '아임포트 결제 데이터 분석',                  // 주문명
      buyer_name: '홍길동',                           // 구매자 이름
      buyer_tel: '01012341234',                     // 구매자 전화번호
      buyer_email: 'example@example',               // 구매자 이메일
      buyer_addr: '신사동 661-16',                    // 구매자 주소
      buyer_postcode: '06018',                      // 구매자 우편번호
      ...
    };

    /* 4. 결제 창 호출하기 */
    IMP.request_pay(data, callback);
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
      alert('결제 성공');
    } else {
      alert(`결제 실패: ${error_msg}`);
    }
  }

  return (
    ...
    <button onClick={onClickPayment}>결제하기</button>
    ...
  );
}
```

## 5. 리액트 네이티브 환경에 대응하기

리액트 네이티브에서 해당 결제 화면을 웹뷰로 띄워 재사용하는 경우가 있습니다. 이 경우 결제하기 버튼을 눌렀을때 결제 환경이 리액트 네이티브인지 판단해, `IMP.request_pay` 함수 호출이 아닌, **리액트 네이티브로 post message를 보내야** 합니다. 리액트 네이티브에 아임포트 리액트 네이티브 모듈을 설치한 후, 리액트로부터 post message를 받으면 해당 결제 화면을 렌더링 하는 로직을 추가해야 합니다.

### 5-1. 리액트 네이티브로 post message 보내기

결제 하기 버튼을 눌렀을 때 결제 환경을 판단하는 로직을 추가합니다. 결제 환경이 리액트 네이티브인 경우, **리액트 네이티브로 `가맹점 식별코드`, `결제 데이터` 그리고 `액션 유형`을 post message로 보냅니다.**

```javascript
import React from 'react';

function Payment() {
  function onClickPayment() {
    const userCode = 'imp00000000';

    /* 2. 결제 데이터 정의하기 */
    const data = {
      pg: 'html5_inicis',                           // PG사
      pay_method: 'card',                           // 결제수단
      merchant_uid: `mid_${new Date().getTime()}`   // 주문번호
      amount: 1000,                                 // 결제금액
      name: '아임포트 결제 데이터 분석',                  // 주문명
      buyer_name: '홍길동',                           // 구매자 이름
      buyer_tel: '01012341234',                     // 구매자 전화번호
      buyer_email: 'example@example',               // 구매자 이메일
      buyer_addr: '신사동 661-16',                    // 구매자 주소
      buyer_postcode: '06018',                      // 구매자 우편번호
      ...
    };

    if (isReactNative()) {
      /* 5. 리액트 네이티브 환경에 대응하기 */
      const params = {
        userCode,                                   // 가맹점 식별코드
        data,                                       // 결제 데이터
        type: 'payment',                            // 결제와 본인인증 구분을 위한 필드
      };
      const paramsToString = JSON.stringify(params);
      window.ReactNativeWebView.postMessage(paramsToString);
    } else {
      /* 1. 가맹점 식별하기 */
      const { IMP } = window;
      IMP.init(userCode);
      /* 4. 결제 창 호출하기 */
      IMP.request_pay(data, callback);
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
      alert('결제 성공');
    } else {
      alert(`결제 실패: ${error_msg}`);
    }
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
    ...
    <button onClick={onClickPayment}>결제하기</button>
    ...
  );
}
```

### 5-2. 리액트 네이티브에 아임포트 모듈 설치하기

- <a href="https://github.com/iamport/iamport-react-native/blob/master/INSTALL.md" target="_blank">아임포트 리액트 네이티브 모듈 설치하기</a>
- <a href="https://github.com/iamport/iamport-react-native/blob/master/SETTING.md" target="_blank">아임포트 리액트 네이티브 모듈 설정하기</a>

### 5-3. 리액트 네이티브에서 post message를 받았을때 결제 화면 렌더링하기

리액트에서 post message를 보내면, WebView의 `onMessage` 함수가 이를 트리거합니다. 메시지 내용 중 액션 유형(`type`)이 `payment`면 결제 화면을, `certification`이면 본인인증 화면을 렌더링 하기 위해 해당 라우트로 이동합니다. 이때 **post message로 전달 받은 `가맹점 식별코드`와 `결제 데이터`를 `query`로 전달**합니다.

```javascript
import React, { useState, useEffect } from 'react';
import WebView from 'react-native-webview';
import queryString from 'query-string';

function Home({ navigation }) {
  function onMessage(e) {
    /* 리액트로부터 post message를 받았을때 트리거 된다 */
    try {
      /* post message에서 가맹점 식별코드, 결제 데이터 그리고 액션 유형을 추출한다 */
      const { userCode, data, type } = JSON.parse(e.nativeEvent.data);
      const params = { userCode, data };
      /* 결제 화면으로 이동한다 */
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

### 5-4. 리액트 네이티브에 결제 화면 추가하기

`가맹점 식별코드`와 `결제 데이터`를 쿼리에서 추출해 `IMP.Payment`에 prop 형태로 전달합니다. 이때 결제 후 실행될 로직을 작성한 콜백 함수도 함께 전달합니다. 콜백함수에서 결제 결과에 따라 로직을 다르게 작성할 수 있습니다. 아래는 결제 성공시 웹뷰를 띄운 Home으로 돌아가고, 결제 실패시 바로 이전 화면으로 돌아가는 예시입니다.

```javascript
import React from 'react';
import IMP from 'iamport-react-native';

import Loading from './Loading';

function Payment({ navigation }) {
  /* 가맹점 식별코드, 결제 데이터 추출 */
  const userCode = navigation.getParam('userCode');
  const data = navigation.getParam('data');
  
  /* 결제 후 실행될 콜백 함수 입력 */
  function callback(response) {
    const isSuccessed = getIsSuccessed(response);
    if (isSuccessed) {
      /* 결제 성공한 경우, 리디렉션 위해 홈으로 이동한다 */
      const params = {
        ...response,
        type: 'payment', // 결제와 본인인증 구분을 위한 필드
      };
      navigation.replace('Home', params);
    } else {
      /* 결제 실패한 경우, 이전 화면으로 돌아간다 */
      navigation.goBack();
    }
  }

  function getIsSuccessed(response) {
    const { imp_success, success } = response;

    if (typeof imp_success === 'string') return imp_success === 'true';
    if (typeof imp_success === 'boolean') return imp_success === true;
    if (typeof success === 'string') return success === 'true';
    if (typeof success === 'boolean') return success === true;
  }

  return (
    <IMP.Payment
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

export default Payment;
```

### 5-5. 결제 후 리디렉션 설정하기

위의 예시에 따라 결제 후, 웹뷰를 띄운 Home으로 돌아갔을때 리디렉션을 위한 추가 로직을 작성해야 합니다. 아래와 같은 경우를 가정합니다.

| 유형    | 도메인                                |
| ------ | ----------------------------------- |
| 홈      | https://example.com                 |
| 결제    | https://example.com/payment         |
| 결제완료 | https://example.com/payment/result  |

위와 같은 경우, 결제 후 홈으로 렌더링 시 웹뷰의 도메인은 다시 `https://example.com`이 됩니다. 이를 `https://example.com/payment/result`로 리디렉션 하기 위해 홈 컴포넌트에 아래와 같은 로직을 작성합니다.

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
      if (type === 'payment') {
        /* 결제 후 렌더링 되었을 경우, https://example.com/payment/result로 리디렉션 시킨다 */
        setUri(`${domain}/payment/result?${query}`);    
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
