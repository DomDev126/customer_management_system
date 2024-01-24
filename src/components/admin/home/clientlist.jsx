import { useEffect, useState } from "react";
import { axiosTokenApi } from "../../../utils/axios";
import moment from 'moment';
import { STATUS_LIST } from "../../../utils/const";
import Modal from "antd/es/modal/Modal";

const ClientList = () => {

  const [users, setUsers] = useState([]);
  const [userName , setUserName] = useState("");
  const [userAddress , setUserAddress] = useState("");
  const [userTel , setUserTel] = useState("");
  const [userEmail , setUserEmail] = useState("");
  const [openModal , setOpenModal] = useState(false);
  const [jobUser , setJobUser] = useState([]);
  const [isEdit , setEdit] = useState(true);
  const [userId , setUserId] = useState("");
  const [addJob , setAddJob] = useState(true);
  const [addCarnumber , setAddCarnumber] = useState("");
  const [addStatus , setAddStatus] = useState("");
  const [addDate , setAddDate] = useState("")
  const [addCharger , setAddCharger] = useState("");

  useEffect(() => {
    getProfile();
  }, [addCarnumber])

  const getProfile = () => {
    axiosTokenApi
      .get("/api/auth/user_list/")
      .then(res => {
          setUsers(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }

  const userDetail = (userId) => {
    setUserId(userId);
    setOpenModal(true);

    axiosTokenApi
      .get("/api/auth/user_detail/" , { params : {user_id: userId}})
      .then(res => {
        setUserName(res.data.user.name);
        setUserAddress(res.data.user.address);
        setUserTel(res.data.user.tel);
        setUserEmail(res.data.user.email);
        setJobUser(res.data.jobs);
      })
      .catch(err => {
        console.log(err);
      })
  }

  const handleUpdate = () => {
    axiosTokenApi
      .post("api/auth/user_update/" , {
        user_id: userId,
        name : userName,
        address : userAddress,
        tel : userTel,
        email : userEmail,
      })
      .then(() => {
        getProfile();
      })
      .catch(err => {
        console.log(err);
      })
    
    setEdit(true);
  }

  const handleAddJob = () => {
    console.log(addStatus);
    axiosTokenApi
      .post("api/job/jobs/" , {
        user : userId,
        car_number : addCarnumber,
        status : addStatus,
        deadline : addDate,
        charger : addCharger
      })
      .then(() => {
        getProfile()
      })
      .catch(err => {
        console.log(err);
      })
    
    setAddJob(true);
  }

  const handleOk = () => {
    handleUpdate();
    handleAddJob();
    setOpenModal(false);
  }
  const handleCancel = () => {
    setEdit(true);
    setAddJob(true);
    setOpenModal(false);
  }
  return(
    <div className="flex flex-col gap-6 w-[90%] lg:w-5/12">
      <h3 className="text-3xl font-semibold">
        顧客一覧
      </h3>
      <div className="w-full">
        <table className="w-full">
          <thead>
            <tr>
              <th>No</th>
              <th>名前</th>
              <th>住所</th>
              <th>電話番号</th>
              <th>登録日</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr className="cursor-pointer" key={index} onClick={() => {userDetail(user.id)}}>
                <td>{index+1}</td>
                <td>{user.name}</td>
                <td>{user.address}</td>
                <td>{user.tel}</td>
                <td>{moment(user.created_at).format("YYYY-MM-DD")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Modal
          title={<p className="font-semibold text-2xl">顧客詳細</p>}
          centered
          open={openModal}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <div className="border-b border-solid border-b-[#33333333] relative pb-3">
            <ul className="flex flex-col gap-3 mt-5">
              <li className="flex items-center">
                <p className="w-5/12">
                  名前
                </p>
                {isEdit ? 
                  <p>{userName} </p>: 
                  <input value={userName} onChange={(e) => setUserName(e.target.value)} 
                />}
              </li>
              <li className="flex items-center">
                <p className="w-5/12">
                住所
                </p>
                {isEdit ? 
                  <p>
                    {userAddress}
                  </p>  :
                  <input value={userAddress} onChange={(e) => setUserAddress(e.target.value)} />
                }
                
              </li>
              <li className="flex items-center">
                <p className="w-5/12">
                電話番号
                </p>
                {isEdit ?
                  <p>
                    {userTel}
                  </p> :
                  <input value={userTel} onChange={(e) => setUserTel(e.target.value)} />
                }
                
              </li>
              <li className="flex items-center">
                <p className="w-5/12">
                メールアドレス
                </p>
                {isEdit ?
                  <p>
                    {userEmail}
                  </p> :
                  <input value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                }
                
              </li>
            </ul>
            {isEdit ?
              <button className="absolute -top-14 right-6 bg-[#1677ff] text-white text-lg p-1 px-3" onClick={() => setEdit(false)}>編集</button>
              :
              <button className="absolute -top-14 right-6 bg-[#1677ff] text-white text-lg p-1 px-3" onClick={handleUpdate}>保存</button>
            }
          </div>
          <div className="mt-5 flex flex-col gap-5 relative">
            <h6 className="font-semibold text-2xl">
            作業
            </h6>
            <div className="p-2 flex flex-col gap-3">
              <ul className="flex justify-between border-b border-solid border-[#33333333]">
                <li className="w-2/12 font-bold">
                  車番号
                </li>
                <li className="w-3/12 font-bold">
                 担当者
                </li>
                <li className="w-4/12 font-bold">
                  ステータス
                </li>
                <li className="w-3/12 font-bold">
                 締切日
                </li>
              </ul>
              {jobUser.map((job,index) => (
                <ul key = {index} className="flex justify-between">
                  <li className="w-2/12">
                    {job.car_number}
                  </li>
                  <li className="w-3/12">
                    {job.charger}
                  </li>
                  <li className="w-4/12">
                    {STATUS_LIST[job.status - 1]}
                  </li>
                  <li className="w-3/12">
                    {job.deadline}
                  </li>
                </ul>
              ))}
              {addJob ? 
                <div>
                  
                </div>
                :
                <div className="flex justify-between gap-2">
                  <input type="text" className="w-2/12" onChange={(e) => setAddCarnumber(e.target.value)}/>
                  <input type="text" className="w-3/12" onChange={(e) => setAddCharger(e.target.value)}/>
                  <select className="w-4/12" onChange={(e) => setAddStatus(e.target.value)}>
                    {STATUS_LIST.map((STATUS, index) => (
                      <option key={`statys_option${index}`} value={index+1}>{STATUS}</option>
                    ))}
                  </select>
                  <input type="date" className="w-3/12" onChange={(e) => setAddDate(e.target.value)}/>
                </div>
              }
              
            </div>
            {
              addJob ? 
              <button className="absolute top-0 right-5 bg-[#1677ff] text-white text-lg p-1 px-3" onClick={() => setAddJob(false)}>作業登録</button>
              :
              <button className="absolute top-0 right-5 bg-[#1677ff] text-white text-lg p-1 px-3" onClick={handleAddJob}>追加する</button>
            }
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default ClientList;