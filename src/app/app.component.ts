import {Component, computed, inject, ResourceStatus, Signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {rxResource, toSignal} from '@angular/core/rxjs-interop';
import {PokemonSpecies} from './models/pokemon-species';
import {PokemonResult} from './models/pokemon-result';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {JsonPipe} from '@angular/common';

interface PageSizeOptions {
  length: number;
  pageSize: number;
  index: number;
  totalPages: number;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatTableModule, MatPaginatorModule, JsonPipe, MatPaginatorModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly #httpClient = inject(HttpClient);

  displayedColumns: string[] = ['name', 'url'];

  protected ressourceStatus = ResourceStatus;

  protected pokemonSpeciesRessource = rxResource({
    loader: () => this.#httpClient.get<PokemonResult<PokemonSpecies>>('/pokemon-species'),
  })

  //protected pokemonSpeciesResult = toSignal(this.#httpClient.get<PokemonResult<PokemonSpecies>>('/pokemon-species'), {initialValue: {count: 0, next: null, previous: null, results: []}});
  //protected pokemonSpecies = computed(() => this.pokemonSpeciesResult().results);
  protected pokemonSpecies = computed(() => this.pokemonSpeciesRessource.value()?.results || []);

  pageSizeOptions:Signal<PageSizeOptions> = computed(() => {
    const pokemonSpeciesResult = this.pokemonSpeciesRessource.value() || {count: 0, next: null, previous: null, results: []};
    return {length: pokemonSpeciesResult.count, pageSize: pokemonSpeciesResult.results.length, index: 1, totalPages: Math.ceil(pokemonSpeciesResult.count / pokemonSpeciesResult.results.length)};
  });

  pageEventHandler(page: PageEvent): void {
    console.log(page);

  }
}
