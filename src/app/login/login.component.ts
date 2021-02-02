import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers: [MessageService]
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  lkBaseUrl = '/lab4-1.0/api/lk/';
  lkLoginUrl = this.lkBaseUrl + 'login';
  lkRegisterUrl = this.lkBaseUrl + 'register';

  errorResponse = 'failed';

  constructor(private router: Router,
              private http: HttpClient,
              private messageService: MessageService) {
    if (localStorage.getItem('key') !== null) {
      this.router.navigate(['admin']);
    }
  }


  ngOnInit(): void {
  }

  login(): void {
    this.http.post(this.lkLoginUrl, {
      username: this.username,
      password: this.password
    }).subscribe(data => {
      const resp: any = data;
      if (resp.status !== this.errorResponse) {
        localStorage.setItem('key', resp.key);
        this.router.navigate(['admin']);
      } else {
        var detail: string = resp.details;
        this.messageService.add({severity: 'error', summary: 'Error', detail});
      }
    }, error => this.messageService.add({severity: 'error', summary: 'Error', detail: 'Network error'}));
  }

  register(): void {
    this.http.post(this.lkRegisterUrl, {
      username: this.username,
      password: this.password
    }).subscribe((data) => {
      const resp: any = data;
      console.log(JSON.stringify(data));
      if (resp.status !== this.errorResponse) {
        localStorage.setItem('key', resp.key);
        this.router.navigate(['admin']);
      } else {
        var detail: string = resp.details;
        this.messageService.add({severity: 'error', summary: 'Error', detail: detail});
      }
    }, error => this.messageService.add({severity: 'error', summary: 'Error', detail: 'Network error'}));
  }

}
