import {
  METHODS,
  METHOD_FOR_CARD,
  METHOD_FOR_PHONE,
  METHOD_FOR_VBANK,
  METHODS_FOR_INICIS,
  METHODS_FOR_UPLUS,
  METHODS_FOR_KCP,
  METHODS_FOR_MOBILIANS,
  METHODS_FOR_DANAL,
  QUOTAS,
  QUOTAS_FOR_INICIS_AND_KCP,
} from './constants';

export function getMethods(pg) {
  switch (pg) {
    case 'html5_inicis': return METHODS_FOR_INICIS;
    case 'kcp': return METHODS_FOR_KCP;
    case 'uplus': return METHODS_FOR_UPLUS;
    case 'kcp_billing':
    case 'kakaopay':
    case 'kakao':
    case 'paypal':
    case 'smilepay':
      return METHOD_FOR_CARD;
    case 'danal':
      return METHOD_FOR_PHONE;
    case 'danal_tpay':
      return METHODS_FOR_DANAL;
    case 'mobilians':
      return METHODS_FOR_MOBILIANS;
    case 'settle':
      return METHOD_FOR_VBANK;
    default: return METHODS;
  }  
} 

export function getQuotas(pg, method) {
  if (method === 'card') {
    switch (pg) {
      case 'html5_inicis':
      case 'kcp':
        return { isQuotaRequired: true, quotas: QUOTAS_FOR_INICIS_AND_KCP };
      default:
        return { isQuotaRequired: true, quotas: QUOTAS };
    }
  }
  return { isQuotaRequired: false, quotas: QUOTAS };
}