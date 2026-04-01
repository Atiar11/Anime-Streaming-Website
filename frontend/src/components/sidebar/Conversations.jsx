import useGetConversations from "../../hooks/useGetConversations";
import { getRandomEmoji } from "../../utils/emojis";
import Conversation from "./Conversation";
import useConversation from "../../zustand/useConversation";

const Conversations = () => {
	const { loading, conversations } = useGetConversations();
	const { searchTerm } = useConversation();

	const filteredConversations = conversations.filter((conversation) =>
		conversation.fullName.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className='py-2 flex flex-col overflow-auto'>
			{filteredConversations.map((conversation, idx) => (
				<Conversation
					key={conversation._id}
					conversation={conversation}
					emoji={getRandomEmoji()}
					lastIdx={idx === filteredConversations.length - 1}
				/>
			))}
			
			{!loading && filteredConversations.length === 0 && (
				<p className='text-center text-gray-500 mt-4 font-orbitron text-[10px] uppercase tracking-widest'>No users found</p>
			)}

			{loading ? <span className='loading loading-spinner mx-auto'></span> : null}
		</div>
	);
};
export default Conversations;

