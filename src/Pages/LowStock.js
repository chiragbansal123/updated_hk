import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

function LowStock() {
  const [lowStock, setLowStock] = useState();
  const state = useSelector((state) => state);

  const { id } = useParams();

  function func() {
    console.log(state);
    setLowStock(
      state.stock?.filter((item) => item.quantity <= 5 && item.quantity > 0)
    );
  }

  function outOfStock() {
    // console.log(state);
    setLowStock(state.stock?.filter((item) => item.quantity == 0));
  }

  useEffect(() => {
    if (id) {
      outOfStock();
    } else {
      func();
    }
  }, []);

  return (
    <div className="low-stock">
      {console.log(lowStock)}
      {lowStock?.length == 0 ? (
        <div className="welcome-block">
          <h1>
            UGHH...! <br></br>
            <br></br>NO ORDERS FOUND
          </h1>
        </div>
      ) : (
        <div className="Search-Bar"></div>
      )}
      <table>
        <thead>
          <tr>
            <th className="item-name">ITEM NAME</th>
            {/* <th className="salt-field">Salt</th> */}
            {/* <th>ID</th> */}
            <th>PRICE</th>
            <th>STOCK</th>
            <th>SHELF No.</th>
          </tr>
        </thead>
        <tbody>
          {id == undefined
            ? lowStock?.map((data) => (
                <tr>
                  <td className="item-name">{data.name}</td>
                  <td>{data.price}</td>
                  <td>{data.quantity}</td>
                  <td>{data.shelf}</td>
                </tr>
              ))
            : lowStock?.map((data) => (
                <tr className="out-of-stock">
                  <td className="item-name">{data.name}</td>
                  <td>{data.price}</td>
                  <td>{data.quantity}</td>
                  <td>{data.shelf}</td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}

export default LowStock;
