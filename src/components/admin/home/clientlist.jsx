import { useEffect, useState } from "react";
import { axiosTokenApi } from "../../../utils/axios";
import moment from 'moment';

const ClientList = () => {

  const [users, setUsers] = useState([]);


  

  useEffect(() => {
    axiosTokenApi
      .get("/api/auth/user_list/")
      .then(res => {
          setUsers(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, [])



  return(
    <div className="flex flex-col gap-6 w-6/12">
      <h3 className="text-3xl font-semibold">
        顧客一覧
      </h3>
      <div className="w-full">
        <table className="w-full">
          <thead>
            <tr>
              <th>No</th>
              <th>名前</th>
              <th>登録日</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{index+1}</td>
                <td>{user.name}</td>
                <td>{moment(user.created_at).format("MM-DD-YYYY")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ClientList;