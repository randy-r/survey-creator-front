const isDev = Boolean(
  window.location.host === `localhost:3001`
);

export const getSurveyPublicUrls = surveyId => {
  if (isDev) {
    return [`http://localhost:3002/take-survey/${surveyId}`, `http://localhost:3002/take-survey/ubb/${surveyId}`];
  }
  return [`${window.location.origin}/user/take-survey/${surveyId}`, `${window.location.origin}/user/take-survey/${surveyId}`];
};

export const getToken = () => localStorage.getItem('access_token');

export const createAuthorizedRequest = (input, init) => {
  let newInit = init;
  if (init) {
    const { headers } = init;
    if (headers && headers.append) {
      headers.append('Authorization', `Bearer ${getToken()}`);
    } else {
      headers['Authorization'] = `Bearer ${getToken()}`;
    }
  } else {
    newInit = { headers: { 'Authorization': `Bearer ${getToken()}` } };
  }
  return new Request(input, newInit);
}