import React, { useEffect, useState } from "react";
import "./App.css";
import FileUpload from "./components/FileUpload";
import { Modal, Table } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const App = () => {
  const [Data, setData] = useState([]);
  useEffect(() => {
    const populateFiles = async () => {
      const data = await axios.get("http://localhost:5000/api/fileupload");
      setData(data);
    };
    populateFiles();
  }, []);

  const columns = [
    {
      key: "fileName",
      title: "File Name",
      dataIndex: "Date",
    },
    {
      key: "size",
      title: "File size",
      dataIndex: "size",
    },
    {
      key: "date",
      title: "Date",
      dataIndex: "date",
    },

    {
      key: "action",
      title: "Actions",
      render: (record) => {
        return (
          <>
            <DeleteOutlined
              style={{ color: "red" }}
              onClick={() => Delete(record)}
            />
          </>
        );
      },
    },
  ];
  const Delete = (record) => {
    Modal.confirm({
      title: "Are you sure you want to delete this",
      onOk: async () => {
        const data = await axios.delete(
          `http://localhost:5000/api/fileupload/${record.id}`
        );
        setData((pre) => {
          return pre.filter((person) => person.id != record.id);
        });
      },
    });
  };
  return (
    <div className="container mt-4">
      <h4 className="display-4 text-center mb-4">
        <i className="fab fa-react">React File Upload</i>
      </h4>

      <FileUpload />

      <div className="table">
        {Data.length == 0 ? (
          <>
            <h1>There is no Fileupload post !!!</h1>
          </>
        ) : (
          <>
            <Table dataSource={Data} columns={columns} pagination={false} />
          </>
        )}
      </div>
    </div>
  );
};

export default App;
