export const environment = {
	production: false,
	api: {
    baseURL: process.env.NX_REACT_APP_API_URL || 'http://localhost:3000',
  },
};
