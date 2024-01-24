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
  const [isEdit , setIsEdit] = useState(true);
  const [jobId , setJobId] = useState(null);

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
    setJobId(jobId);
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
    handleUpdate();
    setModalOpen(false);
    setIsEdit(true);
  }
  const handleCancel = () => {
      setModalOpen(false);
      setIsEdit(true);
    }
  const handleUpdate = () => {
    const currentJob = jobs.find((job) => (job.id === jobId));
    const payload = {
      job_id : currentJob.id,
      user : currentJob.user.id,
      status : carState,
    };

    if(carNumber) payload['car_number'] = carNumber;
    if(deadline) payload['deadline'] = deadline;
    if(charger) payload['charger'] = charger;
    
    axiosTokenApi.put("/api/job/jobs/" , payload);
    
    setIsEdit(true);
  }
  return (
    <div className="flex flex-col gap-6 w-[90%] lg:w-7/12">
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
              <th>ステータス</th>
              <th>見積額</th>
              <th>締切日</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, index) => (
              <tr className="cursor-pointer" key={index} onClick={() =>{openJobDetail(job.id)}}>
                <td>車番号{job.car_number}</td>
                <td>{job.user.name}</td>
                <td>{job.charger}</td>
                <td>{STATUS_LIST[carState - 1]}</td>
                <td>{job.price}</td>
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
        <ul className="relative pt-10 flex flex-col gap-3">
          <li className="flex">
            <p className="w-5/12">
              名前
            </p>
              <p>
              {userName}
              </p>
          </li>
          <li className="flex">
            <p className="w-5/12">
              車名称
            </p>
            {isEdit ?
              <p>
                車番号{carNumber}
              </p>
              :
              <input type="text" value={carNumber} onChange={(e) => setCarNumber(e.target.value)}/>
              
            }
          </li>
          <li className="flex">
            <p className="w-5/12">
              ステータス
            </p>
            {
              isEdit ?
              <p>
                {STATUS_LIST[carState - 1]}
              </p>
              :
              <select name="" id="" onChange={(e) => setCarState(e.target.value)}>
                {STATUS_LIST.map((STATUS, index) => (
                      <option key={`statys_option${index}`} selected={carState === (index+1) ? true : false} value={index+1}>{STATUS}</option>
                ))}
              </select>
            }
          </li>
          <li className="flex">
            <p className="w-5/12">
              担当者
            </p>
            {
              isEdit ?
              <p>
                {charger}
              </p>
              :
              <input type="text" value={charger} onChange={(e) => setCharger(e.target.value)} />
            }
          </li>
          <li className="flex">
            <p className="w-5/12">
              締切日
            </p>
            {
              isEdit ?
              <p>
                {deadline}
              </p>
              :
              <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            }
          </li>
          {isEdit ? 
            <button className="absolute -top-3 right-6 bg-[#1677ff] text-white text-lg p-1 px-3" onClick={() =>setIsEdit(false)}>編集</button>
            :
            <button className="absolute -top-3 right-6 bg-[#1677ff] text-white text-lg p-1 px-3" onClick={handleUpdate}>保存</button>
          }
        </ul>
        <div className="w-full bg-[#33333320] p-3 rounded-xl mt-10 flex flex-col gap-5">
          <div className="chat flex flex-col gap-4">
            <div>
              <p className="text-xs bg-white w-8/12 p-1 rounded-lg">
                テキストテキスト
              </p>
            </div>
            <div className="flex justify-end">
              <p className="text-xs bg-white w-8/12 p-1 rounded-lg">
                テキストテキストテキストテキスト
                テキストテキスト テキストテキスト
              </p>
            </div>
            <div>
              <p className="text-xs bg-white w-8/12 p-1 rounded-lg">
                テキストテキスト
              </p>
            </div>
          </div>
          <div className="bg-white p-2 w-full flex justify-between items-center rounded-3xl">
              <input type="text" className="w-9/12 outline-none border-none"/>
              <button className="p-0 px-3 h-fit">
                  <img className="w-[20px]" src="../../../../public/assets/img/send-alt-1-svgrepo-com.svg" alt="send_img" />
              </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default WorkAdminList;