export interface Activity {
  id: string;
  taskId: string;
  taskTitle: string;
  userName: string;
  type: 'created' | 'updated' | 'completed' | 'deleted';
  timestamp: string;
}
