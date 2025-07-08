"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Activity, CheckCircle, Clock, FolderGit2 } from "lucide-react";

const projectStats = [
  { title: "Active Projects", value: "12", icon: FolderGit2, change: "+2 this month" },
  { title: "Tasks Completed", value: "348", icon: CheckCircle, change: "+40 this week" },
  { title: "Hours Logged", value: "1,204", icon: Clock, change: "+80 this week" },
  { title: "Overall Progress", value: "75%", icon: Activity, change: "+5% this week" },
];

const taskStatusData = [
  { name: 'To-do', count: 45 },
  { name: 'In Progress', count: 32 },
  { name: 'Review', count: 18 },
  { name: 'Done', count: 150 },
];

const recentProjects = [
    { name: "E-commerce Platform", status: "In Progress", progress: 60, deadline: "2024-12-31" },
    { name: "Mobile App Redesign", status: "Planning", progress: 25, deadline: "2025-02-15" },
    { name: "Data Migration", status: "Completed", progress: 100, deadline: "2024-07-20" },
    { name: "API Integration", status: "Executing", progress: 75, deadline: "2024-10-01" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's a summary of your projects.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {projectStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Task Status Overview</CardTitle>
            <CardDescription>A breakdown of tasks by their current status.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taskStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>A quick look at your most recent projects.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Project Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Deadline</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentProjects.map((project) => (
                        <TableRow key={project.name}>
                            <TableCell className="font-medium">{project.name}</TableCell>
                            <TableCell>
                                <Badge variant={project.status === 'Completed' ? 'default' : 'secondary'}>{project.status}</Badge>
                            </TableCell>
                            <TableCell>{project.deadline}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
