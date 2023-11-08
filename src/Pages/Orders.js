import React, { useEffect, useState } from "react";
import { Route, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
// import Invoice from "./Invoice";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";

function Orders() {
  const [invoices, setInvoices] = useState(null);
  // const [todayInvoices, setTodayInvoices] = useState();
  const state = useSelector((state) => state);

  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [isThisMonthFilterClicked, setIsThisMonthFilterClicked] =
    useState(false);
  const [rangeFilter, setRangeFilter] = useState(false);
  const [rangeData, setRangeData] = useState(false);
  const navigate = useNavigate();

  const { id } = useParams();
  console.log(id);

  const [isTodayFilterClicked, setIsTodayFilterClicked] = useState(false);

  async function getInvoices() {
    // console.log("gere");
    setInvoices(
      await axios.get(
        `http://localhost:8000/getAllInvoice/${state.user.worksAt}`
      )
    );
    // console.log(invoices);
  }

  async function getTodayInvoices(id) {
    setInvoices(
      await axios.get(
        `http://localhost:8000/getTodaysAllInvoice?businessName=${state.user.worksAt}&date=${id}`
      )
    );
  }

  async function getThisMonthInvoices() {
    setInvoices(
      await axios.get(
        `http://localhost:8000/getThisMonthInvoice/${state.user.worksAt}`
      )
    );
  }

  useEffect(() => {
    // console.log(id);
    if (id == 0) {
      // console.log("hey");
      getThisMonthInvoices();
    } else if (id) {
      getTodayInvoices(id);
    } else {
      getInvoices();
    }
  }, []);

  useEffect(() => {
    // Filter data based on the search input value
    // invoices = {};
    const filtered = invoices?.data.filter(
      (item) =>
        item.mobile.toString().startsWith(searchValue.toString()) ||
        item.invoiceNo.toString().startsWith(searchValue.toString()) ||
        item.name.toLowerCase().startsWith(searchValue.toLowerCase())
    );
    setFilteredData(filtered);

    // console.log(filteredData);

    // console.log("=> filtered data", filteredData);
  }, [searchValue, invoices]);

  function handleInvoice(invoiceNo) {
    navigate(`/invoice/${invoiceNo}`);
  }

  function handleFiltersVisibility() {
    setIsFiltersVisible(!isFiltersVisible);
    setRangeFilter(false);
  }

  function handleTodayFilterClicked() {
    setIsTodayFilterClicked(!isTodayFilterClicked);
    getTodayInvoices(Date());
  }

  function handleAllTimeFilterClicked() {
    setIsTodayFilterClicked(!isTodayFilterClicked);
    getInvoices();
  }

  function handleThisMonthFilterClicked() {
    setIsThisMonthFilterClicked(!isThisMonthFilterClicked);
    if (id == 0) {
      setIsTodayFilterClicked(!isTodayFilterClicked);
    }

    getThisMonthInvoices();
  }

  function handleRange() {
    setRangeFilter(!rangeFilter);
  }

  async function handleRangeSubmit() {
    const startDate = document.getElementById("start").value;
    const endDate = document.getElementById("end").value;
    if (startDate <= endDate) {
      setRangeData(
        await axios.get(
          `http://localhost:8000/getRangeInvoices?start=${startDate}&end=${endDate}&businessName=${state.user.worksAt}`
        )
      );
      console.log(rangeData);
    }
  }

  async function handleSortAsc() {
    setInvoices(
      await axios.get(
        `http://localhost:8000/ordersSortAsc/${state.user.worksAt}`
      )
    );
  }

  async function handleSortDsc() {
    setInvoices(
      await axios.get(
        `http://localhost:8000/ordersSortDsc/${state.user.worksAt}`
      )
    );
  }

  return (
    <div className="orders">
      {invoices?.data.length == 0 ? (
        <div className="welcome-block">
          <h1>
            UGHH...! <br></br>
            <br></br>NO ORDERS FOUND
          </h1>
          <Link to="/home-page">
            <button className="submit-button">PLACE AN ORDER</button>
          </Link>
        </div>
      ) : (
        <div className="orders">
          <div className="Search-Bar">
            <input
              type="text"
              value={searchValue}
              placeholder="search for item name"
              onChange={(e) => setSearchValue(e.target.value)}
            ></input>
            <span>
              SEARCH
              <img />
            </span>
          </div>
          <div className="filters-icon" onClick={handleFiltersVisibility}>
            <img src="https://cdn-icons-png.flaticon.com/128/3839/3839020.png" />
          </div>
          {isFiltersVisible && id == undefined && (
            <div className="orders-filters">
              {!isTodayFilterClicked ? (
                <div onClick={handleTodayFilterClicked}>TODAY</div>
              ) : (
                <div onClick={handleAllTimeFilterClicked}>ALL TIME</div>
              )}
              <div onClick={handleThisMonthFilterClicked}>THIS MONTH</div>

              <div onClick={handleRange}>Select Date </div>

              <div onClick={handleSortAsc}>Sort Asc.</div>
              <div onClick={handleSortDsc}>Sort Des.</div>
            </div>
          )}

          {isFiltersVisible && id == 0 && (
            <div className="orders-filters">
              {!isTodayFilterClicked ? (
                <div onClick={handleTodayFilterClicked}>TODAY</div>
              ) : (
                <div onClick={handleThisMonthFilterClicked}>THIS MONTH</div>
              )}

              <div onClick={handleRange}>Select Date </div>

              <div onClick={handleSortAsc}>Sort Asc.</div>
              <div onClick={handleSortDsc}>Sort Des.</div>
            </div>
          )}

          {isFiltersVisible && id != 0 && typeof id == "string" && (
            <div className="today-orders-filters">
              <div onClick={handleSortAsc}>Sort Asc.</div>
              <div onClick={handleSortDsc}>Sort Des.</div>
            </div>
          )}

          {rangeFilter && (
            <div className="range-form">
              <input type="date" id="start" name="From" />
              <input type="date" id="end" name="To" />
              <button className="submit-button" onClick={handleRangeSubmit}>
                SUBMIT
              </button>
            </div>
          )}
          <table>
            <thead>
              <tr>
                <th className="item-name">Invoice No.</th>
                <th>Cx Name</th>
                <th>Mobile</th>
                <th>Bill Amount</th>
              </tr>
            </thead>
            <tbody>
              {rangeData != undefined
                ? filteredData?.map((data) => (
                    <tr onClick={() => handleInvoice(data.invoiceNo)}>
                      <td className="item-name">{data.invoiceNo}</td>
                      <td>{data.name}</td>
                      <td>{data.mobile}</td>
                      <td>₹{data.billAmount}/-</td>
                    </tr>
                  ))
                : rangeData?.map((data) => (
                    <tr onClick={() => handleInvoice(data.invoiceNo)}>
                      <td className="item-name">{data.createdAt}</td>
                      <td>{data.name}</td>
                      <td>{data.mobile}</td>
                      <td>₹{data.billAmount}/-</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      )}
      {/* {console.log(invoices)} */}
    </div>
  );
}

export default Orders;
