import sfetch from './slick-fetch';

const slickUrlPrefix = '/slick';

// eslint-disable-next-line import/prefer-default-export
export async function register(registrationCode, idToken) {
  const url = `${slickUrlPrefix}/register`;
  const registrationParameters = {
    registrationCode,
  };
  const response = await sfetch.post(url, idToken, registrationParameters);
  return response;
}
