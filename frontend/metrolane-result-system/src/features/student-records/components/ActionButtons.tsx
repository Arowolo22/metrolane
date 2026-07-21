import { Eye, Pencil, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ActionButtonsProps {
  onView: () => void
  onEdit: () => void
  onPrint: () => void
}

export function ActionButtons({ onView, onEdit, onPrint }: ActionButtonsProps) {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-orange-600 hover:bg-orange-50"
              onClick={onView}
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">View</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>View Record</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-orange-600 hover:bg-orange-50"
              onClick={onEdit}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Edit Record</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-orange-600 hover:bg-orange-50"
              onClick={onPrint}
            >
              <Printer className="h-4 w-4" />
              <span className="sr-only">Print</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Print Result</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
