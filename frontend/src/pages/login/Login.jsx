import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../hooks/useLogin";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const { loading, login } = useLogin();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await login(username, password);
	};

	return (
		<div className='relative flex flex-col items-center justify-center min-h-screen px-4 overflow-hidden'>
			{/* Anime Art Background */}
			<div 
				className='absolute inset-0 z-0'
				style={{ backgroundImage: `url(/login_bg.png)`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
			>
				{/* Dark overlay so card pops */}
				<div className='absolute inset-0' style={{ background: 'rgba(0,0,0,0.55)' }}></div>
			</div>

			<div className='w-full max-w-md p-10 glass-morphism border-t-4 border-crimson-glow relative z-10 overflow-hidden group shadow-2xl'>
				{/* Background Glow Element */}
				<div className='absolute -right-10 -top-10 w-40 h-40 bg-crimson-glow opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity'></div>

				<div className='text-center mb-10'>
					<h1 className='text-4xl font-orbitron font-bold text-white mb-2 tracking-[0.2em] crimson-glow-text'>
						LOGIN
					</h1>
					<p className='text-[10px] font-inter text-blood-red uppercase tracking-widest font-bold'>Authorized Access Only</p>
				</div>

				<form onSubmit={handleSubmit} className='space-y-8'>
					<div className='relative group/input'>
						<label className='block text-xs font-orbitron text-gray-500 mb-2 uppercase tracking-tight group-focus-within/input:text-crimson-glow transition-colors'>
							Codename / Username
						</label>
						<input
							type='text'
							placeholder='IDENTIFY YOURSELF'
							className='w-full bg-deep-black/40 border-b-2 border-blood-red/30 py-3 text-white font-orbitron text-sm focus:outline-none focus:border-crimson-glow transition-all placeholder:text-gray-700'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>

					<div className='relative group/input'>
						<label className='block text-xs font-orbitron text-gray-500 mb-2 uppercase tracking-tight group-focus-within/input:text-crimson-glow transition-colors'>
							Access Protocol / Password
						</label>
						<input
							type='password'
							placeholder='DECRYPT KEY'
							className='w-full bg-deep-black/40 border-b-2 border-blood-red/30 py-3 text-white font-orbitron text-sm focus:outline-none focus:border-crimson-glow transition-all placeholder:text-gray-700'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>

					<div className='flex flex-col gap-4 mt-10'>
						<button 
							className='w-full py-4 bg-blood-red text-white font-orbitron text-xs tracking-[0.3em] font-bold hover:bg-crimson-glow hover:shadow-crimson-outer transition-all duration-300 disabled:opacity-50'
							disabled={loading}
						>
							{loading ? <span className='loading loading-spinner'></span> : "INITIALIZE SESSION"}
						</button>

						<Link to='/signup' className='text-[10px] font-orbitron text-gray-500 hover:text-white text-center transition-colors uppercase tracking-widest'>
							Need Credentials? <span className='text-blood-red font-bold underline ml-1'>Register</span>
						</Link>
					</div>
				</form>
				
				{/* Decorative corner element */}
				<div className='absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-crimson-glow/30'></div>
			</div>
		</div>
	);
};
export default Login;

