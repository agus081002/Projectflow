"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Wand2 } from "lucide-react";
import { KanbanBoard, Column } from "@/components/kanban-board";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db } from "@/lib/firebase";
import { ref, onValue, remove, push, set, update } from "firebase/database";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { generateTasks } from "@/ai/flows/task-generator";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  dueDate: string;
  assignee: {
    name: string;
    avatarUrl?: string;
  };
  comments: number;
  attachments: number;
  status: "todo" | "in-progress" | "review" | "done";
}


const initialTaskState: Omit<Task, 'id'> = {
  title: "",
  description: "",
  priority: "Medium",
  dueDate: "",
  assignee: { name: "Unassigned" },
  comments: 0,
  attachments: 0,
  status: "todo",
};

export default function TasksPage() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [currentTask, setCurrentTask] = useState<Partial<Task> | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiGoal, setAiGoal] = useState("");

  useEffect(() => {
    const tasksRef = ref(db, "tasks");
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      const loadedTasks: Task[] = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];
      
      const newColumns: Column[] = [
        { id: "todo", title: "To Do", tasks: [] },
        { id: "in-progress", title: "In Progress", tasks: [] },
        { id: "review", title: "Review", tasks: [] },
        { id: "done", title: "Done", tasks: [] },
      ];

      loadedTasks.forEach((task) => {
        const column = newColumns.find((c) => c.id === task.status);
        if (column) {
          column.tasks.push(task);
        }
      });
      
      setColumns(newColumns);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleOpenNewTaskDialog = () => {
    setIsEditMode(false);
    setCurrentTask(initialTaskState);
    setIsDialogOpen(true);
  };
  
  const handleOpenEditTaskDialog = (task: Task) => {
    setIsEditMode(true);
    setCurrentTask(task);
    setIsDialogOpen(true);
  };
  
  const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (taskToDelete) {
      try {
        await remove(ref(db, `tasks/${taskToDelete.id}`));
        toast({ title: "Success", description: "Task deleted successfully." });
        setTaskToDelete(null);
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to delete task." });
      } finally {
        setIsDeleteDialogOpen(false);
      }
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setCurrentTask(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setCurrentTask(prev => ({ ...prev, [id]: value }));
  }

  const handleSaveTask = async () => {
    if (!currentTask || !currentTask.title) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please provide a title for the task.",
      });
      return;
    }

    try {
      if (isEditMode && currentTask.id) {
        const { id, ...taskData } = currentTask;
        await update(ref(db, `tasks/${id}`), taskData);
        toast({ title: "Success", description: "Task updated successfully." });
      } else {
        const newTaskRef = push(ref(db, 'tasks'));
        await set(newTaskRef, { ...currentTask, comments: 0, attachments: 0 });
        toast({ title: "Success", description: "Task created successfully." });
      }
      setIsDialogOpen(false);
      setCurrentTask(null);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: `Failed to ${isEditMode ? 'update' : 'create'} task.` });
    }
  };

  const handleGenerateTasks = async () => {
    if (!aiGoal.trim()) {
      toast({
        variant: "destructive",
        title: "Input Required",
        description: "Please describe the goal for the AI.",
      });
      return;
    }

    setIsAiLoading(true);

    try {
      const result = await generateTasks({ goal: aiGoal });
      
      const promises = result.tasks.map(task => {
        const newTaskRef = push(ref(db, 'tasks'));
        const fullTask: Omit<Task, 'id'> = {
            ...task,
            status: 'todo',
            dueDate: '',
            assignee: { name: "Unassigned" },
            comments: 0,
            attachments: 0,
        };
        return set(newTaskRef, fullTask);
      });

      await Promise.all(promises);

      toast({
        title: "Success!",
        description: `${result.tasks.length} tasks have been generated and added to your board.`,
      });

      setIsAiDialogOpen(false);
      setAiGoal("");

    } catch (error) {
      console.error("Failed to generate tasks:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "An error occurred while generating tasks. Please try again.",
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Organize your work with a Kanban board.
          </p>
        </div>
        <div className="flex items-center gap-2">
            <Button onClick={() => setIsAiDialogOpen(true)} variant="outline">
                <Wand2 className="mr-2 h-4 w-4" />
                Generate with AI
            </Button>
            <Button onClick={handleOpenNewTaskDialog}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Task
            </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col md:flex-row gap-6">
            <Skeleton className="w-full md:w-1/4 h-64" />
            <Skeleton className="w-full md:w-1/4 h-64" />
            <Skeleton className="w-full md:w-1/4 h-64" />
            <Skeleton className="w-full md:w-1/4 h-64" />
        </div>
      ) : (
        <KanbanBoard
          columns={columns}
          onEditTask={handleOpenEditTaskDialog}
          onDeleteTask={handleDeleteClick}
        />
      )}

      {/* New/Edit Task Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Task' : 'Create New Task'}</DialogTitle>
            <DialogDescription>
              {isEditMode ? 'Update the details of your task.' : 'Fill in the details below to create a new task.'}
            </DialogDescription>
          </DialogHeader>
          {currentTask && <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input id="title" placeholder="Task title" className="col-span-3" value={currentTask?.title || ''} onChange={handleInputChange} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea id="description" placeholder="Task description" className="col-span-3" value={currentTask?.description || ''} onChange={handleInputChange} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">Due Date</Label>
              <Input id="dueDate" type="date" className="col-span-3" value={currentTask?.dueDate || ''} onChange={handleInputChange} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">Priority</Label>
              <Select onValueChange={(value) => handleSelectChange('priority', value)} value={currentTask?.priority}>
                <SelectTrigger className="col-span-3"><SelectValue placeholder="Select priority" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Status</Label>
              <Select onValueChange={(value) => handleSelectChange('status', value)} value={currentTask?.status}>
                <SelectTrigger className="col-span-3"><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>}
          <DialogFooter>
            <Button type="submit" onClick={handleSaveTask}>{isEditMode ? 'Save Changes' : 'Create Task'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* AI Task Generation Dialog */}
      <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
              <DialogTitle>Generate Tasks with AI</DialogTitle>
              <DialogDescription>
              Describe a high-level goal or feature, and the AI will break it down into tasks for you.
              </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
              <Label htmlFor="ai-goal" className="sr-only">Goal Description</Label>
              <Textarea 
              id="ai-goal" 
              placeholder="e.g., 'Implement a user authentication system' or 'Design a new landing page'" 
              className="min-h-[100px]"
              value={aiGoal}
              onChange={(e) => setAiGoal(e.target.value)}
              disabled={isAiLoading}
              />
          </div>
          <DialogFooter>
              <Button type="button" onClick={handleGenerateTasks} disabled={isAiLoading}>
                  <Wand2 className="mr-2 h-4 w-4" />
                  {isAiLoading ? 'Generating...' : 'Generate Tasks'}
              </Button>
          </DialogFooter>
          </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task
              "{taskToDelete?.title}" from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTaskToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
