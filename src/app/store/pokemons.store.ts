import {patchState, signalStore, type, withHooks, withMethods, withProps, withState} from '@ngrx/signals';
import {PokemonSpecies} from '../models/pokemon-species';
import {addEntity, removeAllEntities, SelectEntityId, setAllEntities, withEntities} from '@ngrx/signals/entities';
import {PageOptions} from '../models/page-options';
import {effect, inject, signal} from '@angular/core';
import {PokemonService} from '../services/pokemon.service';
import {rxResource} from '@angular/core/rxjs-interop';

interface PokemonStoreState {
  pageOption: PageOptions;
}

const initialState: PokemonStoreState = {
  pageOption: {pageSize: 25, pageIndex: 0},
}

const selectId: SelectEntityId<PokemonSpecies> = (pokemon) => pokemon.name;


export const PokemonsStore = signalStore(
  { providedIn: 'root'},
  withState(initialState),
  withEntities({ entity: type<PokemonSpecies>(), collection: 'species' }),
  withProps(() => ({
    _pokemonService: inject(PokemonService),
  })),
  withProps((store) => ({
    _pokemonSpeciesRessource: rxResource({
      request: store.pageOption,
      loader: ({request}) => store._pokemonService.getSpecies(request),
    })
  })),

  /*withMethods((store) => ({
    resetSpecies() {
      patchState(store, addEntity({name:'jlkjl', url:'jkjjjj'}, { selectId, collection: 'species' }));
    }
  })),*/
  withHooks({
    onInit(store) {
      effect(() => {
        const result = store._pokemonSpeciesRessource.value()?.results || [];
        if(result.length) {
          patchState(store, setAllEntities(result , {collection: 'species', selectId}));
        } else {
          patchState(store, removeAllEntities({collection: 'species'}));
        }
      });
    }
  })
)
