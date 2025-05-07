"use client";
import React, { useEffect, useState } from "react";
import Container from "./component/_container/Container";
import { Button, Input, Select } from "antd";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const { Option } = Select;

const Page = () => {
  const [domain, setDomain] = useState("");
  const [extension, setExtension] = useState(".x1300");
  const [error, setError] = useState("");
  const [showClaimButton, setShowClaimButton] = useState(false);
  const [showInfoForm, setShowInfoForm] = useState(false);
  const [loader, setLoader] = useState(false);
  const [allRequest, setAllRequest] = useState([]);
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [emailError, setEmailError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [domainAvailable, setDomainAvailable] = useState(false);

  const domainPattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Fetch all domains on load
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const response = await fetch("/api/getRequest");
        const data = await response.json();
        setAllRequest(data.domains || []);
      } catch (err) {
        console.error("Failed to fetch domains:", err);
      }
    };
    fetchDomains();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value.trim();
    setDomain(value);
    setEmail("");
    setAmount("");
    setShowInfoForm(false);

    if (!domainPattern.test(value)) {
      setError("Use a valid domain name");
      setShowClaimButton(false);
      setDomainAvailable(false);
      return;
    }

    const fullDomain = value + extension;
    const isDuplicate = allRequest?.some((item) => item.domain === fullDomain);

    if (isDuplicate) {
      setError("This domain is not available");
      setDomainAvailable(false);
      setShowClaimButton(false);
    } else {
      setError("");
      setDomainAvailable(true);
      setShowClaimButton(true);
    }
  };

  const handleExtensionChange = (value) => {
    setExtension(value);
    const fullDomain = domain + value;
    const isDuplicate = allRequest?.some((item) => item.domain === fullDomain);

    if (domainPattern.test(domain)) {
      if (isDuplicate) {
        setError("This domain is not available");
        setDomainAvailable(false);
        setShowClaimButton(false);
      } else {
        setError("");
        setDomainAvailable(true);
        setShowClaimButton(true);
      }
    }
    setShowInfoForm(false);
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (!val.trim()) {
      setEmailError("Email is required");
    } else if (!emailPattern.test(val)) {
      setEmailError("Enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleAmountChange = (e) => {
    const val = e.target.value;
    setAmount(val);
    if (!val.trim()) {
      setAmountError("Amount is required");
    } else if (isNaN(val)) {
      setAmountError("Enter a valid amount");
    } else {
      setAmountError("");
    }
  };

  const submitRequest = () => {
    setLoader(true);

    if (!domainPattern.test(domain)) {
      setLoader(false);
      return toast.error("Use a valid domain name");
    }
    if (!domain.trim()) {
      setLoader(false);
      return toast.error("Domain Name is required");
    }
    if (!email.trim()) {
      setLoader(false);
      return toast.error("Email is required");
    }
    if (!emailPattern.test(email)) {
      setLoader(false);
      return toast.error("Enter a valid email address");
    }
    if (!amount.trim()) {
      setLoader(false);
      return toast.error("Amount is required");
    }
    if (isNaN(amount)) {
      setLoader(false);
      return toast.error("Enter a valid amount");
    }

    axios
      .post("/api/sendRequest", {
        domain: domain + extension,
        email: email,
        amount: amount,
      })
      .then((res) => {
        toast(res.data.message);
        setLoader(false);
        setDomain("");
        setExtension(".x1300");
        setEmail("");
        setAmount("");
        setShowClaimButton(false);
        setShowInfoForm(false);
      })
      .catch((err) => {
        setLoader(false);
        toast.error("Server Problem! Can't take request");
      });
  };

  const selectAfter = (
    <Select defaultValue=".x1300" onChange={handleExtensionChange}>
      <Option value=".x1300">.x1300</Option>
      <Option value=".a-102">.a-102</Option>
      <Option value=".alishea">.alishea</Option>
      <Option value=".antwyne">.antwyne</Option>
    </Select>
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-green-100 via-black to-green-200 flex items-center justify-center">
      <div className="absolute w-[400px] h-[400px] bg-green-300 opacity-20 rounded-full -top-40 -left-40 blur-3xl"></div>
      <div className="absolute w-[300px] h-[300px] bg-black opacity-10 rotate-45 -bottom-32 -right-32 blur-2xl"></div>
      <div className="absolute w-[200px] h-[200px] bg-green-200 opacity-10 rounded-full top-20 right-1/4 blur-2xl"></div>

      <Container>
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <h1 className="text-4xl md:text-5xl text-white font-bold text-center mb-8 bg-gradient-to-r from-green-200 via-white to-green-300 bg-clip-text ">
            Claim Your Handshake Domain Today
          </h1>

          <div className="w-full max-w-xl p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
            <div className="flex flex-col items-center gap-2">
              {domain && (
                <p className="text-sm font-semibold">
                  {domainAvailable ? (
                    <span className="text-green-400">This domain is available</span>
                  ) : (
                    <span className="text-red-500">This domain is not available</span>
                  )}
                </p>
              )}

              <div className="flex justify-between w-full text-white">
                <p>Type Your Custom Domain Name</p>
                <p>Select TLD</p>
              </div>
              <Input
                addonAfter={selectAfter}
                placeholder="mysite"
                onChange={handleInputChange}
                status={error ? "error" : ""}
                value={domain}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {!error && showClaimButton && (
                <Button onClick={() => setShowInfoForm(true)} type="primary">
                  Claim your domain
                </Button>
              )}

              {showInfoForm && (
                <div className="w-full mt-6 flex flex-col gap-3">
                  <Input
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleEmailChange}
                    status={emailError ? "error" : ""}
                    type="email"
                  />
                  {emailError && (
                    <p className="text-red-500 text-sm">{emailError}</p>
                  )}

                  <Input
                    placeholder="Amount you want to pay (USD)"
                    value={amount}
                    onChange={handleAmountChange}
                    status={amountError ? "error" : ""}
                    type="number"
                  />
                  {amountError && (
                    <p className="text-red-500 text-sm">{amountError}</p>
                  )}
                  {loader ? (
                    <div className="flex justify-center">Loading...</div>
                  ) : (
                    <Button type="primary" onClick={submitRequest}>
                      Confirm
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
      <ToastContainer />
    </div>
  );
};

export default Page;
