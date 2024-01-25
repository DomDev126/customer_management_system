import ClientList from "../../components/admin/home/clientlist";
import WorkAdminList from "../../components/admin/home/worklist";


const AdminHome = () => {
  return (
    <div className="p-4 w-full flex flex-col lg:flex-row gap-4">
       <ClientList />
       <WorkAdminList />
    </div>
  )
}

export default AdminHome;