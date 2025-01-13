import {signalStore, withState} from '@ngrx/signals';
import {PokemonSpecies} from '../models/pokemon-species';

interface PokemonStoreState {
  species: PokemonSpecies[];
}

const initialState: PokemonStoreState = {
  species: []
}


export const PokemonsStore = signalStore(
  { providedIn: 'root'},
  withState(initialState)
)
