import React, { useEffect, useState } from "react";
import Header from "./Header";
import axios from "axios";
import "./Action.css";
import Pagination from "./Pagination";

export default function Action() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/action")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu:", error);
      });
  }, []);

  return (
    <div className="root">
      <Header />
      <div className="act">
        <table className="tbl-act">
          <thead>
            <tr>
              <th>ID</th>
              <th>Deviceid</th>
              <th>Action</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item.ID}>
                <td>{item.ID}</td>
                <td>{item.Deviceid}</td>
                <td>{item.Acti}</td>
                <td>{new Date(item.tg).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={data.length}
          currentPage={currentPage}
          paginate={paginate}
        />
      </div>
    </div>
  );
}
