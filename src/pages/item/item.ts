import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, ActionSheetController, LoadingController, Platform} from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
  selector: 'page-item',
  templateUrl: 'item.html',
})
export class ItemPage {
  keywordItem:any;
  items:any;
  item_name: any;
  status_orderBy:any;
  temp_orderBy:any;

  constructor(public navCtrl: NavController, public alert: AlertController, public http: Http, public actionSheet: ActionSheetController, public loading: LoadingController, public platform: Platform) {
    // this.dataItems();
  }

  ionViewDidLoad() {
    this.presentLoadingDefault();
  }

  filterOrderBy(){
    this.status_orderBy = !this.status_orderBy;

    if(this.status_orderBy == true){
      this.temp_orderBy = 1;
      this.http.get("http://localhost/ionicposServer/public/api/v1/items/orderby/"+this.temp_orderBy)
      .map(res => res.json())
      .subscribe(data => {
        this.items = data;
      });
    }else{
      this.temp_orderBy = 2;
      this.http.get("http://localhost/ionicposServer/public/api/v1/items/orderby/"+this.temp_orderBy)
      .map(res => res.json())
      .subscribe(data => {
        this.items = data;
      });
    }  
  }

  dataItems(){
    this.http.get('http://localhost/ionicposServer/public/api/v1/items')
    .map(res => res.json())
    .subscribe(data => {
      this.items = data;
      console.log(data);
    });
  }

  presentLoadingDefault() {
    let loading = this.loading.create({
      content: 'Please wait...'
    });
  
    loading.present();
  
    setTimeout(() => {
      loading.dismiss();
      this.dataItems();
    }, 3000);
  }

  onKeywordItem(keywordItem){
    var q = keywordItem.target.value;

    if (q.trim() == '') {
      this.dataItems();
      return;
    }
    
    this.items = this.items.filter((v) => {
      if (v.item_name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        return true;
      }
        return false;
    });
  }

  selectedItem(id){
    var id = id;
    var item_code;
    var item_name;
    var price;

    this.http.get("http://localhost/ionicposServer/public/api/v1/items/show/"+id)
    .map(res => res.json())
    .subscribe(data => {
      item_code = data.item_code;
      item_name = data.item_name;
      price = data.price;
    });
    let actionSheet = this.actionSheet.create({
      title: 'Item',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            this.http.delete("http://localhost/ionicposServer/public/api/v1/items/destroy/"+id)
            .map(res => res.json())
            .subscribe(data => {
              console.log(data);
            });
            this.presentLoadingDefault();
          }
        },
        {
          text: 'Update',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'create' : null,
          handler: () => {
            let prompt = this.alert.create({
              title: 'Add item',
              message: "Enter the new item for the collection items",
              inputs: [
                {
                  name: 'item_code',
                  placeholder: 'Item Code',
                  value: item_code
                },
                {
                  name: 'item_name',
                  placeholder: 'Item Name',
                  value: item_name
                },
                {
                  name: 'price',
                  placeholder: 'Price',
                  type:'number',
                  value: price
                }
              ],
              buttons: [
                {
                  text: 'Cancel',
                  handler: data => {
                    console.log('Cancel clicked');
                  }
                },
                {
                  text: 'Save',
                  handler: data => {
                    console.log(data.item_code);
                    this.http.put("http://localhost/ionicposServer/public/api/v1/items/update", {'id' : id, 'item_code' : data.item_code, 'item_name' : data.item_name, 'price' : data.price})
                    .map(res => res.json())
                    .subscribe(data => {
                      console.log(data);
                    });
                    let alert = this.alert.create({
                      title: 'Item added!',
                      subTitle: 'The item added successful!',
                      buttons: ['OK']
                    });
                    this.presentLoadingDefault();
                    alert.present();
                  }
                }
              ]
            });
            prompt.present();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  addItem(){
    let prompt = this.alert.create({
      title: 'Add item',
      inputs: [
        {
          name: 'item_code',
          placeholder: 'Item Code'
        },
        {
          name: 'item_name',
          placeholder: 'Item Name'
        },
        {
          name: 'price',
          placeholder: 'Price',
          type:'number'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.http.post("http://localhost/ionicposServer/public/api/v1/items/insert", {'item_code' : data.item_code, 'item_name' : data.item_name, 'price' : data.price})
            .map(res => res.json())
            .subscribe(data => {
              console.log(data);
            });
            let alert = this.alert.create({
              title: 'Item added!',
              subTitle: 'The item added successful!',
              buttons: ['OK']
            });
            this.presentLoadingDefault();
            alert.present();
          }
        }
      ]
    });
    prompt.present();
  }
  
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
      this.dataItems();
    }, 2000);
  }
  
}