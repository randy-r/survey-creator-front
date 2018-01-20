const isDev = Boolean(
  window.location.host === `localhost:3001`
);

export const getSurveyPublicUrls = surveyId => {
  if (isDev) {
    return [`http://localhost:3002/take-survey/${surveyId}`, `http://localhost:3002/take-survey/ubb/${surveyId}`];
  }
  return [`${window.location.origin}/user/take-survey/${surveyId}`, `${window.location.origin}/user/take-survey/${surveyId}`];
};