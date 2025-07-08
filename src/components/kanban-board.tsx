"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, MessageSquare, Paperclip, MoreHorizontal } from "lucide-react";
import type { ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import type { Task } from "@/app/(app)/tasks/page";

export interface Column {
  id: "todo" | "in-progress" | "review" | "done";
  title: string;
  tasks: Task[];
}

const priorityColors = {
  Low: "bg-green-500",
  Medium: "bg-yellow-500",
  High: "bg-red-500",
};

const TaskCard = ({ task, onEdit, onDelete }: { task: Task; onEdit: (task: Task) => void; onDelete: (task: Task) => void; }) => (
  <Card className="mb-4 bg-card hover:shadow-md transition-shadow group">
    <CardContent className="p-4">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-sm pr-2">{task.title}</h4>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-6 w-6 p-0 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => onEdit(task)}>Edit</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onSelect={() => onDelete(task)}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Badge
        className={`text-white text-xs mb-3 ${
          priorityColors[task.priority]
        } hover:${priorityColors[task.priority]}`}
      >
        {task.priority}
      </Badge>
      {task.description && <p className="text-xs text-muted-foreground mb-3">{task.description}</p>}
      <div className="flex items-center justify-between text-muted-foreground">
        <div className="flex items-center gap-1 text-xs">
          <Clock className="h-3 w-3" />
          <span>{task.dueDate}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs">
            <MessageSquare className="h-3 w-3" /> {task.comments}
          </span>
          <span className="flex items-center gap-1 text-xs">
            <Paperclip className="h-3 w-3" /> {task.attachments}
          </span>
          <Avatar className="h-6 w-6">
            <AvatarImage src={task.assignee?.avatarUrl} />
            <AvatarFallback>{task.assignee?.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </CardContent>
  </Card>
);

const KanbanColumn = ({ title, children, taskCount }: { title: string; children: ReactNode, taskCount: number }) => (
  <div className="w-full md:w-1/4 flex-shrink-0">
    <div className="bg-muted rounded-lg min-h-[150px]">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-md flex items-center gap-2">
            {title}
            <Badge variant="secondary" className="rounded-full">{taskCount}</Badge>
        </h3>
      </div>
      <div className="p-4 overflow-y-auto">{children}</div>
    </div>
  </div>
);

interface KanbanBoardProps {
  columns: Column[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

export function KanbanBoard({ columns, onEditTask, onDeleteTask }: KanbanBoardProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      {columns.map((col) => (
        <KanbanColumn key={col.id} title={col.title} taskCount={col.tasks.length}>
          {col.tasks.length > 0 ? col.tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
          )) : <p className="text-sm text-muted-foreground text-center pt-4">No tasks in this column.</p>}
        </KanbanColumn>
      ))}
    </div>
  );
}
