import React, { useState, useEffect } from "react";
import HaitianLogo from "../Images/Haitian.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faLock } from "@fortawesome/free-solid-svg-icons";
import HaitianBackgroundImage from "../Images/HaitianBanner.png";
import { Button, Form, Input, notification } from "antd";
import "../App.css";

notification.config({
  maxCount: 2,
  placement: "bottomRight",
  duration: 3,
});

export default function Login({ onLoginSuccess }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [initialAnimation, setInitialAnimation] = useState(true);

  useEffect(() => {
    if (shake) {
      const timer = setTimeout(() => {
        setShake(false);
      }, 400); // match animation duration
      return () => clearTimeout(timer);
    }
  }, [shake]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialAnimation(false); // disable fade-in after first render
    }, 800); // match fade-in duration

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (values) => {
    if (!navigator.onLine) {
      notification.error({
        message: "No Internet Connection",
        description: "Please check your internet and try again.",
      });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycby1YoO4qjELycORSPHgOqLPnOlaqAF3EPkAQjzeAd_TjahYOSPyotsT7YDMzE1frNEF/exec",
        {
          method: "POST",
          body: new URLSearchParams({
            action: "loginUser",
            userEmail: values.userEmail,
            password: values.password,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        notification.success({
          message: "Success",
          // description: `Login successful!`,
          description: `Welcome ${values.userEmail.split("@")[0]}!`,
        });

        // onLoginSuccess(values.username);
        onLoginSuccess({
          email: values.userEmail,
            location: data.location, 
          access: data.access,
        });
      } else {
        setShake(true);
        notification.error({
          message: "Error",
          description: "Login failed: " + data.message,
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Error: " + error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const styl = `.ant-form-item .ant-form-item-label >label {
    position: relative;
    display: inline-flex
;
    align-items: center;
    max-width: 100%;
    height: 32px;
    color: #0D3884;
    font-size: 16px;
}
.ant-form-item .ant-form-item-explain-error {
    color: #ff4d4f;
    font-weight: normal !important;
}    

     .ant-select-single .ant-select-selector .ant-select-selection-placeholder {
    transition: none;
    pointer-events: none;
    font-weight: normal;
}
    @keyframes shake {
    0% { transform: translateX(0); }
    20% { transform: translateX(-15px); }
    40% { transform: translateX(15px); }
    60% { transform: translateX(-10px); }
    80% { transform: translateX(10px); }
    100% { transform: translateX(0); }
  }

  .shake {
    animation: shake 0.4s ease-in-out;
  }
`;

  return (
    <>
      <style>{styl}</style>

      <div
        className="container-fluid  d-flex justify-content-center align-items-center vh-100 m-0 p-0"
        style={{
          backgroundImage: `url(${HaitianBackgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="container-fluid m-auto  d-flex justify-content-center align-items-center vh-100"
          style={{
            backgroundColor: "rgba(0, 49, 91, 0.1)",
          }}
        >
          <div className="w-50 m-auto ">
            <div
              // className={`container rounded-5 p-5 loginContainer bg-white fade-in ${
              //   shake ? "shake" : ""
              // }`}
              className={`container rounded-5 p-5 loginContainer bg-white
    ${initialAnimation ? "fade-in" : ""}
    ${shake ? "shake" : ""}
  `}
            >
              <div className="row">
                <div className="col-12">
                  <div className="m-auto d-flex justify-content-center align-items-center m-0 p-0 ">
                    <img
                      src={HaitianLogo}
                      className="m-0 p-0 m-auto "
                      alt="Haitian Logo"
                      style={{ width: "70%" }}
                    />
                  </div>
                  <div>
                    <h4
                      className="text-center haitianColor m-0 p-0"
                      style={{ fontWeight: "600" }}
                    >
                      Inventory Management System
                    </h4>
                    <p className="text-center text-muted">
                      Please log in to your account
                    </p>
                    <Form
                      form={form}
                      layout="vertical"
                      className="mt-4"
                      onFinish={handleSubmit}
                    >
                      <Form.Item
                        label={
                          <>
                            <FontAwesomeIcon
                              icon={faCircleUser}
                              className="me-1"
                              size="lg"
                            />
                            User Email
                          </>
                        }
                        name="userEmail"
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
                        <Input size="large" />
                      </Form.Item>

                      <Form.Item
                        label={
                          <>
                            <FontAwesomeIcon
                              icon={faLock}
                              className="me-1"
                              size="lg"
                            />
                            Password
                          </>
                        }
                        name="password"
                        rules={[
                          {
                            required: true,
                            message: "Please input your password!",
                          },
                        ]}
                      >
                        <Input.Password size="large" />
                      </Form.Item>
                      <Button
                        className="loginButton mt-3 mb-4"
                        size="large"
                        htmlType="submit"
                        loading={loading}
                      >
                        {loading ? "Logging In" : "Login"}
                      </Button>
                      <p className="text-center m-0 p-0 haitianColor">
                        © 2025 Haitian Middle East & Africa. All rights
                        reserved.
                      </p>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
