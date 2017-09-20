import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  keywordItem:any;
  items:any;
  resetItems: any;

  constructor(public navCtrl: NavController) {
    this.dataItems();
  }

  onKeywordItem(keywordItem){
    console.log(this.keywordItem);

    this.dataItems();
    
    var q = keywordItem.target.value;
    
        // if the value is an empty string don't filter the items
        if (q.trim() == '') {
            return;
        }
    
        this.items = this.items.filter((v) => {
            if (v.toLowerCase().indexOf(q.toLowerCase()) > -1) {
                return true;
            }
            return false;
        });
  }

  dataItems(){
    this.items = [
      'Pokémon Yellow',
      'Super Metroid',
      'Mega Man X',
      'The Legend of Zelda',
      'Pac-Man',
      'Super Mario World',
      'Street Fighter II',
      'Half Life',
      'Final Fantasy VII',
      'Star Fox',
      'Tetris',
      'Donkey Kong III',
      'GoldenEye 007',
      'Doom',
      'Fallout',
      'GTA',
      'Halo'
    ];
  }

  resetitem(){
    this.resetItems = [
      'Pokémon Yellow',
      'Super Metroid',
      'Mega Man X',
      'The Legend of Zelda',
      'Pac-Man',
      'Super Mario World',
      'Street Fighter II',
      'Half Life',
      'Final Fantasy VII',
      'Star Fox',
      'Tetris',
      'Donkey Kong III',
      'GoldenEye 007',
      'Doom',
      'Fallout',
      'GTA',
      'Halo'
    ];
  }

}
