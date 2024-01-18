import { useEffect, useState } from "react";
import { axiosTokenApi } from "../utils/axios";
import Modal from 'react-modal';


const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
		width: '50vw',
		padding: '3rem',
	},
};

const Profile = () => {

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirm, setPasswordConfirm] = useState("");
	const [address, setAddress] = useState("");
	const [tel, setTel] = useState("");
	const [modalIsOpen, setIsOpen] = useState(false);

	useEffect(() => {
		getProfile();
	}, [])

	const getProfile = () => {
		axiosTokenApi.post("/api/auth/user/")
			.then(res => {
				const profile = res.data;
				setName(profile.name);
				setEmail(profile.email);
				setAddress(profile.address);
				setTel(profile.tel);
			})
			.catch(err => {
				console.log(err)
			});
	};

	let subtitle;

	function openModal() {
		setIsOpen(true);
	}

	function afterOpenModal() {
		subtitle.style.color = '#f00';
	}

	function closeModal() {
		setIsOpen(false);
	}

	const handleProfileUpdate = () => {
		if(password.length < 8) {
      console.log('password length is less than 8');
      return;
    }

    if(password !== passwordConfirm) {
      console.log('Password confirm is not valid');
      return;
    }

		axiosTokenApi
			.post('api/auth/profile/', {
				email: email,
				password: password,
				name: name,
				tel: tel,
				address: address
			})
			.then(() => {
				getProfile();
			})
			.catch((err) => {
				console.log(err);
			})

	}

	return (
		<div className="w-full md:w-[45%] relative">
			<h2 className="text-right text-[24px] font-semibold">
				Profile
			</h2>
			<div className="relative w-full p-10 border border-solid border-[#33333333] rounded-xl flex flex-col gap-5">
				<div className="flex gap-6 items-center border-b border-solid border-[#33333333]">
					<p className="w-6/12">
						名前
					</p>
					<p>
						{name}
					</p>
				</div>
				<div className="flex gap-6 items-center border-b border-solid border-[#33333333]">
					<p className="w-6/12">
						メールアドレス
					</p>
					<p>
						{email}
					</p>
				</div>
				<div className="flex gap-6 items-center border-b border-solid border-[#33333333]">
					<p className="w-6/12">
						住所
					</p>
					<p>
						{address}
					</p>
				</div>
				<div className="flex gap-6 items-center border-b border-solid border-[#33333333]">
					<p className="w-6/12">
						電話番号
					</p>
					<p>
						{tel}
					</p>
				</div>
				<div className="absolute top-2 right-2" id="yourAppElement">
					<button onClick={openModal}>
						編集
					</button>
					<Modal
						isOpen={modalIsOpen}
						onAfterOpen={afterOpenModal}
						onRequestClose={closeModal}
						style={customStyles}
						contentLabel="ProfileUpdate Modal"
					>
						<h2 className="text-4xl mb-6" ref={(_subtitle) => (subtitle = _subtitle)}>Edit Profile</h2>
						<div className="flex flex-col gap-4">
							<div className="flex items-center">
								<p className="w-6/12">名前</p>
								<input type="text"
									required
									className="border border-solid border-[#33333333] p-2 text-[14px] w-6/12"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</div>
							<div className="flex items-center">
								<p className="w-6/12">メールアドレス</p>
								<input type="email"
									required
									className="border border-solid border-[#33333333] p-2 text-[14px] w-6/12"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
							<div className="flex items-center">
								<p className="w-6/12">パスワード</p>
								<input 
									type="text"
									required
									className="border border-solid border-[#33333333] p-2 text-[14px] w-6/12"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>
							<div className="flex items-center">
								<p className="w-6/12">パスワードの確認</p>
								<input 
									type="text"
									required
									className="border border-solid border-[#33333333] p-2 text-[14px] w-6/12"
									value={passwordConfirm}
									onChange={(e) => setPasswordConfirm(e.target.value)}
								/>
							</div>
							<div className="flex items-center">
								<p className="w-6/12">住所</p>
								<input 
									type="text"
									className="border border-solid border-[#33333333] p-2 text-[14px] w-6/12"
									value={address}
									onChange={(e) => setAddress(e.target.value)}
								/>
							</div>
							<div className="flex items-center">
								<p className="w-6/12">電話番号</p>
								<input
									type="text"
									required
									className="border border-solid border-[#33333333] p-2 text-[14px] w-6/12"
									value={tel}
									onChange={(e) => setTel(e.target.value)}
								/>
							</div>
						</div>
						<div>
							<button onClick={handleProfileUpdate}>
								OK
							</button>
							<button className="" onClick={closeModal}>
								Close
							</button>
						</div>
					</Modal>
				</div>
			</div>
			<div className="absolute top-[-20px] left-0 w-20">
				<img src="../../public/assets/img/profile_img.png" alt="profile_img" />
			</div>
		</div>
	)
}


export default Profile;