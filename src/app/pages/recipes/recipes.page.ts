import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { AlertController, RefresherCustomEvent, ToastController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';

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
    private toastController: ToastController,
    private menu: MenuController
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
  // Menü ist auf dieser Seite komplett deaktiviert
  ionViewWillEnter() {
    this.menu.enable(false);
  }

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
        placeholder: 'Titel',
        attributes: { maxlength: 30 }
      },
      {
        name: 'ingredients',
        placeholder: 'Ingredients (comma-separated)',
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
          const rawTitle = String(data?.title ?? '').trim();
          const rawIng   = String(data?.ingredients ?? '').trim();

          if (!rawTitle || !rawIng) {
            this.presentToast('Title and ingredients are required!');
            return false;
          }

          if (rawTitle.length > 30) {
            this.presentToast('Title: max. 30 characters allowed.');
            return false;
          }

          const ingredients = this.parseAndValidateIngredients(rawIng);
          if (ingredients === null) return false;

          const newRecipe = {
            title: rawTitle,
            ingredients
          };

          this.recipes.push(newRecipe);
          localStorage.setItem('recipes', JSON.stringify(this.recipes));
          this.presentToast('Recipe saved!');
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
        const rawTitle = String(data?.title ?? '').trim();
        const rawIng   = String(data?.ingredients ?? '').trim();

        if (!rawTitle || !rawIng) {
          this.presentToast('Title and ingredients required!');
          return false;
        }

        if (rawTitle.length > 30) {
          this.presentToast('Title: max. 30 characters allowed.');
          return false;
        }

        const ingredients = this.parseAndValidateIngredients(rawIng);
        if (ingredients === null) return false;

        recipe.title = rawTitle;
        recipe.ingredients = ingredients;

        localStorage.setItem('recipes', JSON.stringify(this.recipes));
        this.presentToast('Recipe updated.');
        return true;
      }
    }
    ]
  });

  await alert.present();
}

// Funktion die Hilft bei der Validierung der Eingaben der Zutaten
  private parseAndValidateIngredients(raw: string): string[] | null {
    // splitten, trimmen, leere Einträge entfernen
    const arr = raw.split(',').map(s => s.trim()).filter(s => s.length > 0);

    if (arr.length === 0) {
      this.presentToast('Please enter an ingredient.');
      return null;
    }

    for (const z of arr) {
      if (z.length > 30) {
        this.presentToast(`Ingredient too long: "${z.slice(0, 30)}" (max. 30 characters)`);
        return null;
      }
    }

    return arr;
  }


}