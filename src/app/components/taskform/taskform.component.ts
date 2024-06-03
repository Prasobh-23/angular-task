import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Task } from '../../models/task.model';

let storedTasks: any;

@Component({
  selector: 'app-taskform',
  templateUrl: './taskform.component.html',
  styleUrls: ['./taskform.component.css']
})

export class TaskformComponent implements OnInit {

  taskform = this.fb.group({
    "title": ['', Validators.required],
    "description": ['', Validators.required]
  })

  ngOnInit(): void {
    storedTasks = localStorage.getItem('tasks');
  }

  constructor(private fb: FormBuilder, private router: Router) { }

  submitTask() {
    if (this.taskform.invalid) {
      return
    } else {

      const newTask = new Task(
        Date.now(),
        this.taskform.value.title,
        this.taskform.value.description,
        false
      );

      // Retrieve existing data from local storage
      storedTasks = localStorage.getItem('tasks');
      let tasks: Task[] = storedTasks ? JSON.parse(storedTasks) : [];

      // Append the new data
      tasks.push(newTask);

      // Save updated data back to local storage
      localStorage.setItem('tasks', JSON.stringify(tasks));

      this.taskform.reset();
      this.router.navigate(['/']);
    }
  }

  goToTask() {
    this.router.navigate(['/']);
  }

  //form validation
  isFieldInvalid(fieldName: string): boolean {
    const formControl = this.taskform.get(fieldName);
    return formControl?.invalid ?? false;
  }

  isFieldTouched(fieldName: string): boolean {
    const formControl = this.taskform.get(fieldName);
    return formControl?.touched ?? false;
  }

}
