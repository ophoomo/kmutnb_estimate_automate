const axios = require("axios");
const ip = require("ip");

const { encrypt } = require("./encryption");
const logger = require("./loggers");

const BASE_PATH = "https://reg.kmutnb.ac.th/regapiweb1/api/th/";

async function login_kmutnb(username, password) {
  const data = encrypt(
    JSON.stringify({
      username: username,
      password: password,
      ip: ip.address(),
    })
  );
  try {
    const response = await axios.post(BASE_PATH + "Account/LoginAD/", {
      param: data,
    });
    if (response) {
      if (response.status == 200) return response.data.token;
      else throw response;
    }
  } catch (err) {
    logger.error(err);
    return undefined;
  }
}

async function get_class(token) {
  try {
    const response = await axios.get(BASE_PATH + "Evaluateofficer/Class", {
      Authorization: "Bearer " + token,
    });
    if (response.status == 200) return response.data;
    else throw response;
  } catch (err) {
    logger.error(err);
    return [];
  }
}

async function get_estimate(token, classid, evaluateid, officerid) {
  try {
    const response = await axios.get(
      BASE_PATH +
        `Evaluateofficerform/Evaluatequestion/${classid}/${evaluateid}/${officerid}`,
      {
        Authorization: "Bearer " + token,
      }
    );
    if (response.status == 200) return response.data;
    else throw response;
  } catch (err) {
    logger.error(err);
    return [];
  }
}

async function submit_estimate_form1(
  token,
  classid,
  evaluateid,
  officerid,
  data
) {
  const payload = encrypt(JSON.stringify(data));
  try {
    const response = await axios.post(
      BASE_PATH +
        `Evaluateofficerform/Addanswer/${evaluateid}/${classid}/${officerid}/1`,
      {
        param: payload,
      },
      {
        Authorization: "Bearer " + token,
      }
    );
    return response;
  } catch (err) {
    logger.error(err);
    return undefined;
  }
}

async function submit_estimate_form2(
  token,
  classid,
  evaluateid,
  officerid,
  data
) {
  try {
    const payload = encrypt(JSON.stringify(data));
    const response = await axios.post(
      BASE_PATH +
        `Evaluateofficerform/Addanswer/${evaluateid}/${classid}/${officerid}/2`,
      {
        param: payload,
      },
      {
        Authorization: "Bearer " + token,
      }
    );
    return response;
  } catch (err) {
    logger.error(err);
    return undefined;
  }
}

async function line_notify(message) {
  try {
    const token = process.env.LINE_NOTIFY;
    if (token) {
      const response = await axios.post(
        "https://notify-api.line.me/api/notify",
        {
          message: message,
        },
        {
          Authorization: "Bearer " + process.env.LINE_NOTIFY,
        }
      );
      return response;
    } else return "Not Have Token LINE_NOTIFY";
  } catch (err) {
    logger.error(err);
    return undefined;
  }
}

module.exports = {
  login_kmutnb,
  get_class,
  get_estimate,
  submit_estimate_form1,
  submit_estimate_form2,
  line_notify,
};
