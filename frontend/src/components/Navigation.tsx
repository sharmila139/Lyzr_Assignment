'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Home, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const router = useRouter();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 right-4 z-50"
    >
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/')}
          className="glass-effect backdrop-blur-sm"
        >
          <Home className="w-4 h-4 mr-2" />
          Home
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/')}
          className="glass-effect backdrop-blur-sm"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Polls
        </Button>
      </div>
    </motion.nav>
  );
}
