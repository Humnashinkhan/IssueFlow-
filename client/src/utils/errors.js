// Converts an Axios error into { message, fieldErrors } for the UI
export const getApiError = (error) => {
  if (error.response) {
    return {
      message: error.response.data?.message || 'Something went wrong',
      fieldErrors: error.response.data?.errors || {},
    };
  }
  return {
    message: 'Cannot reach the server. Check that the backend is running.',
    fieldErrors: {},
  };
};