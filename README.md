
# iamport-react-example
[ ![alt text](https://img.shields.io/badge/react-v16.8.6-orange.svg?longCache=true&style=flat-square) ](https://github.com/facebook/react/)
[ ![alt text](https://img.shields.io/badge/antd-v3.20.5-yellow.svg?longCache=true&style=flat-square) ](https://github.com/ant-design/ant-design)
[ ![alt text](https://img.shields.io/badge/styled--components-v4.3.2-green.svg?longCache=true&style=flat-square) ](https://github.com/styled-components/styled-components)

> [!WARNING]
> **이 저장소는 더 이상 유지보수되지 않습니다 (Deprecated).**
>
> 아래 포트원 공식 문서를 참고해 주세요.
>
> - **포트원 V2 (권장)**: [결제 연동 시작하기](https://developers.portone.io/opi/ko/integration/start/v2/readme?v=v2) · [JavaScript SDK](https://developers.portone.io/sdk/ko/v2-sdk/readme?v=v2) · [portone-sample 샘플 프로젝트](https://github.com/portone-io/portone-sample)
> - **포트원 V1 (기존 아임포트)**: [인증 결제 연동하기](https://developers.portone.io/opi/ko/integration/start/v1/auth?v=v1) · [JavaScript SDK](https://developers.portone.io/sdk/ko/v1-sdk/javascript-sdk/readme?v=v1)

리액트 환경에서 아임포트 결제 및 휴대폰 본인인증 연동을 위한 예제입니다.

## 다운받기

```
$ git clone https://github.com/iamport/iamport-react-example
```

## 실행하기

```
$ cd ./iamport-react-example
$ yarn
$ yarn start
```

## 아임포트 라이브러리 추가하기

최상단 HTML(public/index.html)에 아래의 `<script>`를 삽입합니다. 아임포트 라이브러리는 jQuery 기반으로 동작하기 때문에 **jQuery 1.0 이상이 반드시 설치**되어 있어야합니다.

```html
  <!-- jQuery -->
  <script type="text/javascript" src="https://code.jquery.com/jquery-1.12.4.min.js" ></script>
  <!-- iamport.payment.js -->
  <script type="text/javascript" src="https://cdn.iamport.kr/js/iamport.payment-1.1.8.js"></script>
```

## 결제 연동하기

결제 연동 방법은 [리액트에서 아임포트 결제 연동하기](manuals/PAYMENT.md) 문서를 참고하세요.

## 휴대폰 본인인증 연동하기

휴대폰 본인인증 연동 방법은 [리액트에서 아임포트 휴대폰 본인인증 연동하기](manuals/CERTIFICATION.md) 문서를 참고하세요.
