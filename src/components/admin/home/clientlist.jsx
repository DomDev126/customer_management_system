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
  

  useEffect(() => {
    getProfile();
  }, [])

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

  return(
    <div className="flex flex-col gap-6 w-[90%] md:w-6/12">
      <h3 className="text-3xl font-semibold">
        顧客一覧
      </h3>
      <div className="w-full">
        <table className="w-full">
          <thead>
            <tr>
              <th>No</th>
              <th>名前</th>
              <th>電話番号</th>
              <th>登録日</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} onClick={() => {userDetail(user.id)}}>
                <td>{index+1}</td>
                <td>{user.name}</td>
                <td>{user.tel}</td>
                <td>{moment(user.created_at).format("YYYY-MM-DD")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Modal
          title = {<p className="font-semibold text-2xl">顧客詳細</p>}
          centered
          open = {openModal}
          onOK = {() => setOpenModal(false)}
          onCancel = {() => setOpenModal(false)}
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
          <div className="mt-5 flex flex-col gap-5">
            <h6 className="font-semibold text-2xl">
            作業
            </h6>
            <div className="p-2 flex flex-col gap-3">
              {jobUser.map((job,index) => (
                <ul key = {index} className="flex">
                  <li className="w-4/12">
                    {job.car_number}
                  </li>
                  <li className="w-4/12">
                    {STATUS_LIST[job.status - 1]}
                  </li>
                  <li className="w-4/12">
                    {job.deadline}
                  </li>
                </ul>
              ))}
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default ClientList;