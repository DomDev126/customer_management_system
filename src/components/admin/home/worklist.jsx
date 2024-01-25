import { Fragment, useEffect, useState } from "react";
import { axiosTokenApi } from "../../../utils/axios";
import { STATUS_LIST } from "../../../utils/const";
import { Dialog, Transition } from '@headlessui/react'
import ImageInput from "./ImageInput";
import { IoSend } from "react-icons/io5";
import { useAuth } from "../../../context/AuthContext";
import { addDoc, collection, doc, increment, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";

const WorkAdminList = () => {
  const auth = useAuth();

  const [jobs, setJobs] = useState([]);
  const [open, setOpen] = useState(false);
  const [carNumber, setCarNumber] = useState(null);
  const [carState, setCarState] = useState(null);
  const [charger, setCharger] = useState("");
  const [budget, setBudget] = useState(null);
  const [deadline, setDeadline] = useState("");
  const [title, setTitle] = useState("");
  const [userName, setUserName] = useState("");
  const [isEdit, setIsEdit] = useState(true);
  const [jobId, setJobId] = useState(null);
  const [originalImageUrl, setOriginalImageUrl] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [resultImageUrl, setResultImageUrl] = useState(null);
  const [resultFile, setResultFile] = useState(null);
  const [messages, setMessages] = useState([]);
	const [chatMessage, setChatMessage] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    getJobList();
  }, [])

	useEffect(() => {
		const unSubscribe = onSnapshot(
			query(
				collection(
					db,
					"users",
					String("admin"),
					"jobs",
				),
			),
			async (snapshot) => {
        const res = await axiosTokenApi.get("/api/job/jobs/");
        let _jobs = res.data.map(job => {
          let isUnread = false;
          snapshot.forEach(doc => {
            const documentData = doc.data()
            if(documentData.unreadCount && parseInt(job.id) === parseInt(doc.id)) {
              isUnread = true;
            }
          })
          return { ...job, isUnread: isUnread }
        });
        setJobs(_jobs);
			}
		);

		return () => {
			unSubscribe();
		};
	}, [auth])


	useEffect(() => {
		if (jobId) {
			const unSubscribe = onSnapshot(
				query(
					collection(
						db,
						"users",
						String("admin"),
						"jobs",
						String(jobId),
						"messages"
					),
					orderBy("timestamp")
				),
				(snapshot) => {
					setMessages(
						snapshot.docs.map((doc) => {
							const documentData = doc.data();
							return {
								id: doc.id,
								isAdmin: documentData.isAdmin,
								content: documentData.content
							};
						})
					)
				}
			);

			return () => {
				unSubscribe();
			};
		}
	}, [auth, jobId]);

  const getJobList = () => {
    axiosTokenApi
      .get("/api/job/jobs/")
      .then(res => {
        setJobs(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }

	const sendMessage = async () => {
		if (chatMessage === "") {
			return;
		}
		try {
			await addDoc(
				collection(
					db,
					"users",
					String("admin"),
					"jobs",
					String(jobId),
					"messages"
				),
				{
					content: chatMessage,
					timestamp: new Date(),
					isAdmin: true
				},
			);
			signMessages();

			await addDoc(
				collection(
					db,
					"users",
					String(userId),
					"jobs",
					String(jobId),
					"messages"
				),
				{
					content: chatMessage,
					timestamp: new Date(),
					isAdmin: true
				}
			);
			await setDoc(
				doc(
					db,
					"users",
					String(userId),
					"jobs",
					String(jobId)
				),
				{
					unreadCount: increment(1),
				}
			);
			// contentRef.current?.scrollToBottom(500);
		} catch (error) {
			console.log(error);
		}
		setChatMessage("");
	};

	const signMessages = async () => {
		await setDoc(
			doc(
				db,
				"users",
				String("admin"),
				"jobs",
				String(jobId)
			),
			{
				unreadCount: 0,
			}
		);
	}

  const openJobDetail = (_jobId) => {
    setIsEdit(true);
    setOpen(true);
    setJobId(_jobId);
    axiosTokenApi
      .get("api/job/job_detail/", { params: { job_id: _jobId } })
      .then(res => {
        setCarNumber(res.data.car_number);
        setCharger(res.data.charger);
        setDeadline(res.data.deadline);
        setBudget(res.data.budget);
        setCarState(res.data.status);
        setUserName(res.data.user.name);
        setTitle(res.data.title);
        setOriginalImageUrl(res.data.original_image_url);
        setOriginalFile(null);
        setResultImageUrl(res.data.result_image_url);
        setResultFile(null);
        setUserId(res.data.user.id);
        signMessages();
      })
      .catch(err => {
        console.log(err);
      })
  }

  const handleUpdate = () => {
    const payload = {
      job_id: jobId,
      user: userId,
      status: carState,
    };

    if (carNumber) payload['car_number'] = carNumber;
    if (deadline) payload['deadline'] = deadline;
    if (charger) payload['charger'] = charger;
    if (budget) payload['budget'] = budget;
    if (title) payload['title'] = title;
    if (originalFile) payload['original_image_url'] = originalFile;
    if (resultFile) payload['result_image_url'] = resultFile;

    axiosTokenApi
      .put(
        "/api/job/jobs/", 
        payload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      .then(() => {
        openJobDetail(jobId);
        getJobList();
      });

    setIsEdit(true);
  }
  return (
    <div className="flex flex-col gap-6 w-[90%] 2xl:w-7/12">
      <h3 className="text-3xl font-semibold">
        作業一覧
      </h3>
      <div className="w-[90vw] lg:w-full overflow-auto lg:overflow-hidden">
        <table className="w-[860px] lg:w-full table-fixed">
          <thead>
            <tr>
              <th>車番号</th>
              <th>顧客名</th>
              <th>担当者名</th>
              <th>工程</th>
              <th>ステータス</th>
              <th>見積額</th>
              <th>締切日</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, index) => (
              <tr className="cursor-pointer" key={index} onClick={() => { openJobDetail(job.id) }}>
                <td className="relative">
                  {job.car_number}
                  {job.isUnread &&
                    <span className="absolute right-0 top-1 w-3 h-3 rounded-full bg-red-500"></span>
                  }
                </td>
                <td>{job.user.name}</td>
                <td>{job.charger}</td>
                <td>{job.title}</td>
                <td>{STATUS_LIST[job.status - 1]}</td>
                <td>{job.budget}</td>
                <td>{job.deadline}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          <div className="flex justify-between items-center">
                            <h2 className="text-[24px]">作業詳細</h2>
                            <button onClick={() => (setOpen(false))} className="flex justify-center items-center w-[24px] h-[24px] p-0 hover:border-slate-200 rounded-full">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M18 6L6 18M18 18L6 6.00001" stroke="#6E7475" strokeWidth="2" strokeLinecap="round" />
                              </svg>
                            </button>
                          </div>
                        </Dialog.Title>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <div>
                          <ul className="relative flex flex-col gap-3 border border-solid border-[#33333370] rounded-md p-2">
                            <li className="flex">
                              <p className="w-5/12">
                                顧客名
                              </p>
                              <p>
                                {userName}
                              </p>
                            </li>
                            <li className="flex">
                              <p className="w-5/12">
                                車名称
                              </p>
                              {isEdit ?
                                <p>
                                  {carNumber}
                                </p>
                                :
                                <input type="text" className=" w-6/12" value={carNumber} onChange={(e) => setCarNumber(e.target.value)} />

                              }
                            </li>
                            <li className="flex">
                              <p className="w-5/12">
                                工程
                              </p>
                              {
                                isEdit ?
                                  <p>
                                    {title}
                                  </p>
                                  :
                                  <input type="text" className=" w-6/12" value={title} onChange={(e) => setTitle(e.target.value)} />
                              }
                            </li>
                            <li className="flex">
                              <p className="w-5/12">
                                ステータス
                              </p>
                              {
                                isEdit ?
                                  <p>
                                    {STATUS_LIST[carState - 1]}
                                  </p>
                                  :
                                  <select className="border border-solid border-[#33333333] w-6/12 p-1" onChange={(e) => setCarState(e.target.value)}>
                                    {STATUS_LIST.map((STATUS, index) => (
                                      <option key={`statys_option${index}`} selected={carState === (index + 1) ? true : false} value={index + 1}>{STATUS}</option>
                                    ))}
                                  </select>
                              }
                            </li>
                            <li className="flex">
                              <p className="w-5/12">
                                担当者
                              </p>
                              {
                                isEdit ?
                                  <p>
                                    {charger}
                                  </p>
                                  :
                                  <input type="text" className=" w-6/12" value={charger} onChange={(e) => setCharger(e.target.value)} />
                              }
                            </li>
                            <li className="flex">
                              <p className="w-5/12">
                                見積もり
                              </p>
                              {
                                isEdit ?
                                  <p>
                                    {budget}
                                  </p>
                                  :
                                  <input type="text" className="text-end w-6/12" value={budget} onChange={(e) => setBudget(e.target.value)} />
                              }
                            </li>
                            <li className="flex">
                              <p className="w-5/12">
                                締切日
                              </p>
                              {
                                isEdit ?
                                  <p>
                                    {deadline}
                                  </p>
                                  :
                                  <input type="date" className=" w-6/12" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                              }
                            </li>
                            {isEdit ?
                              <button className="absolute -top-14 right-8 bg-[#1677ff] text-white text-lg p-1 px-3" onClick={() => setIsEdit(false)}>編集</button>
                              :
                              <button className="absolute -top-14 right-8 bg-[#1677ff] text-white text-lg p-1 px-3" onClick={handleUpdate}>保存</button>
                            }
                          </ul>
                          <div className="border border-slate-400 flex flex-col justify-center items-start mt-4 p-4 rounded">
                            <p className="pb-2 text-lg">作業前画像</p>
                            {isEdit ? 
                              ((originalImageUrl) ?
                                <img className=" w-full rounded" src={originalImageUrl} alt="Origin" /> :
                                <p className="pl-6">画像ない</p>
                              ):
                              <ImageInput defaultAvatar={originalImageUrl} onUpload={setOriginalFile} />
                            }
                          </div>
                          <div className="border border-slate-400 flex flex-col justify-center items-start mt-4 p-4 rounded">
                            <p className="pb-2 text-lg">作業後画像</p>
                            {isEdit ? 
                              ((resultImageUrl) ?
                                <img className=" w-full rounded" src={resultImageUrl} alt="Result" /> :
                                <p className="pl-6">画像ない</p>
                              ):
                              <ImageInput defaultAvatar={resultImageUrl} onUpload={setResultFile} />
                            }
                          </div>
                        </div>
                        <div className="mt-6">
                          <h3 className="text-left text-base font-bold py-4">
                            問い合わせ
                          </h3>
                          <div className="relative">
                            <div className="bg-[#33333320] rounded-xl flex flex-col gap-3 p-3 pb-20 h-[500px] overflow-y-auto scroll-smooth">
                              {messages && messages.map((message, index) => (
                                <div
                                  key={`message_${index}`}
                                  className={`
                                    flex 
                                    ${message.isAdmin ? 'justify-start' : 'justify-end'}
                                  `}
                                >
                                  <p className={`
                                    ${message.isAdmin ? 'bg-white' : 'bg-green-100'}
                                    shadow
                                    rounded-lg
                                    px-3
                                    py-1
                                    text-black
                                    text-[18px]
                                  `}>{message.content}</p>
                                </div>
                              ))}
                            </div>
                            <div className="absolute bottom-2 left-2 bg-white p-2 w-[95%] flex justify-between items-center rounded-3xl">
                              <input
                                type="text"
                                className="w-9/12 outline-none border-none text-[18px]"
                                value={chatMessage}
                                onChange={(e) => (setChatMessage(e.target.value))}
                              />
                              <IoSend
                                className={`cursor-pointer hover:scale-125`}
                                onClick={() => (sendMessage())}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  )
}

export default WorkAdminList;