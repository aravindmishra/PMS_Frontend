import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { MedicineService } from '../services/medicine.service';
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'app-medicine-details-form',
  templateUrl: './medicine-details-form.component.html',
  styleUrls: ['./medicine-details-form.component.scss']
})
export class MedicineDetailsFormComponent implements OnInit {
  public URLs:any = "";
  public alreadyExsistName:boolean = false;
  public medicineName:string = "";
  constructor(public commonService:CommonService, private appConfig:AppConfig, public medicineService:MedicineService) { }

  ngOnInit(): void {
    this.URLs = this.appConfig.config;
    this.medicineService.getRackList();
    this.medicineService.medicineNameList = this.medicineService.medicineNameList.map(name => name.toLocaleLowerCase());
  }

 

  public cancel()
  {
    this.commonService.redirect("/medicine/list");
  }

  public checkMedicineNameExistorNot()
  {
    let name = this.medicineService.medicineForm.get("medicine_name").value;
    if(name)
    {
      name = name.toLocaleLowerCase();
      let check = this.medicineService.medicineNameList.some((element:string)=>element === name);
      this.alreadyExsistName = (check)?true:false;
    }
  }

  get f() { return this.medicineService.medicineForm.controls; }

  public onSubmit() {
    this.medicineService.submitted = true;

    // stop here if form is invalid
    if (this.medicineService.medicineForm.invalid) {
        return;
    }
    this.submitMedicine()
  }


  public submitMedicine()
  {
    let URL = (this.medicineService.submitState === "Save")? this.URLs.api.add_medicine : this.URLs.api.update_medicine + this.medicineService.updateId.toString();
    this.commonService.post(URL, this.medicineService.medicineForm.value).subscribe((response:any)=>{
      if(!response.error)
      {
        this.commonService.redirect("/medicine/list");
        let alertMsg = (this.medicineService.submitState === "Save")?"Data Inserted":"Data Updated";
        this.commonService.successMessage(alertMsg);
      }
    });
  }

}
