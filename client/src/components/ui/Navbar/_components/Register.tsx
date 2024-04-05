import { Button } from '../../button';
import { UserPlus } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../tooltip';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Button
            variant="outline"
            className="border-none bg-transparent"
            size="icon"
          >
            <UserPlus
              onClick={() => navigate('/register')}
              className="size-5 hover:cursor-pointer"
            />
            <span className="sr-only">Register</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Register user
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Register;
