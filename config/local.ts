const local = {
  serverBaseUrl: 'http://api.local.test.kr:8080',
  auth: {
    redirectEndpointAfterSocialLogin: 'http://www.local.test.kr:3000',
    jwt: {
      issuer: 'localhost',
    },
  },
}

export default local
