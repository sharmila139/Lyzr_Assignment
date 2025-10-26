'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { PollWithDetails } from '@/lib/api';
import PollCard from './PollCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Plus, 
  TrendingUp, 
  Clock, 
  Users,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface PollListProps {
  polls: PollWithDetails[];
  onViewPoll: (pollId: number) => void;
  onLike: (pollId: number) => void;
  onCreatePoll: () => void;
  onRefresh: (filterStatus: 'all' | 'active' | 'closed', sortBy: 'newest' | 'popular' | 'trending') => void;
  userId: string;
  isLoading?: boolean;
  filterStatus: 'all' | 'active';
  setFilterStatus: (status: 'all' | 'active') => void;
  sortBy: 'newest' | 'popular' | 'trending';
  setSortBy: (sort: 'newest' | 'popular' | 'trending') => void;
}

export default function PollList({ 
  polls, 
  onViewPoll, 
  onLike, 
  onCreatePoll, 
  onRefresh,
  userId,
  isLoading = false,
  filterStatus,
  setFilterStatus,
  sortBy,
  setSortBy,
}: PollListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPolls = polls
    .filter(poll => {
      const matchesSearch = poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (poll.description && poll.description.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Live Polls
            </h2>
            <p className="text-gray-600">
              Discover and participate in real-time opinion polls
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRefresh(filterStatus, sortBy)}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={onCreatePoll}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover-lift font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Poll
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search polls..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('all')}
            >
              All
            </Button>
            <Button
              variant={filterStatus === 'active' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('active')}
            >
              Active
            </Button>
            
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={sortBy === 'newest' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('newest')}
              className="flex items-center gap-1"
            >
              <Clock className="w-3 h-3" />
              Newest
            </Button>
            <Button
              variant={sortBy === 'popular' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('popular')}
              className="flex items-center gap-1"
            >
              <Users className="w-3 h-3" />
              Popular
            </Button>
            <Button
              variant={sortBy === 'trending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('trending')}
              className="flex items-center gap-1"
            >
              <TrendingUp className="w-3 h-3" />
              Trending
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
      >
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Polls</p>
              <p className="text-2xl font-bold">{polls.length}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Active Polls</p>
              <p className="text-2xl font-bold">
                {polls.filter(p => p.status === 'active').length}
              </p>
            </div>
            <Users className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Votes</p>
              <p className="text-2xl font-bold">
                {polls.reduce((sum, poll) => sum + poll.total_votes, 0)}
              </p>
            </div>
            <Clock className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </motion.div>

      {/* Polls Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="h-64 bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : filteredPolls.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredPolls.map((poll) => (
            <motion.div key={poll.id} variants={itemVariants}>
              <PollCard
                poll={poll}
                onViewPoll={onViewPoll}
                onLike={onLike}
                userId={userId}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No polls found
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Be the first to create a poll!'
            }
          </p>
          {(!searchTerm && filterStatus === 'all') && (
            <Button
              onClick={onCreatePoll}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Poll
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
}
