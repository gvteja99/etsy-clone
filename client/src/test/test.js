import Dashboard from "../components/Dashboard.js";
import { render, screen, fireEvent } from "@testing-library/react";
import React, { useNavigate } from "react";
import "@testing-library/jest-dom";

// import { UserContext } from "../Helper/Context";

test("Checks for shop name", () => {
  render(<Dashboard />);
  const shopName = screen.getByText(/Home/i);
  expect(shopName).toBeInTheDocument();
});



  // "username": "admin",
      // "password": "admin123",
      // "database": "etsy_schema",
      // "host": "ecommerce.cqlwgcfyu0tj.us-east-1.rds.amazonaws.com",
      // "port": 3306,
      // "dialect": "mysql"