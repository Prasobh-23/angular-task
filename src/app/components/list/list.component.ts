import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  storedTasks: Task[] = [];
  editForm: FormGroup;
  editingTask: Task | null = null;
  deletingTask: Task | null = null;

  @ViewChild('editFormContainer') editFormContainer: ElementRef | undefined;

  constructor(private fb: FormBuilder) {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    this.getTasks();
  }

  getTasks() {
    const tasks = localStorage.getItem('tasks');
    if (tasks) {
      this.storedTasks = JSON.parse(tasks);
    } else {
      this.storedTasks = [];
    }
  }

  editTask(task: Task) {
    this.editingTask = task;
    this.editForm.patchValue({
      title: task.title,
      description: task.description,
      status: task.status
    });

    // Scroll to the bottom where the edit form is
    if (this.editFormContainer) {
      this.editFormContainer.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }

  updateTask() {
    if (this.editingTask && this.editForm.valid) {
      const updatedTask = {
        ...this.editingTask,
        ...this.editForm.value
      };

      const taskIndex = this.storedTasks.findIndex(task => task.id === this.editingTask!.id);
      if (taskIndex !== -1) {
        this.storedTasks[taskIndex] = updatedTask;
        localStorage.setItem('tasks', JSON.stringify(this.storedTasks));
        this.editingTask = null;
        this.editForm.reset();
      }
    }
  }

  deleteTask(task: Task) {
    const tasks = localStorage.getItem('tasks');
    if (tasks) {
      const parsedTasks: Task[] = JSON.parse(tasks);
      const index = parsedTasks.findIndex(t => t.id === task.id);

      if (index !== -1) {
        parsedTasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(parsedTasks));
        this.storedTasks = parsedTasks;
      }
    }
  }

}
