import { Users } from 'lucide-react';
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
          <div className="flex items-center justify-center rounded-sm p-3 hover:bg-muted">
            <Users
              onClick={() => {
                setDashboard(true);
              }}
              className="size-4 hover:cursor-pointer"
            />
            <span className="sr-only">Manage users</span>
          </div>
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
