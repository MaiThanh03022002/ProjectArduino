import React, { useEffect, useState } from "react";
import Header from "./Header";
import "./Sensor.css";
import Pagination from "./Pagination";
import axios from "axios";

export default function Sensor() {
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
      .get("http://localhost:3001/api/sensor")
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
      <div className="sen">
        <table className="tbl-sen" border="1">
          <thead>
            <tr>
              <th>STT</th>
              <th>Nhiệt độ</th>
              <th>Độ ẩm</th>
              <th>Ánh sáng</th>
              <th>Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={index}>
                <td>{item.id}</td>
                <td>{item.temperature}</td>
                <td>{item.humidity}</td>
                <td>{item.light}</td>
                <td>{new Date(item.timestamp).toLocaleString()}</td>
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
