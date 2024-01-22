import ClientList from "../../components/admin/home/clientlist";
import WorkAdminList from "../../components/admin/home/worklist";


const AdminHome = () => {
  return (
    <div className="flex flex-col items-center md:items-start md:flex-row gap-6 w-[90vw] max-w-[1000px]">
       <ClientList />
       <WorkAdminList />
    </div>
  )
}

export default AdminHome;