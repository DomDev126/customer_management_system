import ClientList from "../../components/admin/home/clientlist";
import WorkAdminList from "../../components/admin/home/worklist";


const AdminHome = () => {
  return (
    <div className="flex flex-col items-center p-3 lg:items-start lg:flex-row gap-14 lg:gap-4 w-[96vw] max-w-[1200px]">
       <ClientList />
       <WorkAdminList />
    </div>
  )
}

export default AdminHome;