import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { AlertController, RefresherCustomEvent, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
})

export class RecipesPage implements OnInit {

  darkMode = false;
  kauflandMode = false;
  nibbsMode = false;

  constructor(private settings: SettingsService,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.settings.darkMode$.subscribe(dm => this.darkMode = dm);
    this.settings.kauflandMode$.subscribe(km => this.kauflandMode = km);
    this.settings.nibbsMode$.subscribe(nm => this.nibbsMode = nm);

    console.log('Dark Mode:', this.darkMode);
    console.log('Kaufland Mode:', this.kauflandMode);
    console.log('Nibbs Mode:', this.nibbsMode);

    const userRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
    this.recipes = JSON.parse(localStorage.getItem('recipes')) || [];
  }


recipes = [];

  //in Einkaufsliste hinzufügen
  addToShoppingList(ingredients: string[]) {
  const savedItems = JSON.parse(localStorage.getItem('items')) || [];

  const formattedIngredients = ingredients.map(ingredient =>
    this.insertLineBreaks(ingredient, 50)
  );

  const updated = [...savedItems, ...formattedIngredients];

  localStorage.setItem('items', JSON.stringify(updated));
  this.presentToast('Ingredients added!');
 
}

//neue Rezepte erstellen
  async addRecipes() {
  const cssClasses = ['customAltert'];

  if (this.darkMode) cssClasses.push('dark-mode-page');
  if (this.kauflandMode) cssClasses.push('kaufland-mode-page');

  const alert = await this.alertController.create({
    cssClass: cssClasses,
    header: 'Create new recipe',
    inputs: [
      {
        name: 'title',
        placeholder: 'Titel'
      },
      {
        name: 'ingredients',
        placeholder: 'Ingredients (comma-separated)'
      }
    ],
    buttons: [
      {
        text: 'cancel',
        role: 'cancel'
      },
      {
        text: 'save',
        handler: (data) => {
          if (!data.title || !data.ingredients) {
            this.presentToast('Titel und Zutaten sind erforderlich!');
            return false;
          }

          const newRecipe = {
            title: data.title,
            ingredients: data.ingredients.split(',').map((z: string) => z.trim())
          };

          this.recipes.push(newRecipe);
          localStorage.setItem('recipes', JSON.stringify(this.recipes));
          this.presentToast('Rezept gespeichert!');
          return true;
        }
      }
    ]
  });

  await alert.present();
}

async presentToast(msg: string) {
  const toast = await this.toastController.create({
    message: msg,
    duration: 1500,
    position: 'bottom'
  });
  await toast.present();
}

insertLineBreaks(text: string, interval: number): string {
  return text
    .match(new RegExp(`.{1,${interval}}`, 'g'))
    ?.join('<br>') || text;
}

deleteRecipe(recipe) {
  this.recipes = this.recipes.filter(r => r !== recipe);


  localStorage.setItem('recipes', JSON.stringify(this.recipes));
  this.presentToast(`Rezept "${recipe.title}" gelöscht.`);
}

async editRecipe(recipe) {

  const cssClasses = ['customAltert'];

  if (this.darkMode) cssClasses.push('dark-mode-page');
  if (this.kauflandMode) cssClasses.push('kaufland-mode-page');


  const alert = await this.alertController.create({
    header: 'edit recipe',
    cssClass: cssClasses,
    inputs: [
      {
        name: 'title',
        value: recipe.title,
        placeholder: 'Titel'
      },
      {
        name: 'ingredients',
        value: recipe.ingredients.join(', '),
        placeholder: 'ingredients (comma-separated)'
      }
    ],
    buttons: [
      {
        text: 'cancel',
        role: 'cancel'
      },
      {
        text: 'save',
        handler: (data) => {
          if (!data.title || !data.ingredients) {
            this.presentToast('Titel und Zutaten erforderlich!');
            return false;
          }

          recipe.title = data.title;
          recipe.description = data.description;
          recipe.ingredients = data.ingredients
            .split(',')
            .map((z: string) => z.trim());

          localStorage.setItem('recipes', JSON.stringify(this.recipes));
          this.presentToast('Rezept aktualisiert.');
          return true;
        }
      }
    ]
  });

  await alert.present();
}


}