import MessageContainer from "../../components/messages/MessageContainer";

import Sidebar from "../../components/sidebar/Sidebar";

const Chat = () => {
	return (
		<div className='flex flex-col items-center justify-center min-h-[80vh] px-4 py-8'>
			<div className='flex w-full max-w-6xl h-[700px] glass-morphism border-2 border-blood-red/20 shadow-2xl relative overflow-hidden group'>
				{/* Background Glow Element */}
				<div className='absolute -left-20 -bottom-20 w-80 h-80 bg-blood-red opacity-5 rounded-full blur-[100px] pointer-events-none'></div>
				
				<Sidebar />
				<MessageContainer />
				
				{/* Decorative Border Glow */}
				<div className='absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-crimson-glow to-transparent shadow-crimson-outer opacity-50 pulse-animation'></div>
			</div>
		</div>
	);
};
export default Chat;
