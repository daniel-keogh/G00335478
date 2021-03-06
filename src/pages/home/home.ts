import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SearchResultsPage } from '../search-results/search-results';
import { SearchHistoryProvider } from '../../providers/search-history/search-history';
import { ActionSheetController } from 'ionic-angular';

const HISTORY_TOGGLE_KEY: string = "Show Search History";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  searchHistory: Set<string> = new Set;
  saveHistory: boolean;

  constructor(public navCtrl: NavController, public storage: Storage, private searchHistoryProvider: SearchHistoryProvider, private actionSheetCtrl: ActionSheetController) {
  }

  ionViewDidLoad() {
    this.searchHistory = this.searchHistoryProvider.loadSearchHistory(); // retrieve search history from local storage
    
    // retrieve the setting of the toggle from storage
    this.storage.get(HISTORY_TOGGLE_KEY).then((option) => {
      this.saveHistory = (option == false) ? false : true;
    });
  }

  viewSearchResults(userInput : string) {
    // only leave if the search bar isn't empty
    if (userInput != "") {
      this.navCtrl.push(SearchResultsPage, {
        userInput : userInput.trim(),
        saveHistory : this.saveHistory
      });

      // save the item to search history if the toggle is switched on
      if (this.saveHistory)
        this.searchHistoryProvider.addItemToHistory(userInput);
    }
  }

  deleteHistoryItem(item: string) {
    this.searchHistoryProvider.deleteHistoryItem(item);
  }
  
  // displayed when long pressing on a history entry
  presentActionSheet(item: string) {
    const actionSheet = this.actionSheetCtrl.create({
      title: item,
      buttons: [
        {
          text: "Search for \""+ item + "\"",
          icon: "search",
          handler: () => {
            this.viewSearchResults(item);
          }
        },{
          text: "Delete \""+ item + "\"",
          role: "destructive",
          icon: "trash",
          handler: () => {
            this.deleteHistoryItem(item);
          }
        },{
          text: "Clear History",
          role: "destructive",
          icon: "nuclear",
          handler: () => {
            this.searchHistoryProvider.clearHistory();
          }
        },{
          text: "Cancel",
          role: "cancel",
          icon: "close"
        }
      ]
    });
    actionSheet.present();
  }

  updateSaveHistory() {
    this.storage.set(HISTORY_TOGGLE_KEY, this.saveHistory);
  }
}