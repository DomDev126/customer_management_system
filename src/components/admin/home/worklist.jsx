import { useEffect, useState } from "react";
import { axiosTokenApi } from "../../../utils/axios";

const WorkAdminList = () => {

  const [jobs, setJobs] = useState([]);

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

  return(
    <div className="flex flex-col gap-6 w-6/12">
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
              <tr key={index}>
                <td>{job.car_number}</td>
                <td>{job.charger}</td>
                <td>{job.charger}</td>
                <td>{job.deadline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default WorkAdminList;