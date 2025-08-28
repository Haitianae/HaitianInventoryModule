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
} from "antd";
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
  const [dataSource, setDataSource] = useState([]);
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
  // const [assetsUnitFetched, setAssetsUnitFetched] = useState(false);
  // const [assetsUnitOptions, setAssetsUnitOptions] = useState([]);
  // const [assetsUnitLoading, setAssetsUnitLoading] = useState(false);
  const [auxiliariesUnitFetched, setAuxiliariesUnitFetched] = useState(false);
  const [auxiliariesUnitOptions, setAuxiliariesUnitOptions] = useState([]);
  const [auxiliariesUnitLoading, setAuxiliariesUnitLoading] = useState(false);

  const [stockCache, setStockCache] = useState({});
  const [loadingStockCache, setLoadingStockCache] = useState(true);
  const [userRole, setUserRole] = useState(user);

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
    "https://script.google.com/macros/s/AKfycbzgteKmCmsL5AdZjSPGnEEKQjuRKDtKIrFhRSVSur2aPUKCzVAr5lqaUlcEsxSFziAHNw/exec";

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
      console.error("Error fetching all stock:", err);
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

  useEffect(() => {
    const part = machineinputRow.partNumber?.trim();
    if (!part) return;

    const defaultUnits = ["Set", "Number", "Metre", "Piece", "Litre"];
    const cached = stockCache[part];
    let unit = "";
    let stock = "0";

    if (cached) {
      stock = `${cached.stockInHand} ${cached.unit || ""}`.trim();

      // ✅ category check
      // const belongsToCategory = cached.categories?.includes("Machine");
      // if (belongsToCategory && cached.unit) {
      //   unit = cached.unit.trim();
      // }
      unit = cached.unit?.trim() || "";
    }

    setMachineInputRow((prev) => ({
      ...prev,
      stockInHand: stock,
      unit,
    }));

    // ✅ Update dropdown options
    if (unit) {
      setMachineUnitOptions(
        userRole === "Admin" ? [...new Set([unit, ...defaultUnits])] : [unit]
      );
    } else {
      setMachineUnitOptions([...defaultUnits]);
    }
  }, [machineinputRow.partNumber, stockCache, userRole]);

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

  useEffect(() => {
    const part = auxiliariesInputRow.partNumber?.trim();
    if (!part) return;

    const defaultUnits = ["Set", "Number", "Metre", "Piece", "Litre"];
    const cached = stockCache[part];
    let unit = "";
    let stock = "0";

    if (cached) {
      stock = `${cached.stockInHand} ${cached.unit || ""}`.trim();
      unit = cached.unit?.trim() || "";
    }

    setAuxiliariesInputRow((prev) => ({
      ...prev,
      stockInHand: stock,
      unit,
    }));

    if (unit) {
      setAuxiliariesUnitOptions(
        userRole === "Admin" ? [...new Set([unit, ...defaultUnits])] : [unit]
      );
    } else {
      setAuxiliariesUnitOptions([...defaultUnits]);
    }
  }, [auxiliariesInputRow.partNumber, stockCache, userRole]);

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

  useEffect(() => {
    const part = inputRow.partNumber?.trim();
    if (!part) return;

    const defaultUnits = ["Set", "Number", "Metre", "Piece", "Litre"];
    const cached = stockCache[part];
    let unit = "";
    let stock = "0";

    setSparePartsFetching(true);
    setSpareUnitLoading(true);

    try {
      if (cached) {
        stock = `${cached.stockInHand} ${cached.unit || ""}`.trim();
        unit = cached.unit?.trim() || "";
      }

      setInputRow((prev) => ({
        ...prev,
        stockInHand: stock,
        unit,
        sparePartsUnitFetched: !!unit,
      }));

      // also update the AntD form field
      form.setFieldsValue({ unit });

      // update dropdown options
      setSpareUnitOptions(
        userRole === "Admin"
          ? unit
            ? [...new Set([unit, ...defaultUnits])]
            : [...defaultUnits]
          : unit
          ? [unit]
          : [...defaultUnits]
      );
    } catch (err) {
      console.error("❌ Error updating spare parts from cache:", err);

      setInputRow((prev) => ({
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
  }, [inputRow.partNumber, stockCache, userRole]);

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
        // assetsDataSource.length === 0 &&
        dataSource.length === 0 &&
        !form.getFieldValue("consumables")
        // !form.getFieldValue("tools")
        )
    ) {
      console.log("Return");
      notification.error({
        message: "Error",
        description:
          "Please fill in Date, Part Number, Description, Quantity,  Unit, Purchase Cost, Add On Cost and click Add before submitting",
      });
      return;
    }
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
      auxiliaries,
      // assets,
      consumables,
      // tools,
    } = values;

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
        // assetsDataSource.length,
        dataSource.length
      );

      for (let i = 0; i < maxLength; i++) {
        const machine = machineDataSource[i] || {};
        const auxiliary = auxiliariesDataSource[i] || {};
        // const asset = assetsDataSource[i] || {};
        const spare = dataSource[i] || {};

        console.log("User object in handleSubmit:", user);


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
          // userName: user || "",
userName: user?.email || "",

          consumables: i === 0 ? consumables || "" : "",
          // tools: i === 0 ? tools || "" : "",

          auxiliaries: Array.isArray(auxiliaries)
            ? auxiliaries.join(" / ")
            : auxiliaries || "",

          auxPartNumber: auxiliary.partNumber || "-",
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

          // assets: i === 0 ? assets || "-" : "",
          // assets: assets || "-",
          // assetPartNumber: asset.partNumber || "-",
          // assetDescription: asset.description || "-",
          // assetQuantity: asset.quantity || "-",
          // assetStockInHand: asset.stockInHand || "0",
          // assetNote: asset.note || "-",
          // assetPurchaseCost: asset.purchaseCost || "-",
          // assetAddOnCost: asset.addOnCost || "-",
          // assetSellingCost: asset.sellingCost || "-",
          // assetUnit: asset.unit || "-",
          // assetTotalPrice: asset.totalPrice || "-",
          // assetDate: asset.date || "",

          sparePartNumber: spare.partNumber || "-",
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
        });

        console.log(
          `Submitting row ${currentRow}:`,
          Object.fromEntries(formData.entries())
        );

        await fetch(GAS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData.toString(),
        });

        currentRow++;
      }

      if (maxLength === 0 && (consumables)) {
        const formData = new URLSearchParams({
          action: "addProductCategories",
          recordType: "general",
          rowIndex: currentRow.toString(),
          machines: machines || "-",
          immSeries: immSeries || "-",
          maSeries: maSeries || "-",
          juSeries: juSeries || "-",
          jeSeries: jeSeries || "-",
          veSeries: veSeries || "-",
          zeSeries: zeSeries || "-",
          haSeries: haSeries || "-",
          auxiliaries: Array.isArray(auxiliaries)
            ? auxiliaries.join(" / ")
            : auxiliaries || "",
          // assets: assets || "-",
          consumables: consumables || "-",
          // tools: tools || "-",
userName: user?.email || "",
        });

        console.log(
          `Submitting (consumables only) row ${currentRow}:`,
          Object.fromEntries(formData.entries())
        );

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
        message: "Succes",
        description: "Data Submitted Successfully",
      });
      form.resetFields();
      setSelectedCategory(null);
      setMachineDataSource([]);
      setAuxiliariesDataSource([]);
      // setAssetsDataSource([]);
      setDataSource([]);
    } catch (err) {
      // console.error("Submission failed:", err);
      // message.error("Something went wrong. Check console.");
      notification.error({
        message: "Error",
        description: "Submission failed:",
        err,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSparePartsAdd = async () => {
    const {
      partNumber,
      description,
      quantity,
      unit,
      purchaseCost,
      addOnCost,
      sellingCost,
      totalPrice,
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
      !inputRow.date
    ) {
      notification.error({
        message: "Error",
        description:
          "Please fill in Date, Part Number, Description, Quantity, Unit, Purchase Cost, Add On Cost and ensure Selling Cost & Total Price is calculated",
      });
      return;
    }

    const newData = {
      key: Date.now(),
      ...inputRow,
      stockInHand: inputRow.stockInHand || "0",
      stockUnit: inputRow.stockUnit || "",
    };

    setDataSource([...dataSource, newData]);
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
    });
    await fetchAllStock();
  };

  const handleSparePartsDelete = (key) => {
    setDataSource(dataSource.filter((item) => item.key !== key));
  };

  const sparePartsColumns = [
    {
      title: "Date",
      dataIndex: "date",
      width: 220,
      render: (_, record) =>
        record.isInput ? (
          <Tooltip>
            <DatePicker
              format="DD-MM-YYYY"
              style={{ width: "100%" }}
              value={
                inputRow.date && dayjs(inputRow.date, "DD-MM-YYYY").isValid()
                  ? dayjs.tz(inputRow.date, "DD-MM-YYYY", "Asia/Dubai")
                  : null
              }
              onChange={(dateObj) => {
                if (!dateObj) {
                  setInputRow({ ...inputRow, date: "" });
                  return;
                }
                const formatted = dayjs(dateObj)
                  .tz("Asia/Dubai")
                  .format("DD-MM-YYYY");
                setInputRow({ ...inputRow, date: formatted });
              }}
            />
          </Tooltip>
        ) : (
          <Tooltip title={record.date}>
            <span>{record.date || "-"}</span>
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
          </Tooltip>
        ) : (
          <Tooltip title={record.partNumber}>
            <span>{record.partNumber}</span>
          </Tooltip>
        ),
    },
    {
      title: "Description",
      dataIndex: "description",
      ellipsis: true,
      width: 500,
      render: (_, record) =>
        record.isInput ? (
          <Tooltip>
            <Input.TextArea
              // autoSize={{ minRows: 1, maxRows: 1 }}
              rows={1}
              placeholder="Enter description"
              value={inputRow.description}
              onChange={(e) =>
                setInputRow({ ...inputRow, description: e.target.value })
              }
            />
          </Tooltip>
        ) : (
          // <Tooltip title={record.description}>
          //   <span>{record.description}</span>
          // </Tooltip>
          <Tooltip
            title={record.description}
            styles={{
              root: {
                maxWidth: 1000,
                wordWrap: "break-word",
                whiteSpace: "normal",
              },
            }}
          >
            <span className="truncate-text">
              {record.description?.length > 150
                ? `${record.description.slice(0, 150)}...`
                : record.description}
            </span>
          </Tooltip>
        ),
    },
    // {
    //   title: "Purchase Cost In AED (per item)",
    //   dataIndex: "purchaseCost",
    //   ellipsis: true,
    //   width: 250,
    //   render: (_, record) =>
    //     record.isInput ? (
    //       <Tooltip>
    //         <Input
    //           placeholder="Enter purchase cost"
    //           type="number"
    //           min={0}
    //           value={inputRow.purchaseCost}
    //           onChange={(e) => {
    //             const purchaseCost = e.target.value;
    //             const { sellingPrice, totalPrice } = updateTotalPrice(
    //               purchaseCost,
    //               inputRow.addOnCost,
    //               inputRow.quantity
    //             );
    //             setInputRow((prev) => ({
    //               ...prev,
    //               purchaseCost,
    //               sellingCost: sellingPrice,
    //               totalPrice,
    //             }));
    //           }}
    //         />
    //       </Tooltip>
    //     ) : (
    //       <Tooltip title={record.purchaseCost}>
    //         <span>{record.purchaseCost || "-"}</span>
    //       </Tooltip>
    //     ),
    // },

    {
      title: "Purchase Cost In AED (per item)",
      dataIndex: "purchaseCost",
      ellipsis: true,
      width: 250,
      render: (_, record) =>
        record.isInput ? (
          <Tooltip>
            <Input
              placeholder="Enter purchase cost"
              type="number"
              min={0}
              value={inputRow.purchaseCost}
              onChange={(e) => {
                const value = e.target.value.trim();
                setInputRow((prev) => ({ ...prev, purchaseCost: value }));
                setSparePartsFetching(true);
                clearTimeout(window.purchaseCostDebounce);
                window.purchaseCostDebounce = setTimeout(() => {
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
                      message: "Invalid Purchase Cost",
                      description: "Purchase cost must be greater than 0.",
                    });
                    setInputRow((prev) => ({ ...prev, purchaseCost: "" }));
                  } else {
                    const { totalPrice } = updateTotalPrice(
                      value,
                      inputRow.addOnCost,
                      inputRow.quantity
                    );
                    setInputRow((prev) => ({ ...prev, totalPrice }));
                  }
                  setSparePartsFetching(false);
                }, 3000);
              }}
            />
          </Tooltip>
        ) : (
          <Tooltip title={record.purchaseCost}>
            <span>{record.purchaseCost || "-"}</span>
          </Tooltip>
        ),
    },

    // {
    //   title: "Add On Cost In AED",
    //   dataIndex: "addOnCost",
    //   ellipsis: true,
    //   width: 250,
    //   render: (_, record) =>
    //     record.isInput ? (
    //       <Tooltip>
    //         <Input
    //           type="number"
    //           min={0}
    //           placeholder="Enter add on cost"
    //           value={inputRow.addOnCost}
    //           onChange={(e) => {
    //             const addOnCost = e.target.value;
    //             const { sellingPrice, totalPrice } = updateTotalPrice(
    //               inputRow.purchaseCost,
    //               addOnCost,
    //               inputRow.quantity
    //             );
    //             setInputRow((prev) => ({
    //               ...prev,
    //               addOnCost,
    //               sellingCost: sellingPrice,
    //               totalPrice,
    //             }));
    //           }}
    //         />
    //       </Tooltip>
    //     ) : (
    //       <Tooltip title={record.addOnCost}>
    //         <span>{record.addOnCost}</span>
    //       </Tooltip>
    //     ),
    // },

    {
      title: "Add On Cost In AED",
      dataIndex: "addOnCost",
      ellipsis: true,
      width: 250,
      render: (_, record) =>
        record.isInput ? (
          <Tooltip>
            <Input
              type="number"
              min={0}
              placeholder="Enter add on cost"
              value={inputRow.addOnCost}
              onChange={(e) => {
                const value = e.target.value.trim();
                setInputRow((prev) => ({ ...prev, addOnCost: value }));
                setSparePartsFetching(true);

                clearTimeout(window.addOnCostDebounce);
                window.addOnCostDebounce = setTimeout(() => {
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
                      message: "Invalid Add On Cost",
                      description: "Add on cost must be greater than 0.",
                    });
                    setInputRow((prev) => ({ ...prev, addOnCost: "" }));
                  } else {
                    const { totalPrice } = updateTotalPrice(
                      inputRow.purchaseCost,
                      value,
                      inputRow.quantity
                    );
                    setInputRow((prev) => ({ ...prev, totalPrice }));
                  }
                  setSparePartsFetching(false);
                }, 3000);
              }}
            />
          </Tooltip>
        ) : (
          <Tooltip title={record.addOnCost}>
            <span>{record.addOnCost}</span>
          </Tooltip>
        ),
    },

    {
      title: "Selling Cost (AED)",
      dataIndex: "sellingCost",
      ellipsis: true,
      width: 250,
      render: (_, record, index) =>
        record.isInput ? (
          <Tooltip>
            <Input
              type="number"
              min={0}
              placeholder="Enter Selling Cost"
              value={inputRow.sellingCost || ""}
              onChange={(e) => {
                const value = e.target.value.trim();
                setInputRow((prev) => ({ ...prev, sellingCost: value }));

                clearTimeout(window.sellingCostDebounce);
                window.sellingCostDebounce = setTimeout(() => {
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
                      message: "Invalid Selling Cost",
                      description: "Selling cost must be greater than 0.",
                    });
                    setInputRow((prev) => ({ ...prev, sellingCost: "" }));
                  }
                }, 3000);
              }}
            />
          </Tooltip>
        ) : (
          <Tooltip title={record.sellingCost}>
            <span>{record.sellingCost}</span>
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
    //           placeholder="Enter quantity"
    //           type="number"
    //           min={1}
    //           value={inputRow.quantity}
    //           onChange={(e) => {
    //             const quantity = e.target.value;
    //             const { sellingPrice, totalPrice } = updateTotalPrice(
    //               inputRow.purchaseCost,
    //               inputRow.addOnCost,
    //               quantity
    //             );
    //             setInputRow((prev) => ({
    //               ...prev,
    //               quantity,
    //               sellingCost: sellingPrice, // still needed in case it's blank initially
    //               totalPrice,
    //             }));
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
              placeholder="Enter Quantity"
              type="number"
              // min={1}
              disabled={spareUnitLoading}
              value={inputRow.quantity}
              onChange={(e) => {
                const value = e.target.value.trim();
                setInputRow((prev) => ({ ...prev, quantity: value }));
                setSparePartsFetching(true);

                clearTimeout(window.quantityDebounce);
                window.quantityDebounce = setTimeout(() => {
                  const num = parseFloat(value);
                  // if (
                  //   value !== "" &&
                  //   (value === "0" ||
                  //     value === "0.0" ||
                  //     value === ".0" ||
                  //     isNaN(num) ||
                  //     num === 0)
                  // ) {
                  //   notification.error({
                  //     message: "Invalid Quantity",
                  //     description: "Quantity must be greater than 0.",
                  //   });
                  //   setInputRow((prev) => ({ ...prev, quantity: "" }));
                  // } else {
                  //   const { totalPrice } = updateTotalPrice(
                  //     inputRow.purchaseCost,
                  //     inputRow.addOnCost,
                  //     value
                  //   );
                  //   setInputRow((prev) => ({ ...prev, totalPrice }));
                  // }

                  // Basic invalid checks
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
                    setSparePartsFetching(false);

                    return;
                  }

                  // Extra check for Set / Piece units - must be whole number
                  const unit = (inputRow.unit || "").toLowerCase();
                  if (
                    (unit === "set" || unit === "piece") &&
                    !Number.isInteger(num)
                  ) {
                    notification.error({
                      message: "Invalid Quantity",
                      description: `Quantity for unit "${inputRow.unit}" must be a whole number.`,
                    });
                    setInputRow((prev) => ({
                      ...prev,
                      quantity: "",
                      unit: "",
                    }));
                    setSparePartsFetching(false);

                    return;
                  }

                  // Update total price if all checks pass
                  const { totalPrice } = updateTotalPrice(
                    inputRow.purchaseCost,
                    inputRow.addOnCost,
                    value
                  );
                  setInputRow((prev) => ({ ...prev, totalPrice }));
                  setSparePartsFetching(false);
                }, 3000);
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
    //   width: 250,
    //   ellipsis: true,
    //   render: (_, record) =>
    //     record.isInput ? (
    //       <Select
    //         className="w-100"
    //         value={inputRow.unit}
    //         onChange={(value) => {

    //             const unit = (inputRow.unit || "").toLowerCase();
    //             const num = inputRow.quantity
    //           if ((unit === "set" || unit === "piece") && !Number.isInteger(num)) {
    //             notification.error({
    //               message: "Invalid Quantity",
    //               description: `Quantity for unit "${inputRow.unit}" must be a whole number.`,
    //             });
    //             setInputRow((prev) => ({ ...prev, unit:"" }));
    //             return;
    //           }
    //           setInputRow((prev) => ({ ...prev, unit: value }))}
    //         }
    //         options={spareUnitOptions.map((u) => ({ value: u, label: u }))}
    //         loading={spareUnitLoading}
    //         placeholder={spareUnitLoading ? "Fetching unit..." : "Select Unit"}
    //         notFoundContent={
    //           spareUnitLoading ? "Fetching unit..." : "No units found"
    //         }
    //         // disabled={inputRow.sparePartsUnitFetched && userRole !== "Admin"}
    //       />
    //     ) : (
    //       record.unit || ""
    //     ),
    // },
    {
      title: "Unit",
      dataIndex: "unit",
      width: 250,
      ellipsis: true,
      render: (_, record) =>
        record.isInput ? (
          <Select
            className="w-100"
            value={inputRow.unit}
            onChange={(selectedUnit) => {
              clearTimeout(window.unitDebounce);
              window.unitDebounce = setTimeout(() => {
                const unitLower = (selectedUnit || "").toLowerCase();
                const num = parseFloat(inputRow.quantity);

                // Check if quantity must be whole number
                if (
                  (unitLower === "set" || unitLower === "piece") &&
                  !Number.isInteger(num)
                ) {
                  notification.error({
                    message: "Invalid Quantity",
                    description: `Quantity for unit "${selectedUnit}" must be a whole number and should not be empty.`,
                  });
                  setInputRow((prev) => ({ ...prev, unit: "", quantity: "" }));
                  return;
                }

                // If valid, update the unit
                setInputRow((prev) => ({ ...prev, unit: selectedUnit }));
              }, 300);
            }}
            options={spareUnitOptions.map((u) => ({ value: u, label: u }))}
            loading={spareUnitLoading}
            placeholder={spareUnitLoading ? "Fetching unit..." : "Select Unit"}
            notFoundContent={
              spareUnitLoading ? "Fetching unit..." : "No units found"
            }
          />
        ) : (
          record.unit || ""
        ),
    },

    {
      title: "Stock In Hand",
      dataIndex: "stockInHand",
      width: 200,
      render: (_, record) =>
        record.isInput ? (
          <Tooltip>
            <Input
              readOnly
              value={
                inputRow.stockInHand
                  ? `${inputRow.stockInHand} ${inputRow.stockUnit || ""}`
                  : ""
              }
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
      title: "Total Price In AED",
      dataIndex: "totalPrice",
      width: 200,
      ellipsis: true,
      render: (_, record) =>
        record.isInput ? (
          <Tooltip>
            <Input value={inputRow.totalPrice || ""} readOnly />{" "}
          </Tooltip>
        ) : (
          <Tooltip title={record.totalPrice}>
            <span>{record.totalPrice || "-"}</span>
          </Tooltip>
        ),
    },
    {
      title: "Note",
      dataIndex: "note",
      ellipsis: true,
      width: 300,
      render: (_, record) =>
        record.isInput ? (
          <Tooltip>
            <Input.TextArea
              // autoSize={{ minRows: 1, maxRows: 1 }}
              rows={1}
              placeholder="Enter note"
              value={inputRow.note}
              onChange={(e) =>
                setInputRow({ ...inputRow, note: e.target.value })
              }
            />
          </Tooltip>
        ) : (
          // <Tooltip title={record.note}>
          //   <span>{record.note}</span>
          // </Tooltip>
          <Tooltip
            title={record.note}
            styles={{
              root: {
                maxWidth: 1000,
                wordWrap: "break-word",
                whiteSpace: "normal",
              },
            }}
          >
            {/* <span> {record.note}</span> */}
            <span className="truncate-text">
              {record.note?.length > 150
                ? `${record.note.slice(0, 150)}...`
                : record.note}
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
            onClick={handleSparePartsAdd}
            disabled={sparePartsFetching}
            loading={sparePartsFetching}
          >
            {sparePartsFetching ? "Loading" : "Add"}
          </Button>
        ) : (
          <Button
            className="deleteButton ps-3 pe-3"
            onClick={() => handleSparePartsDelete(record.key)}
          >
            Delete
          </Button>
        ),
    },
  ];

  const displayData = [{ key: "input", isInput: true }, ...dataSource];

  const displayAuxiliariesData = [
    { key: "input", isInput: true },
    ...auxiliariesDataSource,
  ];

  const handleAuxiliariesAdd = async () => {
    const {
      partNumber,
      description,
      quantity,
      unit,
      purchaseCost,
      addOnCost,
      sellingCost,
      totalPrice,
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
      !auxiliariesInputRow.date
    ) {
      notification.error({
        message: "Error",
        description:
          "Please fill in Date, Part Number, Description, Quantity, Unit, Purchase Cost, Add On Cost and ensure Selling Cost & Total Price is calculated",
      });
      return;
    }

    const newData = {
      key: Date.now(),
      ...auxiliariesInputRow,
      stockInHand: auxiliariesInputRow.stockInHand || "0",
    };

    setAuxiliariesDataSource([...auxiliariesDataSource, newData]);
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
    });
    await fetchAllStock();
  };

  const handleAuxiliariesDelete = (key) => {
    setAuxiliariesDataSource(
      auxiliariesDataSource.filter((item) => item.key !== key)
    );
  };

  const auxiliariesColumns = [
    {
      title: "Date",
      dataIndex: "date",
      width: 220,
      render: (_, record) =>
        record.isInput ? (
          <Tooltip>
            <DatePicker
              format="DD-MM-YYYY"
              style={{ width: "100%" }}
              value={
                auxiliariesInputRow.date &&
                dayjs(auxiliariesInputRow.date, "DD-MM-YYYY").isValid()
                  ? dayjs.tz(
                      auxiliariesInputRow.date,
                      "DD-MM-YYYY",
                      "Asia/Dubai"
                    )
                  : null
              }
              onChange={(dateObj) => {
                if (!dateObj) {
                  setAuxiliariesInputRow({ ...auxiliariesInputRow, date: "" });
                  return;
                }
                const formatted = dayjs(dateObj)
                  .tz("Asia/Dubai")
                  .format("DD-MM-YYYY");
                setAuxiliariesInputRow({
                  ...auxiliariesInputRow,
                  date: formatted,
                });
              }}
            />
          </Tooltip>
        ) : (
          <Tooltip title={record.date}>
            <span>{record.date || "-"}</span>
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
          </Tooltip>
        ) : (
          <Tooltip title={record.partNumber}>
            <span>{record.partNumber}</span>
          </Tooltip>
        ),
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 500,
      ellipsis: true,
      render: (_, record) =>
        record.isInput ? (
          <Tooltip>
            <Input.TextArea
              // autoSize={{ minRows: 1, maxRows: 1 }}
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
          </Tooltip>
        ) : (
          <Tooltip
            title={record.description}
            styles={{
              root: {
                maxWidth: 1000,
                wordWrap: "break-word",
                whiteSpace: "normal",
              },
            }}
          >
            {/* <span>{record.description}</span> */}

            <span className="truncate-text">
              {record.description?.length > 150
                ? `${record.description.slice(0, 150)}...`
                : record.description}
            </span>
          </Tooltip>
        ),
    },

    // {
    //   title: "Purchase Cost In AED (per item)",
    //   dataIndex: "purchaseCost",
    //   ellipsis: true,
    //   width: 250,
    //   render: (_, record) =>
    //     record.isInput ? (
    //       <Tooltip>
    //         <Input
    //           placeholder="Enter purchase cost"
    //           type="number"
    //           min={0}
    //           value={auxiliariesInputRow.purchaseCost}
    //           onChange={(e) => {
    //             const purchaseCost = e.target.value;
    //             const { sellingPrice, totalPrice } = updateTotalPrice(
    //               purchaseCost,
    //               auxiliariesInputRow.addOnCost,
    //               auxiliariesInputRow.quantity
    //             );
    //             setAuxiliariesInputRow((prev) => ({
    //               ...prev,
    //               purchaseCost,
    //               sellingCost: sellingPrice,
    //               totalPrice,
    //             }));
    //           }}
    //         />
    //       </Tooltip>
    //     ) : (
    //       <Tooltip title={record.purchaseCost}>
    //         <span>{record.purchaseCost || "-"}</span>
    //       </Tooltip>
    //     ),
    // },

    {
      title: "Purchase Cost In AED (per item)",
      dataIndex: "purchaseCost",
      ellipsis: true,
      width: 250,
      render: (_, record) =>
        record.isInput ? (
          <Tooltip>
            <Input
              placeholder="Enter purchase cost"
              type="number"
              min={0}
              value={auxiliariesInputRow.purchaseCost}
              onChange={(e) => {
                const value = e.target.value.trim();
                // update immediately so user sees what they type
                setAuxiliariesInputRow((prev) => ({
                  ...prev,
                  purchaseCost: value,
                }));
                setAuxiliariesFetching(true);

                // debounce validation
                clearTimeout(window.auxPurchaseCostDebounce);
                window.auxPurchaseCostDebounce = setTimeout(() => {
                  const num = parseFloat(value);

                  // if field non-empty and invalid zero-like or NaN -> show error
                  if (
                    value !== "" &&
                    (value === "0" ||
                      value === "0.0" ||
                      value === ".0" ||
                      isNaN(num) ||
                      num <= 0)
                  ) {
                    notification.error({
                      message: "Invalid Purchase Cost",
                      description: "Purchase cost must be greater than 0.",
                    });
                    // you can either clear the invalid value or leave it; here we clear it
                    setAuxiliariesInputRow((prev) => ({
                      ...prev,
                      purchaseCost: "",
                    }));
                    setAuxiliariesFetching(false);

                    return;
                  }

                  // valid -> recalc total
                  const { totalPrice } = updateTotalPrice(
                    value,
                    auxiliariesInputRow.addOnCost,
                    auxiliariesInputRow.quantity
                  );
                  setAuxiliariesInputRow((prev) => ({ ...prev, totalPrice }));
                  setAuxiliariesFetching(false);
                }, 3000);
              }}
            />
          </Tooltip>
        ) : (
          <Tooltip title={record.purchaseCost}>
            <span>{record.purchaseCost || "-"}</span>
          </Tooltip>
        ),
    },

    // {
    //   title: "Add On Cost In AED",
    //   dataIndex: "addOnCost",
    //   ellipsis: true,
    //   width: 250,
    //   render: (_, record) =>
    //     record.isInput ? (
    //       <Tooltip>
    //         <Input
    //           type="number"
    //           min={0}
    //           placeholder="Enter add on cost"
    //           value={auxiliariesInputRow.addOnCost}
    //           onChange={(e) => {
    //             const addOnCost = e.target.value;
    //             const { sellingPrice, totalPrice } = updateTotalPrice(
    //               auxiliariesInputRow.purchaseCost,
    //               addOnCost,
    //               auxiliariesInputRow.quantity
    //             );
    //             setAuxiliariesInputRow((prev) => ({
    //               ...prev,
    //               addOnCost,
    //               sellingCost: sellingPrice,
    //               totalPrice,
    //             }));
    //           }}
    //         />
    //       </Tooltip>
    //     ) : (
    //       <Tooltip title={record.addOnCost}>
    //         <span>{record.addOnCost}</span>
    //       </Tooltip>
    //     ),
    // },

    {
      title: "Add On Cost In AED",
      dataIndex: "addOnCost",
      ellipsis: true,
      width: 250,
      render: (_, record) =>
        record.isInput ? (
          <Tooltip>
            <Input
              type="number"
              min={0}
              placeholder="Enter add on cost"
              value={auxiliariesInputRow.addOnCost}
              onChange={(e) => {
                const value = e.target.value.trim();
                setAuxiliariesInputRow((prev) => ({
                  ...prev,
                  addOnCost: value,
                }));
                setAuxiliariesFetching(true);

                clearTimeout(window.auxAddOnCostDebounce);
                window.auxAddOnCostDebounce = setTimeout(() => {
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
                      message: "Invalid Add On Cost",
                      description: "Add on cost must be greater than 0.",
                    });
                    setAuxiliariesInputRow((prev) => ({
                      ...prev,
                      addOnCost: "",
                    }));
                    setAuxiliariesFetching(false);

                    return;
                  }

                  const { totalPrice } = updateTotalPrice(
                    auxiliariesInputRow.purchaseCost,
                    value,
                    auxiliariesInputRow.quantity
                  );
                  setAuxiliariesInputRow((prev) => ({ ...prev, totalPrice }));
                  setAuxiliariesFetching(false);
                }, 3000);
              }}
            />
          </Tooltip>
        ) : (
          <Tooltip title={record.addOnCost}>
            <span>{record.addOnCost}</span>
          </Tooltip>
        ),
    },

    {
      title: "Selling Cost (AED)",
      dataIndex: "sellingCost",
      ellipsis: true,
      width: 250,
      render: (_, record) =>
        record.isInput ? (
          <Tooltip>
            <Input
              type="number"
              min={0}
              placeholder="Enter Selling Cost"
              value={auxiliariesInputRow.sellingCost || ""}
              onChange={(e) => {
                const value = e.target.value.trim();
                setAuxiliariesInputRow((prev) => ({
                  ...prev,
                  sellingCost: value,
                }));

                clearTimeout(window.auxSellingCostDebounce);
                window.auxSellingCostDebounce = setTimeout(() => {
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
                      message: "Invalid Selling Cost",
                      description: "Selling cost must be greater than 0.",
                    });
                    setAuxiliariesInputRow((prev) => ({
                      ...prev,
                      sellingCost: "",
                    }));
                    return;
                  }
                  // no total recalculation needed here unless you want to sync totalPrice
                }, 3000);
              }}
            />
          </Tooltip>
        ) : (
          <Tooltip title={record.sellingCost}>
            <span>{record.sellingCost}</span>
          </Tooltip>
        ),
    },

    // {
    //   title: "Quantity",
    //   dataIndex: "quantity",
    //   width: 200,
    //   ellipsis: true,
    //   render: (_, record) =>
    //     record.isInput ? (
    //       <Tooltip>
    //         <Input
    //           placeholder="Quantity"
    //           type="number"
    //           min={1}
    //           value={auxiliariesInputRow.quantity}
    //           onChange={(e) => {
    //             const value = e.target.value.trim();
    //             setAuxiliariesInputRow((prev) => ({
    //               ...prev,
    //               quantity: value,
    //             }));

    //             clearTimeout(window.auxQuantityDebounce);
    //             window.auxQuantityDebounce = setTimeout(() => {
    //               const num = parseFloat(value);
    //               if (
    //                 value !== "" &&
    //                 (value === "0" ||
    //                   value === "0.0" ||
    //                   value === ".0" ||
    //                   isNaN(num) ||
    //                   num === 0)
    //               ) {
    //                 notification.error({
    //                   message: "Invalid Quantity",
    //                   description: "Quantity must be greater than 0.",
    //                 });
    //                 setAuxiliariesInputRow((prev) => ({
    //                   ...prev,
    //                   quantity: "",
    //                 }));
    //                 return;
    //               }

    //               const { totalPrice } = updateTotalPrice(
    //                 auxiliariesInputRow.purchaseCost,
    //                 auxiliariesInputRow.addOnCost,
    //                 value
    //               );
    //               setAuxiliariesInputRow((prev) => ({ ...prev, totalPrice }));
    //             }, 3000);
    //           }}
    //         />
    //       </Tooltip>
    //     ) : (
    //       <Tooltip title={record.quantity}>
    //         <span>{record.quantity}</span>
    //       </Tooltip>
    //     ),
    // },

    // {
    //   title: "Unit",
    //   dataIndex: "unit",
    //   width: 250,
    //   ellipsis: true,
    //   render: (_, record) =>
    //     record.isInput ? (
    //       <Select
    //         className="w-100"
    //         value={auxiliariesInputRow.unit}
    //         onChange={(value) =>
    //           setAuxiliariesInputRow((prev) => ({ ...prev, unit: value }))
    //         }
    //         options={auxiliariesUnitOptions.map((u) => ({ value: u, label: u }))}
    //         loading={auxiliariesUnitLoading}
    //         placeholder={auxiliariesUnitLoading ? "Fetching unit..." : "Select Unit"}
    //         notFoundContent={
    //           auxiliariesUnitLoading ? "Fetching unit..." : "No units found"
    //         }
    //         // disabled={inputRow.sparePartsUnitFetched && userRole !== "Admin"}
    //       />
    //     ) : (
    //       record.unit || ""
    //     ),
    // },

    {
      title: "Quantity",
      dataIndex: "quantity",
      width: 200,
      ellipsis: true,
      render: (_, record) =>
        record.isInput ? (
          <Tooltip>
            <Input
              placeholder="Enter Quantity"
              type="number"
              // min={1}
              disabled={auxiliariesUnitLoading}
              value={auxiliariesInputRow.quantity}
              onChange={(e) => {
                const value = e.target.value.trim();
                setAuxiliariesInputRow((prev) => ({
                  ...prev,
                  quantity: value,
                }));
                setAuxiliariesFetching(true);

                clearTimeout(window.auxQuantityDebounce);
                window.auxQuantityDebounce = setTimeout(() => {
                  const num = parseFloat(value);

                  // Basic >0 check
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
                    setAuxiliariesInputRow((prev) => ({
                      ...prev,
                      quantity: "",
                    }));
                    setAuxiliariesFetching(false);

                    return;
                  }

                  // Whole number check for Set/Piece
                  const unit = (auxiliariesInputRow.unit || "").toLowerCase();
                  if (
                    (unit === "set" || unit === "piece") &&
                    !Number.isInteger(num)
                  ) {
                    notification.error({
                      message: "Invalid Quantity",
                      description: `Quantity for unit "${auxiliariesInputRow.unit}" must be a whole number.`,
                    });
                    setAuxiliariesInputRow((prev) => ({
                      ...prev,
                      quantity: "",
                      unit: "",
                    }));
                    setAuxiliariesFetching(false);

                    return;
                  }

                  // Update total price
                  const { totalPrice } = updateTotalPrice(
                    auxiliariesInputRow.purchaseCost,
                    auxiliariesInputRow.addOnCost,
                    value
                  );
                  setAuxiliariesInputRow((prev) => ({ ...prev, totalPrice }));
                  setAuxiliariesFetching(false);
                }, 3000);
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
      width: 250,
      ellipsis: true,
      render: (_, record) =>
        record.isInput ? (
          <Select
            className="w-100"
            value={auxiliariesInputRow.unit}
            onChange={(selectedUnit) => {
              clearTimeout(window.auxUnitDebounce);
              window.auxUnitDebounce = setTimeout(() => {
                const unitLower = (selectedUnit || "").toLowerCase();
                const num = parseFloat(auxiliariesInputRow.quantity);

                // Whole number check for Set/Piece
                if (
                  (unitLower === "set" || unitLower === "piece") &&
                  !Number.isInteger(num)
                ) {
                  notification.error({
                    message: "Invalid Quantity",
                    description: `Quantity for unit "${selectedUnit}" must be a whole number and should not be empty.`,
                  });
                  setAuxiliariesInputRow((prev) => ({
                    ...prev,
                    unit: "",
                    quantity: "",
                  }));
                  return;
                }

                // If valid, update unit
                setAuxiliariesInputRow((prev) => ({
                  ...prev,
                  unit: selectedUnit,
                }));
              }, 300);
            }}
            options={auxiliariesUnitOptions.map((u) => ({
              value: u,
              label: u,
            }))}
            loading={auxiliariesUnitLoading}
            placeholder={
              auxiliariesUnitLoading ? "Fetching unit..." : "Select Unit"
            }
            notFoundContent={
              auxiliariesUnitLoading ? "Fetching unit..." : "No units found"
            }
          />
        ) : (
          record.unit || ""
        ),
    },

    {
      title: "Stock In Hand",
      dataIndex: "stockInHand",
      width: 200,
      render: (_, record) =>
        record.isInput ? (
          <Tooltip>
            <Input
              readOnly
              value={
                auxiliariesInputRow.stockInHand
                  ? `${auxiliariesInputRow.stockInHand} ${
                      auxiliariesInputRow.stockUnit || ""
                    }`
                  : ""
              }
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
      title: "Total Price In AED",
      dataIndex: "totalPrice",
      width: 200,
      ellipsis: true,
      render: (_, record) =>
        record.isInput ? (
          <Tooltip>
            <Input value={auxiliariesInputRow.totalPrice || ""} readOnly />
          </Tooltip>
        ) : (
          <Tooltip title={record.totalPrice}>
            <span>{record.totalPrice || "-"}</span>
          </Tooltip>
        ),
    },
    {
      title: "Note",
      dataIndex: "note",
      width: 500,
      ellipsis: true,
      render: (_, record) =>
        record.isInput ? (
          <Tooltip>
            <Input.TextArea
              // autoSize={{ minRows: 1, maxRows: 1 }}
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
          </Tooltip>
        ) : (
          // <Tooltip title={record.note}>
          //   <span>{record.note}</span>
          // </Tooltip>
          <Tooltip
            title={record.note}
            styles={{
              root: {
                maxWidth: 1000,
                wordWrap: "break-word",
                whiteSpace: "normal",
              },
            }}
          >
            {/* <span> {record.note}</span> */}
            <span className="truncate-text">
              {record.note?.length > 150
                ? `${record.note.slice(0, 150)}...`
                : record.note}
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
            className="addButton ps-4 pe-4 m-auto"
            onClick={handleAuxiliariesAdd}
            disabled={auxiliariesFetching}
            loading={auxiliariesFetching}
          >
            {auxiliariesFetching ? "Loading" : "Add"}
          </Button>
        ) : (
          <Button
            className="deleteButton ps-3 pe-3"
            onClick={() => handleAuxiliariesDelete(record.key)}
          >
            Delete
          </Button>
        ),
    },
  ];

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
    const {
      partNumber,
      description,
      quantity,
      unit,
      purchaseCost,
      addOnCost,
      sellingCost,
      totalPrice,
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
      !machineinputRow.date
    ) {
      notification.error({
        message: "Error",
        description:
          "Please fill in Date, Part Number, Description, Quantity, Unit, Purchase Cost, Add On Cost and ensure Selling Cost & Total Price is calculated",
      });
      return;
    }

    const newData = {
      key: Date.now(),
      ...machineinputRow,
      stockInHand: machineinputRow.stockInHand || "0",
    };
    setMachineDataSource([...machineDataSource, newData]);
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
    });
    await fetchAllStock();
  };

  const handleMachineDelete = (key) => {
    setMachineDataSource(machineDataSource.filter((item) => item.key !== key));
  };

  const machineColumns = [
    {
      title: "Date",
      dataIndex: "date",
      width: 220,
      render: (_, record) =>
        record.isInput ? (
          <Tooltip>
            <DatePicker
              format="DD-MM-YYYY"
              style={{ width: "100%" }}
              value={
                machineinputRow.date &&
                dayjs(machineinputRow.date, "DD-MM-YYYY").isValid()
                  ? dayjs.tz(machineinputRow.date, "DD-MM-YYYY", "Asia/Dubai")
                  : null
              }
              onChange={(dateObj) => {
                if (!dateObj) {
                  setMachineInputRow({ ...machineinputRow, date: "" });
                  return;
                }
                const formatted = dayjs(dateObj)
                  .tz("Asia/Dubai")
                  .format("DD-MM-YYYY");
                setMachineInputRow({ ...machineinputRow, date: formatted });
              }}
            />
          </Tooltip>
        ) : (
          <Tooltip title={record.date}>
            <span>{record.date || "-"}</span>
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
            <Input
              placeholder="Enter part number"
              value={machineinputRow.partNumber}
              onChange={(e) =>
                setMachineInputRow({
                  ...machineinputRow,
                  partNumber: e.target.value.toUpperCase(),
                  quantity: "",
                })
              }
            />
          </Tooltip>
        ) : (
          <Tooltip title={record.partNumber}>
            <span>{record.partNumber}</span>
          </Tooltip>
        ),
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 500,
      ellipsis: true,
      render: (_, record) =>
        record.isInput ? (
          <Tooltip>
            <Input.TextArea
              // autoSize={{ minRows: 2, maxRows: 2 }}
              rows={1}
              placeholder="Enter description"
              value={machineinputRow.description}
              onChange={(e) =>
                setMachineInputRow({
                  ...machineinputRow,
                  description: e.target.value,
                })
              }
            />
          </Tooltip>
        ) : (
          <Tooltip
            title={record.description}
            styles={{
              root: {
                maxWidth: 1000,
                wordWrap: "break-word",
                whiteSpace: "normal",
              },
            }}
          >
            <span className="truncate-text">
              {record.description?.length > 150
                ? `${record.description.slice(0, 150)}...`
                : record.description}
            </span>
          </Tooltip>
        ),
    },

    // {
    //   title: "Purchase Cost(per item)",
    //   dataIndex: "purchaseCost",
    //   ellipsis: true,
    //   width: 250,
    //   render: (_, record) =>
    //     record.isInput ? (
    //       <Tooltip>
    //         <Input
    //           placeholder="Enter purchase cost"
    //           type="number"
    //           min={0}
    //           value={machineinputRow.purchaseCost}
    //           onChange={(e) => {
    //             const purchaseCost = e.target.value;
    //             const { sellingPrice, totalPrice } = updateTotalPrice(
    //               purchaseCost,
    //               machineinputRow.addOnCost,
    //               machineinputRow.quantity
    //             );
    //             setMachineInputRow((prev) => ({
    //               ...prev,
    //               purchaseCost,
    //               sellingCost: sellingPrice,
    //               totalPrice,
    //             }));
    //           }}
    //         />
    //       </Tooltip>
    //     ) : (
    //       <Tooltip title={record.purchaseCost}>
    //         <span>{record.purchaseCost || "-"}</span>
    //       </Tooltip>
    //     ),
    // },

    {
      title: "Purchase Cost(per item)",
      dataIndex: "purchaseCost",
      ellipsis: true,
      width: 250,
      render: (_, record) =>
        record.isInput ? (
          <Tooltip>
            <Input
              placeholder="Enter purchase cost"
              type="number"
              min={0}
              value={machineinputRow.purchaseCost}
              onChange={(e) => {
                const value = e.target.value.trim();

                setMachineInputRow((prev) => ({
                  ...prev,
                  purchaseCost: value,
                }));
                setMachineFetching(true);

                clearTimeout(window.machinePurchaseDebounce);
                window.machinePurchaseDebounce = setTimeout(() => {
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
                      message: "Invalid Purchase Cost",
                      description: "Purchase cost must be greater than 0.",
                    });
                    setMachineInputRow((prev) => ({
                      ...prev,
                      purchaseCost: "",
                    }));
                  } else {
                    const { totalPrice } = updateTotalPrice(
                      value,
                      machineinputRow.addOnCost,
                      machineinputRow.quantity
                    );
                    setMachineInputRow((prev) => ({
                      ...prev,
                      totalPrice,
                    }));
                  }
                  setMachineFetching(false);
                }, 3000);
              }}
            />
          </Tooltip>
        ) : (
          <Tooltip title={record.purchaseCost}>
            <span>{record.purchaseCost || "-"}</span>
          </Tooltip>
        ),
    },

    // {
    //   title: "Add On Cost",
    //   dataIndex: "addOnCost",
    //   ellipsis: true,
    //   width: 250,
    //   render: (_, record) =>
    //     record.isInput ? (
    //       <Tooltip>
    //         <Input
    //           type="number"
    //           min={0}
    //           placeholder="Enter add on cost"
    //           value={machineinputRow.addOnCost}
    //           onChange={(e) => {
    //             const addOnCost = e.target.value;
    //             const { sellingPrice, totalPrice } = updateTotalPrice(
    //               machineinputRow.purchaseCost,
    //               addOnCost,
    //               machineinputRow.quantity
    //             );
    //             setMachineInputRow((prev) => ({
    //               ...prev,
    //               addOnCost,
    //               sellingCost: sellingPrice,
    //               totalPrice,
    //             }));
    //           }}
    //         />
    //       </Tooltip>
    //     ) : (
    //       <Tooltip title={record.addOnCost}>
    //         <span>{record.addOnCost}</span>
    //       </Tooltip>
    //     ),
    // },
    {
      title: "Add On Cost",
      dataIndex: "addOnCost",
      ellipsis: true,
      width: 250,
      render: (_, record) =>
        record.isInput ? (
          <Tooltip>
            <Input
              type="number"
              // min={0}
              placeholder="Enter add on cost"
              value={machineinputRow.addOnCost}
              onChange={(e) => {
                const value = e.target.value.trim();

                setMachineInputRow((prev) => ({
                  ...prev,
                  addOnCost: value,
                }));
                setMachineFetching(true);

                clearTimeout(window.machineAddOnDebounce);
                window.machineAddOnDebounce = setTimeout(() => {
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
                      message: "Invalid Add On Cost",
                      description: "Add on cost must be greater than 0.",
                    });
                    setMachineInputRow((prev) => ({
                      ...prev,
                      addOnCost: "",
                    }));
                  } else {
                    const { totalPrice } = updateTotalPrice(
                      machineinputRow.purchaseCost,
                      value,
                      machineinputRow.quantity
                    );
                    setMachineInputRow((prev) => ({
                      ...prev,
                      totalPrice,
                    }));
                  }
                  setMachineFetching(false);
                }, 3000);
              }}
            />
          </Tooltip>
        ) : (
          <Tooltip title={record.addOnCost}>
            <span>{record.addOnCost}</span>
          </Tooltip>
        ),
    },

    // {
    //   title: "Selling Cost (AED)",
    //   dataIndex: "sellingCost",
    //   ellipsis: true,
    //   width: 250,
    //   render: (_, record, index) =>
    //     record.isInput ? (
    //       <Tooltip title="Enter Selling Cost">
    //         <Input
    //           type="number"
    //           min={0}
    //           placeholder="Enter Selling Cost"
    //           value={machineinputRow.sellingCost || ""}
    //           onChange={(e) => {
    //             const value = e.target.value.trim();
    //             const num = parseFloat(value);

    //             // Reject values: "0", "0.0", ".0", 0
    //             if (
    //               value === "0" ||
    //               value === "0.0" ||
    //               value === ".0" ||
    //               isNaN(num) ||
    //               num === 0
    //             ) {
    //               notification.error({
    //                 message: "Invalid Selling Cost",
    //                 description: "Selling cost must be greater than 0.",
    //               });
    //               return;
    //             }

    //             setMachineInputRow((prev) => ({
    //               ...prev,
    //               sellingCost: value,
    //             }));
    //           }}
    //         />
    //       </Tooltip>
    //     ) : (
    //       <Tooltip title={record.sellingCost}>
    //         <span>{record.sellingCost}</span>
    //       </Tooltip>
    //     ),
    // },

    {
      title: "Selling Cost (AED)",
      dataIndex: "sellingCost",
      ellipsis: true,
      width: 250,
      render: (_, record) =>
        record.isInput ? (
          <Tooltip>
            <Input
              type="number"
              // min={0}
              placeholder="Enter Selling Cost"
              value={machineinputRow.sellingCost || ""}
              onChange={(e) => {
                const value = e.target.value.trim();

                setMachineInputRow((prev) => ({
                  ...prev,
                  sellingCost: value,
                }));

                clearTimeout(window.machineSellingDebounce);
                window.machineSellingDebounce = setTimeout(() => {
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
                      message: "Invalid Selling Cost",
                      description: "Selling cost must be greater than 0.",
                    });
                    setMachineInputRow((prev) => ({
                      ...prev,
                      sellingCost: "",
                    }));
                  }
                }, 3000);
              }}
            />
          </Tooltip>
        ) : (
          <Tooltip title={record.sellingCost}>
            <span>{record.sellingCost}</span>
          </Tooltip>
        ),
    },

    // {
    //   title: "Quantity",
    //   dataIndex: "quantity",
    //   width: 200,
    //   ellipsis: true,
    //   render: (_, record) =>
    //     record.isInput ? (
    //       <Tooltip>
    //         <Input
    //           placeholder="Enter quantity"
    //           type="number"
    //           min={1}
    //           value={machineinputRow.quantity}
    //           onChange={(e) => {
    //             const quantity = e.target.value;
    //             const { sellingPrice, totalPrice } = updateTotalPrice(
    //               machineinputRow.purchaseCost,
    //               machineinputRow.addOnCost,
    //               quantity
    //             );
    //             setMachineInputRow((prev) => ({
    //               ...prev,
    //               quantity,
    //               sellingCost: sellingPrice, // still needed in case it's blank initially
    //               totalPrice,
    //             }));
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
      width: 200,
      ellipsis: true,
      render: (_, record) =>
        record.isInput ? (
          <Tooltip>
            <Input
              placeholder="Enter Quantity"
              type="number"
              // min={1}
              value={machineinputRow.quantity}
              disabled={machineUnitLoading}
              onChange={(e) => {
                const value = e.target.value.trim();

                setMachineInputRow((prev) => ({
                  ...prev,
                  quantity: value,
                }));
                setMachineFetching(true);

                clearTimeout(window.machineQuantityDebounce);
                window.machineQuantityDebounce = setTimeout(() => {
                  const num = parseFloat(value);
                  // if (
                  //   value !== "" &&
                  //   (value === "0" ||
                  //     value === "0.0" ||
                  //     value === ".0" ||
                  //     isNaN(num) ||
                  //     num === 0)
                  // ) {
                  //   notification.error({
                  //     message: "Invalid Quantity",
                  //     description: "Quantity must be greater than 0.",
                  //   });
                  //   setMachineInputRow((prev) => ({
                  //     ...prev,
                  //     quantity: "",
                  //   }));
                  // } else {
                  //   const { totalPrice } = updateTotalPrice(
                  //     machineinputRow.purchaseCost,
                  //     machineinputRow.addOnCost,
                  //     value
                  //   );
                  //   setMachineInputRow((prev) => ({
                  //     ...prev,
                  //     totalPrice,
                  //   }));
                  // }

                  // Basic invalid checks
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
                    setMachineInputRow((prev) => ({ ...prev, quantity: "" }));
                    setMachineFetching(false);

                    return;
                  }

                  // Extra check for Set / Piece units
                  const unit = (machineinputRow.unit || "").toLowerCase();
                  if (
                    (unit === "set" || unit === "piece") &&
                    !Number.isInteger(num)
                  ) {
                    notification.error({
                      message: "Invalid Quantity",
                      description: `Quantity for unit "${machineinputRow.unit}" must be a whole number.`,
                    });
                    setMachineInputRow((prev) => ({
                      ...prev,
                      quantity: "",
                      unit: "",
                    }));
                    setMachineFetching(false);
                    return;
                  }

                  // Update total price if all checks pass
                  const { totalPrice } = updateTotalPrice(
                    machineinputRow.purchaseCost,
                    machineinputRow.addOnCost,
                    value
                  );
                  setMachineInputRow((prev) => ({ ...prev, totalPrice }));
                  setMachineFetching(false);
                }, 3000);
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
    //   width: 250,
    //   ellipsis: true,
    //   render: (_, record) =>
    //     record.isInput ? (
    //       <Tooltip title="">
    //         <Select
    //           placeholder="Select unit"
    //           className="w-100"
    //           value={machineinputRow.unit}
    //           onChange={(value) => {
    //             setMachineInputRow({ ...machineinputRow, unit: value });
    //           }}
    //         >
    //           <Select.Option value="Set">Set</Select.Option>
    //           <Select.Option value="Piece">Piece</Select.Option>
    //           <Select.Option value="Number">Number</Select.Option>
    //           <Select.Option value="Metre">Metre</Select.Option>
    //           <Select.Option value="Litre">Litre</Select.Option>
    //         </Select>
    //       </Tooltip>
    //     ) : (
    //       record.unit || ""
    //     ),
    // },
    // {
    //   title: "Unit",
    //   dataIndex: "unit",
    //   width: 250,
    //   ellipsis: true,
    //   render: (_, record) =>
    //     record.isInput ? (
    //       <Select
    //         className="w-100"
    //         value={machineinputRow.unit}
    //         onChange={(value) =>
    //           setMachineInputRow((prev) => ({ ...prev, unit: value }))
    //         }
    //         options={machineUnitOptions.map((u) => ({ value: u, label: u }))}
    //         loading={machineUnitLoading}
    //         placeholder={machineUnitLoading ? "Fetching unit..." : "Select Unit"}
    //         notFoundContent={
    //           machineUnitLoading ? "Fetching unit..." : "No units found"
    //         }
    //         // disabled={inputRow.sparePartsUnitFetched && userRole !== "Admin"}
    //       />
    //     ) : (
    //       record.unit || ""
    //     ),
    // },

    {
      title: "Unit",
      dataIndex: "unit",
      width: 250,
      ellipsis: true,
      render: (_, record) =>
        record.isInput ? (
          <Select
            className="w-100"
            value={machineinputRow.unit}
            onChange={(selectedUnit) => {
              clearTimeout(window.machineUnitDebounce);
              window.machineUnitDebounce = setTimeout(() => {
                const unitLower = (selectedUnit || "").toLowerCase();
                const num = parseFloat(machineinputRow.quantity);

                // Check if quantity must be whole number
                if (
                  (unitLower === "set" || unitLower === "piece") &&
                  !Number.isInteger(num)
                ) {
                  notification.error({
                    message: "Invalid Quantity",
                    description: `Quantity for unit "${selectedUnit}" must be a whole number and should not be empty.`,
                  });
                  setMachineInputRow((prev) => ({
                    ...prev,
                    unit: "",
                    quantity: "",
                  }));
                  return;
                }

                // If valid, update the unit
                setMachineInputRow((prev) => ({ ...prev, unit: selectedUnit }));
              }, 300);
            }}
            options={machineUnitOptions.map((u) => ({ value: u, label: u }))}
            loading={machineUnitLoading}
            placeholder={
              machineUnitLoading ? "Fetching unit..." : "Select Unit"
            }
            notFoundContent={
              machineUnitLoading ? "Fetching unit..." : "No units found"
            }
          />
        ) : (
          record.unit || ""
        ),
    },

    {
      title: "Stock In Hand",
      dataIndex: "stockInHand",
      width: 200,
      render: (_, record) =>
        record.isInput ? (
          <Tooltip>
            <Input
              readOnly
              value={
                machineinputRow.stockInHand
                  ? `${machineinputRow.stockInHand} ${
                      machineinputRow.stockUnit || ""
                    }`
                  : ""
              }
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
      title: "Total Price In AED",
      dataIndex: "totalPrice",
      width: 200,
      ellipsis: true,
      render: (_, record) =>
        record.isInput ? (
          <Tooltip>
            <Input value={machineinputRow.totalPrice || ""} readOnly />
          </Tooltip>
        ) : (
          <Tooltip title={record.totalPrice}>
            <span>{record.totalPrice || "-"}</span>
          </Tooltip>
        ),
    },
    {
      title: "Note",
      dataIndex: "note",
      ellipsis: true,
      width: 500,
      render: (_, record) =>
        record.isInput ? (
          <Tooltip>
            <Input.TextArea
              // autoSize={{ minRows: 2, maxRows: 2}}
              rows={1}
              placeholder="Enter note"
              value={machineinputRow.note}
              onChange={(e) =>
                setMachineInputRow({ ...machineinputRow, note: e.target.value })
              }
            />
          </Tooltip>
        ) : (
          <Tooltip
            title={record.note}
            styles={{
              root: {
                maxWidth: 1000,
                wordWrap: "break-word",
                whiteSpace: "normal",
              },
            }}
          >
            {/* <span> {record.note}</span> */}
            <span className="truncate-text">
              {record.note?.length > 150
                ? `${record.note.slice(0, 150)}...`
                : record.note}
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
            onClick={handleMachineAdd}
            disabled={machineFetching}
            loading={machineFetching}
          >
            {machineFetching ? "Loading" : "Add"}
          </Button>
        ) : (
          <Button
            className="deleteButton ps-3 pe-3"
            onClick={() => handleMachineDelete(record.key)}
          >
            Delete
          </Button>
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
    return <h2 style={{ padding: 20 }}>You do not have access to Product Categories</h2>;
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
                            setDataSource([]);
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
                          <Select.Option value="Consumables">
                            Consumables
                          </Select.Option>
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
                            <Select.Option value="BMM">BMM</Select.Option>
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

                            {selectedIMMSeries === "MA" && (
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
                            )}
                          </>
                        )}

                        {selectedMachine && (
                          <div className="col-12">
                            <h6
                              className="haitianColor ms-1 text-decoration-underline"
                              style={{ fontWeight: "500" }}
                            >
                              Machines Details
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
                      <div className="rounded-2 p-1 ">
                        <div className="col-12">
                          <Form.Item
                            label="Consumables"
                            name="consumables"
                            className="fw-bold"
                            rules={[
                              {
                                required: true,
                                message: "Please input consumables",
                              },
                            ]}
                          >
                            <Input placeholder="Enter consumables" />
                          </Form.Item>
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
                              style={{ fontWeight: "500" }}
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
                          <h6 className="haitianColor fw-bold">Spare Parts</h6>
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
                          ? "Submitting Categories Data"
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
                              Object.values(formValues).every((val) => !val)) &&
                            machineDataSource.length === 0 &&
                            auxiliariesDataSource.length === 0 &&
                            // assetsDataSource.length === 0 &&
                            dataSource.length === 0 &&
                            isObjectEmpty(inputRow) &&
                            isObjectEmpty(machineinputRow) &&
                            isObjectEmpty(auxiliariesInputRow)
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
                          setDataSource([]);

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
