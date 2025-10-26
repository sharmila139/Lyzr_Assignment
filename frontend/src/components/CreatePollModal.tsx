'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  X, 
  Save, 
  Sparkles,
  BarChart3,
  Users
} from 'lucide-react';
import { toast } from 'sonner';
import { apiClient, CreatePollData, CreateOptionData } from '@/lib/api';

interface CreatePollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPollCreated: () => void;
}

export default function CreatePollModal({ isOpen, onClose, onPollCreated }: CreatePollModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset form state when modal is closed
      setTitle('');
      setDescription('');
      setOptions(['', '']);
    }
  }, [isOpen]);

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCreatePoll = async () => {
    if (!title.trim()) {
      toast.error('Please enter a poll title');
      return;
    }

    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      toast.error('Please add at least 2 options');
      return;
    }

    setIsCreating(true);

    try {
      // Create poll
      const pollData: CreatePollData = {
        title: title.trim(),
        description: description.trim() || undefined,
      };

      const poll = await apiClient.createPoll(pollData);

      // Add options
      for (const optionText of validOptions) {
        const optionData: CreateOptionData = {
          text: optionText.trim(),
          poll_id: poll.id,
        };
        await apiClient.addOption(optionData);
      }

      toast.success('Poll created successfully!');
      
      // Reset form
      setTitle('');
      setDescription('');
      setOptions(['', '']);
      
      onPollCreated();
      onClose();
    } catch (error) {
      console.error('Error creating poll:', error);
      toast.error('Failed to create poll. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className="pb-4">
                <DialogTitle className="flex items-center gap-2 text-2xl">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  Create New Poll
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Poll Title */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Poll Title *
                  </label>
                  <Input
                    placeholder="What's your favorite programming language?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-lg"
                    maxLength={100}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Make it engaging and clear</span>
                    <span>{title.length}/100</span>
                  </div>
                </div>

                {/* Poll Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Description (Optional)
                  </label>
                  <Textarea
                    placeholder="Add more context about your poll..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    maxLength={500}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Help people understand your poll better</span>
                    <span>{description.length}/500</span>
                  </div>
                </div>

                {/* Poll Options */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Poll Options *
                    </label>
                    <Badge variant="outline" className="text-xs">
                      {options.filter(opt => opt.trim()).length} options
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {options.map((option, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-2"
                      >
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                        <Input
                          placeholder={`Option ${index + 1}`}
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          className="flex-1"
                          maxLength={100}
                        />
                        {options.length > 2 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeOption(index)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {options.length < 10 && (
                    <Button
                      variant="outline"
                      onClick={addOption}
                      className="w-full border-dashed border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Option
                    </Button>
                  )}
                </div>

                {/* Preview */}
                {(title || description) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 rounded-lg p-4 space-y-3"
                  >
                    <h4 className="font-medium text-gray-700 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Preview
                    </h4>
                    <div className="bg-white rounded-lg p-4 border">
                      <h3 className="font-semibold text-lg mb-2">
                        {title || 'Your poll title...'}
                      </h3>
                      {description && (
                        <p className="text-gray-600 text-sm mb-3">
                          {description}
                        </p>
                      )}
                      <div className="space-y-2">
                        {options.filter(opt => opt.trim()).map((option, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                              {index + 1}
                            </div>
                            <span>{option || `Option ${index + 1}`}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    disabled={isCreating}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreatePoll}
                    disabled={isCreating || !title.trim() || options.filter(opt => opt.trim()).length < 2}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                  >
                    {isCreating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Create Poll
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
