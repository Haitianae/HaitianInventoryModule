import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Input,
  Select,
  Cascader,
  message,
  Table,
  notification,
  Tooltip,
  Checkbox,
  Radio,
  Modal,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListCheck, faEye, faEdit } from "@fortawesome/free-solid-svg-icons";
import HaitianLogo from "../Images/Haitian.png";

import {
  faCircleUser,
  faLock,
  faUserPlus,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import "../App.css";
import { width } from "@fortawesome/free-brands-svg-icons/fa42Group";
import { text } from "@fortawesome/fontawesome-svg-core";
import dayjs from "dayjs";

notification.config({
  maxCount: 2,
  placement: "bottomRight",
  duration: 3,
});

const modules = [
  "Dashboard",
  "Inventory",
  "Product Categories",
  "Customer Details",
  "Delivery Note",
  "Purchase Request",
  // "Reports",
  "Add User",
];
const accessLevels = ["No Access", "Read", "Read/Write", "Full Control"];

export default function AddUser({ user }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [viewDataSource, setViewDataSource] = useState([]);

  const [editForm] = Form.useForm();
  const [viewForm] = Form.useForm();

  const access = user?.access?.["Add User"] || "No Access";
  const readOnly = access === "Read";
  const GAS_URL =
    "https://script.google.com/macros/s/AKfycbyDyD05DHTruR35-VOztQm1bFuilGTnoEGsR1tX41r_truYKIc7__0Xh6QNaJJEGI5DDw/exec";
  const fetchUsers = async () => {
    setFetching(true);
    try {
      const res = await fetch(GAS_URL, {
        method: "POST",
        body: new URLSearchParams({ action: "getUsers" }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        notification.error({ message: "Error", description: data.message });
      }
    } catch (err) {
      notification.error({ message: "Error", description: err.message });
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  if (access === "No Access") {
    return <h2 style={{ padding: 20 }}>You do not have access to Add User</h2>;
  }
  const dataSource = modules.map((module, index) => ({
    key: index,
    module,
  }));

  // Define columns (first column for module name, rest for access levels)
  const moduleColumns = [
    {
      title: (
        <span style={{ fontWeight: "bold", color: "#0D3884" }}>Module</span>
      ),
      dataIndex: "module",
      key: "module",
      width: "50%",
      render: (text) => (
        <span style={{ fontWeight: "normal", color: "#0D3884" }}>{text}</span>
      ),
    },
    {
      title: (
        <span style={{ fontWeight: "bold", color: "#0D3884" }}>
          Access Level
        </span>
      ),
      key: "access",
      width: "50%",
      render: (_, record) => (
        <Form.Item
          name={["access", record.module]}
          rules={[{ required: true, message: "Please select access level" }]}
          style={{ marginBottom: 0 }}
          validateTrigger="onSubmit"
        >
          <Radio.Group>
            {accessLevels.map((level) => (
              <Radio
                key={level}
                value={level}
                className="me-4"
                style={{ fontWeight: "normal" }}
              >
                {level}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
      ),
    },
  ];

  const handleView = (record) => {
  setSelectedUser(record);

  // build rows for table
  const accessRows = modules.map((mod) => ({
    module: mod,
    access: record[mod] || "No Access",
  }));
  setViewDataSource(accessRows);

  // preload just the email
  viewForm.setFieldsValue({
    viewUserEmail: record["User Email"],
  });

  setIsViewModalVisible(true);
};


  const handleEdit = (record) => {
    setSelectedUser(record);

    // Build access object from record
    const access = {};
    modules.forEach((mod) => {
      access[mod] = record[mod] || "No Access";
    });

    // Preload values into the modal form
    editForm.setFieldsValue({
      editUserEmail: record["User Email"],
      access: modules.reduce((acc, mod) => {
        acc[mod] = record[mod] || "No Access";
        return acc;
      }, {}),
      editPassword: "",
      editConfirmPassword: "",
    });

    setIsEditModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      // ✅ validate EDIT form, not ADD form
      const values = await editForm.validateFields();

      // build payload
      const payload = {
        action: "updateUserAccess",
        userEmail: values.editUserEmail,
        access: JSON.stringify(values.access),
        modifiedBy: user?.email || "Admin",
      };

      // ✅ include password only if entered
      if (values.editPassword) {
        payload.password = values.editPassword;
      }

      setLoading(true);

      const res = await fetch(GAS_URL, {
        method: "POST",
        body: new URLSearchParams(payload),
      });

      const data = await res.json();

      if (data.success) {
        // message.success("User updated successfully!");
 notification.success({
        message: "Success",
        description: `User updated successfully.`,
      });
        // refresh user list
        fetchUsers();

        // close modal and reset form
        setIsEditModalVisible(false);
        editForm.resetFields();
      } else {
        // message.error(data.message || "Failed to update user.");
               notification.success({
        message: "Error",
        description: (data.message || "Failed to update user."),
      });
      }
    } catch (error) {
      // console.error("Update error:", error);
      // message.error("Please check the form and try again.");
       notification.success({
        message: "Error",
        description: `Please check the form and try again.`,
      });
    } finally {
      setLoading(false);
    }
  };

//   const columns = [
//   { title: "User Email", dataIndex: "User Email", key: "userEmail" },
//   {
//     title: "Modified User",
//     dataIndex: "Modified Date & Time", 
//     key: "modifiedUser",
//   },
//   {
//     title: "Modified Date & Time",
//     dataIndex: "Modified User", 
//     key: "modifiedDate",
//     render: (value) => {
//       if (!value) return "N/A";
//       const parsed = dayjs(value);
//       return parsed.isValid() ? parsed.format("DD-MM-YYYY hh:mm A") : value;
//     },
//   },
//   {
//     title: "Action",
//     key: "action",
//     render: (_, record) => (
//       <>
//         <Button className="addButton" onClick={() => handleView(record)}>
//           View
//         </Button>
//         <Button
//           className="deleteButton ms-2 "
//           onClick={() => handleEdit(record)}
//         >
//           Edit
//         </Button>
//       </>
//     ),
//   },
// ];

const columns = [
  { title: "User Email", dataIndex: "User Email", key: "userEmail" },
  {
    title: "Modified User",
    dataIndex: "Modified User",
    key: "modifiedUser",
    render: (value) => value || "N/A",
  },
  {
    title: "Modified Date & Time",
    dataIndex: "Modified Date & Time",
    key: "modifiedDate",
    render: (value) => value || "N/A",
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <>
        <Button className="addButton" onClick={() => handleView(record)}>
          View
        </Button>
        {!readOnly && (
        <Button
          className="deleteButton ms-2"
          onClick={() => handleEdit(record)}
        >
          Edit
        </Button>)}
      </>
    ),
  },
];



  const editModuleColumns = [
    {
      title: "Module",
      dataIndex: "module",
      key: "module",
      width: "50%",
    },
    {
      title: "Access Level",
      key: "access",
      width: "50%",
      render: (_, record) => (
        <Form.Item name={["access", record.module]} style={{ marginBottom: 0 }}>
          <Radio.Group>
            {accessLevels.map((lvl) => (
              <Radio key={lvl} value={lvl} className="me-3">
                {lvl}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
      ),
    },
  ];

 const viewModuleColumns = [
  {
    title: "Module",
    dataIndex: "module",
    key: "module",
    width: "50%",
  },
  {
    title: "Access Level",
    key: "access",
    width: "50%",
    render: (_, record) => (
      <Radio.Group value={record.access} >
        {accessLevels.map((lvl) => (
          <Radio key={lvl} value={lvl} className="me-3">
            {lvl}
          </Radio>
        ))}
      </Radio.Group>
    ),
  },
];


  const styl = `.ant-form-item .ant-form-item-explain-error {
    color: #ff4d4f;
    font-weight: normal;
  }
  .ant-select-single .ant-select-selector .ant-select-selection-placeholder {
    transition: none;
    pointer-events: none;
    font-weight: normal;
  }
  
 .ant-cascader-dropdown.ant-select-dropdown {
    padding: 0;
    width: 60% !important;
    height: auto !important;
}
    .ant-form-item .ant-form-item-label >label {
    position: relative;
    display: inline-flex;
    color: #0D3884;
    font-size: 14px;

    align-items: center;
    max-width: 100%;
    height: 32px;
    color: #0D3884;
    font-size: 14px;
}
.ant-form-item .ant-form-item-explain-error {
    color: #ff4d4f;
    font-weight: normal !important;
}    
    .ant-form-item .ant-form-item-explain-error {
    color: #ff4d4f;
    font-weight: normal !important;
}    
    [class^="ant-table"] [class^="ant-table"], [class*=" ant-table"] [class^="ant-table"], [class^="ant-table"] [class*=" ant-table"], [class*=" ant-table"] [class*=" ant-table"] {
    box-sizing: border-box;
    color: #0D3884 !important;
}
    .ant-tooltip .ant-tooltip-inner {
    min-width: 28px;
    min-height: 32px;
    padding: 6px 8px;
    color: white;
    text-align: start;
    text-decoration: none;
    word-wrap: break-word;
    background-color: rgba(137, 137, 137, 1) !important;
    border-radius: 6px;
      border: 2px solid rgba(137, 137, 137, 0.87);
    box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
    box-sizing: border-box;
}
    .ant-table-wrapper .ant-table-thead >tr>th, .ant-table-wrapper .ant-table-thead >tr>td {
    position: relative;
    color: #0d3884 !important;
    text-align: start;
    background-color: #E8F0FE;
    border-bottom: 1px solid #f0f0f0;
    transition: background 0.2s ease;
  
}
        .ant-modal-root .ant-modal {
    width: var(--ant-modal-xs-width);
    width: 100% !important;

  
  `;

  // const handleSubmit = async (values) => {
  //   if (!navigator.onLine) {
  //     notification.error({
  //       message: "No Internet Connection",
  //       description: "Please check your internet and try again.",
  //     });
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     const response = await fetch(
  //       "https://script.google.com/macros/s/AKfycbwHZ3G5sqmuTZgKskzbeKiPcM6bnlShQ-vvdiGzCr6VbwfqN-kjRmQQIoLc1LeBpVSStg/exec",
  //       {
  //         method: "POST",
  //         body: new URLSearchParams({
  //           action: "registerUser",
  //           userEmail: values.userEmail,
  //           password: values.password,
  //         }),
  //       }
  //     );

  //     const result = await response.json();
  //     if (result.success) {
  //       // message.success(result.message);
  //       notification.success({
  //         message: "Success",
  //         description: result.message,
  //       });
  //       form.resetFields();
  //     } else {
  //       // message.error(result.message || "Failed to register user");
  //       notification.error({
  //         message: "Error",
  //         description: result.message || "Failed to register user",
  //       });
  //     }
  //   } catch (error) {
  //     // message.error("Something went wrong");

  //     notification.error({
  //       message: "Error",
  //       description: "Something went wrong",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const userLocalDateTime = dayjs().format("DD-MM-YYYY HH:mm:ss");
console.log(userLocalDateTime);
  const handleSubmit = async (values) => {
    // Ensure at least one module has access selected
    const access = values.access || {};
    const hasAccess = Object.values(access).some(
      (level) => level && level !== "No Access"
    );

    if (!hasAccess) {
      notification.error({
        message: "Error",
        description: "Please provide at least one module access!",
      });
      return;
    }

    if (!navigator.onLine) {
      notification.error({
        message: "No Internet Connection",
        description: "Please check your internet and try again.",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(GAS_URL, {
        method: "POST",
        body: new URLSearchParams({
          action: "registerUser",
          userEmail: values.userEmail,
          password: values.password,
          access: JSON.stringify(values.access),
          modifiedBy: user?.email || "Unknown",
          modifiedDateTime: userLocalDateTime,
        }),
      });

      const result = await response.json();
      if (result.success) {
        notification.success({
          message: "Success",
          description: result.message,
        });
        form.resetFields();
        fetchUsers();
      } else {
        notification.error({
          message: "Error",
          description: result.message || "Failed to register user",
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styl}</style>
      <div className="container-fluid mt-3">
        <div className="container">
          <div>
            <h1
              className="text-center m-0 p-0 haitianColor mt-1 "
              style={{ fontSize: "30px" }}
            >
              Add New User
            </h1>
            <p
              className="text-center m-0 p-0 haitianInventoryDescriptionText"
              style={{ color: "#0D3884" }}
            >
              (Register a new user to provide access)
            </p>
          </div>

          <div className="row d-flex flex-row mt-4 ">
            <div className="d-flex flex-column flex-lg-row justify-content-lg-evenly rounded-4">
              <div className="col-12 p-3 p-lg-4  ">
                {!readOnly && (
                  <>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      backgroundColor: "#e8f0fe",
                      borderRadius: "12px",
                      width: "40px",
                      height: "40px",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faUserPlus}
                      size="lg"
                      style={{ color: "#0D3884" }}
                    />
                  </div>
                  <div>
                    <div
                      className="fw-bold m-0 p-0"
                      style={{ fontSize: "20px", color: "#0D3884" }}
                    >
                      Create Account
                    </div>
                    <div
                      className="m-0 p-0"
                      style={{ fontSize: "14px", color: "#0D3884" }}
                    >
                      Fill in the details to create a new user account
                    </div>
                  </div>
                </div>

                <div className="border border-1"></div>

                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  className="mt-3 mt-lg-3"
                  disabled={loading || readOnly}
                >
                  <div className="row mt-3">
                    <Form.Item
                      label="User Email"
                      name="userEmail"
                      className="fw-bold"
                      rules={[
                        { required: true, message: "Please input your email!" },
                        {
                          type: "email",
                          message: "Please enter a valid email address!",
                        },
                        () => ({
                          validator(_, value) {
                            if (!value) return Promise.resolve();
                            const exists = users.some(
                              (u) => u["User Email"] === value
                            );
                            return exists
                              ? Promise.reject(
                                  new Error("This email is already registered!")
                                )
                              : Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <Input
                        placeholder="Enter User Email"
                        autoComplete="off"
                      />
                    </Form.Item>

                    <Table
                      dataSource={dataSource}
                      columns={moduleColumns}
                      pagination={false}
                    />

                    <Form.Item
                      label="Password"
                      name="password"
                      className="fw-bold mt-4"
                      hasFeedback
                      rules={[
                        {
                          required: true,
                          message: "Please input your password!",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            const regex =
                              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
                            if (!value) {
                              return Promise.resolve();
                            }
                            if (!regex.test(value)) {
                              return Promise.reject(
                                new Error(
                                  "Password must be 8–15 characters and include uppercase, lowercase, number, and special character."
                                )
                              );
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <Input.Password
                        placeholder="Enter Password"
                        autoComplete="new-password"
                      />
                    </Form.Item>

                    <Form.Item
                      label="Confirm Password"
                      name="confirmpassword"
                      className="fw-bold"
                      dependencies={["password"]}
                      hasFeedback
                      rules={[
                        {
                          required: true,
                          message: "Please confirm your password!",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("Passwords do not match!")
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password
                        placeholder="Enter Conform Password"
                        autoComplete="new-password"
                      />
                    </Form.Item>

                    {!readOnly && (
                      <div className="col-7 text-center mt-4 mb-3 d-flex m-auto">
                        <Button
                          htmlType="submit"
                          size="large"
                          className="submitButton mt-2"
                          loading={loading}
                        >
                          {loading ? "Registering User" : "Register User"}
                        </Button>

                        <Button
                          htmlType="button"
                          size="large"
                          className="clearButton mt-2 ms-3"
                          onClick={() => {
                            const values = form.getFieldsValue();
                            const isEmpty = Object.values(values).every(
                              (value) =>
                                value === undefined ||
                                value === null ||
                                value === "" ||
                                (Array.isArray(value) && value.length === 0)
                            );

                            if (isEmpty) {
                              notification.info({
                                message: "Nothing to clear",
                                description: "All fields are already empty.",
                              });
                            } else {
                              form.resetFields();
                              notification.success({
                                message: "Success",
                                description: "Form cleared successfully!",
                              });
                            }
                          }}
                        >
                          Clear Input
                        </Button>
                      </div>
                    )}
                  </div>
                </Form>
                </>)}
                
                <div
                  className={`d-flex align-items-center gap-2 ${
                    readOnly ? "mb-1 " : "mb-1 mt-4 pt-2"
                  }`}
                >
                  {" "}
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      backgroundColor: "#e8f0fe",
                      borderRadius: "12px",
                      width: "40px",
                      height: "40px",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faTable}
                      size="lg"
                      style={{ color: "#0D3884" }}
                    />
                  </div>
                  <div>
                    <div
                      className="fw-bold m-0 p-0"
                      style={{ fontSize: "20px", color: "#0D3884" }}
                    >
                      Manage Users
                    </div>
                    <div
                      className="m-0 p-0"
                      style={{ fontSize: "14px", color: "#0D3884" }}
                    >
                      View or update user information
                    </div>
                  </div>
                </div>

                <div className="border border-1"></div>
                <Table
                  columns={columns}
                  dataSource={users}
                  rowKey={(record) => record["User Email"]}
                  loading={fetching}
                  className="mt-3"
                  bordered
                />

                <Modal
                  open={isEditModalVisible}
                  onCancel={() => {
                    setIsEditModalVisible(false);
                    editForm.resetFields();
                  }}
                  footer={null}
                  width={1200}
                  style={{ top: "5px" }}
                >
                  <div className="col-12 col-lg-8 text-center m-auto">
                    <img
                      src={HaitianLogo}
                      alt="HaitianLogo"
                      className="m-0 p-0"
                      style={{ width: "30%" }}
                    />
                  </div>

                  <div className="d-flex align-items-center gap-2 mb-1">
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        backgroundColor: "#e8f0fe",
                        borderRadius: "12px",
                        width: "40px",
                        height: "40px",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faEdit}
                        size="xl"
                        style={{ color: "#0D3884" }}
                      />
                    </div>
                    <div>
                      <div
                        className="fw-bold m-0 p-0"
                        style={{ fontSize: "20px", color: "#0D3884" }}
                      >
                        Edit User Information
                      </div>
                      <div
                        className="m-0 p-0"
                        style={{ fontSize: "14px", color: "#0D3884" }}
                      >
                        Update user access and password for the selected record
                      </div>
                    </div>
                  </div>
                  <div className="border border-1"></div>

                 <Form
                    form={editForm}
                    layout="vertical"
                    onFinish={handleUpdate}
                    className="mt-3 mt-lg-3"
                    disabled={loading || readOnly}
                  >
                    <div className="row mt-3">
                      {/* User Email */}
                      <Form.Item
                        label="User Email"
                        name="editUserEmail" // ✅ unique name
                        className="fw-bold"
                        rules={[
                          {
                            required: true,
                            message: "Please input your email!",
                          },
                          {
                            type: "email",
                            message: "Please enter a valid email address!",
                          },
                        ]}
                      >
                        <Input placeholder="Enter User Email" readOnly />
                      </Form.Item>

                      {/* Access Table */}
                      <Table
                        dataSource={dataSource}
                        columns={editModuleColumns}
                        pagination={false}
                      />

                      <Form.Item
                        label="New Password"
                        name="editPassword"
                        className="fw-bold mt-4"
                        rules={[
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value) return Promise.resolve(); // allow empty
                              const regex =
                                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
                              return regex.test(value)
                                ? Promise.resolve()
                                : Promise.reject(
                                    new Error(
                                      "Password must be 8–15 characters and include uppercase, lowercase, number, and special character."
                                    )
                                  );
                            },
                          }),
                        ]}
                      >
                        <Input.Password
                          placeholder="Enter New Password (or leave blank to keep the old password)"
                          autoComplete="new-password"
                        />
                      </Form.Item>
                      <Form.Item
                        label="Confirm Password"
                        name="editConfirmPassword"
                        className="fw-bold mt-3"
                        dependencies={["editPassword"]}
                        rules={[
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!getFieldValue("editPassword")) {
                                return Promise.resolve(); // no password → no need to confirm
                              }
                              if (value === getFieldValue("editPassword")) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error("Passwords do not match!")
                              );
                            },
                          }),
                        ]}
                      >
                        <Input.Password placeholder="Confirm Password" />
                      </Form.Item>

                      {/* Buttons */}
                      {!readOnly && (
                        <div className="col-7 text-center mt-4 mb-3 d-flex m-auto">
                          <Button
                            htmlType="submit"
                            size="large"
                            className="submitButton mt-2"
                            loading={loading}
                          >
                            {loading ? "Updating User" : "Update User"}
                          </Button>

                          <Button
                            htmlType="button"
                            size="large"
                            className="clearButton mt-2 ms-3"
                            onClick={() => {
                              setIsEditModalVisible(false);
                              editForm.resetFields();
                            }}
                          >
                            Close Form
                          </Button>
                        </div>
                      )}
                    </div>
                  </Form>
                </Modal>
                <Modal
                  open={isViewModalVisible}
                  onCancel={() => {
                    setIsViewModalVisible(false);
                    viewForm.resetFields();
                  }}
                  footer={null}
                  width={1200}
                  style={{ top: "5px" }}
                >
                  {/* Logo */}
                  <div className="col-12 col-lg-8 text-center m-auto">
                    <img
                      src={HaitianLogo}
                      alt="HaitianLogo"
                      className="m-0 p-0"
                      style={{ width: "30%" }}
                    />
                  </div>

                  {/* Header Section */}
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        backgroundColor: "#e8f0fe",
                        borderRadius: "12px",
                        width: "40px",
                        height: "40px",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faEye}
                        size="lg"
                        style={{ color: "#0D3884" }}
                      />
                    </div>
                    <div>
                      <div
                        className="fw-bold m-0 p-0"
                        style={{ fontSize: "20px", color: "#0D3884" }}
                      >
                        View User Information
                      </div>
                      <div
                        className="m-0 p-0"
                        style={{ fontSize: "14px", color: "#0D3884" }}
                      >
                        Details of user access and information
                      </div>
                    </div>
                  </div>
                  <div className="border border-1"></div>

                  {/* Form Section */}
                  <Form
                    form={viewForm}
                    layout="vertical"
                    className="mt-3 mt-lg-3"
                  >
                    <div className="row mt-3">
                      {/* User Email */}
                      <Form.Item
                        label="User Email"
                        name="viewUserEmail"
                        className="fw-bold"
                      >
                        <Input readOnly />
                      </Form.Item>

                      {/* Access Table */}
                      <Table
                        dataSource={viewDataSource}
                        columns={viewModuleColumns}
                        pagination={false}
                      />

                      {/* Password (hidden or masked in View mode) */}
                      {/* <Form.Item
        label="Password"
        name="password"
        className="fw-bold mt-4"
      >
        <Input.Password readOnly placeholder="********" />
      </Form.Item> */}

                      {/* Close Button Only */}
                      <div className=" col-7 text-center mt-4 mb-3  m-auto">
                        <Button
                          htmlType="button"
                          size="large"
                          className="clearButton mt-2 ms-3 text-center"
                          onClick={() => {
                            setIsViewModalVisible(false);
                            viewForm.resetFields();
                          }}
                        >
                          Close Form
                        </Button>
                      </div>
                    </div>
                  </Form>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
