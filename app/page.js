"use client";
import React, { useState } from "react";
import Container from "./component/_container/Container";
import { Button, Input, Select, message, Tag } from "antd";

const { Option } = Select;

const Page = () => {
  const [domain, setDomain] = useState("");
  const [extension, setExtension] = useState(".com");
  const [error, setError] = useState("");
  const [showClaimButton, setShowClaimButton] = useState(false);
  const [showInfoForm, setShowInfoForm] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");

  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [amountError, setAmountError] = useState("");

  const [submissions, setSubmissions] = useState([]);

  const domainPattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleInputChange = (e) => {
    const value = e.target.value.trim();
    setDomain(value);

    const fullDomain = value + extension;
    const isDuplicate = submissions.some((item) => item.domain === fullDomain);

    if (!domainPattern.test(value)) {
      setError("Use a valid domain name");
      setShowClaimButton(false);
    } else if (isDuplicate) {
      setError("This domain is already claimed");
      setShowClaimButton(false);
    } else {
      setError("");
      setShowClaimButton(true);
      console.log("Full domain:", fullDomain);
    }

    setShowInfoForm(false);
  };

  const handleExtensionChange = (value) => {
    setExtension(value);
    const fullDomain = domain + value;
    const isDuplicate = submissions.some((item) => item.domain === fullDomain);

    if (domainPattern.test(domain)) {
      if (isDuplicate) {
        setError("This domain is already claimed");
        setShowClaimButton(false);
      } else {
        setError("");
        setShowClaimButton(true);
        console.log("Full domain:", fullDomain);
      }
    }
    setShowInfoForm(false);
  };

  const handleConfirm = () => {
    let isValid = true;

    if (!fullName.trim()) {
      setFullNameError("Full name is required");
      isValid = false;
    }

    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!emailPattern.test(email)) {
      setEmailError("Enter a valid email address");
      isValid = false;
    }

    if (!amount.trim()) {
      setAmountError("Amount is required");
      isValid = false;
    } else if (isNaN(amount) || Number(amount) <= 0) {
      setAmountError("Enter a valid amount");
      isValid = false;
    }

    if (!isValid) {
      message.error("Please fix the errors before submitting.");
      return;
    }

    const finalData = {
      domain: domain + extension,
      fullName,
      email,
      amount,
      status: "Pending",
    };

    setSubmissions((prev) => [finalData, ...prev]);

    setDomain("");
    setExtension(".x1300");
    setFullName("");
    setEmail("");
    setAmount("");
    setShowInfoForm(false);
    message.success("Data submitted. Check below demo admin panel.");
  };

  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
    setFullNameError(e.target.value.trim() ? "" : "Full name is required");
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    const val = e.target.value;
    if (!val.trim()) {
      setEmailError("Email is required");
    } else if (!emailPattern.test(val)) {
      setEmailError("Enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
    const val = e.target.value;
    if (!val.trim()) {
      setAmountError("Amount is required");
    } else if (isNaN(val) || Number(val) <= 0) {
      setAmountError("Enter a valid amount");
    } else {
      setAmountError("");
    }
  };

  const updateStatus = (index, newStatus) => {
    setSubmissions((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, status: newStatus } : item
      )
    );
  };

  const selectAfter = (
    <Select defaultValue=".x1300" onChange={handleExtensionChange}>
      <Option value=".x1300">.x1300</Option>
      <Option value=".a-102">.a-102</Option>
      <Option value=".alishea">.alishea</Option>
      <Option value=".antwyne">.antwyne</Option>
    </Select>
  );

  const statusColors = {
    Pending: "gold",
    Approved: "green",
    Rejected: "red",
    "Payment Issue": "volcano",
    "Paid": "blue",
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-green-100 via-black to-green-200 flex items-center justify-center">
      {/* Background Shapes */}
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
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={handleFullNameChange}
                    status={fullNameError ? "error" : ""}
                  />
                  {fullNameError && (
                    <p className="text-red-500 text-sm">{fullNameError}</p>
                  )}

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

                  <Button type="primary" onClick={handleConfirm}>
                    Confirm
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Admin Panel */}
          <h2 className="text-xl md:text-2xl text-white font-semibold mt-12">
            👇 These data will be visible to admin in the admin panel (demo only)
          </h2>

          <div className="w-full max-w-2xl mt-6 space-y-4">
            {submissions.map((item, index) => (
              <div
                key={index}
                className="bg-white/10 text-white p-4 rounded-xl border border-white/20 shadow-md"
              >
                <p><strong>Domain:</strong> {item.domain}</p>
                <p><strong>Full Name:</strong> {item.fullName}</p>
                <p><strong>Email:</strong> {item.email}</p>
                <p><strong>Amount:</strong> ${item.amount}</p>
                <p className="mb-2">
                  <strong>Status:</strong>{" "}
                  <Tag color={statusColors[item.status] || "default"}>
                    {item.status}
                  </Tag>
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button size="small" onClick={() => updateStatus(index, "Approved")}>
                    Approve
                  </Button>
                  <Button size="small" danger onClick={() => updateStatus(index, "Rejected")}>
                    Reject
                  </Button>
                  <Button size="small" type="dashed" onClick={() => updateStatus(index, "Payment Issue")}>
                    Mark as Payment Issue
                  </Button>
                  <Button size="small" type="primary" onClick={() => updateStatus(index, "Paid")}>
                    Mark as Paid
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Page;
