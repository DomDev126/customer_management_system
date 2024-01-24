import ClientList from "../../components/admin/home/clientlist";
import WorkAdminList from "../../components/admin/home/worklist";


const AdminHome = () => {
  return (
    <div className="flex flex-col items-center p-3 lg:items-start lg:flex-row gap-14 lg:gap-6 w-[90vw] max-w-[1200px]">
       <ClientList />
       <WorkAdminList />
    </div>
  )
}

export default AdminHome;