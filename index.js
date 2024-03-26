require("dotenv").config();
const express = require("express");
const app = express();
const { login_kmutnb, get_class, get_estimate, submit_estimate_form1, line_notify } = require("./src/api");
const { random_rate } = require("./src/utils");

app.get("/", (req, res) => {
  res.json({ status: true });
});

app.get("/estimate", async (req, res) => {
  const username = process.env.KMUTNB_USERNAME;
  const password = process.env.KMUTNB_PASSWORD;
  if (!username && !password)
    return res.json({
      status: false,
      message: "please configure your username and password",
    });

  const token = await login_kmutnb(username, password);
  console.log(token);
  if (token) return res.json({ status: false, message: "can't login" });

  const subjects = await get_class(token);
  if (!subjects)
    return res.json({ status: false, message: "can't get subject" });

  for (const subject of subjects) {
    if (subject.instructor.length > 0) {
      if (subject.instructor[0].evaluatestatus == 0) {
        const classid = subject.instructor[0].classid;
        const evaluateid = subject.instructor[0].evaluateid;
        const officerid = subject.instructor[0].officerid;
        const coursename = subject.coursename;
        const estimates = await get_estimate(classid, evaluateid, officerid);
        let answer = { complaints: "", Ctxt: "" };
        for (const estimate of estimates) {
          const questionid = estimate.questionid;
          const questiontype = estimate.questiontype;
          answer = { ...answer, [questiontype + questionid]: random_rate() };
        }
        console.log(answer);
        // const response = await submit_estimate_form1(token, classid, evaluateid, officerid, answer);
        // if (response.status == 200) {
        //     await line_notify(`ทำแบบทดสอบวิชา ${coursename} เสร็จสิ้น`);
        // } else {
        //     await line_notify("เกิดข้อผิดพลาด ไม่สามารถทำแบบทดสอบได้");
        // }
            await line_notify(`ทำแบบทดสอบวิชา ${coursename} เสร็จสิ้น`);
            await line_notify("เกิดข้อผิดพลาด ไม่สามารถทำแบบทดสอบได้");
      }
    }
  }

  res.json({ status: true, message: "success" });
});

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;
