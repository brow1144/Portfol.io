export function parseError(err) {
  let error = {
    status: 0,
    message: ''
  };

  if (typeof err === String && err.includes('UserError:'))
    error.status = 400;
  else
    error.status = 500;

  error.message = err;

  return error;
};

export function buildResponse(res, data) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  if (data.error)
    res.status(data.error.status).json(data);
  else
    res.status(200).json(data);
};
