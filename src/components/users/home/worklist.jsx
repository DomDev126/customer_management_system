import { useEffect, useState } from "react";
import { axiosTokenApi } from "../../../utils/axios";
import Modal from 'react-modal';
import { STATUS_LIST } from "../../../utils/const";

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
		width: '40vw',
		padding: '3rem',
	},
};


const Worklist = () => {
    const [jobs, setJobs] = useState([]);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [carNumber, setCarNumber] = useState(null);
    const [carState, setCarState] = useState(null);
    const [charger, setCharger] = useState("");
    const [deadline, setDeadline] = useState("");
    let subtitle;

    useEffect(() => {
        axiosTokenApi
        .get("/api/job/user_jobs/")
        .then(res => {
            setJobs(res.data);
        })
        .catch(err => {
            console.log(err)
        });
    }, [])

    const openModal = (jobId) => {
        setIsOpen(true); 

        axiosTokenApi
            .get("api/job/job_detail/", { params: { job_id: jobId } })
            .then(res => {
                setCarNumber(res.data.car_number),
                setCharger(res.data.charger),
                setDeadline(res.data.deadline),
                setCarState(res.data.status)
            })
            .catch(err => {
                console.log(err);
            })
    }
    function afterOpenModal() {
		subtitle.style.color = '#f00';
	}

	function closeModal() {
		setIsOpen(false);
	}
    return(
        <div className="relative w-full md:w-[28%]">
            <h2 className="text-right text-[24px] font-semibold">
                作業一覧
            </h2>
            <div className="w-full p-10 border border-solid border-[#33333333] rounded-xl flex flex-col gap-5">
                <ul className="flex flex-col gap-4 items-center">
                    {jobs.map((job, index) => (<li className="w-fit cursor-pointer" onClick={() =>{openModal(job.id)}} key={`car_${index}`}>車番号{job.car_number}</li>))}
                </ul>
                <Modal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="ProfileUpdate Modal"
                >
                    <div>
                        <ul>
                            <li className="flex"><p className="w-6/12"> 車番号: </p>{carNumber}</li>
                            <li className="flex"><p className="w-6/12"> ステータス: </p>{STATUS_LIST[carState - 1]}</li>
                            <li className="flex"><p className="w-6/12"> 担当者: </p>{charger}</li>
                            <li className="flex"><p className="w-6/12"> 締切日: </p>{deadline}</li>
                        </ul>
                    </div>
                    <div className="mt-6">
                        <h5 className="text-right text-xs">
                            問い合わせ
                        </h5>
                        <div className=" bg-[#33333320] rounded-xl flex flex-col gap-5 p-3">
                            <div className="chat flex flex-col gap-4">
                                <div className="w-full">
                                    <p className="text-xs bg-white w-8/12">
                                        テキストテキスト
                                    </p>
                                </div>
                                <div className="w-full flex justify-end">
                                    <p className="text-xs bg-white w-8/12">
                                        テキストテキスト
                                        テキストテキスト
                                    </p>
                                </div>
                                <div className="w-full">
                                    <p className="text-xs bg-white w-8/12">
                                        テキストテキスト
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white p-2 w-full flex justify-between items-center rounded-3xl">
                                <input type="text" className="w-9/12 outline-none border-none"/>
                                <button className="p-0 px-3 h-fit">
                                    <img className="w-[20px]" src="../../../../public/assets/img/send-alt-1-svgrepo-com.svg" alt="send_img" />
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
            <div className="absolute top-[-20px] left-0 w-20">
				<img className="bg-white" src="../../public/assets/img/repair_img.png" alt="profile_img" />
			</div>
        </div>
    )
}   


export default Worklist;





