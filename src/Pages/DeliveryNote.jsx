import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListCheck, faTable, faEye } from "@fortawesome/free-solid-svg-icons";
import {
  ExportOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import HaitianLogo from "../Images/Haitian.png";
import dayjs from "dayjs";
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
  Table,
  notification,
  Tooltip,
  DatePicker,
  Modal,
  Row,
  Col,
} from "antd";
import "../App.css";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import XLSX from "xlsx-js-style";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

// Try multiple common formats from Apps Script / Sheets / JSON
const DATE_INPUT_FORMATS = [
  "DD-MM-YYYY",
  "D-M-YYYY",
  "DD/MM/YYYY",
  "D/M/YYYY",
  "YYYY-MM-DD",
  "YYYY/MM/DD",
  "DD-MM-YYYY HH:mm:ss",
  "YYYY-MM-DDTHH:mm:ssZ",
  "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ",
  "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (z)",
];

function parseToDayjs(value) {
  if (!value) return null;
  if (dayjs.isDayjs(value)) return value;
  if (value instanceof Date) return dayjs(value);

  // Excel/Sheets serial day number (rough heuristic)
  if (typeof value === "number" && value > 25000 && value < 100000) {
    const excelEpoch = dayjs("1899-12-30"); // Google Sheets epoch
    return excelEpoch.add(value, "day");
  }

  const s = String(value).trim();
  for (const fmt of DATE_INPUT_FORMATS) {
    const d = dayjs(s, fmt, true);
    if (d.isValid()) return d;
  }
  const d = dayjs(s);
  return d.isValid() ? d : null;
}

export default function DeliveryNote({ username }) {
  const [form] = Form.useForm();
  const [viewForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [loadingDeliveryNumber, setLoadingDeliveryNumber] = useState(true);
  const [loadingCustomerName, setLoadingCustomerName] = useState(true);
  const [loadingDescription, setLoadingDescription] = useState(true);
  const [loadingPartNumber, setLoadingPartNumber] = useState(true);
  const [fetchingData, setFetchingData] = useState(false);
  const [descriptionList, setDescriptionList] = useState([]);
  const [stockLoading, setStockLoading] = useState(false);
  const [deliveryNumber, setDeliveryNumber] = useState("");
  const [fetchedData, setFetchedData] = useState([]);
  const [loadingFetchedData, setLoadingFetchedData] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [paymentTerms, setPaymentTerms] = useState("");
  const [stockMap, setStockMap] = useState({});
  const [inputRow, setInputRow] = useState({
    serialNumber: "",
    partNumber: "",
    itemDescription: "",
    quantity: "",
    stockInHand: "",
    unit: "",
    stockUnit: "",
  });
  const [downloading, setDownloading] = useState(false);

  const displayData = [{ key: "input", isInput: true }, ...dataSource];
  const [customerList, setCustomerList] = useState([]);
  const GAS_URL =
    "https://script.google.com/macros/s/AKfycby0-KbFm1fM94ni8YSC65F71yNJ1QD1N7CNMHkosI5J8Br1qnLufFNOPhhIvDoyMCWcSg/exec";

  const fetchInitialData = async () => {
    try {
      setLoadingDeliveryNumber(true);
      setLoadingCustomerName(true);
      setLoadingDescription(true);

      const [deliveryRes, customerRes, descRes] = await Promise.all([
        fetch(GAS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ action: "getNextDeliveryNumber" }),
        }),
        fetch(GAS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ action: "getCustomerDetails" }),
        }),
        fetch(GAS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            action: "getAllDescriptionsWithPartNumbers",
          }),
        }),
      ]);

      const [deliveryNum, customers, descriptions] = await Promise.all([
        deliveryRes.json(),
        customerRes.json(),
        descRes.json(),
      ]);

      if (deliveryNum.success) {
        setDeliveryNumber(deliveryNum.deliveryNumber);
        form.setFieldsValue({ deliveryNumber: deliveryNum.deliveryNumber });
      }
      if (customers.success) {
        setCustomerList(customers.customers);
      }
      if (descriptions.success) {
        setDescriptionList(descriptions.items);
      }

      // ✅ Fetch delivery notes separately
      await fetchDeliveryNotesData();
    } catch (err) {
      console.error("Error fetching initial data:", err);
      notification.error({
        message: "Error",
        description: "Failed to fetch initial data",
      });
    } finally {
      setLoadingDeliveryNumber(false);
      setLoadingCustomerName(false);
      setLoadingDescription(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Re-fetch descriptions when partNumber search changes
  // useEffect(() => {
  //   if (!inputRow.partNumber && !inputRow.itemDescription) return;

  //   const controller = new AbortController();
  //   setFetchingData(true);

  //   const timer = setTimeout(async () => {
  //     try {
  //       const res = await fetch(GAS_URL, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //         body: new URLSearchParams({
  //           action: "getAllDescriptionsWithPartNumbers",
  //           query: inputRow.partNumber || inputRow.itemDescription || "",
  //         }),
  //         signal: controller.signal,
  //       });
  //       const result = await res.json();
  //       if (result.success) {
  //         setDescriptionList(result.items);
  //       }
  //     } catch (err) {
  //       if (err.name !== "AbortError") console.error(err);
  //     } finally {
  //       setFetchingData(false);
  //     }
  //   }, 300);

  //   return () => {
  //     clearTimeout(timer);
  //     controller.abort();
  //   };
  // }, [inputRow.partNumber, inputRow.itemDescription]);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await fetch(GAS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ action: "getAllStockData" }),
        });
        const result = await res.json();
        if (result.success) {
          setStockMap(result.data); // { partNumber: { stockInHand, unit }, ... }
        }
      } catch (err) {
        console.error("Error fetching stock:", err);
      }
    };
    fetchStock();
  }, []);

  useEffect(() => {
    if (!inputRow.partNumber) return;

    const controller = new AbortController();
    const debounceTimer = setTimeout(() => {
      const fetchStockInHand = async () => {
        setStockLoading(true);
        try {
          const res = await fetch(GAS_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              action: "getStockForPartNumber",
              partNumber: inputRow.partNumber,
              category: "", // update if needed
            }),
            signal: controller.signal,
          });

          const result = await res.json();
          if (result.success) {
            setInputRow((prev) => ({
              ...prev,
              stockInHand: result.stockInHand?.toString() || "0",
              stockUnit: result.unit || "",
            }));
          } else {
            setInputRow((prev) => ({
              ...prev,
              stockInHand: "0",
              stockUnit: "",
            }));
          }
        } catch (err) {
          if (err.name !== "AbortError") {
            console.error("Fetch stock error:", err);
          }
        } finally {
          setStockLoading(false);
        }
      };

      fetchStockInHand();
    }, 400);

    return () => {
      clearTimeout(debounceTimer);
      controller.abort();
    };
  }, []);

  const columns = [
    {
      title: "Serial Number",
      dataIndex: "serialNumber",
      width: 150,
      render: (_, record, index) =>
        record.isInput ? (
          <Tooltip>
            <Input placeholder="S.No." value={dataSource.length + 1} readOnly />
          </Tooltip>
        ) : (
          <Tooltip title={record.serialNumber}>
            <span>{record.serialNumber}</span>
          </Tooltip>
        ),
    },

    {
      title: "Part Number",
      dataIndex: "partNumber",
      width: 250,
      ellipsis: true,
      render: (_, record) =>
        record.isInput ? (
          <Tooltip>
            <Select
              showSearch
              placeholder="Select or enter part number"
              value={inputRow.partNumber || undefined}
              loading={loadingDescription}
              disabled={loadingDescription}
              notFoundContent={
                loadingDescription ? "Fetching..." : "No results found"
              }
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              // onChange={(value) => {
              //   const selected = descriptionList.find(
              //     (item) => item.partNumber === value
              //   );
              //   setInputRow((prev) => ({
              //     ...prev,
              //     partNumber: value,
              //     itemDescription:
              //       selected?.description || prev.itemDescription,
              //     unit: selected?.unit || "",
              //   }));
              // }}
             onChange={(value) => {
  const selected = descriptionList.find((item) => item.partNumber === value);
  const cachedStock = stockMap[value] || { stockInHand: 0, unit: "" };

  // Immediate UI update from cache
  setInputRow((prev) => ({
    ...prev,
    partNumber: value,
    itemDescription: selected?.description || prev.itemDescription,
    unit: cachedStock.unit,
    stockInHand: cachedStock.stockInHand.toString(),
    stockUnit: cachedStock.unit,
  }));

  // Save the part number being fetched
  const currentPart = value;

  // 🔄 Background fetch
  (async () => {
    try {
      const res = await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          action: "getStockForPartNumber",
          partNumber: currentPart,
        }),
      });
      const result = await res.json();

      // ✅ Only update if user is still on the same part
      setInputRow((prev) => {
        if (prev.partNumber !== currentPart) {
          return prev; // ignore outdated response
        }
        return {
          ...prev,
          stockInHand: result.stockInHand?.toString() || "0",
          stockUnit: result.unit || "",
          unit: result.unit || prev.unit,
        };
      });

      setStockMap((prev) => ({
        ...prev,
        [currentPart]: {
          stockInHand: result.stockInHand,
          unit: result.unit,
        },
      }));
    } catch (err) {
      console.error("Live stock fetch failed", err);
    }
  })();
}}

              onSearch={(value) => {
                setInputRow((prev) => ({
                  ...prev,
                  partNumber: value,
                }));
              }}
              style={{ width: "100%" }}
            >
              {[...new Set(descriptionList.map((item) => item.partNumber))]
                .filter((p) => p) // remove empty
                .map((part, idx) => (
                  <Select.Option key={`pn-${idx}`} value={part}>
                    {part}
                  </Select.Option>
                ))}
            </Select>
          </Tooltip>
        ) : (
          <Tooltip title={record.partNumber}>
            <span>{record.partNumber}</span>
          </Tooltip>
        ),
    },
    {
      title: "Item Description",
      dataIndex: "itemDescription",
      ellipsis: true,
      width: 500,
      render: (_, record) =>
        record.isInput ? (
          <Tooltip>
            <Select
              showSearch
              // value={inputRow.itemDescription}
              value={inputRow.itemDescription || undefined}
              loading={loadingDescription}
              disabled={loadingDescription}
              notFoundContent={
                loadingDescription ? "Fetching..." : "No results found"
              }
              placeholder="Select or enter description"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              // onChange={(value) => {
              //   const selected = descriptionList.find(
              //     (item) => item.description === value
              //   );
              //   setInputRow((prev) => ({
              //     ...prev,
              //     itemDescription: value,
              //     partNumber: selected?.partNumber || prev.partNumber,
              //     unit: selected?.unit || "",
              //   }));
              // }}

onChange={(value) => {
  const selected = descriptionList.find((item) => item.description === value);
  const partNumber = selected?.partNumber || "";
  const cachedStock = stockMap[partNumber] || { stockInHand: 0, unit: "" };

  // Immediate UI update from cache
  setInputRow((prev) => ({
    ...prev,
    itemDescription: value,
    partNumber,
    unit: cachedStock.unit,
    stockInHand: cachedStock.stockInHand.toString(),
    stockUnit: cachedStock.unit,
  }));

  // Save the part number being fetched
  const currentPart = partNumber;

  // 🔄 Background live fetch
  (async () => {
    try {
      const res = await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          action: "getStockForPartNumber",
          partNumber: currentPart,
        }),
      });
      const result = await res.json();

      // ✅ Only update if still on the same part
      setInputRow((prev) => {
        if (prev.partNumber !== currentPart) return prev; // ignore outdated
        return {
          ...prev,
          stockInHand: result.stockInHand?.toString() || "0",
          stockUnit: result.unit || "",
          unit: result.unit || prev.unit,
        };
      });

      setStockMap((prev) => ({
        ...prev,
        [currentPart]: {
          stockInHand: result.stockInHand,
          unit: result.unit,
        },
      }));
    } catch (err) {
      console.error("Live stock fetch failed (description)", err);
    }
  })();
}}


              style={{ width: "100%" }}
            >
              {[...new Set(descriptionList.map((item) => item.description))]
                .filter((d) => d)
                .map((desc, idx) => (
                  <Select.Option key={`desc-${idx}`} value={desc}>
                    {desc}
                  </Select.Option>
                ))}
            </Select>
          </Tooltip>
        ) : (
          <Tooltip title={record.itemDescription}>
            <span className="truncate-text">
              {record.itemDescription?.length > 150
                ? `${record.itemDescription.slice(0, 150)}...`
                : record.itemDescription}
            </span>
          </Tooltip>
        ),
    },
    // {
    //   title: "Quantity",
    //   dataIndex: "quantity",
    //   ellipsis: true,
    //   width: 200,
    //   render: (_, record) =>
    //     record.isInput ? (
    //       <Tooltip>
    //         <Input
    //           placeholder="Enter Quantity"
    //           type="number"
    //           min={1}
    //           value={inputRow.quantity}
    //           onChange={(e) => {
    //             const value = parseInt(e.target.value);
    //             if (value >= 1 || e.target.value === "") {
    //               setInputRow({ ...inputRow, quantity: e.target.value });
    //             }
    //           }}
    //         />
    //       </Tooltip>
    //     ) : (
    //       <Tooltip title={record.quantity}>
    //         <span>{record.quantity}</span>
    //       </Tooltip>
    //     ),
    // },
    {
      title: "Quantity",
      dataIndex: "quantity",
      ellipsis: true,
      width: 200,
      render: (_, record) =>
        record.isInput ? (
          <Tooltip>
            <Input
              placeholder="Enter quantity"
              type="number"
              // min={0.1}
              value={inputRow.quantity}
              onChange={(e) => {
                const value = e.target.value.trim();
                setInputRow((prev) => ({ ...prev, quantity: value }));

                clearTimeout(window.quantityDebounce);
                window.quantityDebounce = setTimeout(() => {
                  const num = parseFloat(value);
                  if (
                    value !== "" &&
                    (value === "0" ||
                      value === "0.0" ||
                      value === ".0" ||
                      isNaN(num) ||
                      num <= 0)
                  ) {
                    notification.error({
                      message: "Invalid Quantity",
                      description: "Quantity must be greater than 0.",
                    });
                    setInputRow((prev) => ({ ...prev, quantity: "" }));
                    return;
                  }
                  // Unit check - get latest from record or inputRow
                  const unit = (
                    record.unit ||
                    inputRow.unit ||
                    ""
                  ).toLowerCase();
                  if (
                    (unit === "set" || unit === "piece") &&
                    !Number.isInteger(num)
                  ) {
                    notification.error({
                      message: "Invalid Quantity",
                      description: `Quantity for unit "${
                        record.unit || inputRow.unit
                      }" must be a whole number.`,
                    });
                    setInputRow((prev) => ({ ...prev, quantity: "" }));
                    return;
                  }
                }, 300);
              }}
            />
          </Tooltip>
        ) : (
          <Tooltip title={record.quantity}>
            <span>{record.quantity}</span>
          </Tooltip>
        ),
    },
    // {
    //   title: "Unit",
    //   dataIndex: "unit",
    //   ellipsis: true,
    //   width: 200,
    //   render: (_, record) =>
    //     record.isInput ? (
    //       <Tooltip>
    //         <Input value={inputRow.unit ? inputRow.unit : " "} readOnly />
    //       </Tooltip>
    //     ) : (
    //       <Tooltip title={inputRow.unit}>
    //         <span>{record.unit ? record.unit : "-"}</span>
    //       </Tooltip>
    //     ),
    // },

    {
      title: "Unit",
      dataIndex: "unit",
      ellipsis: true,
      width: 200,
      render: (_, record) =>
        record.isInput ? (
          <Tooltip>
            <Input
              value={stockLoading ? "" : inputRow.unit || ""}
              placeholder={
                stockLoading ? "Fetching unit..." : inputRow.unit || "-"
              }
              readOnly
            />
          </Tooltip>
        ) : (
          <Tooltip title={record.unit}>
            <span>{record.unit || "-"}</span>
          </Tooltip>
        ),
    },

    // {
    //   title: "Stock In Hand",
    //   dataIndex: "stockInHand",
    //   width: 200,
    //   ellipsis: true,
    //   render: (_, record) =>
    //     record.isInput ? (
    //       <Tooltip>
    //         <Input
    //           value={
    //             inputRow.stockInHand
    //               ? `${inputRow.stockInHand} ${inputRow.stockUnit || ""}`
    //               : "0"
    //           }
    //           readOnly
    //         />
    //       </Tooltip>
    //     ) : (
    //       <Tooltip title={`${record.stockInHand} ${record.stockUnit || ""}`}>
    //         <span>
    //           {record.stockInHand
    //             ? `${record.stockInHand} ${record.stockUnit || ""}`
    //             : "-"}
    //         </span>
    //       </Tooltip>
    //     ),
    // },
    {
      title: "Stock In Hand",
      dataIndex: "stockInHand",
      width: 200,
      ellipsis: true,
      render: (_, record) =>
        record.isInput ? (
          <Tooltip>
            <Input
              value={
                stockLoading
                  ? "" // leave value blank while loading
                  : inputRow.stockInHand
                  ? `${inputRow.stockInHand} ${inputRow.stockUnit || ""}`
                  : "0"
              }
              placeholder={
                stockLoading
                  ? "Fetching stock in hand..."
                  : inputRow.stockInHand
                  ? `${inputRow.stockInHand} ${inputRow.stockUnit || ""}`
                  : "-"
              }
              readOnly
            />
          </Tooltip>
        ) : (
          <Tooltip title={`${record.stockInHand} ${record.stockUnit || ""}`}>
            <span>
              {record.stockInHand
                ? `${record.stockInHand} ${record.stockUnit || ""}`
                : "-"}
            </span>
          </Tooltip>
        ),
    },

    {
      title: "Action",
      width: 120,
      fixed: "right",
      align: "center",
      render: (_, record) =>
        record.isInput ? (
          <Button
            className="addButton ps-4 pe-4"
            onClick={handleAdd}
            disabled={fetchingData}
            loading={fetchingData}
          >
            {fetchingData ? "Fetching" : "Add"}
          </Button>
        ) : (
          <Button
            className="deleteButton ps-3 pe-3"
            onClick={() => handleDelete(record.key)}
          >
            Delete
          </Button>
        ),
    },
  ];

  const modalColumns = [
    {
      title: "Serial Number",
      dataIndex: "Serial Number", // must match your actual key
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Part Number",
      dataIndex: "Part Number",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Item Description",
      dataIndex: "Item Description",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Quantity",
      dataIndex: "Quantity",
      render: (text) => <span>{text}</span>,
    },
    { title: "Unit", dataIndex: "Unit", render: (text) => <span>{text}</span> },
    {
      title: "Stock In Hand",
      dataIndex: "Stock In Hand",
      render: (text) => <span>{text}</span>,
    },
  ];

  useEffect(() => {
    const nowUTC = new Date();
    const dubaiOffset = 4 * 60;
    const dubaiTime = new Date(nowUTC.getTime() + dubaiOffset * 60000);

    const dubaiDayjs = dayjs(dubaiTime);
    const formatted = dubaiDayjs.format("DD-MM-YYYY");

    setDeliveryDate(formatted);

    if (username === "Admin") {
      // Admin gets dayjs object for DatePicker
      form.setFieldsValue({ date: dubaiDayjs });
    } else {
      // Non-admin gets formatted string for Input field
      form.setFieldsValue({ date: formatted });
    }

    // console.log("Non-admin deliveryDate:", formatted);
  }, []);

  const handleAdd = () => {
    if (dataSource.length >= 50) {
      notification.warning({
        message: "Limit Reached",
        description: "You can only add a maximum of 50 items.",
      });
      return;
    }

    const { partNumber, itemDescription, quantity } = inputRow;

    if (!partNumber || !itemDescription || !quantity) {
      notification.error({
        message: "Error",
        description:
          "Please fill in Part Number, Item Description and Quantity",
      });
      return;
    }
    const stock = parseInt(inputRow.stockInHand) || 0;
    const qty = parseInt(quantity) || 0;

    // Calculate existing quantity of this part number already in the table
    const existingQtyForPart = dataSource
      .filter((item) => item.partNumber === partNumber)
      .reduce((sum, item) => sum + parseInt(item.quantity || 0), 0);

    // Total requested quantity (existing + new)
    const totalRequestedQty = existingQtyForPart + qty;

    if (totalRequestedQty > stock) {
      notification.error({
        message: "Quantity Exceeds Stock",
        description: `Total quantity (${totalRequestedQty}) exceeds stock in hand (${stock}).`,
      });
      return;
    }

    // ✅ Define newData here
    const newData = {
      key: Date.now(),
      serialNumber: dataSource.length + 1,
      partNumber,
      itemDescription,
      quantity,
      stockInHand: inputRow.stockInHand || "0",
      unit: inputRow.unit || "",
      stockUnit: inputRow.stockUnit || "",
    };

    const updatedData = [...dataSource, newData].map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));

    setDataSource(updatedData);

    setInputRow({
      partNumber: "",
      itemDescription: "",
      quantity: "",
      stockInHand: "",
      unit: "",
    });
  };

  const handleDelete = (key) => {
    const updatedData = dataSource
      .filter((item) => item.key !== key)
      .map((item, index) => ({
        ...item,
        serialNumber: index + 1, // reindex after delete
      }));
    setDataSource(updatedData);
  };

  // const handleSubmit = async (values) => {
  //   if (!navigator.onLine) {
  //     notification.error({
  //       message: "No Internet Connection",
  //       description: "Please check your internet and try again.",
  //     });
  //     return;
  //   }
  //   if (dataSource.length === 0) {
  //     notification.error({
  //       message: "No Items",
  //       description: "Please add at least one item to submit.",
  //     });
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const response = await fetch(GAS_URL, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //       body: new URLSearchParams({
  //         action: "addDeliveryNote",
  //         deliveryNumber: values.deliveryNumber,
  //         // date: values.date,
  //         // date: values.date ? dayjs(values.date).format("DD-MM-YYYY") : "",
  //         date:
  //           username === "Admin"
  //             ? dayjs(values.date).format("DD-MM-YYYY")
  //             : deliveryDate,

  //         customername: values.customername,
  //         address: values.address,
  //         modeOfDelivery: values.modeOfDelivery,
  //         reference: values.reference,
  //         items: JSON.stringify(dataSource),
  //         userName: username || "-",
  //       }),
  //     });
  //     const result = await response.json();
  //     if (result.success) {
  //         generateDeliveryNotePDF(values, dataSource);

  //       notification.success({
  //         message: "Success",
  //         description: result.message,
  //       });
  //       // form.resetFields();
  //       setDataSource([]);
  //       setInputRow({
  //         partNumber: "",
  //         itemDescription: "",
  //         quantity: "",
  //         unit: "",
  //         stockInHand: "",
  //       });
  //       // Fetch new delivery number
  //       const nextRes = await fetch(GAS_URL, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //         body: new URLSearchParams({ action: "getNextDeliveryNumber" }),
  //       });

  //       const nextResult = await nextRes.json();
  //       if (nextResult.success) {
  //         form.setFieldsValue({ deliveryNumber: nextResult.deliveryNumber });
  //       }
  //       const nowUTC = new Date();
  //       const dubaiOffset = 4 * 60;
  //       const dubaiTime = new Date(nowUTC.getTime() + dubaiOffset * 60000);

  //       const dubaiDayjs = dayjs(dubaiTime);
  //       const formatted = dubaiDayjs.format("DD-MM-YYYY");

  //       setDeliveryDate(formatted);

  //       if (username === "Admin") {
  //         // Admin gets dayjs object for DatePicker
  //         form.setFieldsValue({ date: dubaiDayjs });
  //       } else {
  //         // Non-admin gets formatted string for Input field
  //         form.setFieldsValue({ date: formatted });
  //       }
  //       form.setFields([
  //         { name: "customername", value: undefined },
  //         { name: "address", value: undefined },
  //         { name: "modeOfDelivery", value: undefined },
  //         { name: "reference", value: undefined },
  //       ]);

  //       // console.log("deliveryDate for non-admin:", deliveryDate);
  //       await fetchInitialData();
  //     } else {
  //       notification.error({
  //         message: "Error",
  //         description: result.message || "Failed to add delivery note",
  //       });
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     notification.error({
  //       message: "Error",
  //       description: "Something went wrong.",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };


//Working code
  // const handleSubmit = async (values) => {
  //   if (!navigator.onLine) {
  //     notification.error({
  //       message: "No Internet Connection",
  //       description: "Please check your internet and try again.",
  //     });
  //     return;
  //   }
  //   if (dataSource.length === 0) {
  //     notification.error({
  //       message: "No Items",
  //       description: "Please add at least one item to submit.",
  //     });
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     // 1️⃣ Save form data first
  //     const response = await fetch(GAS_URL, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //       body: new URLSearchParams({
  //         action: "addDeliveryNote",
  //         deliveryNumber: values.deliveryNumber,
  //         date:
  //           username === "Admin"
  //             ? dayjs(values.date).format("DD-MM-YYYY")
  //             : deliveryDate,
  //         customername: values.customername,
  //         address: values.address,
  //         modeOfDelivery: values.modeOfDelivery,
  //         reference: values.reference,
  //         items: JSON.stringify(dataSource),
  //         userName: username || "-",
  //       }),
  //     });

  //     const result = await response.json();

  //     if (result.success) {
  //       // 2️⃣ Generate PDF in memory (don't save locally)
  //       const doc = generateDeliveryNotePDF(
  //         { ...values, paymentTerms },
  //         dataSource,
  //         false
  //       );

  //       // Convert to base64
  //       const pdfOutput = doc.output("arraybuffer");
  //       const pdfBase64 = btoa(
  //         new Uint8Array(pdfOutput).reduce(
  //           (data, byte) => data + String.fromCharCode(byte),
  //           ""
  //         )
  //       );

  //       // 3️⃣ Upload to Google Drive
  //       const uploadRes = await fetch(GAS_URL, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //         body: new URLSearchParams({
  //           action: "uploadDeliveryNotePDF",
  //           pdfBase64,
  //           fileName: `DeliveryNote_${values.deliveryNumber || "Unknown"}.pdf`,
  //         }),
  //       });

  //       const uploadResult = await uploadRes.json();
  //       if (uploadResult.success) {
  //         console.log("✅ PDF uploaded to Google Drive:", uploadResult.fileUrl);
  //       } else {
  //         console.error("❌ PDF upload failed:", uploadResult.message);
  //       }
  //       console.log("Uploading PDF to Drive...");
  //       console.log("Base64 size:", pdfBase64.length);
  //       notification.success({
  //         message: "Success",
  //         description: result.message,
  //       });

  //       // 4️⃣ Reset form state
  //       setDataSource([]);
  //       setInputRow({
  //         partNumber: "",
  //         itemDescription: "",
  //         quantity: "",
  //         unit: "",
  //         stockInHand: "",
  //       });

  //       // Fetch new delivery number
  //       const nextRes = await fetch(GAS_URL, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //         body: new URLSearchParams({ action: "getNextDeliveryNumber" }),
  //       });

  //       const nextResult = await nextRes.json();
  //       if (nextResult.success) {
  //         form.setFieldsValue({ deliveryNumber: nextResult.deliveryNumber });
  //       }

  //       // Reset date
  //       const nowUTC = new Date();
  //       const dubaiOffset = 4 * 60;
  //       const dubaiTime = new Date(nowUTC.getTime() + dubaiOffset * 60000);
  //       const dubaiDayjs = dayjs(dubaiTime);
  //       const formatted = dubaiDayjs.format("DD-MM-YYYY");
  //       setDeliveryDate(formatted);

  //       if (username === "Admin") {
  //         form.setFieldsValue({ date: dubaiDayjs });
  //       } else {
  //         form.setFieldsValue({ date: formatted });
  //       }

  //       form.setFields([
  //         { name: "customername", value: undefined },
  //         { name: "address", value: undefined },
  //         { name: "modeOfDelivery", value: undefined },
  //         { name: "reference", value: undefined },
  //       ]);

  //       await fetchInitialData();
  //     } else {
  //       notification.error({
  //         message: "Error",
  //         description: result.message || "Failed to add delivery note",
  //       });
  //     }
  //   } catch (err) {
  // console.error("Submit error:", err);
  // notification.error({
  //   message: "Error",
  //   description: err.message || "Something went wrong while submitting the form.",
  // });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

// const handleSubmit = async (values) => {
//   if (!navigator.onLine) {
//     notification.error({
//       message: "No Internet Connection",
//       description: "Please check your internet and try again.",
//     });
//     return;
//   }

//   if (dataSource.length === 0) {
//     notification.error({
//       message: "No Items",
//       description: "Please add at least one item to submit.",
//     });
//     return;
//   }

//   if (loading) return; // ⛔ prevent duplicate submit
//   setLoading(true);

//   try {
//     // Format date
//     const formattedDate =
//       username === "Admin"
//         ? dayjs(values.date).format("DD-MM-YYYY")
//         : deliveryDate;

//     // 1️⃣ Save form data first
//     const response = await fetch(GAS_URL, {
//       method: "POST",
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       body: new URLSearchParams({
//         action: "addDeliveryNote",
//         deliveryNumber: values.deliveryNumber,
//         date: formattedDate,
//         customername: values.customername,
//         address: values.address,
//         modeOfDelivery: values.modeOfDelivery,
//         reference: values.reference,
//         items: JSON.stringify(dataSource),
//         userName: username || "-",
//       }),
//     });

//     const result = await response.json();

// if (!result.success) {
//   if (result.message.includes("System is busy")) {
//     notification.warning({
//       message: "Please Retry",
//       description: "Another user is submitting a delivery note. Please try again in a moment.",
//     });
//   } else {
//     notification.error({
//       message: "Form Submission Failed",
//       description: result.message || "Failed to add delivery note.",
//     });
//   }
//   setLoading(false);
//   return;
// }

//     const confirmedDeliveryNumber = result.deliveryNumber;


//     // ✅ Form saved successfully
//     notification.success({
//       message: "Form Submitted",
//       description: "Delivery note saved successfully. Generating PDF...",
//     });

//     // 2️⃣ Generate PDF BEFORE resetting the table
//     let doc;
//     try {
//       doc = generateDeliveryNotePDF(
//         { ...values, paymentTerms, date: formattedDate, deliveryNumber: confirmedDeliveryNumber },
//         dataSource,
//         false
//       );
//     } catch (pdfErr) {
//       console.error("PDF generation failed:", pdfErr);
//       notification.warning({
//         message: "PDF Generation Error",
//         description: "Form was saved, but PDF generation failed.",
//       });
//        setLoading(false);
//       return;
//     }

//     // 3️⃣ Upload PDF
//     try {
//       const pdfOutput = doc.output("arraybuffer");
//       const pdfBase64 = btoa(
//         new Uint8Array(pdfOutput).reduce(
//           (data, byte) => data + String.fromCharCode(byte),
//           ""
//         )
//       );

//       const uploadRes = await fetch(GAS_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         body: new URLSearchParams({
//           action: "uploadDeliveryNotePDF",
//           pdfBase64,
//       fileName: `DeliveryNote_${confirmedDeliveryNumber}.pdf`,
//         }),
//       });

//       const uploadResult = await uploadRes.json();

//       if (uploadResult.success) {
//         notification.success({
//           message: "PDF Uploaded",
//           description: "Delivery note PDF uploaded to Google Drive.",
//         });
//       } else {
//         notification.warning({
//           message: "PDF Upload Failed",
//           description:
//             uploadResult.message || "Form was saved, but PDF upload failed.",
//         });
//       }
//     } catch (uploadErr) {
//       console.error("PDF upload failed:", uploadErr);
//       notification.warning({
//         message: "PDF Upload Error",
//         description: "Form was saved, but PDF upload failed.",
//       });
//       setLoading(false); 
//         return;

//     }

//     // 4️⃣ Reset table + fetch next delivery number AFTER PDF is done
//     setDataSource([]);
//     setInputRow({
//       partNumber: "",
//       itemDescription: "",
//       quantity: "",
//       unit: "",
//       stockInHand: "",
//     });

//     try {
//       const nextRes = await fetch(GAS_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         body: new URLSearchParams({ action: "getNextDeliveryNumber" }),
//       });
//       const nextResult = await nextRes.json();
//       if (nextResult.success) {
//         form.setFieldsValue({ deliveryNumber: nextResult.deliveryNumber });
//       }
//     } catch (numErr) {
//       console.error("Failed to fetch next delivery number:", numErr);
//     }

//     // Reset date
//     const nowUTC = new Date();
//     const dubaiOffset = 4 * 60;
//     const dubaiTime = new Date(nowUTC.getTime() + dubaiOffset * 60000);
//     const dubaiDayjs = dayjs(dubaiTime);
//     const todayFormatted = dubaiDayjs.format("DD-MM-YYYY");
//     setDeliveryDate(todayFormatted);

//     if (username === "Admin") {
//       form.setFieldsValue({ date: dubaiDayjs });
//     } else {
//       form.setFieldsValue({ date: todayFormatted });
//     }

//     form.setFields([
//       { name: "customername", value: undefined },
//       { name: "address", value: undefined },
//       { name: "modeOfDelivery", value: undefined },
//       { name: "reference", value: undefined },
//     ]);

//     await fetchInitialData();
//   } catch (err) {
//     console.error("Submit error:", err);
//     notification.error({
//       message: "Unexpected Error",
//       description: err.message || "Something went wrong while submitting the form.",
//     });
//   } finally {
//     setLoading(false);
//   }
// };

// const handleSubmit = async (values) => {
//   if (!navigator.onLine) {
//     notification.error({
//       message: "No Internet Connection",
//       description: "Please check your internet and try again.",
//     });
//     return;
//   }

//   if (dataSource.length === 0) {
//     notification.error({
//       message: "No Items",
//       description: "Please add at least one item to submit.",
//     });
//     return;
//   }

//   if (loading) return; // prevent duplicate submit
//   setLoading(true);

//   try {
//     // Format date
//     const formattedDate =
//       username === "Admin"
//         ? dayjs(values.date).format("DD-MM-YYYY")
//         : deliveryDate;

//     // 1️⃣ Save form data
//     const response = await fetch(GAS_URL, {
//       method: "POST",
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       body: new URLSearchParams({
//         action: "addDeliveryNote",
//         deliveryNumber: values.deliveryNumber,
//         date: formattedDate,
//         customername: values.customername,
//         address: values.address,
//         modeOfDelivery: values.modeOfDelivery,
//         reference: values.reference,
//         items: JSON.stringify(dataSource),
//         userName: username || "-",
//       }),
//     });

//     const result = await response.json();

//     if (!result.success) {
//       if (result.message.includes("System is busy")) {
//         throw new Error("System busy: another user is submitting a delivery note.");
//       } else {
//         throw new Error(result.message || "Failed to add delivery note.");
//       }
//     }

//     const confirmedDeliveryNumber = result.deliveryNumber;

//     notification.success({
//       message: "Form Submitted",
//       description: "Delivery note saved successfully. Generating PDF...",
//     });

//     // 2️⃣ Generate PDF
//     let doc;
//     // try {
//     //   doc = generateDeliveryNotePDF(
//     //     { ...values, paymentTerms, date: formattedDate, deliveryNumber: confirmedDeliveryNumber },
//     //     dataSource,
//     //     false
//     //   );
//     // } catch {
//     //   throw new Error("Form saved, but PDF generation failed.");
//     // }
//     try {
//   doc = generateDeliveryNotePDF(
//     { ...values, date: formattedDate, deliveryNumber: confirmedDeliveryNumber },
//     dataSource || [],
//     false
//   );
//   if (!doc) throw new Error("PDF generation returned null");
// } catch (pdfErr) {
//   console.error("PDF generation failed:", pdfErr);
//   throw new Error("Form saved, but PDF generation failed.");
// }


//     // 3️⃣ Upload PDF
//     try {
//       const pdfOutput = doc.output("arraybuffer");
//       const pdfBase64 = btoa(
//         new Uint8Array(pdfOutput).reduce(
//           (data, byte) => data + String.fromCharCode(byte),
//           ""
//         )
//       );

//       const uploadRes = await fetch(GAS_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         body: new URLSearchParams({
//           action: "uploadDeliveryNotePDF",
//           pdfBase64,
//           fileName: `DeliveryNote_${confirmedDeliveryNumber}.pdf`,
//         }),
//       });

//       const uploadResult = await uploadRes.json();
//       if (!uploadResult.success) {
//         throw new Error(uploadResult.message || "Form saved, but PDF upload failed.");
//       }

//       notification.success({
//         message: "PDF Uploaded",
//         description: "Delivery note PDF uploaded to Google Drive.",
//       });
//     } catch {
//       throw new Error("Form saved, but PDF upload failed.");
//     }

//     // 4️⃣ Reset form and fetch next delivery number
//     setDataSource([]);
//     setInputRow({
//       partNumber: "",
//       itemDescription: "",
//       quantity: "",
//       unit: "",
//       stockInHand: "",
//     });

//     try {
//       const nextRes = await fetch(GAS_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         body: new URLSearchParams({ action: "getNextDeliveryNumber" }),
//       });
//       const nextResult = await nextRes.json();
//       if (nextResult.success) {
//         form.setFieldsValue({ deliveryNumber: nextResult.deliveryNumber });
//       }
//     } catch (numErr) {
//       console.error("Failed to fetch next delivery number:", numErr);
//     }

//     // Reset date
//     const nowUTC = new Date();
//     const dubaiOffset = 4 * 60;
//     const dubaiTime = new Date(nowUTC.getTime() + dubaiOffset * 60000);
//     const dubaiDayjs = dayjs(dubaiTime);
//     const todayFormatted = dubaiDayjs.format("DD-MM-YYYY");
//     setDeliveryDate(todayFormatted);

//     form.setFieldsValue({
//       date: username === "Admin" ? dubaiDayjs : todayFormatted,
//       customername: undefined,
//       address: undefined,
//       modeOfDelivery: undefined,
//       reference: undefined,
//     });

//     await fetchInitialData();
//   } catch (err) {
//     console.error("Submit error:", err);
//     notification.error({
//       message: "Submission Error",
//       description: err.message,
//     });
//   } finally {
//     setLoading(false); // ✅ always runs
//   }
// };

const handleSubmit = async (values) => {
  if (!navigator.onLine) {
    notification.error({ message: "No Internet", description: "Check connection." });
    return;
  }
  if (dataSource.length === 0) {
    notification.error({ message: "No Items", description: "Please add at least one item." });
    return;
  }
  if (loading) return;
  setLoading(true);

  try {
    const formattedDate =
      username === "Admin" ? dayjs(values.date).format("DD-MM-YYYY") : deliveryDate;

    // 1️⃣ Save form data only
    const response = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        action: "addDeliveryNote",
        date: formattedDate,
        customername: values.customername,
        address: values.address,
        modeOfDelivery: values.modeOfDelivery,
        reference: values.reference,
        items: JSON.stringify(dataSource),
        userName: username || "-",
      }),
    });

    const result = await response.json();
    if (!result.success) throw new Error(result.message || "Failed to add delivery note.");

    const confirmedDeliveryNumber = result.deliveryNumber;

    // 2️⃣ Generate PDF with confirmed delivery number
    let doc;
    try {
      doc = generateDeliveryNotePDF(
        { ...values, date: formattedDate, paymentTerms, deliveryNumber: confirmedDeliveryNumber },
        dataSource,
        false
      );
    } catch (pdfErr) {
      console.error("PDF generation failed:", pdfErr);
      throw new Error("Form saved, but PDF generation failed.");
    }

    const pdfOutput = doc.output("arraybuffer");
    const pdfBase64 = btoa(
      new Uint8Array(pdfOutput).reduce((data, byte) => data + String.fromCharCode(byte), "")
    );

    // 3️⃣ Upload PDF separately
    const uploadRes = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        action: "uploadDeliveryNotePDF",
        pdfBase64,
        fileName: `DeliveryNote_${confirmedDeliveryNumber}.pdf`,
      }),
    });

    const uploadResult = await uploadRes.json();
    if (!uploadResult.success) throw new Error(uploadResult.message || "PDF upload failed.");

    notification.success({
      message: "Success",
      description: `Delivery Note ${confirmedDeliveryNumber} saved and PDF uploaded.`,
    });

    // 4️⃣ Reset form (same as before)
  // 4️⃣ Reset form fields + table
setDataSource([]);
setInputRow({ partNumber: "", itemDescription: "", quantity: "", unit: "", stockInHand: "" });

// Reset AntD form fields
form.resetFields();

// Reset delivery date
const nowUTC = new Date();
const dubaiOffset = 4 * 60; // UTC+4
const dubaiTime = new Date(nowUTC.getTime() + dubaiOffset * 60000);
const dubaiDayjs = dayjs(dubaiTime);
const todayFormatted = dubaiDayjs.format("DD-MM-YYYY");
setDeliveryDate(todayFormatted);

// Admin vs Non-Admin reset
form.setFieldsValue({
  date: username === "Admin" ? dubaiDayjs : todayFormatted,
  customername: undefined,
  address: undefined,
  modeOfDelivery: undefined,
  reference: undefined,
});

// Fetch new delivery number etc.
await fetchInitialData();


  } catch (err) {
    console.error("Submit error:", err);
    notification.error({ message: "Submission Error", description: err.message });
  } finally {
    setLoading(false);
  }
};

  const fetchedTablecolumns = [
    {
      title: "Delivery Number",
      dataIndex: "Delivery Number",
      width: 200,
      render: (text) => (
        <Tooltip title={text || ""}>
          <span>{text || ""}</span>
        </Tooltip>
      ),
    },
    {
      title: "Date",
      dataIndex: "Date",
      width: 120,
      render: (date) => {
        const d = parseToDayjs(date);
        const formatted = d ? d.format("DD-MM-YYYY") : "";
        return (
          <Tooltip title={formatted || ""}>
            <span>{formatted || ""}</span>
          </Tooltip>
        );
      },
    },
    {
      title: "Customer Name",
      dataIndex: "Customer Name",
      width: 250,
      render: (text) => (
        <Tooltip title={text || ""}>
          <span>{text || ""}</span>
        </Tooltip>
      ),
    },
    {
      title: "Address",
      dataIndex: "Address",
      width: 300,
      render: (text) => (
        <Tooltip title={text || ""}>
          <span>{text || ""}</span>
        </Tooltip>
      ),
    },
    {
      title: "Mode of delivery",
      dataIndex: "Mode of delivery",
      width: 200,
      render: (text) => (
        <Tooltip title={text || ""}>
          <span>{text || ""}</span>
        </Tooltip>
      ),
    },
    {
      title: "Reference",
      dataIndex: "Reference",
      width: 200,
      render: (text) => (
        <Tooltip title={text || ""}>
          <span>{text || ""}</span>
        </Tooltip>
      ),
    },
    {
      title: "Serial Number",
      dataIndex: "Serial Number",
      width: 130,
      render: (text) => (
        <Tooltip title={text || ""}>
          <span>{text || ""}</span>
        </Tooltip>
      ),
    },
    {
      title: "Part Number",
      dataIndex: "Part Number",
      width: 130,
      render: (text) => (
        <Tooltip title={text || ""}>
          <span>{text || ""}</span>
        </Tooltip>
      ),
    },
    {
      title: "Item Description",
      dataIndex: "Item Description",
      width: 300,
      render: (text) => (
        <Tooltip title={text || ""}>
          <span>{text || ""}</span>
        </Tooltip>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "Quantity",
      width: 100,
      render: (text) => (
        <Tooltip title={text || ""}>
          <span>{text || ""}</span>
        </Tooltip>
      ),
    },
    {
      title: "Unit",
      dataIndex: "Unit",
      width: 100,
      render: (text) => (
        <Tooltip title={text || ""}>
          <span>{text || ""}</span>
        </Tooltip>
      ),
    },
    {
      title: "Stock In Hand",
      dataIndex: "Stock In Hand",
      width: 130,
      render: (text) => (
        <Tooltip title={text || ""}>
          <span>{text || ""}</span>
        </Tooltip>
      ),
    },
    {
      title: "Modified User",
      dataIndex: "Modified User",
      width: 200,
      render: (text) => (
        <Tooltip title={text || ""}>
          <span>{text || ""}</span>
        </Tooltip>
      ),
    },
    {
      title: "Modified Date & Time",
      dataIndex: "Modified Date & Time",
      width: 180,
      render: (date) => {
        const d = parseToDayjs(date);
        const formatted = d ? d.format("DD-MM-YYYY HH:mm:ss") : "";
        return (
          <Tooltip title={formatted || "-"}>
            <span>{formatted || "-"}</span>
          </Tooltip>
        );
      },
    },
    {
      title: "Action",
      width: 110,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <Button
          className="addButton"
          onClick={() => {
            // Fill form
            viewForm.setFieldsValue(record);

            // Keep the full partsUsed array from groupedData
            setSelectedRow(record);

            setIsModalVisible(true);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  const filteredData = fetchedData.filter((item) => {
    const matchesSearch =
      searchText === "" ||
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchText.toLowerCase())
      );

    const itemDate = parseToDayjs(item.Date);
    const matchesStart =
      !startDate || (itemDate && itemDate.isSameOrAfter(startDate, "day"));
    const matchesEnd =
      !endDate || (itemDate && itemDate.isSameOrBefore(endDate, "day"));

    return matchesSearch && matchesStart && matchesEnd;
  });

  const groupedData = Object.values(
    filteredData.reduce((acc, item) => {
      const deliveryNo = item["Delivery Number"];
      if (!acc[deliveryNo]) {
        acc[deliveryNo] = {
          ...item,
          partsUsed: [],
        };
      }
      acc[deliveryNo].partsUsed.push({
        "Serial Number": item["Serial Number"],
        "Part Number": item["Part Number"],
        "Item Description": item["Item Description"],
        Quantity: item["Quantity"],
        Unit: item["Unit"],
        "Stock In Hand": item["Stock In Hand"],
      });
      return acc;
    }, {})
  );

  const handleExport = () => {
    const now = dayjs().format("DD-MM-YYYY_HH-mm-ss");
    const fileName = `Delivery_Note_Report_${now}.xlsx`;

    const headerStyle = {
      font: { bold: true, sz: 12 },
      alignment: { horizontal: "center", vertical: "center", wrapText: true },
      border: getAllBorders(),
      fill: { patternType: "solid", fgColor: { rgb: "FFFF00" } }, // Yellow background
    };

    const header = [
      { v: "Delivery Number", t: "s", s: headerStyle },
      { v: "Date", t: "s", s: headerStyle },
      { v: "Customer Name", t: "s", s: headerStyle },
      { v: "Address", t: "s", s: headerStyle },
      { v: "Mode of delivery", t: "s", s: headerStyle },
      { v: "Reference", t: "s", s: headerStyle },
      { v: "Serial Number", t: "s", s: headerStyle },
      { v: "Part Number", t: "s", s: headerStyle },
      { v: "Item Description", t: "s", s: headerStyle },
      { v: "Quantity", t: "s", s: headerStyle },
      { v: "Unit", t: "s", s: headerStyle },
      { v: "Stock In Hand", t: "s", s: headerStyle },
      { v: "Modified User", t: "s", s: headerStyle },
      { v: "Modified Date & Time", t: "s", s: headerStyle },
    ];

    const data = [];
    groupedData.forEach((item) => {
      (item.partsUsed || []).forEach((part) => {
        data.push([
          { v: item["Delivery Number"], s: { border: getAllBorders() } },
          { v: item["Date"], s: { border: getAllBorders() } },
          { v: item["Customer Name"], s: { border: getAllBorders() } },
          { v: item["Address"], s: { border: getAllBorders() } },
          { v: item["Mode of delivery"], s: { border: getAllBorders() } },
          { v: item["Reference"], s: { border: getAllBorders() } },
          { v: part["Serial Number"], s: { border: getAllBorders() } },
          { v: part["Part Number"], s: { border: getAllBorders() } },
          { v: part["Item Description"], s: { border: getAllBorders() } },
          { v: part["Quantity"], s: { border: getAllBorders() } },
          { v: part["Unit"], s: { border: getAllBorders() } },
          { v: part["Stock In Hand"], s: { border: getAllBorders() } },
          { v: item["Modified User"], s: { border: getAllBorders() } },
          { v: item["Modified Date & Time"], s: { border: getAllBorders() } },
        ]);
      });
    });

    const ws = XLSX.utils.aoa_to_sheet([header, ...data]);

    // Auto column width
    const colWidths = header.map((_, colIndex) => {
      let maxLength = 0;
      [header, ...data].forEach((row) => {
        const cell = row[colIndex];
        const value = cell && cell.v != null ? String(cell.v) : "";
        maxLength = Math.max(maxLength, value.length);
      });
      return { wch: Math.min(maxLength * 2, 60) }; // double width, max 60
    });
    ws["!cols"] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Delivery Note");

    XLSX.writeFile(wb, fileName);

    notification.success({
      message: "Export Successful",
      description: `File has been downloaded successfully.`,
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

  const fetchDeliveryNotesData = async () => {
    try {
      setLoadingFetchedData(true);

      const res = await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ action: "getDeliveryNotes" }),
      });

      const result = await res.json();
      if (result.success) {
        const cleaned = result.data.map((row) => {
          const newRow = {};
          Object.keys(row).forEach((key) => {
            newRow[key.trim()] = row[key];
          });
          return newRow;
        });
        setFetchedData(cleaned);
      }
    } catch (err) {
      console.error("Error fetching delivery notes:", err);
      notification.error({
        message: "Error",
        description: "Failed to fetch delivery notes",
        placement: "bottomRight",
      });
    } finally {
      setLoadingFetchedData(false);
    }
  };

  //Working code restrict 11-25 columns from page 2
  // const generateDeliveryNotePDF = (formValues, items = []) => {
  //   const doc = new jsPDF();

  //   const rowsFirstPage = 10;
  //   const rowsOtherPages = 15;

  //   // Manually chunk the items into pages
  //   const pagesData = [];
  //   if (items.length <= rowsFirstPage) {
  //     pagesData.push(items);
  //   } else {
  //     pagesData.push(items.slice(0, rowsFirstPage));
  //     let remaining = items.slice(rowsFirstPage);
  //     while (remaining.length > 0) {
  //       pagesData.push(remaining.slice(0, rowsOtherPages));
  //       remaining = remaining.slice(rowsOtherPages);
  //     }
  //   }

  //   const totalPages = pagesData.length;

  //   pagesData.forEach((pageItems, pageIndex) => {
  //     const currentPage = pageIndex + 1;
  //     if (currentPage > 1) doc.addPage();

  //     let tableStartY = 20;

  //     // First page header
  //     if (currentPage === 1) {
  //       doc.addImage(HaitianLogo, "PNG", 10, 10, 70, 25);

  //       // Company Info
  //       doc.setFontSize(11);
  //       let leftY = 40;
  //       doc.text("Hamriyah Free Zone", 14, leftY);
  //       doc.text("Po Box:496, Sharjah, U.A.E", 14, leftY + 5);
  //       doc.text("Sharjah", 14, leftY + 10);
  //       doc.text("U.A.E", 14, leftY + 15);
  //       doc.text("TRN100008343400003", 14, leftY + 20);

  //       // Title & Note Info
  //       const rightX = 130;
  //       doc.setFontSize(30);
  //       doc.text("Delivery Note", rightX, 22);

  //       doc.setFontSize(12);
  //       doc.text(`Delivery Note Number: ${formValues.deliveryNumber || ""}`, rightX, 30);
  //       doc.text(`Delivery Date: ${formValues.date || ""}`, rightX, 36);

  //       // Deliver To
  //       let yCursor = leftY + 30;
  //       doc.setFont("helvetica", "bold");
  //       doc.setFontSize(12);
  //       doc.text("Deliver To:", 14, yCursor);

  //       doc.setFont("helvetica", "normal");
  //       doc.setFontSize(10);
  //       yCursor += 6;
  //       doc.text(formValues.customername || "", 14, yCursor);
  //       yCursor += 5;
  //       doc.text(formValues.address || "", 14, yCursor);

  //       tableStartY = 100; // space for header
  //     }

  //     // Table for this page
  //     autoTable(doc, {
  //       startY: tableStartY,
  //       head: [["#", "Item & Description", "Qty"]],
  //       body: pageItems.map((item, idx) => [
  //         pageIndex === 0
  //           ? idx + 1
  //           : rowsFirstPage + (pageIndex - 1) * rowsOtherPages + idx + 1,
  //         `${item.itemDescription || ""}\n${item.partNumber || ""}`,
  //         item.quantity || ""
  //       ]),
  //       margin: { left: 14, right: 14 },
  //       styles: {
  //         fontSize: 10,
  //         cellPadding: 3,
  //         valign: "middle",
  //         textColor: [0, 0, 0],
  //       },
  //       headStyles: {
  //         fillColor: [40, 40, 40],
  //         textColor: [255, 255, 255],
  //         halign: "left",
  //       },
  //       bodyStyles: {
  //         textColor: [0, 0, 0],
  //       },
  //       alternateRowStyles: {
  //         fillColor: [245, 245, 245], // striped rows
  //       },
  //       columnStyles: {
  //         0: { halign: "center", cellWidth: 10 },
  //         1: { halign: "left", cellWidth: 152 },
  //         2: { halign: "center", cellWidth: 20 },
  //       },
  //       pageBreak: 'avoid', // prevent extra autoTable pages
  //     });

  //     // Footer: Page number
  //     const pageHeight = doc.internal.pageSize.height;
  //     doc.setFontSize(9);
  //     doc.text(
  //       `Page ${currentPage} of ${totalPages}`,
  //       doc.internal.pageSize.width / 2,
  //       pageHeight - 5,
  //       { align: "center" }
  //     );

  //     // Signature only on last page
  //     if (currentPage === totalPages) {
  //       doc.setLineDash([2, 2], 0);
  //       doc.line(14, pageHeight - 25, 80, pageHeight - 25);
  //       doc.setLineDash([]);
  //       doc.text("Authorized Signature", 14, pageHeight - 20);
  //     }
  //   });

  //   doc.save(`DeliveryNote_${formValues.deliveryNumber || "Unknown"}.pdf`);
  // };

  // const generateDeliveryNotePDF = (formValues, items = []) => {
  //   const doc = new jsPDF();
  //   const pageHeight = doc.internal.pageSize.height;
  //   const bottomMargin = 30;
  //   const firstPageRowLimit = 10; // hard cap for first page
  //   const usableHeightFirstPage = pageHeight - bottomMargin - 100; // space after header
  //   const usableHeightOtherPages = pageHeight - bottomMargin - 20; // space after small margin

  //   const allPages = [];

  //   // Function to chunk items by height
  //   const chunkByHeight = (arr, startY, usableHeight) => {
  //     const chunk = [];
  //     let yCursor = startY;
  //     arr.forEach((item, idx) => {
  //       // Measure row height (approx)
  //       const textLines = doc.splitTextToSize(
  //         `${item.itemDescription || ""}\n${item.partNumber || ""}`,
  //         152
  //       );
  //       const rowHeight = textLines.length * 5 + 6; // padding included
  //       if (yCursor + rowHeight > startY + usableHeight && chunk.length > 0) {
  //         return; // stop adding more
  //       }
  //       chunk.push(item);
  //       yCursor += rowHeight;
  //     });
  //     return chunk;
  //   };

  //   // First page chunk (strict 10 rows max)
  //   const firstPageItems = items.slice(0, firstPageRowLimit);
  //   allPages.push(firstPageItems);

  //   // Remaining items chunked dynamically
  //   let remaining = items.slice(firstPageRowLimit);
  //   while (remaining.length > 0) {
  //     const pageItems = chunkByHeight(remaining, 20, usableHeightOtherPages);
  //     allPages.push(pageItems);
  //     remaining = remaining.slice(pageItems.length);
  //   }

  //   const totalPages = allPages.length;

  //   allPages.forEach((pageItems, pageIndex) => {
  //     const currentPage = pageIndex + 1;
  //     if (currentPage > 1) doc.addPage();

  //     let tableStartY = 20;

  //     // First page header
  //     if (currentPage === 1) {
  //       doc.addImage(HaitianLogo, "PNG", 10, 10, 70, 25);

  //       // Company Info
  //       doc.setFontSize(11);
  //       let leftY = 40;
  //       doc.text("Hamriyah Free Zone", 14, leftY);
  //       doc.text("Po Box:496, Sharjah, U.A.E", 14, leftY + 5);
  //       doc.text("Sharjah", 14, leftY + 10);
  //       doc.text("U.A.E", 14, leftY + 15);
  //       doc.text("TRN100008343400003", 14, leftY + 20);

  //       // Title & Note Info
  //       const rightX = 130;
  //       doc.setFontSize(30);
  //       doc.text("Delivery Note", rightX, 22);

  //       doc.setFontSize(12);
  //       doc.text(`Delivery Note Number: ${formValues.deliveryNumber || ""}`, rightX, 30);
  //       doc.text(`Delivery Date: ${formValues.date || ""}`, rightX, 36);

  //       // Deliver To
  //       let yCursor = leftY + 30;
  //       doc.setFont("helvetica", "bold");
  //       doc.setFontSize(12);
  //       doc.text("Deliver To:", 14, yCursor);

  //       doc.setFont("helvetica", "normal");
  //       doc.setFontSize(10);
  //       yCursor += 6;
  //       doc.text(formValues.customername || "", 14, yCursor);
  //       yCursor += 5;
  //       doc.text(formValues.address || "", 14, yCursor);

  //       tableStartY = 100; // space after header
  //     }

  //     // Table
  //     autoTable(doc, {
  //       startY: tableStartY,
  //       head: [["#", "Item & Description", "Qty"]],
  //       // body: pageItems.map((item, idx) => [
  //       //   pageIndex === 0
  //       //     ? idx + 1
  //       //     : firstPageRowLimit + (pageIndex - 1) * 999 + idx + 1, // numbering continues
  //       //   `${item.itemDescription || ""}\n${item.partNumber || ""}`,
  //       //   item.quantity || ""
  //       // ]),
  //       body: pageItems.map((item, idx) => {
  //   // Calculate row number based on all previous pages' lengths
  //   const previousRowsCount = allPages
  //     .slice(0, pageIndex)
  //     .reduce((sum, arr) => sum + arr.length, 0);

  //   return [
  //     previousRowsCount + idx + 1,
  //     `${item.itemDescription || ""}\n${item.partNumber || ""}`,
  //     item.quantity || ""
  //   ];
  // }),

  //       margin: { left: 14, right: 14 },
  //       styles: {
  //         fontSize: 10,
  //         cellPadding: 3,
  //         valign: "middle",
  //         textColor: [0, 0, 0],
  //       },
  //       headStyles: {
  //         fillColor: [40, 40, 40],
  //         textColor: [255, 255, 255],
  //         halign: "left",
  //       },
  //       bodyStyles: {
  //         textColor: [0, 0, 0],
  //       },
  //       alternateRowStyles: {
  //         fillColor: [245, 245, 245], // striped rows
  //       },
  //       columnStyles: {
  //         0: { halign: "center", cellWidth: 10 },
  //         1: { halign: "left", cellWidth: 152 },
  //         2: { halign: "center", cellWidth: 20 },
  //       },
  //       pageBreak: 'avoid',
  //     });

  //     // Footer: Page number
  //     doc.setFontSize(9);
  //     doc.text(
  //       `Page ${currentPage} of ${totalPages}`,
  //       doc.internal.pageSize.width / 2,
  //       pageHeight - 5,
  //       { align: "center" }
  //     );

  //     // Signature only on last page
  //     if (currentPage === totalPages) {
  //       doc.setLineDash([2, 2], 0);
  //       doc.line(14, pageHeight - 25, 80, pageHeight - 25);
  //       doc.setLineDash([]);
  //       doc.text("Authorized Signature", 14, pageHeight - 20);
  //     }
  //   });

  //   doc.save(`DeliveryNote_${formValues.deliveryNumber || "Unknown"}.pdf`);
  // };

  //Working code
  // const generateDeliveryNotePDF = (formValues, items = [], saveLocally = true) => {
  //   const doc = new jsPDF();
  //   const pageHeight = doc.internal.pageSize.height;
  //   const bottomMargin = 30;
  //   const firstPageRowLimit = 10;
  //   const usableHeightFirstPage = pageHeight - bottomMargin - 100;
  //   const usableHeightOtherPages = pageHeight - bottomMargin - 20;

  //   const allPages = [];

  //   // Chunk items by height
  //   const chunkByHeight = (arr, startY, usableHeight) => {
  //     const chunk = [];
  //     let yCursor = startY;
  //     arr.forEach((item) => {
  //       const textLines = doc.splitTextToSize(
  //         `${item.itemDescription || ""}\n${item.partNumber || ""}`,
  //         152
  //       );
  //       const rowHeight = textLines.length * 5 + 6;
  //       if (yCursor + rowHeight > startY + usableHeight && chunk.length > 0) {
  //         return;
  //       }
  //       chunk.push(item);
  //       yCursor += rowHeight;
  //     });
  //     return chunk;
  //   };

  //   const firstPageItems = items.slice(0, firstPageRowLimit);
  //   allPages.push(firstPageItems);

  //   let remaining = items.slice(firstPageRowLimit);
  //   while (remaining.length > 0) {
  //     const pageItems = chunkByHeight(remaining, 20, usableHeightOtherPages);
  //     allPages.push(pageItems);
  //     remaining = remaining.slice(pageItems.length);
  //   }

  //   const totalPages = allPages.length;

  //   allPages.forEach((pageItems, pageIndex) => {
  //     const currentPage = pageIndex + 1;
  //     if (currentPage > 1) doc.addPage();
  //     let tableStartY = 20;

  //     if (currentPage === 1) {
  //       doc.addImage(HaitianLogo, "PNG", 10, 10, 70, 25);
  //       doc.setFontSize(11);
  //       let leftY = 40;
  //       doc.text("Haitian Middle East LLC", 14, leftY);
  //       doc.text("Umm El Thoub,", 14, leftY + 5);
  //       doc.text("Umm Al Quwain", 14, leftY + 10);
  //       doc.text("United Arab Emirates", 14, leftY + 15);
  //       doc.text("TRN100008343400003", 14, leftY + 20);

  //       const rightX = 130;
  //       doc.setFontSize(30);
  //       doc.text("Delivery Note", rightX, 22);
  //       doc.setFontSize(12);
  //       doc.text(`Delivery Note Number: ${formValues.deliveryNumber || ""}`, rightX, 30);
  //       doc.text(`Delivery Date: ${formValues.date || ""}`, rightX, 36);

  //       let yCursor = leftY + 30;
  //       doc.setFont("helvetica", "bold");
  //       doc.setFontSize(12);
  //       doc.text("Deliver To:", 14, yCursor);

  //       doc.setFont("helvetica", "normal");
  //       doc.setFontSize(10);
  //       yCursor += 6;
  //       doc.text(formValues.customername || "", 14, yCursor);
  //       yCursor += 5;
  //       doc.text(formValues.address || "", 14, yCursor);

  //       tableStartY = 100;
  //     }

  //     autoTable(doc, {
  //       startY: tableStartY,
  //       head: [["#", "Item & Description", "Qty"]],
  //       body: pageItems.map((item, idx) => {
  //         const previousRowsCount = allPages
  //           .slice(0, pageIndex)
  //           .reduce((sum, arr) => sum + arr.length, 0);
  //         return [
  //           previousRowsCount + idx + 1,
  //           `${item.itemDescription || ""}\n${item.partNumber || ""}`,
  //           item.quantity || ""
  //         ];
  //       }),
  //       margin: { left: 14, right: 14 },
  //       styles: {
  //         fontSize: 10,
  //         cellPadding: 3,
  //         valign: "middle",
  //         textColor: [0, 0, 0],
  //       },
  //       headStyles: {
  //         fillColor: [40, 40, 40],
  //         textColor: [255, 255, 255],
  //         halign: "left",
  //       },
  //       bodyStyles: {
  //         textColor: [0, 0, 0],
  //       },
  //       alternateRowStyles: {
  //         fillColor: [245, 245, 245],
  //       },
  //       columnStyles: {
  //         0: { halign: "center", cellWidth: 10 },
  //         1: { halign: "left", cellWidth: 152 },
  //         2: { halign: "center", cellWidth: 20 },
  //       },
  //       pageBreak: 'avoid',
  //     });

  //     doc.setFontSize(9);
  //     doc.text(
  //       `Page ${currentPage} of ${totalPages}`,
  //       doc.internal.pageSize.width / 2,
  //       pageHeight - 5,
  //       { align: "center" }
  //     );

  //     if (currentPage === totalPages) {
  //       doc.setLineDash([2, 2], 0);
  //       doc.line(14, pageHeight - 25, 80, pageHeight - 25);
  //       doc.setLineDash([]);
  //       doc.text("Authorized Signature", 14, pageHeight - 20);
  //     }
  //   });

  //   if (saveLocally) {
  //     doc.save(`DeliveryNote_${formValues.deliveryNumber || "Unknown"}.pdf`);
  //   }

  //   return doc; // ✅ return doc so .output() works
  // };

  // const generateDeliveryNotePDF = (formValues, items = [], saveLocally = true) => {
  //   const doc = new jsPDF();
  //   const pageWidth = doc.internal.pageSize.width;
  //   const pageHeight = doc.internal.pageSize.height;

  //   // --- Compute a safe header height (dynamic if address wraps)
  //   doc.setFont("helvetica", "normal");
  //   doc.setFontSize(10);
  //   const addressLines = doc.splitTextToSize(formValues.address || "", 90); // wrap to ~90mm
  //   const deliverToBlockHeight = 12 /*label + gap*/ + 5 /*name*/ + (addressLines.length * 5);
  //   const HEADER_HEIGHT = Math.max(100, 70 + deliverToBlockHeight); // ensure enough room
  //   const BOTTOM_MARGIN = 30;

  //   const drawHeader = () => {
  //     // Logo
  //     doc.addImage(HaitianLogo, "PNG", 10, 10, 70, 25);

  //     // Company info (left)
  //     doc.setFontSize(11);
  //     let leftY = 40;
  //     doc.text("Haitian Middle East LLC", 14, leftY);
  //     doc.text("Umm El Thoub,", 14, leftY + 5);
  //     doc.text("Umm Al Quwain", 14, leftY + 10);
  //     doc.text("United Arab Emirates", 14, leftY + 15);
  //     doc.text("TRN100008343400003", 14, leftY + 20);

  //     // Title + meta (right)
  //     const rightX = 130;
  //     doc.setFontSize(30);
  //     doc.text("Delivery Note", rightX, 22);
  //     doc.setFontSize(12);
  //     doc.text(`Delivery Note Number: ${formValues.deliveryNumber || ""}`, rightX, 30);
  //     doc.text(`Delivery Date: ${formValues.date || ""}`, rightX, 36);

  //     // Deliver To
  //     let yCursor = leftY + 30;
  //     doc.setFont("helvetica", "bold");
  //     doc.setFontSize(12);
  //     doc.text("Deliver To:", 14, yCursor);

  //     doc.setFont("helvetica", "normal");
  //     doc.setFontSize(10);
  //     yCursor += 6;
  //     const name = formValues.customername || "";
  //     doc.text(name, 14, yCursor);
  //     yCursor += 5;
  //     doc.text(addressLines, 14, yCursor); // wrapped lines
  //   };

  //   autoTable(doc, {
  //     head: [["#", "Item & Description", "Qty"]],
  //     body: items.map((item, idx) => [
  //       idx + 1,
  //       `${item.itemDescription || ""}\n${item.partNumber || ""}`,
  //       item.quantity || ""
  //     ]),
  //     // Reserve space for header/footer on *every* page:
  //     margin: { top: HEADER_HEIGHT + 6, bottom: BOTTOM_MARGIN, left: 14, right: 14 },
  //     styles: {
  //       fontSize: 10,
  //       cellPadding: 3,
  //       valign: "middle",
  //       textColor: [0, 0, 0],
  //     },
  //     headStyles: {
  //       fillColor: [40, 40, 40],
  //       textColor: [255, 255, 255],
  //       halign: "left",
  //     },
  //     alternateRowStyles: { fillColor: [245, 245, 245] },
  //     columnStyles: {
  //       0: { halign: "center", cellWidth: 10 },
  //       1: { halign: "left", cellWidth: 152 },
  //       2: { halign: "center", cellWidth: 20 },
  //     },
  //     pageBreak: "auto",
  //     // Draw header on every page (table will not overlap because of margin.top)
  //     didDrawPage: () => {
  //       drawHeader();
  //     },
  //   });

  //   // --- After the table is finished, add page numbers for all pages
  //   const total = doc.getNumberOfPages();
  //   for (let i = 1; i <= total; i++) {
  //     doc.setPage(i);
  //     doc.setFontSize(9);
  //     doc.text(`Page ${i} of ${total}`, pageWidth / 2, pageHeight - 5, { align: "center" });
  //   }

  //   // --- Signature only on the last page
  //   doc.setPage(total);
  //   doc.setLineDash([2, 2], 0);
  //   doc.line(14, pageHeight - 25, 80, pageHeight - 25);
  //   doc.setLineDash([]);
  //   doc.text("Authorized Signature", 14, pageHeight - 20);

  //   if (saveLocally) {
  //     doc.save(`DeliveryNote_${formValues.deliveryNumber || "Unknown"}.pdf`);
  //   }
  //   return doc;
  // };

  // const generateDeliveryNotePDF = (formValues, items = [], saveLocally = true) => {
  //   const doc = new jsPDF();
  //   const pageWidth = doc.internal.pageSize.width;
  //   const pageHeight = doc.internal.pageSize.height;

  //   const BOTTOM_MARGIN = 45; // enough space for footer + signature

  //   // Prepare wrapped lines for "Deliver To"
  //   doc.setFontSize(10);
  //   const deliverToNameLines = doc.splitTextToSize(formValues.customername || "", pageWidth - 28);
  //   const deliverToAddressLines = doc.splitTextToSize(formValues.address || "", pageWidth - 28);
  //   const deliverToHeight =
  //     deliverToNameLines.length * 5 + deliverToAddressLines.length * 5 + 15; // padding included

  //   const HEADER_HEIGHT = 50 + deliverToHeight;

  //   // Draw header (customer info)
  //   const drawHeader = () => {
  //     // Logo
  //     doc.addImage(HaitianLogo, "PNG", 10, 10, 70, 25);

  //     // Title & delivery info
  //     const rightX = 130;
  //     doc.setFontSize(30);
  //     doc.text("Delivery Note", rightX, 22);
  //     doc.setFontSize(12);
  //     doc.text(`Delivery Note Number: ${formValues.deliveryNumber || ""}`, rightX, 30);
  //     doc.text(`Delivery Date: ${formValues.date || ""}`, rightX, 36);

  //     // Deliver To
  //     let yCursor = 50;
  //     doc.setFont("helvetica", "bold");
  //     doc.setFontSize(12);
  //     doc.text("Deliver To:", 14, yCursor);

  //     doc.setFont("helvetica", "normal");
  //     doc.setFontSize(10);
  //     yCursor += 3;
  //     doc.text(deliverToNameLines, 14, yCursor);
  //     yCursor += deliverToNameLines.length * 5;
  //     doc.text(deliverToAddressLines, 14, yCursor);
  //   };

  //   // Draw footer (company info + page number)
  //   const drawFooter = (pageNum, totalPages) => {
  //     doc.setFontSize(9);

  //     // Company info (now in footer)
  //     const companyLines = [
  //       "Haitian Middle East LLC",
  //       "Umm El Thoub,",
  //       "Umm Al Quwain",
  //       "United Arab Emirates",
  //       "TRN100008343400003"
  //     ];
  //     let footerY = pageHeight - 25;
  //     companyLines.forEach(line => {
  //       doc.text(line, 14, footerY);
  //       footerY += 4;
  //     });

  //     // Page number
  //     doc.text(
  //       `Page ${pageNum} of ${totalPages}`,
  //       pageWidth / 2,
  //       pageHeight - 5,
  //       { align: "center" }
  //     );

  //     // Signature only on last page
  //     if (pageNum === totalPages) {
  //       doc.setLineDash([2, 2], 0);
  //       doc.line(14, pageHeight - BOTTOM_MARGIN, 80, pageHeight - BOTTOM_MARGIN);
  //       doc.setLineDash([]);
  //       doc.text("Authorized Signature", 14, pageHeight - BOTTOM_MARGIN + 5);
  //     }
  //   };

  //   // Table
  //   autoTable(doc, {
  //     head: [["#", "Item & Description", "Qty"]],
  //     body: items.map((item, idx) => [
  //       idx + 1,
  //       `${item.itemDescription || ""}\n${item.partNumber || ""}`,
  //       item.quantity || ""
  //     ]),
  //     margin: { top: HEADER_HEIGHT, bottom: BOTTOM_MARGIN },
  //     styles: {
  //       fontSize: 10,
  //       cellPadding: 3,
  //       valign: "middle",
  //       textColor: [0, 0, 0],
  //     },
  //     headStyles: {
  //       fillColor: [40, 40, 40],
  //       textColor: [255, 255, 255],
  //       halign: "left",
  //     },
  //     alternateRowStyles: { fillColor: [245, 245, 245] },
  //     columnStyles: {
  //       0: { halign: "center", cellWidth: 10 },
  //       1: { halign: "left", cellWidth: 152 },
  //       2: { halign: "center", cellWidth: 20 },
  //     },
  //     pageBreak: "auto",
  //     didDrawPage: () => {
  //       drawHeader();
  //     }
  //   });

  //   // Add footer for all pages
  //   const totalPages = doc.getNumberOfPages();
  //   for (let i = 1; i <= totalPages; i++) {
  //     doc.setPage(i);
  //     drawFooter(i, totalPages);
  //   }

  //   if (saveLocally) {
  //     doc.save(`DeliveryNote_${formValues.deliveryNumber || "Unknown"}.pdf`);
  //   }
  //   return doc;
  // };

  // const generateDeliveryNotePDF = (formValues, items = [], saveLocally = true) => {
  //   const doc = new jsPDF();
  //   const pageWidth = doc.internal.pageSize.width;
  //   const pageHeight = doc.internal.pageSize.height;

  //   const BOTTOM_MARGIN = 100; // enough space for footer + signature

  //   // Prepare wrapped lines for "Deliver To"
  //   doc.setFontSize(10);
  //   const deliverToNameLines = doc.splitTextToSize(formValues.customername || "", pageWidth - 28);
  //   const deliverToAddressLines = doc.splitTextToSize(formValues.address || "", pageWidth - 28);
  //   const paymentTermsLines = doc.splitTextToSize(formValues.paymentTerms || "", pageWidth - 28);

  //   const deliverToHeight = deliverToNameLines.length * 5 + deliverToAddressLines.length * 5 +  paymentTermsLines.length * 5  + 15; // padding included

  //   const HEADER_HEIGHT = 50 + deliverToHeight;

  //   // Draw header (customer info)
  //   const drawHeader = () => {
  //     // Logo
  //     doc.addImage(HaitianLogo, "PNG", 10, 10, 70, 25);

  //     // Title & delivery info
  //     const rightX = 130;
  //     doc.setFontSize(30);
  //     doc.text("Delivery Note", rightX, 22);
  //     doc.setFontSize(12);
  //     doc.text(`Delivery Note Number: ${formValues.deliveryNumber || ""}`, rightX, 30);
  //     doc.text(`Delivery Date: ${formValues.date || ""}`, rightX, 36);

  //     // Deliver To
  //     let yCursor = 50;
  //     doc.setFont("helvetica", "bold");
  //     doc.setFontSize(12);
  //     doc.text("Deliver To:", 14, yCursor);

  //     doc.setFont("helvetica", "normal");
  //     doc.setFontSize(10);
  //     yCursor += 6;
  //     doc.text(deliverToNameLines, 14, yCursor);
  //     yCursor += deliverToNameLines.length * 5;
  //     doc.text(deliverToAddressLines, 14, yCursor);

  //    doc.text(`Delivery Type: ${formValues.paymentTerms || ""}`, rightX, 50);

  //   };

  //   // Draw footer (company info + page number)
  // const drawFooter = (pageNum, totalPages) => {
  //   doc.setFontSize(12);

  //   // Horizontal black border line above footer
  //   const borderY = pageHeight - 30;
  //   doc.setDrawColor(0, 0, 0); // black
  //   doc.setLineWidth(0.5);
  //   doc.line(14, borderY, pageWidth - 14, borderY);

  //   // Authorized Signature - only on last page & just above border
  //   if (pageNum === totalPages) {
  //     const sigY = borderY - 10; // 10 units above border
  //     doc.setDrawColor(0, 0, 0);
  //     doc.setLineDash([2, 1], 0);
  //     doc.line(14, sigY, 80, sigY);
  //     doc.setLineDash([]);
  //     doc.text("Authorized Signature", 14, sigY + 5);
  //   }

  //   // Company info centered
  //   const companyInfo = [
  //     "Haitian Middle East LLC",
  //     "Umm El Thoub, Umm Al Quwain, United Arab Emirates",
  //     "Phone: +971 656 222 38  Email: ask@haitianme.com   Web: www.haitianme.com",
  //   ];

  //   let footerY = borderY + 6;
  //   companyInfo.forEach(line => {
  //     doc.text(line, pageWidth / 2, footerY, { align: "center" });
  //     footerY += 4;
  //   });

  //   // Page number
  //   doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth / 2, pageHeight - 5, { align: "center" });
  // };

  //   // Table
  //   autoTable(doc, {
  //     head: [["#", "Item & Description", "Qty"]],
  //     body: items.map((item, idx) => [
  //       idx + 1,
  //       `${item.itemDescription || ""}\n${item.partNumber || ""}`,
  //       item.quantity || ""
  //     ]),
  //     margin: { top: HEADER_HEIGHT, bottom: BOTTOM_MARGIN },
  //     styles: {
  //       fontSize: 10,
  //       cellPadding: 3,
  //       valign: "middle",
  //       textColor: [0, 0, 0],
  //     },
  //     headStyles: {
  //       fillColor: [40, 40, 40],
  //       textColor: [255, 255, 255],
  //       halign: "left",
  //     },
  //     alternateRowStyles: { fillColor: [245, 245, 245] },
  //     columnStyles: {
  //       0: { halign: "center", cellWidth: 10 },
  //       1: { halign: "left", cellWidth: 152 },
  //       2: { halign: "center", cellWidth: 20 },
  //     },
  //     pageBreak: "auto",
  //     didDrawPage: () => {
  //       drawHeader();
  //     }
  //   });

  //   // Add footer for all pages
  //   const totalPages = doc.getNumberOfPages();
  //   for (let i = 1; i <= totalPages; i++) {
  //     doc.setPage(i);
  //     drawFooter(i, totalPages);
  //   }

  //   if (saveLocally) {
  //     doc.save(`DeliveryNote_${formValues.deliveryNumber || "Unknown"}.pdf`);
  //   }
  //   return doc;
  // };

  const generateDeliveryNotePDF = (
    formValues,
    items = [],
    saveLocally = true
  ) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const BOTTOM_MARGIN = 65;
    const rightX = 125; // Right column start X

    doc.setFontSize(10);

    // Wrap Deliver To lines (left column)
    const deliverToLines = [
      ...(formValues.customername ? [formValues.customername] : []),
      ...(formValues.address ? formValues.address.split("\n") : []),
    ].flatMap((line) => doc.splitTextToSize(line, 100));

    // Wrap Delivery Type + Payment Terms together (right column)
    const deliveryTypeFullText = `${formValues.paymentTerms || ""}`;
    const deliveryTypeLines = doc.splitTextToSize(
      deliveryTypeFullText,
      pageWidth - rightX - 14
    );

    // Calculate tallest column height
    const leftHeight = deliverToLines.length * 5 + 6;
    const rightHeight = deliveryTypeLines.length * 5 + 6;
    const HEADER_HEIGHT = 50 + Math.max(leftHeight, rightHeight);

    // Draw header
    const drawHeader = () => {
      // Logo
      doc.addImage(HaitianLogo, "PNG", 10, 10, 70, 25);

      // Title & delivery info
      doc.setFontSize(30);
      doc.text("Delivery Note", rightX, 20);
      doc.setFontSize(13);
      doc.text(
        `Delivery Note Number: ${formValues.deliveryNumber || ""}`,
        rightX,
        30
      );
      doc.text(`Delivery Date: ${formValues.date || ""}`, rightX, 36);

      const startY = 50;

      // LEFT column (Deliver To)
      doc.setFont("helvetica", "normal");
      doc.setFontSize(13);
      doc.text("Deliver To:", 14, startY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(deliverToLines, 14, startY + 6);

      // RIGHT column (Delivery Type + value wrapped together)
      doc.setFont("helvetica", "normal");
      doc.setFontSize(13);
      doc.text("Delivery Type:", rightX, startY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(deliveryTypeLines, rightX, startY + 6);
    };

    // Draw footer
    const drawFooter = (pageNum, totalPages) => {
      doc.setFontSize(10);
      const borderY = pageHeight - 30;

      // Black border line
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.line(14, borderY, pageWidth - 14, borderY);

      // Signature line
      if (pageNum === totalPages) {
        const sigY = borderY - 10;
        doc.setDrawColor(0, 0, 0);
        doc.setLineDash([2, 1], 0);
        doc.line(14, sigY, 80, sigY);
        doc.setLineDash([]);
        doc.text("Authorized Signature", 14, sigY + 5);
      }

      // Company info
      const companyInfo = [
        "Haitian Middle East LLC",
        "Umm El Thoub, Umm Al Quwain, United Arab Emirates",
        "Phone: +971 656 222 38  Email: ask@haitianme.com   Web: www.haitianme.com",
      ];
      let footerY = borderY + 6;
      companyInfo.forEach((line) => {
        doc.text(line, pageWidth / 2, footerY, { align: "center" });
        footerY += 5;
      });

      // Page number
      doc.text(
        `Page ${pageNum} of ${totalPages}`,
        pageWidth / 2,
        pageHeight - 5,
        { align: "center" }
      );
    };

    // Table
    autoTable(doc, {
      head: [["#", "Item & Description", "Qty"]],
      body: items.map((item, idx) => [
        idx + 1,
        `${item.itemDescription || ""}\n${item.partNumber || ""}`,
        item.quantity || "",
      ]),
      margin: { top: HEADER_HEIGHT, bottom: BOTTOM_MARGIN },
      styles: {
        fontSize: 11,
        cellPadding: 3,
        valign: "middle",
        textColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [100, 100, 100],
        textColor: [255, 255, 255],
        halign: "left",
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      columnStyles: {
        0: { halign: "center", cellWidth: 10 },
        1: { halign: "left", cellWidth: 150 },
        2: { halign: "left", cellWidth: 22 },
      },
      pageBreak: "auto",
      didDrawPage: () => {
        drawHeader();
      },
    });

    // Footer for all pages
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      drawFooter(i, totalPages);
    }

    if (saveLocally) {
      doc.save(`DeliveryNote_${formValues.deliveryNumber || "Unknown"}.pdf`);
    }
    return doc;
  };

  const handleDownloadPDF = async (deliveryNumber) => {
    setDownloading(true);

    try {
      const res = await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          action: "downloadDeliveryNotePDF",
          deliveryNumber,
        }),
      });

      const result = await res.json();

      if (result.success && result.pdfBase64) {
        const link = document.createElement("a");
        link.href = "data:application/pdf;base64," + result.pdfBase64;
        link.download = result.fileName || "DeliveryNote.pdf";
        link.click();
      } else {
        notification.error({
          message: "Error",
          description: result.message || "Failed to download PDF",
        });
      }
    } catch (err) {
      console.error("Download error:", err);
      notification.error({
        message: "Error",
        description: "Something went wrong while downloading the PDF.",
      });
    } finally {
      setDownloading(false);
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
    
.ant-form-vertical .ant-form-item:not(.ant-form-item-horizontal) .ant-form-item-label >label, .ant-form-vertical .ant-form-item:not(.ant-form-item-horizontal) .ant-col-24.ant-form-item-label >label, .ant-form-vertical .ant-form-item:not(.ant-form-item-horizontal) .ant-col-xl-24.ant-form-item-label >label {
    margin: 0;
    font-size: 14px;
        font-weight: 700;

  
  `;
  return (
    <>
      <style>{styl}</style>

      <div className="container-fluid">
        <div className="container">
          <div>
            <h1
              className="text-center m-0 p-0 haitianColor mt-1 "
              style={{ fontSize: "30px" }}
            >
              Delivery Note
            </h1>
            <p
              className="text-center m-0 p-0 haitianInventoryDescriptionText"
              style={{ color: "#0D3884" }}
            >
              (Record of goods delivered, including item list, delivery date,
              and reference details)
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
                      icon={faListCheck}
                      size="lg"
                      style={{ color: "#0D3884" }}
                    />
                  </div>
                  <div>
                    <div
                      className="fw-bold m-0 p-0"
                      style={{ fontSize: "20px", color: "#0D3884" }}
                    >
                      Delivery note information
                    </div>
                    <div
                      className="m-0 p-0"
                      style={{ fontSize: "14px", color: "#0D3884" }}
                    >
                      Provide the details about delivery note
                    </div>
                  </div>
                </div>

                <div className="border border-1"></div>

                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  className="mt-3 mt-lg-3"
                  disabled={loading}
                >
                  <div className="row mt-3">
                    <div className="row m-0 p-0">
                      {/* <div className="col-6">
                        <Form.Item
                          label="Delivery Number"
                          name="deliveryNumber"
                          className="fw-bold"
                          rules={[
                            {
                              required: true,
                              message: "",
                            },
                          ]}
                          loading={loadingDeliveryNumber}
                        >
                          <Input
                            placeholder="Delivery Number"
                            readOnly
                            value={
                              loadingDeliveryNumber
                                ? "Fetching..."
                                : form.getFieldValue("deliveryNumber")
                            }
                          />
                        </Form.Item>
                      </div> */}
                      <div className="col-6">
                        <Form.Item
                          label="Delivery Number"
                          name="deliveryNumber"
                          className="fw-bold"
                          rules={[
                            {
                              required: true,
                              message: "",
                            },
                          ]}
                        >
                          <div>
                            <Input
                              placeholder="Delivery number"
                              readOnly
                              value={
                                loadingDeliveryNumber
                                  ? "Fetching..."
                                  : form.getFieldValue("deliveryNumber")
                              }
                            />
                          </div>
                        </Form.Item>
                      </div>

                      <div className="col-6">
                        <Form.Item
                          label="Date"
                          name="date"
                          className="fw-bold"
                          rules={[
                            {
                              required: true,
                              message: "Please select the delivery date",
                            },
                          ]}
                        >
                          {username === "Admin" ? (
                            <DatePicker
                              format="DD-MM-YYYY"
                              value={form.getFieldValue("date")} // ✅ dayjs object
                              onChange={(date) => {
                                if (date && dayjs(date).isValid()) {
                                  setDeliveryDate(date.format("DD-MM-YYYY"));
                                  form.setFieldsValue({ date });
                                } else {
                                  setDeliveryDate("");
                                  form.setFieldsValue({ date: null });
                                }
                              }}
                              className="w-100"
                            />
                          ) : (
                            <Input
                              placeholder="Delivery date"
                              value={deliveryDate}
                              readOnly
                            />
                          )}
                        </Form.Item>
                      </div>
                    </div>
                    <Form.Item
                      label="Customer Name"
                      name="customername"
                      className="fw-bold"
                      rules={[
                        {
                          required: true,
                          message: "Please input customer name!",
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        placeholder="Search customer name"
                        loading={loadingCustomerName}
                        disabled={loadingCustomerName}
                        notFoundContent={
                          loadingCustomerName
                            ? "Fetching..."
                            : "No results found"
                        }
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        // onChange={(value) => {
                        //   const customer = customerList.find(
                        //     (c) => c.customername === value
                        //   );
                        //   if (customer) {
                        //     form.setFieldsValue({ address: customer.address });
                        //   }
                        // }}

                        onChange={(value) => {
                          const customer = customerList.find(
                            (c) =>
                              c.customername?.trim().toLowerCase() ===
                              value.trim().toLowerCase()
                          );
                          if (customer) {
                            form.setFieldsValue({ address: customer.address });
                            setPaymentTerms(customer.paymentTerms || "");
                          } else {
                            form.setFieldsValue({ address: "" });
                            setPaymentTerms("");
                          }
                        }}
                      >
                        {customerList.map((customer) => (
                          <Select.Option
                            key={customer.customername}
                            value={customer.customername}
                          >
                            {customer.customername}
                          </Select.Option>
                        ))}
                      </Select>
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
                      <Input.TextArea placeholder="Enter address" rows={6} />
                    </Form.Item>
                    <div className="row m-0 p-0">
                      <div className="col-6">
                        <Form.Item
                          label="Mode of delivery"
                          name="modeOfDelivery"
                          className="fw-bold"
                          rules={[
                            {
                              required: true,
                              message: "Please enter the mode of delivery!",
                            },
                          ]}
                        >
                          <Input placeholder="Enter mode of delivery" />
                        </Form.Item>
                      </div>
                      <div className="col-6">
                        <Form.Item
                          label="Reference "
                          name="reference"
                          className="fw-bold"
                          rules={[
                            {
                              required: true,
                              message: "Please enter the reference!",
                            },
                          ]}
                        >
                          <Input placeholder="Enter reference" />
                        </Form.Item>
                      </div>
                    </div>
                    <Form.Item>
                      <Table
                        columns={columns}
                        dataSource={displayData}
                        pagination={{
                          pageSize: 10,
                        }}
                        rowKey="key"
                        scroll={{ x: "max-content" }}
                        size="middle"
                        bordered
                      />
                    </Form.Item>

                    <div className="col-7 text-center m-auto d-flex">
                      <Button
                        htmlType="submit"
                        size="large"
                        className="submitButton "
                        loading={loading}
                        disabled={loading}
                      >
                        {loading
                          ? "Submitting Delivery Note"
                          : "Submit Delivery Note"}
                      </Button>
                      <Button
                        htmlType="button"
                        size="large"
                        className="clearButton  ms-3"
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
                            const preservedFields = {
                              deliveryNumber: values.deliveryNumber,
                              date: values.date,
                            };
                            // form.resetFields();
                            setDataSource([]);
                            setInputRow({
                              partNumber: "",
                              itemDescription: "",
                              quantity: "",
                              unit: "",
                              stockInHand: "",
                            });
                            form.setFields([
                              { name: "customername", value: undefined },
                              { name: "address", value: undefined },
                              { name: "modeOfDelivery", value: undefined },
                              { name: "reference", value: undefined },
                            ]);
                            form.setFieldsValue(preservedFields);
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
                  </div>
                </Form>

                <div className="d-flex align-items-center gap-2 mb-1 mt-5 pt-2">
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
                      Delivery note table
                    </div>
                    <div
                      className="m-0 p-0"
                      style={{ fontSize: "14px", color: "#0D3884" }}
                    >
                      Search or filter data and view delivery note information
                    </div>
                  </div>
                </div>

                <div className="border border-1"></div>

                <div className="mt-3">
                  <div className="mb-3 d-flex gap-1">
                    <Input
                      placeholder="Please provide search input"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      style={{ width: 1300 }}
                      suffix={<SearchOutlined />}
                    />

                    <DatePicker
                      placeholder="Start Date"
                      value={startDate}
                      style={{ width: 400 }}
                      className="ms-3"
                      onChange={(date) => {
                        if (endDate && date && date.isAfter(endDate, "day")) {
                          notification.error({
                            message: "Invalid Date Range",
                            description:
                              "Start date cannot be after the end date.",
                            placement: "bottomRight",
                          });
                          return;
                        }
                        setStartDate(date);
                      }}
                      format="DD-MM-YYYY"
                      allowClear
                    />

                    <DatePicker
                      placeholder="End Date"
                      value={endDate}
                      style={{ width: 400 }}
                      onChange={(date) => {
                        if (
                          startDate &&
                          date &&
                          date.isBefore(startDate, "day")
                        ) {
                          notification.error({
                            message: "Invalid Date Range",
                            description:
                              "End date cannot be before the start date.",
                            placement: "bottomRight",
                          });
                          return;
                        }
                        setEndDate(date);
                      }}
                      format="DD-MM-YYYY"
                      allowClear
                    />

                    <Button
                      icon={<ReloadOutlined />}
                      onClick={() => {
                        setSearchText("");
                        setStartDate(null);
                        setEndDate(null);
                        fetchDeliveryNotesData();
                        notification.info({
                          message: "Filters Reset",
                          description: "Data has been refreshed.",
                          placement: "bottomRight",
                        });
                      }}
                      size="large"
                      className="resetButton ms-2"
                    >
                      Reset
                    </Button>

                    <Button
                      icon={<ExportOutlined />}
                      onClick={handleExport}
                      size="large"
                      className="exportButton"
                    >
                      Export
                    </Button>
                  </div>

                  <Table
                    columns={fetchedTablecolumns}
                    dataSource={groupedData.map((item, index) => ({
                      key: index,
                      ...item,
                    }))}
                    loading={loadingFetchedData}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: "max-content" }}
                    bordered
                  />
                </div>

                <Modal
                  open={isModalVisible}
                  onCancel={() => setIsModalVisible(false)}
                  footer={null}
                  width={1200}
                  style={{ top: "5px" }}
                >
                  <div className="col-12 col-lg-8 text-center m-auto">
                    <img
                      src={HaitianLogo}
                      alt="HaitianLogo"
                      className=" m-0 p-0"
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
                        View delivery note information
                      </div>
                      <div
                        className="m-0 p-0"
                        style={{ fontSize: "14px", color: "#0D3884" }}
                      >
                        Details about delivery note for the selected record
                      </div>
                    </div>
                  </div>

                  <div className="border border-1"></div>

                  <Form form={viewForm} layout="vertical" className="mt-3">
                    <div className="container-fluid">
                      {/* Delivery Number & Date */}
                      <div className="row">
                        <div className="col-md-6">
                          <Form.Item
                            name="Delivery Number"
                            label="Delivery Number"
                          >
                            <Input readOnly />
                          </Form.Item>
                        </div>
                        <div className="col-md-6">
                          <Form.Item name="Date" label="Date">
                            <Input readOnly />
                          </Form.Item>
                        </div>
                      </div>

                      {/* Customer Name */}
                      <div className="row">
                        <div className="col-md-12">
                          <Form.Item name="Customer Name" label="Customer Name">
                            <Input readOnly />
                          </Form.Item>
                        </div>
                      </div>

                      {/* Address */}
                      <div className="row">
                        <div className="col-md-12">
                          <Form.Item name="Address" label="Address">
                            <Input.TextArea
                              readOnly
                              autoSize={{ minRows: 2, maxRows: 4 }}
                            />
                          </Form.Item>
                        </div>
                      </div>

                      {/* Mode of delivery & Reference */}
                      <div className="row">
                        <div className="col-md-6">
                          <Form.Item
                            name="Mode of delivery"
                            label="Mode of Delivery"
                          >
                            <Input readOnly />
                          </Form.Item>
                        </div>
                        <div className="col-md-6">
                          <Form.Item name="Reference" label="Reference">
                            <Input readOnly />
                          </Form.Item>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <Form.Item name="Modified User" label="Modified User">
                            <Input readOnly />
                          </Form.Item>
                        </div>
                        <div className="col-md-6">
                          <Form.Item
                            name="Modified Date & Time"
                            label="Modified Date & Time"
                          >
                            <Input readOnly />
                          </Form.Item>
                        </div>
                      </div>

                      {/* Parts Used Table */}
                      <div className="row">
                        <div className="col-md-12">
                          <Table
                            columns={modalColumns}
                            dataSource={(selectedRow?.partsUsed || []).map(
                              (part, idx) => ({
                                key: idx,
                                ...part,
                              })
                            )}
                            rowKey="key"
                            pagination={false}
                            bordered
                            scroll={{ x: "max-content" }}
                            size="middle"
                          />
                        </div>
                      </div>
                      <div className="mt-5 mb-5 col-7 m-auto">
                        <Button
                          className="closeModalButton"
                          size="large"
                          onClick={() => {
                            setIsModalVisible(false);
                          }}
                        >
                          Close Form
                        </Button>

                        <Button
                          key="download"
                          className="submitButton ms-3"
                          size="large"
                          loading={downloading}
                          disabled={downloading}
                          onClick={() =>
                            handleDownloadPDF(selectedRow["Delivery Number"])
                          }
                        >
                          {downloading ? "Downloading PDF..." : "Download PDF"}
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
