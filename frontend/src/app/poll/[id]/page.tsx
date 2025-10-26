'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Heart, 
  Users, 
  Clock, 
  BarChart3,
  CheckCircle,
  TrendingUp,
  Lock,
  Unlock
} from 'lucide-react';
import { PollWithDetails, apiClient } from '@/lib/api';
import { wsClient } from '@/lib/websocket';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';

export default function PollDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pollId = parseInt(params.id as string);
  
  const [poll, setPoll] = useState<PollWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userId] = useState(() => `user_${Math.random().toString(36).substr(2, 9)}`);

  const loadPoll = async () => {
    try {
      setIsLoading(true);
      const pollData = await apiClient.getPoll(pollId);
      setPoll(pollData);
      
      // Check if user already voted
      const userVote = pollData.votes.find(vote => vote.user_id === userId);
      if (userVote) {
        setSelectedOption(userVote.option_id);
      }
    } catch (error) {
      console.error('Error loading poll:', error);
      toast.error('Failed to load poll details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPoll();

    // Set up real-time updates
    const handleWebSocketMessage = (message: any) => {
      if (message.poll_id === pollId) {
        switch (message.type) {
          case 'vote_cast':
            toast.info('🗳️ Someone voted!');
            loadPoll(); // Refresh poll data
            break;
          case 'like_added':
            toast.info('❤️ Someone liked this poll!');
            loadPoll(); // Refresh poll data
            break;
        }
      }
    };

    wsClient.addMessageHandler(handleWebSocketMessage);

    return () => {
      // Cleanup handled by wsClient
    };
  }, [pollId]);

  const handleVote = async () => {
    if (!selectedOption || !poll) return;

    try {
      setIsVoting(true);
      await apiClient.vote({
        poll_id: poll.id,
        option_id: selectedOption,
        user_id: userId
      });
      
      toast.success('Vote cast successfully!');
      await loadPoll(); // Refresh to show updated results
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to cast vote');
    } finally {
      setIsVoting(false);
    }
  };

  const handleLike = async () => {
    if (!poll) return;

    try {
      await apiClient.likePoll({
        poll_id: poll.id,
        user_id: userId
      });
      
      toast.success('Poll liked!');
      await loadPoll(); // Refresh to show updated like count
    } catch (error) {
      console.error('Error liking poll:', error);
      toast.error('Failed to like poll');
    }
  };

  

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalVotes = () => {
    return poll?.options.reduce((total, option) => total + (option.vote_count || 0), 0) || 0;
  };

  const getOptionPercentage = (optionVotes: number) => {
    const total = getTotalVotes();
    return total > 0 ? Math.round((optionVotes / total) * 100) : 0;
  };

  const isUserLiked = () => {
    return poll?.likes.some(like => like.user_id === userId) || false;
  };

  const hasUserVoted = () => {
    return poll?.votes.some(vote => vote.user_id === userId) || false;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading poll details...</p>
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Poll Not Found</h1>
          <p className="text-gray-600 mb-6">The poll you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Polls
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="mb-4 hover-lift"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Polls
          </Button>
        </motion.div>

        {/* Poll Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="hover-lift glass-effect border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-3xl font-bold text-gray-900 mb-3">
                    {poll.title}
                  </CardTitle>
                  {poll.description && (
                    <p className="text-gray-600 text-lg leading-relaxed mb-4">
                      {poll.description}
                    </p>
                  )}
                </div>
                <Badge 
                  variant={poll.status === 'active' ? 'default' : 'secondary'}
                  className="ml-4 bg-green-100 text-green-800 hover:bg-green-200"
                >
                  {poll.status}
                </Badge>
              </div>

              {/* Poll Stats */}
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{getTotalVotes()} votes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{poll.total_likes} likes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(poll.created_at)}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              {/* Voting Section */}
              {poll.status === 'active' && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    {hasUserVoted() ? 'Your Vote' : 'Cast Your Vote'}
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    {poll.options.map((option) => (
                      <motion.div
                        key={option.id}
                        whileHover={{ scale: hasUserVoted() ? 1 : 1.02 }}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedOption === option.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${hasUserVoted() ? 'cursor-default' : 'cursor-pointer'}`}
                        onClick={() => {
                          if (!hasUserVoted()) {
                            setSelectedOption(option.id);
                          }
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              selectedOption === option.id
                                ? 'border-blue-500 bg-blue-500'
                                : 'border-gray-300'
                            }`}>
                              {selectedOption === option.id && (
                                <CheckCircle className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <span className="text-lg font-medium">{option.text}</span>
                          </div>
                          
                          {hasUserVoted() && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">
                                {option.vote_count || 0} votes
                              </span>
                              <div className="w-20">
                                <Progress 
                                  value={getOptionPercentage(option.vote_count || 0)}
                                  className="h-2"
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-700">
                                {getOptionPercentage(option.vote_count || 0)}%
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {!hasUserVoted() && (
                    <div className="space-y-3">
                      {!selectedOption && (
                        <p className="text-sm text-gray-500 text-center">
                          👆 Click on an option above to select it
                        </p>
                      )}
                      <Button
                        onClick={handleVote}
                        disabled={!selectedOption || isVoting}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isVoting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Casting Vote...
                          </>
                        ) : (
                          selectedOption ? 'Cast Vote' : 'Select an option first'
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <Separator className="my-6" />

              {/* Results Section */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Results
                </h3>
                
                <div className="space-y-4">
                  {poll.options.map((option) => (
                    <div key={option.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{option.text}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            {option.vote_count || 0} votes
                          </span>
                          <span className="text-sm font-medium text-gray-700">
                            {getOptionPercentage(option.vote_count || 0)}%
                          </span>
                        </div>
                      </div>
                      <Progress 
                        value={getOptionPercentage(option.vote_count || 0)}
                        className="h-3"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={handleLike}
                    className={`flex items-center gap-2 ${
                      isUserLiked() 
                        ? 'text-red-500 hover:text-red-600' 
                        : 'text-gray-500 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isUserLiked() ? 'fill-current' : ''}`} />
                    <span>{poll.total_likes}</span>
                  </Button>

                  
                </div>

                <div className="text-sm text-gray-500">
                  Poll ID: {poll.id}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
