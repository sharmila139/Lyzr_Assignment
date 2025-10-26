'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Users, 
  BarChart3, 
  Clock, 
  ChevronRight,
  TrendingUp,
  MessageCircle
} from 'lucide-react';
import { PollWithDetails } from '@/lib/api';
import { useState } from 'react';

interface PollCardProps {
  poll: PollWithDetails;
  onViewPoll: (pollId: number) => void;
  onLike: (pollId: number) => void;
  userId: string;
}

export default function PollCard({ poll, onViewPoll, onLike, userId }: PollCardProps) {
  const [isLiked, setIsLiked] = useState(
    poll.likes.some(like => like.user_id === userId)
  );
  const [likeCount, setLikeCount] = useState(poll.total_likes);

  const handleLike = async () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);
    onLike(poll.id);
  };

  const handleViewPoll = () => {
    onViewPoll(poll.id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTotalVotes = () => {
    return poll.options.reduce((total, option) => total + (option.vote_count || 0), 0);
  };

  const getTopOption = () => {
    if (poll.options.length === 0) {
      return null; 
    }
    return poll.options.reduce((top, option) => 
      (option.vote_count || 0) > (top.vote_count || 0) ? option : top
    );
  };

  const totalVotes = getTotalVotes();
  const topOption = getTopOption();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="relative overflow-hidden hover-lift glass-effect border-0 shadow-lg">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-50" />
        
        <CardHeader className="relative z-10 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <motion.h3 
                className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                {poll.title}
              </motion.h3>
              {poll.description && (
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
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

          {/* Poll stats */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{totalVotes} votes</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{likeCount} likes</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatDate(poll.created_at)}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 pt-0">
          {/* Top option preview */}
          {poll.options.length > 0 && topOption && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Leading option
                </span>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>{topOption.vote_count || 0} votes</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 truncate flex-1 mr-2">
                    {topOption.text}
                  </span>
                  <span className="text-xs text-gray-500">
                    {totalVotes > 0 ? Math.round(((topOption.vote_count || 0) / totalVotes) * 100) : 0}%
                  </span>
                </div>
                <Progress 
                  value={totalVotes > 0 ? ((topOption.vote_count || 0) / totalVotes) * 100 : 0}
                  className="h-2"
                />
              </div>
            </div>
          )}

          {/* Options count */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <BarChart3 className="w-4 h-4" />
              <span>{poll.options.length} options</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MessageCircle className="w-4 h-4" />
              <span>{poll.total_votes} total votes</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between">
            <motion.div
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`flex items-center gap-2 ${
                  isLiked 
                    ? 'text-red-500 hover:text-red-600' 
                    : 'text-gray-500 hover:text-red-500'
                }`}
              >
                <Heart 
                  className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`}
                />
                <span>{likeCount}</span>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleViewPoll}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
              >
                View Poll
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>
          </div>
        </CardContent>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </Card>
    </motion.div>
  );
}
