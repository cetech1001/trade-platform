export const environment = {
  production: true,
  api: {
    baseURL: process.env['NX_REACT_APP_API_URL'] || 'http://localhost:3000',
  },
}
