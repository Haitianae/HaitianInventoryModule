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
  DatePicker,
  AutoComplete,
  Divider,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListCheck } from "@fortawesome/free-solid-svg-icons";
import "../App.css";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

notification.config({
  maxCount: 2,
  placement: "bottomRight",
  duration: 3,
});

export default function ProductCategories({ user }) {
  const [form] = Form.useForm();
  const [partNumber, setPartNumber] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");
  // const [dataSource, setDataSource] = useState([]);
  const [sparePartsDataSource, setSparePartsDataSource] = useState([]);
  const [auxOptionLoading, setAuxOptionLoading] = useState(false);

  const [machineDataSource, setMachineDataSource] = useState([]);
  // const [assetsDataSource, setAssetsDataSource] = useState([]);
  const [auxiliariesDataSource, setAuxiliariesDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const access = user?.access?.["Product Categories"] || "No Access";

  const [inputRow, setInputRow] = useState({
    partNumber: "",
    description: "",
    quantity: "",
    unit: "",
    stockInHand: "",
    note: "",
    purchaseCost: "",
    sellingCost: "",
    stockUnit: "",
    addOnCost: "",
    totalPrice: "",
    location: "",
  });
  const [machineinputRow, setMachineInputRow] = useState({
    partNumber: "",
    description: "",
    quantity: "",
    unit: "",
    stockInHand: "",
    note: "",
    purchaseCost: "",
    sellingCost: "",
    stockUnit: "",
    addOnCost: "",
    totalPrice: "",
    location: "",

  });
  // const [selectedAssets, setSelectedAssets] = useState(null);
  const [selectedAuxiliaries, setSelectedAuxiliaries] = useState(null);
  const [auxiliariesInputRow, setAuxiliariesInputRow] = useState({
    partNumber: "",
    description: "",
    quantity: "",
    unit: "",
    stockInHand: "",
    note: "",
    purchaseCost: "",
    sellingCost: "",
    stockUnit: "",
    addOnCost: "",
    totalPrice: "",
    location: "",

  });
  // const [assetsInputRow, setAssetsInputRow] = useState({
  //   partNumber: "",
  //   description: "",
  //   quantity: "",
  //   unit: "",
  //   stockInHand: "",
  //   note: "",
  //   purchaseCost: "",
  //   sellingCost: "",
  //   stockUnit: "",
  //   addOnCost: "",
  //   totalPrice: "",
  // });
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [selectedIMMSeries, setSelectedIMMSeries] = useState(null);
  // const [assetsFetching, setAssetsFetching] = useState(false);
  const [machineFetching, setMachineFetching] = useState(false);
  const [auxiliariesFetching, setAuxiliariesFetching] = useState(false);
  const [sparePartsFetching, setSparePartsFetching] = useState(false);
  const [spareUnitOptions, setSpareUnitOptions] = useState([]);
  const [spareUnitLoading, setSpareUnitLoading] = useState(false);
  const [sparePartsUnitFetched, setSparePartsUnitFetched] = useState(false);
  const [machineUnitFetched, setMachineUnitFetched] = useState(false);
  const [machineUnitOptions, setMachineUnitOptions] = useState([]);
  const [machineUnitLoading, setMachineUnitLoading] = useState(false);
  const [machinesEditingKey, setMachinesEditingKey] = useState("");
  const [machinesEditRow, setMachinesEditRow] = useState(null);
  const [machinesAddLoading, setMachinesAddLoading] = useState(false);
  const [machinesSaveLoading, setMachinesSaveLoading] = useState(false);
  const [seriesModels, setSeriesModels] = useState([]);
  const [newModel, setNewModel] = useState("");
  const [seriesLoading, setSeriesLoading] = useState(false);
  // const [assetsUnitFetched, setAssetsUnitFetched] = useState(false);
  // const [assetsUnitOptions, setAssetsUnitOptions] = useState([]);
  // const [assetsUnitLoading, setAssetsUnitLoading] = useState(false);
  const [auxiliariesUnitFetched, setAuxiliariesUnitFetched] = useState(false);
  const [auxiliariesUnitOptions, setAuxiliariesUnitOptions] = useState([]);
  const [auxiliariesUnitLoading, setAuxiliariesUnitLoading] = useState(false);

  const [auxiliariesEditingKey, setAuxiliariesEditingKey] = useState("");
  const [auxiliariesEditRow, setAuxiliariesEditRow] = useState(null);
  const [auxiliariesAddLoading, setAuxiliariesAddLoading] = useState(false);
  const [auxiliariesSaveLoading, setAuxiliariesSaveLoading] = useState(false);

  const LOCAL_KEY = "auxiliariesOptionsData";
  const [selectedPath, setSelectedPath] = useState([]);

  const [stockCache, setStockCache] = useState({});
  const [loadingStockCache, setLoadingStockCache] = useState(true);
  const [userRole, setUserRole] = useState(user);
  const [consumablesInputRow, setConsumablesInputRow] = useState({
    date: "",
    partNumber: "",
    description: "",
    quantity: "",
    unit: "",
    stockInHand: "",
    stockUnit: "",
    purchaseCost: "",
    addOnCost: "",
    sellingCost: "",
    totalPrice: "",
    note: "",
    location: "",

  });

  const [consumablesDataSource, setConsumablesDataSource] = useState([]);
  const [consumablesUnitOptions, setConsumablesUnitOptions] = useState([]);
  const [consumablesUnitLoading, setConsumablesUnitLoading] = useState(false);
  const [consumablesFetching, setConsumablesFetching] = useState(false);

  const [consumablesEditingKey, setConsumablesEditingKey] = useState("");
  const [consumablesEditRow, setConsumablesEditRow] = useState(null);
  const [consumablesAddLoading, setConsumablesAddLoading] = useState(false);
  const [consumablesSaveLoading, setConsumablesSaveLoading] = useState(false);

  const [sparePartsEditingKey, setSparePartsEditingKey] = useState("");
  const [sparePartsEditRow, setSparePartsEditRow] = useState(null);
  const [sparePartsAddLoading, setSparePartsAddLoading] = useState(false);
  const [sparePartsSaveLoading, setSparePartsSaveLoading] = useState(false);
  const [filteredSeries, setFilteredSeries] = useState([]);

  const updateTotalPrice = (purchase, addOn, quantity) => {
    const p = parseFloat(purchase);
    const a = parseFloat(addOn);
    const q = parseFloat(quantity);

    let totalPrice = "";

    if (!isNaN(p) && !isNaN(a) && !isNaN(q)) {
      totalPrice = ((p + a) * q).toFixed(2);
    }

    return { totalPrice };
  };

  const GAS_URL =
    // "https://script.google.com/macros/s/AKfycbx27Dt_yQ0yjM5GAbqpw38u5LHKX4i0X7a5EN8V816qmY4ftcwoe6pmmEosddXcsVRjGg/exec";
    "https://script.google.com/macros/s/AKfycbzpsSdV_tTgUtCxOkxO7z4lmdPEQV6MSiA97myj-MLu46uQ9Qll_v-5Zd7l12AbbDA_sQ/exec";

  const IMMSeriesOptions = [
    { value: "MA", label: "MA (Mars)" },
    { value: "JU", label: "JU (Jupiter)" },
    { value: "JE", label: "JE (Jenius)" },
    { value: "VE", label: "VE (Venus)" },
    { value: "ZE", label: "ZE (Zerus)" },
    { value: "HA", label: "HA" },
  ];

  const MAOptions = [
    "MA V",
    "MA V/h",
    "MA F",
    "MA III/SE",
    "MA H Pro",
    "MA Multi",
    "MA GIII",
  ];
  const JUOptions = ["JU V", "JU SE", "JU Multi", "JU V/h"];
  const HAOptions = [
    "HA PET",
    "HA Auriga",
    "HA Pegasus",
    "HA ARA",
    "HA TSP",
    "HA PVC",
  ];
  const JEOptions = ["JE V"];
  const VEOptions = ["VE V", "VE V/h", "VE V/hs"];
  const ZEOptions = ["ZE V", "ZE V/h", "ZE V/hs", "ZE F"];

  const auxiliariesOptions = [
    {
      value: "Chiller",
      label: "Chiller",
      children: [
        {
          value: "Air-Cooled",
          label: "Air-Cooled",
          children: [
            { value: "HTC-03A/W", label: "HTC-03A/W" },
            { value: "HTC-05A/W", label: "HTC-05A/W" },
            { value: "HTC-08A/W", label: "HTC-08A/W" },
            { value: "HTC-10A/W", label: "HTC-10A/W" },
            { value: "HTC-12SA/W", label: "HTC-12SA/W" },
            { value: "HTC-15SA/W", label: "HTC-15SA/W" },
            { value: "HTC-20SA-D/W", label: "HTC-20SA-D/W" },
            { value: "HTC-25SA-D/W", label: "HTC-25SA-D/W" },
            { value: "HTC-30SA-D/W", label: "HTC-30SA-D/W" },
            { value: "HTC-40SA-D/W", label: "HTC-40SA-D/W" },
            { value: "HTC-50SA-D/W", label: "HTC-50SA-D/W" },
          ],
        },
        // {
        //   value: "Water-Cooled",
        //   label: "Water-Cooled",
        //   children: [
        //     { value: "HTC-03W/W", label: "HTC-03W/W" },
        //     { value: "HTC-05W/W", label: "HTC-05W/W" },
        //     { value: "HTC-08W/W", label: "HTC-08W/W" },
        //     { value: "HTC-10W/W", label: "HTC-10W/W" },
        //     { value: "HTC-12SW/W", label: "HTC-12SW/W" },
        //     { value: "HTC-15SW/W", label: "HTC-15SW/W" },
        //     { value: "HTC-20SW-D/W", label: "HTC-20SW-D/W" },
        //     { value: "HTC-25SW-D/W", label: "HTC-25SW-D/W" },
        //     { value: "HTC-30SW-D/W", label: "HTC-30SW-D/W" },
        //     { value: "HTC-40SW-D/W", label: "HTC-40SW-D/W" },
        //     { value: "HTC-50SW-D/W", label: "HTC-50SW-D/W" },
        //   ],
        // },
      ],
    },
    {
      value: "Autoloader",
      label: "Autoloader",
      children: [
        { value: "HTAL-300GN HUL/W", label: "HTAL-300GN HUL/W" },
        { value: "HTAL-1.5P HUL/W", label: "HTAL-1.5P HUL/W" },
        { value: "HTAL-2.5P HUL/W", label: "HTAL-2.5P HUL/W" },
        { value: "HTAL-5P-UL/W", label: "HTAL-5P-UL/W" },
        { value: "HTAL-10P-UL/W", label: "HTAL-10P-UL/W" },
        { value: "HTAL-1.5P-D HUL/W", label: "HTAL-1.5P-D HUL/W" },
        { value: "HTAL-2.5P-D HUL/W", label: "HTAL-2.5P-D HUL/W" },
      ],
    },
    {
      value: "Hopper & Dryer",
      label: "Hopper & Dryer",
      children: [
        { value: "HTHD-25MHL/EAF/W", label: "HTHD-25MHL/EAF/W" },
        { value: "HTHD-50MHL/EAF/W", label: "HTHD-50MHL/EAF/W" },
        { value: "HTHD-75MHL/EAF/W", label: "HTHD-75MHL/EAF/W" },
        { value: "HTHD-100MHL/EAF/W", label: "HTHD-100MHL/EAF/W" },
        { value: "HTHD-150MHL/EAF/W", label: "HTHD-150MHL/EAF/W" },
        { value: "HTHD-200MHL/EAF/W", label: "HTHD-200MHL/EAF/W" },
        { value: "HTHD-300MHL/EAF/W", label: "HTHD-300MHL/EAF/W" },
        { value: "HTHD-400MHL/EAF/W", label: "HTHD-400MHL/EAF/W" },
        { value: "HTHD-600MHL/EAF/W", label: "HTHD-600MHL/EAF/W" },
      ],
    },
    {
      value: "Crusher",
      label: "Crusher",
      children: [
        { value: "HTGS260/W", label: "HTGS260/W" },
        { value: "HTGS320/W", label: "HTGS320/W" },
        { value: "HTGS420/W", label: "HTGS420/W" },
        { value: "HTGS480/W", label: "HTGS480/W" },
        { value: "HTGM230-270/W", label: "HTGM230-270/W" },
        { value: "HTGM270-290/W", label: "HTGM270-290/W" },
        { value: "HTGM370-310/W", label: "HTGM370-310/W" },
        { value: "HTGM270-430/W", label: "HTGM270-430/W" },
        { value: "HTSS230/W", label: "HTSS230/W" },
        { value: "HTSS300/W", label: "HTSS300/W" },
        { value: "HTSS400/W", label: "HTSS400/W" },
        { value: "HTSS500/W", label: "HTSS500/W" },
        { value: "HTSS600/W", label: "HTSS600/W" },
        { value: "HTSS800/W", label: "HTSS800/W" },
      ],
    },
    {
      value: "Color Mixer",
      label: "Color Mixer",
      children: [
        { value: "HTHS-50/W", label: "HTHS-50/W" },
        { value: "HTHS-100/W", label: "HTHS-100/W" },
        { value: "HTHS-150/W", label: "HTHS-150/W" },
        { value: "HTHS-200/W", label: "HTHS-200/W" },
      ],
    },
    { value: "Robots", label: "Robots" },
    { value: "Conveyor", label: "Conveyor" },
    {
      value: "Auto loader",
      label: "Auto loader",
      children: [
        { value: "HTAL-300GN HUL/W", label: "HTAL-300GN HUL/W" },
        { value: "HTAL-1.5P HUL/W", label: "HTAL-1.5P HUL/W" },
        { value: "HTAL-2.5P HUL/W", label: "HTAL-2.5P HUL/W" },
        { value: "HTAL-5P-UL/W", label: "HTAL-5P-UL/W" },
        { value: "HTAL-10P-UL/W", label: "HTAL-10P-UL/W" },
        { value: "HTAL-1.5P-D HUL/W", label: "HTAL-1.5P-D HUL/W" },
        { value: "HTAL-2.5P-D HUL/W", label: "HTAL-2.5P-D HUL/W" },
      ],
    },
    {
      value: "Hydraulic Clamp",
      label: "Hydraulic Clamp",
      children: [
        { value: "HW2/25-8", label: "HW2/25-8" },
        { value: "HW4/40-8", label: "HW4/40-8" },
        { value: "HW6/30-8", label: "HW6/30-8" },
        { value: "HW10/40-8", label: "HW10/40-8" },
        { value: "HW16/50-8", label: "HW16/50-8" },
        { value: "HW16/50-12", label: "HW16/50-12" },
        { value: "HW25/50-12", label: "HW25/50-12" },
        { value: "HW25/50-16", label: "HW25/50-16" },
        { value: "HW10/S150/40-8", label: "HW10/S150/40-8" },
        { value: "HW16/S200/50-8", label: "HW16/S200/50-8" },
        { value: "HW16/S250/50-12", label: "HW16/S250/50-12" },
        { value: "HW25/S250/50-12", label: "HW25/S250/50-12" },
        { value: "HW25/S300/50-16", label: "HW25/S300/50-16" },
        { value: "HW25/S350/50-16", label: "HW25/S350/50-16" },
        { value: "HW50/S350/60-16", label: "HW50/S350/60-16" },
      ],
    },
    {
      value: "All in one Dryer",
      label: "All in one Dryer",
      children: [
        { value: "HTDL-30F/W", label: "HTDL-30F/W" },
        { value: "HTDL-50F/W", label: "HTDL-50F/W" },
        { value: "HTDL-75F/W", label: "HTDL-75F/W" },
        { value: "HTDL-100F/W", label: "HTDL-100F/W" },
        { value: "HTDL-150F/W", label: "HTDL-150F/W" },
        { value: "HTDL-200F/W", label: "HTDL-200F/W" },
        { value: "HTDL-300F/W", label: "HTDL-300F/W" },
        { value: "HTDL-400F/W", label: "HTDL-400F/W" },
        { value: "HTDL-600F/W", label: "HTDL-600F/W" },
        { value: "HTDL-800F/W", label: "HTDL-800F/W" },
        { value: "HTDL-1000F/W", label: "HTDL-1000F/W" },
        { value: "HTDL-30N/W", label: "HTDL-30N/W" },
        { value: "HTDL-50N/W", label: "HTDL-50N/W" },
        { value: "HTDL-75N/W", label: "HTDL-75N/W" },
        { value: "HHTDL-100N/W", label: "HHTDL-100N/W" },
        { value: "HTDL-150N/W", label: "HTDL-150N/W" },
        { value: "HTDL-200N/W", label: "HTDL-200N/W" },
        { value: "HTDL-300N/W", label: "HTDL-300N/W" },
        { value: "HTDL-400N/W", label: "HTDL-400N/W" },
        { value: "HTDL-600N/W", label: "HTDL-600N/W" },
        { value: "HTDL-800N/W", label: "HTDL-800N/W" },
      ],
    },
    {
      value: "Coloer dozer Volumetric",
      label: "Coloer dozer Volumetric",
      children: [
        { value: "HTCM-A5/W", label: "HTCM-A5/W" },
        { value: "HTCM-A10/W", label: "HTCM-A10/W" },
        { value: "HTCM-A15/W", label: "HTCM-A15/W" },
        { value: "HTCM-A20/W", label: "HTCM-A20/W" },
        { value: "HTCM-A30/W", label: "HTCM-A30/W" },
      ],
    },
    {
      value: "Gravemetric Blender",
      label: "Gravemetric Blender",
      children: [
        { value: "HTGB-1-2/W", label: "HTGB-1-2/W" },
        { value: "HTGB-1-3/W", label: "HTGB-1-3/W" },
        { value: "HTGB-1-4/W", label: "HTGB-1-4/W" },
        { value: "HTGB-2-2/W", label: "HTGB-2-2/W" },
        { value: "HTGB-2-3/W", label: "HTGB-2-3/W" },
        { value: "HTGB-2-4/W", label: "HTGB-2-4/W" },
        { value: "HTGB-2-5/W", label: "HTGB-2-5/W" },
        { value: "HTGB-2-6/W", label: "HTGB-2-6/W" },
        { value: "HTGB-5-2/W", label: "HTGB-5-2/W" },
        { value: "HTGB-5-3/W", label: "HTGB-5-3/W" },
        { value: "HTGB-5-4/W", label: "HTGB-5-4/W" },
        { value: "HTGB-5-5/W", label: "HTGB-5-5/W" },
        { value: "HTGB-5-6/W", label: "HTGB-5-6/W" },
        { value: "HTGB-10-2/W", label: "HTGB-10-2/W" },
        { value: "HTGB-10-3/W", label: "HTGB-10-3/W" },
        { value: "HTGB-10-4/W", label: "HTGB-10-4/W" },
        { value: "HTGB-10-5/W", label: "HTGB-10-5/W" },
        { value: "HTGB-10-6/W", label: "HTGB-10-6/W" },
      ],
    },
    {
      value: "Mold temp controller",
      label: "Mold temp controller",
      children: [
        { value: "HTMC-6H/W", label: "HTMC-6H/W" },
        { value: "HTMC-9H/W", label: "HTMC-9H/W" },
        { value: "HTMC-12H/W", label: "HTMC-12H/W" },
        { value: "HTMC-18H/W", label: "HTMC-18H/W" },
        { value: "HTMC-24H/W", label: "HTMC-24H/W" },
        { value: "HTMC-6H-D/W", label: "HTMC-6H-D/W" },
        { value: "HTMC-9H-D/W", label: "HTMC-9H-D/W" },
        { value: "HTMC-12H-D/W", label: "HTMC-12H-D/W" },
        { value: "HTMC-18H-D/W", label: "HTMC-18H-D/W" },
        { value: "HTMC-24H-D/W", label: "HTMC-24H-D/W" },
        { value: "HTMC-6WG/W", label: "HTMC-6WG/W" },
        { value: "HTMC-9WG/W", label: "HTMC-9WG/W" },
        { value: "HTMC-12WG/W", label: "HTMC-12WG/W" },
        { value: "HTMC-18WG/W", label: "HTMC-18WG/W" },
        { value: "HTMC-24WG/W", label: "HTMC-24WG/W" },
        { value: "HTMC-6WG-D/W", label: "HTMC-6WG-D/W" },
        { value: "HTMC-9WG-D/W", label: "HTMC-9WG-D/W" },
        { value: "HTMC-12WG-D/W", label: "HTMC-12WG-D/W" },
        { value: "HTMC-18WG-D/W", label: "HTMC-18WG-D/W" },
        { value: "HTMC-24WG-D/W", label: "HTMC-24WG-D/W" },
        { value: "HTMC-9WP/W", label: "HTMC-9WP/W" },
        { value: "HTMC-12WP/W", label: "HTMC-12WP/W" },
        { value: "HTMC-18WP/W", label: "HTMC-18WP/W" },
        { value: "HTMC-24WP/W", label: "HTMC-24WP/W" },
        { value: "HTMC-9HT/W", label: "HTMC-9HT/W" },
        { value: "HTMC-12HT/W", label: "HTMC-12HT/W" },
        { value: "HTMC-6EH/W", label: "HTMC-6EH/W" },
        { value: "HTMC-9EH/W", label: "HTMC-9EH/W" },
        { value: "HTMC-12EH/W", label: "HTMC-12EH/W" },
        { value: "HTMC-18EH/W", label: "HTMC-18EH/W" },
        { value: "HTMC-24EH/W", label: "HTMC-24EH/W" },
        { value: "HTMC-6EH-D/W", label: "HTMC-6EH-D/W" },
        { value: "HTMC-9EH-D/W", label: "HTMC-9EH-D/W" },
        { value: "HTMC-12EH-D/W", label: "HTMC-12EH-D/W" },
        { value: "HTMC-18EH-D/W", label: "HTMC-18EH-D/W" },
        { value: "HTMC-24EH-D/W", label: "HTMC-24EH-D/W" },
        { value: "HTMC-9EHT/W", label: "HTMC-9EHT/W" },
        { value: "HTMC-12EHT/W", label: "HTMC-12EHT/W" },
        { value: "HTMC-6EWG/W", label: "HTMC-6EWG/W" },
        { value: "HTMC-9EWG/W", label: "HTMC-9EWG/W" },
        { value: "HTMC-12EWG/W", label: "HTMC-12EWG/W" },
        { value: "HTMC-18EWG/W", label: "HTMC-18EWG/W" },
        { value: "HTMC-24EWG/W", label: "HTMC-24EWG/W" },
        { value: "HTMC-6EWG-D/W", label: "HTMC-6EWG-D/W" },
        { value: "HTMC-9EWG-D/W", label: "HTMC-9EWG-D/W" },
        { value: "HTMC-12EWG-D/W", label: "HTMC-12EWG-D/W" },
        { value: "HTMC-18EWG-D/W", label: "HTMC-18EWG-D/W" },
        { value: "HTMC-24EWG-D/W", label: "HTMC-24EWG-D/W" },
        { value: "HTMC-9EWP/W", label: "HTMC-9EWP/W" },
        { value: "HTMC-12EWP/W", label: "HTMC-12EWP/W" },
        { value: "HTMC-9AWG-C/W", label: "HTMC-9AWG-C/W" },
        { value: "HTMC-12AWG-C/W", label: "HTMC-12AWG-C/W" },
        { value: "HTMC-24AWG-C/W", label: "HTMC-24AWG-C/W" },
        { value: "HTMC-9AWM-C/W", label: "HTMC-9AWM-C/W" },
        { value: "HTMC-12AWM-C/W", label: "HTMC-12AWM-C/W" },
        { value: "HTMC-24AWM-C/W", label: "HTMC-24AWM-C/W" },
        { value: "HTMC-9AWG-U/W", label: "HTMC-9AWG-U/W" },
        { value: "HTMC-12AWG-U/W", label: "HTMC-12AWG-U/W" },
        { value: "HTMC-24AWG-U/W", label: "HTMC-24AWG-U/W" },
        { value: "HTMC-36AWG-U/W", label: "HTMC-36AWG-U/W" },
        { value: "HTMC-48AWG-U/W", label: "HTMC-48AWG-U/W" },
        { value: "HTMC-9AWM-U/W", label: "HTMC-9AWM-U/W" },
        { value: "HTMC-12AWM-U/W", label: "HTMC-12AWM-U/W" },
        { value: "HTMC-24AWM-U/W", label: "HTMC-24AWM-U/W" },
        { value: "HTMC-36AWM-U/W", label: "HTMC-36AWM-U/W" },
        { value: "HTMC-48AWM-U/W", label: "HTMC-48AWM-U/W" },
      ],
    },
    {
      value: "Mold monitor",
      label: "Mold monitor",
      children: [
        { value: "HDC-B500-1/W", label: "HDC-B500-1/W" },
        { value: "HDC-B500-2/W", label: "HDC-B500-2/W" },
        { value: "HDC-B500-3/W", label: "HDC-B500-3/W" },
        { value: "HDC-B500-4/W", label: "HDC-B500-4/W" },
      ],
    },
  ];

  const [options, setOptions] = useState(auxiliariesOptions);
  const [newItem, setNewItem] = useState("");

  //  useEffect(() => {
  //   const saved = localStorage.getItem(LOCAL_KEY);
  //   if (saved) setOptions(JSON.parse(saved));
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem(LOCAL_KEY, JSON.stringify(options));
  // }, [options]);

  const formatPartNumber = (value) => {
    if (!value) return "";
    const trimmed = value.trim();
    return trimmed.startsWith("ME-") ? trimmed : `ME-${trimmed}`;
  };
  const handleAuxiliariesChange = (value) => {
    setSelectedPath(value);
    setSelectedAuxiliaries(value);

    form.setFieldsValue({ auxiliaries: value });
    setAuxiliariesInputRow({
      partNumber: "",
      description: "",
      quantity: "",
      unit: "",
      stockInHand: "",
      note: "",
      purchaseCost: "",
      sellingCost: "",
      stockUnit: "",
      addOnCost: "",
      totalPrice: "",
    });
    setAuxiliariesDataSource([]);
  };

  const addNewItem = () => {
    const trimmedItem = newItem?.trim();
    if (!trimmedItem) {
      notification.warning({
        message: "Warning",
        description: "Please enter input to add",
      });
      form.setFieldsValue({ auxiliaries: selectedPath });

      return;
    }

    const currentPath = selectedPath || [];

    // Prevent more than 3 levels deep
    if (currentPath.length >= 3) {
      notification.warning({
        message: "Warning",
        description: "Cannot add more than 3 levels",
      });
      return;
    }

    // Recursive function to add item at correct path
    const addItemRecursively = (nodes, path) => {
      if (!Array.isArray(nodes)) nodes = [];
      const key = path[0];
      const remainingPath = path.slice(1);

      if (key === undefined) {
        // Top-level insertion
        if (
          !nodes.some(
            (n) => n?.value?.trim().toLowerCase() === trimmedItem.toLowerCase()
          )
        ) {
          nodes.push({ value: trimmedItem, label: trimmedItem });
        } else {
          throw new Error("Item already exists at this level");
        }
        return nodes;
      }

      return nodes.map((node) => {
        if (node.value === key) {
          const children = Array.isArray(node.children)
            ? [...node.children]
            : [];
          if (remainingPath.length === 0) {
            // Insert new item at this level
            if (
              children.some(
                (n) =>
                  n?.value?.trim().toLowerCase() === trimmedItem.toLowerCase()
              )
            ) {
              throw new Error("Item already exists at this level");
            }
            node.children = [
              ...children,
              { value: trimmedItem, label: trimmedItem },
            ];
          } else {
            node.children = addItemRecursively(children, remainingPath);
          }
        }
        return node;
      });
    };

    try {
      const updatedOptions = addItemRecursively([...options], currentPath);
      setOptions(updatedOptions);

      // Update selected path to include new item
      const newPath = [...currentPath, trimmedItem];
      setSelectedPath(newPath);
      setSelectedAuxiliaries(newPath);
      form.setFieldsValue({ auxiliaries: newPath });

      notification.success({
        message: "Success",
        description: `Added new item: ${trimmedItem}`,
      });
      setNewItem(""); // reset input
    } catch (err) {
      notification.info({
        message: "Info",
        description: err.message,
      });
    }
  };

  // const addNewItem = () => {
  //   const trimmedItem = newItem.trim();

  //   if (!trimmedItem) {
  //     notification.warning({
  //       message: "Warning",
  //       description: "Please enter a name to add",
  //     });
  //     return;
  //   }

  //   // Prevent more than 3 levels deep
  //   if (selectedPath.length >= 3) {
  //     notification.warning({
  //       message: "Warning",
  //       description: "Cannot add more than 3 levels",
  //     });
  //     return;
  //   }

  //   let updated = [...options];
  //   let exists = false;

  //   // Helper to check duplicates (case-insensitive and trimmed)
  //   const alreadyExists = (arr) =>
  //     arr?.some(
  //       (i) => i.value.trim().toLowerCase() === trimmedItem.toLowerCase()
  //     );

  //   if (selectedPath.length === 0) {
  //     if (alreadyExists(updated)) {
  //       exists = true;
  //     } else {
  //       updated.push({ value: trimmedItem, label: trimmedItem });
  //     }
  //   } else if (selectedPath.length === 1) {
  //     updated = updated.map((cat) => {
  //       if (cat.value === selectedPath[0]) {
  //         if (alreadyExists(cat.children)) {
  //           exists = true;
  //           return cat;
  //         }
  //         return {
  //           ...cat,
  //           children: [
  //             ...(cat.children || []),
  //             { value: trimmedItem, label: trimmedItem },
  //           ],
  //         };
  //       }
  //       return cat;
  //     });
  //   } else if (selectedPath.length === 2) {
  //     updated = updated.map((cat) => {
  //       if (cat.value === selectedPath[0]) {
  //         return {
  //           ...cat,
  //           children: cat.children.map((type) => {
  //             if (type.value === selectedPath[1]) {
  //               if (alreadyExists(type.children)) {
  //                 exists = true;
  //                 return type;
  //               }
  //               return {
  //                 ...type,
  //                 children: [
  //                   ...(type.children || []),
  //                   { value: trimmedItem, label: trimmedItem },
  //                 ],
  //               };
  //             }
  //             return type;
  //           }),
  //         };
  //       }
  //       return cat;
  //     });
  //   }

  //   if (exists) {
  //     notification.info({
  //       message: "Info",
  //       description: "Item already exists at this level",
  //     });
  //     return; // ✅ stop further processing
  //   }

  //   setOptions(updated);

  //   notification.success({
  //     message: "Success",
  //     description: `Added new item: ${trimmedItem}`,
  //   });

  //   setNewItem(""); // ✅ reset input only after successful add
  // };

  // const addNewItem = () => {
  //   const trimmedItem = newItem.trim();

  //   // Only warn if user tried to add and input is empty
  //   if (!trimmedItem) {
  //     if (newItem !== "") {
  //       notification.warning({
  //         message: "Warning",
  //         description: "Please enter a name to add",
  //       });
  //     }
  //     return;
  //   }

  //   // Check max levels
  //   if (selectedPath.length >= 3) {
  //     notification.warning({
  //       message: "Warning",
  //       description: `Cannot add more than 3 levels`,
  //     });
  //     return;
  //   }

  //   let updated = [...options];

  //   // Helper to check duplicates using trimmed values
  //   const existsInArray = (arr) => arr?.some((i) => i.value.trim() === trimmedItem);

  //   if (selectedPath.length === 0) {
  //     if (existsInArray(updated)) {
  //       notification.info({
  //         message: "Info",
  //         description: "Category already exists",
  //       });
  //       return;
  //     }
  //     updated.push({ value: trimmedItem, label: trimmedItem });
  //   } else if (selectedPath.length === 1) {
  //     updated = updated.map((cat) => {
  //       if (cat.value === selectedPath[0]) {
  //         if (existsInArray(cat.children)) return cat;
  //         return {
  //           ...cat,
  //           children: [...(cat.children || []), { value: trimmedItem, label: trimmedItem }],
  //         };
  //       }
  //       return cat;
  //     });
  //   } else if (selectedPath.length === 2) {
  //     updated = updated.map((cat) => {
  //       if (cat.value === selectedPath[0]) {
  //         return {
  //           ...cat,
  //           children: cat.children.map((type) => {
  //             if (type.value === selectedPath[1]) {
  //               if (existsInArray(type.children)) return type;
  //               return {
  //                 ...type,
  //                 children: [...(type.children || []), { value: trimmedItem, label: trimmedItem }],
  //               };
  //             }
  //             return type;
  //           }),
  //         };
  //       }
  //       return cat;
  //     });
  //   }

  //   setOptions(updated);

  //   notification.success({
  //     message: "Success",
  //     description: `Added new item: ${trimmedItem}`,
  //   });

  //   setNewItem(""); // reset input after successful add
  // };

  //  useEffect(() => {
  //   setSelectedPath([]);
  //   form.setFieldsValue({ auxiliaries: [] });
  //   setSelectedAuxiliaries(null);
  //     setNewItem("");
  // }, [selectedCategory]);

  // Fetch series list when IMM changes
  // useEffect(() => {
  //   if (!selectedIMMSeries) return;

  //   setSeriesLoading(true);

  //   fetch(GAS_URL, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //     body: new URLSearchParams({
  //       action: "getMachineSeries",
  //       series: selectedIMMSeries, // MA, JU, etc.
  //     }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log("Fetched Machine Series Data:", data); //

  //       if (data.success) {
  //         setSeriesModels(data.data || []);
  //       } else {
  //         console.error("Failed to load:", data.message);
  //         setSeriesModels([]);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error("Error fetching series:", err);
  //       setSeriesModels([]);
  //     })
  //     .finally(() => setSeriesLoading(false));
  // }, [selectedIMMSeries]);

  useEffect(() => {
    if (!selectedIMMSeries) return;

    const controller = new AbortController();
    const debounceTimer = setTimeout(() => {
      setSeriesLoading(true);

      fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          action: "getMachineSeries",
          series: selectedIMMSeries,
        }),
        signal: controller.signal,
      })
        .then((res) => res.json())
        // .then((data) => {
        //   if (data.success) setSeriesModels(data.data || []);
        //   else setSeriesModels([]);
        // })
        // inside useEffect that fetches series (you already have this)
        .then((data) => {
          if (data.success) {
            // remove empty and '-' placeholders
            const cleaned = (data.data || []).filter(
              (m) => m && String(m).trim() !== "-"
            );
            setSeriesModels(cleaned);
          } else {
            setSeriesModels([]);
          }
        })

        .catch((err) => {
          if (err.name !== "AbortError") setSeriesModels([]);
        })
        .finally(() => setSeriesLoading(false));
    }, 300); // debounce 300ms

    return () => {
      clearTimeout(debounceTimer);
      controller.abort(); // cancel previous request
    };
  }, [selectedIMMSeries]);

  useEffect(() => {
    if (!selectedMachine || !selectedIMMSeries) return;

    setMachineDataSource([]);
    setMachinesEditingKey("");
    setMachinesEditRow(null);
    setMachineInputRow({
      partNumber: "",
      description: "",
      quantity: "",
      unit: "",
      stockInHand: "",
      note: "",
      purchaseCost: "",
      sellingCost: "",
      stockUnit: "",
      addOnCost: "",
      totalPrice: "",
    });
  }, [selectedMachine, selectedIMMSeries]);

  useEffect(() => {
    const fetchAuxiliaries = async () => {
      setAuxOptionLoading(true);
      try {
        const res = await fetch(GAS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ action: "getAuxiliariesList" }),
        });
        const data = await res.json();
        // console.log("Fetched auxiliaries data from backend:", data);

        if (data.success && Array.isArray(data.data)) {
          setOptions((prevOptions) => mergeCascader(prevOptions, data.data));
        }
      } catch (err) {
        // console.error("Error fetching auxiliaries list:", err);
      } finally {
        setAuxOptionLoading(false);
      }
    };

    fetchAuxiliaries();
  }, []);

  // Deep merge function for cascader options
  // function mergeCascader(existing, incoming) {
  //   const map = {};

  //   existing.forEach((item) => {
  //     map[item.value.toLowerCase()] = { ...item };
  //     if (item.children)
  //       map[item.value.toLowerCase()].children = [...item.children];
  //   });

  //   incoming.forEach((item) => {
  //     const key = item.value.toLowerCase();
  //     if (!map[key]) {
  //       map[key] = item;
  //     } else if (item.children) {
  //       map[key].children = mergeCascader(
  //         map[key].children || [],
  //         item.children
  //       );
  //     }
  //   });

  //   return Object.values(map);
  // }

  function mergeCascader(existing = [], incoming = []) {
    const map = {};

    // Process existing items safely
    (existing || []).forEach((item) => {
      if (!item || !item.value) return; // skip invalid items
      const key = item.value.toLowerCase();
      map[key] = {
        ...item,
        children: Array.isArray(item.children) ? [...item.children] : [],
      };
    });

    // Process incoming items safely
    (incoming || []).forEach((item) => {
      if (!item || !item.value) return; // skip invalid items
      const key = item.value.toLowerCase();

      if (!map[key]) {
        map[key] = {
          ...item,
          children: Array.isArray(item.children) ? [...item.children] : [],
        };
      } else if (Array.isArray(item.children) && item.children.length > 0) {
        map[key].children = mergeCascader(
          map[key].children || [],
          item.children
        );
      }
    });

    return Object.values(map);
  }

  useEffect(() => {
    // 🔹 Reset common values
    setSelectedPath([]);
    form.setFieldsValue({ auxiliaries: [] });
    setSelectedAuxiliaries(null);
    setNewItem("");

    // 🔹 Reset Auxiliaries when not selected
    if (selectedCategory !== "Auxiliaries") {
      setAuxiliariesDataSource([]);
      setAuxiliariesEditRow(null);
      setAuxiliariesEditingKey("");
      setAuxiliariesInputRow({
        partNumber: "",
        description: "",
        quantity: "",
        unit: "",
        stockInHand: "",
        note: "",
        purchaseCost: "",
        sellingCost: "",
        stockUnit: "",
        addOnCost: "",
        totalPrice: "",
      });
    }

    // 🔹 Reset Machine when not selected
    if (selectedCategory !== "Machine") {
      setMachineDataSource([]);
      setMachinesEditRow(null);
      setMachinesEditingKey("");
      setMachineInputRow({
        partNumber: "",
        description: "",
        quantity: "",
        unit: "",
        stockInHand: "",
        note: "",
        purchaseCost: "",
        sellingCost: "",
        stockUnit: "",
        addOnCost: "",
        totalPrice: "",
      });
    }

    // 🔹 Reset Spare Parts when not selected
    if (selectedCategory !== "Spare Parts") {
      setSparePartsDataSource([]);
      setSparePartsEditRow(null);
      setSparePartsEditingKey("");
      setInputRow({
        partNumber: "",
        description: "",
        quantity: "",
        unit: "",
        stockInHand: "",
        note: "",
        purchaseCost: "",
        sellingCost: "",
        stockUnit: "",
        addOnCost: "",
        totalPrice: "",
      });
    }

    // 🔹 Reset Consumables when not selected
    if (selectedCategory !== "Consumables") {
      setConsumablesDataSource([]);
      setConsumablesEditRow(null);
      setConsumablesEditingKey("");
      setConsumablesInputRow({
        date: "",
        partNumber: "",
        description: "",
        quantity: "",
        unit: "",
        stockInHand: "",
        stockUnit: "",
        purchaseCost: "",
        addOnCost: "",
        sellingCost: "",
        totalPrice: "",
        note: "",
      });
    }
  }, [selectedCategory]);

  const fetchAllStock = async () => {
    try {
      const res = await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ action: "getAllStockData" }),
      });
      const result = await res.json();
      if (result.success) {
        setStockCache(result.data); // store { partNumber: { stockInHand, unit, categories } }
      }
    } catch (err) {
      // console.error("Error fetching all stock:", err);
    } finally {
      setLoadingStockCache(false);
    }
  };

  // Fetch once on mount
  useEffect(() => {
    fetchAllStock();
  }, []);

  // useEffect(() => {
  //   const controller = new AbortController();
  //   const debounceTimer = setTimeout(() => {
  //     const fetchStockInHand = async () => {
  //       if (!machineinputRow.partNumber.trim()) return;
  //       setMachineFetching(true);
  //       try {
  //         const res = await fetch(GAS_URL, {
  //           method: "POST",
  //           headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //           body: new URLSearchParams({
  //             action: "getStockForPartNumber",
  //             partNumber: machineinputRow.partNumber.trim(),
  //             category: "Machine",
  //           }),
  //           signal: controller.signal,
  //         });

  //         const result = await res.json();
  //         console.log("✅ Stock fetch response:", result);

  //         if (result.success) {
  //           setMachineInputRow((prev) => ({
  //             ...prev,
  //             stockInHand: result.stockInHand.toString(),
  //             stockUnit: result.unit,
  //           }));
  //         } else {
  //           setMachineInputRow((prev) => ({
  //             ...prev,
  //             stockInHand: "0",
  //           }));
  //         }
  //       } catch (err) {
  //         console.error("Error fetching stock:", err);
  //       } finally {
  //         setMachineFetching(false);
  //       }
  //     };

  //     fetchStockInHand();
  //   }, 400); // Wait 400ms after last change

  //   return () => {
  //     clearTimeout(debounceTimer); // Clear timer on partNumber change
  //     controller.abort(); // Cancel previous fetch
  //   };
  // }, [machineinputRow.partNumber]);

  //Working code before fetching stock and unit data
  // useEffect(() => {
  //   const controller = new AbortController();
  //   const timer = setTimeout(async () => {
  //     const part = machineinputRow.partNumber?.trim();
  //     if (!part) return;

  //     setMachineFetching(true);
  //     setMachineUnitLoading(true);

  //     try {
  //       // Fetch stock first
  //       const stockRes = await fetch(GAS_URL, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //         body: new URLSearchParams({
  //           action: "getStockForPartNumber",
  //           partNumber: part,
  //           category: "Machine",
  //         }),
  //         signal: controller.signal,
  //       });

  //       const stockText = await stockRes.text();
  //       const stockResult = JSON.parse(stockText);
  //       const stock = stockResult?.stockInHand || 0;
  //       const stockUnit = stockResult?.unit || "";

  //       // Fetch unit second
  //       const unitRes = await fetch(GAS_URL, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //         body: new URLSearchParams({
  //           action: "getUnitForPartNumber",
  //           partNumber: part,
  //           category: "Machine",
  //         }),
  //         signal: controller.signal,
  //       });

  //       const unitText = await unitRes.text();
  //       const unitResult = JSON.parse(unitText);
  //       const unit = (unitResult?.unit || "").toString().trim();
  //       const finalStockInHand = `${stock} ${stockUnit}`.trim();

  //       // Update state
  //       setMachineInputRow((prev) => ({
  //         ...prev,
  //         stockInHand: finalStockInHand,
  //         unit,
  //         machineUnitFetched: !!unit,
  //       }));

  //       form.setFieldsValue({ unit });

  //       const defaultUnits = ["Set", "Number", "Metre", "Piece", "Litre"];
  //       setMachineUnitOptions(
  //         userRole === "Admin"
  //           ? unit
  //             ? [...new Set([unit, ...defaultUnits])]
  //             : [...defaultUnits]
  //           : unit
  //           ? [unit]
  //           : [...defaultUnits]
  //       );
  //     } catch (err) {
  //       if (err.name !== "AbortError") {
  //         console.error("Fetch error:", err);
  //       }
  //       setMachineInputRow((prev) => ({
  //         ...prev,
  //         stockInHand: "0",
  //         unit: "",
  //         machineUnitFetched: false,
  //       }));
  //       form.setFieldsValue({ unit: "" });
  //       setMachineUnitOptions(["Set", "Number", "Metre", "Piece", "Litre"]);
  //     } finally {
  //       setMachineFetching(false);
  //       setMachineUnitLoading(false);
  //     }
  //   }, 400);

  //   return () => {
  //     clearTimeout(timer);
  //     controller.abort();
  //   };
  // }, [machineinputRow.partNumber]);

  // useEffect(() => {
  //   const part = machineinputRow.partNumber?.trim();
  //   if (!part) return;

  //   const defaultUnits = ["Set", "No's", "Metre", "Piece", "Litre", "Kg"];
  //   const cached = stockCache[part];
  //   let unit = "";
  //   let stock = "0";

  //   if (cached) {
  //     stock = `${cached.stockInHand} ${cached.unit || ""}`.trim();

  //     // ✅ category check
  //     // const belongsToCategory = cached.categories?.includes("Machine");
  //     // if (belongsToCategory && cached.unit) {
  //     //   unit = cached.unit.trim();
  //     // }
  //     unit = cached.unit?.trim() || "";
  //   }

  //   setMachineInputRow((prev) => ({
  //     ...prev,
  //     stockInHand: stock,
  //     unit,
  //   }));

  //   // ✅ Update dropdown options
  //   if (unit) {
  //     setMachineUnitOptions(
  //       isFullControl ? [...new Set([unit, ...defaultUnits])] : [unit]
  //     );
  //   } else {
  //     setMachineUnitOptions([...defaultUnits]);
  //   }
  // }, [machineinputRow.partNumber, stockCache, userRole]);

  // useEffect(() => {
  //   const part = machineinputRow.partNumber?.trim();
  //   if (!part) return;

  //   const defaultUnits = ["Set", "No's", "Metre", "Piece", "Litre", "Kg"];
  //   const cached = stockCache[part];
  //   let unit = "";
  //   let stock = "0";

  //   if (cached) {
  //     stock = `${cached.stockInHand} ${cached.unit || ""}`.trim();

  //     // ✅ category check
  //     // const belongsToCategory = cached.categories?.includes("Machine");
  //     // if (belongsToCategory && cached.unit) {
  //     //   unit = cached.unit.trim();
  //     // }
  //     unit = cached.unit?.trim() || "";
  //   }

  //   setMachineInputRow((prev) => ({
  //     ...prev,
  //     stockInHand: stock,
  //     unit,
  //   }));

  //   // ✅ Update dropdown options
  //   if (unit) {
  //     setMachineUnitOptions(
  //       isFullControl ? [...new Set([unit, ...defaultUnits])] : [unit]
  //     );
  //   } else {
  //     setMachineUnitOptions([...defaultUnits]);
  //   }
  // }, [machineinputRow.partNumber, stockCache, userRole]);

  useEffect(() => {
  const part = machineinputRow.partNumber?.trim();
  const loc  = machineinputRow.location?.trim();

  if (!part) return;

  const defaultUnits = ["Set", "No's", "Metre", "Piece", "Litre", "Kg"];

  const cachedPart = stockCache[part];
  const cachedLoc  = cachedPart?.[loc];

  let stock = "0";
  let unit = "";

  if (cachedLoc) {
    stock = `${cachedLoc.stockInHand} ${cachedLoc.unit || ""}`.trim();
    unit = cachedLoc.unit?.trim() || "";
  }

  setMachineInputRow(prev => ({
    ...prev,
    stockInHand: stock,
    unit,
  }));

  // SAME BEHAVIOR AS COMMENTED CODE
  if (unit) {
    setMachineUnitOptions(
      isFullControl
        ? [...new Set([unit, ...defaultUnits])]
        : [unit]
    );
  } else {
    setMachineUnitOptions([...defaultUnits]);
  }
}, [machineinputRow.partNumber, machineinputRow.location, stockCache, userRole]);


  // useEffect(() => {
  //   if (!machinesEditRow || !machinesEditRow.partNumber?.trim()) return;

  //   const part = machinesEditRow.partNumber.trim();
  //   const cached = stockCache[part];
  //   const defaultUnits = ["Set", "No's", "Metre", "Piece", "Litre", "Kg"];

  //   let stock = "0";
  //   let unit = machinesEditRow.unit?.trim() || "";

  //   if (cached) {
  //     stock = `${cached.stockInHand || 0} ${cached.unit || ""}`.trim();
  //     if (!unit) unit = cached.unit?.trim() || "";
  //   }

  //   setMachinesEditRow((prev) => ({
  //     ...prev,
  //     stockInHand: stock,
  //     unit,
  //     machinesUnitFetched: !!unit,
  //   }));

  //   form.setFieldsValue({ unit });

  //   setMachineUnitOptions(
  //     isFullControl
  //       ? unit
  //         ? [...new Set([unit, ...defaultUnits])]
  //         : [...defaultUnits]
  //       : unit
  //       ? [unit]
  //       : [...defaultUnits]
  //   );
  // }, [machinesEditRow?.partNumber, stockCache]);

  useEffect(() => {
  if (!machinesEditRow || !machinesEditRow.partNumber?.trim()) return;

  const part = machinesEditRow.partNumber.trim();
  const loc  = machinesEditRow.location?.trim();

  const defaultUnits = ["Set", "No's", "Metre", "Piece", "Litre", "Kg"];

  const cachedPart = stockCache[part];
  const cachedLoc  = cachedPart?.[loc];

  let stock = "0";
  let unit  = machinesEditRow.unit?.trim() || "";

  if (cachedLoc) {
    stock = `${cachedLoc.stockInHand || 0} ${cachedLoc.unit || ""}`.trim();

    // Same logic as COMMENTED CODE:
    if (!unit) {
      unit = cachedLoc.unit?.trim() || "";
    }
  }

  setMachinesEditRow(prev => ({
    ...prev,
    stockInHand: stock,
    unit,
    machinesUnitFetched: !!unit,
  }));

  form.setFieldsValue({ unit });

  // SAME behavior as commented code
  setMachineUnitOptions(
    isFullControl
      ? unit
        ? [...new Set([unit, ...defaultUnits])]
        : [...defaultUnits]
      : unit
      ? [unit]
      : [...defaultUnits]
  );
}, [machinesEditRow?.partNumber, machinesEditRow?.location, stockCache]);


  // useEffect(() => {
  //   const controller = new AbortController();
  //   const debounceTimer = setTimeout(() => {
  //     const fetchStockInHand = async () => {
  //       if (!auxiliariesInputRow.partNumber.trim()) return;
  //       setAuxiliariesFetching(true);
  //       try {
  //         const res = await fetch(GAS_URL, {
  //           method: "POST",
  //           headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //           body: new URLSearchParams({
  //             action: "getStockForPartNumber",
  //             partNumber: auxiliariesInputRow.partNumber.trim(),
  //             category: "Auxiliaries",
  //           }),
  //           signal: controller.signal,
  //         });

  //         const result = await res.json();
  //         if (result.success) {
  //           setAuxiliariesInputRow((prev) => ({
  //             ...prev,
  //             stockInHand: result.stockInHand.toString(),
  //             stockUnit: result.unit,
  //           }));
  //         } else {
  //           setAuxiliariesInputRow((prev) => ({
  //             ...prev,
  //             stockInHand: "0",
  //           }));
  //         }
  //       } catch (err) {
  //         console.error("Error fetching stock (Auxiliaries):", err);
  //       } finally {
  //         setAuxiliariesFetching(false);
  //       }
  //     };

  //     fetchStockInHand();
  //   }, 400);
  //   return () => {
  //     clearTimeout(debounceTimer); // Clear timer on partNumber change
  //     controller.abort(); // Cancel previous fetch
  //   };
  // }, [auxiliariesInputRow.partNumber]);

  //Working code before fetching stock and unit data
  // useEffect(() => {
  //   const controller = new AbortController();
  //   const timer = setTimeout(async () => {
  //     const part = auxiliariesInputRow.partNumber?.trim();
  //     if (!part) return;

  //     setAuxiliariesFetching(true);
  //     setAuxiliariesUnitLoading(true);

  //     try {
  //       console.log(`🔄 Fetching stock for part: ${part}`);

  //       // Step 1: Fetch stock
  //       const stockRes = await fetch(GAS_URL, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //         body: new URLSearchParams({
  //           action: "getStockForPartNumber",
  //           partNumber: part,
  //           category: "Auxiliaries",
  //         }),
  //         signal: controller.signal,
  //       });

  //       const stockText = await stockRes.text();
  //       console.log("📦 Stock API Raw Response:", stockText);
  //       const stockResult = JSON.parse(stockText);
  //       const stock = stockResult?.stockInHand || 0;
  //       const stockUnit = stockResult?.unit || "";

  //       console.log(`✅ Stock in hand for ${part}:`, stock);

  //       // Step 2: Fetch unit
  //       console.log(`🔄 Fetching unit for part: ${part}`);

  //       const unitRes = await fetch(GAS_URL, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //         body: new URLSearchParams({
  //           action: "getUnitForPartNumber",
  //           partNumber: part,
  //           category: "Auxiliaries",
  //         }),
  //         signal: controller.signal,
  //       });

  //       const unitText = await unitRes.text();
  //       console.log("📏 Unit API Raw Response:", unitText);
  //       const unitResult = JSON.parse(unitText);
  //       const unit = (unitResult?.unit || "").toString().trim();

  //       console.log(`✅ Unit for ${part}:`, unit);

  //       // Final step: update state
  //       const finalStockInHand = `${stock} ${stockUnit}`.trim();
  //       console.log("📝 Updating input row with:", {
  //         stockInHand: finalStockInHand,
  //         unit,
  //       });

  //       setAuxiliariesInputRow((prev) => ({
  //         ...prev,
  //         stockInHand: finalStockInHand,
  //         unit,
  //         auxiliariesUnitFetched: !!unit,
  //       }));

  //       form.setFieldsValue({ unit });

  //       const defaultUnits = ["Set", "Number", "Metre", "Piece", "Litre"];
  //       setAuxiliariesUnitOptions(
  //         userRole === "Admin"
  //           ? unit
  //             ? [...new Set([unit, ...defaultUnits])]
  //             : [...defaultUnits]
  //           : unit
  //           ? [unit]
  //           : [...defaultUnits]
  //       );
  //     } catch (err) {
  //       if (err.name !== "AbortError") {
  //         console.error("❌ Fetch error:", err);
  //       }

  //       setAuxiliariesInputRow((prev) => ({
  //         ...prev,
  //         stockInHand: "0",
  //         unit: "",
  //         auxiliariesUnitFetched: false,
  //       }));
  //       form.setFieldsValue({ unit: "" });
  //       setAuxiliariesUnitOptions(["Set", "Number", "Metre", "Piece", "Litre"]);
  //     } finally {
  //       setAuxiliariesFetching(false);
  //       setAuxiliariesUnitLoading(false);
  //     }
  //   }, 400);

  //   return () => {
  //     clearTimeout(timer);
  //     controller.abort();
  //   };
  // }, [auxiliariesInputRow.partNumber]);

  // useEffect(() => {
  //   const part = auxiliariesInputRow.partNumber?.trim();
  //   if (!part) return;

  //   const defaultUnits = ["Set", "No's", "Metre", "Piece", "Litre", "Kg"];
  //   const cached = stockCache[part];
  //   let unit = "";
  //   let stock = "0";

  //   if (cached) {
  //     stock = `${cached.stockInHand} ${cached.unit || ""}`.trim();
  //     unit = cached.unit?.trim() || "";
  //   }

  //   setAuxiliariesInputRow((prev) => ({
  //     ...prev,
  //     stockInHand: stock,
  //     unit,
  //   }));

  //   if (unit) {
  //     setAuxiliariesUnitOptions(
  //       isFullControl ? [...new Set([unit, ...defaultUnits])] : [unit]
  //     );
  //   } else {
  //     setAuxiliariesUnitOptions([...defaultUnits]);
  //   }
  // }, [auxiliariesInputRow.partNumber, stockCache, userRole]);

useEffect(() => {
  const part = auxiliariesInputRow.partNumber?.trim();
  const loc  = auxiliariesInputRow.location?.trim();

  if (!part) return;

  const defaultUnits = ["Set", "No's", "Metre", "Piece", "Litre", "Kg"];

  const cachedPart = stockCache[part];
  const cachedLoc  = cachedPart?.[loc];

  let stock = "0";
  let unit  = "";

  if (cachedLoc) {
    stock = `${cachedLoc.stockInHand} ${cachedLoc.unit || ""}`.trim();
    unit  = cachedLoc.unit?.trim() || "";
  }

  setAuxiliariesInputRow(prev => ({
    ...prev,
    stockInHand: stock,
    unit,
  }));

  // 🔥 EXACTLY LIKE COMMENTED CODE
  if (unit) {
    setAuxiliariesUnitOptions(
      isFullControl ? [...new Set([unit, ...defaultUnits])] : [unit]
    );
  } else {
    setAuxiliariesUnitOptions([...defaultUnits]);
  }
}, [auxiliariesInputRow.partNumber, auxiliariesInputRow.location, stockCache, userRole]);


  // useEffect(() => {
  //   if (!auxiliariesEditRow || !auxiliariesEditRow.partNumber?.trim()) return;

  //   const part = auxiliariesEditRow.partNumber.trim();
  //   const cached = stockCache[part];
  //   const defaultUnits = ["Set", "No's", "Metre", "Piece", "Litre", "Kg"];

  //   let stock = "0";
  //   let unit = auxiliariesEditRow.unit?.trim() || "";

  //   if (cached) {
  //     stock = `${cached.stockInHand || 0} ${cached.unit || ""}`.trim();
  //     if (!unit) unit = cached.unit?.trim() || "";
  //   }

  //   setAuxiliariesEditRow((prev) => ({
  //     ...prev,
  //     stockInHand: stock,
  //     unit,
  //     auxiliariesUnitFetched: !!unit,
  //   }));

  //   form.setFieldsValue({ unit });

  //   setAuxiliariesUnitOptions(
  //     isFullControl
  //       ? unit
  //         ? [...new Set([unit, ...defaultUnits])]
  //         : [...defaultUnits]
  //       : unit
  //       ? [unit]
  //       : [...defaultUnits]
  //   );
  // }, [auxiliariesEditRow?.partNumber, stockCache]);

  useEffect(() => {
  if (!auxiliariesEditRow || !auxiliariesEditRow.partNumber?.trim()) return;

  const part = auxiliariesEditRow.partNumber.trim();
  const loc  = auxiliariesEditRow.location?.trim();

  const defaultUnits = ["Set", "No's", "Metre", "Piece", "Litre", "Kg"];

  const cachedPart = stockCache[part];
  const cachedLoc  = cachedPart?.[loc];

  let stock = "0";
  let unit  = auxiliariesEditRow.unit?.trim() || ""; // user may edit unit

  if (cachedLoc) {
    stock = `${cachedLoc.stockInHand || 0} ${cachedLoc.unit || ""}`.trim();

    // 🔥 EXACT SAME LOGIC AS COMMENTED CODE:
    if (!unit) {
      unit = cachedLoc.unit?.trim() || "";
    }
  }

  setAuxiliariesEditRow(prev => ({
    ...prev,
    stockInHand: stock,
    unit,
    auxiliariesUnitFetched: !!unit,
  }));

  form.setFieldsValue({ unit });

  // 🔥 EXACT commented dropdown logic
  setAuxiliariesUnitOptions(
    isFullControl
      ? unit
        ? [...new Set([unit, ...defaultUnits])]
        : [...defaultUnits]
      : unit
      ? [unit]
      : [...defaultUnits]
  );
}, [auxiliariesEditRow?.partNumber, auxiliariesEditRow?.location, stockCache]);


  // useEffect(() => {
  //   const controller = new AbortController();
  //   const debounceTimer = setTimeout(() => {
  //     const fetchStockInHand = async () => {
  //       if (!assetsInputRow.partNumber.trim()) return;
  //       setAssetsFetching(true);
  //       try {
  //         const res = await fetch(GAS_URL, {
  //           method: "POST",
  //           headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //           body: new URLSearchParams({
  //             action: "getStockForPartNumber",
  //             partNumber: assetsInputRow.partNumber.trim(),
  //             category: "Assets",
  //           }),
  //           signal: controller.signal,
  //         });

  //         const result = await res.json();
  //         console.log("✅ Stock fetch response:", result);
  //         if (result.success) {
  //           setAssetsInputRow((prev) => ({
  //             ...prev,
  //             stockInHand: result.stockInHand.toString(),
  //             stockUnit: result.unit,
  //           }));
  //         } else {
  //           setAssetsInputRow((prev) => ({
  //             ...prev,
  //             stockInHand: "0",
  //           }));
  //         }
  //       } catch (err) {
  //         console.error("Error fetching stock (Assets):", err);
  //       } finally {
  //         setAssetsFetching(false);
  //       }
  //     };

  //     fetchStockInHand();
  //   }, 400);
  //   return () => {
  //     clearTimeout(debounceTimer); // Clear timer on partNumber change
  //     controller.abort(); // Cancel previous fetch
  //   };
  // }, [assetsInputRow.partNumber]);

  //Working code before fetching stock and unit data
  // useEffect(() => {
  //   const controller = new AbortController();
  //   const timer = setTimeout(async () => {
  //     const part = assetsInputRow.partNumber?.trim();
  //     if (!part) return;

  //     setAssetsFetching(true);
  //     setAssetsUnitLoading(true);

  //     try {
  //       console.log(`🔄 Fetching stock for part: ${part}`);

  //       // Step 1: Fetch stock
  //       const stockRes = await fetch(GAS_URL, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //         body: new URLSearchParams({
  //           action: "getStockForPartNumber",
  //           partNumber: part,
  //           category: "Assets",
  //         }),
  //         signal: controller.signal,
  //       });

  //       const stockText = await stockRes.text();
  //       console.log("📦 Stock API Raw Response:", stockText);
  //       const stockResult = JSON.parse(stockText);
  //       const stock = stockResult?.stockInHand || 0;
  //       const stockUnit = stockResult?.unit || "";

  //       console.log(`✅ Stock in hand for ${part}:`, stock);

  //       // Step 2: Fetch unit
  //       console.log(`🔄 Fetching unit for part: ${part}`);

  //       const unitRes = await fetch(GAS_URL, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //         body: new URLSearchParams({
  //           action: "getUnitForPartNumber",
  //           partNumber: part,
  //           category: "Assets",
  //         }),
  //         signal: controller.signal,
  //       });

  //       const unitText = await unitRes.text();
  //       console.log("📏 Unit API Raw Response:", unitText);
  //       const unitResult = JSON.parse(unitText);
  //       const unit = (unitResult?.unit || "").toString().trim();

  //       console.log(`✅ Unit for ${part}:`, unit);

  //       // Final step: update state
  //       const finalStockInHand = `${stock} ${stockUnit}`.trim();
  //       console.log("📝 Updating input row with:", {
  //         stockInHand: finalStockInHand,
  //         unit,
  //       });

  //       setAssetsInputRow((prev) => ({
  //         ...prev,
  //         stockInHand: finalStockInHand,
  //         unit,
  //         assetsUnitFetched: !!unit,
  //       }));

  //       form.setFieldsValue({ unit });

  //       const defaultUnits = ["Set", "Number", "Metre", "Piece", "Litre"];
  //       setAssetsUnitOptions(
  //         userRole === "Admin"
  //           ? unit
  //             ? [...new Set([unit, ...defaultUnits])]
  //             : [...defaultUnits]
  //           : unit
  //           ? [unit]
  //           : [...defaultUnits]
  //       );
  //     } catch (err) {
  //       if (err.name !== "AbortError") {
  //         console.error("❌ Fetch error:", err);
  //       }

  //       setAssetsInputRow((prev) => ({
  //         ...prev,
  //         stockInHand: "0",
  //         unit: "",
  //         assetsUnitFetched: false,
  //       }));
  //       form.setFieldsValue({ unit: "" });
  //       setAssetsUnitOptions(["Set", "Number", "Metre", "Piece", "Litre"]);
  //     } finally {
  //       setAssetsFetching(false);
  //       setAssetsUnitLoading(false);
  //     }
  //   }, 400);

  //   return () => {
  //     clearTimeout(timer);
  //     controller.abort();
  //   };
  // }, [assetsInputRow.partNumber]);

  // useEffect(() => {
  //   const part = assetsInputRow.partNumber?.trim();
  //   if (!part) return;

  //   const defaultUnits = ["Set", "Number", "Metre", "Piece", "Litre"];
  //   const cached = stockCache[part];
  //   let unit = "";
  //   let stock = "0";

  //   if (cached) {
  //     stock = `${cached.stockInHand} ${cached.unit || ""}`.trim();
  //     unit = cached.unit?.trim() || "";
  //   }

  //   setAssetsInputRow((prev) => ({
  //     ...prev,
  //     stockInHand: stock,
  //     unit,
  //   }));

  //   if (unit) {
  //     setAssetsUnitOptions(
  //       userRole === "Admin" ? [...new Set([unit, ...defaultUnits])] : [unit]
  //     );
  //   } else {
  //     setAssetsUnitOptions([...defaultUnits]);
  //   }
  // }, [assetsInputRow.partNumber, stockCache, userRole]);

  // useEffect(() => {
  //   const controller = new AbortController();
  //   const debounceTimer = setTimeout(() => {
  //     const fetchStockInHand = async () => {
  //       if (!inputRow.partNumber.trim()) return;
  //       setSparePartsFetching(true);
  //       try {
  //         const res = await fetch(GAS_URL, {
  //           method: "POST",
  //           headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //           body: new URLSearchParams({
  //             action: "getStockForPartNumber",
  //             partNumber: inputRow.partNumber.trim(),
  //             category: "Spare Parts",
  //           }),
  //           signal: controller.signal,
  //         });

  //         const result = await res.json();
  //         if (result.success) {
  //           setInputRow((prev) => ({
  //             ...prev,
  //             stockInHand: result.stockInHand.toString(),
  //             stockUnit: result.unit,
  //           }));
  //         } else {
  //           setInputRow((prev) => ({
  //             ...prev,
  //             stockInHand: "0",
  //           }));
  //         }
  //       } catch (err) {
  //         console.error("Error fetching stock (Spare Parts):", err);
  //       } finally {
  //         setSparePartsFetching(false);
  //       }
  //     };

  //     fetchStockInHand();
  //   }, 400);
  //   return () => {
  //     clearTimeout(debounceTimer); // Clear timer on partNumber change
  //     controller.abort(); // Cancel previous fetch
  //   };
  // }, [inputRow.partNumber]);

  //   useEffect(() => {
  //     const controller = new AbortController();
  //     const timer = setTimeout(async () => {
  //       const part = inputRow.partNumber?.trim();
  //       if (!part) return;

  //       setSparePartsFetching(true);
  //       try {
  //         const res = await fetch(GAS_URL, {
  //           method: "POST",
  //           headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //           body: new URLSearchParams({
  //             action: "getUnitForPartNumber",
  //             partNumber: part,
  //             category: "Spare Parts",
  //           }),
  //         });

  //         const text = await res.text();
  //         let json;
  //         try {
  //           json = JSON.parse(text);
  //         } catch (parseErr) {
  //           console.error("JSON parse error:", parseErr);
  //           setInputRow((prev) => ({ ...prev, stockInHand: "0" }));
  //           return;
  //         }

  // if (json.success) {
  //   const unit = (json.unit || "").toString().trim();

  //   setInputRow((prev) => ({
  //     ...prev,
  //     stockInHand: (json.stockInHand || 0).toString(),
  //     unit,
  //   }));

  //   form.setFieldsValue({ unit }); // ✅ sync with AntD Form

  //   setUnitFetched(!!unit);

  //   if (unit) {
  //     if (userRole === "Admin") {
  //       const defaultUnits = ["Set", "Number", "Metre", "Piece", "Litre"];
  //       setSpareUnitOptions([...new Set([unit, ...defaultUnits])]);
  //     } else {
  //       setSpareUnitOptions([unit]);
  //     }
  //   } else {
  //     setSpareUnitOptions(["Set", "Number", "Metre", "Piece", "Litre"]);
  //   }
  // }

  //       } catch (err) {
  //         if (err.name !== "AbortError") {
  //           console.error("Fetch error:", err);
  //         }
  //         setSpareUnitOptions(["Set", "Number", "Metre", "Piece", "Litre"]);
  //       } finally {
  //         setSparePartsFetching(false);
  //       }
  //     }, 400);

  //     return () => {
  //       clearTimeout(timer);
  //       controller.abort();
  //     };
  //   }, [inputRow.partNumber]);

  // useEffect(() => {
  //   const controller = new AbortController();
  //   const timer = setTimeout(async () => {
  //     const part = inputRow.partNumber?.trim();
  //     if (!part) return;

  //     setSparePartsFetching(true);
  //     try {
  //       const res = await fetch(GAS_URL, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //         body: new URLSearchParams({
  //           action: "getUnitForPartNumber",
  //           partNumber: part,
  //           category: "Spare Parts",
  //         }),
  //         signal: controller.signal,
  //       });

  //       const text = await res.text();
  //       let result;
  //       try {
  //         result = JSON.parse(text);
  //       } catch (parseErr) {
  //         console.error("JSON parse error:", parseErr);
  //         setInputRow((prev) => ({
  //           ...prev,
  //           stockInHand: "0",
  //           unit: "",
  //           sparePartsUnitFetched: false,
  //         }));
  //         return;
  //       }

  //       if (result.success) {
  //         const unit = (result.unit || "").toString().trim();

  //         setInputRow((prev) => ({
  //           ...prev,
  //           stockInHand: (result.stockInHand || 0).toString(),
  //           unit,
  //           sparePartsUnitFetched: !!unit,
  //         }));

  //         form.setFieldsValue({ unit });

  //         if (unit) {
  //           const defaultUnits = ["Set", "Number", "Metre", "Piece", "Litre"];
  //           if (userRole === "Admin") {
  //             setSpareUnitOptions([...new Set([unit, ...defaultUnits])]);
  //           } else {
  //             setSpareUnitOptions([unit]);
  //           }
  //         } else {
  //           setSpareUnitOptions(["Set", "Number", "Metre", "Piece", "Litre"]);
  //         }
  //       } else {
  //         setInputRow((prev) => ({
  //           ...prev,
  //           stockInHand: "0",
  //           unit: "",
  //           sparePartsUnitFetched: false,
  //         }));
  //         form.setFieldsValue({ unit: "" });
  //         setSpareUnitOptions(["Set", "Number", "Metre", "Piece", "Litre"]);
  //       }
  //     } catch (err) {
  //       if (err.name !== "AbortError") {
  //         console.error("Fetch error:", err);
  //       }
  //       setSpareUnitOptions(["Set", "Number", "Metre", "Piece", "Litre"]);
  //     } finally {
  //       setSparePartsFetching(false);
  //     }
  //   }, 400);

  //   return () => {
  //     clearTimeout(timer);
  //     controller.abort();
  //   };
  // }, [inputRow.partNumber]);

  //Working code before fetching stock and unit data
  // useEffect(() => {
  //   const controller = new AbortController();
  //   const timer = setTimeout(async () => {
  //     const part = inputRow.partNumber?.trim();
  //     if (!part) return;

  //     setSparePartsFetching(true);
  //     setSpareUnitLoading(true);

  //     try {
  //       console.log(`🔄 Fetching stock for part: ${part}`);

  //       // Step 1: Fetch stock
  //       const stockRes = await fetch(GAS_URL, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //         body: new URLSearchParams({
  //           action: "getStockForPartNumber",
  //           partNumber: part,
  //           category: "Spare Parts",
  //         }),
  //         signal: controller.signal,
  //       });

  //       const stockText = await stockRes.text();
  //       console.log("📦 Stock API Raw Response:", stockText);
  //       const stockResult = JSON.parse(stockText);
  //       const stock = stockResult?.stockInHand || 0;
  //       const stockUnit = stockResult?.unit || "";

  //       console.log(`✅ Stock in hand for ${part}:`, stock);

  //       console.log(`🔄 Fetching unit for part: ${part}`);

  //       const unitRes = await fetch(GAS_URL, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //         body: new URLSearchParams({
  //           action: "getUnitForPartNumber",
  //           partNumber: part,
  //           category: "Spare Parts",
  //         }),
  //         signal: controller.signal,
  //       });

  //       const unitText = await unitRes.text();
  //       console.log("📏 Unit API Raw Response:", unitText);
  //       const unitResult = JSON.parse(unitText);
  //       const unit = (unitResult?.unit || "").toString().trim();

  //       console.log(`✅ Unit for ${part}:`, unit);

  //       const finalStockInHand = `${stock} ${stockUnit}`.trim();
  //       console.log("📝 Updating input row with:", {
  //         stockInHand: finalStockInHand,
  //         unit,
  //       });

  //       setInputRow((prev) => ({
  //         ...prev,
  //         stockInHand: finalStockInHand,
  //         unit,
  //         sparePartsUnitFetched: !!unit,
  //       }));

  //       form.setFieldsValue({ unit });

  //       const defaultUnits = ["Set", "Number", "Metre", "Piece", "Litre"];
  //       setSpareUnitOptions(
  //         userRole === "Admin"
  //           ? unit
  //             ? [...new Set([unit, ...defaultUnits])]
  //             : [...defaultUnits]
  //           : unit
  //           ? [unit]
  //           : [...defaultUnits]
  //       );
  //     } catch (err) {
  //       if (err.name !== "AbortError") {
  //         console.error("❌ Fetch error:", err);
  //       }

  //       setInputRow((prev) => ({
  //         ...prev,
  //         stockInHand: "0",
  //         unit: "",
  //         sparePartsUnitFetched: false,
  //       }));
  //       form.setFieldsValue({ unit: "" });
  //       setSpareUnitOptions(["Set", "Number", "Metre", "Piece", "Litre"]);
  //     } finally {
  //       setSparePartsFetching(false);
  //       setSpareUnitLoading(false);
  //     }
  //   }, 400);

  //   return () => {
  //     clearTimeout(timer);
  //     controller.abort();
  //   };
  // }, [inputRow.partNumber]);

  // useEffect(() => {
  //   const part = inputRow.partNumber?.trim();
  //   if (!part) return;

  //   const defaultUnits = ["Set", "No's", "Metre", "Piece", "Litre", "Kg"];
  //   const cached = stockCache[part];
  //   let unit = "";
  //   let stock = "0";

  //   setSparePartsFetching(true);
  //   setSpareUnitLoading(true);

  //   try {
  //     if (cached) {
  //       stock = `${cached.stockInHand} ${cached.unit || ""}`.trim();
  //       unit = cached.unit?.trim() || "";
  //     }

  //     setInputRow((prev) => ({
  //       ...prev,
  //       stockInHand: stock,
  //       unit,
  //       sparePartsUnitFetched: !!unit,
  //     }));

  //     // also update the AntD form field
  //     form.setFieldsValue({ unit });

  //     // update dropdown options
  //     setSpareUnitOptions(
  //       isFullControl
  //         ? unit
  //           ? [...new Set([unit, ...defaultUnits])]
  //           : [...defaultUnits]
  //         : unit
  //         ? [unit]
  //         : [...defaultUnits]
  //     );
  //   } catch (err) {
  //     // console.error("❌ Error updating spare parts from cache:", err);

  //     setInputRow((prev) => ({
  //       ...prev,
  //       stockInHand: "0",
  //       unit: "",
  //       sparePartsUnitFetched: false,
  //     }));
  //     form.setFieldsValue({ unit: "" });
  //     setSpareUnitOptions(defaultUnits);
  //   } finally {
  //     setSparePartsFetching(false);
  //     setSpareUnitLoading(false);
  //   }
  // }, [inputRow.partNumber, stockCache, userRole]);
  useEffect(() => {
  const part = inputRow.partNumber?.trim();
  const loc  = inputRow.location?.trim();

  if (!part) return;

  const defaultUnits = ["Set", "No's", "Metre", "Piece", "Litre", "Kg"];

  const cachedPart = stockCache[part];
  const cachedLoc  = cachedPart?.[loc];

  let stock = "0";
  let unit  = "";

  setSparePartsFetching(true);
  setSpareUnitLoading(true);

  try {
    if (cachedLoc) {
      stock = `${cachedLoc.stockInHand} ${cachedLoc.unit || ""}`.trim();
      unit  = cachedLoc.unit?.trim() || "";
    }

    setInputRow(prev => ({
      ...prev,
      stockInHand: stock,
      unit,
      sparePartsUnitFetched: !!unit,
    }));

    // update AntD form
    form.setFieldsValue({ unit });

    // 🔥 EXACT original logic
    setSpareUnitOptions(
      isFullControl
        ? unit
          ? [...new Set([unit, ...defaultUnits])]
          : [...defaultUnits]
        : unit
        ? [unit]
        : [...defaultUnits]
    );
  } catch (err) {
    setInputRow(prev => ({
      ...prev,
      stockInHand: "0",
      unit: "",
      sparePartsUnitFetched: false,
    }));

    form.setFieldsValue({ unit: "" });
    setSpareUnitOptions(defaultUnits);
  } finally {
    setSparePartsFetching(false);
    setSpareUnitLoading(false);
  }
}, [inputRow.partNumber, inputRow.location, stockCache, userRole]);


  // useEffect(() => {
  //   if (!sparePartsEditRow || !sparePartsEditRow.partNumber?.trim()) return;

  //   const part = sparePartsEditRow.partNumber.trim();
  //   const cached = stockCache[part];
  //   const defaultUnits = ["Set", "Number", "Metre", "Piece", "Litre", "Kg"];

  //   let stock = "0";
  //   let unit = "";

  //   if (cached) {
  //     stock = `${cached.stockInHand || 0} ${cached.unit || ""}`.trim();
  //     unit = cached.unit?.trim() || "";
  //   }

  //   setSparePartsEditRow((prev) => ({
  //     ...prev,
  //     stockInHand: stock,
  //     unit,
  //     sparePartsUnitFetched: !!unit,
  //   }));

  //   // update AntD form field
  //   form.setFieldsValue({ unit });

  //   // update dropdown options
  //   setSpareUnitOptions(
  //     isFullControl
  //       ? unit
  //         ? [...new Set([unit, ...defaultUnits])]
  //         : [...defaultUnits]
  //       : unit
  //       ? [unit]
  //       : [...defaultUnits]
  //   );
  // }, [sparePartsEditRow?.partNumber, stockCache]);

  // useEffect(() => {
  //   if (!sparePartsEditRow || !sparePartsEditRow.partNumber?.trim()) return;

  //   const part = sparePartsEditRow.partNumber.trim();
  //   const cached = stockCache[part];
  //   const defaultUnits = ["Set", "No's", "Metre", "Piece", "Litre", "Kg"];

  //   let stock = "0";
  //   let unit = sparePartsEditRow.unit?.trim() || ""; // ✅ prefer row’s unit

  //   if (cached) {
  //     stock = `${cached.stockInHand || 0} ${cached.unit || ""}`.trim();
  //     if (!unit) {
  //       unit = cached.unit?.trim() || "";
  //     }
  //   }

  //   setSparePartsEditRow((prev) => ({
  //     ...prev,
  //     stockInHand: stock,
  //     unit,
  //     sparePartsUnitFetched: !!unit,
  //   }));

  //   form.setFieldsValue({ unit });

  //   setSpareUnitOptions(
  //     isFullControl
  //       ? unit
  //         ? [...new Set([unit, ...defaultUnits])]
  //         : [...defaultUnits]
  //       : unit
  //       ? [unit]
  //       : [...defaultUnits]
  //   );
  // }, [sparePartsEditRow?.partNumber, stockCache]);

  useEffect(() => {
  if (!sparePartsEditRow || !sparePartsEditRow.partNumber?.trim()) return;

  const part = sparePartsEditRow.partNumber.trim();
  const loc  = sparePartsEditRow.location?.trim();

  const defaultUnits = ["Set", "No's", "Metre", "Piece", "Litre", "Kg"];

  const cachedPart = stockCache[part];
  const cachedLoc  = cachedPart?.[loc];

  let stock = "0";
  let unit  = sparePartsEditRow.unit?.trim() || ""; // allow user override

  if (cachedLoc) {
    stock = `${cachedLoc.stockInHand || 0} ${cachedLoc.unit || ""}`.trim();

    // 🔥 EXACT original behavior:
    if (!unit) {
      unit = cachedLoc.unit?.trim() || "";
    }
  }

  setSparePartsEditRow(prev => ({
    ...prev,
    stockInHand: stock,
    unit,
    sparePartsUnitFetched: !!unit,
  }));

  form.setFieldsValue({ unit });

  setSpareUnitOptions(
    isFullControl
      ? unit
        ? [...new Set([unit, ...defaultUnits])]
        : [...defaultUnits]
      : unit
      ? [unit]
      : [...defaultUnits]
  );
}, [sparePartsEditRow?.partNumber, sparePartsEditRow?.location, stockCache]);


  // useEffect(() => {
  //   if (!consumablesEditRow || !consumablesEditRow.partNumber?.trim()) return;

  //   const part = consumablesEditRow.partNumber.trim();
  //   const cached = stockCache[part];
  //   const defaultUnits = ["Set", "No's", "Metre", "Piece", "Litre", "Kg"];

  //   let stock = "0";
  //   let unit = consumablesEditRow.unit?.trim() || ""; // ✅ prefer row’s unit

  //   if (cached) {
  //     stock = `${cached.stockInHand || 0} ${cached.unit || ""}`.trim();
  //     if (!unit) {
  //       unit = cached.unit?.trim() || "";
  //     }
  //   }

  //   setConsumablesEditRow((prev) => ({
  //     ...prev,
  //     stockInHand: stock,
  //     unit,
  //     consumablesUnitFetched: !!unit,
  //   }));

  //   form.setFieldsValue({ unit });

  //   setConsumablesUnitOptions(
  //     isFullControl
  //       ? unit
  //         ? [...new Set([unit, ...defaultUnits])]
  //         : [...defaultUnits]
  //       : unit
  //       ? [unit]
  //       : [...defaultUnits]
  //   );
  // }, [consumablesEditRow?.partNumber, stockCache]);

  useEffect(() => {
  if (!consumablesEditRow || !consumablesEditRow.partNumber?.trim()) return;

  const part = consumablesEditRow.partNumber.trim();
  const loc  = consumablesEditRow.location?.trim();

  const defaultUnits = ["Set", "No's", "Metre", "Piece", "Litre", "Kg"];

  const cachedPart = stockCache[part];
  const cachedLoc  = cachedPart?.[loc];

  let stock = "0";
  let unit  = consumablesEditRow.unit?.trim() || "";   // allow row override

  if (cachedLoc) {
    stock = `${cachedLoc.stockInHand || 0} ${cachedLoc.unit || ""}`.trim();

    // 🔥 EXACT SAME BEHAVIOR AS YOUR COMMENTED CODE
    if (!unit) {
      unit = cachedLoc.unit?.trim() || "";
    }
  }

  setConsumablesEditRow(prev => ({
    ...prev,
    stockInHand: stock,
    unit,
    consumablesUnitFetched: !!unit,
  }));

  form.setFieldsValue({ unit });

  // 🔥 EXACT old dropdown logic restored
  setConsumablesUnitOptions(
    isFullControl
      ? unit
        ? [...new Set([unit, ...defaultUnits])]
        : [...defaultUnits]
      : unit
      ? [unit]
      : [...defaultUnits]
  );
}, [consumablesEditRow?.partNumber, consumablesEditRow?.location, stockCache]);


  // useEffect(() => {
  //   const part = consumablesInputRow.partNumber?.trim();
  //   if (!part) return;

  //   const defaultUnits = ["Set", "No's", "Metre", "Piece", "Litre", "Kg"];
  //   const cached = stockCache[part];
  //   let unit = "";
  //   let stock = "0";

  //   if (cached) {
  //     stock = `${cached.stockInHand} ${cached.unit || ""}`.trim();
  //     unit = cached.unit?.trim() || "";
  //   }

  //   setConsumablesInputRow((prev) => ({
  //     ...prev,
  //     stockInHand: stock,
  //     unit,
  //   }));

  //   if (unit) {
  //     setConsumablesUnitOptions(
  //       isFullControl ? [...new Set([unit, ...defaultUnits])] : [unit]
  //     );
  //   } else {
  //     setConsumablesUnitOptions([...defaultUnits]);
  //   }
  // }, [consumablesInputRow.partNumber, stockCache, userRole]);

  useEffect(() => {
  const part = consumablesInputRow.partNumber?.trim();
  const loc  = consumablesInputRow.location?.trim();

  if (!part) return;

  const defaultUnits = ["Set", "No's", "Metre", "Piece", "Litre", "Kg"];

  const cachedPart = stockCache[part];
  const cachedLoc  = cachedPart?.[loc];

  let stock = "0";
  let unit  = "";

  if (cachedLoc) {
    stock = `${cachedLoc.stockInHand} ${cachedLoc.unit || ""}`.trim();
    unit  = cachedLoc.unit?.trim() || "";
  }

  setConsumablesInputRow(prev => ({
    ...prev,
    stockInHand: stock,
    unit,
  }));

  // 🔥 EXACT SAME BEHAVIOR AS COMMENTED CODE
  if (unit) {
    setConsumablesUnitOptions(
      isFullControl ? [...new Set([unit, ...defaultUnits])] : [unit]
    );
  } else {
    setConsumablesUnitOptions([...defaultUnits]);
  }
}, [consumablesInputRow.partNumber, consumablesInputRow.location, stockCache, userRole]);


  //   const handleSubmit = async (values) => {
  //     if (!navigator.onLine) {
  //       notification.error({
  //         message: "No Internet Connection",
  //         description: "Please check your internet and try again.",
  //       });
  //       return;
  //     }
  //     if (
  //       loading ||
  //       (machineDataSource.length === 0 &&
  //         auxiliariesDataSource.length === 0 &&
  //         // assetsDataSource.length === 0 &&
  //         dataSource.length === 0 &&
  //         !form.getFieldValue("consumables")
  //         // !form.getFieldValue("tools")
  //         )
  //     ) {
  //       console.log("Return");
  //       notification.error({
  //         message: "Error",
  //         description:
  //           "Please fill in Date, Part Number, Description, Quantity,  Unit, Purchase Cost, Add On Cost and click Add before submitting",
  //       });
  //       return;
  //     }
  //     const {
  //       productCategory,
  //       machines,
  //       immSeries,
  //       maSeries,
  //       juSeries,
  //       jeSeries,
  //       veSeries,
  //       zeSeries,
  //       haSeries,
  //       auxiliaries,
  //       // assets,
  //       consumables,
  //       // tools,
  //     } = values;

  //     try {
  //       setLoading(true);

  //       const rowLockResponse = await fetch(GAS_URL, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //         body: new URLSearchParams({ action: "getRowLock" }),
  //       });

  //       const { rowIndex } = await rowLockResponse.json();
  //       let currentRow = parseInt(rowIndex || "3", 10);

  //       const maxLength = Math.max(
  //         machineDataSource.length,
  //         auxiliariesDataSource.length,
  //         // assetsDataSource.length,
  //         dataSource.length
  //       );

  //       for (let i = 0; i < maxLength; i++) {
  //         const machine = machineDataSource[i] || {};
  //         const auxiliary = auxiliariesDataSource[i] || {};
  //         // const asset = assetsDataSource[i] || {};
  //         const spare = dataSource[i] || {};

  //         console.log("User object in handleSubmit:", user);

  //         const formData = new URLSearchParams({
  //           action: "addProductCategories",
  //           recordType: "machine",
  //           rowIndex: currentRow.toString(),

  //           // Machine Type Info
  //           machines,
  //           immSeries: immSeries || "-",
  //           maSeries: maSeries || "-",
  //           juSeries: juSeries || "-",
  //           jeSeries: jeSeries || "-",
  //           veSeries: veSeries || "-",
  //           zeSeries: zeSeries || "-",
  //           haSeries: haSeries || "-",

  //           // Machine Details
  //           machinePartNumber: machine.partNumber || "-",
  //           machineDescription: machine.description || "-",
  //           machineQuantity: machine.quantity || "-",
  //           machineStockInHand: machine.stockInHand || "0",
  //           machineNote: machine.note || "-",
  //           machinePurchaseCost: machine.purchaseCost || "-",
  //           machineAddOnCost: machine.addOnCost || "-",
  //           machineSellingCost: machine.sellingCost || "-",
  //           machineUnit: machine.unit || "-",
  //           machineTotalPrice: machine.totalPrice || "-",
  //           machineDate: machine.date || "",
  //           // userName: user || "",
  // userName: user?.email || "",

  //           consumables: i === 0 ? consumables || "" : "",
  //           // tools: i === 0 ? tools || "" : "",

  //           auxiliaries: Array.isArray(auxiliaries)
  //             ? auxiliaries.join(" / ")
  //             : auxiliaries || "",

  //           auxPartNumber: auxiliary.partNumber || "-",
  //           auxDescription: auxiliary.description || "-",
  //           auxQuantity: auxiliary.quantity || "-",
  //           auxStockInHand: auxiliary.stockInHand || "0",
  //           auxNote: auxiliary.note || "-",
  //           auxPurchaseCost: auxiliary.purchaseCost || "-",
  //           auxAddOnCost: auxiliary.addOnCost || "-",
  //           auxSellingCost: auxiliary.sellingCost || "-",
  //           auxUnit: auxiliary.unit || "-",
  //           auxTotalPrice: auxiliary.totalPrice || "-",
  //           auxDate: auxiliary.date || "-",

  //           // assets: i === 0 ? assets || "-" : "",
  //           // assets: assets || "-",
  //           // assetPartNumber: asset.partNumber || "-",
  //           // assetDescription: asset.description || "-",
  //           // assetQuantity: asset.quantity || "-",
  //           // assetStockInHand: asset.stockInHand || "0",
  //           // assetNote: asset.note || "-",
  //           // assetPurchaseCost: asset.purchaseCost || "-",
  //           // assetAddOnCost: asset.addOnCost || "-",
  //           // assetSellingCost: asset.sellingCost || "-",
  //           // assetUnit: asset.unit || "-",
  //           // assetTotalPrice: asset.totalPrice || "-",
  //           // assetDate: asset.date || "",

  //           sparePartNumber: spare.partNumber || "-",
  //           spareDescription: spare.description || "-",
  //           spareQuantity: spare.quantity || "-",
  //           spareStockInHand: spare.stockInHand || "0",
  //           spareNote: spare.note || "-",
  //           sparePurchaseCost: spare.purchaseCost || "-",
  //           spareAddOnCost: spare.addOnCost || "-",
  //           spareSellingCost: spare.sellingCost || "-",
  //           spareUnit: spare.unit || "-",
  //           spareTotalPrice: spare.totalPrice || "-",
  //           spareDate: spare.date || "",
  //         });

  //         console.log(
  //           `Submitting row ${currentRow}:`,
  //           Object.fromEntries(formData.entries())
  //         );

  //         await fetch(GAS_URL, {
  //           method: "POST",
  //           headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //           body: formData.toString(),
  //         });

  //         currentRow++;
  //       }

  //       if (maxLength === 0 && (consumables)) {
  //         const formData = new URLSearchParams({
  //           action: "addProductCategories",
  //           recordType: "general",
  //           rowIndex: currentRow.toString(),
  //           machines: machines || "-",
  //           immSeries: immSeries || "-",
  //           maSeries: maSeries || "-",
  //           juSeries: juSeries || "-",
  //           jeSeries: jeSeries || "-",
  //           veSeries: veSeries || "-",
  //           zeSeries: zeSeries || "-",
  //           haSeries: haSeries || "-",
  //           auxiliaries: Array.isArray(auxiliaries)
  //             ? auxiliaries.join(" / ")
  //             : auxiliaries || "",
  //           // assets: assets || "-",
  //           consumables: consumables || "-",
  //           // tools: tools || "-",
  // userName: user?.email || "",
  //         });

  //         console.log(
  //           `Submitting (consumables only) row ${currentRow}:`,
  //           Object.fromEntries(formData.entries())
  //         );

  //         await fetch(GAS_URL, {
  //           method: "POST",
  //           headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //           body: formData.toString(),
  //         });

  //         currentRow++;
  //       }

  //       await fetch(GAS_URL, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //         body: new URLSearchParams({ action: "finalizeRowLock" }),
  //       });
  //       await fetchAllStock();

  //       notification.success({
  //         message: "Succes",
  //         description: "Data Submitted Successfully",
  //       });
  //       form.resetFields();
  //       setSelectedCategory(null);
  //       setMachineDataSource([]);
  //       setAuxiliariesDataSource([]);
  //       // setAssetsDataSource([]);
  //       setDataSource([]);
  //     } catch (err) {
  //       // console.error("Submission failed:", err);
  //       // message.error("Something went wrong. Check console.");
  //       notification.error({
  //         message: "Error",
  //         description: "Submission failed:",
  //         err,
  //       });
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  const userLocalDateTime = dayjs().format("DD-MM-YYYY HH:mm:ss");
  // console.log(userLocalDateTime);
  const handleSubmit = async (values) => {
    if (!navigator.onLine) {
      notification.error({
        message: "No Internet Connection",
        description: "Please check your internet and try again.",
      });
      return;
    }

    if (
      loading ||
      (machineDataSource.length === 0 &&
        auxiliariesDataSource.length === 0 &&
        // dataSource.length === 0 &&
        sparePartsDataSource.length === 0 &&
        consumablesDataSource.length === 0)
    ) {
      notification.error({
        message: "Error",
        description:
          "Please fill in Date, Part Number, Description, Quantity, Unit, Purchase Cost, Add On Cost and click Add before submitting",
      });
      return;
    }

    // const {
    //   productCategory,
    //   machines,
    //   immSeries,
    //   maSeries,
    //   juSeries,
    //   jeSeries,
    //   veSeries,
    //   zeSeries,
    //   haSeries,
    //   auxiliaries,
    // } = values;

    const currentValues = form.getFieldsValue(true);

    const {
      productCategory,
      machines,
      immSeries,
      maSeries,
      juSeries,
      jeSeries,
      veSeries,
      zeSeries,
      haSeries,
    } = currentValues;

    const auxiliaries = currentValues.auxiliaries;

    try {
      setLoading(true);

      const rowLockResponse = await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ action: "getRowLock" }),
      });

      const { rowIndex } = await rowLockResponse.json();
      let currentRow = parseInt(rowIndex || "3", 10);

      const maxLength = Math.max(
        machineDataSource.length,
        auxiliariesDataSource.length,
        // dataSource.length,
        sparePartsDataSource.length,

        consumablesDataSource.length
      );

      for (let i = 0; i < maxLength; i++) {
        const machine = machineDataSource[i] || {};
        const auxiliary = auxiliariesDataSource[i] || {};
        // const spare = dataSource[i] || {};
        const spare = sparePartsDataSource[i] || {};

        const consumable = consumablesDataSource[i] || {};

        const formData = new URLSearchParams({
          action: "addProductCategories",
          recordType: "machine",
          rowIndex: currentRow.toString(),

          // Machine Type Info
          machines,
          immSeries: immSeries || "-",
          maSeries: maSeries || "-",
          juSeries: juSeries || "-",
          jeSeries: jeSeries || "-",
          veSeries: veSeries || "-",
          zeSeries: zeSeries || "-",
          haSeries: haSeries || "-",

          // Machine Details
          // machinePartNumber: formatPartNumber(machine.partNumber) || "-",
          machinePartNumber: machine.partNumber || "-",
          machineDescription: machine.description || "-",
          machineQuantity: machine.quantity || "-",
          machineStockInHand: machine.stockInHand || "0",
          machineNote: machine.note || "-",
          machinePurchaseCost: machine.purchaseCost || "-",
          machineAddOnCost: machine.addOnCost || "-",
          machineSellingCost: machine.sellingCost || "-",
          machineUnit: machine.unit || "-",
          machineTotalPrice: machine.totalPrice || "-",
          machineDate: machine.date || "",
          machineLocation: machine.location || "-",  
          modifiedDateTime: userLocalDateTime,
          userName: user?.email || "",

          auxiliaries: Array.isArray(auxiliaries)
            ? auxiliaries.join(" / ")
            : auxiliaries || "",

          auxPartNumber: auxiliary.partNumber || "-",
          // auxPartNumber: formatPartNumber(auxiliary.partNumber) || "-",
          auxDescription: auxiliary.description || "-",
          auxQuantity: auxiliary.quantity || "-",
          auxStockInHand: auxiliary.stockInHand || "0",
          auxNote: auxiliary.note || "-",
          auxPurchaseCost: auxiliary.purchaseCost || "-",
          auxAddOnCost: auxiliary.addOnCost || "-",
          auxSellingCost: auxiliary.sellingCost || "-",
          auxUnit: auxiliary.unit || "-",
          auxTotalPrice: auxiliary.totalPrice || "-",
          auxDate: auxiliary.date || "-",
            auxLocation: auxiliary.location || "-", 

          sparePartNumber: spare.partNumber || "-",
          // sparePartNumber: formatPartNumber(spare.partNumber) || "-",
          spareDescription: spare.description || "-",
          spareQuantity: spare.quantity || "-",
          spareStockInHand: spare.stockInHand || "0",
          spareNote: spare.note || "-",
          sparePurchaseCost: spare.purchaseCost || "-",
          spareAddOnCost: spare.addOnCost || "-",
          spareSellingCost: spare.sellingCost || "-",
          spareUnit: spare.unit || "-",
          spareTotalPrice: spare.totalPrice || "-",
          spareDate: spare.date || "",
          spareLocation: spare.location || "-", 

          // ✅ Consumables
          consumablePartNumber: consumable.partNumber || "-",
          // consumablePartNumber: formatPartNumber(consumable.partNumber) || "-",
          consumableDescription: consumable.description || "-",
          consumableQuantity: consumable.quantity || "-",
          consumableStockInHand: consumable.stockInHand || "0",
          consumableNote: consumable.note || "-",
          consumablePurchaseCost: consumable.purchaseCost || "-",
          consumableAddOnCost: consumable.addOnCost || "-",
          consumableSellingCost: consumable.sellingCost || "-",
          consumableUnit: consumable.unit || "-",
          consumableTotalPrice: consumable.totalPrice || "-",
          consumableDate: consumable.date || "-",
          consumableLocation: consumable.location || "-", 
        });

        // console.log(
        //   `Submitting row ${currentRow}:`,
        //   Object.fromEntries(formData.entries())
        // );

        await fetch(GAS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData.toString(),
        });

        currentRow++;
      }

      await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ action: "finalizeRowLock" }),
      });

      await fetchAllStock();

      notification.success({
        message: "Success",
        description: "Data Submitted Successfully",
      });

      form.resetFields();
      setSelectedCategory(null);
      setMachineDataSource([]);
      setAuxiliariesDataSource([]);
      // setDataSource([]);
      setSparePartsDataSource([]);
      setConsumablesDataSource([]); // ✅ clear consumables after submit
    } catch (err) {
      notification.error({
        message: "Error",
        description: "Submission failed:",
        err,
      });
    } finally {
      setLoading(false);
    }
  };
  const maxTableRows = 5;
  const handleSparePartsAdd = async () => {
    // if (dataSource.length >= maxTableRows) {
    if (sparePartsDataSource.length >= maxTableRows) {
      notification.error({
        message: "Limit Reached",
        description: `You can only add up to ${maxTableRows} rows.`,
      });
      return;
    }
    const {
      partNumber,
      description,
      quantity,
      unit,
      purchaseCost,
      addOnCost,
      sellingCost,
      totalPrice,
      location
    } = inputRow;

    if (
      !partNumber ||
      !description ||
      !quantity ||
      !unit ||
      !purchaseCost ||
      !addOnCost ||
      !sellingCost ||
      !totalPrice ||
      !location ||
      !inputRow.date
    ) {
      notification.error({
        message: "Error",
        description:
          "Please fill in Date, Part Number, Location, Description, Quantity, Unit, Purchase Cost, Add On Cost and ensure Selling Cost & Total Price is calculated",
      });
      return;
    }
    const regex = /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/;
    if (!regex.test(inputRow.date)) {
      notification.error({
        message: "Invalid Date",
        description: "Enter date in DD-MM-YYYY format",
      });
      return;
    }
    const newData = {
      key: Date.now(),
      ...inputRow,
      stockInHand: inputRow.stockInHand || "0",
      stockUnit: inputRow.stockUnit || "",
    };

    // setDataSource([...dataSource, newData]);
    // setDataSource((prev) => [...prev, newData]);
    setSparePartsDataSource((prev) => [...prev, newData]);

    setInputRow({
      partNumber: "",
      description: "",
      quantity: "",
      unit: "",
      stockInHand: "",
      stockUnit: "",
      purchaseCost: "",
      addOnCost: "",
      sellingCost: "",
      totalPrice: "",
      note: "",
      location: "",
    });
    await fetchAllStock();
  };

  const handleSparePartsDelete = (key) => {
    // setDataSource(dataSource.filter((item) => item.key !== key));
    setSparePartsDataSource(
      sparePartsDataSource.filter((item) => item.key !== key)
    );
  };

  const isSparePartsEditing = (record) => record.key === sparePartsEditingKey;

  const handleSparePartsEdit = (key) => {
    // const row = dataSource.find((item) => item.key === key);
    const row = sparePartsDataSource.find((item) => item.key === key);

    setSparePartsEditingKey(key);
    setSparePartsEditRow({ ...row });
  };

  const handleSparePartsSave = () => {
    if (!sparePartsEditRow) return;

    const {
      partNumber,
      description,
      quantity,
      unit,
      purchaseCost,
      addOnCost,
      sellingCost,
      totalPrice,
      date,
      location,
    } = sparePartsEditRow;

    if (
      !partNumber ||
      !description ||
      !quantity ||
      !unit ||
      !purchaseCost ||
      !addOnCost ||
      !sellingCost ||
      !totalPrice ||
      !date ||
      !location
    ) {
      notification.error({
        message: "Error",
        description:
          "Please fill in Date, Part Number, Location, Description, Quantity, Unit, Purchase Cost, Add On Cost and ensure Selling Cost & Total Price is calculated",
      });
      return;
    }

    const regex = /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/;
    if (!regex.test(date)) {
      notification.error({
        message: "Invalid Date",
        description: "Enter date in DD-MM-YYYY format",
      });
      return;
    }

    // setDataSource((prev) =>
    setSparePartsDataSource((prev) =>
      prev.map((item) =>
        item.key === sparePartsEditingKey
          ? { ...sparePartsEditRow, key: sparePartsEditingKey }
          : item
      )
    );
    setSparePartsEditingKey("");
    setSparePartsEditRow(null);
  };

  const handleSparePartsCancel = () => {
    setSparePartsEditingKey("");
    setSparePartsEditRow(null);
  };

  // const sparePartsColumns = [
  //   {
  //     title: "Date",
  //     dataIndex: "date",
  //     width: 220,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           {/* <DatePicker
  //             format="DD-MM-YYYY"
  //             style={{ width: "100%" }}
  //             value={
  //               inputRow.date && dayjs(inputRow.date, "DD-MM-YYYY").isValid()
  //                 ? dayjs.tz(inputRow.date, "DD-MM-YYYY", "Asia/Dubai")
  //                 : null
  //             }
  //             onChange={(dateObj) => {
  //               if (!dateObj) {
  //                 setInputRow({ ...inputRow, date: "" });
  //                 return;
  //               }
  //               const formatted = dayjs(dateObj)
  //                 .tz("Asia/Dubai")
  //                 .format("DD-MM-YYYY");
  //               setInputRow({ ...inputRow, date: formatted });
  //             }}
  //           /> */}
  //           <Input
  //             placeholder="DD-MM-YYYY"
  //             maxLength={10}
  //             value={inputRow.date}
  //             onChange={(e) => {
  //               const value = e.target.value;
  //               setInputRow({ ...inputRow, date: value });

  //               // validate only when full length is reached
  //               if (value.length === 10) {
  //                 const regex = /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/;
  //                 if (!regex.test(value)) {
  //                   notification.error({
  //                     message: "Invalid Date",
  //                     description: "Enter date in DD-MM-YYYY format",
  //                   });
  //                   setInputRow({ ...inputRow, date: "" });
  //                 }
  //               }
  //             }}
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={record.date}>
  //           <span>{record.date || "-"}</span>
  //         </Tooltip>
  //       ),
  //   },
  //   {
  //     title: "Part Number",
  //     dataIndex: "partNumber",
  //     width: 250,
  //     ellipsis: true,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input
  //             placeholder="Enter part number"
  //             value={inputRow.partNumber}
  //             onChange={(e) =>
  //               setInputRow({
  //                 ...inputRow,
  //                 partNumber: e.target.value.toUpperCase(),
  //                 quantity: "",
  //               })
  //             }
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={record.partNumber}>
  //           <span>{record.partNumber}</span>
  //         </Tooltip>
  //       ),
  //   },
  //   {
  //     title: "Description",
  //     dataIndex: "description",
  //     ellipsis: true,
  //     width: 500,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input.TextArea
  //             // autoSize={{ minRows: 1, maxRows: 1 }}
  //             rows={1}
  //             placeholder="Enter description"
  //             value={inputRow.description}
  //             onChange={(e) =>
  //               setInputRow({ ...inputRow, description: e.target.value })
  //             }
  //           />
  //         </Tooltip>
  //       ) : (
  //         // <Tooltip title={record.description}>
  //         //   <span>{record.description}</span>
  //         // </Tooltip>
  //         <Tooltip
  //           title={record.description}
  //           styles={{
  //             root: {
  //               maxWidth: 1000,
  //               wordWrap: "break-word",
  //               whiteSpace: "normal",
  //             },
  //           }}
  //         >
  //           <span className="truncate-text">
  //             {record.description?.length > 150
  //               ? `${record.description.slice(0, 150)}...`
  //               : record.description}
  //           </span>
  //         </Tooltip>
  //       ),
  //   },
  //   // {
  //   //   title: "Purchase Cost In AED (per item)",
  //   //   dataIndex: "purchaseCost",
  //   //   ellipsis: true,
  //   //   width: 250,
  //   //   render: (_, record) =>
  //   //     record.isInput ? (
  //   //       <Tooltip>
  //   //         <Input
  //   //           placeholder="Enter purchase cost"
  //   //           type="number"
  //   //           min={0}
  //   //           value={inputRow.purchaseCost}
  //   //           onChange={(e) => {
  //   //             const purchaseCost = e.target.value;
  //   //             const { sellingPrice, totalPrice } = updateTotalPrice(
  //   //               purchaseCost,
  //   //               inputRow.addOnCost,
  //   //               inputRow.quantity
  //   //             );
  //   //             setInputRow((prev) => ({
  //   //               ...prev,
  //   //               purchaseCost,
  //   //               sellingCost: sellingPrice,
  //   //               totalPrice,
  //   //             }));
  //   //           }}
  //   //         />
  //   //       </Tooltip>
  //   //     ) : (
  //   //       <Tooltip title={record.purchaseCost}>
  //   //         <span>{record.purchaseCost || "-"}</span>
  //   //       </Tooltip>
  //   //     ),
  //   // },

  //   {
  //     title: "Purchase Cost In AED (per item)",
  //     dataIndex: "purchaseCost",
  //     ellipsis: true,
  //     width: 250,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input
  //             placeholder="Enter purchase cost"
  //             type="number"
  //             min={0}
  //             value={inputRow.purchaseCost}
  //             onChange={(e) => {
  //               const value = e.target.value.trim();
  //               setInputRow((prev) => ({ ...prev, purchaseCost: value }));
  //               setSparePartsFetching(true);
  //               clearTimeout(window.purchaseCostDebounce);
  //               window.purchaseCostDebounce = setTimeout(() => {
  //                 const num = parseFloat(value);
  //                 if (
  //                   value !== "" &&
  //                   (value === "0" ||
  //                     value === "0.0" ||
  //                     value === ".0" ||
  //                     isNaN(num) ||
  //                     num <= 0)
  //                 ) {
  //                   notification.error({
  //                     message: "Invalid Purchase Cost",
  //                     description: "Purchase cost must be greater than 0.",
  //                   });
  //                   setInputRow((prev) => ({ ...prev, purchaseCost: "" }));
  //                 } else {
  //                   const { totalPrice } = updateTotalPrice(
  //                     value,
  //                     inputRow.addOnCost,
  //                     inputRow.quantity
  //                   );
  //                   setInputRow((prev) => ({ ...prev, totalPrice }));
  //                 }
  //                 setSparePartsFetching(false);
  //               }, 3000);
  //             }}
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={record.purchaseCost}>
  //           <span>{record.purchaseCost || "-"}</span>
  //         </Tooltip>
  //       ),
  //   },

  //   // {
  //   //   title: "Add On Cost In AED",
  //   //   dataIndex: "addOnCost",
  //   //   ellipsis: true,
  //   //   width: 250,
  //   //   render: (_, record) =>
  //   //     record.isInput ? (
  //   //       <Tooltip>
  //   //         <Input
  //   //           type="number"
  //   //           min={0}
  //   //           placeholder="Enter add on cost"
  //   //           value={inputRow.addOnCost}
  //   //           onChange={(e) => {
  //   //             const addOnCost = e.target.value;
  //   //             const { sellingPrice, totalPrice } = updateTotalPrice(
  //   //               inputRow.purchaseCost,
  //   //               addOnCost,
  //   //               inputRow.quantity
  //   //             );
  //   //             setInputRow((prev) => ({
  //   //               ...prev,
  //   //               addOnCost,
  //   //               sellingCost: sellingPrice,
  //   //               totalPrice,
  //   //             }));
  //   //           }}
  //   //         />
  //   //       </Tooltip>
  //   //     ) : (
  //   //       <Tooltip title={record.addOnCost}>
  //   //         <span>{record.addOnCost}</span>
  //   //       </Tooltip>
  //   //     ),
  //   // },

  //   {
  //     title: "Add On Cost In AED",
  //     dataIndex: "addOnCost",
  //     ellipsis: true,
  //     width: 250,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input
  //             type="number"
  //             min={0}
  //             placeholder="Enter add on cost"
  //             value={inputRow.addOnCost}
  //             onChange={(e) => {
  //               const value = e.target.value.trim();
  //               setInputRow((prev) => ({ ...prev, addOnCost: value }));
  //               setSparePartsFetching(true);

  //               clearTimeout(window.addOnCostDebounce);
  //               window.addOnCostDebounce = setTimeout(() => {
  //                 const num = parseFloat(value);
  //                 if (
  //                   value !== "" &&
  //                   // (value === "0" ||
  //                   //   value === "0.0" ||
  //                   //   value === ".0" ||
  //                   //   isNaN(num) ||
  //                   //   num <= 0)
  //                   isNaN(num)
  //                 ) {
  //                   notification.error({
  //                     message: "Invalid Add On Cost",
  //                     description: "Add on cost must be greater than 0.",
  //                   });
  //                   setInputRow((prev) => ({ ...prev, addOnCost: "" }));
  //                 } else {
  //                   const { totalPrice } = updateTotalPrice(
  //                     inputRow.purchaseCost,
  //                     value,
  //                     inputRow.quantity
  //                   );
  //                   setInputRow((prev) => ({ ...prev, totalPrice }));
  //                 }
  //                 setSparePartsFetching(false);
  //               }, 3000);
  //             }}
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={record.addOnCost}>
  //           <span>{record.addOnCost}</span>
  //         </Tooltip>
  //       ),
  //   },

  //   {
  //     title: "Selling Cost (AED)",
  //     dataIndex: "sellingCost",
  //     ellipsis: true,
  //     width: 250,
  //     render: (_, record, index) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input
  //             type="number"
  //             min={0}
  //             placeholder="Enter Selling Cost"
  //             value={inputRow.sellingCost || ""}
  //             onChange={(e) => {
  //               const value = e.target.value.trim();
  //               setInputRow((prev) => ({ ...prev, sellingCost: value }));

  //               clearTimeout(window.sellingCostDebounce);
  //               window.sellingCostDebounce = setTimeout(() => {
  //                 const num = parseFloat(value);
  //                 if (
  //                   value !== "" &&
  //                   // (value === "0" ||
  //                   //   value === "0.0" ||
  //                   //   value === ".0" ||
  //                   //   isNaN(num) ||
  //                   //   num <= 0)
  //                   isNaN(num)
  //                 ) {
  //                   notification.error({
  //                     message: "Invalid Selling Cost",
  //                     description: "Selling cost must be greater than 0.",
  //                   });
  //                   setInputRow((prev) => ({ ...prev, sellingCost: "" }));
  //                 }
  //               }, 3000);
  //             }}
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={record.sellingCost}>
  //           <span>{record.sellingCost}</span>
  //         </Tooltip>
  //       ),
  //   },

  //   // {
  //   //   title: "Quantity",
  //   //   dataIndex: "quantity",
  //   //   ellipsis: true,
  //   //   width: 200,
  //   //   render: (_, record) =>
  //   //     record.isInput ? (
  //   //       <Tooltip>
  //   //         <Input
  //   //           placeholder="Enter quantity"
  //   //           type="number"
  //   //           min={1}
  //   //           value={inputRow.quantity}
  //   //           onChange={(e) => {
  //   //             const quantity = e.target.value;
  //   //             const { sellingPrice, totalPrice } = updateTotalPrice(
  //   //               inputRow.purchaseCost,
  //   //               inputRow.addOnCost,
  //   //               quantity
  //   //             );
  //   //             setInputRow((prev) => ({
  //   //               ...prev,
  //   //               quantity,
  //   //               sellingCost: sellingPrice, // still needed in case it's blank initially
  //   //               totalPrice,
  //   //             }));
  //   //           }}
  //   //         />
  //   //       </Tooltip>
  //   //     ) : (
  //   //       <Tooltip title={record.quantity}>
  //   //         <span>{record.quantity}</span>
  //   //       </Tooltip>
  //   //     ),
  //   // },

  //   {
  //     title: "Quantity",
  //     dataIndex: "quantity",
  //     ellipsis: true,
  //     width: 200,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input
  //             placeholder="Enter Quantity"
  //             type="number"
  //             // min={1}
  //             disabled={spareUnitLoading}
  //             value={inputRow.quantity}
  //             onChange={(e) => {
  //               const value = e.target.value.trim();
  //               setInputRow((prev) => ({ ...prev, quantity: value }));
  //               setSparePartsFetching(true);

  //               clearTimeout(window.quantityDebounce);
  //               window.quantityDebounce = setTimeout(() => {
  //                 const num = parseFloat(value);
  //                 // if (
  //                 //   value !== "" &&
  //                 //   (value === "0" ||
  //                 //     value === "0.0" ||
  //                 //     value === ".0" ||
  //                 //     isNaN(num) ||
  //                 //     num === 0)
  //                 // ) {
  //                 //   notification.error({
  //                 //     message: "Invalid Quantity",
  //                 //     description: "Quantity must be greater than 0.",
  //                 //   });
  //                 //   setInputRow((prev) => ({ ...prev, quantity: "" }));
  //                 // } else {
  //                 //   const { totalPrice } = updateTotalPrice(
  //                 //     inputRow.purchaseCost,
  //                 //     inputRow.addOnCost,
  //                 //     value
  //                 //   );
  //                 //   setInputRow((prev) => ({ ...prev, totalPrice }));
  //                 // }

  //                 // Basic invalid checks
  //                 if (
  //                   value !== "" &&
  //                   (value === "0" ||
  //                     value === "0.0" ||
  //                     value === ".0" ||
  //                     isNaN(num) ||
  //                     num <= 0)
  //                 ) {
  //                   notification.error({
  //                     message: "Invalid Quantity",
  //                     description: "Quantity must be greater than 0.",
  //                   });
  //                   setInputRow((prev) => ({ ...prev, quantity: "" }));
  //                   setSparePartsFetching(false);

  //                   return;
  //                 }

  //                 // Extra check for Set / Piece units - must be whole number
  //                 const unit = (inputRow.unit || "").toLowerCase();
  //                 if (
  //                   (unit === "set" || unit === "piece") &&
  //                   !Number.isInteger(num)
  //                 ) {
  //                   notification.error({
  //                     message: "Invalid Quantity",
  //                     description: `Quantity for unit "${inputRow.unit}" must be a whole number.`,
  //                   });
  //                   setInputRow((prev) => ({
  //                     ...prev,
  //                     quantity: "",
  //                     unit: "",
  //                   }));
  //                   setSparePartsFetching(false);

  //                   return;
  //                 }

  //                 // Update total price if all checks pass
  //                 const { totalPrice } = updateTotalPrice(
  //                   inputRow.purchaseCost,
  //                   inputRow.addOnCost,
  //                   value
  //                 );
  //                 setInputRow((prev) => ({ ...prev, totalPrice }));
  //                 setSparePartsFetching(false);
  //               }, 3000);
  //             }}
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={record.quantity}>
  //           <span>{record.quantity}</span>
  //         </Tooltip>
  //       ),
  //   },

  //   // {
  //   //   title: "Unit",
  //   //   dataIndex: "unit",
  //   //   width: 250,
  //   //   ellipsis: true,
  //   //   render: (_, record) =>
  //   //     record.isInput ? (
  //   //       <Select
  //   //         className="w-100"
  //   //         value={inputRow.unit}
  //   //         onChange={(value) => {

  //   //             const unit = (inputRow.unit || "").toLowerCase();
  //   //             const num = inputRow.quantity
  //   //           if ((unit === "set" || unit === "piece") && !Number.isInteger(num)) {
  //   //             notification.error({
  //   //               message: "Invalid Quantity",
  //   //               description: `Quantity for unit "${inputRow.unit}" must be a whole number.`,
  //   //             });
  //   //             setInputRow((prev) => ({ ...prev, unit:"" }));
  //   //             return;
  //   //           }
  //   //           setInputRow((prev) => ({ ...prev, unit: value }))}
  //   //         }
  //   //         options={spareUnitOptions.map((u) => ({ value: u, label: u }))}
  //   //         loading={spareUnitLoading}
  //   //         placeholder={spareUnitLoading ? "Fetching unit..." : "Select Unit"}
  //   //         notFoundContent={
  //   //           spareUnitLoading ? "Fetching unit..." : "No units found"
  //   //         }
  //   //         // disabled={inputRow.sparePartsUnitFetched && userRole !== "Admin"}
  //   //       />
  //   //     ) : (
  //   //       record.unit || ""
  //   //     ),
  //   // },
  //   {
  //     title: "Unit",
  //     dataIndex: "unit",
  //     width: 250,
  //     ellipsis: true,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Select
  //           className="w-100"
  //           value={inputRow.unit}
  //           onChange={(selectedUnit) => {
  //             clearTimeout(window.unitDebounce);
  //             window.unitDebounce = setTimeout(() => {
  //               const unitLower = (selectedUnit || "").toLowerCase();
  //               const num = parseFloat(inputRow.quantity);

  //               // Check if quantity must be whole number
  //               if (
  //                 (unitLower === "set" || unitLower === "piece") &&
  //                 !Number.isInteger(num)
  //               ) {
  //                 notification.error({
  //                   message: "Invalid Quantity",
  //                   description: `Quantity for unit "${selectedUnit}" must be a whole number and should not be empty.`,
  //                 });
  //                 setInputRow((prev) => ({ ...prev, unit: "", quantity: "" }));
  //                 return;
  //               }

  //               // If valid, update the unit
  //               setInputRow((prev) => ({ ...prev, unit: selectedUnit }));
  //             }, 300);
  //           }}
  //           options={spareUnitOptions.map((u) => ({ value: u, label: u }))}
  //           loading={spareUnitLoading}
  //           placeholder={spareUnitLoading ? "Fetching unit..." : "Select Unit"}
  //           notFoundContent={
  //             spareUnitLoading ? "Fetching unit..." : "No units found"
  //           }
  //         />
  //       ) : (
  //         record.unit || ""
  //       ),
  //   },

  //   {
  //     title: "Stock In Hand",
  //     dataIndex: "stockInHand",
  //     width: 200,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input
  //             readOnly
  //             value={
  //               inputRow.stockInHand
  //                 ? `${inputRow.stockInHand} ${inputRow.stockUnit || ""}`
  //                 : ""
  //             }
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={`${record.stockInHand} ${record.stockUnit || ""}`}>
  //           <span>
  //             {record.stockInHand
  //               ? `${record.stockInHand} ${record.stockUnit || ""}`
  //               : "-"}
  //           </span>
  //         </Tooltip>
  //       ),
  //   },

  //   {
  //     title: "Total Price In AED",
  //     dataIndex: "totalPrice",
  //     width: 200,
  //     ellipsis: true,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input value={inputRow.totalPrice || ""} readOnly />{" "}
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={record.totalPrice}>
  //           <span>{record.totalPrice || "-"}</span>
  //         </Tooltip>
  //       ),
  //   },
  //   {
  //     title: "Note",
  //     dataIndex: "note",
  //     ellipsis: true,
  //     width: 300,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input.TextArea
  //             // autoSize={{ minRows: 1, maxRows: 1 }}
  //             rows={1}
  //             placeholder="Enter note"
  //             value={inputRow.note}
  //             onChange={(e) =>
  //               setInputRow({ ...inputRow, note: e.target.value })
  //             }
  //           />
  //         </Tooltip>
  //       ) : (
  //         // <Tooltip title={record.note}>
  //         //   <span>{record.note}</span>
  //         // </Tooltip>
  //         <Tooltip
  //           title={record.note}
  //           styles={{
  //             root: {
  //               maxWidth: 1000,
  //               wordWrap: "break-word",
  //               whiteSpace: "normal",
  //             },
  //           }}
  //         >
  //           {/* <span> {record.note}</span> */}
  //           <span className="truncate-text">
  //             {record.note?.length > 150
  //               ? `${record.note.slice(0, 150)}...`
  //               : record.note}
  //           </span>
  //         </Tooltip>
  //       ),
  //   },

  //   {
  //     title: "Action",
  //     width: 120,
  //     fixed: "right",
  //     align: "center",
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Button
  //           className="addButton ps-4 pe-4"
  //           onClick={handleSparePartsAdd}
  //           disabled={sparePartsFetching}
  //           loading={sparePartsFetching}
  //         >
  //           {sparePartsFetching ? "Loading" : "Add"}
  //         </Button>
  //       ) : (
  //         <Button
  //           className="deleteButton ps-3 pe-3"
  //           onClick={() => handleSparePartsDelete(record.key)}
  //         >
  //           Delete
  //         </Button>
  //       ),
  //   },
  // ];

  const sparePartsColumns = [
    {
      title: "Date",
      dataIndex: "date",
      width: 220,
      render: (_, record) => {
        if (record.isInput) {
          return (
            <Input
              placeholder="DD-MM-YYYY"
              maxLength={10}
              value={inputRow.date}
              onChange={(e) => {
                const value = e.target.value;
                setInputRow({ ...inputRow, date: value });

                if (value.length === 10) {
                  const regex = /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/;
                  if (!regex.test(value)) {
                    notification.error({
                      message: "Invalid Date",
                      description: "Enter date in DD-MM-YYYY format",
                    });
                    setInputRow({ ...inputRow, date: "" });
                  }
                }
              }}
            />
          );
        }
        if (isSparePartsEditing(record)) {
          return (
            <Input
              placeholder="DD-MM-YYYY"
              maxLength={10}
              value={sparePartsEditRow.date}
              onChange={(e) => {
                const value = e.target.value;
                setSparePartsEditRow((prev) => ({ ...prev, date: value }));

                if (value.length === 10) {
                  const regex = /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/;
                  if (!regex.test(value)) {
                    notification.error({
                      message: "Invalid Date",
                      description: "Enter date in DD-MM-YYYY format",
                    });
                    setSparePartsEditRow((prev) => ({ ...prev, date: "" }));
                  }
                }
              }}
            />
          );
        }
        return <span>{record.date || "-"}</span>;
      },
    },
        {
      title: "Location",
      dataIndex: "location",
      width: 150,
      render: (_, record) => {
        // ===== INPUT ROW (new entry) =====
        if (record.isInput) {
          return (
            <Select
              placeholder="Select Location"
              value={inputRow.location}
              onChange={(value) =>
                setInputRow((prev) => ({ ...prev, location: value }))
              }
              style={{ width: "100%" }}
              options={[
                { value: "AE", label: "AE" },
                { value: "MEA", label: "MEA" },
              ]}
            />
          );
        }

        // ===== EDITING ROW =====
        if (isSparePartsEditing(record)) {
          return (
            <Select
              placeholder="Select Location"
              value={sparePartsEditRow.location}
              onChange={(value) =>
                setSparePartsEditRow((prev) => ({ ...prev, location: value }))
              }
              style={{ width: "100%" }}
              options={[
                { value: "AE", label: "AE" },
                { value: "MEA", label: "MEA" },
              ]}
            />
          );
        }

        // ===== NORMAL DISPLAY =====
        return <span>{record.location || "-"}</span>;
      },
    },
    {
      title: "Part Number",
      dataIndex: "partNumber",
      width: 250,
      ellipsis: true,
      render: (_, record) => {
        if (record.isInput) {
          return (
            <Input
              placeholder="Enter part number"
              value={inputRow.partNumber}
              onChange={(e) =>
                setInputRow({
                  ...inputRow,
                  partNumber: e.target.value.toUpperCase(),
                  quantity: "",
                })
              }
            />
          );
        }
        if (isSparePartsEditing(record)) {
          return (
            <Input
              placeholder="Enter part number"
              value={sparePartsEditRow.partNumber}
              onChange={(e) =>
                setSparePartsEditRow((prev) => ({
                  ...prev,
                  partNumber: e.target.value.toUpperCase(),
                  quantity: "",
                }))
              }
            />
          );
        }
        return <span>{record.partNumber}</span>;
      },
    },


    {
      title: "Description",
      dataIndex: "description",
      ellipsis: true,
      width: 500,
      render: (_, record) => {
        if (record.isInput) {
          return (
            <Input.TextArea
              rows={1}
              placeholder="Enter description"
              value={inputRow.description}
              onChange={(e) =>
                setInputRow({ ...inputRow, description: e.target.value })
              }
            />
          );
        }
        if (isSparePartsEditing(record)) {
          return (
            <Input.TextArea
              rows={1}
              value={sparePartsEditRow.description}
              onChange={(e) =>
                setSparePartsEditRow((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          );
        }
        return (
          <span>
            {record.description?.length > 150
              ? `${record.description.slice(0, 150)}...`
              : record.description}
          </span>
        );
      },
    },
    {
      title: "Purchase Cost In AED (per item)",
      dataIndex: "purchaseCost",
      ellipsis: true,
      width: 250,
      render: (_, record) => {
        const renderInput = (row, setRow, debounceKey) => (
          <Input
            placeholder="Enter purchase cost"
            type="number"
            min={0}
            value={row.purchaseCost}
            onChange={(e) => {
              const value = e.target.value.trim();
              setRow((prev) => ({ ...prev, purchaseCost: value }));
              if (record.isInput) {
                setSparePartsAddLoading(true);
              } else if (isSparePartsEditing(record)) {
                setSparePartsSaveLoading(true);
              }
              clearTimeout(window[debounceKey]);
              window[debounceKey] = setTimeout(() => {
                const num = parseFloat(value);
                if (value !== "" && (isNaN(num) || num <= 0)) {
                  notification.error({
                    message: "Invalid Purchase Cost",
                    description: "Purchase cost must be greater than 0.",
                  });
                  setRow((prev) => ({ ...prev, purchaseCost: "" }));
                } else {
                  const { totalPrice } = updateTotalPrice(
                    value,
                    row.addOnCost,
                    row.quantity
                  );
                  setRow((prev) => ({ ...prev, totalPrice }));
                }
                if (record.isInput) {
                  setSparePartsAddLoading(false);
                } else if (isSparePartsEditing(record)) {
                  setSparePartsSaveLoading(false);
                }
              }, 3000);
            }}
          />
        );
        if (record.isInput)
          return renderInput(inputRow, setInputRow, "purchaseCostDebounce");
        if (isSparePartsEditing(record))
          return renderInput(
            sparePartsEditRow,
            setSparePartsEditRow,
            "editPurchaseCostDebounce"
          );
        return <span>{record.purchaseCost || "-"}</span>;
      },
    },
    {
      title: "Add On Cost In AED",
      dataIndex: "addOnCost",
      ellipsis: true,
      width: 250,
      render: (_, record) => {
        const renderInput = (row, setRow, debounceKey) => (
          <Input
            type="number"
            min={0}
            placeholder="Enter add on cost"
            value={row.addOnCost}
            onChange={(e) => {
              const value = e.target.value.trim();
              setRow((prev) => ({ ...prev, addOnCost: value }));
              if (record.isInput) {
                setSparePartsAddLoading(true);
              } else if (isSparePartsEditing(record)) {
                setSparePartsSaveLoading(true);
              }
              clearTimeout(window[debounceKey]);
              window[debounceKey] = setTimeout(() => {
                const num = parseFloat(value);
                if (value !== "" && isNaN(num)) {
                  notification.error({
                    message: "Invalid Add On Cost",
                    description: "Add on cost must be greater than 0.",
                  });
                  setRow((prev) => ({ ...prev, addOnCost: "" }));
                } else {
                  const { totalPrice } = updateTotalPrice(
                    row.purchaseCost,
                    value,
                    row.quantity
                  );
                  setRow((prev) => ({ ...prev, totalPrice }));
                }
                if (record.isInput) {
                  setSparePartsAddLoading(false);
                } else if (isSparePartsEditing(record)) {
                  setSparePartsSaveLoading(false);
                }
              }, 3000);
            }}
          />
        );
        if (record.isInput)
          return renderInput(inputRow, setInputRow, "addOnCostDebounce");
        if (isSparePartsEditing(record))
          return renderInput(
            sparePartsEditRow,
            setSparePartsEditRow,
            "editAddOnCostDebounce"
          );
        return <span>{record.addOnCost}</span>;
      },
    },
    {
      title: "Selling Cost (AED)",
      dataIndex: "sellingCost",
      ellipsis: true,
      width: 250,
      render: (_, record) => {
        const renderInput = (row, setRow, debounceKey) => (
          <Input
            type="number"
            min={0}
            placeholder="Enter Selling Cost"
            value={row.sellingCost || ""}
            onChange={(e) => {
              const value = e.target.value.trim();
              setRow((prev) => ({ ...prev, sellingCost: value }));

              clearTimeout(window[debounceKey]);
              window[debounceKey] = setTimeout(() => {
                const num = parseFloat(value);
                if (value !== "" && isNaN(num)) {
                  notification.error({
                    message: "Invalid Selling Cost",
                    description: "Selling cost must be greater than 0.",
                  });
                  setRow((prev) => ({ ...prev, sellingCost: "" }));
                }
              }, 3000);
            }}
          />
        );
        if (record.isInput)
          return renderInput(inputRow, setInputRow, "sellingCostDebounce");
        if (isSparePartsEditing(record))
          return renderInput(
            sparePartsEditRow,
            setSparePartsEditRow,
            "editSellingCostDebounce"
          );
        return <span>{record.sellingCost}</span>;
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      ellipsis: true,
      width: 200,
      render: (_, record) => {
        const renderInput = (row, setRow, debounceKey) => (
          <Input
            placeholder="Enter Quantity"
            type="number"
            value={row.quantity}
            onChange={(e) => {
              const value = e.target.value.trim();
              setRow((prev) => ({ ...prev, quantity: value }));
              if (record.isInput) {
                setSparePartsAddLoading(true);
              } else if (isSparePartsEditing(record)) {
                setSparePartsSaveLoading(true);
              }

              clearTimeout(window[debounceKey]);
              window[debounceKey] = setTimeout(() => {
                const num = parseFloat(value);

                if (value !== "" && (value === "0" || isNaN(num) || num <= 0)) {
                  notification.error({
                    message: "Invalid Quantity",
                    description: "Quantity must be greater than 0.",
                  });
                  setRow((prev) => ({ ...prev, quantity: "" }));
                  return;
                }

                const unit = (row.unit || "").toLowerCase();
                if (
                  (unit === "set" || unit === "piece") &&
                  !Number.isInteger(num)
                ) {
                  notification.error({
                    message: "Invalid Quantity",
                    description: `Quantity for unit "${row.unit}" must be a whole number.`,
                  });
                  setRow((prev) => ({ ...prev, quantity: "", unit: "" }));
                  return;
                }

                const { totalPrice } = updateTotalPrice(
                  row.purchaseCost,
                  row.addOnCost,
                  value
                );
                setRow((prev) => ({ ...prev, totalPrice }));
                if (record.isInput) {
                  setSparePartsAddLoading(false);
                } else if (isSparePartsEditing(record)) {
                  setSparePartsSaveLoading(false);
                }
              }, 3000);
            }}
          />
        );
        if (record.isInput)
          return renderInput(inputRow, setInputRow, "quantityDebounce");
        if (isSparePartsEditing(record))
          return renderInput(
            sparePartsEditRow,
            setSparePartsEditRow,
            "editQuantityDebounce"
          );
        return <span>{record.quantity}</span>;
      },
    },
    {
      title: "Unit",
      dataIndex: "unit",
      width: 250,
      ellipsis: true,
      render: (_, record) => {
        const renderSelect = (row, setRow, debounceKey) => (
          <Select
            className="w-100"
            value={row.unit}
            onChange={(selectedUnit) => {
              clearTimeout(window[debounceKey]);
              window[debounceKey] = setTimeout(() => {
                const unitLower = (selectedUnit || "").toLowerCase();
                const num = parseFloat(row.quantity);

                if (
                  (unitLower === "set" || unitLower === "piece") &&
                  !Number.isInteger(num)
                ) {
                  notification.error({
                    message: "Invalid Quantity",
                    description: `Quantity for unit "${selectedUnit}" must be a whole number.`,
                  });
                  setRow((prev) => ({ ...prev, unit: "", quantity: "" }));
                  return;
                }

                setRow((prev) => ({ ...prev, unit: selectedUnit }));
              }, 300);
            }}
            options={spareUnitOptions.map((u) => ({ value: u, label: u }))}
            placeholder="Select Unit"
          />
        );
        if (record.isInput)
          return renderSelect(inputRow, setInputRow, "unitDebounce");
        if (isSparePartsEditing(record))
          return renderSelect(
            sparePartsEditRow,
            setSparePartsEditRow,
            "editUnitDebounce"
          );
        return record.unit || "";
      },
    },
    // {
    //   title: "Stock In Hand",
    //   dataIndex: "stockInHand",
    //   width: 200,
    //   render: (_, record) => {
    //     if (record.isInput) {
    //       return (
    //         <Input
    //           readOnly
    //           value={
    //             inputRow.stockInHand
    //               ? `${inputRow.stockInHand} ${inputRow.stockUnit || ""}`
    //               : ""
    //           }
    //         />
    //       );
    //     }
    //     return (
    //       <span>
    //         {record.stockInHand
    //           ? `${record.stockInHand} ${record.stockUnit || ""}`
    //           : "-"}
    //       </span>
    //     );
    //   },
    // },
    {
      title: "Stock In Hand",
      dataIndex: "stockInHand",
      width: 200,
      render: (_, record) => {
        if (record.isInput) {
          return <Input readOnly value={inputRow.stockInHand || ""} />;
        }

        if (isSparePartsEditing(record)) {
          return (
            <Input readOnly value={sparePartsEditRow?.stockInHand || "0"} />
          );
        }

        return <span>{record.stockInHand || "-"}</span>;
      },
    },

    {
      title: "Total Price In AED",
      dataIndex: "totalPrice",
      width: 200,
      ellipsis: true,
      render: (_, record) => {
        if (record.isInput)
          return <Input value={inputRow.totalPrice || ""} readOnly />;
        if (isSparePartsEditing(record))
          return <Input value={sparePartsEditRow.totalPrice || ""} readOnly />;
        return <span>{record.totalPrice || "-"}</span>;
      },
    },
    {
      title: "Note",
      dataIndex: "note",
      ellipsis: true,
      width: 300,
      render: (_, record) => {
        if (record.isInput) {
          return (
            <Input.TextArea
              rows={1}
              placeholder="Enter note"
              value={inputRow.note}
              onChange={(e) =>
                setInputRow({ ...inputRow, note: e.target.value })
              }
            />
          );
        }
        if (isSparePartsEditing(record)) {
          return (
            <Input.TextArea
              rows={1}
              value={sparePartsEditRow.note}
              onChange={(e) =>
                setSparePartsEditRow((prev) => ({
                  ...prev,
                  note: e.target.value,
                }))
              }
            />
          );
        }
        return (
          <span>
            {record.note?.length > 150
              ? `${record.note.slice(0, 150)}...`
              : record.note}
          </span>
        );
      },
    },
    // {
    //   title: "Action",
    //   width: 200,
    //   fixed: "right",
    //   render: (_, record) =>
    //     record.isInput ? (
    //       <Button
    //         className="addButton w-100"
    //         onClick={handleSparePartsAdd}
    //         // disabled={sparePartsFetching}
    //         // loading={sparePartsFetching}
    //         disabled={sparePartsAddLoading}
    //         loading={sparePartsAddLoading}
    //       >
    //         {/* {sparePartsFetching ? "Loading" : "Add"} */}
    //         {sparePartsAddLoading ? "Loading" : "Add"}
    //       </Button>
    //     ) : isSparePartsEditing(record) ? (
    //       <>
    //         <Button
    //           type="primary"
    //           onClick={handleSparePartsSave}
    //           // loading={sparePartsFetching}
    //           loading={sparePartsSaveLoading}
    //           className="addButton"
    //         >
    //           {/* {sparePartsFetching ? "Loading" : "Save"} */}
    //           {sparePartsSaveLoading ? "Loading" : "Save"}
    //         </Button>
    //         <Button
    //           onClick={handleSparePartsCancel}
    //           style={{ marginLeft: 8 }}
    //           className="deleteButton"
    //         >
    //           Cancel
    //         </Button>
    //       </>
    //     ) : (
    //       <>
    //         <Button
    //           onClick={() => handleSparePartsEdit(record.key)}
    //           className="addButton"
    //         >
    //           Edit
    //         </Button>
    //         <Button
    //           onClick={() => handleSparePartsDelete(record.key)}
    //           style={{ marginLeft: 8 }}
    //           className="deleteButton"
    //         >
    //           Delete
    //         </Button>
    //       </>
    //     ),
    // },
    {
      title: "Action",
      width: 200,
      fixed: "right",
      render: (_, record) => {
        if (record.isInput) {
          return (
            <Button
              className="addButton w-100"
              onClick={handleSparePartsAdd}
              loading={sparePartsAddLoading}
              style={{ minWidth: 90 }} // ensures width stays stable
            >
              {sparePartsAddLoading ? "Loading..." : "Add"}
            </Button>
          );
        }

        if (isSparePartsEditing(record)) {
          return (
            <div style={{ display: "flex", gap: 8 }}>
              <Button
                type="primary"
                onClick={handleSparePartsSave}
                loading={sparePartsSaveLoading}
                className="addButton"
                style={{ minWidth: 90 }}
              >
                {sparePartsSaveLoading ? "Loading..." : "Save"}
              </Button>
              <Button
                onClick={handleSparePartsCancel}
                className="deleteButton"
                style={{ minWidth: 90 }}
              >
                Cancel
              </Button>
            </div>
          );
        }

        return (
          <div style={{ display: "flex", gap: 8 }}>
            <Button
              onClick={() => handleSparePartsEdit(record.key)}
              className="addButton"
              style={{ minWidth: 90 }}
            >
              Edit
            </Button>
            <Button
              onClick={() => handleSparePartsDelete(record.key)}
              className="deleteButton"
              danger
              style={{ minWidth: 90 }}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  // const displayData = [{ key: "input", isInput: true }, ...dataSource];
  const displayData = [
    { key: "input", isInput: true },
    ...sparePartsDataSource,
  ];

  const handleConsumablesAdd = async () => {
    if (consumablesDataSource.length >= maxTableRows) {
      notification.error({
        message: "Limit Reached",
        description: `You can only add up to ${maxTableRows} rows.`,
      });
      return;
    }
    const {
      partNumber,
      description,
      quantity,
      unit,
      purchaseCost,
      addOnCost,
      sellingCost,
      totalPrice,
      date,
      location,
    } = consumablesInputRow;

    if (
      !partNumber ||
      !description ||
      !quantity ||
      !unit ||
      !purchaseCost ||
      !addOnCost ||
      !sellingCost ||
      !totalPrice ||
      !date ||
      !location 
    ) {
      notification.error({
        message: "Error",
        description:
          "Please fill in Date, Part Number, Location, Description, Quantity, Unit, Purchase Cost, Add On Cost and ensure Selling Cost & Total Price is calculated",
      });
      return;
    }
    const regex = /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/;
    if (!regex.test(date)) {
      notification.error({
        message: "Invalid Date",
        description: "Enter date in DD-MM-YYYY format",
      });
      return;
    }
    const newData = {
      key: Date.now(),
      ...consumablesInputRow,
      stockInHand: consumablesInputRow.stockInHand || "0",
      stockUnit: consumablesInputRow.stockUnit || "",
    };

    setConsumablesDataSource((prev) => [...prev, newData]);

    setConsumablesInputRow({
      date: "",
      partNumber: "",
      description: "",
      quantity: "",
      unit: "",
      stockInHand: "",
      stockUnit: "",
      purchaseCost: "",
      addOnCost: "",
      sellingCost: "",
      totalPrice: "",
      note: "",
      location: "",
    });

    await fetchAllStock(); // ✅ same as spare parts
  };

  const handleConsumablesDelete = (key) => {
    setConsumablesDataSource((prev) => prev.filter((item) => item.key !== key));
  };

  const isConsumablesEditing = (record) => record.key === consumablesEditingKey;

  const handleConsumablesEdit = (key) => {
    const row = consumablesDataSource.find((item) => item.key === key);
    setConsumablesEditingKey(key);
    setConsumablesEditRow({ ...row });
  };

  const handleConsumablesSave = () => {
    if (!consumablesEditRow) return;

    const {
      partNumber,
      description,
      quantity,
      unit,
      purchaseCost,
      addOnCost,
      sellingCost,
      totalPrice,
      date,
      location
    } = consumablesEditRow;

    if (
      !partNumber ||
      !description ||
      !quantity ||
      !unit ||
      !purchaseCost ||
      !addOnCost ||
      !sellingCost ||
      !totalPrice ||
      !date ||
      !location
    ) {
      notification.error({
        message: "Error",
        description:
          "Please fill in Date, Part Number, Location, Description, Quantity, Unit, Purchase Cost, Add On Cost and ensure Selling Cost & Total Price is calculated",
      });
      return;
    }

    const regex = /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/;
    if (!regex.test(date)) {
      notification.error({
        message: "Invalid Date",
        description: "Enter date in DD-MM-YYYY format",
      });
      return;
    }

    setConsumablesDataSource((prev) =>
      prev.map((item) =>
        item.key === consumablesEditingKey
          ? { ...consumablesEditRow, key: consumablesEditingKey }
          : item
      )
    );
    setConsumablesEditingKey("");
    setConsumablesEditRow(null);
  };

  const handleConsumablesCancel = () => {
    setConsumablesEditingKey("");
    setConsumablesEditRow(null);
  };

  const consumablesColumns = [
    {
      title: "Date",
      dataIndex: "date",
      width: 220,
      render: (_, record) => {
        if (record.isInput) {
          return (
            <Input
              placeholder="DD-MM-YYYY"
              maxLength={10}
              value={consumablesInputRow.date}
              onChange={(e) => {
                const value = e.target.value;
                setConsumablesInputRow({ ...consumablesInputRow, date: value });

                if (value.length === 10) {
                  const regex = /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/;
                  if (!regex.test(value)) {
                    notification.error({
                      message: "Invalid Date",
                      description: "Enter date in DD-MM-YYYY format",
                    });
                    setConsumablesInputRow({
                      ...consumablesInputRow,
                      date: "",
                    });
                  }
                }
              }}
            />
          );
        }

        if (isConsumablesEditing(record)) {
          return (
            <Input
              placeholder="DD-MM-YYYY"
              maxLength={10}
              value={consumablesEditRow.date}
              onChange={(e) => {
                const value = e.target.value;
                setConsumablesEditRow((prev) => ({ ...prev, date: value }));

                if (value.length === 10) {
                  const regex = /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/;
                  if (!regex.test(value)) {
                    notification.error({
                      message: "Invalid Date",
                      description: "Enter date in DD-MM-YYYY format",
                    });
                    setConsumablesEditRow((prev) => ({ ...prev, date: "" }));
                  }
                }
              }}
            />
          );
        }

        return <span>{record.date || "-"}</span>;
      },
    },
        {
  title: "Location",
  dataIndex: "location",
  width: 150,
  render: (_, record) => {
    // Input Row
    if (record.isInput) {
      return (
        <Select
          placeholder="Select Location"
          value={consumablesInputRow.location}
          onChange={(value) =>
            setConsumablesInputRow((prev) => ({ ...prev, location: value }))
          }
          style={{ width: "100%" }}
          options={[
            { value: "AE", label: "AE" },
            { value: "MEA", label: "MEA" },
          ]}
        />
      );
    }

    // Edit Row
    if (isConsumablesEditing(record)) {
      return (
        <Select
          placeholder="Select Location"
          value={consumablesEditRow.location}
          onChange={(value) =>
            setConsumablesEditRow((prev) => ({ ...prev, location: value }))
          }
          style={{ width: "100%" }}
          options={[
            { value: "AE", label: "AE" },
            { value: "MEA", label: "MEA" },
          ]}
        />
      );
    }

    // Display
    return <span>{record.location || "-"}</span>;
  },
},
    {
      title: "Part Number",
      dataIndex: "partNumber",
      width: 250,
      ellipsis: true,
      render: (_, record) => {
        if (record.isInput) {
          return (
            <Input
              placeholder="Enter part number"
              value={consumablesInputRow.partNumber}
              onChange={(e) =>
                setConsumablesInputRow({
                  ...consumablesInputRow,
                  partNumber: e.target.value.toUpperCase(),
                  quantity: "",
                })
              }
            />
          );
        }

        if (isConsumablesEditing(record)) {
          return (
            <Input
              placeholder="Enter part number"
              value={consumablesEditRow.partNumber}
              onChange={(e) =>
                setConsumablesEditRow((prev) => ({
                  ...prev,
                  partNumber: e.target.value.toUpperCase(),
                  quantity: "",
                }))
              }
            />
          );
        }

        return <span>{record.partNumber}</span>;
      },
    },


    {
      title: "Description",
      dataIndex: "description",
      width: 500,
      ellipsis: true,
      render: (_, record) => {
        if (record.isInput) {
          return (
            <Input.TextArea
              rows={1}
              placeholder="Enter description"
              value={consumablesInputRow.description}
              onChange={(e) =>
                setConsumablesInputRow({
                  ...consumablesInputRow,
                  description: e.target.value,
                })
              }
            />
          );
        }

        if (isConsumablesEditing(record)) {
          return (
            <Input.TextArea
              rows={1}
              value={consumablesEditRow.description}
              onChange={(e) =>
                setConsumablesEditRow((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          );
        }

        return (
          <span>
            {record.description?.length > 150
              ? `${record.description.slice(0, 150)}...`
              : record.description}
          </span>
        );
      },
    },
    {
      title: "Purchase Cost In AED (per item)",
      dataIndex: "purchaseCost",
      width: 250,
      ellipsis: true,
      render: (_, record) => {
        const renderInput = (row, setRow, debounceKey) => (
          <Input
            type="number"
            min={0}
            placeholder="Enter purchase cost"
            value={row.purchaseCost}
            onChange={(e) => {
              const value = e.target.value.trim();
              setRow((prev) => ({ ...prev, purchaseCost: value }));
              if (record.isInput) {
                setConsumablesAddLoading(true);
              } else if (isConsumablesEditing(record)) {
                setConsumablesSaveLoading(true);
              }
              clearTimeout(window[debounceKey]);
              window[debounceKey] = setTimeout(() => {
                const num = parseFloat(value);
                if (value !== "" && (isNaN(num) || num <= 0)) {
                  notification.error({
                    message: "Invalid Purchase Cost",
                    description: "Purchase cost must be greater than 0.",
                  });
                  setRow((prev) => ({ ...prev, purchaseCost: "" }));
                } else {
                  const { totalPrice } = updateTotalPrice(
                    value,
                    row.addOnCost,
                    row.quantity
                  );
                  setRow((prev) => ({ ...prev, totalPrice }));
                }
                if (record.isInput) {
                  setConsumablesAddLoading(false);
                } else if (isConsumablesEditing(record)) {
                  setConsumablesSaveLoading(false);
                }
              }, 3000);
            }}
          />
        );

        if (record.isInput)
          return renderInput(
            consumablesInputRow,
            setConsumablesInputRow,
            "consumablesPurchaseCostDebounce"
          );
        if (isConsumablesEditing(record))
          return renderInput(
            consumablesEditRow,
            setConsumablesEditRow,
            "consumablesEditPurchaseCostDebounce"
          );
        return <span>{record.purchaseCost || "-"}</span>;
      },
    },
    {
      title: "Add On Cost In AED",
      dataIndex: "addOnCost",
      width: 250,
      render: (_, record) => {
        const renderInput = (row, setRow, debounceKey) => (
          <Input
            type="number"
            min={0}
            placeholder="Enter add on cost"
            value={row.addOnCost}
            onChange={(e) => {
              const value = e.target.value.trim();
              setRow((prev) => ({ ...prev, addOnCost: value }));
              if (record.isInput) {
                setConsumablesAddLoading(true);
              } else if (isConsumablesEditing(record)) {
                setConsumablesSaveLoading(true);
              }

              clearTimeout(window[debounceKey]);
              window[debounceKey] = setTimeout(() => {
                const num = parseFloat(value);
                if (value !== "" && isNaN(num)) {
                  notification.error({
                    message: "Invalid Add On Cost",
                    description: "Add on cost must be greater than 0.",
                  });
                  setRow((prev) => ({ ...prev, addOnCost: "" }));
                } else {
                  const { totalPrice } = updateTotalPrice(
                    row.purchaseCost,
                    value,
                    row.quantity
                  );
                  setRow((prev) => ({ ...prev, totalPrice }));
                }
                if (record.isInput) {
                  setConsumablesAddLoading(false);
                } else if (isConsumablesEditing(record)) {
                  setConsumablesSaveLoading(false);
                }
              }, 3000);
            }}
          />
        );

        if (record.isInput)
          return renderInput(
            consumablesInputRow,
            setConsumablesInputRow,
            "consumablesAddOnCostDebounce"
          );
        if (isConsumablesEditing(record))
          return renderInput(
            consumablesEditRow,
            setConsumablesEditRow,
            "consumablesEditAddOnCostDebounce"
          );
        return <span>{record.addOnCost || "-"}</span>;
      },
    },
    {
      title: "Selling Cost (AED)",
      dataIndex: "sellingCost",
      width: 250,
      render: (_, record) => {
        const renderInput = (row, setRow, debounceKey) => (
          <Input
            type="number"
            min={0}
            placeholder="Enter Selling Cost"
            value={row.sellingCost || ""}
            onChange={(e) => {
              const value = e.target.value.trim();
              setRow((prev) => ({ ...prev, sellingCost: value }));
              clearTimeout(window[debounceKey]);
              window[debounceKey] = setTimeout(() => {
                const num = parseFloat(value);
                if (value !== "" && isNaN(num)) {
                  notification.error({
                    message: "Invalid Selling Cost",
                    description: "Selling cost must be greater than 0.",
                  });
                  setRow((prev) => ({ ...prev, sellingCost: "" }));
                }
              }, 3000);
            }}
          />
        );

        if (record.isInput)
          return renderInput(
            consumablesInputRow,
            setConsumablesInputRow,
            "consumablesSellingCostDebounce"
          );
        if (isConsumablesEditing(record))
          return renderInput(
            consumablesEditRow,
            setConsumablesEditRow,
            "consumablesEditSellingCostDebounce"
          );
        return <span>{record.sellingCost || "-"}</span>;
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      width: 200,
      render: (_, record) => {
        const renderInput = (row, setRow, debounceKey) => (
          <Input
            type="number"
            placeholder="Enter Quantity"
            value={row.quantity}
            onChange={(e) => {
              const value = e.target.value.trim();
              setRow((prev) => ({ ...prev, quantity: value }));
              if (record.isInput) {
                setConsumablesAddLoading(true);
              } else if (isConsumablesEditing(record)) {
                setConsumablesSaveLoading(true);
              }
              clearTimeout(window[debounceKey]);
              window[debounceKey] = setTimeout(() => {
                const num = parseFloat(value);
                if (value !== "" && (value === "0" || isNaN(num) || num <= 0)) {
                  notification.error({
                    message: "Invalid Quantity",
                    description: "Quantity must be greater than 0.",
                  });
                  setRow((prev) => ({ ...prev, quantity: "" }));
                  return;
                }
                const unit = (row.unit || "").toLowerCase();
                if (
                  (unit === "set" || unit === "piece") &&
                  !Number.isInteger(num)
                ) {
                  notification.error({
                    message: "Invalid Quantity",
                    description: `Quantity for unit "${row.unit}" must be a whole number.`,
                  });
                  setRow((prev) => ({ ...prev, quantity: "", unit: "" }));
                  return;
                }
                const { totalPrice } = updateTotalPrice(
                  row.purchaseCost,
                  row.addOnCost,
                  value
                );
                setRow((prev) => ({ ...prev, totalPrice }));
                if (record.isInput) {
                  setConsumablesAddLoading(false);
                } else if (isConsumablesEditing(record)) {
                  setConsumablesSaveLoading(false);
                }
              }, 3000);
            }}
          />
        );

        if (record.isInput)
          return renderInput(
            consumablesInputRow,
            setConsumablesInputRow,
            "consumablesQuantityDebounce"
          );
        if (isConsumablesEditing(record))
          return renderInput(
            consumablesEditRow,
            setConsumablesEditRow,
            "consumablesEditQuantityDebounce"
          );
        return <span>{record.quantity || "-"}</span>;
      },
    },
    {
      title: "Unit",
      dataIndex: "unit",
      width: 250,
      render: (_, record) => {
        const renderSelect = (row, setRow, debounceKey) => (
          <Select
            className="w-100"
            value={row.unit}
            onChange={(selectedUnit) => {
              clearTimeout(window[debounceKey]);
              window[debounceKey] = setTimeout(() => {
                const unitLower = (selectedUnit || "").toLowerCase();
                const num = parseFloat(row.quantity);
                if (
                  (unitLower === "set" || unitLower === "piece") &&
                  !Number.isInteger(num)
                ) {
                  notification.error({
                    message: "Invalid Quantity",
                    description: `Quantity for unit "${selectedUnit}" must be a whole number.`,
                  });
                  setRow((prev) => ({ ...prev, unit: "", quantity: "" }));
                  return;
                }
                setRow((prev) => ({ ...prev, unit: selectedUnit }));
              }, 300);
            }}
            options={consumablesUnitOptions.map((u) => ({
              value: u,
              label: u,
            }))}
            placeholder="Select Unit"
          />
        );

        if (record.isInput)
          return renderSelect(
            consumablesInputRow,
            setConsumablesInputRow,
            "consumablesUnitDebounce"
          );
        if (isConsumablesEditing(record))
          return renderSelect(
            consumablesEditRow,
            setConsumablesEditRow,
            "consumablesEditUnitDebounce"
          );
        return <span>{record.unit || "-"}</span>;
      },
    },
    {
      title: "Stock In Hand",
      dataIndex: "stockInHand",
      width: 200,
      render: (_, record) => {
        if (record.isInput)
          return (
            <Input readOnly value={consumablesInputRow.stockInHand || ""} />
          );
        if (isConsumablesEditing(record))
          return (
            <Input readOnly value={consumablesEditRow.stockInHand || "0"} />
          );
        return <span>{record.stockInHand || "-"}</span>;
      },
    },
    {
      title: "Total Price In AED",
      dataIndex: "totalPrice",
      width: 200,
      ellipsis: true,
      render: (_, record) => {
        if (record.isInput)
          return (
            <Input value={consumablesInputRow.totalPrice || ""} readOnly />
          );
        if (isConsumablesEditing(record))
          return <Input value={consumablesEditRow.totalPrice || ""} readOnly />;
        return <span>{record.totalPrice || "-"}</span>;
      },
    },
    {
      title: "Note",
      dataIndex: "note",
      width: 300,
      ellipsis: true,
      render: (_, record) => {
        if (record.isInput) {
          return (
            <Input.TextArea
              rows={1}
              placeholder="Enter note"
              value={consumablesInputRow.note}
              onChange={(e) =>
                setConsumablesInputRow({
                  ...consumablesInputRow,
                  note: e.target.value,
                })
              }
            />
          );
        }
        if (isConsumablesEditing(record)) {
          return (
            <Input.TextArea
              rows={1}
              value={consumablesEditRow.note}
              onChange={(e) =>
                setConsumablesEditRow((prev) => ({
                  ...prev,
                  note: e.target.value,
                }))
              }
            />
          );
        }
        return (
          <span>
            {record.note?.length > 150
              ? `${record.note.slice(0, 150)}...`
              : record.note}
          </span>
        );
      },
    },
    {
      title: "Action",
      width: 200,
      fixed: "right",
      render: (_, record) => {
        if (record.isInput) {
          return (
            <Button
              className="addButton w-100"
              onClick={handleConsumablesAdd}
              loading={consumablesAddLoading}
              style={{ minWidth: 90 }}
            >
              {consumablesAddLoading ? "Loading..." : "Add"}
            </Button>
          );
        }

        if (isConsumablesEditing(record)) {
          return (
            <div style={{ display: "flex", gap: 8 }}>
              <Button
                type="primary"
                onClick={handleConsumablesSave}
                loading={consumablesSaveLoading}
                className="addButton"
                style={{ minWidth: 90 }}
              >
                {consumablesSaveLoading ? "Loading..." : "Save"}
              </Button>
              <Button
                onClick={handleConsumablesCancel}
                className="deleteButton"
                style={{ minWidth: 90 }}
              >
                Cancel
              </Button>
            </div>
          );
        }

        return (
          <div style={{ display: "flex", gap: 8 }}>
            <Button
              onClick={() => handleConsumablesEdit(record.key)}
              className="addButton"
              style={{ minWidth: 90 }}
            >
              Edit
            </Button>
            <Button
              onClick={() => handleConsumablesDelete(record.key)}
              className="deleteButton"
              danger
              style={{ minWidth: 90 }}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  // const consumablesColumns = [
  //   {
  //     title: "Date",
  //     dataIndex: "date",
  //     width: 220,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           {/* <DatePicker
  //             format="DD-MM-YYYY"
  //             style={{ width: "100%" }}
  //             value={
  //               consumablesInputRow.date &&
  //               dayjs(consumablesInputRow.date, "DD-MM-YYYY").isValid()
  //                 ? dayjs.tz(
  //                     consumablesInputRow.date,
  //                     "DD-MM-YYYY",
  //                     "Asia/Dubai"
  //                   )
  //                 : null
  //             }
  //             onChange={(dateObj) => {
  //               if (!dateObj) {
  //                 setConsumablesInputRow({ ...consumablesInputRow, date: "" });
  //                 return;
  //               }
  //               const formatted = dayjs(dateObj)
  //                 .tz("Asia/Dubai")
  //                 .format("DD-MM-YYYY");
  //               setConsumablesInputRow({
  //                 ...consumablesInputRow,
  //                 date: formatted,
  //               });
  //             }}
  //           /> */}

  //           <Input
  //             placeholder="DD-MM-YYYY"
  //             maxLength={10}
  //             value={consumablesInputRow.date}
  //             onChange={(e) => {
  //               const value = e.target.value;
  //               setConsumablesInputRow({ ...consumablesInputRow, date: value });

  //               // validate only when full length is reached
  //               if (value.length === 10) {
  //                 const regex = /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/;
  //                 if (!regex.test(value)) {
  //                   notification.error({
  //                     message: "Invalid Date",
  //                     description: "Enter date in DD-MM-YYYY format",
  //                   });
  //                   setConsumablesInputRow({
  //                     ...consumablesInputRow,
  //                     date: "",
  //                   });
  //                 }
  //               }
  //             }}
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={record.date}>
  //           <span>{record.date || "-"}</span>
  //         </Tooltip>
  //       ),
  //   },
  //   {
  //     title: "Part Number",
  //     dataIndex: "partNumber",
  //     width: 250,
  //     ellipsis: true,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input
  //             placeholder="Enter part number"
  //             value={consumablesInputRow.partNumber}
  //             onChange={(e) =>
  //               setConsumablesInputRow({
  //                 ...consumablesInputRow,
  //                 partNumber: e.target.value.toUpperCase(),
  //                 quantity: "",
  //               })
  //             }
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={record.partNumber}>
  //           <span>{record.partNumber}</span>
  //         </Tooltip>
  //       ),
  //   },
  //   {
  //     title: "Description",
  //     dataIndex: "description",
  //     ellipsis: true,
  //     width: 500,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input.TextArea
  //             rows={1}
  //             placeholder="Enter description"
  //             value={consumablesInputRow.description}
  //             onChange={(e) =>
  //               setConsumablesInputRow({
  //                 ...consumablesInputRow,
  //                 description: e.target.value,
  //               })
  //             }
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip
  //           title={record.description}
  //           styles={{
  //             root: {
  //               maxWidth: 1000,
  //               wordWrap: "break-word",
  //               whiteSpace: "normal",
  //             },
  //           }}
  //         >
  //           <span className="truncate-text">
  //             {record.description?.length > 150
  //               ? `${record.description.slice(0, 150)}...`
  //               : record.description}
  //           </span>
  //         </Tooltip>
  //       ),
  //   },
  //   {
  //     title: "Purchase Cost In AED (per item)",
  //     dataIndex: "purchaseCost",
  //     ellipsis: true,
  //     width: 250,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input
  //             placeholder="Enter purchase cost"
  //             type="number"
  //             min={0}
  //             value={consumablesInputRow.purchaseCost}
  //             onChange={(e) => {
  //               const value = e.target.value.trim();
  //               setConsumablesInputRow((prev) => ({
  //                 ...prev,
  //                 purchaseCost: value,
  //               }));
  //               setConsumablesFetching(true);
  //               clearTimeout(window.consumablesPurchaseDebounce);
  //               window.consumablesPurchaseDebounce = setTimeout(() => {
  //                 const num = parseFloat(value);
  //                 if (
  //                   value !== "" &&
  //                   (value === "0" ||
  //                     value === "0.0" ||
  //                     value === ".0" ||
  //                     isNaN(num) ||
  //                     num <= 0)
  //                 ) {
  //                   notification.error({
  //                     message: "Invalid Purchase Cost",
  //                     description: "Purchase cost must be greater than 0.",
  //                   });
  //                   setConsumablesInputRow((prev) => ({
  //                     ...prev,
  //                     purchaseCost: "",
  //                   }));
  //                 } else {
  //                   const { totalPrice } = updateTotalPrice(
  //                     value,
  //                     consumablesInputRow.addOnCost,
  //                     consumablesInputRow.quantity
  //                   );
  //                   setConsumablesInputRow((prev) => ({ ...prev, totalPrice }));
  //                 }
  //                 setConsumablesFetching(false);
  //               }, 3000);
  //             }}
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={record.purchaseCost}>
  //           <span>{record.purchaseCost || "-"}</span>
  //         </Tooltip>
  //       ),
  //   },
  //   {
  //     title: "Add On Cost In AED",
  //     dataIndex: "addOnCost",
  //     ellipsis: true,
  //     width: 250,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input
  //             type="number"
  //             min={0}
  //             placeholder="Enter add on cost"
  //             value={consumablesInputRow.addOnCost}
  //             onChange={(e) => {
  //               const value = e.target.value.trim();
  //               setConsumablesInputRow((prev) => ({
  //                 ...prev,
  //                 addOnCost: value,
  //               }));
  //               setConsumablesFetching(true);

  //               clearTimeout(window.consumablesAddOnDebounce);
  //               window.consumablesAddOnDebounce = setTimeout(() => {
  //                 const num = parseFloat(value);
  //                 if (
  //                   value !== "" &&
  //                   // (value === "0" ||
  //                   //   value === "0.0" ||
  //                   //   value === ".0" ||
  //                   //   isNaN(num) ||
  //                   //   num <= 0)
  //                   isNaN(num)
  //                 ) {
  //                   notification.error({
  //                     message: "Invalid Add On Cost",
  //                     description: "Add on cost must be greater than 0.",
  //                   });
  //                   setConsumablesInputRow((prev) => ({
  //                     ...prev,
  //                     addOnCost: "",
  //                   }));
  //                 } else {
  //                   const { totalPrice } = updateTotalPrice(
  //                     consumablesInputRow.purchaseCost,
  //                     value,
  //                     consumablesInputRow.quantity
  //                   );
  //                   setConsumablesInputRow((prev) => ({ ...prev, totalPrice }));
  //                 }
  //                 setConsumablesFetching(false);
  //               }, 3000);
  //             }}
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={record.addOnCost}>
  //           <span>{record.addOnCost}</span>
  //         </Tooltip>
  //       ),
  //   },
  //   {
  //     title: "Selling Cost (AED)",
  //     dataIndex: "sellingCost",
  //     ellipsis: true,
  //     width: 250,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input
  //             type="number"
  //             min={0}
  //             placeholder="Enter Selling Cost"
  //             value={consumablesInputRow.sellingCost || ""}
  //             onChange={(e) => {
  //               const value = e.target.value.trim();
  //               setConsumablesInputRow((prev) => ({
  //                 ...prev,
  //                 sellingCost: value,
  //               }));

  //               clearTimeout(window.consumablesSellingDebounce);
  //               window.consumablesSellingDebounce = setTimeout(() => {
  //                 const num = parseFloat(value);
  //                 if (
  //                   value !== "" &&
  //                   // (value === "0" ||
  //                   //   value === "0.0" ||
  //                   //   value === ".0" ||
  //                   //   isNaN(num) ||
  //                   //   num <= 0)
  //                   isNaN(num)
  //                 ) {
  //                   notification.error({
  //                     message: "Invalid Selling Cost",
  //                     description: "Selling cost must be greater than 0.",
  //                   });
  //                   setConsumablesInputRow((prev) => ({
  //                     ...prev,
  //                     sellingCost: "",
  //                   }));
  //                 }
  //               }, 3000);
  //             }}
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={record.sellingCost}>
  //           <span>{record.sellingCost}</span>
  //         </Tooltip>
  //       ),
  //   },
  //   {
  //     title: "Quantity",
  //     dataIndex: "quantity",
  //     ellipsis: true,
  //     width: 200,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input
  //             placeholder="Enter Quantity"
  //             type="number"
  //             disabled={consumablesUnitLoading}
  //             value={consumablesInputRow.quantity}
  //             onChange={(e) => {
  //               const value = e.target.value.trim();
  //               setConsumablesInputRow((prev) => ({
  //                 ...prev,
  //                 quantity: value,
  //               }));
  //               setConsumablesFetching(true);

  //               clearTimeout(window.consumablesQuantityDebounce);
  //               window.consumablesQuantityDebounce = setTimeout(() => {
  //                 const num = parseFloat(value);
  //                 if (
  //                   value !== "" &&
  //                   (value === "0" ||
  //                     value === "0.0" ||
  //                     value === ".0" ||
  //                     isNaN(num) ||
  //                     num <= 0)
  //                 ) {
  //                   notification.error({
  //                     message: "Invalid Quantity",
  //                     description: "Quantity must be greater than 0.",
  //                   });
  //                   setConsumablesInputRow((prev) => ({
  //                     ...prev,
  //                     quantity: "",
  //                   }));
  //                   setConsumablesFetching(false);
  //                   return;
  //                 }

  //                 const unit = (consumablesInputRow.unit || "").toLowerCase();
  //                 if (
  //                   (unit === "set" || unit === "piece") &&
  //                   !Number.isInteger(num)
  //                 ) {
  //                   notification.error({
  //                     message: "Invalid Quantity",
  //                     description: `Quantity for unit "${consumablesInputRow.unit}" must be a whole number.`,
  //                   });
  //                   setConsumablesInputRow((prev) => ({
  //                     ...prev,
  //                     quantity: "",
  //                     unit: "",
  //                   }));
  //                   setConsumablesFetching(false);
  //                   return;
  //                 }

  //                 const { totalPrice } = updateTotalPrice(
  //                   consumablesInputRow.purchaseCost,
  //                   consumablesInputRow.addOnCost,
  //                   value
  //                 );
  //                 setConsumablesInputRow((prev) => ({ ...prev, totalPrice }));
  //                 setConsumablesFetching(false);
  //               }, 3000);
  //             }}
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={record.quantity}>
  //           <span>{record.quantity}</span>
  //         </Tooltip>
  //       ),
  //   },
  //   {
  //     title: "Unit",
  //     dataIndex: "unit",
  //     width: 250,
  //     ellipsis: true,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Select
  //           className="w-100"
  //           value={consumablesInputRow.unit}
  //           onChange={(selectedUnit) => {
  //             clearTimeout(window.consumablesUnitDebounce);
  //             window.consumablesUnitDebounce = setTimeout(() => {
  //               const unitLower = (selectedUnit || "").toLowerCase();
  //               const num = parseFloat(consumablesInputRow.quantity);

  //               if (
  //                 (unitLower === "set" || unitLower === "piece") &&
  //                 !Number.isInteger(num)
  //               ) {
  //                 notification.error({
  //                   message: "Invalid Quantity",
  //                   description: `Quantity for unit "${selectedUnit}" must be a whole number and should not be empty.`,
  //                 });
  //                 setConsumablesInputRow((prev) => ({
  //                   ...prev,
  //                   unit: "",
  //                   quantity: "",
  //                 }));
  //                 return;
  //               }

  //               setConsumablesInputRow((prev) => ({
  //                 ...prev,
  //                 unit: selectedUnit,
  //               }));
  //             }, 300);
  //           }}
  //           options={consumablesUnitOptions.map((u) => ({
  //             value: u,
  //             label: u,
  //           }))}
  //           loading={consumablesUnitLoading}
  //           placeholder={
  //             consumablesUnitLoading ? "Fetching unit..." : "Select Unit"
  //           }
  //           notFoundContent={
  //             consumablesUnitLoading ? "Fetching unit..." : "No units found"
  //           }
  //         />
  //       ) : (
  //         record.unit || ""
  //       ),
  //   },
  //   {
  //     title: "Stock In Hand",
  //     dataIndex: "stockInHand",
  //     width: 200,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input
  //             readOnly
  //             value={
  //               consumablesInputRow.stockInHand
  //                 ? `${consumablesInputRow.stockInHand} ${
  //                     consumablesInputRow.stockUnit || ""
  //                   }`
  //                 : ""
  //             }
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={`${record.stockInHand} ${record.stockUnit || ""}`}>
  //           <span>
  //             {record.stockInHand
  //               ? `${record.stockInHand} ${record.stockUnit || ""}`
  //               : "-"}
  //           </span>
  //         </Tooltip>
  //       ),
  //   },
  //   {
  //     title: "Total Price In AED",
  //     dataIndex: "totalPrice",
  //     width: 200,
  //     ellipsis: true,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input value={consumablesInputRow.totalPrice || ""} readOnly />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={record.totalPrice}>
  //           <span>{record.totalPrice || "-"}</span>
  //         </Tooltip>
  //       ),
  //   },
  //   {
  //     title: "Note",
  //     dataIndex: "note",
  //     ellipsis: true,
  //     width: 300,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input.TextArea
  //             rows={1}
  //             placeholder="Enter note"
  //             value={consumablesInputRow.note}
  //             onChange={(e) =>
  //               setConsumablesInputRow({
  //                 ...consumablesInputRow,
  //                 note: e.target.value,
  //               })
  //             }
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip
  //           title={record.note}
  //           styles={{
  //             root: {
  //               maxWidth: 1000,
  //               wordWrap: "break-word",
  //               whiteSpace: "normal",
  //             },
  //           }}
  //         >
  //           <span className="truncate-text">
  //             {record.note?.length > 150
  //               ? `${record.note.slice(0, 150)}...`
  //               : record.note}
  //           </span>
  //         </Tooltip>
  //       ),
  //   },
  //   {
  //     title: "Action",
  //     width: 120,
  //     fixed: "right",
  //     align: "center",
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Button
  //           className="addButton ps-4 pe-4"
  //           onClick={handleConsumablesAdd}
  //           disabled={consumablesFetching}
  //           loading={consumablesFetching}
  //         >
  //           {consumablesFetching ? "Loading" : "Add"}
  //         </Button>
  //       ) : (
  //         <Button
  //           className="deleteButton ps-3 pe-3"
  //           onClick={() => handleConsumablesDelete(record.key)}
  //         >
  //           Delete
  //         </Button>
  //       ),
  //   },
  // ];

  const consumablesDisplayData = [
    { key: "input", isInput: true },
    ...consumablesDataSource,
  ];

  const displayAuxiliariesData = [
    { key: "input", isInput: true },
    ...auxiliariesDataSource,
  ];

  const handleAuxiliariesAdd = async () => {
    if (auxiliariesDataSource.length >= maxTableRows) {
      notification.error({
        message: "Limit Reached",
        description: `You can only add up to ${maxTableRows} rows.`,
      });
      return;
    }
    const {
      partNumber,
      description,
      quantity,
      unit,
      purchaseCost,
      addOnCost,
      sellingCost,
      totalPrice,
      location
    } = auxiliariesInputRow;

    // if (
    //   !partNumber?.trim() ||
    //   !description?.trim() ||
    //   !quantity?.trim() ||
    //   isNaN(parseFloat(price)) ||
    //   isNaN(parseFloat(totalPrice)) ||
    //   !auxiliariesInputRow.date
    // )
    if (
      !partNumber ||
      !description ||
      !quantity ||
      !unit ||
      !purchaseCost ||
      !addOnCost ||
      !sellingCost ||
      !totalPrice ||
      !location ||
      !auxiliariesInputRow.date
    ) {
      notification.error({
        message: "Error",
        description:
          "Please fill in Date, Part Number, Description, Quantity, Unit, Purchase Cost, Add On Cost and ensure Selling Cost & Total Price is calculated",
      });
      return;
    }

    const regex = /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/;
    if (!regex.test(auxiliariesInputRow.date)) {
      notification.error({
        message: "Invalid Date",
        description: "Enter date in DD-MM-YYYY format",
      });
      return;
    }

    const newData = {
      key: Date.now(),
      ...auxiliariesInputRow,
      stockInHand: auxiliariesInputRow.stockInHand || "0",
    };

    // setAuxiliariesDataSource([...auxiliariesDataSource, newData]);

    setAuxiliariesDataSource((prev) => [...prev, newData]);

    setAuxiliariesInputRow({
      partNumber: "",
      description: "",
      quantity: "",
      unit: "",
      stockInHand: "",
      purchaseCost: "",
      addOnCost: "",
      sellingCost: "",
      stockUnit: "",
      totalPrice: "",
      note: "",
      location: "",
    });
    await fetchAllStock();
  };

  const handleAuxiliariesDelete = (key) => {
    setAuxiliariesDataSource(
      auxiliariesDataSource.filter((item) => item.key !== key)
    );
  };

  const isAuxiliariesEditing = (record) => record.key === auxiliariesEditingKey;

  // ----- EDIT -----
  const handleAuxiliariesEdit = (key) => {
    const row = auxiliariesDataSource.find((item) => item.key === key);
    setAuxiliariesEditingKey(key);
    setAuxiliariesEditRow({ ...row });
  };

  // ----- SAVE -----
  const handleAuxiliariesSave = () => {
    if (!auxiliariesEditRow) return;

    const {
      partNumber,
      description,
      quantity,
      unit,
      purchaseCost,
      addOnCost,
      sellingCost,
      totalPrice,
      date,
      location
    } = auxiliariesEditRow;

    if (
      !partNumber ||
      !description ||
      !quantity ||
      !unit ||
      !purchaseCost ||
      !addOnCost ||
      !sellingCost ||
      !totalPrice ||
      !date ||
      !location
    ) {
      notification.error({
        message: "Error",
        description:
          "Please fill in Date, Part Number, Location, Description, Quantity, Unit, Purchase Cost, Add On Cost and ensure Selling Cost & Total Price is calculated",
      });
      return;
    }

    const regex = /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/;
    if (!regex.test(date)) {
      notification.error({
        message: "Invalid Date",
        description: "Enter date in DD-MM-YYYY format",
      });
      return;
    }

    setAuxiliariesDataSource((prev) =>
      prev.map((item) =>
        item.key === auxiliariesEditingKey
          ? { ...auxiliariesEditRow, key: auxiliariesEditingKey }
          : item
      )
    );
    setAuxiliariesEditingKey("");
    setAuxiliariesEditRow(null);
  };

  // ----- CANCEL -----
  const handleAuxiliariesCancel = () => {
    setAuxiliariesEditingKey("");
    setAuxiliariesEditRow(null);
  };

  const auxiliariesColumns = [
    {
      title: "Date",
      dataIndex: "date",
      width: 220,
      render: (_, record) => {
        if (record.isInput) {
          return (
            <Input
              placeholder="DD-MM-YYYY"
              maxLength={10}
              value={auxiliariesInputRow.date}
              onChange={(e) => {
                const value = e.target.value;
                setAuxiliariesInputRow({ ...auxiliariesInputRow, date: value });

                if (value.length === 10) {
                  const regex = /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/;
                  if (!regex.test(value)) {
                    notification.error({
                      message: "Invalid Date",
                      description: "Enter date in DD-MM-YYYY format",
                    });
                    setAuxiliariesInputRow({
                      ...auxiliariesInputRow,
                      date: "",
                    });
                  }
                }
              }}
            />
          );
        }

        if (isAuxiliariesEditing(record)) {
          return (
            <Input
              placeholder="DD-MM-YYYY"
              maxLength={10}
              value={auxiliariesEditRow.date}
              onChange={(e) => {
                const value = e.target.value;
                setAuxiliariesEditRow((prev) => ({ ...prev, date: value }));

                if (value.length === 10) {
                  const regex = /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/;
                  if (!regex.test(value)) {
                    notification.error({
                      message: "Invalid Date",
                      description: "Enter date in DD-MM-YYYY format",
                    });
                    setAuxiliariesEditRow((prev) => ({ ...prev, date: "" }));
                  }
                }
              }}
            />
          );
        }

        return <span>{record.date || "-"}</span>;
      },
    },
    {
  title: "Location",
  dataIndex: "location",
  width: 150,
  render: (_, record) => {
    // Input row
    if (record.isInput) {
      return (
        <Select
          placeholder="Select Location"
          value={auxiliariesInputRow.location}
          onChange={(value) =>
            setAuxiliariesInputRow((prev) => ({
              ...prev,
              location: value,
            }))
          }
          style={{ width: "100%" }}
          options={[
            { value: "AE", label: "AE" },
            { value: "MEA", label: "MEA" },
          ]}
        />
      );
    }

    // Edit row
    if (isAuxiliariesEditing(record)) {
      return (
        <Select
          placeholder="Select Location"
          value={auxiliariesEditRow.location}
          onChange={(value) =>
            setAuxiliariesEditRow((prev) => ({
              ...prev,
              location: value,
            }))
          }
          style={{ width: "100%" }}
          options={[
            { value: "AE", label: "AE" },
            { value: "MEA", label: "MEA" },
          ]}
        />
      );
    }

    // Display
    return <span>{record.location || "-"}</span>;
  },
},

    {
      title: "Part Number",
      dataIndex: "partNumber",
      width: 250,
      ellipsis: true,
      render: (_, record) => {
        if (record.isInput) {
          return (
            <Input
              placeholder="Enter part number"
              value={auxiliariesInputRow.partNumber}
              onChange={(e) =>
                setAuxiliariesInputRow({
                  ...auxiliariesInputRow,
                  partNumber: e.target.value.toUpperCase(),
                  quantity: "",
                })
              }
            />
          );
        }

        if (isAuxiliariesEditing(record)) {
          return (
            <Input
              placeholder="Enter part number"
              value={auxiliariesEditRow.partNumber}
              onChange={(e) =>
                setAuxiliariesEditRow((prev) => ({
                  ...prev,
                  partNumber: e.target.value.toUpperCase(),
                  quantity: "",
                }))
              }
            />
          );
        }

        return <span>{record.partNumber}</span>;
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 500,
      ellipsis: true,
      render: (_, record) => {
        if (record.isInput) {
          return (
            <Input.TextArea
              rows={1}
              placeholder="Enter description"
              value={auxiliariesInputRow.description}
              onChange={(e) =>
                setAuxiliariesInputRow({
                  ...auxiliariesInputRow,
                  description: e.target.value,
                })
              }
            />
          );
        }

        if (isAuxiliariesEditing(record)) {
          return (
            <Input.TextArea
              rows={1}
              value={auxiliariesEditRow.description}
              onChange={(e) =>
                setAuxiliariesEditRow((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          );
        }

        return (
          <span>
            {record.description?.length > 150
              ? `${record.description.slice(0, 150)}...`
              : record.description}
          </span>
        );
      },
    },
    {
      title: "Purchase Cost In AED (per item)",
      dataIndex: "purchaseCost",
      width: 250,
      ellipsis: true,
      render: (_, record) => {
        const renderInput = (row, setRow, debounceKey) => (
          <Input
            type="number"
            min={0}
            placeholder="Enter purchase cost"
            value={row.purchaseCost}
            onChange={(e) => {
              const value = e.target.value.trim();
              setRow((prev) => ({ ...prev, purchaseCost: value }));
              if (record.isInput) setAuxiliariesAddLoading(true);
              else if (isAuxiliariesEditing(record))
                setAuxiliariesSaveLoading(true);

              clearTimeout(window[debounceKey]);
              window[debounceKey] = setTimeout(() => {
                const num = parseFloat(value);
                if (value !== "" && (isNaN(num) || num <= 0)) {
                  notification.error({
                    message: "Invalid Purchase Cost",
                    description: "Purchase cost must be greater than 0.",
                  });
                  setRow((prev) => ({ ...prev, purchaseCost: "" }));
                } else {
                  const { totalPrice } = updateTotalPrice(
                    value,
                    row.addOnCost,
                    row.quantity
                  );
                  setRow((prev) => ({ ...prev, totalPrice }));
                }
                if (record.isInput) setAuxiliariesAddLoading(false);
                else if (isAuxiliariesEditing(record))
                  setAuxiliariesSaveLoading(false);
              }, 3000);
            }}
          />
        );

        if (record.isInput)
          return renderInput(
            auxiliariesInputRow,
            setAuxiliariesInputRow,
            "auxiliariesPurchaseCostDebounce"
          );
        if (isAuxiliariesEditing(record))
          return renderInput(
            auxiliariesEditRow,
            setAuxiliariesEditRow,
            "auxiliariesEditPurchaseCostDebounce"
          );
        return <span>{record.purchaseCost || "-"}</span>;
      },
    },
    {
      title: "Add On Cost In AED",
      dataIndex: "addOnCost",
      width: 250,
      render: (_, record) => {
        const renderInput = (row, setRow, debounceKey) => (
          <Input
            type="number"
            min={0}
            placeholder="Enter add on cost"
            value={row.addOnCost}
            onChange={(e) => {
              const value = e.target.value.trim();
              setRow((prev) => ({ ...prev, addOnCost: value }));
              if (record.isInput) setAuxiliariesAddLoading(true);
              else if (isAuxiliariesEditing(record))
                setAuxiliariesSaveLoading(true);

              clearTimeout(window[debounceKey]);
              window[debounceKey] = setTimeout(() => {
                const num = parseFloat(value);
                if (value !== "" && isNaN(num)) {
                  notification.error({
                    message: "Invalid Add On Cost",
                    description: "Add on cost must be greater than 0.",
                  });
                  setRow((prev) => ({ ...prev, addOnCost: "" }));
                } else {
                  const { totalPrice } = updateTotalPrice(
                    row.purchaseCost,
                    value,
                    row.quantity
                  );
                  setRow((prev) => ({ ...prev, totalPrice }));
                }
                if (record.isInput) setAuxiliariesAddLoading(false);
                else if (isAuxiliariesEditing(record))
                  setAuxiliariesSaveLoading(false);
              }, 3000);
            }}
          />
        );

        if (record.isInput)
          return renderInput(
            auxiliariesInputRow,
            setAuxiliariesInputRow,
            "auxiliariesAddOnCostDebounce"
          );
        if (isAuxiliariesEditing(record))
          return renderInput(
            auxiliariesEditRow,
            setAuxiliariesEditRow,
            "auxiliariesEditAddOnCostDebounce"
          );
        return <span>{record.addOnCost || "-"}</span>;
      },
    },
    {
      title: "Selling Cost (AED)",
      dataIndex: "sellingCost",
      width: 250,
      render: (_, record) => {
        const renderInput = (row, setRow, debounceKey) => (
          <Input
            type="number"
            min={0}
            placeholder="Enter Selling Cost"
            value={row.sellingCost || ""}
            onChange={(e) => {
              const value = e.target.value.trim();
              setRow((prev) => ({ ...prev, sellingCost: value }));
              clearTimeout(window[debounceKey]);
              window[debounceKey] = setTimeout(() => {
                const num = parseFloat(value);
                if (value !== "" && isNaN(num)) {
                  notification.error({
                    message: "Invalid Selling Cost",
                    description: "Selling cost must be greater than 0.",
                  });
                  setRow((prev) => ({ ...prev, sellingCost: "" }));
                }
              }, 3000);
            }}
          />
        );

        if (record.isInput)
          return renderInput(
            auxiliariesInputRow,
            setAuxiliariesInputRow,
            "auxiliariesSellingCostDebounce"
          );
        if (isAuxiliariesEditing(record))
          return renderInput(
            auxiliariesEditRow,
            setAuxiliariesEditRow,
            "auxiliariesEditSellingCostDebounce"
          );
        return <span>{record.sellingCost || "-"}</span>;
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      width: 200,
      render: (_, record) => {
        const renderInput = (row, setRow, debounceKey) => (
          <Input
            type="number"
            placeholder="Enter Quantity"
            value={row.quantity}
            onChange={(e) => {
              const value = e.target.value.trim();
              setRow((prev) => ({ ...prev, quantity: value }));
              if (record.isInput) setAuxiliariesAddLoading(true);
              else if (isAuxiliariesEditing(record))
                setAuxiliariesSaveLoading(true);

              clearTimeout(window[debounceKey]);
              window[debounceKey] = setTimeout(() => {
                const num = parseFloat(value);
                if (value !== "" && (value === "0" || isNaN(num) || num <= 0)) {
                  notification.error({
                    message: "Invalid Quantity",
                    description: "Quantity must be greater than 0.",
                  });
                  setRow((prev) => ({ ...prev, quantity: "" }));
                  return;
                }
                const unit = (row.unit || "").toLowerCase();
                if (
                  (unit === "set" || unit === "piece") &&
                  !Number.isInteger(num)
                ) {
                  notification.error({
                    message: "Invalid Quantity",
                    description: `Quantity for unit "${row.unit}" must be a whole number.`,
                  });
                  setRow((prev) => ({ ...prev, quantity: "", unit: "" }));
                  return;
                }
                const { totalPrice } = updateTotalPrice(
                  row.purchaseCost,
                  row.addOnCost,
                  value
                );
                setRow((prev) => ({ ...prev, totalPrice }));
                if (record.isInput) setAuxiliariesAddLoading(false);
                else if (isAuxiliariesEditing(record))
                  setAuxiliariesSaveLoading(false);
              }, 3000);
            }}
          />
        );

        if (record.isInput)
          return renderInput(
            auxiliariesInputRow,
            setAuxiliariesInputRow,
            "auxiliariesQuantityDebounce"
          );
        if (isAuxiliariesEditing(record))
          return renderInput(
            auxiliariesEditRow,
            setAuxiliariesEditRow,
            "auxiliariesEditQuantityDebounce"
          );
        return <span>{record.quantity || "-"}</span>;
      },
    },
    {
      title: "Unit",
      dataIndex: "unit",
      width: 250,
      render: (_, record) => {
        const renderSelect = (row, setRow, debounceKey) => (
          <Select
            className="w-100"
            value={row.unit}
            onChange={(selectedUnit) => {
              clearTimeout(window[debounceKey]);
              window[debounceKey] = setTimeout(() => {
                const unitLower = (selectedUnit || "").toLowerCase();
                const num = parseFloat(row.quantity);
                if (
                  (unitLower === "set" || unitLower === "piece") &&
                  !Number.isInteger(num)
                ) {
                  notification.error({
                    message: "Invalid Quantity",
                    description: `Quantity for unit "${selectedUnit}" must be a whole number.`,
                  });
                  setRow((prev) => ({ ...prev, unit: "", quantity: "" }));
                  return;
                }
                setRow((prev) => ({ ...prev, unit: selectedUnit }));
              }, 300);
            }}
            options={auxiliariesUnitOptions.map((u) => ({
              value: u,
              label: u,
            }))}
            placeholder="Select Unit"
          />
        );

        if (record.isInput)
          return renderSelect(
            auxiliariesInputRow,
            setAuxiliariesInputRow,
            "auxiliariesUnitDebounce"
          );
        if (isAuxiliariesEditing(record))
          return renderSelect(
            auxiliariesEditRow,
            setAuxiliariesEditRow,
            "auxiliariesEditUnitDebounce"
          );
        return <span>{record.unit || "-"}</span>;
      },
    },
    {
      title: "Stock In Hand",
      dataIndex: "stockInHand",
      width: 200,
      render: (_, record) => {
        if (record.isInput)
          return (
            <Input readOnly value={auxiliariesInputRow.stockInHand || ""} />
          );
        if (isAuxiliariesEditing(record))
          return (
            <Input readOnly value={auxiliariesEditRow.stockInHand || "0"} />
          );
        return <span>{record.stockInHand || "-"}</span>;
      },
    },
    {
      title: "Total Price In AED",
      dataIndex: "totalPrice",
      width: 200,
      ellipsis: true,
      render: (_, record) => {
        if (record.isInput)
          return (
            <Input value={auxiliariesInputRow.totalPrice || ""} readOnly />
          );
        if (isAuxiliariesEditing(record))
          return <Input value={auxiliariesEditRow.totalPrice || ""} readOnly />;
        return <span>{record.totalPrice || "-"}</span>;
      },
    },
    {
      title: "Note",
      dataIndex: "note",
      width: 300,
      ellipsis: true,
      render: (_, record) => {
        if (record.isInput) {
          return (
            <Input.TextArea
              rows={1}
              placeholder="Enter note"
              value={auxiliariesInputRow.note}
              onChange={(e) =>
                setAuxiliariesInputRow({
                  ...auxiliariesInputRow,
                  note: e.target.value,
                })
              }
            />
          );
        }
        if (isAuxiliariesEditing(record)) {
          return (
            <Input.TextArea
              rows={1}
              value={auxiliariesEditRow.note}
              onChange={(e) =>
                setAuxiliariesEditRow((prev) => ({
                  ...prev,
                  note: e.target.value,
                }))
              }
            />
          );
        }
        return (
          <span>
            {record.note?.length > 150
              ? `${record.note.slice(0, 150)}...`
              : record.note}
          </span>
        );
      },
    },
    {
      title: "Action",
      width: 200,
      fixed: "right",
      render: (_, record) => {
        if (record.isInput) {
          return (
            <Button
              className="addButton w-100"
              onClick={handleAuxiliariesAdd}
              loading={auxiliariesAddLoading}
              style={{ minWidth: 90 }}
            >
              {auxiliariesAddLoading ? "Loading..." : "Add"}
            </Button>
          );
        }

        if (isAuxiliariesEditing(record)) {
          return (
            <div style={{ display: "flex", gap: 8 }}>
              <Button
                type="primary"
                onClick={handleAuxiliariesSave}
                loading={auxiliariesSaveLoading}
                className="addButton"
                style={{ minWidth: 90 }}
              >
                {auxiliariesSaveLoading ? "Loading..." : "Save"}
              </Button>
              <Button
                onClick={handleAuxiliariesCancel}
                className="deleteButton"
                style={{ minWidth: 90 }}
              >
                Cancel
              </Button>
            </div>
          );
        }

        return (
          <div style={{ display: "flex", gap: 8 }}>
            <Button
              onClick={() => handleAuxiliariesEdit(record.key)}
              className="addButton"
              style={{ minWidth: 90 }}
            >
              Edit
            </Button>
            <Button
              onClick={() => handleAuxiliariesDelete(record.key)}
              className="deleteButton"
              danger
              style={{ minWidth: 90 }}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  // const auxiliariesColumns = [
  //   {
  //     title: "Date",
  //     dataIndex: "date",
  //     width: 220,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           {/* <DatePicker
  //             format="DD-MM-YYYY"
  //             style={{ width: "100%" }}
  //             value={
  //               auxiliariesInputRow.date &&
  //               dayjs(auxiliariesInputRow.date, "DD-MM-YYYY").isValid()
  //                 ? dayjs.tz(
  //                     auxiliariesInputRow.date,
  //                     "DD-MM-YYYY",
  //                     "Asia/Dubai"
  //                   )
  //                 : null
  //             }
  //             onChange={(dateObj) => {
  //               if (!dateObj) {
  //                 setAuxiliariesInputRow({ ...auxiliariesInputRow, date: "" });
  //                 return;
  //               }
  //               const formatted = dayjs(dateObj)
  //                 .tz("Asia/Dubai")
  //                 .format("DD-MM-YYYY");
  //               setAuxiliariesInputRow({
  //                 ...auxiliariesInputRow,
  //                 date: formatted,
  //               });
  //             }}
  //           /> */}

  //           <Input
  //             placeholder="DD-MM-YYYY"
  //             maxLength={10}
  //             value={auxiliariesInputRow.date}
  //             onChange={(e) => {
  //               const value = e.target.value;
  //               setAuxiliariesInputRow({ ...auxiliariesInputRow, date: value });

  //               // validate only when full length is reached
  //               if (value.length === 10) {
  //                 const regex = /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/;
  //                 if (!regex.test(value)) {
  //                   notification.error({
  //                     message: "Invalid Date",
  //                     description: "Enter date in DD-MM-YYYY format",
  //                   });
  //                   setAuxiliariesInputRow({
  //                     ...auxiliariesInputRow,
  //                     date: "",
  //                   });
  //                 }
  //               }
  //             }}
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={record.date}>
  //           <span>{record.date || "-"}</span>
  //         </Tooltip>
  //       ),
  //   },
  //   {
  //     title: "Part Number",
  //     dataIndex: "partNumber",
  //     width: 250,
  //     ellipsis: true,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input
  //             placeholder="Enter part number"
  //             value={auxiliariesInputRow.partNumber}
  //             onChange={(e) =>
  //               setAuxiliariesInputRow({
  //                 ...auxiliariesInputRow,
  //                 partNumber: e.target.value.toUpperCase(),
  //                 quantity: "",
  //               })
  //             }
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={record.partNumber}>
  //           <span>{record.partNumber}</span>
  //         </Tooltip>
  //       ),
  //   },
  //   {
  //     title: "Description",
  //     dataIndex: "description",
  //     width: 500,
  //     ellipsis: true,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input.TextArea
  //             // autoSize={{ minRows: 1, maxRows: 1 }}
  //             rows={1}
  //             placeholder="Enter description"
  //             value={auxiliariesInputRow.description}
  //             onChange={(e) =>
  //               setAuxiliariesInputRow({
  //                 ...auxiliariesInputRow,
  //                 description: e.target.value,
  //               })
  //             }
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip
  //           title={record.description}
  //           styles={{
  //             root: {
  //               maxWidth: 1000,
  //               wordWrap: "break-word",
  //               whiteSpace: "normal",
  //             },
  //           }}
  //         >
  //           {/* <span>{record.description}</span> */}

  //           <span className="truncate-text">
  //             {record.description?.length > 150
  //               ? `${record.description.slice(0, 150)}...`
  //               : record.description}
  //           </span>
  //         </Tooltip>
  //       ),
  //   },

  //   // {
  //   //   title: "Purchase Cost In AED (per item)",
  //   //   dataIndex: "purchaseCost",
  //   //   ellipsis: true,
  //   //   width: 250,
  //   //   render: (_, record) =>
  //   //     record.isInput ? (
  //   //       <Tooltip>
  //   //         <Input
  //   //           placeholder="Enter purchase cost"
  //   //           type="number"
  //   //           min={0}
  //   //           value={auxiliariesInputRow.purchaseCost}
  //   //           onChange={(e) => {
  //   //             const purchaseCost = e.target.value;
  //   //             const { sellingPrice, totalPrice } = updateTotalPrice(
  //   //               purchaseCost,
  //   //               auxiliariesInputRow.addOnCost,
  //   //               auxiliariesInputRow.quantity
  //   //             );
  //   //             setAuxiliariesInputRow((prev) => ({
  //   //               ...prev,
  //   //               purchaseCost,
  //   //               sellingCost: sellingPrice,
  //   //               totalPrice,
  //   //             }));
  //   //           }}
  //   //         />
  //   //       </Tooltip>
  //   //     ) : (
  //   //       <Tooltip title={record.purchaseCost}>
  //   //         <span>{record.purchaseCost || "-"}</span>
  //   //       </Tooltip>
  //   //     ),
  //   // },

  //   {
  //     title: "Purchase Cost In AED (per item)",
  //     dataIndex: "purchaseCost",
  //     ellipsis: true,
  //     width: 250,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input
  //             placeholder="Enter purchase cost"
  //             type="number"
  //             min={0}
  //             value={auxiliariesInputRow.purchaseCost}
  //             onChange={(e) => {
  //               const value = e.target.value.trim();
  //               // update immediately so user sees what they type
  //               setAuxiliariesInputRow((prev) => ({
  //                 ...prev,
  //                 purchaseCost: value,
  //               }));
  //               setAuxiliariesFetching(true);

  //               // debounce validation
  //               clearTimeout(window.auxPurchaseCostDebounce);
  //               window.auxPurchaseCostDebounce = setTimeout(() => {
  //                 const num = parseFloat(value);

  //                 // if field non-empty and invalid zero-like or NaN -> show error
  //                 if (
  //                   value !== "" &&
  //                   (value === "0" ||
  //                     value === "0.0" ||
  //                     value === ".0" ||
  //                     isNaN(num) ||
  //                     num <= 0)
  //                 ) {
  //                   notification.error({
  //                     message: "Invalid Purchase Cost",
  //                     description: "Purchase cost must be greater than 0.",
  //                   });
  //                   // you can either clear the invalid value or leave it; here we clear it
  //                   setAuxiliariesInputRow((prev) => ({
  //                     ...prev,
  //                     purchaseCost: "",
  //                   }));
  //                   setAuxiliariesFetching(false);

  //                   return;
  //                 }

  //                 // valid -> recalc total
  //                 const { totalPrice } = updateTotalPrice(
  //                   value,
  //                   auxiliariesInputRow.addOnCost,
  //                   auxiliariesInputRow.quantity
  //                 );
  //                 setAuxiliariesInputRow((prev) => ({ ...prev, totalPrice }));
  //                 setAuxiliariesFetching(false);
  //               }, 3000);
  //             }}
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={record.purchaseCost}>
  //           <span>{record.purchaseCost || "-"}</span>
  //         </Tooltip>
  //       ),
  //   },

  //   // {
  //   //   title: "Add On Cost In AED",
  //   //   dataIndex: "addOnCost",
  //   //   ellipsis: true,
  //   //   width: 250,
  //   //   render: (_, record) =>
  //   //     record.isInput ? (
  //   //       <Tooltip>
  //   //         <Input
  //   //           type="number"
  //   //           min={0}
  //   //           placeholder="Enter add on cost"
  //   //           value={auxiliariesInputRow.addOnCost}
  //   //           onChange={(e) => {
  //   //             const addOnCost = e.target.value;
  //   //             const { sellingPrice, totalPrice } = updateTotalPrice(
  //   //               auxiliariesInputRow.purchaseCost,
  //   //               addOnCost,
  //   //               auxiliariesInputRow.quantity
  //   //             );
  //   //             setAuxiliariesInputRow((prev) => ({
  //   //               ...prev,
  //   //               addOnCost,
  //   //               sellingCost: sellingPrice,
  //   //               totalPrice,
  //   //             }));
  //   //           }}
  //   //         />
  //   //       </Tooltip>
  //   //     ) : (
  //   //       <Tooltip title={record.addOnCost}>
  //   //         <span>{record.addOnCost}</span>
  //   //       </Tooltip>
  //   //     ),
  //   // },

  //   {
  //     title: "Add On Cost In AED",
  //     dataIndex: "addOnCost",
  //     ellipsis: true,
  //     width: 250,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input
  //             type="number"
  //             min={0}
  //             placeholder="Enter add on cost"
  //             value={auxiliariesInputRow.addOnCost}
  //             onChange={(e) => {
  //               const value = e.target.value.trim();
  //               setAuxiliariesInputRow((prev) => ({
  //                 ...prev,
  //                 addOnCost: value,
  //               }));
  //               setAuxiliariesFetching(true);

  //               clearTimeout(window.auxAddOnCostDebounce);
  //               window.auxAddOnCostDebounce = setTimeout(() => {
  //                 const num = parseFloat(value);
  //                 if (
  //                   value !== "" &&
  //                   // (value === "0" ||
  //                   //   value === "0.0" ||
  //                   //   value === ".0" ||
  //                   //   isNaN(num) ||
  //                   //   num <= 0)
  //                   isNaN(num)
  //                 ) {
  //                   notification.error({
  //                     message: "Invalid Add On Cost",
  //                     description: "Add on cost must be greater than 0.",
  //                   });
  //                   setAuxiliariesInputRow((prev) => ({
  //                     ...prev,
  //                     addOnCost: "",
  //                   }));
  //                   setAuxiliariesFetching(false);

  //                   return;
  //                 }

  //                 const { totalPrice } = updateTotalPrice(
  //                   auxiliariesInputRow.purchaseCost,
  //                   value,
  //                   auxiliariesInputRow.quantity
  //                 );
  //                 setAuxiliariesInputRow((prev) => ({ ...prev, totalPrice }));
  //                 setAuxiliariesFetching(false);
  //               }, 3000);
  //             }}
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={record.addOnCost}>
  //           <span>{record.addOnCost}</span>
  //         </Tooltip>
  //       ),
  //   },

  //   {
  //     title: "Selling Cost (AED)",
  //     dataIndex: "sellingCost",
  //     ellipsis: true,
  //     width: 250,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input
  //             type="number"
  //             min={0}
  //             placeholder="Enter Selling Cost"
  //             value={auxiliariesInputRow.sellingCost || ""}
  //             onChange={(e) => {
  //               const value = e.target.value.trim();
  //               setAuxiliariesInputRow((prev) => ({
  //                 ...prev,
  //                 sellingCost: value,
  //               }));

  //               clearTimeout(window.auxSellingCostDebounce);
  //               window.auxSellingCostDebounce = setTimeout(() => {
  //                 const num = parseFloat(value);
  //                 if (
  //                   value !== "" &&
  //                   // (value === "0" ||
  //                   //   value === "0.0" ||
  //                   //   value === ".0" ||
  //                   //   isNaN(num) ||
  //                   //   num <= 0)
  //                   isNaN(num)
  //                 ) {
  //                   notification.error({
  //                     message: "Invalid Selling Cost",
  //                     description: "Selling cost must be greater than 0.",
  //                   });
  //                   setAuxiliariesInputRow((prev) => ({
  //                     ...prev,
  //                     sellingCost: "",
  //                   }));
  //                   return;
  //                 }
  //                 // no total recalculation needed here unless you want to sync totalPrice
  //               }, 3000);
  //             }}
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={record.sellingCost}>
  //           <span>{record.sellingCost}</span>
  //         </Tooltip>
  //       ),
  //   },

  //   // {
  //   //   title: "Quantity",
  //   //   dataIndex: "quantity",
  //   //   width: 200,
  //   //   ellipsis: true,
  //   //   render: (_, record) =>
  //   //     record.isInput ? (
  //   //       <Tooltip>
  //   //         <Input
  //   //           placeholder="Quantity"
  //   //           type="number"
  //   //           min={1}
  //   //           value={auxiliariesInputRow.quantity}
  //   //           onChange={(e) => {
  //   //             const value = e.target.value.trim();
  //   //             setAuxiliariesInputRow((prev) => ({
  //   //               ...prev,
  //   //               quantity: value,
  //   //             }));

  //   //             clearTimeout(window.auxQuantityDebounce);
  //   //             window.auxQuantityDebounce = setTimeout(() => {
  //   //               const num = parseFloat(value);
  //   //               if (
  //   //                 value !== "" &&
  //   //                 (value === "0" ||
  //   //                   value === "0.0" ||
  //   //                   value === ".0" ||
  //   //                   isNaN(num) ||
  //   //                   num === 0)
  //   //               ) {
  //   //                 notification.error({
  //   //                   message: "Invalid Quantity",
  //   //                   description: "Quantity must be greater than 0.",
  //   //                 });
  //   //                 setAuxiliariesInputRow((prev) => ({
  //   //                   ...prev,
  //   //                   quantity: "",
  //   //                 }));
  //   //                 return;
  //   //               }

  //   //               const { totalPrice } = updateTotalPrice(
  //   //                 auxiliariesInputRow.purchaseCost,
  //   //                 auxiliariesInputRow.addOnCost,
  //   //                 value
  //   //               );
  //   //               setAuxiliariesInputRow((prev) => ({ ...prev, totalPrice }));
  //   //             }, 3000);
  //   //           }}
  //   //         />
  //   //       </Tooltip>
  //   //     ) : (
  //   //       <Tooltip title={record.quantity}>
  //   //         <span>{record.quantity}</span>
  //   //       </Tooltip>
  //   //     ),
  //   // },

  //   // {
  //   //   title: "Unit",
  //   //   dataIndex: "unit",
  //   //   width: 250,
  //   //   ellipsis: true,
  //   //   render: (_, record) =>
  //   //     record.isInput ? (
  //   //       <Select
  //   //         className="w-100"
  //   //         value={auxiliariesInputRow.unit}
  //   //         onChange={(value) =>
  //   //           setAuxiliariesInputRow((prev) => ({ ...prev, unit: value }))
  //   //         }
  //   //         options={auxiliariesUnitOptions.map((u) => ({ value: u, label: u }))}
  //   //         loading={auxiliariesUnitLoading}
  //   //         placeholder={auxiliariesUnitLoading ? "Fetching unit..." : "Select Unit"}
  //   //         notFoundContent={
  //   //           auxiliariesUnitLoading ? "Fetching unit..." : "No units found"
  //   //         }
  //   //         // disabled={inputRow.sparePartsUnitFetched && userRole !== "Admin"}
  //   //       />
  //   //     ) : (
  //   //       record.unit || ""
  //   //     ),
  //   // },

  //   {
  //     title: "Quantity",
  //     dataIndex: "quantity",
  //     width: 200,
  //     ellipsis: true,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input
  //             placeholder="Enter Quantity"
  //             type="number"
  //             // min={1}
  //             disabled={auxiliariesUnitLoading}
  //             value={auxiliariesInputRow.quantity}
  //             onChange={(e) => {
  //               const value = e.target.value.trim();
  //               setAuxiliariesInputRow((prev) => ({
  //                 ...prev,
  //                 quantity: value,
  //               }));
  //               setAuxiliariesFetching(true);

  //               clearTimeout(window.auxQuantityDebounce);
  //               window.auxQuantityDebounce = setTimeout(() => {
  //                 const num = parseFloat(value);

  //                 // Basic >0 check
  //                 if (
  //                   value !== "" &&
  //                   (value === "0" ||
  //                     value === "0.0" ||
  //                     value === ".0" ||
  //                     isNaN(num) ||
  //                     num <= 0)
  //                 ) {
  //                   notification.error({
  //                     message: "Invalid Quantity",
  //                     description: "Quantity must be greater than 0.",
  //                   });
  //                   setAuxiliariesInputRow((prev) => ({
  //                     ...prev,
  //                     quantity: "",
  //                   }));
  //                   setAuxiliariesFetching(false);

  //                   return;
  //                 }

  //                 // Whole number check for Set/Piece
  //                 const unit = (auxiliariesInputRow.unit || "").toLowerCase();
  //                 if (
  //                   (unit === "set" || unit === "piece") &&
  //                   !Number.isInteger(num)
  //                 ) {
  //                   notification.error({
  //                     message: "Invalid Quantity",
  //                     description: `Quantity for unit "${auxiliariesInputRow.unit}" must be a whole number.`,
  //                   });
  //                   setAuxiliariesInputRow((prev) => ({
  //                     ...prev,
  //                     quantity: "",
  //                     unit: "",
  //                   }));
  //                   setAuxiliariesFetching(false);

  //                   return;
  //                 }

  //                 // Update total price
  //                 const { totalPrice } = updateTotalPrice(
  //                   auxiliariesInputRow.purchaseCost,
  //                   auxiliariesInputRow.addOnCost,
  //                   value
  //                 );
  //                 setAuxiliariesInputRow((prev) => ({ ...prev, totalPrice }));
  //                 setAuxiliariesFetching(false);
  //               }, 3000);
  //             }}
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={record.quantity}>
  //           <span>{record.quantity}</span>
  //         </Tooltip>
  //       ),
  //   },
  //   {
  //     title: "Unit",
  //     dataIndex: "unit",
  //     width: 250,
  //     ellipsis: true,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Select
  //           className="w-100"
  //           value={auxiliariesInputRow.unit}
  //           onChange={(selectedUnit) => {
  //             clearTimeout(window.auxUnitDebounce);
  //             window.auxUnitDebounce = setTimeout(() => {
  //               const unitLower = (selectedUnit || "").toLowerCase();
  //               const num = parseFloat(auxiliariesInputRow.quantity);

  //               // Whole number check for Set/Piece
  //               if (
  //                 (unitLower === "set" || unitLower === "piece") &&
  //                 !Number.isInteger(num)
  //               ) {
  //                 notification.error({
  //                   message: "Invalid Quantity",
  //                   description: `Quantity for unit "${selectedUnit}" must be a whole number and should not be empty.`,
  //                 });
  //                 setAuxiliariesInputRow((prev) => ({
  //                   ...prev,
  //                   unit: "",
  //                   quantity: "",
  //                 }));
  //                 return;
  //               }

  //               // If valid, update unit
  //               setAuxiliariesInputRow((prev) => ({
  //                 ...prev,
  //                 unit: selectedUnit,
  //               }));
  //             }, 300);
  //           }}
  //           options={auxiliariesUnitOptions.map((u) => ({
  //             value: u,
  //             label: u,
  //           }))}
  //           loading={auxiliariesUnitLoading}
  //           placeholder={
  //             auxiliariesUnitLoading ? "Fetching unit..." : "Select Unit"
  //           }
  //           notFoundContent={
  //             auxiliariesUnitLoading ? "Fetching unit..." : "No units found"
  //           }
  //         />
  //       ) : (
  //         record.unit || ""
  //       ),
  //   },

  //   {
  //     title: "Stock In Hand",
  //     dataIndex: "stockInHand",
  //     width: 200,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input
  //             readOnly
  //             value={
  //               auxiliariesInputRow.stockInHand
  //                 ? `${auxiliariesInputRow.stockInHand} ${
  //                     auxiliariesInputRow.stockUnit || ""
  //                   }`
  //                 : ""
  //             }
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={`${record.stockInHand} ${record.stockUnit || ""}`}>
  //           <span>
  //             {record.stockInHand
  //               ? `${record.stockInHand} ${record.stockUnit || ""}`
  //               : "-"}
  //           </span>
  //         </Tooltip>
  //       ),
  //   },

  //   {
  //     title: "Total Price In AED",
  //     dataIndex: "totalPrice",
  //     width: 200,
  //     ellipsis: true,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input value={auxiliariesInputRow.totalPrice || ""} readOnly />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={record.totalPrice}>
  //           <span>{record.totalPrice || "-"}</span>
  //         </Tooltip>
  //       ),
  //   },
  //   {
  //     title: "Note",
  //     dataIndex: "note",
  //     width: 500,
  //     ellipsis: true,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input.TextArea
  //             // autoSize={{ minRows: 1, maxRows: 1 }}
  //             rows={1}
  //             placeholder="Enter note"
  //             value={auxiliariesInputRow.note}
  //             onChange={(e) =>
  //               setAuxiliariesInputRow({
  //                 ...auxiliariesInputRow,
  //                 note: e.target.value,
  //               })
  //             }
  //           />
  //         </Tooltip>
  //       ) : (
  //         // <Tooltip title={record.note}>
  //         //   <span>{record.note}</span>
  //         // </Tooltip>
  //         <Tooltip
  //           title={record.note}
  //           styles={{
  //             root: {
  //               maxWidth: 1000,
  //               wordWrap: "break-word",
  //               whiteSpace: "normal",
  //             },
  //           }}
  //         >
  //           {/* <span> {record.note}</span> */}
  //           <span className="truncate-text">
  //             {record.note?.length > 150
  //               ? `${record.note.slice(0, 150)}...`
  //               : record.note}
  //           </span>
  //         </Tooltip>
  //       ),
  //   },

  //   {
  //     title: "Action",
  //     width: 120,
  //     fixed: "right",
  //     align: "center",
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Button
  //           className="addButton ps-4 pe-4 m-auto"
  //           onClick={handleAuxiliariesAdd}
  //           disabled={auxiliariesFetching}
  //           loading={auxiliariesFetching}
  //         >
  //           {auxiliariesFetching ? "Loading" : "Add"}
  //         </Button>
  //       ) : (
  //         <Button
  //           className="deleteButton ps-3 pe-3"
  //           onClick={() => handleAuxiliariesDelete(record.key)}
  //         >
  //           Delete
  //         </Button>
  //       ),
  //   },
  // ];

  // const displayAssetsData = [
  //   { key: "input", isInput: true },
  //   ...assetsDataSource,
  // ];

  // const handleAssetsAdd = async () => {
  //   const {
  //     partNumber,
  //     description,
  //     quantity,
  //     unit,
  //     purchaseCost,
  //     addOnCost,
  //     sellingCost,
  //     totalPrice,
  //   } = assetsInputRow;

  //   if (
  //     !partNumber ||
  //     !description ||
  //     !quantity ||
  //     !unit ||
  //     !purchaseCost ||
  //     !addOnCost ||
  //     !sellingCost ||
  //     !totalPrice ||
  //     !assetsInputRow.date
  //   ) {
  //     notification.error({
  //       message: "Error",
  //       description:
  //         "Please fill in Date, Part Number, Description, Quantity, Unit, Purchase Cost, Add On Cost and ensure Selling Cost & Total Price is calculated",
  //     });
  //     return;
  //   }

  //   const newData = {
  //     key: Date.now(),
  //     ...assetsInputRow,
  //     stockInHand: assetsInputRow.stockInHand || "0",
  //   };
  //   setAssetsDataSource([...assetsDataSource, newData]);
  //   setAssetsInputRow({
  //     partNumber: "",
  //     description: "",
  //     quantity: "",
  //     unit: "",
  //     stockInHand: "",
  //     purchaseCost: "",
  //     addOnCost: "",
  //     sellingCost: "",
  //     stockUnit: "",
  //     totalPrice: "",
  //     note: "",
  //   });
  //   await fetchAllStock();
  // };

  // const handleAssetsDelete = (key) => {
  //   setAssetsDataSource(assetsDataSource.filter((item) => item.key !== key));
  // };

  // const assetsColumns = [
  //   {
  //     title: "Date",
  //     dataIndex: "date",
  //     width: 220,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <DatePicker
  //             format="DD-MM-YYYY"
  //             style={{ width: "100%" }}
  //             value={
  //               assetsInputRow.date &&
  //               dayjs(assetsInputRow.date, "DD-MM-YYYY").isValid()
  //                 ? dayjs.tz(assetsInputRow.date, "DD-MM-YYYY", "Asia/Dubai")
  //                 : null
  //             }
  //             onChange={(dateObj) => {
  //               if (!dateObj) {
  //                 setAssetsInputRow({ ...assetsInputRow, date: "" });
  //                 return;
  //               }
  //               const formatted = dayjs(dateObj)
  //                 .tz("Asia/Dubai")
  //                 .format("DD-MM-YYYY");
  //               setAssetsInputRow({ ...assetsInputRow, date: formatted });
  //               console.log("Selected Dubai Date:", formatted);
  //             }}
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={record.date}>
  //           <span>{record.date || "-"}</span>
  //         </Tooltip>
  //       ),
  //   },

  //   {
  //     title: "Part Number",
  //     dataIndex: "partNumber",
  //     width: 250,
  //     ellipsis: true,

  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input
  //             placeholder="Enter part number"
  //             value={assetsInputRow.partNumber}
  //             onChange={(e) =>
  //               setAssetsInputRow({
  //                 ...assetsInputRow,
  //                 partNumber: e.target.value.toUpperCase(),
  //                 quantity: "",
  //               })
  //             }
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={record.partNumber}>
  //           <span>{record.partNumber}</span>
  //         </Tooltip>
  //       ),
  //   },
  //   {
  //     title: "Description",
  //     dataIndex: "description",
  //     width: 500,
  //     ellipsis: true,

  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input.TextArea
  //             // autoSize={{ minRows: 1, maxRows: 1 }}
  //             rows={1}
  //             placeholder="Enter description"
  //             value={assetsInputRow.description}
  //             onChange={(e) =>
  //               setAssetsInputRow({
  //                 ...assetsInputRow,
  //                 description: e.target.value,
  //               })
  //             }
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip
  //           title={record.description}
  //           styles={{
  //             root: {
  //               maxWidth: 1000,
  //               wordWrap: "break-word",
  //               whiteSpace: "normal",
  //             },
  //           }}
  //         >
  //           <span className="truncate-text">
  //             {record.description?.length > 150
  //               ? `${record.description.slice(0, 150)}...`
  //               : record.description}
  //           </span>{" "}
  //         </Tooltip>
  //       ),
  //   },
  //   // {
  //   //   title: "Purchase Cost(per item)",
  //   //   dataIndex: "purchaseCost",
  //   //   ellipsis: true,
  //   //   width: 250,
  //   //   render: (_, record) =>
  //   //     record.isInput ? (
  //   //       <Tooltip>
  //   //         <Input
  //   //           placeholder="Enter purchase cost"
  //   //           type="number"
  //   //           min={0}
  //   //           value={assetsInputRow.purchaseCost}
  //   //           onChange={(e) => {
  //   //             const purchaseCost = e.target.value;
  //   //             const { sellingPrice, totalPrice } = updateTotalPrice(
  //   //               purchaseCost,
  //   //               assetsInputRow.addOnCost,
  //   //               assetsInputRow.quantity
  //   //             );
  //   //             setAssetsInputRow((prev) => ({
  //   //               ...prev,
  //   //               purchaseCost,
  //   //               sellingCost: sellingPrice,
  //   //               totalPrice,
  //   //             }));
  //   //           }}
  //   //         />
  //   //       </Tooltip>
  //   //     ) : (
  //   //       <Tooltip title={record.purchaseCost}>
  //   //         <span>{record.purchaseCost || "-"}</span>
  //   //       </Tooltip>
  //   //     ),
  //   // },

  //   {
  //     title: "Purchase Cost (per item)",
  //     dataIndex: "purchaseCost",
  //     ellipsis: true,
  //     width: 250,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input
  //             placeholder="Enter purchase cost"
  //             type="number"
  //             min={0}
  //             value={assetsInputRow.purchaseCost}
  //             onChange={(e) => {
  //               const value = e.target.value.trim();

  //               // Always update the input field so user can type freely
  //               setAssetsInputRow((prev) => ({
  //                 ...prev,
  //                 purchaseCost: value,
  //               }));
  //               setAssetsFetching(true);

  //               // Debounce validation
  //               clearTimeout(window.purchaseCostDebounce);
  //               window.purchaseCostDebounce = setTimeout(() => {
  //                 const num = parseFloat(value);

  //                 if (
  //                   value !== "" &&
  //                   (value === "0" ||
  //                     value === "0.0" ||
  //                     value === ".0" ||
  //                     isNaN(num) ||
  //                     num <= 0)
  //                 ) {
  //                   notification.error({
  //                     message: "Invalid Purchase Cost",
  //                     description: "Purchase cost must be greater than 0.",
  //                   });

  //                   setAssetsInputRow((prev) => ({
  //                     ...prev,
  //                     purchaseCost: "",
  //                   }));
  //                 } else {
  //                   const { totalPrice } = updateTotalPrice(
  //                     value,
  //                     assetsInputRow.addOnCost,
  //                     assetsInputRow.quantity
  //                   );

  //                   setAssetsInputRow((prev) => ({
  //                     ...prev,
  //                     totalPrice,
  //                   }));
  //                 }
  //                 setAssetsFetching(false);
  //               }, 3000);
  //             }}
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={record.purchaseCost}>
  //           <span>{record.purchaseCost || "-"}</span>
  //         </Tooltip>
  //       ),
  //   },

  //   // {
  //   //   title: "Add On Cost",
  //   //   dataIndex: "addOnCost",
  //   //   ellipsis: true,
  //   //   width: 250,
  //   //   render: (_, record) =>
  //   //     record.isInput ? (
  //   //       <Tooltip>
  //   //         <Input
  //   //           type="number"
  //   //           min={0}
  //   //           placeholder="Enter add on cost"
  //   //           value={assetsInputRow.addOnCost}
  //   //           onChange={(e) => {
  //   //             const addOnCost = e.target.value;
  //   //             const { sellingPrice, totalPrice } = updateTotalPrice(
  //   //               assetsInputRow.purchaseCost,
  //   //               addOnCost,
  //   //               assetsInputRow.quantity
  //   //             );
  //   //             setAssetsInputRow((prev) => ({
  //   //               ...prev,
  //   //               addOnCost,
  //   //               sellingCost: sellingPrice,
  //   //               totalPrice,
  //   //             }));
  //   //           }}
  //   //         />
  //   //       </Tooltip>
  //   //     ) : (
  //   //       <Tooltip title={record.addOnCost}>
  //   //         <span>{record.addOnCost}</span>
  //   //       </Tooltip>
  //   //     ),
  //   // },

  //   {
  //     title: "Add On Cost",
  //     dataIndex: "addOnCost",
  //     ellipsis: true,
  //     width: 250,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input
  //             type="number"
  //             min={0}
  //             placeholder="Enter add on cost"
  //             value={assetsInputRow.addOnCost}
  //             onChange={(e) => {
  //               const value = e.target.value.trim();

  //               setAssetsInputRow((prev) => ({
  //                 ...prev,
  //                 addOnCost: value,
  //               }));
  //               setAssetsFetching(true);

  //               clearTimeout(window.addOnDebounce);
  //               window.addOnDebounce = setTimeout(() => {
  //                 const num = parseFloat(value);

  //                 if (
  //                   value !== "" &&
  //                   (value === "0" ||
  //                     value === "0.0" ||
  //                     value === ".0" ||
  //                     isNaN(num) ||
  //                     num <= 0)
  //                 ) {
  //                   notification.error({
  //                     message: "Invalid Add On Cost",
  //                     description: "Add on cost must be greater than 0.",
  //                   });
  //                   setAssetsInputRow((prev) => ({
  //                     ...prev,
  //                     addOnCost: "",
  //                   }));
  //                 } else {
  //                   const { totalPrice } = updateTotalPrice(
  //                     assetsInputRow.purchaseCost,
  //                     value,
  //                     assetsInputRow.quantity
  //                   );
  //                   setAssetsInputRow((prev) => ({
  //                     ...prev,
  //                     totalPrice,
  //                   }));
  //                 }
  //                 setAssetsFetching(false);
  //               }, 3000);
  //             }}
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={record.addOnCost}>
  //           <span>{record.addOnCost}</span>
  //         </Tooltip>
  //       ),
  //   },

  //   {
  //     title: "Selling Cost (AED)",
  //     dataIndex: "sellingCost",
  //     ellipsis: true,
  //     width: 250,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input
  //             type="number"
  //             min={0}
  //             placeholder="Enter Selling Cost"
  //             value={assetsInputRow.sellingCost || ""}
  //             onChange={(e) => {
  //               const value = e.target.value.trim();

  //               setAssetsInputRow((prev) => ({
  //                 ...prev,
  //                 sellingCost: value,
  //               }));

  //               clearTimeout(window.sellingDebounce);
  //               window.sellingDebounce = setTimeout(() => {
  //                 const num = parseFloat(value);

  //                 if (
  //                   value !== "" &&
  //                   (value === "0" ||
  //                     value === "0.0" ||
  //                     value === ".0" ||
  //                     isNaN(num) ||
  //                     num <= 0)
  //                 ) {
  //                   notification.error({
  //                     message: "Invalid Selling Cost",
  //                     description: "Selling cost must be greater than 0.",
  //                   });
  //                   setAssetsInputRow((prev) => ({
  //                     ...prev,
  //                     sellingCost: "",
  //                   }));
  //                 }
  //               }, 3000);
  //             }}
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={record.sellingCost}>
  //           <span>{record.sellingCost}</span>
  //         </Tooltip>
  //       ),
  //   },

  //   // {
  //   //   title: "Quantity",
  //   //   dataIndex: "quantity",
  //   //   width: 200,
  //   //   ellipsis: true,
  //   //   render: (_, record) =>
  //   //     record.isInput ? (
  //   //       <Tooltip>
  //   //         <Input
  //   //           placeholder="Enter Quantity"
  //   //           type="number"
  //   //           min={1}
  //   //           value={assetsInputRow.quantity}
  //   //           onChange={(e) => {
  //   //             const quantity = e.target.value;
  //   //             const { sellingPrice, totalPrice } = updateTotalPrice(
  //   //               assetsInputRow.purchaseCost,
  //   //               assetsInputRow.addOnCost,
  //   //               quantity
  //   //             );
  //   //             setAssetsInputRow((prev) => ({
  //   //               ...prev,
  //   //               quantity,
  //   //               sellingCost: sellingPrice, // still needed in case it's blank initially
  //   //               totalPrice,
  //   //             }));
  //   //           }}
  //   //         />
  //   //       </Tooltip>
  //   //     ) : (
  //   //       <Tooltip title={record.quantity}>
  //   //         <span>{record.quantity}</span>
  //   //       </Tooltip>
  //   //     ),
  //   // },

  //   // {
  //   //   title: "Quantity",
  //   //   dataIndex: "quantity",
  //   //   width: 200,
  //   //   ellipsis: true,
  //   //   render: (_, record) =>
  //   //     record.isInput ? (
  //   //       <Tooltip>
  //   //         <Input
  //   //           placeholder="Enter Quantity"
  //   //           type="number"
  //   //           min={1}
  //   //           value={assetsInputRow.quantity}
  //   //           onChange={(e) => {
  //   //             const value = e.target.value.trim();

  //   //             setAssetsInputRow((prev) => ({
  //   //               ...prev,
  //   //               quantity: value,
  //   //             }));

  //   //             clearTimeout(window.quantityDebounce);
  //   //             window.quantityDebounce = setTimeout(() => {
  //   //               const num = parseFloat(value);

  //   //               if (
  //   //                 value !== "" &&
  //   //                 (value === "0" ||
  //   //                   value === "0.0" ||
  //   //                   value === ".0" ||
  //   //                   isNaN(num) ||
  //   //                   num === 0)
  //   //               ) {
  //   //                 notification.error({
  //   //                   message: "Invalid Quantity",
  //   //                   description: "Quantity must be greater than 0.",
  //   //                 });
  //   //                 setAssetsInputRow((prev) => ({
  //   //                   ...prev,
  //   //                   quantity: "",
  //   //                 }));
  //   //               } else {
  //   //                 const { totalPrice } = updateTotalPrice(
  //   //                   assetsInputRow.purchaseCost,
  //   //                   assetsInputRow.addOnCost,
  //   //                   value
  //   //                 );
  //   //                 setAssetsInputRow((prev) => ({
  //   //                   ...prev,
  //   //                   totalPrice,
  //   //                 }));
  //   //               }
  //   //             }, 3000);
  //   //           }}
  //   //         />
  //   //       </Tooltip>
  //   //     ) : (
  //   //       <Tooltip title={record.quantity}>
  //   //         <span>{record.quantity}</span>
  //   //       </Tooltip>
  //   //     ),
  //   // },
  //   // {
  //   //   title: "Unit",
  //   //   dataIndex: "unit",
  //   //   width: 250,
  //   //   ellipsis: true,
  //   //   render: (_, record) =>
  //   //     record.isInput ? (
  //   //       <Select
  //   //         className="w-100"
  //   //         value={assetsInputRow.unit}
  //   //         onChange={(value) =>
  //   //           setAssetsInputRow((prev) => ({ ...prev, unit: value }))
  //   //         }
  //   //         options={assetsUnitOptions.map((u) => ({ value: u, label: u }))}
  //   //         loading={assetsUnitLoading}
  //   //         placeholder={assetsUnitLoading ? "Fetching unit..." : "Select Unit"}
  //   //         notFoundContent={
  //   //           assetsUnitLoading ? "Fetching unit..." : "No units found"
  //   //         }
  //   //         // disabled={inputRow.sparePartsUnitFetched && userRole !== "Admin"}
  //   //       />
  //   //     ) : (
  //   //       record.unit || ""
  //   //     ),
  //   // },

  //   {
  //     title: "Quantity",
  //     dataIndex: "quantity",
  //     width: 200,
  //     ellipsis: true,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input
  //             placeholder="Enter Quantity"
  //             type="number"
  //             // min={1}
  //             disabled={assetsUnitLoading}
  //             value={assetsInputRow.quantity}
  //             onChange={(e) => {
  //               const value = e.target.value.trim();

  //               setAssetsInputRow((prev) => ({
  //                 ...prev,
  //                 quantity: value,
  //               }));
  //               setAssetsFetching(true);

  //               clearTimeout(window.assetsQuantityDebounce);
  //               window.assetsQuantityDebounce = setTimeout(() => {
  //                 const num = parseFloat(value);

  //                 // Basic checks
  //                 if (
  //                   value !== "" &&
  //                   (value === "0" ||
  //                     value === "0.0" ||
  //                     value === ".0" ||
  //                     isNaN(num) ||
  //                     num <= 0)
  //                 ) {
  //                   notification.error({
  //                     message: "Invalid Quantity",
  //                     description: "Quantity must be greater than 0.",
  //                   });
  //                   setAssetsInputRow((prev) => ({
  //                     ...prev,
  //                     quantity: "",
  //                   }));
  //                   setAssetsFetching(false);

  //                   return;
  //                 }

  //                 // Check for Set / Piece unit requirement
  //                 const unit = (assetsInputRow.unit || "").toLowerCase();
  //                 if (
  //                   (unit === "set" || unit === "piece") &&
  //                   !Number.isInteger(num)
  //                 ) {
  //                   notification.error({
  //                     message: "Invalid Quantity",
  //                     description: `Quantity for unit "${assetsInputRow.unit}" must be a whole number.`,
  //                   });
  //                   setAssetsInputRow((prev) => ({
  //                     ...prev,
  //                     quantity: "",
  //                     unit: "",
  //                   }));
  //                   setAssetsFetching(false);

  //                   return;
  //                 }

  //                 // Update total price
  //                 const { totalPrice } = updateTotalPrice(
  //                   assetsInputRow.purchaseCost,
  //                   assetsInputRow.addOnCost,
  //                   value
  //                 );
  //                 setAssetsInputRow((prev) => ({
  //                   ...prev,
  //                   totalPrice,
  //                 }));
  //                 setAssetsFetching(false);
  //               }, 3000);
  //             }}
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={record.quantity}>
  //           <span>{record.quantity}</span>
  //         </Tooltip>
  //       ),
  //   },
  //   {
  //     title: "Unit",
  //     dataIndex: "unit",
  //     width: 250,
  //     ellipsis: true,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Select
  //           className="w-100"
  //           value={assetsInputRow.unit}
  //           onChange={(selectedUnit) => {
  //             clearTimeout(window.assetsUnitDebounce);
  //             window.assetsUnitDebounce = setTimeout(() => {
  //               const unitLower = (selectedUnit || "").toLowerCase();
  //               const num = parseFloat(assetsInputRow.quantity);

  //               // Check if quantity must be whole number
  //               if (
  //                 (unitLower === "set" || unitLower === "piece") &&
  //                 !Number.isInteger(num)
  //               ) {
  //                 notification.error({
  //                   message: "Invalid Quantity",
  //                   description: `Quantity for unit "${selectedUnit}" must be a whole number and should not be empty.`,
  //                 });
  //                 setAssetsInputRow((prev) => ({
  //                   ...prev,
  //                   unit: "",
  //                   quantity: "",
  //                 }));
  //                 return;
  //               }

  //               // If valid, update the unit
  //               setAssetsInputRow((prev) => ({ ...prev, unit: selectedUnit }));
  //             }, 300);
  //           }}
  //           options={assetsUnitOptions.map((u) => ({ value: u, label: u }))}
  //           loading={assetsUnitLoading}
  //           placeholder={assetsUnitLoading ? "Fetching unit..." : "Select Unit"}
  //           notFoundContent={
  //             assetsUnitLoading ? "Fetching unit..." : "No units found"
  //           }
  //         />
  //       ) : (
  //         record.unit || ""
  //       ),
  //   },

  //   {
  //     title: "Stock In Hand",
  //     dataIndex: "stockInHand",
  //     width: 200,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input
  //             readOnly
  //             value={
  //               assetsInputRow.stockInHand
  //                 ? `${assetsInputRow.stockInHand} ${
  //                     assetsInputRow.stockUnit || ""
  //                   }`
  //                 : ""
  //             }
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={`${record.stockInHand} ${record.stockUnit || ""}`}>
  //           <span>
  //             {record.stockInHand
  //               ? `${record.stockInHand} ${record.stockUnit || ""}`
  //               : "-"}
  //           </span>
  //         </Tooltip>
  //       ),
  //   },

  //   {
  //     title: "Total Price In AED",
  //     dataIndex: "totalPrice",
  //     width: 200,
  //     ellipsis: true,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input value={assetsInputRow.totalPrice || ""} readOnly />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={record.totalPrice}>
  //           <span>{record.totalPrice || "-"}</span>
  //         </Tooltip>
  //       ),
  //   },
  //   {
  //     title: "Note",
  //     dataIndex: "note",
  //     width: 500,
  //     ellipsis: true,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input.TextArea
  //             // autoSize={{ minRows: 1, maxRows: 1 }}
  //             rows={1}
  //             placeholder="Enter note"
  //             value={assetsInputRow.note}
  //             onChange={(e) =>
  //               setAssetsInputRow({ ...assetsInputRow, note: e.target.value })
  //             }
  //           />
  //         </Tooltip>
  //       ) : (
  //         // <Tooltip title={record.note}>
  //         //   <span>{record.note}</span>
  //         // </Tooltip>
  //         <Tooltip
  //           title={record.note}
  //           styles={{
  //             root: {
  //               maxWidth: 1000,
  //               wordWrap: "break-word",
  //               whiteSpace: "normal",
  //             },
  //           }}
  //         >
  //           {/* <span> {record.note}</span> */}
  //           <span className="truncate-text">
  //             {record.note?.length > 150
  //               ? `${record.note.slice(0, 150)}...`
  //               : record.note}
  //           </span>
  //         </Tooltip>
  //       ),
  //   },
  //   {
  //     title: "Action",
  //     width: 120,
  //     fixed: "right",
  //     align: "center",
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Button
  //           className="addButton ps-4 pe-4"
  //           onClick={handleAssetsAdd}
  //           disabled={assetsFetching}
  //           loading={assetsFetching}
  //         >
  //           {assetsFetching ? "Loading" : "Add"}
  //         </Button>
  //       ) : (
  //         <Button
  //           className="deleteButton ps-3 pe-3"
  //           onClick={() => handleAssetsDelete(record.key)}
  //         >
  //           Delete
  //         </Button>
  //       ),
  //   },
  // ];

  const displayMachineData = [
    { key: "input", isInput: true },
    ...machineDataSource,
  ];

  const handleMachineAdd = async () => {
    if (machineDataSource.length >= maxTableRows) {
      notification.error({
        message: "Limit Reached",
        description: `You can only add up to ${maxTableRows} rows.`,
      });
      return;
    }
    const {
      partNumber,
      description,
      quantity,
      unit,
      purchaseCost,
      addOnCost,
      sellingCost,
      totalPrice,
       location,
    } = machineinputRow;

    if (
      !partNumber ||
      !description ||
      !quantity ||
      !unit ||
      !purchaseCost ||
      !addOnCost ||
      !sellingCost ||
      !totalPrice ||
      !location ||
      !machineinputRow.date
    ) {
      notification.error({
        message: "Error",
        description:
          "Please fill in Date, Part Number, Location, Description, Quantity, Unit, Purchase Cost, Add On Cost and ensure Selling Cost & Total Price is calculated",
      });
      return;
    }

    const regex = /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/;
    if (!regex.test(machineinputRow.date)) {
      notification.error({
        message: "Invalid Date",
        description: "Enter date in DD-MM-YYYY format",
      });
      return;
    }

    const newData = {
      key: Date.now(),
      ...machineinputRow,
      stockInHand: machineinputRow.stockInHand || "0",
    };
    // setMachineDataSource([...machineDataSource, newData]);
    setMachineDataSource((prev) => [...prev, newData]);
    setMachineInputRow({
      partNumber: "",
      description: "",
      quantity: "",
      unit: "",
      stockInHand: "",
      purchaseCost: "",
      addOnCost: "",
      sellingCost: "",
      totalPrice: "",
      note: "",
      stockUnit: "",
      location: "",
    });
    await fetchAllStock();
  };

  const handleMachineDelete = (key) => {
    setMachineDataSource(machineDataSource.filter((item) => item.key !== key));
  };
  const isMachinesEditing = (record) => record.key === machinesEditingKey;

  const handleMachinesEdit = (key) => {
    const row = machineDataSource.find((item) => item.key === key);
    setMachinesEditingKey(key);
    setMachinesEditRow({ ...row });
  };

  const handleMachinesCancel = () => {
    setMachinesEditingKey("");
    setMachinesEditRow(null);
  };

  const handleMachinesSave = () => {
    if (!machinesEditRow) return;

    const {
      partNumber,
      description,
      quantity,
      unit,
      purchaseCost,
      addOnCost,
      sellingCost,
      totalPrice,
      date,
      location, 
    } = machinesEditRow;

    if (
      !partNumber ||
      !description ||
      !quantity ||
      !unit ||
      !purchaseCost ||
      !addOnCost ||
      !sellingCost ||
      !totalPrice ||
      !date||
      !location 
    ) {
      notification.error({
        message: "Error",
        description:
          "Please fill in Date, Part Number, Loaction, Description, Quantity, Unit, Purchase Cost, Add On Cost and ensure Selling Cost & Total Price is calculated",
      });
      return;
    }

    const regex = /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/;
    if (!regex.test(date)) {
      notification.error({
        message: "Invalid Date",
        description: "Enter date in DD-MM-YYYY format",
      });
      return;
    }

    setMachineDataSource((prev) =>
      prev.map((item) =>
        item.key === machinesEditingKey
          ? { ...machinesEditRow, key: machinesEditingKey }
          : item
      )
    );
    setMachinesEditingKey("");
    setMachinesEditRow(null);
  };

  const machineColumns = [
    {
      title: "Date",
      dataIndex: "date",
      width: 220,
      render: (_, record) => {
        const handleChange = (value, setRow) => {
          setRow((prev) => ({ ...prev, date: value }));
          if (value.length === 10) {
            const regex = /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/;
            if (!regex.test(value)) {
              notification.error({
                message: "Invalid Date",
                description: "Enter date in DD-MM-YYYY format",
              });
              setRow((prev) => ({ ...prev, date: "" }));
            }
          }
        };

        if (record.isInput) {
          return (
            <Input
              placeholder="DD-MM-YYYY"
              maxLength={10}
              value={machineinputRow.date}
              onChange={(e) => handleChange(e.target.value, setMachineInputRow)}
            />
          );
        }
        if (isMachinesEditing(record)) {
          return (
            <Input
              placeholder="DD-MM-YYYY"
              maxLength={10}
              value={machinesEditRow.date}
              onChange={(e) => handleChange(e.target.value, setMachinesEditRow)}
            />
          );
        }
        return <span>{record.date || "-"}</span>;
      },
    },
        {
  title: "Location",
  dataIndex: "location",
  width: 150,
  render: (_, record) => {
    // Input Row
    if (record.isInput) {
      return (
        <Select
          placeholder="Select Location"
          value={machineinputRow.location}
          onChange={(value) =>
            setMachineInputRow((prev) => ({ ...prev, location: value }))
          }
          style={{ width: "100%" }}
          options={[
            { value: "AE", label: "AE" },
            { value: "MEA", label: "MEA" },
          ]}
        />
      );
    }

    // Edit Row
    if (isMachinesEditing(record)) {
      return (
        <Select
          placeholder="Select Location"
          value={machinesEditRow.location}
          onChange={(value) =>
            setMachinesEditRow((prev) => ({ ...prev, location: value }))
          }
          style={{ width: "100%" }}
          options={[
            { value: "AE", label: "AE" },
            { value: "MEA", label: "MEA" },
          ]}
        />
      );
    }

    // Display
    return <span>{record.location || "-"}</span>;
  },
},
    {
      title: "Part Number",
      dataIndex: "partNumber",
      width: 250,
      ellipsis: true,
      render: (_, record) => {
        const handleChange = (value, setRow) =>
          setRow((prev) => ({
            ...prev,
            partNumber: value.toUpperCase(),
            quantity: "",
          }));

        if (record.isInput)
          return (
            <Input
              placeholder="Enter part number"
              value={machineinputRow.partNumber}
              onChange={(e) => handleChange(e.target.value, setMachineInputRow)}
            />
          );
        if (isMachinesEditing(record))
          return (
            <Input
              placeholder="Enter part number"
              value={machinesEditRow.partNumber}
              onChange={(e) => handleChange(e.target.value, setMachinesEditRow)}
            />
          );
        return <span>{record.partNumber}</span>;
      },
    },


    {
      title: "Description",
      dataIndex: "description",
      width: 500,
      ellipsis: true,
      render: (_, record) => {
        const handleChange = (value, setRow) =>
          setRow((prev) => ({ ...prev, description: value }));

        if (record.isInput)
          return (
            <Input.TextArea
              rows={1}
              placeholder="Enter description"
              value={machineinputRow.description}
              onChange={(e) => handleChange(e.target.value, setMachineInputRow)}
            />
          );
        if (isMachinesEditing(record))
          return (
            <Input.TextArea
              rows={1}
              value={machinesEditRow.description}
              onChange={(e) => handleChange(e.target.value, setMachinesEditRow)}
            />
          );
        return (
          <span>
            {record.description?.length > 150
              ? `${record.description.slice(0, 150)}...`
              : record.description}
          </span>
        );
      },
    },
    {
      title: "Purchase Cost In AED (per item)",
      dataIndex: "purchaseCost",
      width: 250,
      ellipsis: true,
      render: (_, record) => {
        const handleChange = (
          value,
          row,
          setRow,
          loadingSetter,
          debounceKey
        ) => {
          setRow((prev) => ({ ...prev, purchaseCost: value }));
          loadingSetter(true);
          clearTimeout(window[debounceKey]);
          window[debounceKey] = setTimeout(() => {
            const num = parseFloat(value);
            if (value !== "" && (isNaN(num) || num <= 0)) {
              notification.error({
                message: "Invalid Purchase Cost",
                description: "Purchase cost must be greater than 0.",
              });
              setRow((prev) => ({ ...prev, purchaseCost: "" }));
            } else {
              const { totalPrice } = updateTotalPrice(
                value,
                row.addOnCost,
                row.quantity
              );
              setRow((prev) => ({ ...prev, totalPrice }));
            }
            loadingSetter(false);
          }, 3000);
        };
        if (record.isInput)
          return (
            <Input
              type="number"
              min={0}
              placeholder="Enter purchase cost"
              value={machineinputRow.purchaseCost}
              onChange={(e) =>
                handleChange(
                  e.target.value,
                  machineinputRow,
                  setMachineInputRow,
                  setMachinesAddLoading,
                  "machinesPurchaseCostDebounce"
                )
              }
            />
          );
        if (isMachinesEditing(record))
          return (
            <Input
              type="number"
              min={0}
              placeholder="Enter purchase cost"
              value={machinesEditRow.purchaseCost}
              onChange={(e) =>
                handleChange(
                  e.target.value,
                  machinesEditRow,
                  setMachinesEditRow,
                  setMachinesSaveLoading,
                  "machinesEditPurchaseCostDebounce"
                )
              }
            />
          );
        return <span>{record.purchaseCost || "-"}</span>;
      },
    },
    {
      title: "Add On Cost In AED",
      dataIndex: "addOnCost",
      width: 250,
      ellipsis: true,
      render: (_, record) => {
        const handleChange = (
          value,
          row,
          setRow,
          loadingSetter,
          debounceKey
        ) => {
          setRow((prev) => ({ ...prev, addOnCost: value }));
          loadingSetter(true);
          clearTimeout(window[debounceKey]);
          window[debounceKey] = setTimeout(() => {
            const num = parseFloat(value);
            if (value !== "" && isNaN(num)) {
              notification.error({
                message: "Invalid Add On Cost",
                description: "Add on cost must be a number.",
              });
              setRow((prev) => ({ ...prev, addOnCost: "" }));
            } else {
              const { totalPrice } = updateTotalPrice(
                row.purchaseCost,
                value,
                row.quantity
              );
              setRow((prev) => ({ ...prev, totalPrice }));
            }
            loadingSetter(false);
          }, 3000);
        };

        if (record.isInput)
          return (
            <Input
              type="number"
              placeholder="Enter add on cost"
              value={machineinputRow.addOnCost}
              onChange={(e) =>
                handleChange(
                  e.target.value,
                  machineinputRow,
                  setMachineInputRow,
                  setMachinesAddLoading,
                  "machinesAddOnCostDebounce"
                )
              }
            />
          );
        if (isMachinesEditing(record))
          return (
            <Input
              type="number"
              placeholder="Enter add on cost"
              value={machinesEditRow.addOnCost}
              onChange={(e) =>
                handleChange(
                  e.target.value,
                  machinesEditRow,
                  setMachinesEditRow,
                  setMachinesSaveLoading,
                  "machinesEditAddOnCostDebounce"
                )
              }
            />
          );
        return <span>{record.addOnCost || "-"}</span>;
      },
    },
    {
      title: "Selling Cost (AED)",
      dataIndex: "sellingCost",
      width: 250,
      ellipsis: true,
      render: (_, record) => {
        const handleChange = (value, row, setRow, debounceKey) => {
          setRow((prev) => ({ ...prev, sellingCost: value }));
          clearTimeout(window[debounceKey]);
          window[debounceKey] = setTimeout(() => {
            if (value !== "" && isNaN(parseFloat(value))) {
              notification.error({
                message: "Invalid Selling Cost",
                description: "Selling cost must be a number.",
              });
              setRow((prev) => ({ ...prev, sellingCost: "" }));
            }
          }, 3000);
        };

        if (record.isInput)
          return (
            <Input
              type="number"
              placeholder="Enter Selling Cost"
              value={machineinputRow.sellingCost || ""}
              onChange={(e) =>
                handleChange(
                  e.target.value,
                  machineinputRow,
                  setMachineInputRow,
                  "machinesSellingCostDebounce"
                )
              }
            />
          );
        if (isMachinesEditing(record))
          return (
            <Input
              type="number"
              placeholder="Enter Selling Cost"
              value={machinesEditRow.sellingCost || ""}
              onChange={(e) =>
                handleChange(
                  e.target.value,
                  machinesEditRow,
                  setMachinesEditRow,
                  "machinesEditSellingCostDebounce"
                )
              }
            />
          );
        return <span>{record.sellingCost || "-"}</span>;
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      width: 200,
      render: (_, record) => {
        const handleChange = (
          value,
          row,
          setRow,
          loadingSetter,
          debounceKey
        ) => {
          setRow((prev) => ({ ...prev, quantity: value }));
          loadingSetter(true);
          clearTimeout(window[debounceKey]);
          window[debounceKey] = setTimeout(() => {
            const num = parseFloat(value);
            if (value !== "" && (value === "0" || isNaN(num) || num <= 0)) {
              notification.error({
                message: "Invalid Quantity",
                description: "Quantity must be greater than 0.",
              });
              setRow((prev) => ({ ...prev, quantity: "" }));
              loadingSetter(false);
              return;
            }

            const unit = (row.unit || "").toLowerCase();
            if (
              (unit === "set" || unit === "piece") &&
              !Number.isInteger(num)
            ) {
              notification.error({
                message: "Invalid Quantity",
                description: `Quantity for unit "${row.unit}" must be a whole number.`,
              });
              setRow((prev) => ({ ...prev, quantity: "", unit: "" }));
              loadingSetter(false);
              return;
            }

            const { totalPrice } = updateTotalPrice(
              row.purchaseCost,
              row.addOnCost,
              value
            );
            setRow((prev) => ({ ...prev, totalPrice }));
            loadingSetter(false);
          }, 3000);
        };

        if (record.isInput)
          return (
            <Input
              type="number"
              placeholder="Enter Quantity"
              value={machineinputRow.quantity}
              onChange={(e) =>
                handleChange(
                  e.target.value,
                  machineinputRow,
                  setMachineInputRow,
                  setMachinesAddLoading,
                  "machinesQuantityDebounce"
                )
              }
            />
          );
        if (isMachinesEditing(record))
          return (
            <Input
              type="number"
              placeholder="Enter Quantity"
              value={machinesEditRow.quantity}
              onChange={(e) =>
                handleChange(
                  e.target.value,
                  machinesEditRow,
                  setMachinesEditRow,
                  setMachinesSaveLoading,
                  "machinesEditQuantityDebounce"
                )
              }
            />
          );
        return <span>{record.quantity || "-"}</span>;
      },
    },
    {
      title: "Unit",
      dataIndex: "unit",
      width: 250,
      render: (_, record) => {
        const handleChange = (selectedUnit, row, setRow, debounceKey) => {
          clearTimeout(window[debounceKey]);
          window[debounceKey] = setTimeout(() => {
            const num = parseFloat(row.quantity);
            if (
              (selectedUnit.toLowerCase() === "set" ||
                selectedUnit.toLowerCase() === "piece") &&
              !Number.isInteger(num)
            ) {
              notification.error({
                message: "Invalid Quantity",
                description: `Quantity for unit "${selectedUnit}" must be a whole number.`,
              });
              setRow((prev) => ({ ...prev, unit: "", quantity: "" }));
              return;
            }
            setRow((prev) => ({ ...prev, unit: selectedUnit }));
          }, 300);
        };

        if (record.isInput)
          return (
            <Select
              className="w-100"
              value={machineinputRow.unit}
              onChange={(value) =>
                handleChange(
                  value,
                  machineinputRow,
                  setMachineInputRow,
                  "machinesUnitDebounce"
                )
              }
              options={machineUnitOptions.map((u) => ({ value: u, label: u }))}
              placeholder="Select Unit"
            />
          );
        if (isMachinesEditing(record))
          return (
            <Select
              className="w-100"
              value={machinesEditRow.unit}
              onChange={(value) =>
                handleChange(
                  value,
                  machinesEditRow,
                  setMachinesEditRow,
                  "machinesEditUnitDebounce"
                )
              }
              options={machineUnitOptions.map((u) => ({ value: u, label: u }))}
              placeholder="Select Unit"
            />
          );
        return <span>{record.unit || "-"}</span>;
      },
    },
    {
      title: "Stock In Hand",
      dataIndex: "stockInHand",
      width: 200,
      render: (_, record) => {
        if (record.isInput)
          return <Input readOnly value={machineinputRow.stockInHand || ""} />;
        if (isMachinesEditing(record))
          return <Input readOnly value={machinesEditRow.stockInHand || "0"} />;
        return <span>{record.stockInHand || "-"}</span>;
      },
    },
    {
      title: "Total Price In AED",
      dataIndex: "totalPrice",
      width: 200,
      ellipsis: true,
      render: (_, record) => {
        if (record.isInput)
          return <Input readOnly value={machineinputRow.totalPrice || ""} />;
        if (isMachinesEditing(record))
          return <Input readOnly value={machinesEditRow.totalPrice || ""} />;
        return <span>{record.totalPrice || "-"}</span>;
      },
    },
    {
      title: "Note",
      dataIndex: "note",
      width: 300,
      ellipsis: true,
      render: (_, record) => {
        const handleChange = (value, setRow) =>
          setRow((prev) => ({ ...prev, note: value }));

        if (record.isInput)
          return (
            <Input.TextArea
              rows={1}
              placeholder="Enter note"
              value={machineinputRow.note}
              onChange={(e) => handleChange(e.target.value, setMachineInputRow)}
            />
          );
        if (isMachinesEditing(record))
          return (
            <Input.TextArea
              rows={1}
              value={machinesEditRow.note}
              onChange={(e) => handleChange(e.target.value, setMachinesEditRow)}
            />
          );
        return (
          <span>
            {record.note?.length > 150
              ? `${record.note.slice(0, 150)}...`
              : record.note}
          </span>
        );
      },
    },
    {
      title: "Action",
      width: 200,
      fixed: "right",
      render: (_, record) => {
        if (record.isInput)
          return (
            <Button
              className="addButton w-100"
              onClick={handleMachineAdd}
              loading={machinesAddLoading}
              style={{ minWidth: 90 }}
            >
              {machinesAddLoading ? "Loading..." : "Add"}
            </Button>
          );
        if (isMachinesEditing(record))
          return (
            <div style={{ display: "flex", gap: 8 }}>
              <Button
                type="primary"
                onClick={handleMachinesSave}
                loading={machinesSaveLoading}
                className="addButton"
                style={{ minWidth: 90 }}
              >
                {machinesSaveLoading ? "Loading..." : "Save"}
              </Button>
              <Button
                onClick={handleMachinesCancel}
                className="deleteButton"
                style={{ minWidth: 90 }}
              >
                Cancel
              </Button>
            </div>
          );
        return (
          <div style={{ display: "flex", gap: 8 }}>
            <Button
              onClick={() => handleMachinesEdit(record.key)}
              className="addButton"
              style={{ minWidth: 90 }}
            >
              Edit
            </Button>
            <Button
              onClick={() => handleMachineDelete(record.key)}
              className="deleteButton"
              danger
              style={{ minWidth: 90 }}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  // const machineColumns = [
  //   {
  //     title: "Date",
  //     dataIndex: "date",
  //     width: 220,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           {/* <DatePicker
  //             format="DD-MM-YYYY"
  //             style={{ width: "100%" }}
  //             value={
  //               machineinputRow.date &&
  //               dayjs(machineinputRow.date, "DD-MM-YYYY").isValid()
  //                 ? dayjs.tz(machineinputRow.date, "DD-MM-YYYY", "Asia/Dubai")
  //                 : null
  //             }
  //             onChange={(dateObj) => {
  //               if (!dateObj) {
  //                 setMachineInputRow({ ...machineinputRow, date: "" });
  //                 return;
  //               }
  //               const formatted = dayjs(dateObj)
  //                 .tz("Asia/Dubai")
  //                 .format("DD-MM-YYYY");
  //               setMachineInputRow({ ...machineinputRow, date: formatted });
  //             }}
  //           /> */}

  //           <Input
  //             placeholder="DD-MM-YYYY"
  //             maxLength={10}
  //             value={machineinputRow.date}
  //             onChange={(e) => {
  //               const value = e.target.value;
  //               setMachineInputRow({ ...machineinputRow, date: value });

  //               // validate only when full length is reached
  //               if (value.length === 10) {
  //                 const regex = /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/;
  //                 if (!regex.test(value)) {
  //                   notification.error({
  //                     message: "Invalid Date",
  //                     description: "Enter date in DD-MM-YYYY format",
  //                   });
  //                   setMachineInputRow({ ...machineinputRow, date: "" });
  //                 }
  //               }
  //             }}
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={record.date}>
  //           <span>{record.date || "-"}</span>
  //         </Tooltip>
  //       ),
  //   },

  //   {
  //     title: "Part Number",
  //     dataIndex: "partNumber",
  //     width: 250,
  //     ellipsis: true,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input
  //             placeholder="Enter part number"
  //             value={machineinputRow.partNumber}
  //             onChange={(e) =>
  //               setMachineInputRow({
  //                 ...machineinputRow,
  //                 partNumber: e.target.value.toUpperCase(),
  //                 quantity: "",
  //               })
  //             }
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={record.partNumber}>
  //           <span>{record.partNumber}</span>
  //         </Tooltip>
  //       ),
  //   },
  //   {
  //     title: "Description",
  //     dataIndex: "description",
  //     width: 500,
  //     ellipsis: true,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input.TextArea
  //             // autoSize={{ minRows: 2, maxRows: 2 }}
  //             rows={1}
  //             placeholder="Enter description"
  //             value={machineinputRow.description}
  //             onChange={(e) =>
  //               setMachineInputRow({
  //                 ...machineinputRow,
  //                 description: e.target.value,
  //               })
  //             }
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip
  //           title={record.description}
  //           styles={{
  //             root: {
  //               maxWidth: 1000,
  //               wordWrap: "break-word",
  //               whiteSpace: "normal",
  //             },
  //           }}
  //         >
  //           <span className="truncate-text">
  //             {record.description?.length > 150
  //               ? `${record.description.slice(0, 150)}...`
  //               : record.description}
  //           </span>
  //         </Tooltip>
  //       ),
  //   },

  //   // {
  //   //   title: "Purchase Cost(per item)",
  //   //   dataIndex: "purchaseCost",
  //   //   ellipsis: true,
  //   //   width: 250,
  //   //   render: (_, record) =>
  //   //     record.isInput ? (
  //   //       <Tooltip>
  //   //         <Input
  //   //           placeholder="Enter purchase cost"
  //   //           type="number"
  //   //           min={0}
  //   //           value={machineinputRow.purchaseCost}
  //   //           onChange={(e) => {
  //   //             const purchaseCost = e.target.value;
  //   //             const { sellingPrice, totalPrice } = updateTotalPrice(
  //   //               purchaseCost,
  //   //               machineinputRow.addOnCost,
  //   //               machineinputRow.quantity
  //   //             );
  //   //             setMachineInputRow((prev) => ({
  //   //               ...prev,
  //   //               purchaseCost,
  //   //               sellingCost: sellingPrice,
  //   //               totalPrice,
  //   //             }));
  //   //           }}
  //   //         />
  //   //       </Tooltip>
  //   //     ) : (
  //   //       <Tooltip title={record.purchaseCost}>
  //   //         <span>{record.purchaseCost || "-"}</span>
  //   //       </Tooltip>
  //   //     ),
  //   // },

  //   {
  //     title: "Purchase Cost(per item)",
  //     dataIndex: "purchaseCost",
  //     ellipsis: true,
  //     width: 250,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input
  //             placeholder="Enter purchase cost"
  //             type="number"
  //             min={0}
  //             value={machineinputRow.purchaseCost}
  //             onChange={(e) => {
  //               const value = e.target.value.trim();

  //               setMachineInputRow((prev) => ({
  //                 ...prev,
  //                 purchaseCost: value,
  //               }));
  //               setMachineFetching(true);

  //               clearTimeout(window.machinePurchaseDebounce);
  //               window.machinePurchaseDebounce = setTimeout(() => {
  //                 const num = parseFloat(value);
  //                 if (
  //                   value !== "" &&
  //                   (value === "0" ||
  //                     value === "0.0" ||
  //                     value === ".0" ||
  //                     isNaN(num) ||
  //                     num <= 0)
  //                 ) {
  //                   notification.error({
  //                     message: "Invalid Purchase Cost",
  //                     description: "Purchase cost must be greater than 0.",
  //                   });
  //                   setMachineInputRow((prev) => ({
  //                     ...prev,
  //                     purchaseCost: "",
  //                   }));
  //                 } else {
  //                   const { totalPrice } = updateTotalPrice(
  //                     value,
  //                     machineinputRow.addOnCost,
  //                     machineinputRow.quantity
  //                   );
  //                   setMachineInputRow((prev) => ({
  //                     ...prev,
  //                     totalPrice,
  //                   }));
  //                 }
  //                 setMachineFetching(false);
  //               }, 3000);
  //             }}
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={record.purchaseCost}>
  //           <span>{record.purchaseCost || "-"}</span>
  //         </Tooltip>
  //       ),
  //   },

  //   // {
  //   //   title: "Add On Cost",
  //   //   dataIndex: "addOnCost",
  //   //   ellipsis: true,
  //   //   width: 250,
  //   //   render: (_, record) =>
  //   //     record.isInput ? (
  //   //       <Tooltip>
  //   //         <Input
  //   //           type="number"
  //   //           min={0}
  //   //           placeholder="Enter add on cost"
  //   //           value={machineinputRow.addOnCost}
  //   //           onChange={(e) => {
  //   //             const addOnCost = e.target.value;
  //   //             const { sellingPrice, totalPrice } = updateTotalPrice(
  //   //               machineinputRow.purchaseCost,
  //   //               addOnCost,
  //   //               machineinputRow.quantity
  //   //             );
  //   //             setMachineInputRow((prev) => ({
  //   //               ...prev,
  //   //               addOnCost,
  //   //               sellingCost: sellingPrice,
  //   //               totalPrice,
  //   //             }));
  //   //           }}
  //   //         />
  //   //       </Tooltip>
  //   //     ) : (
  //   //       <Tooltip title={record.addOnCost}>
  //   //         <span>{record.addOnCost}</span>
  //   //       </Tooltip>
  //   //     ),
  //   // },
  //   {
  //     title: "Add On Cost",
  //     dataIndex: "addOnCost",
  //     ellipsis: true,
  //     width: 250,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input
  //             type="number"
  //             // min={0}
  //             placeholder="Enter add on cost"
  //             value={machineinputRow.addOnCost}
  //             onChange={(e) => {
  //               const value = e.target.value.trim();

  //               setMachineInputRow((prev) => ({
  //                 ...prev,
  //                 addOnCost: value,
  //               }));
  //               setMachineFetching(true);

  //               clearTimeout(window.machineAddOnDebounce);
  //               window.machineAddOnDebounce = setTimeout(() => {
  //                 const num = parseFloat(value);
  //                 if (
  //                   value !== "" &&
  //                   // (value === "0" ||
  //                   //   value === "0.0" ||
  //                   //   value === ".0" ||
  //                   //   isNaN(num) ||
  //                   //   num <= 0)
  //                   isNaN(num)
  //                 ) {
  //                   notification.error({
  //                     message: "Invalid Add On Cost",
  //                     description: "Add on cost must be greater than 0.",
  //                   });
  //                   setMachineInputRow((prev) => ({
  //                     ...prev,
  //                     addOnCost: "",
  //                   }));
  //                 } else {
  //                   const { totalPrice } = updateTotalPrice(
  //                     machineinputRow.purchaseCost,
  //                     value,
  //                     machineinputRow.quantity
  //                   );
  //                   setMachineInputRow((prev) => ({
  //                     ...prev,
  //                     totalPrice,
  //                   }));
  //                 }
  //                 setMachineFetching(false);
  //               }, 3000);
  //             }}
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={record.addOnCost}>
  //           <span>{record.addOnCost}</span>
  //         </Tooltip>
  //       ),
  //   },

  //   // {
  //   //   title: "Selling Cost (AED)",
  //   //   dataIndex: "sellingCost",
  //   //   ellipsis: true,
  //   //   width: 250,
  //   //   render: (_, record, index) =>
  //   //     record.isInput ? (
  //   //       <Tooltip title="Enter Selling Cost">
  //   //         <Input
  //   //           type="number"
  //   //           min={0}
  //   //           placeholder="Enter Selling Cost"
  //   //           value={machineinputRow.sellingCost || ""}
  //   //           onChange={(e) => {
  //   //             const value = e.target.value.trim();
  //   //             const num = parseFloat(value);

  //   //             // Reject values: "0", "0.0", ".0", 0
  //   //             if (
  //   //               value === "0" ||
  //   //               value === "0.0" ||
  //   //               value === ".0" ||
  //   //               isNaN(num) ||
  //   //               num === 0
  //   //             ) {
  //   //               notification.error({
  //   //                 message: "Invalid Selling Cost",
  //   //                 description: "Selling cost must be greater than 0.",
  //   //               });
  //   //               return;
  //   //             }

  //   //             setMachineInputRow((prev) => ({
  //   //               ...prev,
  //   //               sellingCost: value,
  //   //             }));
  //   //           }}
  //   //         />
  //   //       </Tooltip>
  //   //     ) : (
  //   //       <Tooltip title={record.sellingCost}>
  //   //         <span>{record.sellingCost}</span>
  //   //       </Tooltip>
  //   //     ),
  //   // },

  //   {
  //     title: "Selling Cost (AED)",
  //     dataIndex: "sellingCost",
  //     ellipsis: true,
  //     width: 250,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input
  //             type="number"
  //             // min={0}
  //             placeholder="Enter Selling Cost"
  //             value={machineinputRow.sellingCost || ""}
  //             onChange={(e) => {
  //               const value = e.target.value.trim();

  //               setMachineInputRow((prev) => ({
  //                 ...prev,
  //                 sellingCost: value,
  //               }));

  //               clearTimeout(window.machineSellingDebounce);
  //               window.machineSellingDebounce = setTimeout(() => {
  //                 const num = parseFloat(value);
  //                 if (
  //                   value !== "" &&
  //                   // (value === "0" ||
  //                   //   value === "0.0" ||
  //                   //   value === ".0" ||
  //                   //   isNaN(num) ||
  //                   //   num <= 0)
  //                   isNaN(num)
  //                 ) {
  //                   notification.error({
  //                     message: "Invalid Selling Cost",
  //                     description: "Selling cost must be greater than 0.",
  //                   });
  //                   setMachineInputRow((prev) => ({
  //                     ...prev,
  //                     sellingCost: "",
  //                   }));
  //                 }
  //               }, 3000);
  //             }}
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={record.sellingCost}>
  //           <span>{record.sellingCost}</span>
  //         </Tooltip>
  //       ),
  //   },

  //   // {
  //   //   title: "Quantity",
  //   //   dataIndex: "quantity",
  //   //   width: 200,
  //   //   ellipsis: true,
  //   //   render: (_, record) =>
  //   //     record.isInput ? (
  //   //       <Tooltip>
  //   //         <Input
  //   //           placeholder="Enter quantity"
  //   //           type="number"
  //   //           min={1}
  //   //           value={machineinputRow.quantity}
  //   //           onChange={(e) => {
  //   //             const quantity = e.target.value;
  //   //             const { sellingPrice, totalPrice } = updateTotalPrice(
  //   //               machineinputRow.purchaseCost,
  //   //               machineinputRow.addOnCost,
  //   //               quantity
  //   //             );
  //   //             setMachineInputRow((prev) => ({
  //   //               ...prev,
  //   //               quantity,
  //   //               sellingCost: sellingPrice, // still needed in case it's blank initially
  //   //               totalPrice,
  //   //             }));
  //   //           }}
  //   //         />
  //   //       </Tooltip>
  //   //     ) : (
  //   //       <Tooltip title={record.quantity}>
  //   //         <span>{record.quantity}</span>
  //   //       </Tooltip>
  //   //     ),
  //   // },
  //   {
  //     title: "Quantity",
  //     dataIndex: "quantity",
  //     width: 200,
  //     ellipsis: true,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input
  //             placeholder="Enter Quantity"
  //             type="number"
  //             // min={1}
  //             value={machineinputRow.quantity}
  //             disabled={machineUnitLoading}
  //             onChange={(e) => {
  //               const value = e.target.value.trim();

  //               setMachineInputRow((prev) => ({
  //                 ...prev,
  //                 quantity: value,
  //               }));
  //               setMachineFetching(true);

  //               clearTimeout(window.machineQuantityDebounce);
  //               window.machineQuantityDebounce = setTimeout(() => {
  //                 const num = parseFloat(value);
  //                 // if (
  //                 //   value !== "" &&
  //                 //   (value === "0" ||
  //                 //     value === "0.0" ||
  //                 //     value === ".0" ||
  //                 //     isNaN(num) ||
  //                 //     num === 0)
  //                 // ) {
  //                 //   notification.error({
  //                 //     message: "Invalid Quantity",
  //                 //     description: "Quantity must be greater than 0.",
  //                 //   });
  //                 //   setMachineInputRow((prev) => ({
  //                 //     ...prev,
  //                 //     quantity: "",
  //                 //   }));
  //                 // } else {
  //                 //   const { totalPrice } = updateTotalPrice(
  //                 //     machineinputRow.purchaseCost,
  //                 //     machineinputRow.addOnCost,
  //                 //     value
  //                 //   );
  //                 //   setMachineInputRow((prev) => ({
  //                 //     ...prev,
  //                 //     totalPrice,
  //                 //   }));
  //                 // }

  //                 // Basic invalid checks
  //                 if (
  //                   value !== "" &&
  //                   (value === "0" ||
  //                     value === "0.0" ||
  //                     value === ".0" ||
  //                     isNaN(num) ||
  //                     num <= 0)
  //                 ) {
  //                   notification.error({
  //                     message: "Invalid Quantity",
  //                     description: "Quantity must be greater than 0.",
  //                   });
  //                   setMachineInputRow((prev) => ({ ...prev, quantity: "" }));
  //                   setMachineFetching(false);

  //                   return;
  //                 }

  //                 // Extra check for Set / Piece units
  //                 const unit = (machineinputRow.unit || "").toLowerCase();
  //                 if (
  //                   (unit === "set" || unit === "piece") &&
  //                   !Number.isInteger(num)
  //                 ) {
  //                   notification.error({
  //                     message: "Invalid Quantity",
  //                     description: `Quantity for unit "${machineinputRow.unit}" must be a whole number.`,
  //                   });
  //                   setMachineInputRow((prev) => ({
  //                     ...prev,
  //                     quantity: "",
  //                     unit: "",
  //                   }));
  //                   setMachineFetching(false);
  //                   return;
  //                 }

  //                 // Update total price if all checks pass
  //                 const { totalPrice } = updateTotalPrice(
  //                   machineinputRow.purchaseCost,
  //                   machineinputRow.addOnCost,
  //                   value
  //                 );
  //                 setMachineInputRow((prev) => ({ ...prev, totalPrice }));
  //                 setMachineFetching(false);
  //               }, 3000);
  //             }}
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={record.quantity}>
  //           <span>{record.quantity}</span>
  //         </Tooltip>
  //       ),
  //   },

  //   // {
  //   //   title: "Unit",
  //   //   dataIndex: "unit",
  //   //   width: 250,
  //   //   ellipsis: true,
  //   //   render: (_, record) =>
  //   //     record.isInput ? (
  //   //       <Tooltip title="">
  //   //         <Select
  //   //           placeholder="Select unit"
  //   //           className="w-100"
  //   //           value={machineinputRow.unit}
  //   //           onChange={(value) => {
  //   //             setMachineInputRow({ ...machineinputRow, unit: value });
  //   //           }}
  //   //         >
  //   //           <Select.Option value="Set">Set</Select.Option>
  //   //           <Select.Option value="Piece">Piece</Select.Option>
  //   //           <Select.Option value="Number">Number</Select.Option>
  //   //           <Select.Option value="Metre">Metre</Select.Option>
  //   //           <Select.Option value="Litre">Litre</Select.Option>
  //   //         </Select>
  //   //       </Tooltip>
  //   //     ) : (
  //   //       record.unit || ""
  //   //     ),
  //   // },
  //   // {
  //   //   title: "Unit",
  //   //   dataIndex: "unit",
  //   //   width: 250,
  //   //   ellipsis: true,
  //   //   render: (_, record) =>
  //   //     record.isInput ? (
  //   //       <Select
  //   //         className="w-100"
  //   //         value={machineinputRow.unit}
  //   //         onChange={(value) =>
  //   //           setMachineInputRow((prev) => ({ ...prev, unit: value }))
  //   //         }
  //   //         options={machineUnitOptions.map((u) => ({ value: u, label: u }))}
  //   //         loading={machineUnitLoading}
  //   //         placeholder={machineUnitLoading ? "Fetching unit..." : "Select Unit"}
  //   //         notFoundContent={
  //   //           machineUnitLoading ? "Fetching unit..." : "No units found"
  //   //         }
  //   //         // disabled={inputRow.sparePartsUnitFetched && userRole !== "Admin"}
  //   //       />
  //   //     ) : (
  //   //       record.unit || ""
  //   //     ),
  //   // },

  //   {
  //     title: "Unit",
  //     dataIndex: "unit",
  //     width: 250,
  //     ellipsis: true,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Select
  //           className="w-100"
  //           value={machineinputRow.unit}
  //           onChange={(selectedUnit) => {
  //             clearTimeout(window.machineUnitDebounce);
  //             window.machineUnitDebounce = setTimeout(() => {
  //               const unitLower = (selectedUnit || "").toLowerCase();
  //               const num = parseFloat(machineinputRow.quantity);

  //               // Check if quantity must be whole number
  //               if (
  //                 (unitLower === "set" || unitLower === "piece") &&
  //                 !Number.isInteger(num)
  //               ) {
  //                 notification.error({
  //                   message: "Invalid Quantity",
  //                   description: `Quantity for unit "${selectedUnit}" must be a whole number and should not be empty.`,
  //                 });
  //                 setMachineInputRow((prev) => ({
  //                   ...prev,
  //                   unit: "",
  //                   quantity: "",
  //                 }));
  //                 return;
  //               }

  //               // If valid, update the unit
  //               setMachineInputRow((prev) => ({ ...prev, unit: selectedUnit }));
  //             }, 300);
  //           }}
  //           options={machineUnitOptions.map((u) => ({ value: u, label: u }))}
  //           loading={machineUnitLoading}
  //           placeholder={
  //             machineUnitLoading ? "Fetching unit..." : "Select Unit"
  //           }
  //           notFoundContent={
  //             machineUnitLoading ? "Fetching unit..." : "No units found"
  //           }
  //         />
  //       ) : (
  //         record.unit || ""
  //       ),
  //   },

  //   {
  //     title: "Stock In Hand",
  //     dataIndex: "stockInHand",
  //     width: 200,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input
  //             readOnly
  //             value={
  //               machineinputRow.stockInHand
  //                 ? `${machineinputRow.stockInHand} ${
  //                     machineinputRow.stockUnit || ""
  //                   }`
  //                 : ""
  //             }
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={`${record.stockInHand} ${record.stockUnit || ""}`}>
  //           <span>
  //             {record.stockInHand
  //               ? `${record.stockInHand} ${record.stockUnit || ""}`
  //               : "-"}
  //           </span>
  //         </Tooltip>
  //       ),
  //   },

  //   {
  //     title: "Total Price In AED",
  //     dataIndex: "totalPrice",
  //     width: 200,
  //     ellipsis: true,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input value={machineinputRow.totalPrice || ""} readOnly />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip title={record.totalPrice}>
  //           <span>{record.totalPrice || "-"}</span>
  //         </Tooltip>
  //       ),
  //   },
  //   {
  //     title: "Note",
  //     dataIndex: "note",
  //     ellipsis: true,
  //     width: 500,
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Tooltip>
  //           <Input.TextArea
  //             // autoSize={{ minRows: 2, maxRows: 2}}
  //             rows={1}
  //             placeholder="Enter note"
  //             value={machineinputRow.note}
  //             onChange={(e) =>
  //               setMachineInputRow({ ...machineinputRow, note: e.target.value })
  //             }
  //           />
  //         </Tooltip>
  //       ) : (
  //         <Tooltip
  //           title={record.note}
  //           styles={{
  //             root: {
  //               maxWidth: 1000,
  //               wordWrap: "break-word",
  //               whiteSpace: "normal",
  //             },
  //           }}
  //         >
  //           {/* <span> {record.note}</span> */}
  //           <span className="truncate-text">
  //             {record.note?.length > 150
  //               ? `${record.note.slice(0, 150)}...`
  //               : record.note}
  //           </span>
  //         </Tooltip>
  //       ),
  //   },

  //   {
  //     title: "Action",
  //     width: 120,
  //     fixed: "right",
  //     align: "center",
  //     render: (_, record) =>
  //       record.isInput ? (
  //         <Button
  //           className="addButton ps-4 pe-4"
  //           onClick={handleMachineAdd}
  //           disabled={machineFetching}
  //           loading={machineFetching}
  //         >
  //           {machineFetching ? "Loading" : "Add"}
  //         </Button>
  //       ) : (
  //         <Button
  //           className="deleteButton ps-3 pe-3"
  //           onClick={() => handleMachineDelete(record.key)}
  //         >
  //           Delete
  //         </Button>
  //       ),
  //   },
  // ];

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
 .ant-select-multiple .ant-select-selection-placeholder {
    position: absolute;
    top: 50%;
    inset-inline-start: 8px;
    inset-inline-end: 11px;
    transform: translateY(-50%);
    transition: all 0.3s;
    font-weight: normal;
}
     .ant-select-single .ant-select-selector .ant-select-selection-placeholder {
    transition: none;
    pointer-events: none;
    font-weight: normal;
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
    `;
  if (access === "No Access") {
    return (
      <h2 style={{ padding: 20 }}>
        You do not have access to Product Categories
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
              Product Categories
            </h1>
            <p
              className="text-center m-0 p-0 haitianInventoryDescriptionText"
              style={{ color: "#0D3884" }}
            >
              (Add items based on the product categories)
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
                      Categories Information
                    </div>
                    <div
                      className="m-0 p-0"
                      style={{ fontSize: "14px", color: "#0D3884" }}
                    >
                      Details about product categories
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
                    <div className="rounded-2 p-2">
                      <Form.Item
                        label="Product Category"
                        name="productCategory"
                        className="fw-bold"
                        rules={[
                          {
                            required: true,
                            message: "Please select a category",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select a category"
                          onChange={(value) => {
                            setSelectedCategory(value);
                            setMachineInputRow({
                              partNumber: "",
                              description: "",
                              quantity: "",
                              stockInHand: "",
                              note: "",
                            });
                            // setAssetsInputRow({
                            //   partNumber: "",
                            //   description: "",
                            //   quantity: "",
                            //   stockInHand: "",
                            //   note: "",
                            // });
                            setAuxiliariesInputRow({
                              partNumber: "",
                              description: "",
                              quantity: "",
                              stockInHand: "",
                              note: "",
                            });
                            setConsumablesInputRow({
                              partNumber: "",
                              description: "",
                              quantity: "",
                              stockInHand: "",
                              note: "",
                            });
                            setInputRow({
                              partNumber: "",
                              description: "",
                              quantity: "",
                              stockInHand: "",
                              note: "",
                            });
                            setSelectedMachine(null);
                            setSelectedIMMSeries(null);
                            // setSelectedAssets(null);
                            setSelectedAuxiliaries(null);
                            setMachineDataSource([]);
                            setAuxiliariesDataSource([]);
                            // setAssetsDataSource([]);
                            // setDataSource([]);
                            setSparePartsDataSource([]);
                            form.setFieldsValue({
                              machines: undefined,
                              immSeries: undefined,
                              maSeries: undefined,
                              juSeries: undefined,
                              jeSeries: undefined,
                              veSeries: undefined,
                              zeSeries: undefined,
                              haSeries: undefined,
                              auxiliaries: undefined,
                              // assets: undefined,
                              consumables: undefined,
                              // tools: undefined,
                            });
                          }}
                        >
                          <Select.Option value="Machines">
                            Machines
                          </Select.Option>
                          {/* <Select.Option value="Consumables">
                            Consumables
                          </Select.Option> */}
                          {user?.email
                            ?.toLowerCase()
                            .endsWith("@haitianme.com") && (
                            <Select.Option value="Consumables">
                              Consumables
                            </Select.Option>
                          )}
                          {/* <Select.Option value="Tools">Tools</Select.Option> */}
                          <Select.Option value="Auxiliaries">
                            Auxiliaries
                          </Select.Option>
                          {/* <Select.Option value="Assets">Assets</Select.Option> */}
                          <Select.Option value="SpareParts">
                            Spare Parts
                          </Select.Option>
                        </Select>
                      </Form.Item>
                    </div>

                    {selectedCategory === "Machines" && (
                      <div className="rounded-2 p-2">
                        <Form.Item
                          label="Machines"
                          name="machines"
                          className="fw-bold"
                          rules={[
                            {
                              required: true,
                              message: "Please select machine",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Select a machine"
                            onChange={(value) => {
                              setSelectedMachine(value);
                              setMachineDataSource([]);
                              setSelectedIMMSeries(null);
                              form.setFieldsValue({
                                immSeries: undefined,
                                maSeries: undefined,
                                juSeries: undefined,
                                haSeries: undefined,
                              });
                            }}
                          >
                            <Select.Option value="IMM">IMM</Select.Option>
                            {/* <Select.Option value="BMM">BMM</Select.Option> */}
                            {/* <Select.Option value="EBM">EBM</Select.Option>
                            <Select.Option value="SBM">SBM</Select.Option> */}
                          </Select>
                        </Form.Item>

                        {selectedMachine === "IMM" && (
                          <>
                            <Form.Item
                              label="IMM Series"
                              name="immSeries"
                              className="fw-bold"
                              rules={[
                                {
                                  required: true,
                                  message: "Please select IMM series",
                                },
                              ]}
                            >
                              <Select
                                placeholder="Select IMM Series"
                                onChange={(value) => {
                                  setSelectedIMMSeries(value);
                                  setMachineDataSource([]);
                                  form.setFieldsValue({
                                    maSeries: undefined,
                                    juSeries: undefined,
                                    haSeries: undefined,
                                    jeSeries: undefined,
                                    veSeries: undefined,
                                    zeSeries: undefined,
                                  });
                                }}
                              >
                                {IMMSeriesOptions.map((opt) => (
                                  <Select.Option
                                    key={opt.value}
                                    value={opt.value}
                                  >
                                    {opt.label}
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>

                            {/* {selectedIMMSeries === "MA" && (
                              <Form.Item
                                label="MA Series"
                                name="maSeries"
                                className="fw-bold"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please select MA series",
                                  },
                                ]}
                              >
                                <Select placeholder="Select MA Series">
                                  {MAOptions.map((item) => (
                                    <Select.Option key={item} value={item}>
                                      {item}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            )}

                            {selectedIMMSeries === "JU" && (
                              <Form.Item
                                label="JU Series"
                                name="juSeries"
                                className="fw-bold"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please select JU series",
                                  },
                                ]}
                              >
                                <Select placeholder="Select JU Series">
                                  {JUOptions.map((item) => (
                                    <Select.Option key={item} value={item}>
                                      {item}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            )}

                            {selectedIMMSeries === "HA" && (
                              <Form.Item
                                label="HA Series"
                                name="haSeries"
                                className="fw-bold"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please select HA series",
                                  },
                                ]}
                              >
                                <Select placeholder="Select HA Series">
                                  {HAOptions.map((item) => (
                                    <Select.Option key={item} value={item}>
                                      {item}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            )}

                            {selectedIMMSeries === "JE" && (
                              <Form.Item
                                label="JE Series"
                                name="jeSeries"
                                className="fw-bold"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please select JE series",
                                  },
                                ]}
                              >
                                <Select placeholder="Select JE Series">
                                  {JEOptions.map((item) => (
                                    <Select.Option key={item} value={item}>
                                      {item}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            )}

                            {selectedIMMSeries === "VE" && (
                              <Form.Item
                                label="VE Series"
                                name="veSeries"
                                className="fw-bold"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please select VE series",
                                  },
                                ]}
                              >
                                <Select placeholder="Select VE Series">
                                  {VEOptions.map((item) => (
                                    <Select.Option key={item} value={item}>
                                      {item}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            )}
                            {selectedIMMSeries === "ZE" && (
                              <Form.Item
                                label="ZE Series"
                                name="zeSeries"
                                className="fw-bold"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please select ZE series",
                                  },
                                ]}
                              >
                                <Select placeholder="Select ZE Series">
                                  {ZEOptions.map((item) => (
                                    <Select.Option key={item} value={item}>
                                      {item}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            )} */}

                            {/* {selectedIMMSeries && (
                              <Form.Item
                                label={`${selectedIMMSeries} Series`}
                                name={`${selectedIMMSeries.toLowerCase()}Series`}
                                className="fw-bold"
                                rules={[
                                  {
                                    required: true,
                                    message: `Please enter ${selectedIMMSeries} series`,
                                  },
                                ]}
                              >
                                <Input
                                  placeholder={`Enter ${selectedIMMSeries} series `}
                                  onChange={(e) => {
                                    const key = `${selectedIMMSeries.toLowerCase()}Series`;
                                    form.setFieldsValue({
                                      [key]: e.target.value,
                                    });
                                  }}
                                />
                              </Form.Item>
                            )} */}
                            {selectedIMMSeries && (
                              <Form.Item
                                label={`${selectedIMMSeries} Series`}
                                name={`${selectedIMMSeries.toLowerCase()}Series`}
                                className="fw-bold"
                                rules={[
                                  {
                                    required: true,
                                    message: `Please enter or select ${selectedIMMSeries} series`,
                                  },
                                ]}
                              >
                             {/* //   <AutoComplete
                                  allowClear
                                  showSearch
                                  placeholder={
                                    seriesLoading
                                      ? "Loading series..."
                                      : `Enter or select ${selectedIMMSeries} series`
                                  }
                                  loading={seriesLoading}
                                  disabled={seriesLoading}
                                  value={
                                    form.getFieldValue(
                                      `${selectedIMMSeries.toLowerCase()}Series`
                                    ) || ""
                                  }
                                  // options={seriesModels.map((m) => ({
                                  //   label: m,
                                  //   value: m,
                                  // }))}

                                  options={
                                    seriesLoading
                                      ? [
                                          {
                                            label: "Loading...",
                                            value: "",
                                            disabled: true,
                                          },
                                        ]
                                      : seriesModels.map((m) => ({
                                          label: m,
                                          value: m,
                                        }))
                                  }
                                  onSearch={(value) => {
                                    // Filter dropdown while typing (case-insensitive)
                                    const filtered = seriesModels.filter(
                                      (model) =>
                                        model
                                          .toLowerCase()
                                          .includes(value.toLowerCase())
                                    );
                                    setSeriesModels(
                                      filtered.length ? filtered : seriesModels
                                    );
                                    form.setFieldsValue({
                                      [`${selectedIMMSeries.toLowerCase()}Series`]:
                                        value,
                                    });
                                  }}
                                  onChange={(value) => {
                                    const key = `${selectedIMMSeries.toLowerCase()}Series`;
                                    form.setFieldsValue({ [key]: value });
                                    setMachineInputRow((prev) => ({
                                      ...prev,
                                      [key]: value,
                                    }));
                                  }}
                                  onBlur={() => {
                                    const key = `${selectedIMMSeries.toLowerCase()}Series`;
                                    const val = form.getFieldValue(key);
                                    if (val && !seriesModels.includes(val)) {
                                      setSeriesModels((prev) => [
                                        ...new Set([...prev, val]),
                                      ]);
                                    }
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
  placeholder={`Enter or select ${selectedIMMSeries} series`}
  loading={seriesLoading}
  disabled={seriesLoading}
  value={form.getFieldValue(`${selectedIMMSeries.toLowerCase()}Series`) || ""}

  options={(filteredSeries.length ? filteredSeries : seriesModels).map(m => ({
    label: m,
    value: m
  }))}

  onSearch={(value) => {
    setFilteredSeries(
      seriesModels.filter(m =>
        m.toLowerCase().includes(value.toLowerCase())
      )
    );
  }}

  onSelect={(value) => {
    const key = `${selectedIMMSeries.toLowerCase()}Series`;
    form.setFieldsValue({ [key]: value });
    setMachineInputRow(prev => ({
      ...prev,
      [key]: value
    }));
  }}
/>

                              </Form.Item>
                            )}
                          </>
                        )}

                        {selectedMachine && (
                          <div className="col-12">
                            <h6
                              className="haitianColor ms-1 text-decoration-underline"
                              style={{ fontWeight: "600" }}
                            >
                              Machine Details
                            </h6>
                            <Table
                              columns={machineColumns}
                              dataSource={displayMachineData}
                              pagination={{
                                pageSize: 10,
                              }}
                              rowKey="key"
                              scroll={{ x: "max-content" }}
                              size="middle"
                              bordered
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {selectedCategory === "Consumables" && (
                      <div className=" rounded-2 p-1 ">
                        <div className="col-12">
                          <h6
                            className="haitianColor ms-1 text-decoration-underline"
                            style={{ fontWeight: "600" }}
                          >
                            Consumables Details
                          </h6>{" "}
                          <Table
                            columns={consumablesColumns}
                            dataSource={consumablesDisplayData}
                            pagination={{ ageSize: 10 }}
                            rowKey="key"
                            size="middle"
                            scroll={{ x: "max-content" }}
                            bordered
                          />
                        </div>
                      </div>
                    )}

                    {/* {selectedCategory === "Tools" && (
                      <div className="rounded-2 p-1 ">
                        <div className="col-12">
                          <Form.Item
                            label="Tools"
                            name="tools"
                            className="fw-bold"
                            rules={[
                              { required: true, message: "Please input tools" },
                            ]}
                          >
                            <Input placeholder="Enter tools" />
                          </Form.Item>
                        </div>
                      </div>
                    )} */}

                    {/* Working code */}
                    {/* {selectedCategory === "Auxiliaries" && (
                      <div className=" rounded-2 p-1 ">
                        <Form.Item
                          label="Auxiliaries"
                          name="auxiliaries"
                          className="fw-bold"
                          rules={[
                            {
                              required: true,
                              message: "Please select auxiliaries",
                            },
                          ]}
                        >
                          <div style={{ width: "100%" }}>
                            <Cascader
                              options={auxiliariesOptions}
                              placeholder="Select auxiliaries"
                              style={{ width: "100%" }}
                              value={form.getFieldValue("auxiliaries")}
                              onChange={(value) => {
                                form.setFieldsValue({ auxiliaries: value });
                                setSelectedAuxiliaries(value);
                              }}
                            />
                          </div>
                        </Form.Item>
                        {selectedAuxiliaries && (
                          <div className="col-12">
                            <h6
                              className="haitianColor ms-1 text-decoration-underline"
                              style={{ fontWeight: "600" }}
                            >
                              Auxiliaries Details
                            </h6>
                            <div>
                              <Table
                                bordered
                                columns={auxiliariesColumns}
                                dataSource={displayAuxiliariesData}
                                pagination={{
                                  pageSize: 10,
                                }}
                                rowKey="key"
                                scroll={{ x: "max-content" }}
                                size="middle"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )} */}

                    {selectedCategory === "Auxiliaries" && (
                      <div className=" rounded-2 p-1 ">
                        <Form.Item
                          label="Auxiliaries"
                          name="auxiliaries"
                          className="fw-bold"
                          rules={[
                            {
                              required: true,
                              message: "Please select auxiliaries",
                            },
                          ]}
                        >
                          <div style={{ width: "100%" }}>
                            {/* <Cascader
                              options={auxiliariesOptions}
                              placeholder="Select auxiliaries"
                              style={{ width: "100%" }}
                              value={form.getFieldValue("auxiliaries")}
                              onChange={(value) => {
                                form.setFieldsValue({ auxiliaries: value });
                                setSelectedAuxiliaries(value);
                              }}
                            /> */}

                            <Cascader
                              style={{ width: "100%" }}
                              options={options}
                              placeholder={
                                auxOptionLoading
                                  ? "Loading auxiliaries..."
                                  : "Select or add new"
                              }
                              disabled={auxOptionLoading}
                              value={selectedPath}
                              onChange={handleAuxiliariesChange}
                              // showSearch
                              changeOnSelect
                              popupRender={(menus) => (
                                <div>
                                  {menus}
                                  <Divider style={{ margin: "8px 0" }} />
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 8,
                                      padding: "4px 8px",
                                    }}
                                    onMouseDown={(e) => e.stopPropagation()}
                                  >
                                    <Input
                                      placeholder="Enter new item"
                                      value={newItem}
                                      onChange={(e) =>
                                        setNewItem(e.target.value)
                                      }
                                      // onPressEnter={addNewItem}
                                      onKeyDown={(e) => e.stopPropagation()}
                                    />
                                    <Button
                                      type="text"
                                      // onClick={addNewItem}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        addNewItem();
                                      }}
                                      className="addButton"
                                      style={{ minWidth: 90 }}
                                    >
                                      Add
                                    </Button>
                                  </div>
                                </div>
                              )}
                            />
                          </div>
                        </Form.Item>
                        {selectedAuxiliaries && (
                          <div className="col-12">
                            <h6
                              className="haitianColor ms-1 text-decoration-underline"
                              style={{ fontWeight: "600" }}
                            >
                              Auxiliaries Details
                            </h6>
                            <div>
                              <Table
                                bordered
                                columns={auxiliariesColumns}
                                dataSource={displayAuxiliariesData}
                                pagination={{
                                  pageSize: 10,
                                }}
                                rowKey="key"
                                scroll={{ x: "max-content" }}
                                size="middle"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* {selectedCategory === "Assets" && (
                      <div className=" rounded-2 p-1 ">
                        <Form.Item
                          label="Assets"
                          name="assets"
                          className="fw-bold"
                          rules={[
                            { required: true, message: "Please select assets" },
                          ]}
                        >
                          <Select
                            placeholder="Select an asset"
                            onChange={(value) => {
                              setSelectedAssets(value);
                            }}
                          >
                            <Select.Option value="Furniture">
                              Furniture
                            </Select.Option>
                            <Select.Option value="Vehicles">
                              Vehicles
                            </Select.Option>
                            <Select.Option value="IT">IT</Select.Option>
                            <Select.Option value="Utilities">
                              Utilities
                            </Select.Option>
                          </Select>
                        </Form.Item>
                        {selectedAssets && (
                          <div className="col-12">
                            <h6 className="haitianColor ms-1 text-decoration-underline">
                              Assets Details
                            </h6>
                            <Table
                              bordered
                              columns={assetsColumns}
                              dataSource={displayAssetsData}
                              pagination={{
                                pageSize: 10,
                              }}
                              rowKey="key"
                              scroll={{ x: "max-content" }}
                              size="middle"
                            />
                          </div>
                        )}
                      </div>
                    )} */}

                    {selectedCategory === "SpareParts" && (
                      <div className=" rounded-2 p-1 ">
                        <div className="col-12">
                          <h6
                            className="haitianColor ms-1 text-decoration-underline"
                            style={{ fontWeight: "600" }}
                          >
                            Spare Parts Details
                          </h6>{" "}
                          <Table
                            columns={sparePartsColumns}
                            dataSource={displayData}
                            pagination={{ ageSize: 10 }}
                            rowKey="key"
                            size="middle"
                            scroll={{ x: "max-content" }}
                            bordered
                          />
                        </div>
                      </div>
                    )}
                    {!readOnly && (
                      <div className="col-7 text-center mt-4 mb-3 d-flex m-auto">
                        <Button
                          htmlType="submit"
                          size="large"
                          className="submitButton mt-2"
                          // disabled={
                          //   loading ||
                          //   (machineDataSource.length === 0 &&
                          //     auxiliariesDataSource.length === 0 &&
                          //     assetsDataSource.length === 0 &&
                          //     dataSource.length === 0 &&
                          //     !form.getFieldValue("consumables") &&
                          //     !form.getFieldValue("tools"))
                          // }
                          loading={loading}
                        >
                          {loading
                            ? `Submitting Category Data`
                            : "Submit Categories Data"}
                        </Button>

                        <Button
                          size="large"
                          className="clearButton mt-2 ms-3"
                          onClick={() => {
                            // Helper function to check if all fields in an object are empty
                            const isObjectEmpty = (obj) =>
                              Object.values(obj).every(
                                (value) =>
                                  value === "" ||
                                  value === null ||
                                  value === undefined
                              );

                            const formValues = form.getFieldsValue(true);

                            const isEverythingEmpty =
                              (!formValues ||
                                Object.values(formValues).every(
                                  (val) => !val
                                )) &&
                              machineDataSource.length === 0 &&
                              auxiliariesDataSource.length === 0 &&
                              // assetsDataSource.length === 0 &&
                              // dataSource.length === 0 &&
                              setSparePartsDataSource.length === 0 &&
                              isObjectEmpty(inputRow) &&
                              isObjectEmpty(machineinputRow) &&
                              isObjectEmpty(auxiliariesInputRow);
                            // isObjectEmpty(assetsInputRow);

                            if (isEverythingEmpty) {
                              notification.info({
                                message: "Nothing to Clear",
                                description:
                                  "There are no fields or rows to clear.",
                              });
                              return;
                            }

                            // Reset everything
                            form.resetFields();

                            setInputRow({
                              partNumber: "",
                              description: "",
                              quantity: "",
                              stockInHand: "",
                              note: "",
                              price: "",
                              totalPrice: "",
                            });

                            setMachineInputRow({
                              partNumber: "",
                              description: "",
                              quantity: "",
                              stockInHand: "",
                              note: "",
                              price: "",
                              totalPrice: "",
                            });

                            setAuxiliariesInputRow({
                              partNumber: "",
                              description: "",
                              quantity: "",
                              stockInHand: "",
                              note: "",
                              price: "",
                              totalPrice: "",
                            });

                            // setAssetsInputRow({
                            //   partNumber: "",
                            //   description: "",
                            //   quantity: "",
                            //   stockInHand: "",
                            //   note: "",
                            //   price: "",
                            //   totalPrice: "",
                            // });

                            setSelectedCategory(null);
                            setMachineDataSource([]);
                            setAuxiliariesDataSource([]);
                            // setAssetsDataSource([]);
                            // setDataSource([]);
                            setSparePartsDataSource([]);
                            notification.success({
                              message: "Success",
                              description: "Form cleared successfully!",
                            });
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
