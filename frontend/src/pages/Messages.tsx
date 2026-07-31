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
import { useSearchParams } from 'react-router-dom';
import { SidebarSkeleton } from '../components/SkeletonLoader';
import { Send, MessageSquare } from 'lucide-react';

export const Messages: React.FC = () => {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
  const targetUserParam = searchParams.get('user');

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

  // Message polling to simulate real-time chat without websockets
  useEffect(() => {
    if (!activePartnerId) return;

    const interval = setInterval(() => {
      dispatch(fetchMessageHistory(activePartnerId));
    }, 4000); // Poll every 4 seconds

    return () => clearInterval(interval);
  }, [activePartnerId, dispatch]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  const handleSelectPartner = (partnerId: string) => {
    setSearchParams({ user: partnerId });
    dispatch(setActivePartner(partnerId));
    dispatch(fetchMessageHistory(partnerId));
  };

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
    <div className="flex-1 flex h-[calc(100vh-4rem)] bg-dark-950/40 border border-dark-200 dark:border-dark-800 rounded-3xl overflow-hidden shadow-sm transition-colors duration-200">
      
      {/* Sidebar: Conversation List */}
      <div className="w-full md:w-80 border-r border-dark-200 dark:border-dark-800 bg-white dark:bg-dark-900 flex flex-col">
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
      <div className="flex-grow flex flex-col bg-white dark:bg-dark-850">
        {activePartnerId ? (
          <>
            {/* Header */}
            <div className="h-14 px-6 border-b border-dark-150 dark:border-dark-800 flex items-center bg-white dark:bg-dark-900 justify-between shrink-0">
              <div>
                <h3 className="text-sm font-bold text-dark-900 dark:text-white leading-tight">
                  {activePartnerName}
                </h3>
                <span className="text-[10px] font-medium text-brand-500 capitalize">
                  {activeConversation?.role} Profile
                </span>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-grow p-6 overflow-y-auto space-y-4">
              {activeMessages.map((msg) => {
                const isSentByMe = user && msg.sender === user.id;
                return (
                  <div
                    key={msg._id}
                    className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
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
              className="p-4 bg-white dark:bg-dark-900 border-t border-dark-150 dark:border-dark-800 flex items-center space-x-3 shrink-0"
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
