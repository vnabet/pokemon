import {inject, Injectable} from '@angular/core';
import {PageOptions} from '../models/page-options';
import {PokemonResult} from '../models/pokemon-result';
import {PokemonSpecies} from '../models/pokemon-species';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  readonly #http = inject(HttpClient);

  getSpecies(pageOptions: PageOptions) {
    return this.#http.get<PokemonResult<PokemonSpecies>>(`/pokemon?offset=${pageOptions.pageIndex * pageOptions.pageSize}&limit=${pageOptions.pageSize}`);
  }
}
