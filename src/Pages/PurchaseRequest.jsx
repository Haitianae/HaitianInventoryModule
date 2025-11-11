import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListCheck, faTable, faEye } from "@fortawesome/free-solid-svg-icons";
import {
  ExportOutlined,
  ReloadOutlined,
  SearchOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
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
  Tag,
  Steps,
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

function safeToString(value) {
  if (value === null || value === undefined) return "0";
  try {
    return value.toString();
  } catch {
    return "0";
  }
}

export default function PurchaseRequest({ user }) {
  const [form] = Form.useForm();
  const [viewForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [purchaseDate, setPurchaseDate] = useState("");
  const [loadingPurchaseRequestNumber, setLoadingPurchaseRequestNumber] =
    useState(true);
  const [loadingCustomerName, setLoadingCustomerName] = useState(true);
  const [loadingDescription, setLoadingDescription] = useState(true);
  const [loadingPartNumber, setLoadingPartNumber] = useState(true);
  const [fetchingData, setFetchingData] = useState(false);
  const [descriptionList, setDescriptionList] = useState([]);
  const [stockLoading, setStockLoading] = useState(false);
  const [purchaseRequestNumber, setPurchaseRequestNumber] = useState("");
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
  const [isStockLoading, setIsStockLoading] = useState(false);
  const displayData = [{ key: "input", isInput: true }, ...dataSource];
  const [customerList, setCustomerList] = useState([]);
  const access = user?.access?.["Purchase Request"] || "No Access";

  

  const GAS_URL =
    "https://script.google.com/macros/s/AKfycbx27Dt_yQ0yjM5GAbqpw38u5LHKX4i0X7a5EN8V816qmY4ftcwoe6pmmEosddXcsVRjGg/exec";

  async function fetchWithRetry(params, retries = 2) {
    for (let i = 0; i <= retries; i++) {
      try {
        const res = await fetch(GAS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(params),
        });
        const json = await res.json();
        if (json.success) return json;
      } catch (err) {
        // console.warn(`Retry ${i + 1} failed`, err);
      }
    }
    throw new Error("Failed after retries");
  }

  const fetchInitialData = async () => {
    try {
      setLoadingPurchaseRequestNumber(true);
      setLoadingCustomerName(true);
      setLoadingDescription(true);

      const [requestNum, customers, descriptions] = await Promise.allSettled([
        fetchWithRetry({ action: "getNextPurchaseRequestNumber" }),
        fetchWithRetry({ action: "getCustomerDetails" }),
        fetchWithRetry({ action: "getAllDescriptionsWithPartNumbers" }),
      ]);

      // console.log("✅ Promise.allSettled result:");
      // console.log("• requestNum:", requestNum);
      // console.log("• customers:", customers);
      // console.log("• descriptions:", descriptions);

      if (requestNum.status === "fulfilled" && requestNum.value) {
        // console.log(
        //   "🔍 Raw getNextPurchaseRequestNumber response:",
        //   requestNum.value
        // );

        const prNumber =
          requestNum.value.requestNumber ||
          requestNum.value?.data?.requestNumber ||
          requestNum.value?.purchaseRequestNumber;

        // console.log("✅ Purchase Request Number fetched:", prNumber);

        setPurchaseRequestNumber(prNumber);
        form.setFieldsValue({
          purchaseRequest: prNumber, // ✅ must match form field name
        });
      }

      if (customers.status === "fulfilled" && customers.value) {
        setCustomerList(customers.value.customers || []);
      }

      if (descriptions.status === "fulfilled" && descriptions.value) {
        setDescriptionList(descriptions.value.items || []);
      }
      await fetchPurchaseRequestData();
    } catch (err) {
      notification.error({
        message: "Error",
        description: "Failed to fetch initial data",
      });
    } finally {
      setLoadingPurchaseRequestNumber(false);
      setLoadingCustomerName(false);
      setLoadingDescription(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

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
        // console.error("Error fetching stock:", err);
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
              // stockInHand: result.stockInHand?.toString() || "0",
              stockInHand: safeToString(result.stockInHand),
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
            // console.error("Fetch stock error:", err);
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
              onChange={(value) => {
                const selected = descriptionList.find(
                  (item) => item.partNumber === value
                );
                const cachedStock = stockMap[value] || {
                  stockInHand: 0,
                  unit: "",
                };

                // Immediate UI update from cache
                setInputRow((prev) => ({
                  ...prev,
                  partNumber: value,
                  itemDescription:
                    selected?.description || prev.itemDescription,
                  unit: cachedStock.unit,
                  stockInHand: safeToString(cachedStock.stockInHand),
                  stockUnit: cachedStock.unit,
                }));

                const currentPart = value;

                // 🔄 Background fetch
                (async () => {
                  setStockLoading(true);
                  try {
                    const res = await fetch(GAS_URL, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                      },
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
                        // stockInHand: result.stockInHand?.toString() || "0",
                        stockInHand: safeToString(result.stockInHand),

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
                    // console.error("Live stock fetch failed", err);
                  } finally {
                    setStockLoading(false); // stop loading
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
              onChange={(value) => {
                const selected = descriptionList.find(
                  (item) => item.description === value
                );
                const partNumber = selected?.partNumber || "";
                const cachedStock = stockMap[partNumber] || {
                  stockInHand: 0,
                  unit: "",
                };

                // Immediate UI update from cache
                setInputRow((prev) => ({
                  ...prev,
                  itemDescription: value,
                  partNumber,
                  unit: cachedStock.unit,
                  // stockInHand: cachedStock.stockInHand.toString(),
                  stockInHand: safeToString(cachedStock.stockInHand),
                  stockUnit: cachedStock.unit,
                }));

                // Save the part number being fetched
                const currentPart = partNumber;

                // 🔄 Background live fetch
                (async () => {
                  setStockLoading(true);
                  try {
                    const res = await fetch(GAS_URL, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                      },
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
                        // stockInHand: result.stockInHand?.toString() || "0",
                        stockInHand: safeToString(result.stockInHand),
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
                    // console.error("Live stock fetch failed (description)", err);
                  } finally {
                    setStockLoading(false);
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
            disabled={fetchingData || stockLoading}
            // loading={fetchingData || stockLoading}
          >
            {/* {(fetchingData || stockLoading) ? "Loading..." : "Add"} */}
            Add
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
    const now = dayjs();
    const fullDateTime = now.format("DD-MM-YYYY HH:mm:ss");
    const displayDate = now.format("DD-MM-YYYY");
    // console.log("fullDateTime:", fullDateTime);
    // console.log("displayDate:", displayDate);
    setPurchaseDate(fullDateTime);
    form.setFieldsValue({ date: displayDate });
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

  const handleSubmit = async (values) => {
    if (!navigator.onLine) {
      notification.error({
        message: "No Internet",
        description: "Check connection.",
      });
      return;
    }
    if (dataSource.length === 0) {
      notification.error({
        message: "No Items",
        description: "Please add at least one item.",
      });
      return;
    }
    if (loading) return;
    setLoading(true);

    try {
      // const formattedDate =
      //   username === "Admin" ? dayjs(values.date).format("DD-MM-YYYY") : deliveryDate;
      // const formattedDate = form.getFieldValue("date") || purchaseDate;

      const fullDateTime = purchaseDate;
      const formattedDate =
        form.getFieldValue("date") || fullDateTime.split(" ")[0];

      // 1️⃣ Save form data only
      const response = await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          action: "addPurchaseRequest",
          // date: formattedDate,
          date: purchaseDate,
          customername: values.customername,
          address: values.address,
          items: JSON.stringify(dataSource),
          // userName: user || "-",
          userName: user?.email || "",
        }),
      });

      const result = await response.json();
      if (!result.success)
        throw new Error(result.message || "Failed to add purchase request.");

      setDataSource([]);
      setInputRow({
        partNumber: "",
        itemDescription: "",
        quantity: "",
        unit: "",
        stockInHand: "",
      });

      form.resetFields();

      // const nowUTC = new Date();
      // const dubaiOffset = 4 * 60; // UTC+4
      // const dubaiTime = new Date(nowUTC.getTime() + dubaiOffset * 60000);
      // const dubaiDayjs = dayjs(dubaiTime);
      // const todayFormatted = dubaiDayjs.format("DD-MM-YYYY");
      // setPurchaseDate(todayFormatted);

      const now = dayjs();
      const fullDateAndTime = now.format("DD-MM-YYYY HH:mm:ss");
      const displayDate = now.format("DD-MM-YYYY");

      setPurchaseDate(fullDateAndTime);

      form.setFieldsValue({
        // date: username === "Admin" ? dubaiDayjs : todayFormatted,
        date: displayDate,
        customername: undefined,
        address: undefined,
      });

      // await fetchInitialData();
      setTimeout(() => {
        fetchInitialData();
      }, 500);
    } catch (err) {
      // console.error("Submit error:", err);
      notification.error({
        message: "Submission Error",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (access === "No Access") {
    return (
      <h2 style={{ padding: 20 }}>
        You do not have access to Customer Details
      </h2>
    );
  }

  const fetchedTablecolumns = [
    {
      title: "Purchase Request No.",
      dataIndex: "Purchase Request Number",
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
      title: "S.No.",
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
      title: "Request Created By",
      dataIndex: "Request Created By",
      width: 200,
      render: (text) => (
        <Tooltip title={text || "-"}>
          <span>{text || "-"}</span>
        </Tooltip>
      ),
    },
    {
      title: "Requested Date & Time",
      dataIndex: "Requested Date & Time",
      width: 180,
      render: (date) => {
        const d = parseToDayjs(date);
        const formatted = d ? d.format("DD-MM-YYYY HH:mm:ss") : "-";
        return (
          <Tooltip title={formatted}>
            <span>{formatted}</span>
          </Tooltip>
        );
      },
    },
    {
      title: "Approved/Denied By",
      dataIndex: "Approved/Denied By",
      width: 200,
      render: (text) => (
        <Tooltip title={text || "-"}>
          <span>{text || "-"}</span>
        </Tooltip>
      ),
    },
    {
      title: "Approved/Denied Date & Time",
      dataIndex: "Approved/Denied Date & Time",
      width: 180,
      render: (date) => {
        const d = parseToDayjs(date);
        const formatted = d ? d.format("DD-MM-YYYY HH:mm:ss") : "-";
        return (
          <Tooltip title={formatted}>
            <span>{formatted}</span>
          </Tooltip>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "Status",
      width: 120,
      fixed: "right",
      render: (status) => {
        let color = "orange";
        if (status === "Approved") color = "green";
        else if (status === "Denied") color = "red";

        return (
          <Tag color={color} style={{ fontWeight: "bold" }} className="tag-large" >
            {status || "Pending"}
          </Tag>
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

   const userEmail = user?.email?.toLowerCase() || "";
const purchaseAccess = user?.access?.["Purchase Request"] || "";

// ✅ Define who can see all records
const canSeeAll =
  userEmail === "admin@haitianme.com" || purchaseAccess === "Full Control";

// ✅ Apply access-based filter
const accessibleData = canSeeAll
  ? fetchedData // admin or full control → see everything
  : fetchedData.filter(
      (item) =>
        (item["Request Created By"] || "").toLowerCase() === userEmail
    );

  const filteredData = accessibleData.filter((item) => {
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
      const purchaseNo = item["Purchase Request Number"];
      if (!acc[purchaseNo]) {
        acc[purchaseNo] = {
          ...item,
          partsUsed: [],
        };
      }
      acc[purchaseNo].partsUsed.push({
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

  const sortedData = [...groupedData].sort((a, b) => {
    const numA = parseInt(a["Purchase Request Number"].replace(/\D/g, ""), 10);
    const numB = parseInt(b["Purchase Request Number"].replace(/\D/g, ""), 10);
    return numB - numA;
  });

 const handleExport = () => {
  if (!groupedData || groupedData.length === 0) {
    notification.warning({
      message: "Export Failed",
      description: "No purchase request data available to export.",
      placement: "bottomRight",
    });
    return;
  }

  const now = dayjs().format("DD-MM-YYYY_HH-mm-ss");
  const fileName = `Purchase_Request_Report_${now}.xlsx`;

  // Header style
  const headerStyle = {
    font: { bold: true, sz: 12 },
    alignment: { horizontal: "left", vertical: "center", wrapText: true }, // Left align
    border: getAllBorders(),
    fill: { patternType: "solid", fgColor: { rgb: "FFFF00" } }, // Light blue
  };

  const header = [
    { v: "Purchase Request Number", t: "s", s: headerStyle },
    { v: "Date", t: "s", s: headerStyle },
    { v: "Customer Name", t: "s", s: headerStyle },
    { v: "Address", t: "s", s: headerStyle },
    { v: "Serial Number", t: "s", s: headerStyle },
    { v: "Part Number", t: "s", s: headerStyle },
    { v: "Item Description", t: "s", s: headerStyle },
    { v: "Quantity", t: "s", s: headerStyle },
    { v: "Unit", t: "s", s: headerStyle },
    { v: "Stock In Hand", t: "s", s: headerStyle },
    { v: "Request Created By", t: "s", s: headerStyle },
    { v: "Requested Date & Time", t: "s", s: headerStyle },
    { v: "Approved/Denied By", t: "s", s: headerStyle },
    { v: "Approved/Denied Date & Time", t: "s", s: headerStyle },
    { v: "Status", t: "s", s: headerStyle },
    { v: "Note", t: "s", s: headerStyle },
  ];

  const data = [];

  // ✅ Sort ascending for export (oldest → newest)
  const sortedAsc = [...groupedData].sort((a, b) => {
    const numA = parseInt(a["Purchase Request Number"].replace(/\D/g, ""), 10);
    const numB = parseInt(b["Purchase Request Number"].replace(/\D/g, ""), 10);
    return numA - numB;
  });

  // Build data rows
  sortedAsc.forEach((item) => {
    (item.partsUsed || []).forEach((part) => {
      data.push([
        { v: item["Purchase Request Number"], s: { border: getAllBorders(), alignment: { horizontal: "left" } } },
        { v: item["Date"], s: { border: getAllBorders(), alignment: { horizontal: "left" } } },
        { v: item["Customer Name"], s: { border: getAllBorders(), alignment: { horizontal: "left" } } },
        { v: item["Address"], s: { border: getAllBorders(), alignment: { horizontal: "left" } } },
        { v: part["Serial Number"], s: { border: getAllBorders(), alignment: { horizontal: "left" } } },
        { v: part["Part Number"], s: { border: getAllBorders(), alignment: { horizontal: "left" } } },
        { v: part["Item Description"], s: { border: getAllBorders(), alignment: { horizontal: "left" } } },
        { v: part["Quantity"], s: { border: getAllBorders(), alignment: { horizontal: "left" } } },
        { v: part["Unit"], s: { border: getAllBorders(), alignment: { horizontal: "left" } } },
        { v: part["Stock In Hand"], s: { border: getAllBorders(), alignment: { horizontal: "left" } } },
        { v: item["Request Created By"], s: { border: getAllBorders(), alignment: { horizontal: "left" } } },
        { v: item["Requested Date & Time"], s: { border: getAllBorders(), alignment: { horizontal: "left" } } },
        { v: item["Approved/Denied By"], s: { border: getAllBorders(), alignment: { horizontal: "left" } } },
        { v: item["Approved/Denied Date & Time"], s: { border: getAllBorders(), alignment: { horizontal: "left" } } },
        { v: item["Status"], s: { border: getAllBorders(), alignment: { horizontal: "left" } } },
        { v: item["Note"] || "-", s: { border: getAllBorders(), alignment: { horizontal: "left" } } },
      ]);
    });
  });

  // Create Excel worksheet
  const ws = XLSX.utils.aoa_to_sheet([header, ...data]);

  // Auto column widths
  const colWidths = header.map((_, colIndex) => {
    let maxLength = 0;
    [header, ...data].forEach((row) => {
      const cell = row[colIndex];
      const value = cell && cell.v != null ? String(cell.v) : "";
      maxLength = Math.max(maxLength, value.length);
    });
    return { wch: Math.min(maxLength * 1.8, 60) };
  });
  ws["!cols"] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Purchase Requests");

  XLSX.writeFile(wb, fileName);

  notification.success({
    message: "Export Successful",
    description: "Purchase Request report downloaded successfully.",
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

  const fetchPurchaseRequestData = async () => {
    try {
      setLoadingFetchedData(true);

      const res = await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ action: "getPurchaseRequests" }),
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
      notification.error({
        message: "Error",
        description: "Failed to fetch purchase request",
        placement: "bottomRight",
      });
    } finally {
      setLoadingFetchedData(false);
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
}
        .ant-steps .ant-steps-item-finish>.ant-steps-item-container>.ant-steps-item-content>.ant-steps-item-title::after {
    background-color: #0d3884;
}
  `;

  if (access === "No Access") {
    return (
      <h2 style={{ padding: 20 }}>
        You do not have access to purchase request
      </h2>
    );
  }

  const readOnly = access === "Read";
  const canWrite = access === "Read/Write" || access === "Full Control";
  const isFullControl = access === "Full Control";
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
              Purchase Request
            </h1>
            <p
              className="text-center m-0 p-0 haitianInventoryDescriptionText"
              style={{ color: "#0D3884" }}
            >
              (Used by customers or agents to request items from inventory)
            </p>
          </div>
          <div className="row d-flex flex-row mt-4 ">
            <div className="d-flex flex-column flex-lg-row justify-content-lg-evenly rounded-4">
              <div className="col-12 p-3 p-lg-4 ">
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
                          Purchase Request information
                        </div>
                        <div
                          className="m-0 p-0"
                          style={{ fontSize: "14px", color: "#0D3884" }}
                        >
                          Provide the details about purchase items
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
                      style={{ fontFamily: "Poppins, sans-serif !important" }}
                    >
                      <div className="row mt-3">
                        <div className="row m-0 p-0">
                          <div className="col-6">
                            <Form.Item
                              label="Purchase Request Number"
                              name="purchaseRequest"
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
                                  placeholder="Purchase request number"
                                  readOnly
                                  value={
                                    loadingPurchaseRequestNumber
                                      ? "Fetching..."
                                      : form.getFieldValue("purchaseRequest")
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
                                  message: "Date is required",
                                },
                              ]}
                            >
                              <Input
                                placeholder="Purchase request date"
                                readOnly
                                value={form.getFieldValue("date")}
                              />
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
                            disabled={
                              loadingCustomerName || loading || readOnly
                            }
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
                            onChange={(value) => {
                              const customer = customerList.find(
                                (c) =>
                                  c.customername?.trim().toLowerCase() ===
                                  value.trim().toLowerCase()
                              );
                              if (customer) {
                                form.setFieldsValue({
                                  address: customer.address,
                                });
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
                          <Input.TextArea
                            placeholder="Enter address"
                            rows={6}
                          />
                        </Form.Item>
                        {/* <div className="row m-0 p-0">
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
                        </div> */}
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

                        {!readOnly && (
                          <div className="col-7 text-center m-auto d-flex">
                            <Button
                              htmlType="submit"
                              size="large"
                              className="submitButton "
                              loading={loading}
                              disabled={loading}
                            >
                              {loading
                                ? "Submitting Purchase Request"
                                : "Submit Purchase Request"}
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
                                    description:
                                      "All fields are already empty.",
                                  });
                                } else {
                                  const preservedFields = {
                                    purchaseRequestNumber:
                                      values.purchaseRequestNumber,
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
                        )}
                      </div>
                    </Form>
                  </>
                )}

                <div
                  className={`d-flex align-items-center gap-2 ${
                    readOnly ? "mb-1" : "mb-1 mt-5 pt-2"
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
                      Purchase request table
                    </div>
                    <div
                      className="m-0 p-0"
                      style={{ fontSize: "14px", color: "#0D3884" }}
                    >
                      Search or filter data and view purchase request
                      information
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
                        fetchPurchaseRequestData();
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
                    {isFullControl && (
                      <Button
                        icon={<ExportOutlined />}
                        onClick={handleExport}
                        size="large"
                        className="exportButton"
                      >
                        Export
                      </Button>
                    )}
                  </div>

                  <Table
                    columns={fetchedTablecolumns}
                    dataSource={sortedData.map((item, index) => ({
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
                        View purchase request information
                      </div>
                      <div
                        className="m-0 p-0"
                        style={{ fontSize: "14px", color: "#0D3884" }}
                      >
                        Details about purchase request for the selected record
                      </div>
                    </div>
                  </div>

                  <div className="border border-1"></div>
                  <div className="border border-1 border-light bg-light rounded-3 p-2 mt-3">
                    <Steps
                      direction="horizontal"
                      className="mt-2 custom-steps"
                      current={
                        selectedRow?.Status === "Approved"
                          ? 3
                          : selectedRow?.Status === "Denied"
                          ? 3
                          : 1
                      }
                      status={
                        selectedRow?.Status === "Denied"
                          ? "error"
                          : selectedRow?.Status === "Approved"
                          ? "finish"
                          : "process"
                      }
                      items={[
                        {
                          title: (
                            <div
                              className="haitianColor"
                              style={{ fontSize: "17px", fontWeight: "700" }}
                            >
                              Requested
                            </div>
                          ),
                          description: (
                            <div
                              style={{ whiteSpace: "nowrap", fontSize: "13px" }}
                            >
                              <div className="gray-text">
                                Purchase request created by
                              </div>
                              <div style={{ color: "#555" }}>
                                <span style={{ color: "#0D3884" }}>
                                  {selectedRow?.["Request Created By"] || "-"}
                                </span>
                                <div style={{ color: "#555" }}>
                                  {selectedRow?.["Requested Date & Time"]
                                    ? ` ${selectedRow?.["Requested Date & Time"]}`
                                    : "-"}
                                </div>
                              </div>
                            </div>
                          ),

                          icon: (
                            <div
                              style={{
                                border: "2px solid #E8F0FE",
                                padding: "10px",
                                borderRadius: "30%",
                                backgroundColor: "#E8F0FE",
                              }}
                            >
                              <FileTextOutlined style={{ color: "#0D3884" }} />
                            </div>
                          ),
                        },
                        {
                          title: (
                            <div
                              style={{
                                fontSize: "17px",
                                fontWeight: "700",
                                color: "#ea9b09ff",
                              }}
                            >
                              {selectedRow?.Status === "Approved"
                                ? "Processed"
                                : selectedRow?.Status === "Denied"
                                ? "Processed"
                                : "Request submitted for approval"}
                            </div>
                          ),
                          description: (
                            <div
                              style={{ whiteSpace: "nowrap", fontSize: "13px" }}
                            >
                              <div className="gray-text">
                                Purchase request processed by
                              </div>
                              <div style={{ color: "#555" }}>
                                <span style={{ color: "#0D3884" }}>
                                  {selectedRow?.["Approved/Denied By"]
                                    ? ` ${selectedRow?.["Approved/Denied By"]}`
                                    : "-"}
                                </span>
                                <div style={{ color: "#555" }}>
                                  {selectedRow?.["Approved/Denied Date & Time"]
                                    ? ` ${selectedRow?.["Approved/Denied Date & Time"]}`
                                    : "-"}
                                </div>
                              </div>
                            </div>
                          ),
                          icon: (
                            <div
                              style={{
                                border: "2px solid #f8ebd5ff",
                                padding: "10px",
                                borderRadius: "30%",
                                backgroundColor: "#f8ebd5ff",
                              }}
                            >
                              <ClockCircleOutlined
                                style={{ color: "#ffa500" }}
                              />
                            </div>
                          ),
                        },
                        {
                          title:
                            selectedRow?.Status === "Approved" ? (
                              <div
                                style={{
                                  fontSize: "17px",
                                  fontWeight: "700",
                                  color: "#048804",
                                }}
                              >
                                Approved
                              </div>
                            ) : selectedRow?.Status === "Denied" ? (
                              <div
                                style={{
                                  fontSize: "17px",
                                  fontWeight: "700",
                                  color: "#FF0000",
                                }}
                              >
                                Denied
                              </div>
                            ) : (
                              <div
                                style={{
                                  fontSize: "17px",
                                  fontWeight: "700",
                                  color: "#969191ff",
                                }}
                              >
                                Pending
                              </div>
                            ),
                          description: (
                            <div
                              style={{ whiteSpace: "nowrap", fontSize: "13px" }}
                            >
                              <div>
                                {selectedRow?.Status === "Approved"
                                  ? "Purchase request approved by "
                                  : selectedRow?.Status === "Denied"
                                  ? "Purchase request denied by "
                                  : "Waiting for approval"}
                              </div>
                              <div style={{ color: "#555" }}>
                                <span style={{ color: "#0D3884" }}>
                                  {selectedRow?.["Approved/Denied By"]
                                    ? ` ${selectedRow?.["Approved/Denied By"]}`
                                    : "-"}
                                </span>
                                <div style={{ color: "#555" }}>
                                  {selectedRow?.["Approved/Denied Date & Time"]
                                    ? ` ${selectedRow?.["Approved/Denied Date & Time"]}`
                                    : "-"}
                                </div>
                              </div>
                            </div>
                          ),
                          icon:
                            selectedRow?.Status === "Approved" ? (
                              <div
                                style={{
                                  border: "2px solid #9ef99eff",
                                  padding: "10px",
                                  borderRadius: "30%",
                                  backgroundColor: "#cdf8cdff",
                                }}
                              >
                                {" "}
                                <CheckCircleOutlined
                                  style={{ color: "#0b890bff" }}
                                />
                              </div>
                            ) : selectedRow?.Status === "Denied" ? (
                              <div
                                style={{
                                  border: "2px solid #f6dfdfff",
                                  padding: "10px",
                                  borderRadius: "30%",
                                  backgroundColor: "#f6dfdfff",
                                }}
                              >
                                <CloseCircleOutlined style={{ color: "red" }} />
                              </div>
                            ) : (
                              <div
                                style={{
                                  border: "2px solid #F0F0F0",
                                  padding: "10px",
                                  borderRadius: "30%",
                                  backgroundColor: "#F0F0F0",
                                }}
                              >
                                <ExclamationCircleOutlined
                                  style={{ color: "#b9b5b5ff" }}
                                />
                              </div>
                            ),
                        },
                      ]}
                    />
                  </div>

                  <Form form={viewForm} layout="vertical" className="mt-3">
                    <div className="container-fluid">
                      <div className="row">
                        <div className="col-md-6">
                          <Form.Item
                            name="Purchase Request Number"
                            label="Purchase Request Number"
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
                      <div className="row">
                        <div className="col-md-6">
                          <Form.Item
                            name="Request Created By"
                            label="Request Created By"
                          >
                            <Input readOnly />
                          </Form.Item>
                        </div>
                        <div className="col-md-6">
                          <Form.Item
                            name="Requested Date & Time"
                            label="Requested Date & Time"
                          >
                            <Input readOnly />
                          </Form.Item>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <Form.Item name="Status" label="Status">
                            <Input readOnly />
                          </Form.Item>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <Form.Item
                            name="Approved/Denied By"
                            label="Approved/Denied By"
                          >
                            <Input
                              readOnly
                              value={
                                selectedRow?.["Approved/Denied By"]?.trim() ||
                                "-"
                              }
                            />
                          </Form.Item>
                        </div>
                        <div className="col-md-6">
                          <Form.Item
                            name="Approved/Denied Date & Time"
                            label="Approved/Denied Date & Time"
                          >
                            <Input
                              readOnly
                              value={
                                selectedRow?.[
                                  "Approved/Denied Date & Time"
                                ]?.trim() || "-"
                              }
                            />
                          </Form.Item>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-12">
                          <Form.Item label="Rejection Note">
                            <Input.TextArea
                              value={selectedRow?.Note || "-"}
                              autoSize={{ minRows: 2, maxRows: 4 }}
                              readOnly
                            />
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
                      <div className="row">
                        <div className="mt-5 mb-5 d-flex align-items-center justify-content-center">
                          <Button
                            className="closeModalButton"
                            size="large"
                            onClick={() => {
                              setIsModalVisible(false);
                            }}
                          >
                            Close Form
                          </Button>
                        </div>
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
