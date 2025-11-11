import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListCheck } from "@fortawesome/free-solid-svg-icons";
import UAE from "../Images/UAE.png";
import US from "../Images/US.png";
import Dirham from "../Images/Dirham.png";

import {
  faCircleUser,
  faLock,
  faUserPlus,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
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
  AutoComplete,
} from "antd";
import "../App.css";
import dayjs from "dayjs";

export default function CustomerDetails({ user }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [ownerLoading, setOwnerLoading] = useState(false);

  const [ownerOptions, setOwnerOptions] = useState([]);
  const access = user?.access?.["Customer Details"] || "No Access";
  const readOnly = access === "Read";

  const GAS_URL =
    "https://script.google.com/macros/s/AKfycbx27Dt_yQ0yjM5GAbqpw38u5LHKX4i0X7a5EN8V816qmY4ftcwoe6pmmEosddXcsVRjGg/exec";

  useEffect(() => {
    fetchCustomerOwners();
  }, []);

  const fetchCustomerOwners = async () => {
    setOwnerLoading(true);
    try {
      const response = await fetch(GAS_URL, {
        method: "POST",
        body: new URLSearchParams({ action: "getCustomerOwners" }),
      });

      const result = await response.json();
      if (result.success && Array.isArray(result.owners)) {
        setOwnerOptions(result.owners);
        // console.log(ownerOptions);
      }
    } catch (err) {
      // console.error("Error fetching owners:", err);
    } finally {
      setOwnerLoading(false);
    }
  };

  const userLocalDateTime = dayjs().format("DD-MM-YYYY HH:mm:ss");
  // console.log(userLocalDateTime);

  const handleSubmit = async (values) => {
    // console.log(values);

    try {
      setLoading(true);
      const response = await fetch(GAS_URL, {
        method: "POST",
        body: new URLSearchParams({
          action: "addCustomer",
          customername: values.customername || "-",
          salutation: values.salutation || "-",
          firstname: values.firstname || "-",
          lastname: values.lastname || "-",
          contactPersonSalutation: values.contactPersonSalutation || "-",
          contactPersonFirstName: values.contactPersonFirstName || "-",
          contactPersonLastName: values.contactPersonLastName || "-",
          contactPersonPosition: values.contactPersonPosition || "-",
          contactPersonNumber: values.contactPersonNumber || "-",
          contactPersonEmail: values.contactPersonEmail || "-",
          customerOwner: values.customerOwner || "-",
          customerEmail: values.customerEmail || "-",
          workPhoneNumber: values.workPhoneNumber || "-",
          mobileNumber: values.mobileNumber || "-",
          address: values.address || "-",
          vataxId: values.vataxId || "-",
          currency: values.currency || "-",
          paymentTerms: values.paymentTerms || "-",
          creditLimit: values.creditLimit || "-",
          deliveryTerms: values.deliveryTerms || "-",
          // userName: user || "-",
          modifiedDateTime: userLocalDateTime,
          userName: user?.email || "",
        }),
      });
      const result = await response.json();
      if (result.success) {
        notification.success({
          message: "Success",
          description: result.message,
        });
        form.resetFields();
        fetchCustomerOwners();
      } else {
        notification.error({
          message: "Error",
          description: result.message || "Failed to add customer",
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
  
  `;
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
              Customer Details
            </h1>
            <p
              className="text-center m-0 p-0 haitianInventoryDescriptionText"
              style={{ color: "#0D3884" }}
            >
              (Provide customer information)
            </p>
          </div>
          <div className="row d-flex flex-row mt-4 ">
            <div className="d-flex flex-column flex-lg-row justify-content-lg-evenly rounded-4">
              <div className="col-12 p-3 p-lg-4  ">
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
                      icon={faUsers}
                      size="lg"
                      style={{ color: "#0D3884" }}
                    />
                  </div>
                  <div>
                    <div
                      className="fw-bold m-0 p-0"
                      style={{ fontSize: "20px", color: "#0D3884" }}
                    >
                      Customer information
                    </div>
                    <div
                      className="m-0 p-0"
                      style={{ fontSize: "14px", color: "#0D3884" }}
                    >
                      Fill in the details to create a new customer
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
                      label="Customer Name"
                      name="customername"
                      className="fw-bold"
                      rules={[
                        {
                          required: true,
                          message: "Please input customer name!",
                        },
                        {
                          pattern: /^[A-Za-z\s.]+$/,
                          message:
                            "Customer name should not contain numbers or special characters!",
                        },
                      ]}
                    >
                      <Input placeholder="Enter Customer Name" />
                    </Form.Item>

                    <Form.Item
                      label="Primary Contact"
                      name="primarycontact"
                      className="fw-bold"
                      rules={[
                        {
                          required: true,
                          message: "",
                        },
                      ]}
                    >
                      <div className="row">
                        <div className="col-2">
                          <Form.Item
                            name="salutation"
                            rules={[
                              {
                                required: true,
                                message: "Please select a salutation!",
                              },
                            ]}
                          >
                            <Select placeholder="Salutation">
                              <Select.Option value="Mr.">Mr.</Select.Option>
                              <Select.Option value="Mrs.">Mrs.</Select.Option>
                            </Select>
                          </Form.Item>
                        </div>

                        <div className="col-5">
                          <Form.Item
                            name="firstname"
                            rules={[
                              {
                                required: true,
                                message: "Please enter first name!",
                              },
                              {
                                pattern: /^[A-Za-z\s.]+$/,
                                message:
                                  "First name should not contain numbers or special characters!",
                              },
                            ]}
                          >
                            <Input placeholder="Enter First Name" />
                          </Form.Item>
                        </div>

                        <div className="col-5">
                          <Form.Item
                            name="lastname"
                            rules={[
                              {
                                required: false,
                                // message: "Please enter last name!",
                              },
                              {
                                pattern: /^[A-Za-z\s.]+$/,
                                message:
                                  "Last name should not contain numbers or special characters!",
                              },
                            ]}
                          >
                            <Input placeholder="Enter Last Name" />
                          </Form.Item>
                        </div>
                      </div>
                    </Form.Item>

                    <Form.Item label="Contact Person" className="fw-bold">
                      <div className="row">
                        <div className="col-2">
                          <Form.Item
                            name="contactPersonSalutation"
                            rules={[
                              {
                                required: false,
                                message: "Please select a salutation!",
                              },
                            ]}
                          >
                            <Select placeholder="Salutation">
                              <Select.Option value="Mr.">Mr.</Select.Option>
                              <Select.Option value="Mrs.">Mrs.</Select.Option>
                            </Select>
                          </Form.Item>
                        </div>

                        <div className="col-5">
                          <Form.Item
                            name="contactPersonFirstName"
                            rules={[
                              {
                                required: false,
                                message: "Please enter first name!",
                              },
                              {
                                pattern: /^[A-Za-z\s.]+$/,
                                message:
                                  "First name should not contain numbers or special characters!",
                              },
                            ]}
                          >
                            <Input placeholder="Enter First Name" />
                          </Form.Item>
                        </div>

                        <div className="col-5">
                          <Form.Item
                            name="contactPersonLastName"
                            rules={[
                              {
                                required: false,
                                message: "Please enter last name!",
                              },
                              {
                                pattern: /^[A-Za-z\s.]+$/,
                                message:
                                  "Last name should not contain numbers or special characters!",
                              },
                            ]}
                          >
                            <Input placeholder="Enter Last Name" />
                          </Form.Item>
                        </div>

                        <div className="col-4">
                          <Form.Item
                            name="contactPersonPosition"
                            rules={[
                              {
                                required: false,
                                message: "Please enter position!",
                              },
                            ]}
                          >
                            <Input placeholder="Enter Position" />
                          </Form.Item>
                        </div>

                        <div className="col-4">
                          <Form.Item
                            name="contactPersonNumber"
                            rules={[
                              {
                                required: false,
                                message: "Please enter contact number",
                              },
                              {
                                pattern: /^[0-9\s-]+$/,
                                message:
                                  "Contact number should not contain letter",
                              },
                            ]}
                          >
                            <Input placeholder="Enter Contact Number" />
                          </Form.Item>
                        </div>

                        <div className="col-4">
                          <Form.Item
                            name="contactPersonEmail"
                            rules={[
                              {
                                required: false,
                                message: "Please enter email",
                              },
                              {
                                validator: (_, value) => {
                                  if (!value) return Promise.resolve();
                                  const emailRegex =
                                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                  return emailRegex.test(value)
                                    ? Promise.resolve()
                                    : Promise.reject(
                                        "Please enter a valid email address"
                                      );
                                },
                              },
                            ]}
                          >
                            <Input placeholder="Enter Email" />
                          </Form.Item>
                        </div>
                      </div>
                    </Form.Item>

                    <Form.Item
                      label="Customer Owner"
                      name="customerOwner"
                      className="fw-bold"
                      rules={[
                        {
                          required: true,
                          message: "Please enter the customer owner!",
                        },
                      ]}
                    >
                      {/* <AutoComplete
                        allowClear
                        showSearch
                        placeholder="Type or select owner"
                        defaultActiveFirstOption={false} // Prevents ghost selection
                        options={ownerOptions.map((owner) => ({
                          label: owner,
                          value: owner,
                        }))}
                        onSelect={(value) => {
                          form.setFieldsValue({ customerOwner: value });
                        }}
                        // onBlur={() => {
                        //   const value = form.getFieldValue("customerOwner");
                        //   if (value && !ownerOptions.includes(value)) {
                        //     setOwnerOptions((prev) => [...prev, value]);
                        //   }
                        // }}
                        onChange={(value) => {
                          form.setFieldsValue({ customerOwner: value });
                        }}
                        filterOption={(inputValue, option) =>
                          option?.value
                            ?.toLowerCase()
                            .includes(inputValue.toLowerCase())
                        }
                      /> */}
                      <AutoComplete
                        allowClear
                        showSearch
                        placeholder="Type or select owner"
                        defaultActiveFirstOption={false}
                        options={
                          ownerLoading
                            ? [
                                {
                                  label: "Fetching...",
                                  value: "",
                                  disabled: true,
                                },
                              ]
                            : ownerOptions.map((owner) => ({
                                label: owner,
                                value: owner,
                              }))
                        }
                        onSelect={(value) => {
                          form.setFieldsValue({ customerOwner: value });
                        }}
                        onChange={(value) => {
                          form.setFieldsValue({ customerOwner: value });
                        }}
                        filterOption={(inputValue, option) =>
                          option?.value
                            ?.toLowerCase()
                            .includes(inputValue.toLowerCase())
                        }
                      />
                    </Form.Item>

                    <Form.Item
                      label="Customer Email"
                      name="customerEmail"
                      className="fw-bold"
                      rules={[
                        {
                          required: true,
                          message: "Please enter the customer email!",
                        },
                        {
                          validator: (_, value) => {
                            if (!value) return Promise.resolve();
                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            return emailRegex.test(value)
                              ? Promise.resolve()
                              : Promise.reject(
                                  "Please enter a valid email address"
                                );
                          },
                        },
                      ]}
                    >
                      <Input placeholder="Enter Customer Email" />
                    </Form.Item>

                    <Form.Item
                      label="Customer Phone"
                      name="customerPhone"
                      className="fw-bold"
                      rules={[
                        {
                          required: true,
                          message: "",
                        },
                      ]}
                    >
                      <div className="row">
                        <div className="col-6">
                          <Form.Item
                            name="workPhoneNumber"
                            rules={[
                              {
                                required: false,
                                // message:
                                //   "Please enter the cutomer work phone number!",
                              },
                              {
                                pattern: /^[0-9\s-]+$/,
                                message:
                                  "Work phone number should not contain special characters!",
                              },
                            ]}
                          >
                            <Input placeholder="Enter Work Phone Number" />
                          </Form.Item>
                        </div>

                        <div className="col-6">
                          <Form.Item
                            name="mobileNumber"
                            rules={[
                              {
                                required: true,
                                message:
                                  "Please enter the cutomer mobile number!",
                              },
                              {
                                pattern: /^[0-9\s-]+$/,
                                message:
                                  "Mobile number should not contain special characters!",
                              },
                            ]}
                          >
                            <Input placeholder="Enter Mobile Number" />
                          </Form.Item>
                        </div>
                      </div>
                    </Form.Item>
                    <Form.Item
                      label="Address"
                      name="address"
                      className="fw-bold"
                      rules={[
                        {
                          required: true,
                          message: "Please enter the address!",
                        },
                      ]}
                    >
                      <Input.TextArea placeholder="Enter Address" rows={6} />
                    </Form.Item>

                    <Form.Item
                      label="VAT/TAX ID"
                      name="vataxId"
                      className="fw-bold"
                      rules={[
                        {
                          required: true,
                          message: "Please enter the VAT/TAX ID!",
                        },
                      ]}
                    >
                      <Input placeholder="Enter the VAT/TAX ID" />
                    </Form.Item>

                    <Form.Item
                      label="Currency"
                      name="currency"
                      className="fw-bold"
                      rules={[
                        {
                          required: true,
                          message: "Please select the currency type!",
                        },
                      ]}
                    >
                      <Select placeholder="Select Currency Type">
                        <option value="AED">
                          <div className="d-flex align-items-center">
                            <img
                              src={UAE}
                              alt="UAE"
                              style={{ width: "30px" }}
                            />{" "}
                            <span className="ms-1">
                              United Arab Emirates - AED (
                              <img
                                src={Dirham}
                                alt="Dirham"
                                style={{ width: "15px" }}
                                className="img-fluid m-0 p-0"
                              />
                              )
                            </span>
                          </div>
                        </option>
                        <option value="USD">
                          <div className="d-flex align-items-center">
                            <img src={US} alt="US" style={{ width: "30px" }} />{" "}
                            <span className="ms-1">
                              United States Of America - USD (
                              <span
                                className="fw-bold"
                                style={{ width: "15px" }}
                              >
                                $
                              </span>
                              )
                            </span>
                          </div>
                        </option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="Payment Terms"
                      name="paymentTerms"
                      className="fw-bold"
                      rules={[
                        {
                          required: true,
                          message: "Please enter the payment terms!",
                        },
                      ]}
                    >
                      <Select placeholder="Select Payment Terms">
                        <option value="30% as an advance, Balance 70% before the Shipment">
                          30% as an advance, Balance 70% before the Shipment
                        </option>
                        <option value="40% as an advance, Balance 60% before the Shipment">
                          40% as an advance, Balance 60% before the Shipment
                        </option>
                        <option value="50% as an advance, Balance 50% before the Shipment">
                          50% as an advance, Balance 50% before the Shipment
                        </option>
                        <option value="30% as an advance balance, 365 days' Credit from the date of BL based on Insurance approval">
                          30% as an advance balance, 365 days' Credit from the
                          date of BL based on Insurance approval
                        </option>
                        {/* <option value="30% as an advance, Balance 70% before the Shipment">
                          30% as an advance, Balance 70% before the Shipment
                        </option> */}
                        <option value="100% advance">100% advance</option>
                        <option value="90days from the date Invoice">
                          90days from the date Invoice
                        </option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label="Delivery Terms"
                      name="deliveryTerms"
                      className="fw-bold"
                      rules={[
                        {
                          required: true,
                          message: "Please enter the delivery terms!",
                        },
                      ]}
                    >
                      {/* <Input placeholder="Enter Payment Terms" /> */}
                      <Select placeholder="Select Payment Terms">
                        <option value="Ex-works Ningbo">Ex-works Ningbo</option>
                        <option value="FOB Ningbo">FOB Ningbo</option>
                        <option value="CIF Jebel Ali">CIF Jebel Ali</option>
                        <option value="Ex-works Hamriyah freezone">
                          Ex-works Hamriyah freezone
                        </option>
                        <option value="Ex-works Umm al Quwain">
                          Ex-works Umm al Quwain
                        </option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label="Credit Limit"
                      name="creditLimit"
                      className="fw-bold"
                      rules={[
                        {
                          required: true,
                          message: "Please enter the credit limit!",
                        },
                      ]}
                    >
                      <Input placeholder="Enter Credit Limit" />
                    </Form.Item>

                    {!readOnly && (
                      <div className="col-7 text-center mt-5 pt-3 mb-3 d-flex m-auto">
                        <Button
                          htmlType="submit"
                          size="large"
                          className="submitButton mt-2"
                          loading={loading}
                        >
                          {loading ? "Adding Customer" : "Add Customer"}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
