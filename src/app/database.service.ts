import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const API_URL = '/33787778/Jordan/api/v1'; 

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};
  

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private authenticated: boolean = false;
  constructor(private http: HttpClient) { }

  // create driver
  //used any type 
  createDriver(driver: any) {
    return this.http.post(API_URL + '/drivers/add', driver, httpOptions);
  }

  // read driver

  getDriver() {
    return this.http.get(API_URL + '/drivers');
  }

  // update driver licence and department by id 
  updateDriver(driver: any) {
    return this.http.put(API_URL + '/drivers/update', driver, httpOptions);
  }

  // delete driver
  removeDriver(id: String) {
    return this.http.delete(API_URL + '/drivers/delete?id=' + id, httpOptions);
  }

  // create package

  createPackage(newPackage: any) {
    return this.http.post(API_URL + '/packages/add', newPackage, httpOptions)
  }

  // read package 

  getPackage() {
    return this.http.get(API_URL + '/packages');
  }

  // update package
  updatePackage(packageToUpdate: any) {
    return this.http.put(API_URL + "/packages/update", packageToUpdate, httpOptions)
  }

  // delete package
  removePackage(id: String) {
    return this.http.delete(API_URL + "/packages/delete/" + id,httpOptions)
  }

  // get stats

  getStats() {
    return this.http.get(API_URL + '/stats')
  }

  // login user 
  

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  setAuthenticated(value: boolean) {
    this.authenticated = value;
  }

  // login user 
  login(user: any) {
    return this.http.post(API_URL + '/login', user, httpOptions)
  }

  // signup user
  signup(user: any) {
    return this.http.post(API_URL + '/signup', user, httpOptions)
  }

}
