import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faListCheck,
  faEye,
  faEdit,
  faMagnifyingGlass,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import UAE from "../Images/UAE.png";
import US from "../Images/US.png";
import Dirham from "../Images/Dirham.png";
import XLSX from "xlsx-js-style";

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
  Modal,
} from "antd";
import "../App.css";
import dayjs from "dayjs";
import HaitianLogo from "../Images/Haitian.png";
import {
  SearchOutlined,
  ReloadOutlined,
  ExportOutlined,
} from "@ant-design/icons";

export default function CustomerDetails({ user }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);

  const [ownerLoading, setOwnerLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [fetching, setFetching] = useState(false);

  const [ownerOptions, setOwnerOptions] = useState([]);
  const access = user?.access?.["Customer Details"] || "No Access";
  const readOnly = access === "Read";
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [viewForm] = Form.useForm();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  const GAS_URL =
    "https://script.google.com/macros/s/AKfycbxK5N6UsoB2ocXok9DFGZvYkI8awN2hnVRYFpOGew09SVH5JtrGV3upfPN58niU0OOW/exec";

  useEffect(() => {
    fetchCustomerOwners();
    fetchCustomers();
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

  const fetchCustomers = async () => {
    setFetching(true);
    try {
      const response = await fetch(GAS_URL, {
        method: "POST",
        body: new URLSearchParams({ action: "getAllCustomerDetails" }),
      });

      const result = await response.json();
      // console.log("Fetched Customers:", result);
      if (result.success) {
        setCustomers(result.customers || []);
      }
    } catch (err) {
      notification.error({
        message: "Error",
        description: "Failed to fetch customers",
      });
    } finally {
      setFetching(false);
    }
  };

  const userLocalDateTime = dayjs().format("DD-MM-YYYY HH:mm:ss");
  // console.log(userLocalDateTime);

  const handleView = (record) => {
form.resetFields(); 
    setSelectedCustomer(record);

    // Preload all fields into the form
    viewForm.setFieldsValue({
      viewCustomerName: record["Customer Name"],
      viewPrimaryContact: record["Primary Contact"],
      viewContactPerson: record["Contact Person Name"],
      viewPosition: record["Contact Person Position"],
      viewContactNumber: record["Contact Person Number"],
      viewEmail: record["Contact Person Email"],
      viewCustomerEmail: record["Customer Email"],
      viewWorkPhone: record["Customer Work Phone"],
      viewMobilePhone: record["Customer Mobile Phone"],
      viewOwner: record["Customer Owner"],

      viewAddress: record["Address"],
      viewVAT: record["VAT/TAX ID"],
      viewCurrency: record["Currency"],
      viewPaymentTerms: record["Payment Terms"],
      viewDeliveryTerm: record["Delivery Term"],
      viewModifiedUser: record["Modified User"],
      viewModifiedDate: record["Modified Date & Time"],
    });

    setIsViewModalVisible(true);
  };
  
  // const handleEdit = (record) => {
  //   form.resetFields(); 
  //   setSelectedCustomer(record);

  //   editForm.setFieldsValue({
  //     customername: record["Customer Name"],
  //     salutation: record["Primary Contact"]?.split(" ")[0] || "",
  //     firstname: record["Primary Contact"]?.split(" ")[1] || "",
  //     lastname: record["Primary Contact"]?.split(" ")[2] || "",

  //     contactPersonSalutation:
  //       record["Contact Person Name"]?.split(" ")[0] || "",
  //     contactPersonFirstName:
  //       record["Contact Person Name"]?.split(" ")[1] || "",
  //     contactPersonLastName: record["Contact Person Name"]?.split(" ")[2] || "",

  //     contactPersonPosition: record["Contact Person Position"],
  //     contactPersonNumber: record["Contact Person Number"],
  //     contactPersonEmail: record["Contact Person Email"],

  //     customerOwner: record["Customer Owner"],
  //     customerEmail: record["Customer Email"],
  //     workPhoneNumber: record["Customer Work Phone"],
  //     mobileNumber: record["Customer Mobile Phone"],
  //     address: record["Address"],
  //     vataxId: record["VAT/TAX ID"],
  //     currency: record["Currency"],
  //     paymentTerms: record["Payment Terms"],
  //     deliveryTerms: record["Delivery Term"],
  //   });

  //   setIsEditModalVisible(true);
  // };


const safeValue = (val) => {
  if (!val || val === "-" || val === "'-" || val.trim() === "-") return undefined;
  return val;
};


const splitName = (name = "") => {
  if (!name || name === "-" || name === "- - -" || name.trim() === "") {
    return { salutation: undefined, first: "", last: "" };
  }

  const parts = name.split(" ");

  return {
    salutation: safeValue(parts[0]),
    first: safeValue(parts[1]) || "",
    last: safeValue(parts[2]) || "",
  };
};


const handleEdit = (record) => {
  form.resetFields();

  setSelectedCustomer(record);

  // Prepare name fields safely
  const primary = splitName(record["Primary Contact"]);
  const contact = splitName(record["Contact Person Name"]);

  editForm.setFieldsValue({
    customername: safeValue(record["Customer Name"]),

    salutation: primary.salutation,
    firstname: primary.first,
    lastname: primary.last,

    contactPersonSalutation: contact.salutation,
    contactPersonFirstName: contact.first,
    contactPersonLastName: contact.last,

    contactPersonPosition: safeValue(record["Contact Person Position"]),
    contactPersonNumber: safeValue(record["Contact Person Number"]),
    contactPersonEmail: safeValue(record["Contact Person Email"]),

    customerOwner: safeValue(record["Customer Owner"]),
    customerEmail: safeValue(record["Customer Email"]),
    workPhoneNumber: safeValue(record["Customer Work Phone"]),
    mobileNumber: safeValue(record["Customer Mobile Phone"]),
    address: safeValue(record["Address"]),
    vataxId: safeValue(record["VAT/TAX ID"]),
    currency: safeValue(record["Currency"]),
    paymentTerms: safeValue(record["Payment Terms"]),
    deliveryTerms: safeValue(record["Delivery Term"]),
  });

  setIsEditModalVisible(true);
};


  const customerColumns = [
    {
      title: "Customer Name",
      dataIndex: "Customer Name",
      key: "Customer Name",
    },
    {
      title: "Primary Contact",
      dataIndex: "Primary Contact",
      key: "Primary Contact",
    },
    {
      title: "Contact Person Name",
      dataIndex: "Contact Person Name",
      key: "Contact Person Name",
    },
    {
      title: "Contact Person Position",
      dataIndex: "Contact Person Position",
      key: "Contact Person Position",
    },
    {
      title: "Contact Person Number",
      dataIndex: "Contact Person Number",
      key: "Contact Person Number",
    },
    {
      title: "Contact Person Email",
      dataIndex: "Contact Person Email",
      key: "Contact Person Email",
    },

    {
      title: "Customer Owner",
      dataIndex: "Customer Owner",
      key: "Customer Owner",
    },
    {
      title: "Customer Email",
      dataIndex: "Customer Email",
      key: "Customer Email",
    },
    {
      title: "Customer Work Phone",
      dataIndex: "Customer Work Phone",
      key: "Customer Work Phone",
    },
    {
      title: "Customer Mobile Phone",
      dataIndex: "Customer Mobile Phone",
      key: "Customer Mobile Phone",
    },
    { title: "Address", dataIndex: "Address", key: "Address" },
    { title: "VAT/TAX ID", dataIndex: "VAT/TAX ID", key: "VAT/TAX ID" },

    { title: "Currency", dataIndex: "Currency", key: "Currency" },
    {
      title: "Payment Terms",
      dataIndex: "Payment Terms",
      key: "Payment Terms",
    },
    {
      title: "Delivery Term",
      dataIndex: "Delivery Term",
      key: "Delivery Term",
    },
    {
      title: "Modified User",
      dataIndex: "Modified User",
      key: "Modified User",
    },
    {
      title: "Modified Date & Time",
      dataIndex: "Modified Date & Time",
      key: "Modified Date & Time",
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      render: (_, record) => (
        <>
          <Button className="addButton" disabled={loading} onClick={() => handleView(record)}>
            View
          </Button>

          {!readOnly && (
            <Button
              className="deleteButton ms-2"
              onClick={() => handleEdit(record)}
              disabled={loading}
            >
              Edit
            </Button>
          )}
        </>
      ),
    },
  ];


  const handleCloseViewModal = () => {
  setIsViewModalVisible(false);
  viewForm.resetFields();
};


  const handleEditViewModal = () => {
  setIsEditModalVisible(false);
  editForm.resetFields();
};


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
          // creditLimit: values.creditLimit || "-",
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
        fetchCustomers();
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

  const handleEditSubmit = async (values) => {
    try {
      setEditLoading(true);

      const response = await fetch(GAS_URL, {
        method: "POST",
        body: new URLSearchParams({
          action: "updateCustomer",
          originalCustomerName: selectedCustomer["Customer Name"],

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
          deliveryTerms: values.deliveryTerms || "-",
          modifiedDateTime: userLocalDateTime,
          userName: user?.email || "",
        }),
      });

      const result = await response.json();

      if (result.success) {
        notification.success({
          message: "Success",
          description: "Customer updated successfully",
        });

        fetchCustomers();
        editForm.resetFields();
        setIsEditModalVisible(false);
      } else {
        notification.error({
          message: "Error",
          description: result.message || "Failed to update customer",
        });
      }
    } catch (err) {
      notification.error({
        message: "Error",
        description: "Something went wrong",
      });
    } finally {
      setEditLoading(false);
    }
  };
  const filteredCustomers = customers.filter((item) => {
    return (
      searchText === "" ||
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchText.toLowerCase())
      )
    );
  });

const handleExportCustomers = () => {
  if (!filteredCustomers || filteredCustomers.length === 0) {
    notification.warning({
      message: "Export Failed",
      description: "No customer data available to export.",
      placement: "bottomRight",
    });
    return;
  }

  const now = dayjs().format("DD-MM-YYYY_HH-mm-ss");
  const fileName = `Customer_Details_Report_${now}.xlsx`;

  // Header Style
  const headerStyle = {
    font: { bold: true, sz: 12 },
    alignment: { horizontal: "left", vertical: "center", wrapText: true },
    border: getAllBorders(),
    fill: { patternType: "solid", fgColor: { rgb: "FFFF00" } },
  };

  // Extract column headers
  const headers = Object.keys(filteredCustomers[0]).map((key) => ({
    v: key,
    t: "s",
    s: headerStyle,
  }));

  // Data rows
  const data = filteredCustomers.map((row) =>
    Object.values(row).map((value) => ({
      v: value || "",
      t: "s",
      s: { border: getAllBorders(), alignment: { horizontal: "left" } },
    }))
  );

  // Sheet creation
  const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);

  // Auto column width
  const colWidths = headers.map((header, colIndex) => {
    let maxLen = header.v.length;
    data.forEach((row) => {
      const cellVal = row[colIndex]?.v ? String(row[colIndex].v) : "";
      maxLen = Math.max(maxLen, cellVal.length);
    });
    return { wch: Math.min(maxLen * 1.8, 60) };
  });
  ws["!cols"] = colWidths;

  // Workbook creation
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Customer Details");

  // Save file
  XLSX.writeFile(wb, fileName);

  notification.success({
    message: "Export Successful",
    description: "Filtered customer details exported successfully.",
    placement: "bottomRight",
  });
};


// Border helper
const getAllBorders = () => ({
  top: { style: "thin", color: { rgb: "000000" } },
  bottom: { style: "thin", color: { rgb: "000000" } },
  left: { style: "thin", color: { rgb: "000000" } },
  right: { style: "thin", color: { rgb: "000000" } },
});

const handleClearForm = () => {
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
              (Provide customer/agent information)
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
                      required
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
                required 
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
                        <Select.Option value="AED">
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
                        </Select.Option>
                        <Select.Option value="USD">
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
                        </Select.Option>
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

                    {/* <Form.Item
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
                    </Form.Item> */}

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
                          // onClick={() => {
                          //   const values = form.getFieldsValue();
                          //   const isEmpty = Object.values(values).every(
                          //     (value) =>
                          //       value === undefined ||
                          //       value === null ||
                          //       value === "" ||
                          //       (Array.isArray(value) && value.length === 0)
                          //   );

                          //   if (isEmpty) {
                          //     notification.info({
                          //       message: "Nothing to clear",
                          //       description: "All fields are already empty.",
                          //     });
                          //   } else {
                          //     form.resetFields();
                          //     notification.success({
                          //       message: "Success",
                          //       description: "Form cleared successfully!",
                          //     });
                          //   }
                          // }}

                            onClick={handleClearForm}

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
                    {/* <FontAwesomeIcon
                      icon={faUserPlus}
                      size="lg"
                      style={{ color: "#0D3884" }}
                      
                    /> */}
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
                      Manage Customer/Agent Details
                    </div>
                    <div
                      className="m-0 p-0"
                      style={{ fontSize: "14px", color: "#0D3884" }}
                    >
                      Search, view or update customer/agent information
                    </div>
                  </div>
                </div>

                <div className="border border-1"></div>
                                <div className="mt-3 row">

                <div className="mb-3 d-flex gap-2">
                  {/* Search Input */}
                  <Input
                    placeholder="Search customer data"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    suffix={<SearchOutlined />}
                    disabled={loading}
                  />

                  {/* Reset Button */}
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() => {
                      setSearchText("");
                      fetchCustomers();
                      notification.info({
                        message: "Filters Reset",
                        description: "Customer data refreshed.",
                        placement: "bottomRight",
                      });
                    }}
                    disabled={loading}
                    size="large"
                    className="resetButton"
                  >
                    Reset
                  </Button>

                  {/* Export Button */}
                  <Button
                    icon={<ExportOutlined />}
                    onClick={handleExportCustomers}
                    size="large"
                    className="exportButton"
                    disabled={loading}
                  >
                    Export
                  </Button>
                </div>
                </div>

                <Table
                  dataSource={filteredCustomers}
                  columns={customerColumns}
                  bordered
                  loading={fetching}
                  className="mt-3"
                  pagination={{
                    pageSize: 10,
                  }}
                  scroll={{ x: "max-content" }}
                  size="middle"
                  rowKey={(record, idx) => idx}
                />
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
                        View Customer Information
                      </div>
                      <div
                        className="m-0 p-0"
                        style={{ fontSize: "14px", color: "#0D3884" }}
                      >
                        Detailed customer data overview
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
                      <div className="col-lg-6">
                        <Form.Item
                          label="Customer Name"
                          name="viewCustomerName"
                          className="fw-bold"
                        >
                          <Input readOnly />
                        </Form.Item>
                      </div>

                      <div className="col-lg-6">
                        <Form.Item
                          label="Primary Contact"
                          name="viewPrimaryContact"
                          className="fw-bold"
                        >
                          <Input readOnly />
                        </Form.Item>
                      </div>

                      <div className="col-lg-6">
                        <Form.Item
                          label="Contact Person Name"
                          name="viewContactPerson"
                          className="fw-bold"
                        >
                          <Input readOnly />
                        </Form.Item>
                      </div>

                      <div className="col-lg-6">
                        <Form.Item
                          label="Position"
                          name="viewPosition"
                          className="fw-bold"
                        >
                          <Input readOnly />
                        </Form.Item>
                      </div>

                      <div className="col-lg-6">
                        <Form.Item
                          label="Contact Number"
                          name="viewContactNumber"
                          className="fw-bold"
                        >
                          <Input readOnly />
                        </Form.Item>
                      </div>

                      <div className="col-lg-6">
                        <Form.Item
                          label="Contact Email"
                          name="viewEmail"
                          className="fw-bold"
                        >
                          <Input readOnly />
                        </Form.Item>
                      </div>

                      <div className="col-lg-6">
                        <Form.Item
                          label="Customer Email"
                          name="viewCustomerEmail"
                          className="fw-bold"
                        >
                          <Input readOnly />
                        </Form.Item>
                      </div>

                      <div className="col-lg-6">
                        <Form.Item
                          label="Customer Work Phone"
                          name="viewWorkPhone"
                          className="fw-bold"
                        >
                          <Input readOnly />
                        </Form.Item>
                      </div>

                      <div className="col-lg-6">
                        <Form.Item
                          label="Customer Mobile Phone"
                          name="viewMobilePhone"
                          className="fw-bold"
                        >
                          <Input readOnly />
                        </Form.Item>
                      </div>

                      <div className="col-lg-6">
                        <Form.Item
                          label="Customer owner"
                          name="viewOwner"
                          className="fw-bold"
                        >
                          <Input readOnly />
                        </Form.Item>
                      </div>

                      <div className="col-lg-12">
                        <Form.Item
                          label="Address"
                          name="viewAddress"
                          className="fw-bold"
                        >
                          <Input.TextArea readOnly rows={3} />
                        </Form.Item>
                      </div>

                      <div className="col-lg-6">
                        <Form.Item
                          label="VAT / TAX ID"
                          name="viewVAT"
                          className="fw-bold"
                        >
                          <Input readOnly />
                        </Form.Item>
                      </div>

                      {/* <div className="col-lg-6">
                    <Form.Item
                      label="Currency"
                      name="viewCurrency"
                      className="fw-bold"
                    >
                      <Input readOnly />
                    </Form.Item>
                  </div> */}

                      <div className="col-lg-6">
                        <Form.Item
                          label="Currency"
                          name="viewCurrency"
                          className="fw-bold"
                        >
                          <div className="d-flex align-items-center border rounded p-1 fw-normal">
                            {viewForm.getFieldValue("viewCurrency") ===
                              "AED" && (
                              <>
                                <img
                                  src={UAE}
                                  alt="AED Flag"
                                  style={{ width: "30px" }}
                                />
                                <span className="ms-2">
                                  United Arab Emirates - AED (
                                  <img
                                    src={Dirham}
                                    alt="Dirham"
                                    style={{ width: "15px" }}
                                  />
                                  )
                                </span>
                              </>
                            )}

                            {viewForm.getFieldValue("viewCurrency") ===
                              "USD" && (
                              <>
                                <img
                                  src={US}
                                  alt="USD Flag"
                                  style={{ width: "30px" }}
                                />
                                <span className="ms-2">
                                  United States of America - USD ($)
                                </span>
                              </>
                            )}
                          </div>
                        </Form.Item>
                      </div>

                      <div className="col-lg-12">
                        <Form.Item
                          label="Payment Terms"
                          name="viewPaymentTerms"
                          className="fw-bold"
                        >
                          <Input.TextArea readOnly rows={3} />
                        </Form.Item>
                      </div>

                      <div className="col-lg-12">
                        <Form.Item
                          label="Delivery Term"
                          name="viewDeliveryTerm"
                          className="fw-bold"
                        >
                          <Input.TextArea readOnly rows={2} />
                        </Form.Item>
                      </div>

                      <div className="col-lg-6">
                        <Form.Item
                          label="Modified User"
                          name="viewModifiedUser"
                          className="fw-bold"
                        >
                          <Input readOnly />
                        </Form.Item>
                      </div>

                      <div className="col-lg-6">
                        <Form.Item
                          label="Modified Date & Time"
                          name="viewModifiedDate"
                          className="fw-bold"
                        >
                          <Input readOnly />
                        </Form.Item>
                      </div>

                      {/* Close Button */}
                      <div className="col-7 text-center mt-4 mb-3 m-auto">
                        <Button
                          size="large"
                          className="clearButton mt-2 ms-3 text-center"
                          // onClick={() => {
                          //   setIsViewModalVisible(false);
                          //   viewForm.resetFields();
                          // }}

                          onClick={handleCloseViewModal}

                        >
                          Close Form
                        </Button>
                      </div>
                    </div>
                  </Form>
                </Modal>
                {/* ===================== EDIT CUSTOMER MODAL ===================== */}
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
                  {/* Logo */}
                  <div className="col-12 col-lg-8 text-center m-auto">
                    <img
                      src={HaitianLogo}
                      alt="HaitianLogo"
                      className="m-0 p-0"
                      style={{ width: "30%" }}
                    />
                  </div>

                  {/* Header */}
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
                        size="lg"
                        style={{ color: "#0D3884" }}
                      />
                    </div>
                    <div>
                      <div
                        className="fw-bold m-0 p-0"
                        style={{ fontSize: "20px", color: "#0D3884" }}
                      >
                        Edit Customer Information
                      </div>
                      <div
                        className="m-0 p-0"
                        style={{ fontSize: "14px", color: "#0D3884" }}
                      >
                        Update customer details below
                      </div>
                    </div>
                  </div>

                  <div className="border border-1"></div>

                  {/* ===================== EDIT FORM ===================== */}
                  <Form
                    form={editForm}
                    layout="vertical"
                    onFinish={handleEditSubmit}
                    className="mt-3 mt-lg-3"
                  >
                    <div className="row mt-3">
                      {/* Customer Name */}
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

                      {/* Primary Contact */}
                      <Form.Item
                        label="Primary Contact"
                        name="primarycontact"
                        className="fw-bold"
                       required
                      >
                        <div className="row">
                          {/* Salutation */}
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

                          {/* First Name */}
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

                          {/* Last Name */}
                          <div className="col-5">
                            <Form.Item
                              name="lastname"
                              rules={[
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

                      {/* Contact Person Section */}
                      <Form.Item label="Contact Person" className="fw-bold">
                        <div className="row">
                          {/* Contact Salutation */}
                          <div className="col-2">
                            <Form.Item name="contactPersonSalutation">
                              <Select placeholder="Salutation">
                                <Select.Option value="Mr.">Mr.</Select.Option>
                                <Select.Option value="Mrs.">Mrs.</Select.Option>
                              </Select>
                            </Form.Item>
                          </div>

                          {/* First Name */}
                          <div className="col-5">
                            <Form.Item
                              name="contactPersonFirstName"
                              rules={[
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

                          {/* Last Name */}
                          <div className="col-5">
                            <Form.Item
                              name="contactPersonLastName"
                              rules={[
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

                          {/* Position */}
                          <div className="col-4">
                            <Form.Item name="contactPersonPosition">
                              <Input placeholder="Enter Position" />
                            </Form.Item>
                          </div>

                          {/* Number */}
                          <div className="col-4">
                            <Form.Item
                              name="contactPersonNumber"
                              rules={[
                                {
                                  pattern: /^[0-9\s-]+$/,
                                  message:
                                    "Contact number should not contain letters",
                                },
                              ]}
                            >
                              <Input placeholder="Enter Contact Number" />
                            </Form.Item>
                          </div>

                          {/* Email */}
                          <div className="col-4">
                            <Form.Item
                              name="contactPersonEmail"
                              rules={[
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

                      {/* Customer Owner */}
                      <Form.Item
                        label="Customer Owner"
                        name="customerOwner"
                        className="fw-bold"
                        rules={[
                          {
                            required: true,
                            message: "Please enter customer owner!",
                          },
                        ]}
                      >
                        <AutoComplete
                          allowClear
                          showSearch
                          placeholder="Type or select owner"
                          options={ownerOptions.map((o) => ({
                            label: o,
                            value: o,
                          }))}
                        />
                      </Form.Item>

                      {/* Customer Email */}
                      <Form.Item
                        label="Customer Email"
                        name="customerEmail"
                        className="fw-bold"
                        rules={[
                          {
                            required: true,
                            message: "Customer email is required!",
                          },
                          {
                            validator: (_, value) => {
                              if (!value) return Promise.resolve();
                              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                              return emailRegex.test(value)
                                ? Promise.resolve()
                                : Promise.reject("Enter valid email");
                            },
                          },
                        ]}
                      >
                        <Input placeholder="Enter Customer Email" />
                      </Form.Item>

                      {/* Customer Phone */}
                      <Form.Item label="Customer Phone" name="customerPhone"
                       className="fw-bold"
                  required
                      >
                        <div className="row">
                          {/* Work Phone */}
                          <div className="col-6">
                            <Form.Item
                              name="workPhoneNumber"
                              rules={[
                                {
                                  pattern: /^[0-9\s-]+$/,
                                  message: "Work number cannot contain letters",
                                },
                              ]}
                            >
                              <Input placeholder="Enter Work Phone Number" />
                            </Form.Item>
                          </div>

                          {/* Mobile Phone */}
                          <div className="col-6">
                            <Form.Item
                              name="mobileNumber"
                              rules={[
                                {
                                  required: true,
                                  message: "Enter customer mobile number!",
                                },
                                {
                                  pattern: /^[0-9\s-]+$/,
                                  message:
                                    "Mobile number cannot contain letters",
                                },
                              ]}
                            >
                              <Input placeholder="Enter Mobile Number" />
                            </Form.Item>
                          </div>
                        </div>
                      </Form.Item>

                      {/* Address */}
                      <Form.Item
                        label="Address"
                        name="address"
                        className="fw-bold"
                        rules={[
                          { required: true, message: "Please enter address!" },
                        ]}
                      >
                        <Input.TextArea rows={6} placeholder="Enter Address" />
                      </Form.Item>

                      {/* VAT */}
                      <Form.Item
                        label="VAT/TAX ID"
                        name="vataxId"
                        className="fw-bold"
                        rules={[
                          {
                            required: true,
                            message: "Please enter VAT/TAX ID!",
                          },
                        ]}
                      >
                        <Input placeholder="Enter VAT/TAX ID" />
                      </Form.Item>

                      {/* Currency */}
                      {/* <Form.Item
        label="Currency"
        name="currency"
        className="fw-bold"
        rules={[{ required: true, message: "Select currency!" }]}
      >
        <Select placeholder="Select Currency">
          <Select.Option value="AED">AED</Select.Option>
          <Select.Option value="USD">USD</Select.Option>
        </Select>
      </Form.Item> */}

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
                          <Select.Option value="AED">
                            <div className="d-flex align-items-center">
                              <img
                                src={UAE}
                                alt="UAE Flag"
                                style={{ width: "30px" }}
                              />
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
                          </Select.Option>

                          <Select.Option value="USD">
                            <div className="d-flex align-items-center">
                              <img
                                src={US}
                                alt="US Flag"
                                style={{ width: "30px" }}
                              />
                              <span className="ms-1">
                                United States Of America - USD (
                                <span className="fw-bold">$</span>)
                              </span>
                            </div>
                          </Select.Option>
                        </Select>
                      </Form.Item>

                      {/* Payment Terms */}
                      <Form.Item
                        label="Payment Terms"
                        name="paymentTerms"
                        className="fw-bold"
                        rules={[
                          {
                            required: true,
                            message: "Please enter payment terms!",
                          },
                        ]}
                      >
                        <Select placeholder="Select Payment Terms">
                          <Select.Option value="30% as an advance, Balance 70% before the Shipment">
                            30% as an advance, Balance 70% before the Shipment
                          </Select.Option>
                          <Select.Option value="40% as an advance, Balance 60% before the Shipment">
                            40% as an advance, Balance 60% before the Shipment
                          </Select.Option>
                          <Select.Option value="50% as an advance, Balance 50% before the Shipment">
                            50% as an advance, Balance 50% before the Shipment
                          </Select.Option>
                          <Select.Option value="100% advance">
                            100% advance
                          </Select.Option>
                        </Select>
                      </Form.Item>

                      {/* Delivery Terms */}
                      <Form.Item
                        label="Delivery Terms"
                        name="deliveryTerms"
                        className="fw-bold"
                        rules={[
                          { required: true, message: "Enter delivery terms!" },
                        ]}
                      >
                        <Select placeholder="Select Delivery Terms">
                          <Select.Option value="Ex-works Ningbo">
                            Ex-works Ningbo
                          </Select.Option>
                          <Select.Option value="FOB Ningbo">
                            FOB Ningbo
                          </Select.Option>
                          <Select.Option value="CIF Jebel Ali">
                            CIF Jebel Ali
                          </Select.Option>
                          <Select.Option value="Ex-works Hamriyah freezone">
                            Ex-works Hamriyah freezone
                          </Select.Option>
                        </Select>
                      </Form.Item>

                      {/* Buttons */}
                      <div className="col-7 text-center mt-5 pt-3 mb-3 d-flex m-auto">
                        <Button
                          htmlType="submit"
                          size="large"
                          className="submitButton mt-2"
                          loading={editLoading}
                        >
                          {editLoading ? "Updating Customer…" : "Update Customer"}
                        </Button>

                        <Button
                          htmlType="button"
                          size="large"
                          className="clearButton mt-2 ms-3"
                          // onClick={() => {
                          //   editForm.resetFields();
                          //   setIsEditModalVisible(false);
                          // }}
                          onClick={handleEditViewModal}

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
