'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import PollList from '@/components/PollList';
import CreatePollModal from '@/components/CreatePollModal';
import { PollWithDetails, apiClient } from '@/lib/api';
import { wsClient } from '@/lib/websocket';
import { toast, Toaster } from 'sonner';

export default function HomePage() {
  const router = useRouter();
  const [polls, setPolls] = useState<PollWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPollId, setSelectedPollId] = useState<number | null>(null);
  const [userId] = useState(() => `user_${Math.random().toString(36).substr(2, 9)}`);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'trending'>('newest');

  // Load polls
  const loadPolls = async (status: 'all' | 'active', sort: 'newest' | 'popular' | 'trending') => {
    try {
      setIsLoading(true);
      const pollsData = await apiClient.getPolls(status, sort);
      
      // Get detailed data for each poll
      const pollsWithDetails = await Promise.all(
        pollsData.map(async (poll) => {
          try {
            return await apiClient.getPoll(poll.id);
          } catch (error) {
            console.error(`Error loading poll ${poll.id}:`, error);
            return {
              ...poll,
              options: [],
              votes: [],
              likes: [],
              total_votes: 0,
              total_likes: 0,
            } as PollWithDetails;
          }
        })
      );
      
      setPolls(pollsWithDetails);
    } catch (error) {
      console.error('Error loading polls:', error);
      toast.error('Failed to load polls. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle WebSocket messages with real-time UI updates
  useEffect(() => {
    const handleWebSocketMessage = async (message: any) => {
      console.log('Received WebSocket message:', message);
      
      switch (message.type) {
        case 'poll_created':
          toast.success('🎉 New poll created!', {
            description: `"${message.poll?.title}" is now live`,
            duration: 4000,
          });
          // Add new poll to the list immediately
          if (message.poll) {
            // Fetch the full poll details to ensure it's a PollWithDetails object
            const newPollDetails = await apiClient.getPoll(message.poll.id);
            setPolls(prev => [newPollDetails, ...prev]);
          }
          break;
          
        case 'option_added':
          toast.info('📝 New option added!', {
            description: `Option added to poll ${message.poll_id}`,
            duration: 3000,
          });
          // Refresh polls to get updated options
          loadPolls(filterStatus, sortBy);
          break;
          
        case 'vote_cast':
          toast.info('🗳️ Someone voted!', {
            description: `New vote cast on poll ${message.poll_id}`,
            duration: 3000,
          });
          // Update poll data in real-time
          setPolls(prev => prev.map(poll => {
            if (poll.id === message.poll_id) {
              return { ...poll, total_votes: poll.total_votes + 1 };
            }
            return poll;
          }));
          break;
          
        case 'like_added':
          toast.info('❤️ Someone liked a poll!', {
            description: `Poll ${message.poll_id} received a like`,
            duration: 3000,
          });
          // Update like count in real-time
          setPolls(prev => prev.map(poll => {
            if (poll.id === message.poll_id) {
              return { ...poll, total_likes: poll.total_likes + 1 };
            }
            return poll;
          }));
          break;
          
        default:
          console.log('Unknown message type:', message.type);
      }
    };

    // Connect to WebSocket
    const connectWebSocket = async () => {
      try {
        await wsClient.connect();
        wsClient.addMessageHandler(handleWebSocketMessage);
        toast.success('Connected to real-time updates!');
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
        toast.error('Failed to connect to real-time updates');
      }
    };

    connectWebSocket();

    // Load initial data
    loadPolls(filterStatus, sortBy);

    // Cleanup on unmount
    return () => {
      wsClient.disconnect();
    };
  }, [filterStatus, sortBy]);

  const handleViewPoll = (pollId: number) => {
    setSelectedPollId(pollId);
    // Use Next.js router for faster navigation
    router.push(`/poll/${pollId}`);
  };

  const handleLikePoll = async (pollId: number) => {
    try {
      await apiClient.likePoll({ poll_id: pollId, user_id: userId });
      toast.success('Poll liked!');
    } catch (error) {
      console.error('Error liking poll:', error);
      toast.error('Failed to like poll');
    }
  };

  const handleCreatePoll = () => {
    setIsCreateModalOpen(true);
  };

  const handlePollCreated = () => {
    loadPolls(filterStatus, sortBy);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <Header onCreatePollClick={handleCreatePoll} />
      
      {/* Main Content */}
      <main id="polls-section" className="relative z-10">
        <PollList
          polls={polls}
          onViewPoll={handleViewPoll}
          onLike={handleLikePoll}
          onCreatePoll={handleCreatePoll}
                      onRefresh={() => loadPolls(filterStatus, sortBy)}
          userId={userId}
          isLoading={isLoading}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </main>

      {/* Create Poll Modal */}
      <CreatePollModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPollCreated={handlePollCreated}
      />

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white py-12 mt-16"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <h3 className="text-2xl font-bold mb-4">QuickPoll</h3>
            <p className="text-gray-100 mb-6 max-w-2xl mx-auto">
              Real-time opinion polling platform with instant updates. 
              Create polls, vote, and watch results update live across all connected users.
            </p>
            <div className="flex justify-center items-center gap-8 text-sm text-gray-400">
              <span>Built with Next.js & FastAPI</span>
              <span>•</span>
              <span>Real-time WebSocket updates</span>
            
            </div>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}