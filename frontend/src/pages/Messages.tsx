/**
 * @module Messages
 *
 * Renders the direct messaging interface.
 * Handles displaying conversation lists, message history, sending messages,
 * and simulating real-time updates via polling.
 */
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import {
  fetchConversations,
  fetchMessageHistory,
  sendDirectMessage,
  setActivePartner,
} from '../store/slices/chatSlice';
import { useAuth } from '../context/AuthContext';
import { useSearchParams, useNavigate } from 'react-router';
import { SidebarSkeleton } from '../components/SkeletonLoader';
import { Send, MessageSquare, ArrowLeft } from 'lucide-react';
import { useSocket } from '../context/SocketContext';

/**
 * Renders the messages page layout including the sidebar for conversations
 * and the main chat window.
 *
 * Automatically polls for new messages for the active partner and handles
 * deep linking to specific chats via URL parameters.
 *
 * @returns {React.ReactElement} The Messages component.
 */
export const Messages: React.FC = () => {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const targetUserParam = searchParams.get('user');
  const { socket } = useSocket();

  /**
   * Parses message text to convert URLs into clickable anchor elements.
   *
   * @param {string} text  The raw message text.
   * @returns {React.ReactNode[]} An array of strings and React elements.
   */
  const renderMessageContent = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline font-semibold text-blue-400 hover:text-blue-300">
            Link
          </a>
        );
      }
      return part;
    });
  };

  const { conversations, activeMessages, activePartnerId, loading } = useSelector(
    (state: RootState) => state.chat
  );

  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations on mount
  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  // Handle URL-directed chat partner
  useEffect(() => {
    if (targetUserParam) {
      dispatch(setActivePartner(targetUserParam));
      dispatch(fetchMessageHistory(targetUserParam));
    }
  }, [targetUserParam, dispatch]);

  // Listen for real-time messages via WebSocket
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg: any) => {
      // Update conversations list to reflect the new message
      dispatch(fetchConversations());
      
      // If the message belongs to the currently active chat, append it or refetch
      if (activePartnerId && (msg.sender === activePartnerId || msg.receiver === activePartnerId)) {
        dispatch(fetchMessageHistory(activePartnerId));
      }
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, activePartnerId, dispatch]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  /**
   * Selects a chat partner, updating the active state and URL parameter,
   * then fetches their message history.
   *
   * @param {string} partnerId  The unique identifier of the selected chat partner.
   */
  const handleSelectPartner = (partnerId: string) => {
    setSearchParams({ user: partnerId });
    dispatch(setActivePartner(partnerId));
    dispatch(fetchMessageHistory(partnerId));
  };
  const handleBackToConversations = () => {
    setSearchParams({});
    dispatch(setActivePartner(null));
  }
  const handleOpenProfile = (partnerId: string) => {
    if(!partnerId) return;
    navigate(`/profile/${partnerId}`);
  }

  /**
   * Submits the new message form and dispatches the send action to the Redux store.
   *
   * @param {React.FormEvent} e  The form submission event.
   * @returns {Promise<void>} Resolves when the message send completes.
   */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activePartnerId) return;

    setSending(true);
    try {
      await dispatch(
        sendDirectMessage({ receiverId: activePartnerId, content: messageText })
      ).unwrap();
      setMessageText('');
    } catch (err: any) {
      alert(err || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  // Find details of active partner
  const activeConversation = conversations.find((c) => c.userId === activePartnerId);
  const activePartnerName = activeConversation?.displayName || 'Chat Partner';

  return (
    <div className="flex-1 flex h-[calc(100dvh-4rem)] md:h-[calc(100vh-4rem)] bg-dark-950/40 border border-dark-200 dark:border-dark-800 md:rounded-3xl overflow-hidden shadow-sm transition-colors duration-200"> 
      {/* Sidebar: Conversation List */}
      <div
        className={`${
          activePartnerId ? 'hidden md:flex' : 'flex'
          } w-full md:w-80 shrink-0 border-r border-dark-200 dark:border-dark-800 bg-white dark:bg-dark-900 flex-col`}
        >
        <div className="p-4 border-b border-dark-150 dark:border-dark-800 shrink-0">
          <h2 className="text-base font-bold text-dark-900 dark:text-white">Conversations</h2>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-dark-150 dark:divide-dark-800/50">
          {loading && conversations.length === 0 ? (
            <div className="p-4"><SidebarSkeleton /></div>
          ) : conversations.length === 0 ? (
            <div className="px-4 py-8 text-center text-xs text-dark-400">
              No active conversations yet. Find recruiters or talent in Scouting to initiate a chat.
            </div>
          ) : (
            conversations.map((conv) => {
              const isActive = conv.userId === activePartnerId;
              return (
                <button
                  key={conv.userId}
                  onClick={() => handleSelectPartner(conv.userId)}
                  className={`w-full flex items-start space-x-3 p-4 text-left transition duration-150 ${
                    isActive
                      ? 'bg-brand-500/10 border-l-4 border-brand-500'
                      : 'hover:bg-dark-50 dark:hover:bg-dark-800/40'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-500 font-extrabold flex items-center justify-center shrink-0 text-sm">
                    {conv.displayName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-xs font-bold text-dark-900 dark:text-white truncate">
                        {conv.displayName}
                      </h4>
                      {conv.lastMessage && (
                        <span className="text-[9px] text-dark-400">
                          {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] font-semibold text-brand-500 capitalize mt-0.5">{conv.role}</p>
                    {conv.lastMessage && (
                      <p className="text-[11px] text-dark-500 dark:text-dark-350 truncate mt-1">
                        {conv.lastMessage.content}
                      </p>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main Panel: Chat Window */}
      <div
      className={`${
        activePartnerId ? 'flex' : 'hidden md:flex'
      } flex-1 min-w-0 flex-col bg-white dark:bg-dark-850`}
      >
      {activePartnerId? (
        <>
            {/* Header */}
<div className="h-14 px-3 sm:px-6 border-b border-dark-150 dark:border-dark-800 flex items-center bg-white dark:bg-dark-900 shrink-0">
  <button
    type="button"
    onClick={handleBackToConversations}
    className="md:hidden mr-3 p-2 rounded-lg text-dark-500 hover:text-dark-900 dark:text-dark-400 dark:hover:text-white hover:bg-dark-100 dark:hover:bg-dark-800 transition"
    aria-label="Back to conversations"
  >
    <ArrowLeft className="w-5 h-5" />
  </button>
  <div className="min-w-0">
    <h3
      onClick={() => {
        if (activePartnerId) {
          handleOpenProfile(activePartnerId);
        }
      }}
      className="text-sm font-bold text-dark-900 dark:text-white leading-tight cursor-pointer hover:underline truncate"
    >
      {activePartnerName}
    </h3>
    <button
      type="button"
      onClick={() => {
        if (activePartnerId) {
          handleOpenProfile(activePartnerId);
        }
      }}
      className="text-[10px] font-medium text-brand-500 capitalize hover:underline"
    >
      {activeConversation?.role} Profile
    </button>
  </div>
</div>       
            {/* Message Area */}
            <div className="flex-1 min-h-0 p-3 sm:p-6 overflow-y-auto space-y-4">
              {activeMessages.map((msg) => {
                const isSentByMe = user && msg.sender === user.id;
                return (
                  <div
                    key={msg._id}
                    className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                        isSentByMe
                          ? 'bg-brand-500 text-white rounded-tr-none shadow-md shadow-brand-500/10'
                          : 'bg-dark-100 dark:bg-dark-700 text-dark-800 dark:text-slate-100 rounded-tl-none'
                      }`}
                    >
                      <p className="break-words">{renderMessageContent(msg.content)}</p>
                      <span
                        className={`text-[8px] mt-1 block text-right ${
                          isSentByMe ? 'text-brand-100' : 'text-dark-400'
                        }`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSendMessage}
              className="p-2 sm:p-4 bg-white dark:bg-dark-900 border-t border-dark-150 dark:border-dark-800 flex items-center gap-2 sm:gap-3 shrink-0"
            >
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow px-4 py-2.5 text-xs rounded-xl theme-input"
              />
              <button
                type="submit"
                disabled={sending || !messageText.trim()}
                className="bg-brand-500 hover:bg-brand-600 disabled:bg-dark-850 disabled:text-dark-500 text-white p-2.5 rounded-xl transition duration-150 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-dark-400">
            <MessageSquare className="w-12 h-12 text-dark-600 mb-3 animate-pulse" />
            <h3 className="text-sm font-bold text-dark-300">Select a conversation</h3>
            <p className="text-xs text-dark-500 mt-1 max-w-xs">
              Choose an active chat partner on the left sidebar to start messaging.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Messages;
