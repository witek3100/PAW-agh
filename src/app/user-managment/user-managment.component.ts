import {Component, OnInit} from '@angular/core';
import {UserData} from "../user.model";
import {UserService} from "../user.service";
import {user} from "@angular/fire/auth";

@Component({
  selector: 'app-user-managment',
  templateUrl: './user-managment.component.html',
  styleUrls: ['./user-managment.component.css']
})
export class UserManagmentComponent implements OnInit {

  users: UserData[] = [];

  constructor(private usersService: UserService) {}

  ngOnInit(): void {
    this.loadUsers()
  }

  loadUsers(): void {
    this.usersService.getUsers().subscribe(users => {
      users.forEach(user => {
        this.users.push(user)
      });
    });
  }


  editManager(userId: string| undefined, manager: boolean): void {
    if (userId) {
      const updatedUser: Partial<UserData> = {
        IsManager: manager,
      };
      this.usersService.updateUser(userId, updatedUser).then(() => {
        window.location.reload()
      })
    }
  }

  editAdmin(userId: string| undefined, admin: boolean): void {
    if (userId) {
      const updatedUser: Partial<UserData> = {
        IsAdmin: admin,
      };
      this.usersService.updateUser(userId, updatedUser).then(() => {
        window.location.reload()
      })
    }
  }

  unBanUser(userId: string| undefined): void {
    if (userId) {
        const updatedUser: Partial<UserData> = {
          IsVerified: true,
        };
        this.usersService.updateUser(userId, updatedUser).then(() => {
          window.location.reload()
        })
    }
  }

  banUser(userId: string | undefined): void {
    if (userId) {
      if (confirm('Are you aure you want to ban this user?')) {
        const updatedUser: Partial<UserData> = {
          IsVerified: false,
        };
        this.usersService.updateUser(userId, updatedUser).then(() => {
          window.location.reload()
        })
      }
    }
  }

  deleteUser(userId: string | undefined): void {
    if (userId){
        if (confirm('Are you sure you want to delete this user?')) {
          this.usersService.deleteUser(userId).then(() => {
            this.loadUsers();
          });
      }
    }
  }

}
