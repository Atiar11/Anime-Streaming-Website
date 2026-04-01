import { Link } from "react-router-dom";
import GenderCheckbox from "./GenderCheckbox";
import { useState } from "react";
import useSignup from "../../hooks/useSignup";

const SignUp = () => {
	const [inputs, setInputs] = useState({
		fullName: "",
		username: "",
		password: "",
		confirmPassword: "",
		gender: "",
	});

	const { loading, signup } = useSignup();

	const handleCheckboxChange = (gender) => {
		setInputs({ ...inputs, gender });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		await signup(inputs);
	};

	return (
		<div className='relative flex flex-col items-center justify-center min-h-screen px-4 py-10 overflow-hidden'>
			{/* Anime Art Background */}
			<div 
				className='absolute inset-0 z-0'
				style={{ backgroundImage: `url(/login_bg.png)`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
			>
				{/* Dark overlay so card pops */}
				<div className='absolute inset-0' style={{ background: 'rgba(0,0,0,0.55)' }}></div>
			</div>

			<div className='w-full max-w-xl p-10 glass-morphism border-b-4 border-crimson-glow relative z-10 overflow-hidden group shadow-2xl'>
				{/* Background Glow Element */}
				<div className='absolute -left-10 -bottom-10 w-40 h-40 bg-crimson-glow opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity'></div>

				<div className='text-center mb-10'>
					<h1 className='text-4xl font-orbitron font-bold text-white mb-2 tracking-[0.2em] crimson-glow-text uppercase'>
						REGISTER
					</h1>
					<p className='text-[10px] font-inter text-blood-red uppercase tracking-widest font-bold'>Join the Elite Archive</p>
				</div>

				<form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6'>
					<div className='relative group/input'>
						<label className='block text-[10px] font-orbitron text-gray-500 mb-2 uppercase tracking-tighter group-focus-within/input:text-crimson-glow transition-colors'>
							Official Designation / Full Name
						</label>
						<input
							type='text'
							placeholder='NAME YOURSELF'
							className='w-full bg-deep-black/40 border-b-2 border-blood-red/30 py-2 text-white font-orbitron text-xs focus:outline-none focus:border-crimson-glow transition-all placeholder:text-gray-700'
							value={inputs.fullName}
							onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
						/>
					</div>

					<div className='relative group/input'>
						<label className='block text-[10px] font-orbitron text-gray-500 mb-2 uppercase tracking-tighter group-focus-within/input:text-crimson-glow transition-colors'>
							Alias / Username
						</label>
						<input
							type='text'
							placeholder='CODENAME'
							className='w-full bg-deep-black/40 border-b-2 border-blood-red/30 py-2 text-white font-orbitron text-xs focus:outline-none focus:border-crimson-glow transition-all placeholder:text-gray-700'
							value={inputs.username}
							onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
						/>
					</div>

					<div className='relative group/input'>
						<label className='block text-[10px] font-orbitron text-gray-500 mb-2 uppercase tracking-tighter group-focus-within/input:text-crimson-glow transition-colors'>
							Access Protocol / Password
						</label>
						<input
							type='password'
							placeholder='DECRYPT KEY'
							className='w-full bg-deep-black/40 border-b-2 border-blood-red/30 py-2 text-white font-orbitron text-xs focus:outline-none focus:border-crimson-glow transition-all placeholder:text-gray-700'
							value={inputs.password}
							onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
						/>
					</div>

					<div className='relative group/input'>
						<label className='block text-[10px] font-orbitron text-gray-500 mb-2 uppercase tracking-tighter group-focus-within/input:text-crimson-glow transition-colors'>
							Verify Key / Confirm
						</label>
						<input
							type='password'
							placeholder='REPEAT KEY'
							className='w-full bg-deep-black/40 border-b-2 border-blood-red/30 py-2 text-white font-orbitron text-xs focus:outline-none focus:border-crimson-glow transition-all placeholder:text-gray-700'
							value={inputs.confirmPassword}
							onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
						/>
					</div>

					<div className='md:col-span-2 py-4'>
						<p className='text-[10px] font-orbitron text-gray-500 mb-4 uppercase tracking-widest'>Select Identity Fragment</p>
						<GenderCheckbox onCheckboxChange={handleCheckboxChange} selectedGender={inputs.gender} />
					</div>

					<div className='md:col-span-2 flex flex-col gap-4 mt-6'>
						<button 
							className='w-full py-4 bg-blood-red text-white font-orbitron text-xs tracking-[0.3em] font-bold hover:bg-crimson-glow hover:shadow-crimson-outer transition-all duration-300 disabled:opacity-50'
							disabled={loading}
						>
							{loading ? <span className='loading loading-spinner'></span> : "ESTABLISH ACCOUNT"}
						</button>

						<Link to='/login' className='text-[10px] font-orbitron text-gray-500 hover:text-white text-center transition-colors uppercase tracking-widest'>
							Already Logged? <span className='text-blood-red font-bold underline ml-1'>Authenticate</span>
						</Link>
					</div>
				</form>
				
				{/* Decorative corner element */}
				<div className='absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-crimson-glow/30'></div>
			</div>
		</div>
	);
};
export default SignUp;

