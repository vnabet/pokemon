import {Component, computed, inject, ResourceStatus, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {rxResource} from '@angular/core/rxjs-interop';
import {PokemonSpecies} from './models/pokemon-species';
import {PokemonResult} from './models/pokemon-result';
import {PageOptions} from './models/page-options';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';

// offset, limit

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatTableModule, MatPaginatorModule, MatPaginatorModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly #httpClient = inject(HttpClient);

  displayedColumns: string[] = ['name', 'url'];

  // Pour avoir l'énuméré ResourceStatus dans le template
  protected ressourceStatus = ResourceStatus;

  // Page courante
  protected pageOptions = signal<PageOptions>({pageSize: 25, pageIndex: 0});

  // Ressource pour récupérer les pokemons
  protected pokemonSpeciesRessource = rxResource({
    request: this.pageOptions,
    loader: ({request}) => {
      const offset = request.pageIndex * request.pageSize;
      const limit = request.pageSize;
      return this.#httpClient.get<PokemonResult<PokemonSpecies>>(`/pokemon?offset=${offset}&limit=${limit}`);
    },
  })

  // Nombre total de pokemons
  #length = 0;
  protected length = computed<number>(() => {
    this.#length =  this.pokemonSpeciesRessource.status() === ResourceStatus.Resolved?(this.pokemonSpeciesRessource.value()?.count??0):this.#length;
    return this.#length;
  })

  // Liste des pokemons
  #pokemonSpecies:PokemonSpecies[] = [];
  protected pokemonSpecies = computed(() => {
    this.#pokemonSpecies =  this.pokemonSpeciesRessource.status() === ResourceStatus.Resolved?(this.pokemonSpeciesRessource.value()?.results??[]):this.#pokemonSpecies;
    return this.#pokemonSpecies;
  });

  // Gestionnaire de changement de page
  pageEventHandler(page: PageEvent): void {
    // Mise à jour de la page courante
    // Cela va déclencher le rechargement de la ressource
    this.pageOptions.update((prevState) => ({...prevState, pageSize: page.pageSize, pageIndex: page.pageIndex}));
  }

}
