import React, { useState } from "react";

interface CourseRow {
  subjectCode: string;
  subjectName: string;
  section: string;
  schedule: string;
  credits: string;
  instructor: string;
}

const FormAddDrop: React.FC = () => {
  // ข้อมูลพื้นฐาน
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [faculty, setFaculty] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [studentId, setStudentId] = useState<string>("");
  const [major, setMajor] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [houseNo, setHouseNo] = useState<string>("");
  const [villageNo, setVillageNo] = useState<string>("");
  const [subDistrict, setSubDistrict] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [province, setProvince] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [homePhone, setHomePhone] = useState<string>("");
  const [advisor, setAdvisor] = useState<string>("");

  // เพิ่ม/ถอน
  const [addOrDrop, setAddOrDrop] = useState<string>("");

  // ตารางรายวิชา
  const [courses, setCourses] = useState<CourseRow[]>([
    {
      subjectCode: "",
      subjectName: "",
      section: "",
      schedule: "",
      credits: "",
      instructor: "",
    },
  ]);
  const maxRows = 7;

  const [reason, setReason] = useState<string>("");
  const [agreeTerm, setAgreeTerm] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAutoFill = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/student/info", {
        credentials: "include", // เพื่อส่ง cookie/session
      });
      if (!res.ok) throw new Error("Failed to fetch student info");
      const data = await res.json();

      const today = new Date().toISOString().split("T")[0];

      setSelectedDate(today);
      setSubject("ขอเพิ่ม-ถอนรายวิชา");
      setFaculty(data.faculty);
      setName(data.displayname_th);
      setStudentId(data.userName);
      setMajor(data.department);

      // validate fields
      validateField("selectedDate", today);
      validateField("subject", "ขอเพิ่ม-ถอนรายวิชา");
      validateField("faculty", data.faculty);
      validateField("name", data.displayname_th);
      validateField("studentId", data.userName);
      validateField("major", data.department);
    } catch (err) {
      alert("ไม่สามารถดึงข้อมูลนักศึกษาได้: " + err);
    }
  };

  const inputStyle: React.CSSProperties = {
    padding: "6px 10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    width: "300px",
  };
  const redTextStyle: React.CSSProperties = {
    color: "red",
    fontSize: "16px",
    marginTop: "5px",
  };

  const handleCourseChange = (
    index: number,
    field: keyof CourseRow,
    value: string
  ) => {
    const newCourses = [...courses];
    newCourses[index][field] = value;
    setCourses(newCourses);
    if (index === 0) validateField("courses", newCourses);
  };

  const addCourseRow = () => {
    if (courses.length < maxRows) {
      setCourses([
        ...courses,
        {
          subjectCode: "",
          subjectName: "",
          section: "",
          schedule: "",
          credits: "",
          instructor: "",
        },
      ]);
    }
  };

  const validateField = (field: string, value: any) => {
    let error = "";
    switch (field) {
      case "selectedDate":
        if (!value) error = "กรุณาเลือกวันที่";
        break;
      case "subject":
        if (!value) error = "กรุณากรอกเรื่อง";
        break;
      case "faculty":
        if (!value) error = "กรุณากรอกคณะ";
        break;
      case "name":
        if (!value) error = "กรุณากรอกชื่อ";
        break;
      case "studentId":
        if (!value) error = "กรุณากรอกรหัสนักศึกษา";
        break;
      case "major":
        if (!value) error = "กรุณากรอกสาขาวิชา";
        break;
      case "advisor":
        if (!value) error = "กรุณากรอกชื่ออาจารย์ที่ปรึกษา";
        break;
      case "addOrDrop":
        if (!value) error = "กรุณาเลือกเพิ่มหรือถอน";
        break;
      case "reason":
        if (!value) error = "กรุณากรอกเหตุผล";
        break;
      case "courses":
        if (value.length === 0 || !value[0].subjectCode)
          error = "กรุณากรอกอย่างน้อยแถวแรก";
        break;
      case "agreeTerm":
        if (!value) error = "กรุณาติ๊กยอมรับเงื่อนไข";
        break;
    }
    return error;
  };

  const validateAll = () => {
    const newErrors: Record<string, string> = {};

    // ชั้นปี
    newErrors.year = !year ? "กรุณาเลือกชั้นปี" : "";

    // ที่อยู่
    newErrors.houseNo = !houseNo ? "กรุณากรอกบ้านเลขที่" : "";
    newErrors.subDistrict = !subDistrict ? "กรุณากรอกตำบล" : "";
    newErrors.district = !district ? "กรุณากรอกอำเภอ" : "";
    newErrors.province = !province ? "กรุณากรอกจังหวัด" : "";
    newErrors.postalCode = !postalCode ? "กรุณากรอกรหัสไปรษณีย์" : "";
    newErrors.phoneNumber = !phoneNumber ? "กรุณากรอกโทรศัพท์มือถือ" : "";

    // ฟิลด์ไม่บังคับ
    newErrors.villageNo = "";
    newErrors.homePhone = "";

    // ฟิลด์อื่น ๆ (เหมือนเดิม)
    newErrors.selectedDate = !selectedDate ? "กรุณาเลือกวันที่" : "";
    newErrors.subject = !subject ? "กรุณากรอกเรื่อง" : "";
    newErrors.faculty = !faculty ? "กรุณากรอกคณะ" : "";
    newErrors.name = !name ? "กรุณากรอกชื่อ" : "";
    newErrors.studentId = !studentId ? "กรุณากรอกรหัสนักศึกษา" : "";
    newErrors.major = !major ? "กรุณากรอกสาขาวิชา" : "";
    newErrors.advisor = !advisor ? "กรุณากรอกชื่ออาจารย์ที่ปรึกษา" : "";
    newErrors.addOrDrop = !addOrDrop ? "กรุณาเลือกเพิ่มหรือถอน" : "";
    newErrors.reason = !reason ? "กรุณากรอกเหตุผล" : "";
    newErrors.courses =
      courses.length === 0 || !courses[0].subjectCode
        ? "กรุณากรอกอย่างน้อยแถวแรก"
        : "";
    newErrors.agreeTerm = !agreeTerm
      ? "กรุณาอ่านและยอมรับเงื่อนไขก่อนส่งฟอร์ม"
      : "";

    setErrors(newErrors);

    return Object.values(newErrors).every((e) => !e);
  };

  const handleSubmit = async () => {
    if (validateAll()) {
      if (window.confirm("คุณต้องการยืนยันการส่งคำร้องใช่หรือไม่?")) {
        try {
          const res = await fetch("http://localhost:8080/api/form/add-drop", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              // 🧩 ข้อมูลนักศึกษา
              studentId: studentId,
              name: name,
              faculty: faculty,
              major: major,
              year: year,
              advisor: advisor,

              // 🏠 ที่อยู่ติดต่อได้
              address: {
                houseNo: houseNo,
                villageNo: villageNo,
                subDistrict: subDistrict,
                district: district,
                province: province,
                postalCode: postalCode,
                phoneNumber: phoneNumber,
                homePhone: homePhone,
              },

              // 📅 รายละเอียดคำร้อง
              selectedDate: selectedDate,
              subject: subject,
              addOrDrop: addOrDrop,
              courses: courses, // ส่งเป็น array ทั้งหมด
              reason: reason,
              agreeTerm: agreeTerm,
            }),
          });

          if (!res.ok) throw new Error("บันทึกไม่สำเร็จ");
          const data = await res.text();
          console.log("✅ Response text:", data); // จะได้ "บันทึกคำร้องสำเร็จ"
          alert(data); // แทน alert("ส่งคำร้องเรียบร้อยแล้ว!");
        } catch (err) {
          console.error("❌ Error:", err);
          alert("เกิดข้อผิดพลาดในการส่งคำร้อง");
        }
      }
    } else {
      alert("กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้องก่อนส่ง!");
    }
  };

  return (
    <div
      style={{
        padding: "20px 230px 20px 20px",
        fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
      }}
    >
      <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#333" }}>
        แบบฟอร์มคำร้องเพิ่ม-ถอน รายวิชา
      </h1>
      <div style={{ height: "40px" }}></div>

      <div style={{ marginLeft: "20px" }}>
        {/* ข้อมูลพื้นฐาน */}
        <h2 style={{ fontSize: "22px", fontWeight: 600, color: "#333" }}>
          ข้อมูลพื้นฐาน
        </h2>
        <p
          style={{
            color: "red",
            fontSize: "16px",
            marginTop: "8px",
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onClick={handleAutoFill}
        >
          Click เพื่อกรอกข้อมูลพื้นฐานอัตโนมัติ
        </p>

        <div style={{ marginTop: "20px" }}>
          <label style={{ fontSize: "16px", marginRight: "10px" }}>
            วันที่:
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              validateField("selectedDate", e.target.value);
            }}
            style={inputStyle}
          />
          {errors.selectedDate && (
            <div style={redTextStyle}>{errors.selectedDate}</div>
          )}
        </div>

        <div style={{ marginTop: "20px" }}>
          <label style={{ fontSize: "16px", marginRight: "10px" }}>
            เรื่อง:
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              validateField("subject", e.target.value);
            }}
            style={inputStyle}
          />
          {errors.subject && <div style={redTextStyle}>{errors.subject}</div>}
        </div>

        <div style={{ marginTop: "20px" }}>
          <label style={{ fontSize: "16px", marginRight: "10px" }}>คณะ:</label>
          <input
            type="text"
            value={faculty}
            onChange={(e) => {
              setFaculty(e.target.value);
              validateField("faculty", e.target.value);
            }}
            style={inputStyle}
          />
          {errors.faculty && <div style={redTextStyle}>{errors.faculty}</div>}
        </div>

        <div style={{ marginTop: "20px" }}>
          <label style={{ fontSize: "16px", marginRight: "10px" }}>ชื่อ:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              validateField("name", e.target.value);
            }}
            style={inputStyle}
          />
          {errors.name && <div style={redTextStyle}>{errors.name}</div>}
        </div>

        <div style={{ marginTop: "20px" }}>
          <label style={{ fontSize: "16px", marginRight: "10px" }}>
            รหัสนักศึกษา:
          </label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d{0,10}$/.test(val)) {
                setStudentId(val);
                validateField("studentId", val);
              }
            }}
            style={inputStyle}
          />
          {errors.studentId && (
            <div style={redTextStyle}>{errors.studentId}</div>
          )}
        </div>

        <div style={{ marginTop: "20px" }}>
          <label style={{ fontSize: "16px", marginRight: "10px" }}>
            สาขาวิชา:
          </label>
          <input
            type="text"
            value={major}
            onChange={(e) => {
              setMajor(e.target.value);
              validateField("major", e.target.value);
            }}
            style={inputStyle}
          />
          {errors.major && <div style={redTextStyle}>{errors.major}</div>}
        </div>

        {/* ชั้นปี */}
        <div style={{ marginTop: "20px" }}>
          <label style={{ fontSize: "16px", marginRight: "10px" }}>
            ชั้นปีที่:
          </label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={{
              padding: "6px 10px",
              fontSize: "16px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "100px",
            }}
          >
            <option value="">-- เลือก --</option>
            {Array.from({ length: 8 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          {errors.year && (
            <div style={{ color: "red", marginTop: "5px" }}>{errors.year}</div>
          )}
        </div>

        {/* บ้านเลขที่ */}
        <div style={{ marginTop: "20px" }}>
          <label style={{ fontSize: "16px", marginRight: "10px" }}>
            บ้านเลขที่:
          </label>
          <input
            type="text"
            value={houseNo}
            onChange={(e) => setHouseNo(e.target.value)}
            style={{
              padding: "6px 10px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              width: "300px",
            }}
          />
          {errors.houseNo && (
            <div style={{ color: "red", marginTop: "5px" }}>
              {errors.houseNo}
            </div>
          )}
        </div>

        {/* ตำบล */}
        <div style={{ marginTop: "20px" }}>
          <label style={{ fontSize: "16px", marginRight: "10px" }}>ตำบล:</label>
          <input
            type="text"
            value={subDistrict}
            onChange={(e) => setSubDistrict(e.target.value)}
            style={{
              padding: "6px 10px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              width: "300px",
            }}
          />
          {errors.subDistrict && (
            <div style={{ color: "red", marginTop: "5px" }}>
              {errors.subDistrict}
            </div>
          )}
        </div>

        {/* อำเภอ */}
        <div style={{ marginTop: "20px" }}>
          <label style={{ fontSize: "16px", marginRight: "10px" }}>
            อำเภอ:
          </label>
          <input
            type="text"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            style={{
              padding: "6px 10px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              width: "300px",
            }}
          />
          {errors.district && (
            <div style={{ color: "red", marginTop: "5px" }}>
              {errors.district}
            </div>
          )}
        </div>

        {/* จังหวัด */}
        <div style={{ marginTop: "20px" }}>
          <label style={{ fontSize: "16px", marginRight: "10px" }}>
            จังหวัด:
          </label>
          <input
            type="text"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            style={{
              padding: "6px 10px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              width: "300px",
            }}
          />
          {errors.province && (
            <div style={{ color: "red", marginTop: "5px" }}>
              {errors.province}
            </div>
          )}
        </div>

        {/* รหัสไปรษณีย์ */}
        <div style={{ marginTop: "20px" }}>
          <label style={{ fontSize: "16px", marginRight: "10px" }}>
            รหัสไปรษณีย์:
          </label>
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            style={{
              padding: "6px 10px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              width: "100px",
            }}
          />
          {errors.postalCode && (
            <div style={{ color: "red", marginTop: "5px" }}>
              {errors.postalCode}
            </div>
          )}
        </div>

        {/* โทรศัพท์มือถือ */}
        <div style={{ marginTop: "20px" }}>
          <label style={{ fontSize: "16px", marginRight: "10px" }}>
            โทรศัพท์มือถือ:
          </label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={{
              padding: "6px 10px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              width: "200px",
            }}
          />
          {errors.phoneNumber && (
            <div style={{ color: "red", marginTop: "5px" }}>
              {errors.phoneNumber}
            </div>
          )}
        </div>
        <div style={{ marginTop: "20px", marginBottom: "40px" }}>
          <label style={{ fontSize: "16px", marginRight: "10px" }}>
            โทรศัพท์บ้าน (ถ้ามี):
          </label>
          <input
            type="text"
            value={homePhone}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d{0,10}$/.test(val)) setHomePhone(val);
            }}
            style={inputStyle}
          />
        </div>

        {/* Advisor */}
        <h2
          style={{
            fontSize: "22px",
            fontWeight: 600,
            color: "#333",
            marginTop: "20px",
          }}
        >
          อาจารย์ที่ปรึกษา
        </h2>
        <div style={{ marginTop: "20px", marginBottom: "5px" }}>
          <label style={{ fontSize: "16px", marginRight: "10px" }}>
            ชื่ออาจารย์ที่ปรึกษา:
          </label>
          <input
            type="text"
            value={advisor}
            onChange={(e) => {
              setAdvisor(e.target.value);
              validateField("advisor", e.target.value);
            }}
            style={inputStyle}
          />
          {errors.advisor && <div style={redTextStyle}>{errors.advisor}</div>}
        </div>
        <div style={redTextStyle}>*กรุณาใส่ตำแหน่งทางวิชาการของอาจารย์</div>

        {/* เพิ่ม/ถอน */}
        <hr style={{ border: "1px solid black", marginTop: "20px" }} />
        <h2
          style={{
            fontSize: "22px",
            fontWeight: 600,
            color: "#333",
            marginTop: "20px",
          }}
        >
          ขอเพิ่ม/ถอน
        </h2>
        <div style={{ color: "red", fontSize: "16px", marginBottom: "10px" }}>
          *นักศึกษาสามารถขอเพิ่ม หรือถอนได้อย่างใดอย่างหนึ่ง ต่อการกรอก 1
          ฟอร์มเท่านั้น
        </div>
        <div style={{ marginTop: "10px" }}>
          <label style={{ marginRight: "20px" }}>
            <input
              type="radio"
              value="เพิ่ม"
              checked={addOrDrop === "เพิ่ม"}
              onChange={(e) => {
                setAddOrDrop(e.target.value);
                validateField("addOrDrop", e.target.value);
              }}
            />{" "}
            เพิ่ม
          </label>
          <label>
            <input
              type="radio"
              value="ถอน"
              checked={addOrDrop === "ถอน"}
              onChange={(e) => {
                setAddOrDrop(e.target.value);
                validateField("addOrDrop", e.target.value);
              }}
            />{" "}
            ถอน
          </label>
          {errors.addOrDrop && (
            <div style={redTextStyle}>{errors.addOrDrop}</div>
          )}
        </div>

        {/* ตารางรายวิชา */}
        <div style={{ marginTop: "30px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 600, color: "#333" }}>
            รายการขอเพิ่ม/ถอน
          </h2>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "10px",
            }}
          >
            <thead>
              <tr>
                <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                  ลำดับ
                </th>
                <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                  รหัสวิชา
                </th>
                <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                  ชื่อวิชา
                </th>
                <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                  Section
                </th>
                <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                  วัน/เวลา
                </th>
                <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                  หน่วยกิต
                </th>
                <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                  ชื่อผู้สอน
                </th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={index}>
                  <td
                    style={{
                      border: "1px solid #ccc",
                      padding: "6px",
                      textAlign: "center",
                    }}
                  >
                    {index + 1}
                  </td>
                  {(
                    [
                      "subjectCode",
                      "subjectName",
                      "section",
                      "schedule",
                      "credits",
                      "instructor",
                    ] as (keyof CourseRow)[]
                  ).map((field) => (
                    <td
                      key={field}
                      style={{ border: "1px solid #ccc", padding: "6px" }}
                    >
                      <input
                        type="text"
                        value={course[field]}
                        onChange={(e) =>
                          handleCourseChange(index, field, e.target.value)
                        }
                        style={{ width: "100%" }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {courses.length < maxRows && (
            <button
              type="button"
              onClick={addCourseRow}
              style={{
                marginTop: "10px",
                padding: "6px 12px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              + เพิ่มแถว
            </button>
          )}
          {errors.courses && <div style={redTextStyle}>{errors.courses}</div>}
        </div>

        {/* เหตุผล */}
        <div style={{ marginTop: "30px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 600, color: "#333" }}>
            เหตุผลที่ขอเพิ่ม / ถอน
          </h2>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              validateField("reason", e.target.value);
            }}
            style={{
              width: "100%",
              minHeight: "100px",
              padding: "8px 10px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              resize: "vertical",
            }}
            placeholder="กรุณากรอกเหตุผล"
          />
          {errors.reason && <div style={redTextStyle}>{errors.reason}</div>}
        </div>

        {/* Term & Condition */}
        <div style={{ marginTop: "30px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 600, color: "#333" }}>
            Term & Condition
          </h2>
          <label
            style={{ fontSize: "16px", display: "flex", alignItems: "center" }}
          >
            <input
              type="checkbox"
              checked={agreeTerm}
              onChange={(e) => {
                setAgreeTerm(e.target.checked);
                validateField("agreeTerm", e.target.checked);
              }}
              style={{ marginRight: "10px" }}
            />
            Agree to term and condition
          </label>
          {errors.agreeTerm && (
            <div style={redTextStyle}>{errors.agreeTerm}</div>
          )}
        </div>
        <button
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
          }}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default FormAddDrop;
