import {Component, computed, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {toSignal} from '@angular/core/rxjs-interop';
import {PokemonSpecies} from './models/pokemon-species';
import {PokemonResult} from './models/pokemon-result';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly #httpClient = inject(HttpClient);

  protected pokemonSpeciesResult = toSignal(this.#httpClient.get<PokemonResult<PokemonSpecies>>('/pokemon-species'), {initialValue: {count: 0, next: null, previous: null, results: []}});
  protected pokemonSpecies = computed(() => this.pokemonSpeciesResult().results);
}
