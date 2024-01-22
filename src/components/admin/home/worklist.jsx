import { useEffect, useState } from "react";
import { axiosTokenApi } from "../../../utils/axios";
import { Modal } from "antd";
import { STATUS_LIST } from "../../../utils/const";


const WorkAdminList = () => {

  const [jobs, setJobs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [carNumber, setCarNumber] = useState(null);
  const [carState, setCarState] = useState(null);
  const [charger, setCharger] = useState("");
  const [deadline, setDeadline] = useState("");
  const [userName , setUserName] = useState("");

  useEffect(() => {
    axiosTokenApi
      .get("/api/job/jobs/")
      .then(res => {
        setJobs(res.data);
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }, [])

  const openJobDetail = (jobId) => {
    setModalOpen(true);

    axiosTokenApi
      .get("api/job/job_detail/", { params : {job_id: jobId}})
      .then(res => {
        setCarNumber(res.data.car_number),
        setCharger(res.data.charger),
        setDeadline(res.data.deadline),
        setCarState(res.data.status),
        setUserName(res.data.user.name)
      })
      .catch(err => {
        console.log(err);
      })
  }
  const handleOk = () => {
    setModalOpen(false);
  }
  const handleCancel = () => {
      setModalOpen(false);
    }

  return (
    <div className="flex flex-col gap-6 w-[90%] md:w-6/12">
      <h3 className="text-3xl font-semibold">
        作業一覧
      </h3>
      <div className="w-full">
        <table className="w-full">
          <thead>
            <tr>
              <th>車名称</th>
              <th>顧客名</th>
              <th>担当者名</th>
              <th>締切日</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, index) => (
              <tr className="cursor-pointer" key={index} onClick={() =>{openJobDetail(job.id)}}>
                <td>車名称{job.car_number}</td>
                <td>{job.user.name}</td>
                <td>{job.charger}</td>
                <td>{job.deadline}</td>
              </tr>
            ))}
          </tbody>
        </table>
 
      </div>

      <Modal
        open={modalOpen}
        title=""
        onOk={handleOk}
        onCancel={handleCancel}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <OkBtn />
            <CancelBtn />
          </>
        )}
      >
        <ul>
          <li className="flex">
            <p className="w-5/12">
              名前
            </p>
            {userName}
          </li>
          <li className="flex">
            <p className="w-5/12">
              車名称
            </p>

          </li>
          <li className="flex">
            <p className="w-5/12">
              ステータス
            </p>
              {STATUS_LIST[carState - 1]}
          </li>
          <li className="flex">
            <p className="w-5/12">
              締切日
            </p>
            {charger}
          </li>
          <li className="flex">
            <p className="w-5/12">
              担当者
            </p>
            {deadline}
          </li>
        </ul>
      </Modal>
    </div>
  )
}

export default WorkAdminList;