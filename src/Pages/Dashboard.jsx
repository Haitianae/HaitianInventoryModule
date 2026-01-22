import React, { useEffect, useState } from "react";
import "antd/dist/reset.css";
import { Button, Form, Input, Table, Tooltip, Modal, Select, Tag } from "antd";
import HaitianMachine from "../Images/HaitianMachine.png";
import { notification } from "antd";
// import HaitianLogo from "../Images/HaitianLogo.jpeg";
import "../App.css";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faEye,
  faChartPie,
  faTable,
  faChartSimple,
} from "@fortawesome/free-solid-svg-icons";
import HaitianLogo from "../Images/Haitian.png";
import { Cell, Pie, PieChart, ResponsiveContainer, Legend } from "recharts";
import XLSX from "xlsx-js-style";
import dayjs from "dayjs";

export default function Dashboard({ user }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tableDataSource, setTableDataSource] = useState([]);
  const access = user?.access?.["Dashboard"] || "No Access";
  const readOnly = access === "Read";
  const canWrite = access === "Read/Write" || access === "Full Control";
  const isFullControl = access === "Full Control";
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [fullInventoryData, setFullInventoryData] = useState([]);
  const [filteredInventoryData, setFilteredInventoryData] = useState([]);
  const [viewRecord, setViewRecord] = useState(null);
  const [viewForm] = Form.useForm();
  const { Option } = Select;
  const getPaddingAngle = (data) => {
    if (!data || data.length === 0) return 0;

    const total = data.reduce((sum, d) => sum + d.value, 0);
    const percentages = data.map((d) => d.value / total);

    const minPercent = Math.min(...percentages);

    // Adjust padding based on smallest slice
    if (minPercent < 0.03) return 7; // Very small slice, lots of padding
    if (minPercent < 0.1) return 3; // Small slice, medium padding
    if (minPercent < 0.2) return 2; // Medium slice, little padding
    return 1; // Large slices, minimal padding
  };

  const [summary, setSummary] = useState({
    totalItems: 0,
    totalValue: 0,
    lowStock: 0,
    outOfStock: 0,
  });
  const GAS_URL =
    "https://script.google.com/macros/s/AKfycbzOgoJJ-w_yTXM7FIgEbYktTHXY_ziMpdm57-01GY7te4PGPWuekqQTToE86GzCck6P/exec";
    
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
      width: 120,
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

    // {
    //   title: "Status",
    //   key: "status",
    //   render: (_, record) => {
    //     const qty = Number(record.quantity) || 0;
    //     let status = "In Stock";

    //     if (qty === 0) status = "Out of Stock";
    //     else if (qty < 5) status = "Low Stock";

    //     return (
    //       <Tooltip title={status}>
    //         <span>{status}</span>
    //       </Tooltip>
    //     );
    //   },
    // },
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
      dataIndex: "location",
      key: "location",
      width: 120,
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
      width: 120,
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
      width: 120,
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
  ];

  // extra columns only visible to Full Control
  const adminColumns = [
    {
      title: "Total Price in AED",
      dataIndex: "totalPrice",
      key: "totalPrice",
      // render: (text) => (
      //   <Tooltip title={text}>
      //     <span>{text}</span>
      //   </Tooltip>
      // ),
      render: (text) => {
        const formatted = Number(text).toFixed(2);
        return (
          <Tooltip title={formatted}>
            <span>{formatted}</span>
          </Tooltip>
        );
      },
    },
    //   {
    //     title: "Purchase Cost (per item)",
    //     dataIndex: "purchaseCost",
    //     key: "purchaseCost",
    //     render: (text) => (
    //       <Tooltip title={text}>
    //         <span>{text}</span>
    //       </Tooltip>
    //     ),
    //   },
    //   {
    //     title: "Add On Cost",
    //     dataIndex: "addOnCost",
    //     key: "addOnCost",
    //     render: (text) => (
    //       <Tooltip title={text}>
    //         <span>{text}</span>
    //       </Tooltip>
    //     ),
    //   },
    //   {
    //     title: "Selling Cost",
    //     dataIndex: "sellingCost",
    //     key: "sellingCost",
    //     render: (text) => (
    //       <Tooltip title={text}>
    //         <span>{text}</span>
    //       </Tooltip>
    //     ),
    //   },
  ];

  const actionColumn = {
    //   title: "Action",
    //   key: "action",
    //     width: 120,
    //     align: "center",
    //      fixed: "right",
    //   render: (_, record) => (
    //     <Button
    //       className="addButton"
    //       onClick={() => {
    //         setViewRecord(record);
    //         viewForm.setFieldsValue(record); // ✅ preload record into form
    //         setIsViewModalVisible(true);
    //       }}
    //     >
    //       View
    //     </Button>
    //   ),
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
    Location: "location",
    Description: "description",
    Quantity: "quantity",
    Unit: "unit",
    Weight: "weight",
    Note: "note",
    "Total Price in AED": "totalPrice",
    "Purchase Cost(per item)": "purchaseCost",
    "Add On Cost": "addOnCost",
    "Selling Cost": "sellingCost",
  };
  const fetchSummary = async () => {
    try {
      const params = new URLSearchParams({ action: "getInventorySummary" });
      const res = await fetch(GAS_URL, { method: "POST", body: params });
      const data = await res.json();
      if (data.success) setSummary(data.summary);
    } catch (err) {
      // console.error("Error fetching summary:", err);
    }
  };
  // const fetchInventory = async (values = {}) => {
  //   try {
  //     setLoading(true);
  //     const params = new URLSearchParams({
  //       action: "getInventory",
  //       partNumber: values.partNumber || "",
  //       description: values.description || "",
  //     });

  //     const res = await fetch(GAS_URL, {
  //       method: "POST",
  //       body: params,
  //     });

  //     const data = await res.json();
  //     // if (data.success) {
  //     //   setTableDataSource(data.data);
  //     // } else {
  //     //   notification.error({ message: "Error", description: data.message });
  //     // }

  //     if (data.success) {
  //       const normalizedData = data.data.map((item, idx) => {
  //         const normalizedItem = { key: idx };

  //         Object.keys(item).forEach((header) => {
  //           const newKey = columnMapping[header] || header;
  //           normalizedItem[newKey] = item[header];
  //         });

  //         // ✅ Normalize and clean data
  //         normalizedItem.Category = String(
  //           normalizedItem.Category || normalizedItem.category || "Unknown"
  //         )
  //           .trim()
  //           .replace(/\s+/g, " "); // collapse extra spaces

  //         normalizedItem.quantity = Number(normalizedItem.quantity) || 0;
  //         normalizedItem.totalPrice =
  //           parseFloat(normalizedItem.totalPrice) || 0;

  //         return normalizedItem;
  //       });

  //       console.log("Normalized data:", normalizedData);
  //       setFullInventoryData(normalizedData);
  //       setTableDataSource(normalizedData);
  //       setFilteredInventoryData(normalizedData); // ✅ Table uses this
  //     } else {
  //       notification.error({ message: "Error", description: data.message });
  //     }
  //   } catch (err) {
  //     notification.error({ message: "Error", description: err.message });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // ✅ Declare controller outside so the previous request can be cancelled
  let inventoryRequestController = null;

  const fetchInventory = async (values = {}) => {
    // ✅ Cancel previous request if still pending
    if (inventoryRequestController) {
      inventoryRequestController.abort();
    }

    // ✅ Create a new controller for this request
    inventoryRequestController = new AbortController();

    try {
      setLoading(true);

      const params = new URLSearchParams({
        action: "getInventory",
        partNumber: values.partNumber || "",
        description: values.description || "",
        location: values.location || "",
        name: values.name || "",
      });

      const res = await fetch(GAS_URL, {
        method: "POST",
        body: params,
        signal: inventoryRequestController.signal,
      });

      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}`);
      }

      const data = await res.json();

      if (!data.success || !Array.isArray(data.data)) {
        throw new Error("Invalid API response format");
      }

      // ✅ YOUR EXISTING DATA NORMALIZATION LOGIC (kept the same)
      const normalizedData = data.data.map((item, idx) => {
        const normalizedItem = { key: idx };

        Object.keys(item).forEach((header) => {
          const newKey = columnMapping[header] || header;
          normalizedItem[newKey] = item[header];
        });

        normalizedItem.Category = String(
          normalizedItem.Category || normalizedItem.category || "Unknown"
        )
          .trim()
          .replace(/\s+/g, " ");

        normalizedItem.quantity = Number(normalizedItem.quantity) || 0;
        // normalizedItem.totalPrice = parseFloat(normalizedItem.totalPrice) || 0;
        normalizedItem.totalPrice = normalizedItem.totalPrice
          ? parseFloat(Number(normalizedItem.totalPrice).toFixed(2))
          : 0;

        return normalizedItem;
      });

      setFullInventoryData(normalizedData);
      setTableDataSource(normalizedData);
      setFilteredInventoryData(normalizedData);
    } catch (err) {
      if (err.name !== "AbortError") {
        notification.error({ message: "Error", description: err.message });
      }
    } finally {
      setLoading(false);
    }
  };

  // const handleSearch = () => {
  //   const values = form.getFieldsValue();
  //   fetchInventory(values);
  // };

  const handleSearch = () => {
    const values = form.getFieldsValue();

    // Always start from full data
    let filtered = fullInventoryData.map((item) => ({
      ...item,
      partNumber: String(item.partNumber || ""),
      description: String(item.description || ""),
      name: String(item.name || ""),
      Category: String(item.Category || "Unknown").trim(),
      quantity: Number(item.quantity) || 0,
      location: String(item.location || ""),
    }));

    // Text filters
    if (values.partNumber) {
      const partFilter = values.partNumber.toLowerCase();
      filtered = filtered.filter((item) =>
        item.partNumber.toLowerCase().includes(partFilter)
      );
    }

    if (values.description) {
      const descFilter = values.description.toLowerCase();
      filtered = filtered.filter((item) =>
        item.description.toLowerCase().includes(descFilter)
      );
    }
    if (values.name) {
      const nameFilter = values.name.toLowerCase();

      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(nameFilter)
      );
    }
    if (values.location) {
      filtered = filtered.filter(
        (item) => item.location.toLowerCase() === values.location.toLowerCase()
      );
    }

    // Stock status filter
    if (values.stockStatus && values.stockStatus !== "all") {
      filtered = filtered.filter((item) => {
        const qty = item.quantity;
        if (values.stockStatus === "low") return qty > 0 && qty < 5;
        if (values.stockStatus === "out") return qty === 0;
        return true;
      });
    }

    setFilteredInventoryData(filtered);
  };

  // const handleExportInventory = () => {
  //   if (!filteredInventoryData || filteredInventoryData.length === 0) {
  //     notification.warning({
  //       message: "Export Failed",
  //       description: "No inventory data available to export.",
  //       placement: "bottomRight",
  //     });
  //     return;
  //   }

  //   const now = dayjs().format("DD-MM-YYYY_HH-mm-ss");
  //   const fileName = `Inventory_Report_${now}.xlsx`;

  //   // Header style
  //   const headerStyle = {
  //     font: { bold: true, sz: 12 },
  //     alignment: { horizontal: "left", vertical: "center", wrapText: true },
  //     border: getAllBorders(),
  //     fill: { patternType: "solid", fgColor: { rgb: "FFFF00" } },
  //   };

  //   const header = [
  //     { v: "Serial Number", t: "s", s: headerStyle },
  //     { v: "Location", t: "s", s: headerStyle },
  //     { v: "Part Number", t: "s", s: headerStyle },
  //     { v: "Description", t: "s", s: headerStyle },
  //     { v: "Quantity", t: "s", s: headerStyle },
  //     { v: "Unit", t: "s", s: headerStyle },
  //     { v: "Category", t: "s", s: headerStyle },
  //     { v: "Status", t: "s", s: headerStyle },
  //   ];

  //   const data = filteredInventoryData.map((row) => {
  //     const qty = Number(row.quantity);
  //     let status = "In Stock";
  //     if (qty === 0) status = "Out of Stock";
  //     else if (qty < 5) status = "Low Stock";

  //     return [
  //       { v: row.serialNumber, s: { border: getAllBorders() } },
  //       { v: row.location || "-", s: { border: getAllBorders() } },
  //       { v: row.partNumber || "-", s: { border: getAllBorders() } },
  //       { v: row.description || "-", s: { border: getAllBorders() } },
  //       { v: row.quantity ?? 0, s: { border: getAllBorders() } },
  //       { v: row.unit || "-", s: { border: getAllBorders() } },
  //       { v: row.Category || "-", s: { border: getAllBorders() } },
  //       { v: status, s: { border: getAllBorders() } },
  //     ];
  //   });

  //   // Create sheet
  //   const ws = XLSX.utils.aoa_to_sheet([header, ...data]);

  //   // Auto column width
  //   const colWidths = header.map((_, colIndex) => {
  //     let maxLength = 0;
  //     [header, ...data].forEach((row) => {
  //       const cell = row[colIndex];
  //       const value = cell?.v ? String(cell.v) : "";
  //       maxLength = Math.max(maxLength, value.length);
  //     });
  //     return { wch: Math.min(maxLength * 1.8, 60) };
  //   });

  //   ws["!cols"] = colWidths;

  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Inventory");

  //   XLSX.writeFile(wb, fileName);

  //   notification.success({
  //     message: "Export Successful",
  //     description: "Inventory report downloaded successfully.",
  //     placement: "bottomRight",
  //   });
  // };

  const handleExportInventory = () => {
    if (!filteredInventoryData || filteredInventoryData.length === 0) {
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

    // ✅ HEADER (conditionally add Total Price)
    const header = [
      { v: "Serial Number", t: "s", s: headerStyle },
      { v: "Name", t: "s", s: headerStyle },
      { v: "Description", t: "s", s: headerStyle },
      { v: "Part Number", t: "s", s: headerStyle },
      { v: "Quantity", t: "s", s: headerStyle },
      { v: "Unit", t: "s", s: headerStyle },
      { v: "Status", t: "s", s: headerStyle },
      { v: "Category", t: "s", s: headerStyle },
      { v: "Location", t: "s", s: headerStyle },
      { v: "Weight", t: "s", s: headerStyle },
      { v: "Note", t: "s", s: headerStyle },
      ...(isFullControl
        ? [{ v: "Total Price (AED)", t: "s", s: headerStyle }]
        : []),
    ];

    // ✅ DATA ROWS (conditionally add totalPrice)
    const data = filteredInventoryData.map((row) => {
      const qty = Number(row.quantity);
      let status = "In Stock";

      if (qty === 0) status = "Out of Stock";
      else if (qty < 5) status = "Low Stock";

      const baseRow = [
        { v: row.serialNumber || "-", s: { border: getAllBorders() } },
        { v: row.name || "-", s: { border: getAllBorders() } },
        { v: row.description || "-", s: { border: getAllBorders() } },
        { v: row.partNumber || "-", s: { border: getAllBorders() } },
        { v: row.quantity ?? 0, s: { border: getAllBorders() } },
        { v: row.unit || "-", s: { border: getAllBorders() } },
        { v: status, s: { border: getAllBorders() } },
        { v: row.Category || "-", s: { border: getAllBorders() } },
        { v: row.location || "-", s: { border: getAllBorders() } },
        { v: row.weight || "-", s: { border: getAllBorders() } },
        { v: row.note || "-", s: { border: getAllBorders() } },
      ];

      if (isFullControl) {
        baseRow.push({
          // v: row.totalPrice ?? "-",
          v: row.totalPrice ? Number(row.totalPrice).toFixed(2) : "-",
          s: { border: getAllBorders() },
        });
      }

      return baseRow;
    });

    // ✅ CREATE SHEET
    const ws = XLSX.utils.aoa_to_sheet([header, ...data]);

    // ✅ AUTO COLUMN WIDTH
    const colWidths = header.map((_, colIndex) => {
      let maxLength = 0;
      [header, ...data].forEach((row) => {
        const cell = row[colIndex];
        const value = cell?.v ? String(cell.v) : "";
        maxLength = Math.max(maxLength, value.length);
      });
      return { wch: Math.min(maxLength * 1.8, 60) };
    });

    ws["!cols"] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventory");

    XLSX.writeFile(wb, fileName);

    notification.success({
      message: "Export Successful",
      description: "Inventory report downloaded successfully.",
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
    fetchSummary();
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
      }
    tspan {
  font-size: 14px !important;
}
    `;

  const getPercentage = (label, data) => {
    if (!Array.isArray(data) || data.length === 0) return "0%";

    const total = data.reduce((sum, e) => sum + (e.value || 0), 0);
    if (total === 0) return "0%";

    const raw = data.map((item) => (item.value / total) * 100);

    // Round percentages (2 decimals)
    const rounded = raw.map((p) => Number(p.toFixed(2)));

    // Drift correction
    const drift = Number((100 - rounded.reduce((a, b) => a + b, 0)).toFixed(2));
    rounded[rounded.length - 1] += drift;

    const idx = data.findIndex(
      (d) => d.name.trim().toLowerCase() === label.trim().toLowerCase()
    );

    return `${rounded[idx] ?? 0}%`;
  };

  const CATEGORY_COLORS = {
    Machine: "#0d3984e8",
    Consumables: "#0DA2E7",
    Auxiliaries: "#dc7531dc",
    "Spare Parts": "#15A28D",
  };

  const VALUE_CATEGORY_COLORS = {
    Machine: "#2c5cb0f6",
    Consumables: "#0DA2E7",
    Auxiliaries: "#ed7321ff",
    "Spare Parts": "#11cbafff",
  };

  // Compute counts by category
  const getCategoryData = (inventory = []) => {
    // if (!inventory || inventory.length === 0) {
    //   // Return a placeholder slice when no data
    //   return [{ name: "No Data", value: 1 }];
    // }
    if (!inventory || inventory.length === 0) {
      return []; // return empty array instead of dummy slice
    }
    const categoryMap = {
      Machine: 0,
      Consumables: 0,
      Auxiliaries: 0,
      "Spare Parts": 0,
    };

    inventory.forEach((item) => {
      const category = item.Category || "Unknown";
      if (categoryMap.hasOwnProperty(category)) {
        categoryMap[category] += 1;
      }
    });

    return Object.keys(categoryMap)
      .filter((key) => categoryMap[key] > 0) // only show categories with data
      .map((key) => ({
        name: key,
        value: categoryMap[key],
      }));
  };
  const pieChartData = getCategoryData(tableDataSource || []);

  const getCategoryValueData = (inventory = []) => {
    // if (!inventory || inventory.length === 0) {
    //   return [{ name: "No Data", value: 1 }];
    // }

    if (!inventory || inventory.length === 0) return [];

    const totals = {};
    inventory.forEach((item) => {
      const category = item.Category || "Unknown";
      const value = parseFloat(item.totalPrice) || 0;
      if (!totals[category]) totals[category] = 0;
      totals[category] += value;
    });

    return Object.entries(totals).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const valueChartData = getCategoryValueData(tableDataSource || []);

  const LOW_COLORS = {
    // Machine
    Machine: "#3366cceb", // Medium Blue

    // Consumables
    Consumables: "#03b57af1", // Medium Green

    // Auxiliaries
    Auxiliaries: "#ff9933eb", // Medium Orange

    // Spare Parts
    "Spare Parts": "#f66565eb", // Medium Purple
  };

  const OUT_COLORS = {
    // Machine
    Machine: "#1c65f8ff", // Darker Blue

    // Consumables
    Consumables: "#05cf6aff", // Darker Green

    // Auxiliaries
    Auxiliaries: "#ea9b4dff", // Dark Orange

    // Spare Parts
    "Spare Parts": "#f74f60ff", // Darker Purple
  };

  // const getLowOutStockData = (inventory = []) => {
  //   if (!inventory || inventory.length === 0) return [];

  //   const dataMap = {};

  //   inventory.forEach((item) => {
  //     const qty = Number(item.quantity) || 0;
  //     const category = item.Category || "Unknown";

  //     let status = null;
  //     if (qty === 0) status = "Out of Stock";
  //     else if (qty < 5) status = "Low Stock";

  //     if (status) {
  //       const key = `${category} - ${status}`;
  //       if (!dataMap[key]) dataMap[key] = 0;
  //       dataMap[key] += 1; // counting number of items
  //     }
  //   });

  //   return Object.entries(dataMap).map(([name, value]) => ({ name, value }));
  // };

  // const lowOutStockChartData = getLowOutStockData(tableDataSource || []);

  const getLowOutStockData = (inventory = []) => {
    if (!inventory || inventory.length === 0) return { low: [], out: [] };

    const lowMap = {};
    const outMap = {};

    inventory.forEach((item) => {
      const qty = Number(item.quantity) || 0;
      const category = item.Category || "Unknown";

      if (qty === 0) {
        if (!outMap[category]) outMap[category] = 0;
        outMap[category] += 1;
      } else if (qty < 5) {
        if (!lowMap[category]) lowMap[category] = 0;
        lowMap[category] += 1;
      }
    });

    return {
      low: Object.entries(lowMap).map(([name, value]) => ({
        name: `${name}`,
        value,
      })),
      out: Object.entries(outMap).map(([name, value]) => ({
        name: `${name}`,
        value,
      })),
    };
  };

  const { low, out } = getLowOutStockData(tableDataSource || []);

  if (access === "No Access") {
    return <h2 style={{ padding: 20 }}>You do not have access to Dashboard</h2>;
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
              Inventory Dashboard
            </h1>
            <p
              className="text-center m-0 p-0 haitianInventoryDescriptionText"
              style={{ color: "#0D3884" }}
            >
              (Details about overall inventory items)
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
                      icon={faChartSimple}
                      size="lg"
                      style={{ color: "#0D3884" }}
                    />
                  </div>
                  <div>
                    <div
                      className="fw-bold m-0 p-0"
                      style={{ fontSize: "20px", color: "#0D3884" }}
                    >
                      Dashboard Details
                    </div>
                    <div
                      className="m-0 p-0"
                      style={{ fontSize: "14px", color: "#0D3884" }}
                    >
                      Details about inventory stock and total value of the
                      inventory items
                    </div>
                  </div>
                </div>
                <div className="border border-1"></div>
                <div className="row mt-2">
                  {/* <div className="col-lg-3">
                    <div
                      className="custom-card card p-3 "
                      style={{
                        backgroundColor: "#D1FAE5",
                        borderLeft: "6px solid #05a954ff",
                        borderTop: "0px",
                        borderBottom: "0px",
                        borderRight: "0px",
                      }}
                    >
                      <div className="card-body">
                        <h5
                          className="card-title "
                          style={{ color: "#05a954ff" }}
                        >
                          Total items
                        </h5>
                        <p>{summary.totalItems}</p>
                      </div>
                    </div>{" "}
                  </div> */}

                  <div className="col-lg-3 col-md-6 col-sm-12">
                    <div
                      className="custom-card card p-3"
                      style={{
                        backgroundColor: "#D1FAE5",
                        borderLeft: "6px solid #05a954ff",
                        borderTop: "0px",
                        borderBottom: "0px",
                        borderRight: "0px",
                        position: "relative", // ✅ enable absolute positioning
                        overflow: "hidden", // ✅ ensures image truncation
                      }}
                    >
                      <div
                        className="card-body"
                        style={{ position: "relative", zIndex: 2 }}
                      >
                        <h5
                          className="card-title"
                          style={{ color: "#05a954ff" }}
                        >
                          Total items
                        </h5>
                        <p className="pb-2">{summary.totalItems}</p>
                      </div>

                      {/* ✅ Responsive decorative image */}
                      <img
                        src={HaitianMachine} // replace with your image (e.g. HaitianMachine)
                        alt="Haitian Decorative"
                        style={{
                          position: "absolute",
                          bottom: "-23%",
                          right: "-12%",
                          width: "90%", // scales with card
                          height: "auto",
                          maxWidth: "200px", // prevents it from being too large
                          opacity: 0.2, // subtle background look
                          pointerEvents: "none",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  </div>

                  {/* <div className="col-lg-3">
                    <div
                      className="custom-card card p-3"
                      style={{
                        backgroundColor: "#d7e0f1ff",
                        borderLeft: "6px solid #0d3884",
                        borderTop: "0px",
                        borderBottom: "0px",
                        borderRight: "0px",
                      }}
                    >
                      <div className="card-body">
                        <h5 className="card-title" style={{ color: "#0d3884" }}>
                          Total value
                        </h5>
                        <p>{summary.totalValue} AED</p>
                        <div style={{width:"100px"}} className="m-0 p-0">
                        <img src={HaitianMachine} alt="HaitianMachine" className="img-fluid"/>
                        </div>
                      </div>
                    </div>
                  </div> */}

                  <div className="col-lg-3 col-md-6 col-sm-12">
                    <div
                      className="custom-card card p-3"
                      style={{
                        backgroundColor: "#d7e0f1ff",
                        borderLeft: "6px solid #0d3884",
                        borderTop: "0px",
                        borderBottom: "0px",
                        borderRight: "0px",
                        position: "relative",
                        overflow: "hidden", // ensures image truncation
                      }}
                    >
                      <div
                        className="card-body"
                        style={{
                          position: "relative",
                          zIndex: 2,
                        }}
                      >
                        <h5 className="card-title" style={{ color: "#0d3884" }}>
                          Total value
                        </h5>
                        <p className="pb-2">{summary.totalValue} AED</p>
                      </div>

                      {/* ✅ Responsive decorative image */}
                      <img
                        src={HaitianMachine}
                        alt="HaitianMachine"
                        style={{
                          position: "absolute",
                          bottom: "-23%", // use percentage instead of px
                          right: "-12%",
                          width: "90%", // scales with card width
                          height: "auto",
                          maxWidth: "200px", // optional upper limit
                          opacity: 0.2,
                          pointerEvents: "none",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  </div>

                  {/* <div className="col-lg-3">
                    {" "}
                    <div
                      className="custom-card card p-3"
                      style={{
                        backgroundColor: "#f7e9cbff",
                        borderLeft: "6px solid #d48f04ff",
                        borderTop: "0px",
                        borderBottom: "0px",
                        borderRight: "0px",
                      }}
                    >
                      <div className="card-body">
                        <h5
                          className="card-title "
                          style={{ color: "#d48f04ff" }}
                        >
                          Low stock alert
                        </h5>
                        <p>{summary.lowStock}</p>
                      </div>
                    </div>{" "}
                  </div> */}

                  <div className="col-lg-3 col-md-6 col-sm-12">
                    <div
                      className="custom-card card p-3"
                      style={{
                        backgroundColor: "#f7e9cbff",
                        borderLeft: "6px solid #d48f04ff",
                        borderTop: "0px",
                        borderBottom: "0px",
                        borderRight: "0px",
                        position: "relative", // ✅ allows image positioning
                        overflow: "hidden", // ✅ keeps image clipped (half-visible)
                      }}
                    >
                      <div
                        className="card-body"
                        style={{ position: "relative", zIndex: 2 }}
                      >
                        <h5
                          className="card-title"
                          style={{ color: "#d48f04ff" }}
                        >
                          Low stock alert
                        </h5>
                        <p className="pb-2">{summary.lowStock}</p>
                      </div>

                      {/* ✅ Decorative image in bottom-right corner */}
                      <img
                        src={HaitianMachine} // or any relevant image for low stock
                        alt="Low Stock Decorative"
                        style={{
                          position: "absolute",
                          bottom: "-23%", // responsive offset
                          right: "-12%", // responsive offset
                          width: "90%", // scales with card width
                          height: "auto",
                          maxWidth: "200px", // limits size on large screens
                          opacity: 0.2, // subtle background effect
                          pointerEvents: "none",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  </div>

                  {/* <div className="col-lg-3">
                    <div
                      className="custom-card card p-3"
                      style={{
                        backgroundColor: "#f7d9d9ff",
                        borderLeft: "6px solid #f72d2dff",
                        borderTop: "0px",
                        borderBottom: "0px",
                        borderRight: "0px",
                      }}
                    >
                      <div className="card-body">
                        <h5
                          className="card-title "
                          style={{ color: "#f72d2dff" }}
                        >
                          Out of stock
                        </h5>
                        <p>{summary.outOfStock}</p>
                      </div>
                    </div>{" "}
                  </div> */}

                  <div className="col-lg-3 col-md-6 col-sm-12">
                    <div
                      className="custom-card card p-3"
                      style={{
                        backgroundColor: "#f7d9d9ff",
                        borderLeft: "6px solid #f72d2dff",
                        borderTop: "0px",
                        borderBottom: "0px",
                        borderRight: "0px",
                        position: "relative", // ✅ needed for image positioning
                        overflow: "hidden", // ✅ ensures truncated look
                      }}
                    >
                      <div
                        className="card-body"
                        style={{ position: "relative", zIndex: 2 }}
                      >
                        <h5
                          className="card-title"
                          style={{ color: "#f72d2dff" }}
                        >
                          Out of stock
                        </h5>
                        <p className="pb-2">{summary.outOfStock}</p>
                      </div>

                      {/* ✅ Decorative image (responsive and non-intrusive) */}
                      <img
                        src={HaitianMachine} // or a relevant out-of-stock illustration
                        alt="Out of Stock Decorative"
                        style={{
                          position: "absolute",
                          bottom: "-23%",
                          right: "-12%",
                          width: "90%", // scales with card size
                          height: "auto",
                          maxWidth: "200px", // keeps it reasonable on large screens
                          opacity: 0.2, // subtle watermark feel
                          pointerEvents: "none",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  </div>

                  <div className="row m-0 p-0">
                    <div className="col-6">
                      <div
                        className="mt-5 border border-2 border-light rounded-3 p-3"
                        style={{ boxShadow: "0 4px 4px rgba(0, 0, 0, 0.1)" }}
                      >
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
                              icon={faChartPie}
                              size="lg"
                              style={{ color: "#0D3884" }}
                            />
                          </div>
                          <div>
                            <div
                              className="fw-bold m-0 p-0"
                              style={{ fontSize: "20px", color: "#0D3884" }}
                            >
                              Inventory Category by Number of Items
                            </div>
                            <div
                              className="m-0 p-0"
                              style={{ fontSize: "14px", color: "#0D3884" }}
                            >
                              Total number of items and percentage distribution
                              by category
                            </div>
                          </div>
                        </div>
                        <div className="border border-1"></div>

                        {/* <div style={{ width: "100%", height: 400 }}>
                          <ResponsiveContainer width="100%" height={400}>
                            <PieChart>
                              <Pie
                                data={pieChartData}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                label={({
                                  cx,
                                  cy,
                                  midAngle,
                                  innerRadius,
                                  outerRadius,
                                  index,
                                }) => {
                                  const RADIAN = Math.PI / 180;
                                  const radius =
                                    innerRadius +
                                    (outerRadius - innerRadius) * 0.5;
                                  const x =
                                    cx + radius * Math.cos(-midAngle * RADIAN);
                                  const y =
                                    cy + radius * Math.sin(-midAngle * RADIAN);

                                  const total = pieChartData.reduce(
                                    (sum, entry) => sum + entry.value,
                                    0
                                  );
                                  const percent =
                                    total === 0
                                      ? 0
                                      : (
                                          (pieChartData[index].value / total) *
                                          100
                                        ).toFixed(0);

                                  return percent > 0 ? (
                                    <text
                                      x={x}
                                      y={y}
                                      fill="white"
                                      textAnchor={x > cx ? "start" : "end"}
                                      dominantBaseline="central"
                                    >
                                      {`${percent}%`}
                                    </text>
                                  ) : null;
                                }}
                                outerRadius={130}
                                dataKey="value"
                              >
                                {pieChartData.map((entry) => (
                                  <Cell
                                    key={`cell-${entry.name}`}
                                    fill={
                                      CATEGORY_COLORS[entry.name] || "#8884d8"
                                    }
                                  />
                                ))}
                              </Pie>

                              <Pie
                                data={pieChartData}
                                cx="50%"
                                cy="50%"
                                outerRadius={130}
                                dataKey="value"
                                isAnimationActive={false}
                                labelLine={true}
                                legendType="none" // Hide this pie from legend
                                label={({
                                  cx,
                                  cy,
                                  midAngle,
                                  outerRadius,
                                  index,
                                }) => {
                                  const RADIAN = Math.PI / 180;
                                  const radius = outerRadius + 25; // move label outside
                                  const x =
                                    cx + radius * Math.cos(-midAngle * RADIAN);
                                  const y =
                                    cy + radius * Math.sin(-midAngle * RADIAN);

                                  const valueCount = pieChartData[index].value; // actual item count

                                  return (
                                    <text
                                      x={x}
                                      y={y}
                                      fill="#333"
                                      textAnchor={x > cx ? "start" : "end"}
                                      dominantBaseline="central"
                                      style={{ fontSize: "12px" }}
                                    >
                                      {valueCount}
                                    </text>
                                  );
                                }}
                              >
                                {pieChartData.map((entry) => (
                                  <Cell
                                    key={`cell-outside-${entry.name}`}
                                    fill="transparent"
                                    stroke="none"
                                  />
                                ))}
                              </Pie>

                              <Legend
                                layout="horizontal"
                                verticalAlign="bottom"
                                align="center"
                                iconType="square"
                                verticalOffset={20}
                                formatter={(value) => (
                                  <span
                                    style={{
                                      color:
                                        CATEGORY_COLORS[value] || "#8884d8",
                                    }}
                                  >
                                    {value}
                                  </span>
                                )}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div> */}

                        {/* <div style={{ width: "100%", height: 400 }}>
                          {tableDataSource.length === 0 ? (
                            <div
                              style={{
                                border: "2px dashed #ccc",
                                borderRadius: "8px",
                                height: "400px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#0D3884",
                                fontSize: "16px",
                                fontWeight: "500",
                                backgroundColor: "#fafafa",
                              }}
                              className="mt-3"
                            >
                              No Data Available
                            </div>
                          ) : pieChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={400}>
                              <PieChart>
                                <Pie
                                  data={pieChartData}
                                  dataKey="value"
                                  nameKey="name"
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={120}
                                  paddingAngle={getPaddingAngle(pieChartData)}
                                  isAnimationActive={false}
                                  label={({ index }) =>
                                    pieChartData[index].value
                                  }
                                >
                                  {pieChartData.map((entry, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={
                                        CATEGORY_COLORS[entry.name] || "#8884d8"
                                      }
                                    />
                                  ))}
                                </Pie>
                                <Legend
                                  layout="horizontal"
                                  verticalAlign="bottom"
                                  align="center"
                                  iconType="square"
                                  formatter={(value) => (
                                    <span
                                      style={{
                                        color:
                                          CATEGORY_COLORS[value] || "#8884d8",
                                      }}
                                    >
                                      {value}
                                    </span>
                                  )}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          ) : (
                            <div
                              style={{
                                border: "2px dashed #ccc",
                                borderRadius: "8px",
                                height: "400px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#0D3884",
                                fontSize: "16px",
                                fontWeight: "500",
                                backgroundColor: "#fafafa",
                              }}
                              className="mt-3"
                            >
                              No Data Available
                            </div>
                          )}
                        </div> */}

                        <div style={{ width: "100%", height: 400 }}>
                          {tableDataSource.length === 0 ||
                          pieChartData.every((d) => d.value === 0) ? (
                            <div
                              style={{
                                border: "2px dashed #ccc",
                                borderRadius: "8px",
                                height: "400px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#0D3884",
                                fontSize: "16px",
                                fontWeight: "500",
                                backgroundColor: "#fafafa",
                              }}
                              className="mt-3"
                            >
                              No Data Available
                            </div>
                          ) : (
                            <ResponsiveContainer width="100%" height={400}>
                              <PieChart>
                                <Pie
                                  data={pieChartData}
                                  dataKey="value"
                                  nameKey="name"
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={120}
                                  minAngle={3}
                                  paddingAngle={getPaddingAngle(pieChartData)}
                                  isAnimationActive={false}
                                  // label={({ index }) =>
                                  //   pieChartData[index].value
                                  // }
                                  label={({ index }) =>
                                    pieChartData[index]?.value ?? ""
                                  }
                                >
                                  {pieChartData.map((entry, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={
                                        CATEGORY_COLORS[entry.name] || "#8884d8"
                                      }
                                    />
                                  ))}
                                </Pie>
                                <Legend
                                  layout="horizontal"
                                  verticalAlign="bottom"
                                  align="center"
                                  iconType="square"
                                  // formatter={(value) => (
                                  //   <span
                                  //     style={{
                                  //       color:
                                  //         CATEGORY_COLORS[value] || "#8884d8",
                                  //     }}
                                  //   >
                                  //     {value}
                                  //   </span>
                                  // )}

                                  // formatter={(value, entry) => {
                                  //   const total = pieChartData.reduce(
                                  //     (sum, item) => sum + item.value,
                                  //     0
                                  //   );
                                  //   // const item = pieChartData.find(
                                  //   //   (d) => d.name === value
                                  //   // );
                                  //   const item = pieChartData.find(
                                  //     (d) =>
                                  //       d.name.trim().toLowerCase() ===
                                  //       String(value).trim().toLowerCase()
                                  //   );
                                  //   const percent = total
                                  //     ? ((item?.value / total) * 100).toFixed(1)
                                  //     : 0;
                                  //   return (
                                  //     <span
                                  //       style={{
                                  //         color:
                                  //           CATEGORY_COLORS[value] || "#8884d8",
                                  //       }}
                                  //     >
                                  //       {`${value} (${percent}%)`}
                                  //     </span>
                                  //   );
                                  // }}

                                  // formatter={(value) => {
                                  //   const total = pieChartData.reduce(
                                  //     (sum, item) => sum + item.value,
                                  //     0
                                  //   );

                                  //   // ✅ Step 1: compute raw % for all slices first
                                  //   const rawPercents = pieChartData.map(
                                  //     (item) => (item.value / total) * 100
                                  //   );

                                  //   // ✅ Step 2: round percentages (1 decimal place)
                                  //   const roundedPercents = rawPercents.map(
                                  //     (p) => Math.round(p * 10) / 10
                                  //   );

                                  //   // ✅ Step 3: fix rounding drift by adjusting the last item
                                  //   const roundedSum = roundedPercents.reduce(
                                  //     (sum, p) => sum + p,
                                  //     0
                                  //   );
                                  //   const drift =
                                  //     Math.round((100 - roundedSum) * 10) / 10;

                                  //   const percent = roundedPercents.map(
                                  //     (p, idx) =>
                                  //       idx === roundedPercents.length - 1
                                  //         ? p + drift
                                  //         : p
                                  //   );

                                  //   // ✅ find current slice and return its exact percent
                                  //   const idx = pieChartData.findIndex(
                                  //     (item) =>
                                  //       item.name.trim().toLowerCase() ===
                                  //       value.trim().toLowerCase()
                                  //   );

                                  //   return `${value} (${percent[idx]}%)`;
                                  // }}

                                  formatter={(value) =>
                                    `${value} (${getPercentage(
                                      value,
                                      pieChartData
                                    )})`
                                  }
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div
                        className="mt-5  border border-2 border-light rounded-3 p-3"
                        style={{ boxShadow: "0 4px 4px rgba(0, 0, 0, 0.1)" }}
                      >
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
                              icon={faChartPie}
                              size="lg"
                              style={{ color: "#0D3884" }}
                            />
                          </div>
                          <div>
                            <div
                              className="fw-bold m-0 p-0"
                              style={{ fontSize: "20px", color: "#0D3884" }}
                            >
                              Inventory Value by Category
                            </div>
                            <div
                              className="m-0 p-0"
                              style={{ fontSize: "14px", color: "#0D3884" }}
                            >
                              Total value (AED) and percentage distribution by
                              category
                            </div>
                          </div>
                        </div>
                        <div className="border border-1"></div>

                        {/* <div style={{ width: "100%", height: 400 }}>
                          <ResponsiveContainer width="100%" height={400}>
                            <PieChart>
                              <Pie
                                data={valueChartData}
                                cx="50%"
                                cy="50%"
                                outerRadius={130}
                                dataKey="value"
                                labelLine={true}
                                label={({
                                  cx,
                                  cy,
                                  midAngle,
                                  outerRadius,
                                  index,
                                }) => {
                                  const RADIAN = Math.PI / 180;
                                  const radius = outerRadius * 0.65;
                                  const x =
                                    cx + radius * Math.cos(-midAngle * RADIAN);
                                  const y =
                                    cy + radius * Math.sin(-midAngle * RADIAN);

                                  const total = valueChartData.reduce(
                                    (sum, entry) => sum + entry.value,
                                    0
                                  );
                                  const percent =
                                    total === 0
                                      ? 0
                                      : (
                                          (valueChartData[index].value /
                                            total) *
                                          100
                                        ).toFixed(0);

                                  return (
                                    <text
                                      x={x}
                                      y={y}
                                      fill="white"
                                      textAnchor="middle"
                                      dominantBaseline="central"
                                      style={{
                                        fontSize: "12px",
                                        fontWeight: "600",
                                      }}
                                    >
                                      {`${percent}%`}
                                    </text>
                                  );
                                }}
                              >
                                {valueChartData.map((entry) => (
                                  <Cell
                                    key={`cell-${entry.name}`}
                                    fill={
                                      CATEGORY_COLORS[entry.name] || "#8884d8"
                                    }
                                  />
                                ))}
                              </Pie>

                              <Pie
                                data={valueChartData}
                                cx="50%"
                                cy="50%"
                                outerRadius={130}
                                dataKey="value"
                                isAnimationActive={false}
                                labelLine={true}
                                legendType="none" 
                                label={({
                                  cx,
                                  cy,
                                  midAngle,
                                  outerRadius,
                                  index,
                                }) => {
                                  const RADIAN = Math.PI / 180;
                                  const radius = outerRadius + 25;
                                  const x =
                                    cx + radius * Math.cos(-midAngle * RADIAN);
                                  const y =
                                    cy + radius * Math.sin(-midAngle * RADIAN);
                                  const valueAED =
                                    valueChartData[
                                      index
                                    ].value.toLocaleString();

                                  return (
                                    <text
                                      x={x}
                                      y={y}
                                      fill="#333"
                                      textAnchor={x > cx ? "start" : "end"}
                                      dominantBaseline="central"
                                      style={{ fontSize: "12px" }}
                                    >
                                      {`${valueAED} AED`}
                                    </text>
                                  );
                                }}
                              >
                                {valueChartData.map((entry) => (
                                  <Cell
                                    key={`cell-outside-${entry.name}`}
                                    fill="transparent"
                                    stroke="none"
                                  />
                                ))}
                              </Pie>

                              <Tooltip
                                formatter={(val, name, entry) => {
                                  const total = valueChartData.reduce(
                                    (sum, e) => sum + e.value,
                                    0
                                  );
                                  const percent =
                                    total === 0
                                      ? 0
                                      : ((entry.value / total) * 100).toFixed(
                                          1
                                        );
                                  return [
                                    `${val.toLocaleString()} AED (${percent}%)`,
                                    entry.name,
                                  ];
                                }}
                                contentStyle={{
                                  backgroundColor: "#fff",
                                  border: "1px solid #ccc",
                                  borderRadius: "8px",
                                  fontSize: "13px",
                                }}
                              />

                              <Legend
                                layout="horizontal"
                                verticalAlign="bottom"
                                align="center"
                                iconType="square" // ✅ same color boxes
                                formatter={(value) => (
                                  <span
                                    style={{
                                      color:
                                        CATEGORY_COLORS[value] || "#8884d8",
                                    }}
                                  >
                                    {value}
                                  </span>
                                )}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div> */}

                        {/* <div style={{ width: "100%", height: 400 }}>
                          {tableDataSource.length === 0 ? (
                            <div
                              style={{
                                border: "2px dashed #ccc",
                                borderRadius: "8px",
                                height: "400px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#0D3884",
                                fontSize: "16px",
                                fontWeight: "500",
                                backgroundColor: "#fafafa",
                              }}
                              className="mt-3"
                            >
                              No Data Available
                            </div>
                          ) : valueChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={400}>
                              <PieChart>
                                <Pie
                                  data={valueChartData}
                                  dataKey="value"
                                  nameKey="name"
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={120}
                                  paddingAngle={getPaddingAngle(valueChartData)}
                                  isAnimationActive={false}
                                  label={({ index }) =>
                                    valueChartData[
                                      index
                                    ].value.toLocaleString() + " AED"
                                  }
                                >
                                  {valueChartData.map((entry, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={
                                        VALUE_CATEGORY_COLORS[entry.name] || "#8884d8"
                                      }
                                    />
                                  ))}
                                </Pie>
                                <Legend
                                  layout="horizontal"
                                  verticalAlign="bottom"
                                  align="center"
                                  iconType="square"
                                  formatter={(value) => (
                                    <span
                                      style={{
                                        color:
                                          VALUE_CATEGORY_COLORS[value] || "#8884d8",
                                      }}
                                    >
                                      {value}
                                    </span>
                                  )}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          ) : (
                            <div
                              style={{
                                border: "2px dashed #ccc",
                                borderRadius: "8px",
                                height: "400px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#0D3884",
                                fontSize: "16px",
                                fontWeight: "500",
                                backgroundColor: "#fafafa",
                              }}
                              className="mt-3"
                            >
                              No Data Available
                            </div>
                          )}
                        </div> */}

                        {/* <div style={{ width: "100%", height: 400 }}>
                          {tableDataSource.length === 0 ||
                          valueChartData.every((d) => d.value === 0) ? (
                            <div
                              style={{
                                border: "2px dashed #ccc",
                                borderRadius: "8px",
                                height: "400px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#0D3884",
                                fontSize: "16px",
                                fontWeight: "500",
                                backgroundColor: "#fafafa",
                              }}
                              className="mt-3"
                            >
                              No Data Available
                            </div>
                          ) : (
                            <ResponsiveContainer width="100%" height={400}>
                              <PieChart>
                                <Pie
                                  data={valueChartData}
                                  dataKey="value"
                                  nameKey="name"
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={120}
                                  paddingAngle={getPaddingAngle(valueChartData)}
                                  isAnimationActive={false}
                                  label={({ index }) =>
                                    valueChartData[
                                      index
                                    ].value.toLocaleString() + " AED"
                                  }
                                >
                                  {valueChartData.map((entry, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={
                                        VALUE_CATEGORY_COLORS[entry.name] ||
                                        "#8884d8"
                                      }
                                    />
                                  ))}
                                </Pie>
                                <Legend
                                  layout="horizontal"
                                  verticalAlign="bottom"
                                  align="center"
                                  iconType="square"
                                  // formatter={(value) => (
                                  //   <span
                                  //     style={{
                                  //       color:
                                  //         VALUE_CATEGORY_COLORS[value] ||
                                  //         "#8884d8",
                                  //     }}
                                  //   >
                                  //     {value}
                                  //   </span>
                                  // )}

                                  formatter={(value, entry) => {
                                    const total = valueChartData.reduce(
                                      (sum, item) => sum + item.value,
                                      0
                                    );
                                    const item = valueChartData.find(
                                      (d) => d.name === value
                                    );
                                    const percent = total
                                      ? ((item?.value / total) * 100).toFixed(1)
                                      : 0;
                                    return (
                                      <span
                                        style={{
                                          color:
                                            VALUE_CATEGORY_COLORS[value] ||
                                            "#8884d8",
                                        }}
                                      >
                                        {`${value} (${percent}%)`}
                                      </span>
                                    );
                                  }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          )}
                        </div> */}

                        <div style={{ width: "100%", height: 400 }}>
                          {tableDataSource.length === 0 ||
                          valueChartData.every((d) => d.value === 0) ? (
                            <div
                              style={{
                                border: "2px dashed #ccc",
                                borderRadius: "8px",
                                height: "400px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#0D3884",
                                fontSize: "16px",
                                fontWeight: "500",
                                backgroundColor: "#fafafa",
                              }}
                              className="mt-3"
                            >
                              No Data Available
                            </div>
                          ) : (
                            <ResponsiveContainer width="100%" height={400}>
                              <PieChart>
                                <Pie
                                  data={valueChartData}
                                  dataKey="value"
                                  nameKey="name"
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={120}
                                  minAngle={3} // ✅ ensures very small slices are still visible
                                  paddingAngle={getPaddingAngle(valueChartData)}
                                  isAnimationActive={false}
                                  // label={({ index }) =>
                                  //   valueChartData[
                                  //     index
                                  //   ].value.toLocaleString() + " AED"
                                  // }
                                  label={({ index }) =>
                                    valueChartData[
                                      index
                                    ]?.value?.toLocaleString() + " AED" || ""
                                  }
                                >
                                  {valueChartData.map((entry, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={
                                        VALUE_CATEGORY_COLORS[entry.name] ||
                                        "#8884d8"
                                      }
                                    />
                                  ))}
                                </Pie>

                                <Legend
                                  layout="horizontal"
                                  verticalAlign="bottom"
                                  align="center"
                                  iconType="square"
                                  // formatter={(value) => {
                                  //   const total = valueChartData.reduce(
                                  //     (sum, e) => sum + e.value,
                                  //     0
                                  //   );
                                  //   const item = valueChartData.find(
                                  //     (d) =>
                                  //       d.name.trim().toLowerCase() ===
                                  //       String(value).trim().toLowerCase()
                                  //   );
                                  //   const percent = total
                                  //     ? (
                                  //         ((item?.value || 0) / total) *
                                  //         100
                                  //       ).toFixed(2)
                                  //     : 0;
                                  //   const valueAED = (
                                  //     item?.value || 0
                                  //   ).toLocaleString();
                                  //   return `${value} (${percent}%)`;
                                  // }}

                                  //                                   formatter={(value) => {
                                  //   const total = valueChartData.reduce((sum, e) => sum + e.value, 0);
                                  //   if (total === 0) return `${value} (0%)`;

                                  //   // ✅ Step 1: get index of legend item
                                  //   const idx = valueChartData.findIndex(
                                  //     (d) => d.name.trim().toLowerCase() === value.trim().toLowerCase()
                                  //   );
                                  //   if (idx === -1) return `${value} (0%)`;

                                  //   // ✅ Step 2: compute raw exact percentage (no rounding loss)
                                  //   const rawPercents = valueChartData.map((d) => (d.value / total) * 100);

                                  //   // ✅ Step 3: round percentages only to two decimals (to avoid 0.0 problem)
                                  //   const rounded = rawPercents.map((p) => Number(p.toFixed(2)));

                                  //   // ✅ Step 4: apply drift correction (ensure total = 100)
                                  //   const drift = Number((100 - rounded.reduce((a, b) => a + b, 0)).toFixed(2));
                                  //   rounded[rounded.length - 1] += drift;

                                  //   // ✅ Step 5: Return cleaned formatting
                                  //   return `${value} (${rounded[idx]}%)`;
                                  // }}

                                  formatter={(value) =>
                                    `${value} (${getPercentage(
                                      value,
                                      valueChartData
                                    )})`
                                  }
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* <div className="col-6">
                      <div className="mt-5 border border-2 border-light rounded-3 p-3">
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
                              icon={faChartPie}
                              size="lg"
                              style={{ color: "#0D3884" }}
                            />
                          </div>
                          <div>
                            <div
                              className="fw-bold m-0 p-0"
                              style={{ fontSize: "20px", color: "#0D3884" }}
                            >
                              Low / Out of Stock Items by Category
                            </div>
                            <div
                              className="m-0 p-0"
                              style={{ fontSize: "14px", color: "#0D3884" }}
                            >
                              Only items with quantity below 5 or out of stock
                            </div>
                          </div>
                        </div>
                        <div className="border border-1"></div>

                        <div style={{ width: "100%", height: 400 }}>
                          {lowOutStockChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={lowOutStockChartData}
                                  dataKey="value"
                                  nameKey="name"
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={150}
                                  labelLine={true}
                                  label={({ index }) =>
                                    lowOutStockChartData[index].value
                                  }
                                >
                                  {lowOutStockChartData.map((entry, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={
                                        LOW_OUT_COLORS[entry.name] || "#FF6B6B"
                                      }
                                    />
                                  ))}
                                </Pie>
                                <Legend
                                  layout="horizontal"
                                  verticalAlign="bottom"
                                  align="center"
                                  iconType="square"
                                  formatter={(value) => (
                                    <span
                                      style={{
                                        color:
                                          LOW_OUT_COLORS[value] || "#FF6B6B",
                                      }}
                                    >
                                      {value}
                                    </span>
                                  )}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          ) : (
                            <div
                              style={{
                                border: "2px dashed #ccc",
                                borderRadius: "8px",
                                padding: "20px",
                                textAlign: "center",
                                color: "#666",
                                fontSize: "16px",
                                fontWeight: "500",
                                width: "80%",
                                margin: "auto",
                              }}
                            >
                              No Low / Out of Stock Items
                            </div>
                          )}
                        </div>
                      </div>
                    </div> */}

                    <div className="col-6">
                      <div
                        className="mt-5  border border-2 border-light rounded-3 p-3"
                        style={{ boxShadow: "0 4px 4px rgba(0, 0, 0, 0.1)" }}
                      >
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
                              icon={faChartPie}
                              size="lg"
                              style={{ color: "#0D3884" }}
                            />
                          </div>
                          <div>
                            <div
                              className="fw-bold m-0 p-0"
                              style={{ fontSize: "20px", color: "#0D3884" }}
                            >
                              Low Stock Items by Category
                            </div>
                            <div
                              className="m-0 p-0"
                              style={{ fontSize: "14px", color: "#0D3884" }}
                            >
                              Items with quantity below 5
                            </div>
                          </div>
                        </div>
                        <div className="border border-1"></div>

                        <div style={{ width: "100%", height: 400 }}>
                          {low.length > 0 ? (
                            <ResponsiveContainer width="100%" height={400}>
                              <PieChart>
                                <Pie
                                  data={low}
                                  dataKey="value"
                                  nameKey="name"
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={120}
                                  minAngle={3}
                                  paddingAngle={getPaddingAngle(low)}
                                  isAnimationActive={false}
                                  // label={({ index }) => low[index].value}
                                  label={({ index }) => low[index]?.value ?? ""}
                                >
                                  {low.map((entry, index) => {
                                    // ✅ Extract clean base name (remove " - Low Stock")
                                    const baseName = entry.name
                                      .replace(" - Low Stock", "")
                                      .trim();
                                    return (
                                      <Cell
                                        key={`cell-low-${index}`}
                                        fill={LOW_COLORS[baseName] || "#FFD36B"}
                                      />
                                    );
                                  })}
                                </Pie>
                                <Legend
                                  layout="horizontal"
                                  verticalAlign="bottom"
                                  align="center"
                                  iconType="square"
                                  // formatter={(value) => (
                                  //   <span
                                  //     style={{
                                  //       color:
                                  //         LOW_OUT_COLORS[value] || "#FFD36B",
                                  //     }}
                                  //   >
                                  //     {value}
                                  //   </span>
                                  // )}

                                  // formatter={(value, entry) => {
                                  //   const baseName = value
                                  //     .replace(" - Low Stock", "")
                                  //     .trim();

                                  //   const total = low.reduce(
                                  //     (sum, item) => sum + item.value,
                                  //     0
                                  //   );
                                  //   // const item = low.find(
                                  //   //   (d) => d.name === value
                                  //   // );
                                  //   const item = low.find(
                                  //     (d) =>
                                  //       d.name.trim().toLowerCase() ===
                                  //       String(value).trim().toLowerCase()
                                  //   );

                                  //   const percent = total
                                  //     ? ((item?.value / total) * 100).toFixed(1)
                                  //     : 0;
                                  //   return (
                                  //     <span
                                  //       style={{
                                  //         color:
                                  //           LOW_COLORS[baseName] || "#FFD36B",
                                  //       }}
                                  //     >
                                  //       {`${baseName} (${percent}%)`}
                                  //     </span>
                                  //   );
                                  // }}

                                  // formatter={(value) => {
                                  //   const baseName = value
                                  //     .replace(" - Low Stock", "")
                                  //     .trim();

                                  //   const total = low.reduce(
                                  //     (sum, item) => sum + item.value,
                                  //     0
                                  //   );

                                  //   // ✅ Step 1: compute raw percentages
                                  //   const rawPercents = low.map(
                                  //     (item) => (item.value / total) * 100
                                  //   );

                                  //   // ✅ Step 2: round percentages (1 decimal)
                                  //   const roundedPercents = rawPercents.map(
                                  //     (p) => Math.round(p * 10) / 10 // 1 decimal rounding
                                  //   );

                                  //   // ✅ Step 3: adjust last slice to ensure exactly 100%
                                  //   const roundedSum = roundedPercents.reduce(
                                  //     (sum, p) => sum + p,
                                  //     0
                                  //   );
                                  //   const drift =
                                  //     Math.round((100 - roundedSum) * 10) / 10;

                                  //   const fixedPercents = roundedPercents.map(
                                  //     (p, idx) =>
                                  //       idx === roundedPercents.length - 1
                                  //         ? p + drift
                                  //         : p
                                  //   );

                                  //   // ✅ Step 4: find correct index for legend item
                                  //   const idx = low.findIndex(
                                  //     (d) =>
                                  //       d.name.trim().toLowerCase() ===
                                  //       value.trim().toLowerCase()
                                  //   );

                                  //   return (
                                  //     <span
                                  //       style={{
                                  //         color:
                                  //           LOW_COLORS[baseName] || "#FFD36B",
                                  //       }}
                                  //     >
                                  //       {`${baseName} (${fixedPercents[idx]}%)`}
                                  //     </span>
                                  //   );
                                  // }}
                                  formatter={(value) =>
                                    `${value} (${getPercentage(value, low)})`
                                  }
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          ) : (
                            <div
                              style={{
                                border: "2px dashed #ccc",
                                borderRadius: "8px",
                                height: "400px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#0D3884",
                                fontSize: "16px",
                                fontWeight: "500",
                                backgroundColor: "#fafafa",
                              }}
                              className="mt-3"
                            >
                              No Data Available
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-6">
                      <div
                        className="mt-5  border border-2 border-light rounded-3 p-3"
                        style={{ boxShadow: "0 4px 4px rgba(0, 0, 0, 0.1)" }}
                      >
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
                              icon={faChartPie}
                              size="lg"
                              style={{ color: "#0D3884" }}
                            />
                          </div>
                          <div>
                            <div
                              className="fw-bold m-0 p-0"
                              style={{ fontSize: "20px", color: "#0D3884" }}
                            >
                              Out of Stock Items by Category
                            </div>
                            <div
                              className="m-0 p-0"
                              style={{ fontSize: "14px", color: "#0D3884" }}
                            >
                              Items completely out of stock
                            </div>
                          </div>
                        </div>
                        <div className="border border-1"></div>

                        <div style={{ width: "100%", height: 400 }}>
                          {out.length > 0 ? (
                            <ResponsiveContainer width="100%" height={400}>
                              <PieChart>
                                <Pie
                                  data={out}
                                  dataKey="value"
                                  nameKey="name"
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={120}
                                  isAnimationActive={false}
                                  minAngle={3}
                                  paddingAngle={getPaddingAngle(out)}
                                  // label={({ index }) => out[index].value}
                                  label={({ index }) => out[index]?.value ?? ""}
                                >
                                  {/* {out.map((entry, index) => (
                                    
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={
                                        OUT_COLORS[entry.name] || "#FF6B6B"
                                      }
                                    />

                                    
                                  ))} */}

                                  {out.map((entry, index) => {
                                    // ✅ Extract clean base name (remove " - Out of Stock")
                                    const baseName = entry.name
                                      .replace(" - Out of Stock", "")
                                      .trim();
                                    return (
                                      <Cell
                                        key={`cell-out-${index}`}
                                        fill={OUT_COLORS[baseName] || "#FF6B6B"}
                                      />
                                    );
                                  })}
                                </Pie>
                                <Legend
                                  layout="horizontal"
                                  verticalAlign="bottom"
                                  align="center"
                                  iconType="square"
                                  // formatter={(value) => (
                                  //   <span
                                  //     style={{
                                  //       color:
                                  //         LOW_OUT_COLORS[value] || "#FF6B6B",
                                  //     }}
                                  //   >
                                  //     {value}
                                  //   </span>
                                  // )}

                                  // formatter={(value, entry) => {
                                  //   const baseName = value
                                  //     .replace(" - Out of Stock", "")
                                  //     .trim();

                                  //   const total = out.reduce(
                                  //     (sum, item) => sum + item.value,
                                  //     0
                                  //   );
                                  //   // const item = out.find(
                                  //   //   (d) => d.name === value
                                  //   // );
                                  //   const item = out.find(
                                  //     (d) =>
                                  //       d.name.trim().toLowerCase() ===
                                  //       String(value).trim().toLowerCase()
                                  //   );

                                  //   const percent = total
                                  //     ? ((item?.value / total) * 100).toFixed(1)
                                  //     : 0;
                                  //   return (
                                  //     <span
                                  //       style={{
                                  //         color:
                                  //           OUT_COLORS[baseName] || "#FF6B6B",
                                  //       }}
                                  //     >
                                  //       {`${baseName} (${percent}%)`}
                                  //     </span>
                                  //   );
                                  // }}

                                  // formatter={(value) => {
                                  //   const baseName = value
                                  //     .replace(" - Out of Stock", "")
                                  //     .trim();

                                  //   const total = out.reduce(
                                  //     (sum, item) => sum + item.value,
                                  //     0
                                  //   );

                                  //   // ✅ Step 1: compute raw percentages for all slices
                                  //   const rawPercents = out.map(
                                  //     (item) => (item.value / total) * 100
                                  //   );

                                  //   // ✅ Step 2: round percentages (1 decimal place)
                                  //   const roundedPercents = rawPercents.map(
                                  //     (p) => Math.round(p * 10) / 10 // 1 decimal
                                  //   );

                                  //   // ✅ Step 3: fix rounding drift (ensure total = 100.0%)
                                  //   const roundedSum = roundedPercents.reduce(
                                  //     (sum, p) => sum + p,
                                  //     0
                                  //   );
                                  //   const drift =
                                  //     Math.round((100 - roundedSum) * 10) / 10;

                                  //   const fixedPercents = roundedPercents.map(
                                  //     (p, idx) =>
                                  //       idx === roundedPercents.length - 1
                                  //         ? p + drift
                                  //         : p
                                  //   );

                                  //   // ✅ Step 4: get correct index for matching label
                                  //   const idx = out.findIndex(
                                  //     (d) =>
                                  //       d.name.trim().toLowerCase() ===
                                  //       value.trim().toLowerCase()
                                  //   );

                                  //   return (
                                  //     <span
                                  //       style={{
                                  //         color:
                                  //           OUT_COLORS[baseName] || "#FF6B6B",
                                  //       }}
                                  //     >
                                  //       {`${baseName} (${fixedPercents[idx]}%)`}
                                  //     </span>
                                  //   );
                                  // }}

                                  formatter={(value) =>
                                    `${value} (${getPercentage(value, out)})`
                                  }
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          ) : (
                            <div
                              style={{
                                border: "2px dashed #ccc",
                                borderRadius: "8px",
                                height: "400px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#0D3884",
                                fontSize: "16px",
                                fontWeight: "500",
                                backgroundColor: "#fafafa",
                              }}
                              className="mt-3"
                            >
                              No Data Available
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 border border-2 border-light rounded-3 p-3">
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
                          Inventory Table
                        </div>
                        <div
                          className="m-0 p-0"
                          style={{ fontSize: "14px", color: "#0D3884" }}
                        >
                          Search item in the inventory by name, location, part
                          number or description
                        </div>
                      </div>
                    </div>
                    <div className="border border-1"></div>

                    <div>
                      <Form
                        form={form}
                        layout="vertical"
                        className="mt-3"
                        style={{ width: "100%" }}
                        onValuesChange={(changedValues, allValues) => {
                          const { partNumber, description, name, location } =
                            allValues;

                          const isAllEmpty =
                            !partNumber && !description && !name && !location;

                          if (isAllEmpty) {
                            form.setFieldValue("stockStatus", "all");
                            fetchInventory();
                          }
                        }}
                      >
                        <div className="row align-items-end g-3">
                          <div className="col-lg-6 col-md-6 col-sm-12">
                            <Form.Item
                              name="partNumber"
                              style={{ marginBottom: 0 }}
                            >
                              <Input
                                placeholder="Enter part number"
                                allowClear
                                size="large"
                                style={{ width: "100%" }}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (
                                    !value &&
                                    !form.getFieldValue("description")
                                  ) {
                                    form.setFieldValue("stockStatus", "all");
                                    // Reset table when both inputs are empty
                                    fetchInventory();
                                  }
                                }}
                              />
                            </Form.Item>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12">
                            <Form.Item
                              name="description"
                              style={{ marginBottom: 0 }}
                            >
                              <Input
                                placeholder="Enter description"
                                allowClear
                                size="large"
                                style={{ width: "100%" }}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (
                                    !value &&
                                    !form.getFieldValue("partNumber")
                                  ) {
                                    // Reset table when both inputs are empty
                                    form.setFieldValue("stockStatus", "all");
                                    fetchInventory();
                                  }
                                }}
                              />
                            </Form.Item>
                          </div>
                          <div className="col-lg-4 col-md-6 col-sm-12">
                            <Form.Item name="name" style={{ marginBottom: 0 }}>
                              <Input
                                placeholder="Enter name"
                                allowClear
                                size="large"
                                style={{ width: "100%" }}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (
                                    !value &&
                                    !form.getFieldValue("partNumber")
                                  ) {
                                    // Reset table when both inputs are empty
                                    form.setFieldValue("stockStatus", "all");
                                    fetchInventory();
                                  }
                                }}
                              />
                            </Form.Item>
                          </div>
                          <div className="col-lg-4 col-md-6 col-sm-12">
                            <Form.Item
                              name="location"
                              style={{ marginBottom: 0 }}
                            >
                              <Select
                                size="large"
                                placeholder="Select location"
                                allowClear
                                style={{ width: "100%" }}
                              >
                                <Option value="MEA">MEA</Option>
                                <Option value="AE">AE</Option>
                              </Select>
                            </Form.Item>
                          </div>

                          <div className="col-lg-4 col-md-6 col-sm-12">
                            <Form.Item
                              name="stockStatus"
                              style={{ marginBottom: 0 }}
                              initialValue="all"
                            >
                              <Select
                                size="large"
                                placeholder="Select stock status"
                                allowClear={false}
                                style={{ width: "100%" }}
                              >
                                <Option value="all">All Items</Option>
                                <Option value="low">Low Stock</Option>
                                <Option value="out">Out of Stock</Option>
                              </Select>
                            </Form.Item>
                          </div>

                          <div className="col-lg-3 col-md-6 col-sm-12">
                            <Button
                              type="primary"
                              size="large"
                              className="submitButton w-100"
                              onClick={handleSearch}
                            >
                              Search Inventory Data
                            </Button>
                          </div>
                          {/* <div className="col-lg-3 col-md-6 col-sm-12">
                            <Button
                              type="primary"
                              size="large"
                              className="resetButton"
                              onClick={handleExportInventory}
                            >
                              Export
                            </Button>
                          </div> */}
                          {isFullControl && (
                            <div className="col-lg-3 col-md-6 col-sm-12">
                              <Button
                                type="primary"
                                size="large"
                                className="resetButton"
                                onClick={handleExportInventory}
                              >
                                Export Inventory Data
                              </Button>
                            </div>
                          )}
                        </div>
                      </Form>
                    </div>
                    <Table
                      className="mt-3"
                      columns={finalColumns}
                      // dataSource={tableDataSource}
                      dataSource={filteredInventoryData}
                      pagination={{
                        pageSize: 10,
                      }}
                      scroll={{ x: "max-content" }}
                      size="middle"
                      loading={loading}
                      rowKey={(record, idx) => idx}
                    />
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
