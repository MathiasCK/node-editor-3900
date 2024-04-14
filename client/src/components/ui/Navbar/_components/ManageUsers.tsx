import { Users } from 'lucide-react';
import { Button } from '../../button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../tooltip';
import { useSession } from '@/hooks';

const ManageUsers = () => {
  const { setDashboard } = useSession();
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Button
            variant="outline"
            className="border-none bg-transparent"
            size="icon"
          >
            <Users
              onClick={() => {
                setDashboard(true);
              }}
              className="size-4 hover:cursor-pointer"
            />
            <span className="sr-only">Manage users</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Manage users
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ManageUsers;
