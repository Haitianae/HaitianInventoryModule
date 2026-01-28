import React, { useEffect, useState } from "react";
import "antd/dist/reset.css";
import { Button, Form, Input, Table, Tooltip, Modal, Tag, Select } from "antd";
import { notification } from "antd";
// import HaitianLogo from "../Images/HaitianLogo.jpeg";
import "../App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faEye } from "@fortawesome/free-solid-svg-icons";
import HaitianLogo from "../Images/Haitian.png";
import XLSX from "xlsx-js-style";
import dayjs from "dayjs";

export default function Inventory({ user }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tableDataSource, setTableDataSource] = useState();
  const access = user?.access?.["Inventory"] || "No Access";
  const readOnly = access === "Read";
  const canWrite = access === "Read/Write" || access === "Full Control";
  const isFullControl = access === "Full Control";
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [viewRecord, setViewRecord] = useState(null);
  const [viewForm] = Form.useForm();

 
  const baseColumns = [
    {
      title: "Serial Number",
      dataIndex: "serialNumber",
      key: "serial",
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },

    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Part Number",
      dataIndex: "partNumber",
      key: "partNumber",
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        const qty = Number(record.quantity) || 0;
        let status = "In Stock";
        let color = "green";

        if (qty === 0) {
          status = "Out of Stock";
          color = "red";
        } else if (qty < 5) {
          status = "Low Stock";
          color = "orange";
        }

        return (
          <Tag color={color} className="tag-large">
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Category",
      dataIndex: "Category",
      key: "Category",
      render: (text) => (
        <Tooltip title={text || "Unknown"}>
          <span>{text || "Unknown"}</span>
        </Tooltip>
      ),
    },
    {
      title: "Location",
      dataIndex: "Location",
      key: "location",
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Weight",
      dataIndex: "weight",
      key: "weight",
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
   
  ];

  // extra columns only visible to Full Control
  const adminColumns = [
    // {
    //   title: "Total Price in AED",
    //   dataIndex: "totalPrice",
    //   key: "totalPrice",
    //   render: (text) => (
    //     <Tooltip title={text}>
    //       <span>{text}</span>
    //     </Tooltip>
    //   ),
    // },
    {
      title: "Total Price in AED",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text) => {
        const value = Number(text);
        const formatted = isNaN(value) ? text : value.toFixed(2);
        return (
          <Tooltip title={formatted}>
            <span>{formatted}</span>
          </Tooltip>
        );
      },
    },
    // {
    //   title: "Purchase Cost (per item)",
    //   dataIndex: "purchaseCost",
    //   key: "purchaseCost",
    //   render: (text) => (
    //     <Tooltip title={text}>
    //       <span>{text}</span>
    //     </Tooltip>
    //   ),
    // },
    // {
    //   title: "Add On Cost",
    //   dataIndex: "addOnCost",
    //   key: "addOnCost",
    //   render: (text) => (
    //     <Tooltip title={text}>
    //       <span>{text}</span>
    //     </Tooltip>
    //   ),
    // },
    // {
    //   title: "Selling Cost",
    //   dataIndex: "sellingCost",
    //   key: "sellingCost",
    //   render: (text) => (
    //     <Tooltip title={text}>
    //       <span>{text}</span>
    //     </Tooltip>
    //   ),
    // },
  ];

  const actionColumn = {
    title: "Action",
    key: "action",
    width: 120,
    align: "center",
    fixed: "right",
    render: (_, record) => (
      <Button
        className="addButton"
        onClick={() => {
          const formattedRecord = {
            ...record,
            totalPrice: Number(record.totalPrice).toFixed(2),
            // purchaseCost: Number(record.purchaseCost).toFixed(2),
            // addOnCost: Number(record.addOnCost).toFixed(2),
            // sellingCost: Number(record.sellingCost).toFixed(2),
          };

          setViewRecord(formattedRecord);
          viewForm.setFieldsValue(formattedRecord);
          setIsViewModalVisible(true);
        }}
      >
        View
      </Button>
    ),
  };

  // merge based on access
  const columns = isFullControl
    ? [...baseColumns, ...adminColumns]
    : baseColumns;
  const finalColumns = [...columns, actionColumn];

  const columnMapping = {
    "Serial Number": "serialNumber",
    "Part Number": "partNumber",
    Name: "name",
    Description: "description",
    Quantity: "quantity",
    Unit: "unit",
    Location: "Location",
    Weight: "weight",
    Note: "note",
    "Total Price in AED": "totalPrice",
    "Purchase Cost(per item)": "purchaseCost",
    "Add On Cost": "addOnCost",
    "Selling Cost": "sellingCost",
  };

  const fetchInventory = async (values = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        action: "getInventory",
        partNumber: values.partNumber || "",
        name: values.name || "", 
        description: values.description || "",
        location: values.location || "",
      });

      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbyOlAW6b-qj4DHTi-KwFvptA11l7bjk_zH2d60axURNPTnWKioXwBW2jvQHMlZ5q6Ow/exec",
        {
          method: "POST",
          body: params,
        }
      );

      const data = await res.json();

      // if (data.success) {
      //   setTableDataSource(data.data);
      // } else {
      //   notification.error({ message: "Error", description: data.message });
      // }

      if (data.success) {
        // console.log("🟢 Inventory rows from backend:", data.data);

        const normalizedData = data.data.map((item, idx) => {
          const normalizedItem = { key: idx };
          Object.keys(item).forEach((header) => {
            const newKey = columnMapping[header] || header; // map if exists, else keep original
            // normalizedItem[newKey] = item[header];
            let value = item[header];

            if (typeof value === "number") {
              value = parseFloat(value.toFixed(2));
            }

            // save normalized
            normalizedItem[newKey] = value;
          });
          return normalizedItem;
        });
        setTableDataSource(normalizedData);
      } else {
        notification.error({ message: "Error", description: data.message });
      }
    } catch (err) {
      notification.error({ message: "Error", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const values = form.getFieldsValue();
    fetchInventory(values);
  };

  const handleExportInventory = () => {
    if (!tableDataSource || tableDataSource.length === 0) {
      notification.warning({
        message: "Export Failed",
        description: "No inventory data available to export.",
        placement: "bottomRight",
      });
      return;
    }

    const now = dayjs().format("DD-MM-YYYY_HH-mm-ss");
    const fileName = `Inventory_Report_${now}.xlsx`;

    const headerStyle = {
      font: { bold: true, sz: 12 },
      alignment: { horizontal: "left", vertical: "center", wrapText: true },
      border: getAllBorders(),
      fill: { patternType: "solid", fgColor: { rgb: "FFFF00" } },
    };

    const headers = [
      { v: "Serial Number", s: headerStyle },
      { v: "Name", s: headerStyle },
      { v: "Description", s: headerStyle },
      { v: "Part Number", s: headerStyle },

      { v: "Quantity", s: headerStyle },
      { v: "Unit", s: headerStyle },
      { v: "Status", s: headerStyle },

      { v: "Category", s: headerStyle },
      { v: "Location", s: headerStyle },
      { v: "Weight", s: headerStyle },
      { v: "Note", s: headerStyle },

      ...(isFullControl ? [{ v: "Total Price in AED", s: headerStyle }] : []),
      // ...(isFullControl
      //   ? [{ v: "Purchase Cost (per item)", s: headerStyle }]
      //   : []),
      // ...(isFullControl ? [{ v: "Add On Cost", s: headerStyle }] : []),
      // ...(isFullControl ? [{ v: "Selling Cost", s: headerStyle }] : []),
    ];

    const data = tableDataSource.map((row) => {
      const qty = Number(row.quantity);
      let status = "In Stock";
      if (qty === 0) status = "Out of Stock";
      else if (qty < 5) status = "Low Stock";

      const rowData = [
        { v: row.serialNumber || "-", s: { border: getAllBorders() } },
        { v: row.name || "-", s: { border: getAllBorders() } },
        { v: row.description || "-", s: { border: getAllBorders() } },
        { v: row.partNumber || "-", s: { border: getAllBorders() } },
        { v: row.quantity ?? 0, s: { border: getAllBorders() } },
        { v: row.unit || "-", s: { border: getAllBorders() } },
        { v: status, s: { border: getAllBorders() } },

        { v: row.Category || "-", s: { border: getAllBorders() } },
      ];

      // rowData.push({ v: status, s: { border: getAllBorders() } });
      rowData.push(
        { v: row.Location || "-", s: { border: getAllBorders() } },

        { v: row.weight || "-", s: { border: getAllBorders() } },
        { v: row.note || "-", s: { border: getAllBorders() } }
      );

      if (isFullControl) {
        rowData.push(
          {
            v: row.totalPrice ? Number(row.totalPrice).toFixed(2) : "-",
            s: { border: getAllBorders() },
          }
          // { v: row.purchaseCost || "-", s: { border: getAllBorders() } },
          // { v: row.addOnCost || "-", s: { border: getAllBorders() } },
          // { v: row.sellingCost || "-", s: { border: getAllBorders() } }
        );
      }

      return rowData;
    });

    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);

    // Auto column width
    const colWidths = headers.map((_, colIndex) => {
      let maxLength = 0;
      [headers, ...data].forEach((row) => {
        const cell = row[colIndex];
        const value = cell?.v ? String(cell.v) : "";
        maxLength = Math.max(maxLength, value.length);
      });
      return { wch: Math.min(maxLength * 1.8, 60) };
    });

    ws["!cols"] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventory Report");

    XLSX.writeFile(wb, fileName);

    notification.success({
      message: "Export Successful",
      description: "Inventory Excel report downloaded.",
      placement: "bottomRight",
    });
  };

  const getAllBorders = () => ({
    top: { style: "thin", color: { rgb: "000000" } },
    bottom: { style: "thin", color: { rgb: "000000" } },
    left: { style: "thin", color: { rgb: "000000" } },
    right: { style: "thin", color: { rgb: "000000" } },
  });

  useEffect(() => {
    fetchInventory(); // initial load
  }, []);

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
    background-color: #0D3883;
    border-radius: 6px;
      border: 2px solid rgba(137, 137, 137, 0.87);
    box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
    box-sizing: border-box;
}
    .ant-table-wrapper .ant-table-thead >tr>th, .ant-table-wrapper .ant-table-thead >tr>td {
    position: relative;
    color: #0d3884 !important;
    font-weight: 600;
    text-align: start;
    background-color: #E8F0FE;
    border-bottom: 1px solid #f0f0f0;
    transition: background 0.2s ease;
  
}   
      .ant-modal-root .ant-modal {
    width: var(--ant-modal-xs-width);
    width: 100% !important;
  
  `;

  if (access === "No Access") {
    return <h2 style={{ padding: 20 }}>You do not have access to Inventory</h2>;
  }

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
              Inventory
            </h1>
            <p
              className="text-center m-0 p-0 haitianInventoryDescriptionText"
              style={{ color: "#0D3884" }}
            >
              (Consolidated data of overall inventory items)
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
                    {/* <FontAwesomeIcon
                      icon={faUserPlus}
                      size="lg"
                      style={{ color: "#0D3884" }}
                      
                    /> */}
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      size="lg"
                      style={{ color: "#0D3884" }}
                    />
                  </div>
                  <div>
                    <div
                      className="fw-bold m-0 p-0"
                      style={{ fontSize: "20px", color: "#0D3884" }}
                    >
                      Search Inventory Items
                    </div>
                    <div
                      className="m-0 p-0"
                      style={{ fontSize: "14px", color: "#0D3884" }}
                    >
                      Search item in the inventory by part number, description, name or location
                    </div>
                  </div>
                </div>

                <div className="border border-1"></div>

                <Form form={form} layout="vertical" className="mt-2">
                  <Form.Item
                    label={
                      <span style={{ color: "#0D3884", fontWeight: "bold" }}>
                        Part Number
                      </span>
                    }
                    name="partNumber"
                  >
                    <Input placeholder="Enter part number" />
                  </Form.Item>

                  <Form.Item
                    label={
                      <span style={{ color: "#0D3884", fontWeight: "bold" }}>
                        Description
                      </span>
                    }
                    name="description"
                  >
                    <Input placeholder="Enter description" />
                  </Form.Item>

                     <Form.Item
                    label={
                      <span style={{ color: "#0D3884", fontWeight: "bold" }}>
                        Name
                      </span>
                    }
                    name="name"
                  >
                    <Input placeholder="Enter name" />
                  </Form.Item>

                  <Form.Item
                    label={
                      <span style={{ color: "#0D3884", fontWeight: "bold" }}>
                        Location
                      </span>
                    }
                    name="location"
                  >
                    <Select
                      allowClear
                      placeholder="Select location"
                      style={{ width: "100%" }}
                      options={[
                        { label: "AE", value: "AE" },
                        { label: "MEA", value: "MEA" },
                      ]}
                    />
                  </Form.Item>

                  <div
                    style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}
                    className="col-8 m-auto"
                  >
                    <Button
                      type="primary"
                      size="large"
                      className="submitButton"
                      onClick={handleSearch}
                    >
                      Search Inventory Data
                    </Button>

                    <Button
                      size="large"
                      className="clearButton"
                      onClick={() => {
                        form.resetFields();
                        fetchInventory();
                      }}
                    >
                      Clear / Refresh
                    </Button>

                    {isFullControl && (
                      <Button
                        size="large"
                        className="submitButton"
                        onClick={handleExportInventory}
                      >
                        Export Inventory Data
                      </Button>
                    )}
                  </div>
                </Form>

                <Table
                  className="mt-5"
                  columns={finalColumns}
                  dataSource={tableDataSource}
                  pagination={{
                    pageSize: 10,
                  }}
                  scroll={{ x: "max-content" }}
                  size="middle"
                  bordered
                  loading={loading}
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
                        View Inventory Item
                      </div>
                      <div
                        className="m-0 p-0"
                        style={{ fontSize: "14px", color: "#0D3884" }}
                      >
                        Details of the selected inventory record
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
                      {/* Base fields */}
                      <div className="col-12">
                        <Form.Item
                          label="Serial Number"
                          name="serialNumber"
                          className="fw-bold"
                        >
                          <Input readOnly />
                        </Form.Item>
                      </div>
                      <div className="col-12">
                        <Form.Item
                          label="Location"
                          name="Location"
                          className="fw-bold"
                        >
                          <Input readOnly />
                        </Form.Item>
                      </div>

                      <div className="col-12">
                        <Form.Item
                          label="Part Number"
                          name="partNumber"
                          className="fw-bold"
                        >
                          <Input readOnly />
                        </Form.Item>
                      </div>

                      <div className="col-12">
                        <Form.Item label="Name" name="name" className="fw-bold">
                          <Input readOnly />
                        </Form.Item>
                      </div>
                      <div className="col-12">
                        <Form.Item
                          label="Description"
                          name="description"
                          className="fw-bold"
                        >
                          <Input.TextArea readOnly />
                        </Form.Item>
                      </div>
                      <div className="col-12">
                        <Form.Item
                          label="Quantity"
                          name="quantity"
                          className="fw-bold"
                        >
                          <Input readOnly />
                        </Form.Item>
                      </div>
                      <div className="col-12">
                        <Form.Item label="Unit" name="unit" className="fw-bold">
                          <Input readOnly />
                        </Form.Item>
                      </div>

                      <div className="col-12">
                        <Form.Item
                          label="Weight"
                          name="weight"
                          className="fw-bold"
                        >
                          <Input readOnly />
                        </Form.Item>
                      </div>

                      <div className="col-12">
                        <Form.Item label="Note" name="note" className="fw-bold">
                          <Input readOnly />
                        </Form.Item>
                      </div>

                      {/* Admin-only fields */}
                      {isFullControl && (
                        <>
                          <div className="col-12">
                            <Form.Item
                              label="Total Price in AED"
                              name="totalPrice"
                              className="fw-bold"
                            >
                              <Input readOnly />
                            </Form.Item>
                          </div>
                          {/* <div className="col-12">
                            <Form.Item
                              label="Purchase Cost (per item)"
                              name="purchaseCost"
                              className="fw-bold"
                            >
                              <Input readOnly />
                            </Form.Item>
                          </div> */}
                          {/* <div className="col-12">
                            <Form.Item
                              label="Add On Cost"
                              name="addOnCost"
                              className="fw-bold"
                            >
                              <Input readOnly />
                            </Form.Item>
                          </div> */}
                          {/* <div className="col-12">
                            <Form.Item
                              label="Selling Cost"
                              name="sellingCost"
                              className="fw-bold"
                            >
                              <Input readOnly />
                            </Form.Item>
                          </div> */}
                        </>
                      )}

                      {/* Close Button */}
                      <div className="col-7 text-center mt-4 mb-3 m-auto">
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
