import {Component, computed, inject, Signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {toSignal} from '@angular/core/rxjs-interop';
import {PokemonSpecies} from './models/pokemon-species';
import {PokemonResult} from './models/pokemon-result';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';

interface PageSizeOptions {
  length: number;
  pageSize: number;
  index: number;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatTableModule, MatPaginatorModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly #httpClient = inject(HttpClient);

  displayedColumns: string[] = ['name', 'url'];
  protected pokemonSpeciesResult = toSignal(this.#httpClient.get<PokemonResult<PokemonSpecies>>('/pokemon-species'), {initialValue: {count: 0, next: null, previous: null, results: []}});
  protected pokemonSpecies = computed(() => this.pokemonSpeciesResult().results);

  pageSizeOptions:Signal<PageSizeOptions> = computed(() => {
    const pokemonSpeciesResult = this.pokemonSpeciesResult();
    return {length: pokemonSpeciesResult.count, pageSize: pokemonSpeciesResult.results.length, index: 1};
  });

}
