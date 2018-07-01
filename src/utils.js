const isDev = Boolean(
  window.location.host === `localhost:3001`
);

export const getSurveyPublicUrls = surveyId => {
  if (isDev) {
    return [`http://localhost:3002/user/take-survey/${surveyId}`];
  }
  return [`${window.location.origin}/user/take-survey/${surveyId}`];
};

export const getSurveyResultsDownloadUrl = surveyId => {
  if (isDev) {
    return `http://localhost:5111/api/results?sids[]=${surveyId}`;
  }
  return `${window.location.origin}/api/results?sids[]=${surveyId}`;
}

export const getToken = () => localStorage.getItem('access_token');

export const createAuthorizedRequest = (input, init) => {
  let newInit = { ...init };
  const headers = newInit.headers || {};

  const k = 'Authorization';
  const v = `Bearer ${getToken()}`;

  let newHeaders;

  if (headers.constructor === window.Headers) {
    const newHeaders = new Headers(headers);
    newHeaders.append(k, v);
  } else {
    newHeaders = { ...headers };
    newHeaders[k] = v;
  }

  newInit.headers = newHeaders;
  return new Request(input, newInit);
}

export const validateExistanceAndPrompt = (value, valueName) => {
  if (!value) {
    alert(`${valueName} cannot be empty!`);
    return false;
  }
  return true;
}