import ClientList from "../../components/admin/home/clientlist";
import WorkAdminList from "../../components/admin/home/worklist";


const AdminHome = () => {
  return (
    <div className="p-4 w-full flex flex-col 2xl:flex-row gap-4 items-center 2xl:items-start">
       <ClientList />
       <WorkAdminList />
    </div>
  )
}

export default AdminHome;