import ClientList from "../../components/admin/home/clientlist";
import WorkAdminList from "../../components/admin/home/worklist";


const AdminHome = () => {
  return (
    <div className="flex gap-6 w-[90vw]">
       <ClientList />
       <WorkAdminList />
    </div>
  )
}

export default AdminHome;