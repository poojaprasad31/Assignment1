import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.page.html',
  styleUrls: ['./receipt.page.scss'],
})
export class ReceiptPage implements OnInit {

	validation_messages: any;
	userDetailsForm: FormGroup;
	dataToDisplay: any;
	totalAmountToBePaid: number = 0;
	showEmailSpan: boolean = true
	showMobNumSpan: boolean = true

	constructor(private formBuilder: FormBuilder, public alertController: AlertController) {
		this.dataToDisplay = this.loadDataToDisplay(); // loads the data from json(same as the response we get from api call)
		this.validation_messages = this.loadValidationMessages();// loads the error message (for mobile number and email validation)
		this.getTotalAmountToBePaid(); 
	}

	ngOnInit() {
		// Form validations ( Validator Functions) for email and mobile number
		this.userDetailsForm = new FormGroup({
			emailid: new FormControl('', Validators.compose([
			                           Validators.required,
			                           Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])),
			mobNumber: new FormControl('', [Validators.required, 
	                                  Validators.minLength(10),
	                                  Validators.maxLength(10)])
		});
    }

    getTotalAmountToBePaid() {
    	// method written to get the total amount to be paid
    	this.totalAmountToBePaid = 0;
    	this.dataToDisplay.purchaseInfo.forEach((eachItem)=>{
    		this.totalAmountToBePaid = this.totalAmountToBePaid + ((eachItem.duration * eachItem.perHrCost * eachItem.quantity) - (eachItem.productDiscount))
    	})
    }

    toggleEmailSpan() {
    	this.showEmailSpan = !this.showEmailSpan;
    }

    toggleMobNumSpan() {
    	this.showMobNumSpan = !this.showMobNumSpan;
    } 

    deleteProduct(index) {
    	this.dataToDisplay.purchaseInfo.splice(index, 1);
    	this.getTotalAmountToBePaid();
    }

    // instead of declaring the whole json in the constructor i have written the methods 
    // which will return the json objects.
    // these can be written in the providers to reduce the number of lines in the components

    loadDataToDisplay() {
    	// sample json which i get when i cal the webservices
    	var response = {
			"responseCode": 101,
			"message": "Success",
			"data": {
				"userDetails": {
					"userName": "Abc",
					"mobNumber": 6545854566,
					"emailid": "abc@gmail.com",
					"address": "Bangalore",
					"purchaseInfo" : [{
						"productName": "Movers",
						"quantity": 3,
						"duration": 8.2,
						"perHrCost": 35,
						"productDiscount": 12
					},{
						"productName": "Clamp",
						"quantity": 4,
						"duration": 10,
						"perHrCost": 35,
						"productDiscount": 12
					}]
				}
			}
		}
		return response.data.userDetails;
    }

    loadValidationMessages() {
    	var messages = {
			"emailid": [{
	            "type": "required",
	            "message":"Email is required."
	          }, {
	            "type": "pattern",
	            "message":"Enter a valid email."
	        }],
	        "mobNumber": [{
	            "type": "required",
	            "message":"Mobile number is required."
	          }, {
	            "type": "minlength",
	            "message":"Mobile number must be at least 10 characters long."
	          }, {
	            "type": "maxlength",
	            "message":"Maximum length of this field is 10."
	        }]
	    }
	    return messages;
    }

    async presentAddProductPrompt() {
	    const alert = await this.alertController.create({
	      header: 'Add Product',
	      inputs: [
	        {
	          name: 'productName',
	          type: 'text',
	          placeholder: 'Enter Product Name',
	          value: '' 
	        },{
	          name: 'quantity',
	          type: 'number',
	          placeholder: 'Enter Quantity',
	          value: '' 
	        },{
	          name: 'duration',
	          type: 'number',
	          placeholder: 'Enter Duration used',
	          value: '' 
	        },{
	          name: 'perHrCost',
	          type: 'number',
	          placeholder: 'Enter Per Hour Cost',
	          value: '' 
	        },{
	          name: 'productDiscount',
	          type: 'number',
	          placeholder: 'Enter Product Discount',
	          value: '' 
	        }
	      ],
	      buttons: [
	        {
	          text: 'Cancel',
	          role: 'cancel',
	          cssClass: 'dark',
	          handler: () => {
	            console.log('Confirm Cancel');
	          }
	        }, {
	          text: 'Ok',
	          cssClass: 'dark',
	          handler: (dataToAdd) => {
	          	if(dataToAdd.productName != '' && dataToAdd.quantity != '' && dataToAdd.duration != '' && dataToAdd.perHrCost != '' && dataToAdd.productDiscount) {
	          		this.dataToDisplay.purchaseInfo.push(dataToAdd);
	            	this.getTotalAmountToBePaid();
	          	}
	            console.log(dataToAdd);
	          }
	        }
	      ]
	    });

	    await alert.present();
	}

}
 