import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";

const Sidebar = () => {
	return (
		<div className='w-[350px] border-r-2 border-blood-red/20 flex flex-col bg-deep-black/30'>
			<div className='p-6 pb-2'>
				<p className='font-orbitron text-[10px] text-blood-red tracking-[0.3em] font-bold mb-4 uppercase'>Personnel Directory</p>
				<SearchInput />
			</div>
			<div className='h-[1px] bg-gradient-to-r from-transparent via-blood-red/40 to-transparent my-4'></div>
			<div className='flex-1 overflow-y-auto px-2'>
				<Conversations />
			</div>
		</div>
	);
};
export default Sidebar;


